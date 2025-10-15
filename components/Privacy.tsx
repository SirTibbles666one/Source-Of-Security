
import React, { useState } from 'react';
import { HardeningIssue } from '../types';
import { KeyboardIcon } from './icons/KeyboardIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { WebcamIcon } from './icons/WebcamIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const initialIssues: HardeningIssue[] = [
    { id: 'uac', title: 'User Account Control (UAC) is not at the highest level', description: 'UAC helps prevent unauthorized changes to your computer. We recommend setting it to "Always notify".', severity: 'High', status: 'unresolved' },
    { id: 'rdp', title: 'Remote Desktop Protocol (RDP) is enabled', description: 'RDP can be a security risk if not properly secured. Disable it if you do not need remote access.', severity: 'Medium', status: 'unresolved' },
    { id: 'smb1', title: 'SMBv1 protocol is enabled', description: 'This outdated protocol has known vulnerabilities (e.g., WannaCry) and should be disabled.', severity: 'High', status: 'unresolved' },
    { id: 'ad_id', title: 'Advertising ID for relevant ads is enabled', description: 'Disabling this enhances your privacy by preventing apps from tracking you for ad purposes.', severity: 'Low', status: 'unresolved' },
];

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <div onClick={() => onChange(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${ enabled ? 'bg-blue-600' : 'bg-gray-600' }`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${ enabled ? 'translate-x-6' : 'translate-x-1' }`} />
    </div>
);

const KeystrokeEncryption: React.FC = () => {
    const [enabled, setEnabled] = useState(true);
    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-200 flex items-center"><KeyboardIcon className="w-6 h-6 mr-3 text-blue-400" />Keystroke Encryption</h3>
                <ToggleSwitch enabled={enabled} onChange={setEnabled} />
            </div>
            <p className="text-gray-400 mb-4">Protects your typed data from keyloggers in real-time. Your passwords and sensitive information are scrambled to prevent theft.</p>
            <div className={`p-3 rounded-md text-sm transition-colors ${enabled ? 'bg-green-500/10 text-green-300' : 'bg-yellow-500/10 text-yellow-300'}`}>
                {enabled ? 'Keystroke encryption is ACTIVE.' : 'Keystroke encryption is currently disabled.'}
            </div>
        </div>
    );
}

const WebcamProtection: React.FC = () => {
     const [enabled, setEnabled] = useState(true);
    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-200 flex items-center"><WebcamIcon className="w-6 h-6 mr-3 text-blue-400" />Webcam & Mic Protection</h3>
                <ToggleSwitch enabled={enabled} onChange={setEnabled} />
            </div>
            <p className="text-gray-400 mb-4">Prevents unauthorized applications from accessing your webcam and microphone without your permission.</p>
             <div className="p-3 rounded-md bg-gray-900/50">
                <p className="text-sm font-semibold text-gray-300 mb-2">Recent Activity</p>
                <ul className="text-xs text-gray-400 space-y-1 font-mono">
                    <li>[ALLOWED] chrome.exe accessed Webcam (2m ago)</li>
                    <li>[BLOCKED] unknown_app.exe attempted Mic access (15m ago)</li>
                </ul>
            </div>
        </div>
    )
}

const WindowsHardening: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [issues, setIssues] = useState<HardeningIssue[]>([]);
    
    const startScan = () => {
        setIsScanning(true);
        setIssues([]);
        setTimeout(() => {
            setIssues(initialIssues.map(i => ({...i, status: 'unresolved'})));
            setIsScanning(false);
        }, 2000);
    }

    const fixIssue = (id: string) => {
        setIssues(prev => prev.map(issue => issue.id === id ? {...issue, status: 'fixing'} : issue));
        setTimeout(() => {
            setIssues(prev => prev.map(issue => issue.id === id ? {...issue, status: 'resolved'} : issue));
        }, 1500);
    }
    
    const severityClasses = {
        High: 'bg-red-500/20 text-red-300',
        Medium: 'bg-yellow-500/20 text-yellow-300',
        Low: 'bg-blue-500/20 text-blue-300',
    };

    const statusButton = (issue: HardeningIssue) => {
        switch (issue.status) {
            case 'unresolved': return <button onClick={() => fixIssue(issue.id)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors">Fix Now</button>
            case 'fixing': return <span className="text-sm text-gray-400 animate-pulse">Fixing...</span>
            case 'resolved': return <span className="text-sm text-green-400 flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1"/>Resolved</span>
        }
    }

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-xl font-semibold text-gray-200 flex items-center"><SettingsIcon className="w-6 h-6 mr-3 text-blue-400" />Windows Security Hardening</h3>
            <p className="text-gray-400 mt-1 mb-4">Scan for and fix security vulnerabilities in your Windows settings to strengthen your overall protection.</p>
            {issues.length === 0 ? (
                <button onClick={startScan} disabled={isScanning} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors">
                    {isScanning ? 'Scanning for vulnerabilities...' : 'Scan System Now'}
                </button>
            ) : (
                <div className="space-y-4">
                    {issues.map(issue => (
                        <div key={issue.id} className="bg-gray-900/50 p-4 rounded-lg flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-gray-200">{issue.title}</p>
                                <p className="text-sm text-gray-400 mr-4">{issue.description}</p>
                                <span className={`mt-2 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${severityClasses[issue.severity]}`}>{issue.severity} Severity</span>
                            </div>
                            <div className="flex-shrink-0 w-24 text-right">
                                {statusButton(issue)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const Privacy: React.FC = () => {
  return (
    <div className="animate-fade-in grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
            <KeystrokeEncryption />
            <WebcamProtection />
        </div>
        <div className="space-y-8">
            <WindowsHardening />
        </div>
    </div>
  );
};

export default Privacy;