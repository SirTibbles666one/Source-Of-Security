import React, { useState, useMemo } from 'react';
import { InstalledApp } from '../types';
import { UninstallerIcon } from './icons/UninstallerIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const initialApps: InstalledApp[] = [
    { id: 1, name: 'OldGameLauncher', publisher: 'Obsolete Games Inc.', icon: '🎮', size: 1250, installDate: '2022-03-15', status: 'installed' },
    { id: 2, name: 'Photo Editor Trial', publisher: 'ImageCorp', icon: '🖼️', size: 850, installDate: '2023-11-20', status: 'installed' },
    { id: 3, name: 'Browser Toolbar', publisher: 'Adware Co.', icon: '🌐', size: 50, installDate: '2023-01-10', status: 'installed' },
    { id: 4, name: 'CCleaner', publisher: 'Piriform', icon: '🧹', size: 45, installDate: '2024-02-18', status: 'installed' },
    { id: 5, name: 'VLC Media Player', publisher: 'VideoLAN', icon: '▶️', size: 150, installDate: '2021-08-01', status: 'installed' },
    { id: 6, name: '7-Zip', publisher: 'Igor Pavlov', icon: '📦', size: 5, installDate: '2020-05-30', status: 'installed' },
];

const AdvancedUninstaller: React.FC = () => {
    const [apps, setApps] = useState<InstalledApp[]>(initialApps);
    const [selectedApps, setSelectedApps] = useState<number[]>([]);
    const [uninstallStep, setUninstallStep] = useState<'idle' | 'confirm' | 'progress' | 'done'>('idle');
    const [currentAppIndex, setCurrentAppIndex] = useState(0);

    const toggleSelection = (id: number) => {
        setSelectedApps(prev =>
            prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
        );
    };

    const handleUninstall = () => {
        setUninstallStep('confirm');
    };

    const startUninstallProcess = async () => {
        setUninstallStep('progress');
        const appsToUninstall = apps.filter(app => selectedApps.includes(app.id));

        for (let i = 0; i < appsToUninstall.length; i++) {
            const app = appsToUninstall[i];
            setCurrentAppIndex(i);

            // Simulate standard uninstall
            setApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'uninstalling' } : a));
            await new Promise(res => setTimeout(res, 1500));

            // Simulate leftover scan
            setApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'scanning' } : a));
            await new Promise(res => setTimeout(res, 2000));
            
            // Set leftovers and complete status
            setApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'complete', leftovers: { files: Math.floor(Math.random() * 50) + 10, registryKeys: Math.floor(Math.random() * 100) + 20, size: +(Math.random() * 50 + 10).toFixed(1) } } : a));
        }
        setUninstallStep('done');
    };

    const handleCleanLeftovers = () => {
        // "Clean" leftovers by removing the apps from the list
        setApps(prev => prev.filter(app => !selectedApps.includes(app.id)));
        setSelectedApps([]);
        setUninstallStep('idle');
    };

    const totalLeftovers = useMemo(() => {
        return apps
            .filter(app => selectedApps.includes(app.id) && app.leftovers)
            .reduce((acc, app) => ({
                files: acc.files + app.leftovers!.files,
                registryKeys: acc.registryKeys + app.leftovers!.registryKeys,
                size: acc.size + app.leftovers!.size,
            }), { files: 0, registryKeys: 0, size: 0 });
    }, [apps, selectedApps]);

    const renderProgressModal = () => {
         const app = apps.filter(app => selectedApps.includes(app.id))[currentAppIndex];
         if (!app) return null;

         const progressPercentage = (currentAppIndex / selectedApps.length) * 100;
         let statusText = '';
         if (app.status === 'uninstalling') statusText = `Uninstalling ${app.name}...`;
         if (app.status === 'scanning') statusText = `Scanning for leftovers for ${app.name}...`;

         return (
             <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                 <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-lg w-full animate-fade-in">
                     <h2 className="text-2xl font-bold text-gray-100 mb-4">Uninstalling...</h2>
                     <p className="text-gray-400 mb-2">Progress ({currentAppIndex + 1} of {selectedApps.length}):</p>
                     <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                        <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                     </div>
                     <p className="text-center font-semibold text-blue-300 animate-pulse">{statusText}</p>
                 </div>
             </div>
         );
    };
    
    const renderDoneModal = () => (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-lg w-full animate-fade-in text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Scan Complete!</h2>
                <p className="text-gray-400 mb-4">Found leftovers that can be safely removed to free up space.</p>
                <div className="bg-gray-900/50 p-4 rounded-lg text-left space-y-2 mb-6">
                    <p className="flex justify-between"><span>Junk Files:</span> <span className="font-mono text-yellow-300">{totalLeftovers.files}</span></p>
                    <p className="flex justify-between"><span>Registry Keys:</span> <span className="font-mono text-yellow-300">{totalLeftovers.registryKeys}</span></p>
                    <p className="flex justify-between"><span>Total Size:</span> <span className="font-mono text-yellow-300">{totalLeftovers.size.toFixed(1)} MB</span></p>
                </div>
                <button onClick={handleCleanLeftovers} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg">Clean Leftovers</button>
            </div>
         </div>
    );

    const renderConfirmModal = () => (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-lg w-full animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Confirm Uninstallation</h2>
                <p className="text-gray-400 mb-4">Are you sure you want to uninstall the following {selectedApps.length} application(s)?</p>
                <ul className="bg-gray-900/50 p-3 rounded-md text-gray-300 text-sm list-disc list-inside mb-6 max-h-40 overflow-y-auto">
                    {apps.filter(app => selectedApps.includes(app.id)).map(app => <li key={app.id}>{app.name}</li>)}
                </ul>
                <div className="flex justify-end space-x-4">
                    <button onClick={() => setUninstallStep('idle')} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg">Cancel</button>
                    <button onClick={startUninstallProcess} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg">Uninstall</button>
                </div>
            </div>
        </div>
    )

    return (
        <div className="animate-fade-in">
            {uninstallStep === 'confirm' && renderConfirmModal()}
            {uninstallStep === 'progress' && renderProgressModal()}
            {uninstallStep === 'done' && renderDoneModal()}

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-8">
                <h2 className="text-2xl font-bold text-gray-200 flex items-center mb-2">
                    <UninstallerIcon className="w-6 h-6 mr-3"/>
                    Advanced Uninstaller
                </h2>
                <p className="text-gray-400">Completely remove applications and their leftover files to keep your PC clean and fast.</p>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <input type="checkbox" className="form-checkbox h-5 w-5 bg-gray-900 border-gray-600 rounded text-blue-600 focus:ring-blue-500"
                            checked={selectedApps.length === apps.length && apps.length > 0}
                            onChange={() => setSelectedApps(selectedApps.length === apps.length ? [] : apps.map(a => a.id))}
                         />
                        <h3 className="text-lg font-semibold text-gray-200">{selectedApps.length} Selected</h3>
                    </div>
                    <button onClick={handleUninstall} disabled={selectedApps.length === 0} className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                        <TrashIcon className="w-5 h-5"/>
                        <span>Uninstall</span>
                    </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                    {apps.map(app => (
                        <div key={app.id} className={`p-4 flex items-center justify-between border-t border-gray-800 transition-colors ${selectedApps.includes(app.id) ? 'bg-blue-900/20' : 'hover:bg-gray-800/40'}`}>
                            <div className="flex items-center">
                                <input type="checkbox" className="form-checkbox h-5 w-5 bg-gray-900 border-gray-600 rounded text-blue-600 focus:ring-blue-500 mr-4"
                                    checked={selectedApps.includes(app.id)}
                                    onChange={() => toggleSelection(app.id)}
                                 />
                                <span className="text-3xl mr-4">{app.icon}</span>
                                <div>
                                    <p className="font-semibold text-gray-200">{app.name}</p>
                                    <p className="text-xs text-gray-500">{app.publisher}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-8">
                                <p className="text-sm text-gray-400 w-24 text-right">{app.size} MB</p>
                                <p className="text-sm text-gray-500 w-28 text-right hidden md:block">{app.installDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdvancedUninstaller;
