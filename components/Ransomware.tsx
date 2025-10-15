
import React, { useState } from 'react';
import { ProtectedFolder, RansomwareEvent } from '../types';
import { RansomwareIcon } from './icons/RansomwareIcon';
import { FolderIcon } from './icons/FolderIcon';

const initialProtectedFolders: ProtectedFolder[] = [
    { id: 1, path: 'C:\\Users\\Admin\\Documents', type: 'default' },
    { id: 2, path: 'C:\\Users\\Admin\\Pictures', type: 'default' },
    { id: 3, path: 'C:\\Users\\Admin\\Desktop', type: 'default' },
    { id: 4, path: 'D:\\Work\\Client Projects', type: 'user' },
];

const initialTrustedApps: string[] = ['winword.exe', 'excel.exe', 'photoshop.exe', 'explorer.exe'];
const initialBlockedEvents: RansomwareEvent[] = [
    { id: 1, appName: 'unknown_encryptor.exe', filePath: 'C:\\Users\\Admin\\Documents\\report.docx', timestamp: '2m ago' },
    { id: 2, appName: 'bad_process.exe', filePath: 'C:\\Users\\Admin\\Pictures\\vacation.jpg', timestamp: '30m ago' },
];


const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <div onClick={() => onChange(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${ enabled ? 'bg-blue-600' : 'bg-gray-600' }`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${ enabled ? 'translate-x-6' : 'translate-x-1' }`} />
    </div>
);


const Ransomware: React.FC = () => {
    const [shieldEnabled, setShieldEnabled] = useState(true);
    const [folders, setFolders] = useState<ProtectedFolder[]>(initialProtectedFolders);
    const [trustedApps, setTrustedApps] = useState<string[]>(initialTrustedApps);
    const [blockedEvents, setBlockedEvents] = useState<RansomwareEvent[]>(initialBlockedEvents);

    const trustApp = (event: RansomwareEvent) => {
        setBlockedEvents(prev => prev.filter(e => e.id !== event.id));
        if (!trustedApps.includes(event.appName)) {
            setTrustedApps(prev => [...prev, event.appName]);
        }
    };
    
    return (
        <div className="animate-fade-in">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-200 flex items-center"><RansomwareIcon className="w-6 h-6 mr-3"/>Ransomware Shield</h2>
                    <p className={`text-sm ${shieldEnabled ? 'text-green-400' : 'text-red-400'}`}>
                        {shieldEnabled ? 'Actively protecting your files from unauthorized changes.' : 'Shield is disabled! Your files are vulnerable to ransomware.'}
                    </p>
                </div>
                <ToggleSwitch enabled={shieldEnabled} onChange={setShieldEnabled} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column: Protected Folders & Trusted Apps */}
                <div className="space-y-8">
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                        <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
                           <div>
                                <h3 className="text-lg font-semibold text-gray-200">Protected Folders</h3>
                                <p className="text-sm text-gray-400">Files in these folders cannot be modified by untrusted apps.</p>
                           </div>
                           <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg text-sm">Add Folder</button>
                        </div>
                        <div className="divide-y divide-gray-800 max-h-60 overflow-y-auto">
                            {folders.map(folder => (
                                <div key={folder.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FolderIcon className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                                        <span className="font-mono text-gray-300 text-sm truncate">{folder.path}</span>
                                    </div>
                                    {folder.type === 'user' && <button className="text-xs text-gray-400 hover:text-gray-200">Remove</button>}
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                        <div className="p-6 border-b border-gray-700/50">
                           <h3 className="text-lg font-semibold text-gray-200">Trusted Applications</h3>
                           <p className="text-sm text-gray-400">These apps are allowed to modify files in protected folders.</p>
                        </div>
                        <div className="p-4 space-x-2 space-y-2 max-h-48 overflow-y-auto">
                            {trustedApps.map(app => (
                                <span key={app} className="inline-block bg-gray-700 text-gray-300 text-xs font-mono px-2 py-1 rounded-md">{app}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Blocked Attempts */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="p-6 border-b border-gray-700/50">
                        <h3 className="text-lg font-semibold text-gray-200">Recent Activity</h3>
                        <p className="text-sm text-gray-400">Log of blocked modification attempts.</p>
                    </div>
                     <div className="divide-y divide-gray-800">
                        {blockedEvents.map(event => (
                            <div key={event.id} className="p-4">
                                <div className="flex justify-between items-center">
                                    <p className="font-mono text-sm text-red-400">{event.appName}</p>
                                    <p className="text-xs text-gray-500">{event.timestamp}</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Attempted to modify: <span className="font-mono">{event.filePath}</span></p>
                                <div className="text-right mt-2">
                                     <button onClick={() => trustApp(event)} className="text-blue-400 hover:text-blue-300 text-xs font-bold">Trust this app</button>
                                </div>
                            </div>
                        ))}
                        {blockedEvents.length === 0 && <p className="text-center text-sm text-gray-500 py-8">No unauthorized activity detected.</p>}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Ransomware;