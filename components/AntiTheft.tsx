import React, { useState } from 'react';
import { AntiTheftIcon } from './icons/AntiTheftIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { LockIcon } from './icons/LockIcon';

const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const VolumeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </svg>
);

const WipeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 12V8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"></path><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"></path><path d="m18 16 4 4m-4 0 4-4"></path>
    </svg>
);


const AntiTheft: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'locating' | 'alarming' | 'locking' | 'wiping'>('idle');
    const [location, setLocation] = useState('San Francisco, CA (Approx.)');
    const [showLockModal, setShowLockModal] = useState(false);
    const [showWipeModal, setShowWipeModal] = useState(false);
    
    const handleLocate = () => {
        setStatus('locating');
        setTimeout(() => {
            setLocation('Golden Gate Park, SF, CA');
            setStatus('idle');
        }, 2000);
    };
    
    const handleAlarm = () => {
        setStatus('alarming');
        setTimeout(() => setStatus('idle'), 3000);
    };
    
    const handleLock = () => {
        // In a real app, you'd handle the lock message
        setShowLockModal(false);
        setStatus('locking');
        setTimeout(() => setStatus('idle'), 1500);
    };

    const handleWipe = () => {
        setShowWipeModal(false);
        setStatus('wiping');
        // This process would be longer and final
    };
    
    const ActionButton: React.FC<{ icon: React.FC<any>, label: string, onClick: () => void, disabled: boolean, variant?: 'default' | 'danger' }> = ({ icon: Icon, label, onClick, disabled, variant = 'default'}) => {
        const baseClasses = "flex-1 flex flex-col items-center justify-center p-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
        const variantClasses = variant === 'danger'
            ? "bg-red-900/50 hover:bg-red-800/60 text-red-300"
            : "bg-gray-700 hover:bg-gray-600 text-gray-200";

        return (
            <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses}`}>
                <Icon className="w-8 h-8 mb-2" />
                <span className="font-semibold">{label}</span>
            </button>
        );
    };

    const LockModal = () => (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-lg w-full animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Remotely Lock Device</h2>
                <p className="text-gray-400 mb-4">Enter a message to display on the lock screen. This can help someone return your device.</p>
                <textarea placeholder="e.g., This device is lost. Please call 555-123-4567." className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 h-24"></textarea>
                <div className="flex justify-end space-x-4">
                    <button onClick={() => setShowLockModal(false)} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleLock} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">Lock Device</button>
                </div>
            </div>
        </div>
    );
    
     const WipeModal = () => (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-lg w-full animate-fade-in text-center">
                <AlertTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-100">Permanently Wipe All Data?</h2>
                <p className="text-gray-400 mt-2 mb-6">This is your last resort. Wiping is irreversible and will delete all personal files and settings on this device. You will no longer be able to locate it.</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={() => setShowWipeModal(false)} className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleWipe} className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors">Yes, Wipe Device</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            {showLockModal && <LockModal />}
            {showWipeModal && <WipeModal />}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-200 flex items-center"><AntiTheftIcon className="w-6 h-6 mr-3"/>Anti-Theft Protection</h2>
                        <p className="text-green-400">Your device is protected and can be located.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 h-[400px] flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200">Device Location</h3>
                        <p className="text-sm text-gray-400">Last known location reported 5 minutes ago.</p>
                    </div>
                    <div className="flex-1 my-4 bg-gray-900/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <img src="https://i.imgur.com/3Z6nZ6N.png" alt="Map of San Francisco" className="object-cover w-full h-full opacity-30"/>
                        <div className="absolute flex flex-col items-center text-center">
                            {status === 'locating' ? (
                                <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <MapPinIcon className="w-12 h-12 text-blue-400"/>
                                    <p className="mt-2 font-bold text-white bg-black/50 px-3 py-1 rounded-md">{location}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                     <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Remote Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <ActionButton icon={MapPinIcon} label="Locate" onClick={handleLocate} disabled={status !== 'idle'}/>
                            <ActionButton icon={VolumeIcon} label="Sound Alarm" onClick={handleAlarm} disabled={status !== 'idle'}/>
                            <ActionButton icon={LockIcon} label="Lock Device" onClick={() => setShowLockModal(true)} disabled={status !== 'idle'}/>
                            <ActionButton icon={WipeIcon} label="Wipe Device" onClick={() => setShowWipeModal(true)} disabled={status !== 'idle'} variant="danger"/>
                        </div>
                    </div>
                    {status !== 'idle' && (
                        <div className="bg-blue-900/50 text-blue-300 p-4 rounded-lg text-center font-semibold animate-pulse">
                            {status === 'locating' && 'Pinging device location...'}
                            {status === 'alarming' && 'Sounding alarm...'}
                            {status === 'locking' && 'Sending lock command...'}
                            {status === 'wiping' && 'Initiating secure wipe... This device will go offline permanently.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AntiTheft;