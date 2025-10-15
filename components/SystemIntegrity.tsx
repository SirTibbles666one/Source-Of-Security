import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SystemIntegrityIcon } from './icons/SystemIntegrityIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ShieldLockIcon } from './icons/ShieldLockIcon';
import { CpuIcon } from './icons/CpuIcon';
import { SystemFile, IntegrityAlert } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const mockSystemFiles: SystemFile[] = [
    { id: 'kernel32', path: 'C:\\Windows\\System32\\kernel32.dll', type: 'File', baselineHash: 'a1b2c3d4e5f6' },
    { id: 'user32', path: 'C:\\Windows\\System32\\user32.dll', type: 'File', baselineHash: 'f6e5d4c3b2a1' },
    { id: 'sam', path: 'HKLM\\SAM', type: 'Registry Key', baselineHash: '1a2b3c4d5e6f' },
    { id: 'winlogon', path: 'HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon', type: 'Registry Key', baselineHash: '6f5e4d3c2b1a' },
];

const mockAppFiles: SystemFile[] = [
    { id: 'tibbles_core', path: 'C:\\Program Files\\Tibbles\\core.dll', type: 'Application File', baselineHash: 'g1h2j3k4l5' },
    { id: 'tibbles_engine', path: 'C:\\Program Files\\Tibbles\\av_engine.dat', type: 'Application File', baselineHash: 'm5n4o3p2q1' },
    { id: 'tibbles_firewall', path: 'C:\\Program Files\\Tibbles\\firewall_driver.sys', type: 'Application File', baselineHash: 'z9y8x7w6v5' },
];


const SystemIntegrity: React.FC = () => {
    const [status, setStatus] = useState<'no_baseline' | 'creating_baseline' | 'monitoring' | 'scanning' | 'alerts_found'>('no_baseline');
    const [progress, setProgress] = useState(0);
    const [alerts, setAlerts] = useState<IntegrityAlert[]>([]);
    
    const antiCrackingTechniques = [
        "Code Obfuscation & Virtualization",
        "Anti-Debug Detection",
        "Memory Integrity Checks",
        "API Hooking Prevention",
    ];

    const createBaseline = () => {
        setStatus('creating_baseline');
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setStatus('monitoring');
                    return 100;
                }
                return prev + 5;
            });
        }, 150);
    };

    const startScan = () => {
        setStatus('scanning');
        setProgress(0);
        setAlerts([]);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    
                    const newAlerts: IntegrityAlert[] = [
                        { file: mockSystemFiles[0], currentHash: 'MODIFIED_HASH_xYz', status: 'unresolved', aiStatus: 'idle' },
                    ];

                    // Chance to add a self-protection alert
                    if (Math.random() > 0.5) {
                        newAlerts.push({
                            file: mockAppFiles[0], currentHash: 'TAMPERED_HASH_abc', status: 'unresolved', aiStatus: 'idle', isSelfProtection: true
                        });
                    }

                    setAlerts(newAlerts);
                    setStatus('alerts_found');
                    return 100;
                }
                return prev + 2;
            });
        }, 100);
    };

    const handleAiAnalysis = async (filePath: string) => {
        setAlerts(prev => prev.map(a => a.file.path === filePath ? { ...a, aiStatus: 'analyzing' } : a));

        try {
            const alert = alerts.find(a => a.file.path === filePath);
            if (!alert) return;

            const prompt = alert.isSelfProtection
             ? `You are a cybersecurity expert. The security application itself, Tibbles Source Of Security, has detected that one of its core files ('${alert.file.path}') has been tampered with. This was caught by the Anti-Cracking Engine. Explain what application cracking is, why it's dangerous (e.g., bypassing licenses, injecting malware), and how techniques like code obfuscation and anti-debugging work to prevent it. Reassure the user that the application's Self-Heal feature can fix this by restoring the original, protected code.`
             : `You are a cybersecurity expert. A critical system component, '${alert.file.path}', has been modified unexpectedly. Explain what this component is, its role in the Windows operating system, and the potential security risks if it's modified by an unauthorized process. Keep the explanation clear and concise for a non-technical user.`;
            
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const analysisText = response.text;
            
            setAlerts(prev => prev.map(a => a.file.path === filePath ? { ...a, aiAnalysis: analysisText, aiStatus: 'idle' } : a));
        } catch (error) {
            console.error("AI Analysis failed:", error);
            const errorText = "Could not analyze this change. Please check your connection and try again.";
            setAlerts(prev => prev.map(a => a.file.path === filePath ? { ...a, aiAnalysis: errorText, aiStatus: 'idle' } : a));
        }
    };
    
    const handleAlertAction = (filePath: string, action: 'restore' | 'trust' | 'heal') => {
        const updateStatus = action === 'restore' ? 'restoring' : action === 'heal' ? 'healing' : 'trusted';
        setAlerts(prev => prev.map(a => a.file.path === filePath ? {...a, status: updateStatus} : a));

        if(action === 'restore' || action === 'heal') {
            setTimeout(() => {
                 setAlerts(prev => prev.filter(a => a.file.path !== filePath));
                 // If that was the last alert, go back to monitoring
                 if (alerts.filter(a => a.file.path !== filePath).length === 0) {
                     setStatus('monitoring');
                 }
            }, 1500);
        }
    };
    
    if (alerts.length > 0 && alerts.every(a => a.status === 'trusted')) {
        setTimeout(() => {
             setAlerts([]);
             setStatus('monitoring');
         }, 1000);
    }


    const renderContent = () => {
        switch (status) {
            case 'no_baseline':
                return (
                    <div className="text-center">
                        <p className="text-gray-400 mb-4">No security baseline has been created for your system. This is required to monitor for unauthorized changes.</p>
                        <button onClick={createBaseline} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg">Create Secure Baseline</button>
                    </div>
                );
            case 'creating_baseline':
            case 'scanning':
                const text = status === 'creating_baseline' ? 'Creating secure baseline...' : 'Verifying system integrity...';
                return (
                    <div className="text-center">
                        <p className="text-xl font-semibold text-blue-300 mb-4 animate-pulse">{text}</p>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                            <div className="bg-blue-600 h-4 rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">{progress.toFixed(0)}%</p>
                    </div>
                );
            case 'monitoring':
                return (
                    <div className="text-center">
                        <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-green-300">System Integrity is being monitored</h3>
                        <p className="text-gray-400 mt-2 mb-6">We are actively protecting your critical system files. Last check: 3 minutes ago.</p>
                        <button onClick={startScan} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg">Verify Integrity Now</button>
                    </div>
                );
            case 'alerts_found':
                return (
                    <div className="w-full">
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-center mb-6">
                            <h3 className="font-bold flex items-center justify-center"><AlertTriangleIcon className="w-5 h-5 mr-2"/>System Integrity Alert!</h3>
                            <p className="text-sm">Unauthorized changes detected in critical system components.</p>
                        </div>
                        <div className="space-y-4">
                            {alerts.map(alert => (
                                <div key={alert.file.id} className={`p-4 rounded-lg ${alert.isSelfProtection ? 'bg-red-900/40 border border-red-500/50' : 'bg-gray-900/50'}`}>
                                    {alert.isSelfProtection && <p className="font-bold text-red-300 text-sm mb-2">TIBBLES ANTI-CRACKING ENGINE: TAMPERING DETECTED</p>}
                                    <p className="font-semibold text-gray-200">{alert.file.path}</p>
                                    <p className="text-xs text-gray-500">{alert.file.type}</p>
                                    
                                    {alert.aiAnalysis && (
                                        <div className="mt-3 p-3 bg-gray-800/60 rounded-md text-sm text-gray-300 border border-gray-700">
                                            <p className="font-bold text-blue-300 mb-1">AI Analysis:</p>
                                            {alert.aiAnalysis}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center mt-3">
                                        <p className="text-sm text-yellow-400">Status: Hash mismatch detected</p>
                                        <div className="space-x-2">
                                            {alert.status === 'unresolved' && <>
                                                <button onClick={() => handleAiAnalysis(alert.file.path)} disabled={alert.aiStatus === 'analyzing'} className="text-blue-400 hover:text-blue-300 text-xs font-bold disabled:opacity-50 flex items-center space-x-1">
                                                    <SparklesIcon className="w-3 h-3"/>
                                                    <span>{alert.aiStatus === 'analyzing' ? 'Analyzing...' : 'Ask AI'}</span>
                                                </button>
                                                {alert.isSelfProtection ? (
                                                     <button onClick={() => handleAlertAction(alert.file.path, 'heal')} className="text-green-400 hover:text-green-300 text-xs font-bold">Self-Heal</button>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleAlertAction(alert.file.path, 'restore')} className="text-blue-400 hover:text-blue-300 text-xs font-bold">Restore</button>
                                                        <button onClick={() => handleAlertAction(alert.file.path, 'trust')} className="text-gray-400 hover:text-gray-200 text-xs font-bold">Trust Change</button>
                                                    </>
                                                )}
                                            </>}
                                            {alert.status === 'restoring' && <span className="text-blue-400 text-xs animate-pulse">Restoring...</span>}
                                            {alert.status === 'healing' && <span className="text-green-400 text-xs animate-pulse">Healing...</span>}
                                            {alert.status === 'trusted' && <span className="text-green-400 text-xs flex items-center"><CheckCircleIcon className="w-3 h-3 mr-1"/>Trusted</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                 <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                    <h2 className="text-2xl font-bold text-gray-200 flex items-center mb-2">
                        <SystemIntegrityIcon className="w-6 h-6 mr-3"/>
                        System Integrity
                    </h2>
                    <p className="text-gray-400">Protects critical Windows files from unauthorized modification.</p>
                </div>
                 <div className="lg:col-span-3 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                    <h2 className="text-2xl font-bold text-gray-200 flex items-center mb-2">
                        <ShieldLockIcon className="w-6 h-6 mr-3"/>
                        Tibbles Self-Protection
                    </h2>
                    <div className="flex gap-6 mt-4">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-blue-300 flex items-center mb-2">
                                <CpuIcon className="w-5 h-5 mr-2"/>
                                Anti-Cracking Engine
                            </h3>
                            <p className="text-sm text-gray-400">Protects the application from being illegally modified or reverse-engineered.</p>
                        </div>
                        <div className="flex-1 bg-gray-900/50 p-3 rounded-md">
                            <p className="text-center font-semibold text-green-400 text-sm mb-2">STATUS: ACTIVE</p>
                            <ul className="text-xs text-gray-400 space-y-1">
                                {antiCrackingTechniques.map(tech => (
                                    <li key={tech} className="flex items-center">
                                        <CheckCircleIcon className="w-3 h-3 mr-2 text-green-500 flex-shrink-0"/>
                                        {tech}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 min-h-[300px] flex items-center justify-center">
                {renderContent()}
            </div>
        </div>
    );
};

export default SystemIntegrity;