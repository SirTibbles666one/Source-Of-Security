
import React, { useState, useMemo } from 'react';
import { NetworkDevice } from '../types';
import { NetworkIcon } from './icons/NetworkIcon';
import { RouterIcon } from './icons/RouterIcon';
import { ComputerIcon } from './icons/ComputerIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const mockDevices: NetworkDevice[] = [
    { id: 'A1:B2:C3:D4:E5:F6', ip: '192.168.1.1', name: 'RT-AX88U', manufacturer: 'ASUS', type: 'router', status: 'vulnerable', vulnerability: 'Default admin password is in use.', isTrusted: true },
    { id: 'B2:C3:D4:E5:F6:A1', ip: '192.168.1.50', name: 'DESKTOP-JSMITH', manufacturer: 'Self-built', type: 'computer', status: 'secure', isTrusted: true },
    { id: 'C3:D4:E5:F6:A1:B2', ip: '192.168.1.55', name: 'Jane\'s MacBook Pro', manufacturer: 'Apple, Inc.', type: 'computer', status: 'secure', isTrusted: true },
    { id: 'D4:E5:F6:A1:B2:C3', ip: '192.168.1.62', name: 'Galaxy S23 Ultra', manufacturer: 'Samsung', type: 'phone', status: 'secure', isTrusted: true },
    { id: 'E5:F6:A1:B2:C3:D4', ip: '192.168.1.70', name: 'Living Room TV', manufacturer: 'LG', type: 'iot', status: 'secure', isTrusted: true },
    { id: 'F6:A1:B2:C3:D4:E5', ip: '192.168.1.88', name: 'Unknown Device', manufacturer: 'Espressif', type: 'unknown', status: 'new', isTrusted: false },
];

const getDeviceIcon = (type: NetworkDevice['type']) => {
    switch(type) {
        case 'router': return <RouterIcon className="w-8 h-8 text-blue-400"/>;
        case 'computer': return <ComputerIcon className="w-8 h-8 text-gray-300"/>;
        case 'phone': return <PhoneIcon className="w-8 h-8 text-gray-300"/>;
        default: return <NetworkIcon className="w-8 h-8 text-gray-500"/>;
    }
}

const NetworkScanner: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [devices, setDevices] = useState<NetworkDevice[]>([]);
    
    const startScan = () => {
        setIsScanning(true);
        setScanComplete(false);
        setDevices([]);
        let foundDevices = 0;
        const interval = setInterval(() => {
            if (foundDevices < mockDevices.length) {
                setDevices(prev => [...prev, mockDevices[foundDevices]]);
                foundDevices++;
            } else {
                clearInterval(interval);
                setIsScanning(false);
                setScanComplete(true);
            }
        }, 500);
    };

    const toggleTrust = (id: string) => {
        setDevices(devices.map(d => d.id === id ? { ...d, isTrusted: !d.isTrusted, status: d.status === 'new' ? 'secure' : d.status } : d));
    };

    const statusInfo = useMemo(() => {
        if (!scanComplete) return { text: 'Ready to scan your network for connected devices.', color: 'text-gray-400' };
        const vulnerableCount = devices.filter(d => d.status === 'vulnerable').length;
        const newCount = devices.filter(d => d.status === 'new').length;
        
        if (vulnerableCount > 0 || newCount > 0) {
            return { text: `Scan complete. Found ${vulnerableCount} vulnerable and ${newCount} new device(s).`, color: 'text-yellow-400' };
        }
        return { text: 'Scan complete. Your network appears secure.', color: 'text-green-400' };
    }, [scanComplete, devices]);

    const StatusBadge: React.FC<{device: NetworkDevice}> = ({ device }) => {
        switch(device.status) {
            case 'secure': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 flex items-center"><CheckCircleIcon className="w-3 h-3 mr-1" />Secure</span>;
            case 'vulnerable': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500/20 text-red-300 flex items-center"><AlertTriangleIcon className="w-3 h-3 mr-1" />Vulnerable</span>;
            case 'new': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300">New</span>;
            default: return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-300">Unknown</span>;
        }
    }

    return (
        <div className="animate-fade-in">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-200">Home Network Scanner</h2>
                        <p className={statusInfo.color}>{statusInfo.text}</p>
                    </div>
                    <button onClick={startScan} disabled={isScanning} className="w-full md:w-auto mt-4 md:mt-0 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <NetworkIcon className="w-5 h-5" />
                        <span>{isScanning ? `Scanning... (${devices.length} Found)` : 'Scan Network'}</span>
                    </button>
                </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="p-4 border-b border-gray-700/50 grid grid-cols-12 gap-4 font-semibold text-sm text-gray-400">
                    <div className="col-span-4 md:col-span-3">Device Name</div>
                    <div className="hidden md:block md:col-span-3">IP Address</div>
                    <div className="col-span-4 md:col-span-3">Status</div>
                    <div className="col-span-4 md:col-span-3 text-right">Action</div>
                </div>
                {devices.length === 0 && !isScanning && <p className="text-center text-gray-500 py-16">Scan your network to see connected devices.</p>}
                {devices.map(device => (
                    <div key={device.id} className="p-4 border-b border-gray-800 grid grid-cols-12 gap-4 items-center hover:bg-gray-800/40 transition-colors">
                        <div className="col-span-12 md:col-span-3 flex items-center">
                            {getDeviceIcon(device.type)}
                            <div className="ml-4">
                                <p className="font-semibold text-gray-200">{device.name}</p>
                                <p className="text-xs text-gray-500">{device.manufacturer}</p>
                            </div>
                        </div>
                         <div className="col-span-6 md:col-span-3">
                            <p className="font-mono text-gray-400 text-sm">{device.ip}</p>
                            <p className="font-mono text-gray-600 text-xs hidden md:block">{device.id}</p>
                         </div>
                        <div className="col-span-6 md:col-span-3">
                            <StatusBadge device={device} />
                            {device.vulnerability && <p className="text-xs text-red-400/80 mt-1">{device.vulnerability}</p>}
                        </div>
                        <div className="col-span-12 md:col-span-3 text-right">
                           <button 
                             onClick={() => toggleTrust(device.id)}
                             className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${device.isTrusted ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                           >
                            {device.isTrusted ? 'Untrust' : 'Trust'}
                           </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NetworkScanner;