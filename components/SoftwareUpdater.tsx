import React, { useState, useMemo, useEffect } from 'react';
import { SoftwareUpdateInfo } from '../types';
import { UpdaterIcon } from './icons/UpdaterIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const initialApps: Omit<SoftwareUpdateInfo, 'status'>[] = [
    { id: 1, name: 'Google Chrome', publisher: 'Google LLC', icon: '🌐', currentVersion: '124.0.6367.128', latestVersion: '125.0.6422.60' },
    { id: 2, name: 'Discord', publisher: 'Discord Inc.', icon: '💬', currentVersion: '1.0.9037', latestVersion: '1.0.9044' },
    { id: 3, name: 'Spotify Music', publisher: 'Spotify AB', icon: '🎵', currentVersion: '1.2.35.663', latestVersion: '1.2.35.663' },
    { id: 4, name: 'NVIDIA Graphics Driver', publisher: 'NVIDIA Corporation', icon: '⚙️', currentVersion: '552.44', latestVersion: '555.85' },
    { id: 5, name: 'Visual Studio Code', publisher: 'Microsoft', icon: '💻', currentVersion: '1.89.1', latestVersion: '1.90.0' },
    { id: 6, name: 'Steam', publisher: 'Valve Corporation', icon: '🎮', currentVersion: '7.15.24.89', latestVersion: '7.15.24.89' },
];

const determineInitialStatus = (app: Omit<SoftwareUpdateInfo, 'status'>): SoftwareUpdateInfo => ({
    ...app,
    status: app.currentVersion === app.latestVersion ? 'up_to_date' : 'available',
});

interface SoftwareUpdaterProps {
    setUpdatesAvailableCount: (count: number) => void;
}

const SoftwareUpdater: React.FC<SoftwareUpdaterProps> = ({ setUpdatesAvailableCount }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [apps, setApps] = useState<SoftwareUpdateInfo[]>([]);

    const updatesAvailableCount = useMemo(() => {
        return apps.filter(app => app.status === 'available').length;
    }, [apps]);
    
    useEffect(() => {
        setUpdatesAvailableCount(updatesAvailableCount);
    }, [updatesAvailableCount, setUpdatesAvailableCount]);

    const startScan = () => {
        setIsScanning(true);
        setScanComplete(false);
        setApps([]);
        setTimeout(() => {
            const scannedApps = initialApps.map(determineInitialStatus);
            setApps(scannedApps);
            setUpdatesAvailableCount(scannedApps.filter(app => app.status === 'available').length);
            setIsScanning(false);
            setScanComplete(true);
        }, 2500);
    };

    const updateApp = (id: number) => {
        setApps(prev => prev.map(app => app.id === id ? { ...app, status: 'updating' } : app));
        setTimeout(() => {
            setApps(prev => prev.map(app => {
                if (app.id === id) {
                    return { ...app, status: 'up_to_date', currentVersion: app.latestVersion };
                }
                return app;
            }));
        }, 2000 + Math.random() * 1000);
    };

    const updateAll = () => {
        apps.forEach(app => {
            if (app.status === 'available') {
                updateApp(app.id);
            }
        });
    };
    
    const renderAppRow = (app: SoftwareUpdateInfo) => {
        const renderButton = () => {
            switch (app.status) {
                case 'available':
                    return <button onClick={() => updateApp(app.id)} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg text-sm w-28 text-center">Update</button>;
                case 'updating':
                    return <div className="w-28 text-center"><div className="w-full bg-gray-700 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full animate-pulse-fast" style={{ width: `${Math.random() * 50 + 25}%` }}></div></div></div>;
                case 'up_to_date':
                    return <span className="text-green-400 font-semibold text-sm flex items-center justify-center w-28"><CheckCircleIcon className="w-4 h-4 mr-1.5"/> Up to date</span>;
            }
        };

        return (
            <div key={app.id} className="p-4 flex items-center justify-between border-t border-gray-800 hover:bg-gray-800/40 transition-colors">
                <div className="flex items-center">
                    <span className="text-3xl mr-4">{app.icon}</span>
                    <div>
                        <p className="font-semibold text-gray-200">{app.name}</p>
                        <p className="text-xs text-gray-500">{app.publisher}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-8">
                     <div className="text-center">
                        <p className="font-mono text-sm text-gray-400">{app.currentVersion}</p>
                        <p className="text-xs text-gray-600">Current</p>
                    </div>
                    {app.status !== 'up_to_date' && (
                        <div className="text-center">
                            <p className="font-mono text-sm text-green-400">{app.latestVersion}</p>
                            <p className="text-xs text-gray-600">Latest</p>
                        </div>
                    )}
                </div>
                {renderButton()}
            </div>
        );
    };

    return (
        <div className="animate-fade-in">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-200">Software Updater</h2>
                        {scanComplete ? (
                            <p className={updatesAvailableCount > 0 ? 'text-yellow-400' : 'text-green-400'}>
                                {updatesAvailableCount > 0 ? `Found ${updatesAvailableCount} application(s) to update.` : 'All your software is up to date.'}
                            </p>
                        ) : (
                             <p className="text-gray-400">Keep your apps updated to protect against security vulnerabilities.</p>
                        )}
                    </div>
                    <button onClick={startScan} disabled={isScanning} className="w-full md:w-auto mt-4 md:mt-0 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <UpdaterIcon className="w-5 h-5" />
                        <span>{isScanning ? 'Scanning...' : 'Scan for Updates'}</span>
                    </button>
                </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-200">
                        {scanComplete ? `Found ${apps.length} Applications` : 'Ready to scan'}
                    </h3>
                    {updatesAvailableCount > 0 && (
                        <button onClick={updateAll} className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg text-sm">Update All</button>
                    )}
                </div>
                 <div className="divide-y divide-gray-800">
                    {apps.filter(a => a.status !== 'up_to_date').map(renderAppRow)}
                    {apps.filter(a => a.status === 'up_to_date').map(renderAppRow)}
                 </div>
                 {isScanning && (
                    <div className="p-16 text-center text-gray-500">
                        <UpdaterIcon className="w-12 h-12 mx-auto mb-4 animate-spin" />
                        <p>Scanning for installed software...</p>
                    </div>
                 )}
                 {!isScanning && apps.length === 0 && (
                    <div className="p-16 text-center text-gray-500">Click "Scan for Updates" to begin.</div>
                 )}
            </div>
        </div>
    );
};

export default SoftwareUpdater;