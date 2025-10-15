
import React, { useState, useRef } from 'react';
import { SandboxIcon } from './icons/SandboxIcon';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { SandboxFile, SandboxAnalysis } from '../types';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const ForensicReportModal: React.FC<{ report: SandboxAnalysis; onClose: () => void }> = ({ report, onClose }) => {
    const verdictConfig = {
        'Malicious': { icon: AlertTriangleIcon, color: 'red', title: 'Malicious Payload Detected' },
        'Suspicious': { icon: AlertTriangleIcon, color: 'yellow', title: 'Suspicious Behavior Detected' },
        'Clean': { icon: CheckCircleIcon, color: 'green', title: 'File Appears Clean' }
    };
    const { icon: Icon, color, title } = verdictConfig[report.verdict];

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-2xl w-full animate-fade-in text-sm">
                <div className={`text-center p-4 rounded-lg bg-${color}-500/10 border border-${color}-500/30 mb-4`}>
                    <Icon className={`w-10 h-10 text-${color}-400 mx-auto mb-2`} />
                    <h2 className={`text-xl font-bold text-${color}-300`}>{title}</h2>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div>
                        <h3 className="font-semibold text-gray-200 mb-2">Behavior Analysis</h3>
                        <div className="bg-gray-900/50 p-3 rounded-md font-mono text-xs text-gray-400 space-y-1">
                            {report.behaviorLog.map((log, i) => <p key={i}>{log}</p>)}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-gray-200 mb-2">Network Activity</h3>
                        <div className="bg-gray-900/50 p-3 rounded-md font-mono text-xs text-gray-400 space-y-1">
                            {report.networkActivity.map((net, i) => <p key={i}>[{net.status}] Connection to {net.ip}:{net.port} ({net.protocol})</p>)}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-200 mb-2">System Changes</h3>
                         <div className="bg-gray-900/50 p-3 rounded-md font-mono text-xs text-gray-400 space-y-1">
                            {report.systemChanges.map((chg, i) => <p key={i}>{chg}</p>)}
                        </div>
                    </div>
                </div>
                <div className="text-right mt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">Close Report</button>
                </div>
            </div>
        </div>
    );
};


const Sandbox: React.FC = () => {
    const [files, setFiles] = useState<SandboxFile[]>([]);
    const [selectedReport, setSelectedReport] = useState<SandboxAnalysis | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileIdCounter = useRef(0);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files).map(file => ({
                id: ++fileIdCounter.current,
                file,
                status: 'pending' as const,
            }));
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleAnalyze = (id: number) => {
        setFiles(files => files.map(f => f.id === id ? { ...f, status: 'analyzing' } : f));
        setTimeout(() => {
            setFiles(files => files.map(f => {
                if (f.id !== id) return f;
                
                const isMalicious = Math.random() > 0.4;
                const report: SandboxAnalysis = isMalicious ? {
                    verdict: 'Malicious',
                    behaviorLog: ['Attempted to inject code into explorer.exe', 'Dropped file C:\\Windows\\Temp\\temp.dll', 'Enumerated running processes'],
                    networkActivity: [{ ip: '198.51.100.23', port: 443, protocol: 'TCP', status: 'Blocked' }],
                    systemChanges: ['Created registry key HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run for persistence']
                } : {
                    verdict: 'Clean',
                    behaviorLog: ['Read file properties', 'Accessed standard system libraries'],
                    networkActivity: [],
                    systemChanges: []
                };
                
                return { ...f, status: 'complete', result: report };
            }));
        }, 3000);
    };

    const getStatusComponent = (file: SandboxFile) => {
        switch (file.status) {
            case 'pending':
                return <button onClick={() => handleAnalyze(file.id)} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg text-sm">Analyze</button>;
            case 'analyzing':
                return <span className="text-blue-400 animate-pulse font-semibold">Analyzing...</span>;
            case 'complete':
                return <button onClick={() => setSelectedReport(file.result!)} className="text-blue-400 hover:text-blue-300 font-semibold text-sm">View Report</button>;
            case 'error':
                 return <span className="text-red-400 font-semibold">Error</span>;
        }
    };

    return (
        <div className="animate-fade-in">
            {selectedReport && <ForensicReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-8">
                <h2 className="text-2xl font-bold text-gray-200 flex items-center mb-2">
                    <SandboxIcon className="w-6 h-6 mr-3"/>
                    File Sandbox
                </h2>
                <p className="text-gray-400">Safely analyze suspicious files in an isolated environment to understand their behavior without risking your system.</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                 <div className="p-6 border-b border-gray-700/50">
                    <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-600 hover:border-blue-500 hover:bg-gray-800 rounded-xl transition-colors">
                        <UploadCloudIcon className="w-12 h-12 text-gray-500 mb-2" />
                        <span className="font-semibold text-gray-300">Click to browse or drag & drop files</span>
                        <span className="text-sm text-gray-500">Analyze any executable, document, or archive</span>
                    </button>
                </div>
                <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
                    {files.map(file => (
                         <div key={file.id} className="p-4 flex items-center justify-between">
                             <div>
                                <p className="font-semibold text-gray-200">{file.file.name}</p>
                                <p className="text-xs text-gray-500 font-mono">{(file.file.size / 1024).toFixed(2)} KB</p>
                            </div>
                            {getStatusComponent(file)}
                         </div>
                    ))}
                    {files.length === 0 && (
                        <p className="text-center text-gray-500 py-16">No files added for analysis.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sandbox;
