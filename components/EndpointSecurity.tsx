import React, { useState } from 'react';
import { UsbIcon } from './icons/UsbIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { FolderLockIcon } from './icons/FolderLockIcon';
import { ActivityLogIcon } from './icons/ActivityLogIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { UsbDevice, BlockedExecutionEvent, WhitelistedUsbApp, AnalyzedUsbFile, UsbMonitorEvent, SandboxAnalysis } from '../types';

const initialUsbDevices: UsbDevice[] = [
  { id: 'VID_0781&PID_5583', name: 'SanDisk Ultra', vendor: 'SanDisk', status: 'full_access' },
  { id: 'VID_0951&PID_1666', name: 'Kingston DataTraveler', vendor: 'Kingston', status: 'ask' },
  { id: 'VID_0BC2&PID_2322', name: 'Seagate Expansion', vendor: 'Seagate', status: 'read_only' },
  { id: 'VID_13FE&PID_5500', name: 'Phison USB Device', vendor: 'Phison', status: 'blocked' },
];

const initialBlockedEvents: BlockedExecutionEvent[] = [
    { id: 1, fileName: 'data_recovery.exe', device: 'Kingston DataTraveler', timestamp: '2m ago' },
    { id: 2, fileName: 'firmware_update.exe', device: 'Phison USB Device', timestamp: '1h ago' },
];

const initialWhitelistedApps: WhitelistedUsbApp[] = [
    { id: 1, fileName: 'ventoy.exe', publisher: 'Ventoy' },
    { id: 2, fileName: 'portable_apps_launcher.exe', publisher: 'PortableApps.com' },
];

const initialAnalyzedFiles: AnalyzedUsbFile[] = [
    { id: 1, fileName: 'autorun.inf', sourceDevice: 'Phison USB Device', dateCopied: '1h ago', analysisStatus: 'pending' },
    { id: 2, fileName: 'svchost.exe', sourceDevice: 'Unknown Device', dateCopied: '3h ago', analysisStatus: 'pending' },
];

const initialMonitorEvents: UsbMonitorEvent[] = [
    { id: 1, timestamp: '2m ago', eventType: 'app_blocked', details: 'Blocked data_recovery.exe from Kingston DataTraveler', color: 'red'},
    { id: 2, timestamp: '1h ago', eventType: 'file_copied', details: 'Copied autorun.inf to Vault from Phison USB Device', color: 'blue'},
    { id: 3, timestamp: '1h ago', eventType: 'connected', details: 'Phison USB Device connected', color: 'green'},
];

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <div onClick={() => onChange(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${ enabled ? 'bg-blue-600' : 'bg-gray-600' }`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${ enabled ? 'translate-x-6' : 'translate-x-1' }`} />
    </div>
);

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
                            {report.networkActivity.length > 0 ? report.networkActivity.map((net, i) => <p key={i}>[{net.status}] Connection to {net.ip}:{net.port} ({net.protocol})</p>) : <p>No network activity detected.</p>}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-200 mb-2">System Changes</h3>
                         <div className="bg-gray-900/50 p-3 rounded-md font-mono text-xs text-gray-400 space-y-1">
                            {report.systemChanges.length > 0 ? report.systemChanges.map((chg, i) => <p key={i}>{chg}</p>) : <p>No system changes detected.</p>}
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


const UsbThreatIntelligence: React.FC = () => {
    const [vaultEnabled, setVaultEnabled] = useState(true);
    const [analyzedFiles, setAnalyzedFiles] = useState(initialAnalyzedFiles);
    const [monitorEvents, setMonitorEvents] = useState(initialMonitorEvents);
    const [selectedReport, setSelectedReport] = useState<SandboxAnalysis | null>(null);

    const handleAnalyze = (id: number) => {
        setAnalyzedFiles(files => files.map(f => f.id === id ? { ...f, analysisStatus: 'analyzing' } : f));
        setTimeout(() => {
            setAnalyzedFiles(files => files.map(f => {
                if (f.id !== id) return f;
                
                const random = Math.random();
                let report: SandboxAnalysis;

                if (random > 0.7) { // 30% chance of being Malicious
                    report = {
                        verdict: 'Malicious',
                        behaviorLog: ['Attempted to inject code into svchost.exe', 'Dropped file C:\\Users\\Admin\\AppData\\a.dll', 'Enumerated running processes'],
                        networkActivity: [{ ip: '203.0.113.15', port: 80, protocol: 'TCP', status: 'Blocked' }],
                        systemChanges: ['Created registry key for persistence on startup']
                    };
                } else if (random > 0.3) { // 40% chance of being Suspicious
                    report = {
                        verdict: 'Suspicious',
                        behaviorLog: ['Accessed user documents folder unexpectedly', 'Made a network connection to an unknown IP'],
                        networkActivity: [{ ip: '198.51.100.88', port: 8080, protocol: 'TCP', status: 'Allowed' }],
                        systemChanges: ['Modified an non-executable file type association']
                    };
                } else { // 30% chance of being Clean
                    report = {
                        verdict: 'Clean',
                        behaviorLog: ['Read file properties', 'Accessed standard system libraries'],
                        networkActivity: [],
                        systemChanges: []
                    };
                }
                
                return { ...f, analysisStatus: 'analyzed', analysisReport: report };
            }));
        }, 2500);
    };

    return (
        <>
            {selectedReport && <ForensicReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="p-6 border-b border-gray-700/50 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-200 flex items-center"><FolderLockIcon className="w-6 h-6 mr-3 text-blue-400"/>USB Threat Intelligence</h3>
                        <p className="text-gray-400 text-sm mt-1">Automatically analyze suspicious files and monitor all USB activity.</p>
                    </div>
                    <ToggleSwitch enabled={vaultEnabled} onChange={setVaultEnabled} />
                </div>
                
                <div className="p-6">
                     <h4 className="font-semibold text-gray-300 mb-2">Secure Analysis Vault</h4>
                     <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {analyzedFiles.map(file => (
                            <div key={file.id} className="bg-gray-900/50 p-3 rounded-md flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-mono text-blue-300">{file.fileName}</p>
                                    <p className="text-xs text-gray-500">{file.sourceDevice} - {file.dateCopied}</p>
                                </div>
                                {file.analysisStatus === 'pending' && <button onClick={() => handleAnalyze(file.id)} className="text-blue-400 hover:text-blue-300 text-xs font-bold">Scan &amp; Analyze</button>}
                                {file.analysisStatus === 'analyzing' && <span className="text-xs text-gray-400 animate-pulse">Analyzing...</span>}
                                {file.analysisStatus === 'analyzed' && <button onClick={() => setSelectedReport(file.analysisReport!)} className="text-green-400 hover:text-green-300 text-xs font-bold">View Report</button>}
                            </div>
                        ))}
                     </div>

                     <h4 className="font-semibold text-gray-300 mt-6 mb-2 flex items-center"><ActivityLogIcon className="w-4 h-4 mr-2" />Live USB Monitoring</h4>
                     <div className="space-y-1 max-h-40 overflow-y-auto font-mono text-xs pr-2">
                        {monitorEvents.map(event => (
                            <p key={event.id}>
                                <span className="text-gray-500 mr-2">{event.timestamp}:</span>
                                <span className={`text-${event.color}-400`}>{event.details}</span>
                            </p>
                        ))}
                     </div>
                </div>
            </div>
        </>
    )
}


const EndpointSecurity: React.FC = () => {
  const [devices, setDevices] = useState<UsbDevice[]>(initialUsbDevices);
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  const [appControlEnabled, setAppControlEnabled] = useState(true);
  const [whitelistedApps, setWhitelistedApps] = useState<WhitelistedUsbApp[]>(initialWhitelistedApps);
  const [blockedEvents, setBlockedEvents] = useState<BlockedExecutionEvent[]>(initialBlockedEvents);
  
  const updateDeviceStatus = (id: string, status: UsbDevice['status']) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, status } : device
    ));
  };
  
  const whitelistApp = (event: BlockedExecutionEvent) => {
    setBlockedEvents(prev => prev.filter(e => e.id !== event.id));
    if (!whitelistedApps.some(app => app.fileName === event.fileName)) {
        setWhitelistedApps(prev => [...prev, {id: Date.now(), fileName: event.fileName, publisher: 'Unknown'}]);
    }
  };

  const removeWhitelistedApp = (id: number) => {
    setWhitelistedApps(prev => prev.filter(app => app.id !== id));
  };
  
  const RuleButton: React.FC<{ currentStatus: UsbDevice['status'], targetStatus: UsbDevice['status'], label: string, onClick: () => void, color: string }> = ({ currentStatus, targetStatus, label, onClick, color }) => {
      const isActive = currentStatus === targetStatus;
      return (
          <button onClick={onClick} className={`px-2 py-1 text-xs rounded-md ${isActive ? `bg-${color}-600` : 'bg-gray-700 hover:bg-gray-600'}`}>
              {label}
          </button>
      );
  }

  return (
    <div className="animate-fade-in space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Device Access Control */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-200">Device Access Control</h3>
                        <p className="text-gray-400 text-sm">Manage access for connected USB devices.</p>
                    </div>
                     <ToggleSwitch enabled={protectionEnabled} onChange={setProtectionEnabled} />
                </div>
                <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
                    {devices.map(device => (
                        <div key={device.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                            <div className="flex items-center mb-2 sm:mb-0">
                                <UsbIcon className="w-8 h-8 mr-4 text-gray-400" />
                                <div>
                                    <p className="font-semibold text-gray-200">{device.name}</p>
                                    <p className="text-xs text-gray-500 font-mono">{device.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 self-end sm:self-center">
                               <RuleButton currentStatus={device.status} targetStatus="full_access" label="Full Access" onClick={() => updateDeviceStatus(device.id, 'full_access')} color="green" />
                               <RuleButton currentStatus={device.status} targetStatus="read_only" label="Read-Only" onClick={() => updateDeviceStatus(device.id, 'read_only')} color="yellow" />
                               <RuleButton currentStatus={device.status} targetStatus="blocked" label="Block" onClick={() => updateDeviceStatus(device.id, 'blocked')} color="red" />
                               <RuleButton currentStatus={device.status} targetStatus="ask" label="Ask" onClick={() => updateDeviceStatus(device.id, 'ask')} color="blue" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Application Control */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                 <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-200 flex items-center"><ShieldIcon className="w-5 h-5 mr-3 text-blue-400"/>USB Application Control</h3>
                        <p className="text-gray-400 text-sm">Block unauthorized executables on USB drives.</p>
                    </div>
                    <ToggleSwitch enabled={appControlEnabled} onChange={setAppControlEnabled} />
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                    <h4 className="font-semibold text-gray-300 mb-2">Recently Blocked Attempts</h4>
                    <div className="space-y-2">
                        {blockedEvents.map(event => (
                            <div key={event.id} className="bg-gray-900/50 p-3 rounded-md flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-mono text-red-400">{event.fileName}</p>
                                    <p className="text-xs text-gray-500">{event.device} - {event.timestamp}</p>
                                </div>
                                <button onClick={() => whitelistApp(event)} className="text-blue-400 hover:text-blue-300 text-xs font-bold">Whitelist</button>
                            </div>
                        ))}
                        {blockedEvents.length === 0 && <p className="text-xs text-gray-500 text-center py-2">No recent blocks.</p>}
                    </div>

                    <h4 className="font-semibold text-gray-300 mt-6 mb-2">Whitelisted Applications</h4>
                    <div className="space-y-2">
                         {whitelistedApps.map(app => (
                            <div key={app.id} className="bg-gray-900/50 p-3 rounded-md flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-mono text-green-400">{app.fileName}</p>
                                    <p className="text-xs text-gray-500">Publisher: {app.publisher}</p>
                                </div>
                                <button onClick={() => removeWhitelistedApp(app.id)} className="text-gray-400 hover:text-gray-200 text-xs font-bold">Remove</button>
                            </div>
                        ))}
                        {whitelistedApps.length === 0 && <p className="text-xs text-gray-500 text-center py-2">No applications are whitelisted.</p>}
                    </div>
                </div>
            </div>
        </div>
        <UsbThreatIntelligence />
    </div>
  );
};

export default EndpointSecurity;