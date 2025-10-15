
import React, { useState, useRef } from 'react';
import { FileToShred } from '../types';
import { FileShredderIcon } from './icons/FileShredderIcon';
import { TrashIcon } from './icons/TrashIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

const initialFiles: FileToShred[] = [];

const ShreddingMethods = [
    { name: 'Quick (1-pass)', description: 'Overwrites data with zeros. Fast but less secure.', timeMultiplier: 1 },
    { name: 'DoD 5220.22-M (3-pass)', description: 'US Dept. of Defense standard. Secure and reliable.', timeMultiplier: 3 },
    { name: 'Gutmann (7-pass)', description: 'Extremely secure, multiple overwrites. Slower process.', timeMultiplier: 7 },
];


const FileShredder: React.FC = () => {
    const [files, setFiles] = useState<FileToShred[]>(initialFiles);
    const [method, setMethod] = useState(ShreddingMethods[1]);
    const [isShredding, setIsShredding] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileIdCounter = useRef(0);

    const addMockFiles = () => {
        const newFiles: FileToShred[] = [
            { id: ++fileIdCounter.current, name: 'temp_credentials.txt', path: 'C:\\Users\\Admin\\AppData\\Local\\Temp', size: '12 KB', status: 'pending' },
            { id: ++fileIdCounter.current, name: 'old_tax_records.pdf', path: 'D:\\Archive\\2018', size: '2.3 MB', status: 'pending' },
            { id: ++fileIdCounter.current, name: 'meeting_notes_draft.docx', path: 'C:\\Users\\Admin\\Documents', size: '45 KB', status: 'pending' },
        ];
        setFiles(prev => [...prev, ...newFiles.filter(nf => !prev.some(f => f.name === nf.name))]);
    };
    
    const removeFile = (id: number) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };
    
    const startShredding = async () => {
        setShowConfirm(false);
        setIsShredding(true);
        setProgress(0);
        
        const totalFiles = files.length;
        if (totalFiles === 0) {
            setIsShredding(false);
            return;
        }

        for (let i = 0; i < totalFiles; i++) {
            const file = files[i];
            setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'shredding' } : f));
            
            // Simulate shredding time
            await new Promise(resolve => setTimeout(resolve, 500 * method.timeMultiplier));

            setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'complete' } : f));
            setProgress(((i + 1) / totalFiles) * 100);
        }

        setTimeout(() => {
            setFiles([]);
            setIsShredding(false);
            setProgress(0);
        }, 1000);
    };

    const ConfirmationModal = () => (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-lg text-center animate-fade-in">
                <AlertTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-100">Are you sure?</h2>
                <p className="text-gray-400 mt-2 mb-6">
                    This will permanently delete {files.length} file(s). This action is irreversible and the data cannot be recovered.
                </p>
                <div className="flex justify-center space-x-4">
                    <button onClick={() => setShowConfirm(false)} className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={startShredding} className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors">
                        Shred Files
                    </button>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="animate-fade-in">
            {showConfirm && <ConfirmationModal />}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: File List */}
                <div className="lg:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-200">Shredding Queue</h2>
                            <p className="text-gray-400">Files added here will be permanently deleted.</p>
                        </div>
                        <button onClick={addMockFiles} className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg text-sm">Add Files</button>
                    </div>
                    <div className="min-h-[300px] max-h-[450px] overflow-y-auto divide-y divide-gray-800">
                        {files.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-10 text-center text-gray-500">
                                <FileShredderIcon className="w-12 h-12 mb-4" />
                                <p>Drag & drop files here or click "Add Files"</p>
                                <p className="text-xs mt-1">to begin the secure deletion process.</p>
                            </div>
                        ) : (
                            files.map(file => (
                                <div key={file.id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-200">{file.name}</p>
                                        <p className="font-mono text-xs text-gray-500">{file.path}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-400 w-20 text-right">{file.size}</span>
                                        <button onClick={() => removeFile(file.id)} disabled={isShredding} className="text-gray-500 hover:text-red-500 disabled:opacity-50">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: Controls */}
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-gray-200 mb-3">Shredding Method</h3>
                    <select onChange={(e) => setMethod(ShreddingMethods[parseInt(e.target.value)])} value={ShreddingMethods.findIndex(m => m.name === method.name)} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {ShreddingMethods.map((m, index) => (
                            <option key={m.name} value={index}>{m.name}</option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-400 mb-6">{method.description}</p>
                    
                    {isShredding && (
                         <div>
                            <p className="text-center font-semibold text-blue-300 mb-2">Shredding in progress...</p>
                            <div className="w-full bg-gray-700 rounded-full h-4">
                                <div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="text-center text-sm text-gray-400 mt-2">{Math.round(progress)}% Complete</p>
                        </div>
                    )}
                    
                    <button onClick={() => setShowConfirm(true)} disabled={files.length === 0 || isShredding} className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-500/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <TrashIcon className="w-5 h-5" />
                        <span>Permanently Shred Files</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileShredder;