
import React, { useState } from 'react';
import { MobileAppPermissionInfo } from '../types';
import { MobileIcon } from './icons/MobileIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { ScanIcon } from './icons/ScanIcon';

const mockRiskyApps: MobileAppPermissionInfo[] = [
    {
        id: 'com.social.app', name: 'SocialNet', icon: '💬',
        permissions: [
            { id: 'contacts', label: 'Read Contacts', risk: 'High' },
            { id: 'mic', label: 'Microphone Access', risk: 'High' },
            { id: 'location', label: 'Precise Location', risk: 'Medium' },
        ]
    },
    {
        id: 'com.game.free', name: 'Flashlight Deluxe', icon: '🔦',
        permissions: [
            { id: 'storage', label: 'Read/Write Storage', risk: 'Medium' },
            { id: 'contacts', label: 'Read Contacts', risk: 'High' },
        ]
    },
    {
        id: 'com.photo.editor', name: 'PhotoMagic', icon: '🖼️',
        permissions: [
            { id: 'camera', label: 'Camera', risk: 'Low' },
            { id: 'storage', label: 'Read/Write Storage', risk: 'Medium' },
        ]
    }
];

const riskColor: Record<'High' | 'Medium' | 'Low', string> = {
    High: 'bg-red-500/20 text-red-300',
    Medium: 'bg-yellow-500/20 text-yellow-300',
    Low: 'bg-blue-500/20 text-blue-300',
};

const MobileSecurity: React.FC = () => {
    const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
    const [privacyScanStatus, setPrivacyScanStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
    const [riskyApps, setRiskyApps] = useState<MobileAppPermissionInfo[]>([]);

    const startMalwareScan = () => {
        setScanStatus('scanning');
        setTimeout(() => setScanStatus('complete'), 3000);
        setTimeout(() => setScanStatus('idle'), 6000);
    };

    const startPrivacyScan = () => {
        setPrivacyScanStatus('scanning');
        setRiskyApps([]);
        setTimeout(() => {
            setRiskyApps(mockRiskyApps);
            setPrivacyScanStatus('complete');
        }, 2500);
    };

    return (
        <div className="animate-fade-in">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-8 flex items-center">
                <MobileIcon className="w-16 h-16 text-blue-400 mr-6" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-200">Liam's Galaxy S23</h2>
                    <p className="text-green-400 flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1.5" /> Connected & Secured</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Status & Actions */}
                <div className="space-y-8">
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Device Status</h3>
                        <div className="space-y-3">
                            <p className="flex justify-between items-center text-gray-300">Real-time Protection <span className="font-semibold text-green-400">ON</span></p>
                            <p className="flex justify-between items-center text-gray-300">Wi-Fi Security <span className="font-semibold text-green-400">SECURE</span></p>
                            <p className="flex justify-between items-center text-gray-300">Last Scan <span className="font-semibold text-gray-400">2 days ago</span></p>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Remote Actions</h3>
                        <div className="space-y-3">
                             <button onClick={startMalwareScan} disabled={scanStatus !== 'idle'} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                                <ScanIcon className="w-5 h-5"/>
                                <span>
                                    {scanStatus === 'scanning' && 'Scanning...'}
                                    {scanStatus === 'complete' && 'Scan Complete!'}
                                    {scanStatus === 'idle' && 'Scan for Malware'}
                                </span>
                            </button>
                             <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 rounded-lg transition-colors">Locate Device</button>
                        </div>
                    </div>
                     <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Photo Vault</h3>
                         <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                            <span>1.2 GB Used</span>
                            <span>5 GB Total</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `24%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Right Column: App Privacy */}
                <div className="lg:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="p-6 border-b border-gray-700/50">
                        <h3 className="text-xl font-semibold text-gray-200">App Privacy Scanner</h3>
                        <p className="text-gray-400">Find out which apps have access to your personal information.</p>
                    </div>
                    <div className="p-6">
                        {privacyScanStatus !== 'complete' ? (
                            <div className="text-center py-10">
                                <button onClick={startPrivacyScan} disabled={privacyScanStatus === 'scanning'} className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                                    {privacyScanStatus === 'scanning' ? 'Scanning Apps...' : 'Scan App Permissions'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-yellow-300 flex items-center"><AlertTriangleIcon className="w-5 h-5 mr-2" />Found {riskyApps.length} apps with potentially risky permissions.</p>
                                {riskyApps.map(app => (
                                    <div key={app.id} className="bg-gray-900/50 p-4 rounded-lg">
                                        <div className="flex items-center">
                                            <span className="text-3xl mr-4">{app.icon}</span>
                                            <div>
                                                <p className="font-semibold text-gray-200">{app.name}</p>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {app.permissions.map(p => (
                                                        <span key={p.id} className={`px-2 py-0.5 text-xs font-semibold rounded-full ${riskColor[p.risk]}`}>
                                                            {p.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileSecurity;