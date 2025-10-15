import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ScanIcon } from './icons/ScanIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { FolderIcon } from './icons/FolderIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { RealTimeIcon } from './icons/RealTimeIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ScanType, ScanStatus, DetectedThreat, QuarantinedFile } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const ThreatAnalysisModal: React.FC<{ threat: DetectedThreat, analysis: string, isLoading: boolean, onClose: () => void }> = ({ threat, analysis, isLoading, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-2xl w-full animate-fade-in text-sm">
                <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-4">
                    <SparklesIcon className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                    <h2 className="text-xl font-bold text-blue-300">AI Threat Analysis Report</h2>
                    <p className="font-mono text-blue-400/80 mt-1">{threat.name}</p>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {isLoading ? (
                         <div className="flex items-center justify-center p-8">
                            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                         </div>
                    ) : (
                        <div className="whitespace-pre-wrap text-gray-300" dangerouslySetInnerHTML={{ __html: analysis.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-100">$1</strong>') }} />
                    )}
                </div>
                <div className="text-right mt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">Close Report</button>
                </div>
            </div>
        </div>
    )
}

const ScanButton: React.FC<{ icon: React.FC<any>, title: string, description: string, onClick: () => void, disabled: boolean }> = ({ icon: Icon, title, description, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex flex-col items-center text-center hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-full">
        <Icon className="w-12 h-12 mb-3 text-blue-400" />
        <h3 className="text-xl font-bold text-gray-200">{title}</h3>
        <p className="text-gray-400 text-sm mt-1 flex-grow">{description}</p>
    </button>
);

const Antivirus: React.FC = () => {
    const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
    const [scanProgress, setScanProgress] = useState(0);
    const [detectedThreats, setDetectedThreats] = useState<DetectedThreat[]>([]);
    const [quarantinedFiles, setQuarantinedFiles] = useState<QuarantinedFile[]>([]);
    const [currentScan, setCurrentScan] = useState<ScanType | null>(null);
    const [realtimeLog, setRealtimeLog] = useState<string[]>(['Real-time protection initialized.']);
    const [showAiReport, setShowAiReport] = useState(false);
    const [selectedThreatForAnalysis, setSelectedThreatForAnalysis] = useState<DetectedThreat | null>(null);
    
    // Simulate real-time scanning log with AI messages
    useEffect(() => {
        const interval = setInterval(() => {
            const paths = ['System32', 'Program Files', 'Users\\Admin\\AppData', 'Downloads'];
            const files = ['svchost.exe', 'kernel32.dll', 'runtime.dll', 'installer.exe'];
            const aiMessages = [
                "AI: Monitored 'svchost.exe' for anomalous network activity. All clear.",
                "AI: Heuristically analyzed script behavior in browser cache.",
                "AI: Flagged 'temp_installer.exe' for suspicious behavior. Analyzing in sandbox."
            ];
            
            let newLine;
            if (Math.random() < 0.2) { // 20% chance of an AI message
                newLine = aiMessages[Math.floor(Math.random()*aiMessages.length)];
            } else {
                const randomFile = `C:\\Windows\\${paths[Math.floor(Math.random()*paths.length)]}\\${files[Math.floor(Math.random()*files.length)]}`;
                newLine = `OK: ${randomFile}`;
            }
            setRealtimeLog(prev => [ newLine, ...prev.slice(0, 4)]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const startScan = (type: ScanType) => {
        setScanStatus('scanning');
        setScanProgress(0);
        setDetectedThreats([]);
        setCurrentScan(type);

        const scanDuration = type === 'quick' ? 3000 : type === 'smart' ? 5000 : 8000;
        const interval = setInterval(() => {
            setScanProgress(prev => {
                const newProgress = prev + 100 / (scanDuration / 100);
                if (newProgress >= 100) {
                    clearInterval(interval);
                    const threats: DetectedThreat[] = [
                        { id: 1, name: 'Trojan.Generic.KD', severity: 'High', filePath: 'C:\\Users\\Admin\\Downloads\\cracked_software.exe', aiStatus: 'idle' },
                        { id: 2, name: 'Adware.Win32.InstallCore', severity: 'Medium', filePath: 'C:\\Users\\Admin\\AppData\\Local\\Temp\\installer.tmp', aiStatus: 'idle' },
                    ];
                    if (type === 'full') {
                        threats.push({ id: 3, name: 'PUP.Optional.Legacy', severity: 'Low', filePath: 'C:\\Program Files (x86)\\OldToolbar\\toolbar.dll', aiStatus: 'idle' });
                    }
                    if (type === 'smart') {
                        threats.push({ id: 4, name: 'Suspicious Behavior Detected', severity: 'Medium', filePath: 'C:\\Users\\Admin\\AppData\\run.exe', isAiFinding: true, aiStatus: 'idle' });
                    }
                    
                    if (Math.random() > 0.3 || type === 'smart') {
                        setDetectedThreats(threats.slice(0, type === 'quick' ? 2 : type === 'smart' ? 3 : 3));
                        setScanStatus('results');
                    } else {
                        setScanStatus('complete_clean');
                    }
                    return 100;
                }
                return newProgress;
            });
        }, 100);
    };

    const handleThreatAnalysis = async (threat: DetectedThreat) => {
        setSelectedThreatForAnalysis({ ...threat, aiStatus: 'analyzing' });
        setShowAiReport(true);

        // Update the specific threat in the main list to show loading state on the button
        setDetectedThreats(prev => prev.map(t => t.id === threat.id ? { ...t, aiStatus: 'analyzing' } : t));

        try {
            const prompt = `You are a cybersecurity expert. Provide a detailed but easy-to-understand analysis of the threat named "${threat.name}". For 'Suspicious Behavior Detected', explain what kind of behaviors are risky. Include the following sections formatted with markdown (using ** for bold titles):
**What is it?**: (e.g., Trojan, Adware, Suspicious Behavior etc.)
**What does it do?**: (e.g., steals data, shows ads, makes unauthorized connections)
**Recommended Action**: (e.g., Quarantine immediately, Investigate further)
**Prevention Tips**: (e.g., Avoid untrusted downloads, keep software updated)`;
            
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            
            const analysisText = response.text;
            
            // Update the threat with the analysis result
            setDetectedThreats(prev => prev.map(t => t.id === threat.id ? { ...t, aiAnalysis: analysisText, aiStatus: 'idle' } : t));
            setSelectedThreatForAnalysis(prev => prev ? { ...prev, aiAnalysis: analysisText, aiStatus: 'idle' } : null);

        } catch (error) {
            console.error("AI Threat Analysis failed:", error);
            const errorText = "Sorry, I couldn't analyze this threat at the moment. Please check your connection or API key and try again.";
            setDetectedThreats(prev => prev.map(t => t.id === threat.id ? { ...t, aiAnalysis: errorText, aiStatus: 'idle' } : t));
            setSelectedThreatForAnalysis(prev => prev ? { ...prev, aiAnalysis: errorText, aiStatus: 'idle' } : null);
        }
    };


    const handleQuarantine = (threatId: number) => {
        const threat = detectedThreats.find(t => t.id === threatId);
        if (threat) {
            setQuarantinedFiles(prev => [{
                id: Date.now(),
                name: threat.name,
                originalPath: threat.filePath,
                dateQuarantined: new Date().toLocaleString()
            }, ...prev]);
            setDetectedThreats(prev => prev.filter(t => t.id !== threatId));
        }
    };
    
    const handleIgnore = (threatId: number) => {
         setDetectedThreats(prev => prev.filter(t => t.id !== threatId));
    };

    const handleDelete = (threatId: number) => {
        setDetectedThreats(prev => prev.filter(t => t.id !== threatId));
    };

    const finishScan = () => {
        setScanStatus('idle');
        setScanProgress(0);
        setDetectedThreats([]);
        setCurrentScan(null);
    };

    const groupedThreats = useMemo(() => {
        return detectedThreats.reduce((acc, threat) => {
            const severity = threat.severity;
            if (!acc[severity]) {
                acc[severity] = [];
            }
            acc[severity].push(threat);
            return acc;
        }, {} as Record<DetectedThreat['severity'], DetectedThreat[]>);
    }, [detectedThreats]);
    
    const severityOrder: DetectedThreat['severity'][] = ['High', 'Medium', 'Low'];

    const isScanning = scanStatus === 'scanning';

    return (
        <div className="animate-fade-in space-y-8">
             {showAiReport && selectedThreatForAnalysis && (
                <ThreatAnalysisModal 
                    threat={selectedThreatForAnalysis} 
                    analysis={selectedThreatForAnalysis.aiAnalysis || ""} 
                    isLoading={selectedThreatForAnalysis.aiStatus === 'analyzing'}
                    onClose={() => setShowAiReport(false)} 
                />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-200 flex items-center"><RealTimeIcon className="w-6 h-6 mr-3"/>Real-Time Protection</h2>
                        <span className="font-semibold text-green-400">ACTIVE</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">Your device is actively being protected against threats as you work.</p>
                    <div className="bg-gray-900/50 p-3 rounded-md font-mono text-xs text-gray-500 h-28 overflow-hidden">
                        {realtimeLog.map((line, i) => <p key={i} className={`animate-fade-in-fast ${line.startsWith("AI:") ? 'text-blue-400' : ''}`}>{line}</p>)}
                    </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                    <h2 className="text-xl font-bold text-gray-200 mb-4">Manual Scans</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                         <ScanButton icon={ScanIcon} title="Quick Scan" description="Check common areas." onClick={() => startScan('quick')} disabled={isScanning} />
                         <ScanButton icon={ShieldIcon} title="Full Scan" description="Check your entire system." onClick={() => startScan('full')} disabled={isScanning} />
                         <ScanButton icon={SparklesIcon} title="Smart Scan" description="Use AI to find elusive threats." onClick={() => startScan('smart')} disabled={isScanning} />
                         <ScanButton icon={FolderIcon} title="Custom Scan" description="Scan specific folders." onClick={() => alert('Custom scan not implemented.')} disabled={isScanning} />
                    </div>
                </div>
            </div>

            {scanStatus === 'scanning' && (
                <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 text-center">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4">
                        {currentScan === 'quick' ? 'Running Quick Scan...' : currentScan === 'smart' ? 'Running AI Smart Scan...' : 'Running Full Scan...'}
                    </h3>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                        <div className="bg-blue-600 h-4 rounded-full transition-all duration-200" style={{ width: `${scanProgress}%` }}></div>
                    </div>
                    <p className="text-gray-400 mt-2">{scanProgress.toFixed(0)}% Complete</p>
                    <p className="text-yellow-400 mt-4 font-mono text-sm">
                        {currentScan === 'smart' ? 'AI: Analyzing system behavior...' : 'Currently scanning: C:\\Windows\\System32\\drivers...'}
                    </p>
                </div>
            )}
            
             {scanStatus === 'results' && (
                <div className="bg-red-900/20 p-6 rounded-xl border border-red-500/30">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-red-300 flex items-center"><AlertTriangleIcon className="w-6 h-6 mr-3"/>Scan Complete: Action Required</h3>
                            <p className="text-red-400/80">The following threats were detected on your system.</p>
                        </div>
                         <button onClick={detectedThreats.length === 0 ? finishScan : () => alert('Please resolve all threats first.')} className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm" disabled={detectedThreats.length > 0}>Done</button>
                    </div>
                     <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {severityOrder.map(severity => (
                            groupedThreats[severity] && groupedThreats[severity].length > 0 && (
                                <div key={severity}>
                                    <h4 className={`text-lg font-semibold mb-2 ${severity === 'High' ? 'text-red-300' : severity === 'Medium' ? 'text-yellow-300' : 'text-gray-300'}`}>
                                        {severity} Severity Threats ({groupedThreats[severity].length})
                                    </h4>
                                    <div className="space-y-2">
                                        {groupedThreats[severity].map(threat => (
                                            <div key={threat.id} className="bg-gray-800/50 p-3 rounded-md flex justify-between items-center">
                                                <div>
                                                    <p className={`font-semibold ${threat.isAiFinding ? 'text-blue-300' : 'text-gray-200'}`}>{threat.name}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{threat.filePath}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button onClick={() => handleThreatAnalysis(threat)} disabled={threat.aiStatus === 'analyzing'} className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 text-xs font-bold py-1 px-3 rounded-md transition-colors flex items-center space-x-1 disabled:opacity-50">
                                                        <SparklesIcon className="w-3 h-3"/>
                                                        <span>{threat.aiStatus === 'analyzing' ? 'Analyzing...': 'Analyze with AI'}</span>
                                                    </button>
                                                    <button onClick={() => handleQuarantine(threat.id)} className="bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 text-xs font-bold py-1 px-3 rounded-md transition-colors">Quarantine</button>
                                                    <button onClick={() => handleIgnore(threat.id)} className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-bold py-1 px-3 rounded-md transition-colors">Ignore</button>
                                                    <button onClick={() => handleDelete(threat.id)} className="bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-bold py-1 px-3 rounded-md transition-colors">Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            {scanStatus === 'complete_clean' && (
                <div className="bg-green-900/20 p-8 rounded-xl border border-green-500/30 text-center">
                    <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-300">Scan Complete: No Threats Found</h3>
                    <p className="text-green-400/80 mt-2">Your system appears to be clean.</p>
                    <button onClick={finishScan} className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg">
                        Done
                    </button>
                </div>
            )}

             <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="p-6 border-b border-gray-700/50">
                    <h3 className="text-xl font-semibold text-gray-200">Quarantine</h3>
                    <p className="text-gray-400">Threats are isolated here to prevent them from harming your device.</p>
                </div>
                <div className="max-h-60 overflow-y-auto">
                    {quarantinedFiles.length > 0 ? (
                        <table className="w-full text-left">
                            <tbody>
                                {quarantinedFiles.map(file => (
                                    <tr key={file.id} className="border-b border-gray-800">
                                        <td className="p-4 text-gray-200">{file.name}</td>
                                        <td className="p-4 text-gray-400 text-sm font-mono hidden md:table-cell">{file.originalPath}</td>
                                        <td className="p-4 text-gray-500 text-sm hidden md:table-cell">{file.dateQuarantined}</td>
                                        <td className="p-4 text-right">
                                            <button className="text-red-400 hover:text-red-300 text-xs font-bold">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500 py-10">Quarantine is empty.</p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Antivirus;