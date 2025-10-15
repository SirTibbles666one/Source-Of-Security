

import React, { useState, useEffect, useRef } from 'react';
import { BackupFile } from '../types';
import { CloudBackupIcon } from './icons/CloudBackupIcon';
import { FolderIcon } from './icons/FolderIcon';

const mockBackupFiles: BackupFile[] = [
    { id: 'docs', name: 'Documents', path: 'C:\\Users\\Admin', size: 8_589_934_592, type: 'folder' },
    { id: 'pics', name: 'Pictures', path: 'C:\\Users\\Admin', size: 5_368_709_120, type: 'folder' },
    { id: 'desktop', name: 'Desktop', path: 'C:\\Users\\Admin', size: 2_147_483_648, type: 'folder' },
    { id: 'work', name: 'Work Projects', path: 'D:\\', size: 1_073_741_824, type: 'folder' }
];
const totalStorage = 50 * 1024 * 1024 * 1024; // 50 GB
const usedStorage = mockBackupFiles.reduce((acc, file) => acc + file.size, 0);

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const CloudBackup: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'backup' | 'restore'>('backup');
    const [backupStatus, setBackupStatus] = useState<'idle' | 'preparing' | 'backing_up' | 'complete'>('idle');
    const [progress, setProgress] = useState(0);
    const [currentFile, setCurrentFile] = useState('');
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const startBackup = () => {
        setBackupStatus('preparing');
        setProgress(0);
        setCurrentFile('Analyzing files...');

        setTimeout(() => {
            setBackupStatus('backing_up');
            const totalFilesToBackup = 137; // Mock total files
            let filesBackedUp = 0;

            intervalRef.current = window.setInterval(() => {
                filesBackedUp += Math.floor(Math.random() * 5);
                if (filesBackedUp >= totalFilesToBackup) {
                    filesBackedUp = totalFilesToBackup;
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setBackupStatus('complete');
                     setTimeout(() => setBackupStatus('idle'), 3000);
                }
                setProgress((filesBackedUp / totalFilesToBackup) * 100);
                setCurrentFile(`Uploading file ${filesBackedUp} of ${totalFilesToBackup}`);
            }, 200);
        }, 2000);
    };

    const isBackupRunning = backupStatus === 'preparing' || backupStatus === 'backing_up';

    const renderBackupContent = () => (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-200">Backup Sets</h3>
                <button className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg text-sm">Manage Sets</button>
            </div>
            <p className="text-sm text-gray-400 mb-4">These files and folders are included in your cloud backup.</p>
            <div className="divide-y divide-gray-800">
                {mockBackupFiles.map(file => (
                    <div key={file.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center">
                            <FolderIcon className="w-5 h-5 mr-3 text-blue-400" />
                            <span className="font-mono text-gray-300">{file.path}\\{file.name}</span>
                        </div>
                        <span className="text-sm text-gray-400">{formatBytes(file.size)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
    
    const renderRestoreContent = () => (
        <div className="p-6 text-center text-gray-500">
            <p>Restore functionality coming soon.</p>
            <p className="text-sm">You would browse and select files to restore here.</p>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-8">
                <h2 className="text-2xl font-bold text-gray-200 mb-4">Secure Cloud Backup</h2>
                <div className="mb-4">
                    <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                        <span>{formatBytes(usedStorage)} of {formatBytes(totalStorage)} used</span>
                        <span>{((usedStorage / totalStorage) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(usedStorage / totalStorage) * 100}%` }}></div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        Last backup: <span className="text-green-400 font-semibold">1 day ago</span>. Next scheduled: <span className="text-gray-300 font-semibold">Sunday at 2:00 AM</span>.
                    </p>
                    <button onClick={startBackup} disabled={isBackupRunning} className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                        <CloudBackupIcon className="w-5 h-5 mr-2"/>
                        <span>{isBackupRunning ? 'Backing Up...' : 'Back Up Now'}</span>
                    </button>
                </div>
                {isBackupRunning && (
                    <div className="mt-4">
                        <p className="text-sm text-blue-300 mb-1">{currentFile}</p>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}
                 {backupStatus === 'complete' && (
                    <p className="mt-4 text-sm text-center text-green-400 font-semibold">Backup completed successfully!</p>
                )}
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="border-b border-gray-700/50">
                    <nav className="flex space-x-4 px-6">
                        <button onClick={() => setActiveTab('backup')} className={`py-4 font-medium border-b-2 ${activeTab === 'backup' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>Backup</button>
                        <button onClick={() => setActiveTab('restore')} className={`py-4 font-medium border-b-2 ${activeTab === 'restore' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>Restore</button>
                    </nav>
                </div>
                {activeTab === 'backup' ? renderBackupContent() : renderRestoreContent()}
            </div>
        </div>
    );
};

export default CloudBackup;