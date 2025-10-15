

import React, { useState, useMemo } from 'react';
import { SecurityEvent, EventSeverity, EventModule } from '../types';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

// Generate more diverse and realistic mock data
const now = new Date();
const mockEvents: SecurityEvent[] = [
    { id: 1, timestamp: new Date(now.getTime() - 2 * 60 * 1000), module: 'Antivirus', severity: 'Critical', description: 'Threat detected: Trojan.Win32/Wacatac.B!ml', action: 'Quarantined' },
    { id: 2, timestamp: new Date(now.getTime() - 5 * 60 * 1000), module: 'Web Protection', severity: 'High', description: 'Blocked phishing site: paypal-login.com', action: 'Blocked' },
    { id: 3, timestamp: new Date(now.getTime() - 10 * 60 * 1000), module: 'Firewall', severity: 'Medium', description: 'Blocked incoming connection to svchost.exe on port 135', action: 'Blocked' },
    { id: 4, timestamp: new Date(now.getTime() - 30 * 60 * 1000), module: 'Ransomware', severity: 'Critical', description: 'Blocked unknown_encryptor.exe from modifying Documents', action: 'Blocked' },
    { id: 5, timestamp: new Date(now.getTime() - 1 * 3600 * 1000), module: 'Network', severity: 'High', description: 'New unknown device detected on network (192.168.1.88)', action: 'Alert' },
    { id: 6, timestamp: new Date(now.getTime() - 2 * 3600 * 1000), module: 'System', severity: 'Informational', description: 'Software update applied for Google Chrome', action: 'Updated' },
    { id: 7, timestamp: new Date(now.getTime() - 5 * 3600 * 1000), module: 'Privacy', severity: 'Medium', description: 'Blocked webcam access for unknown_app.exe', action: 'Blocked' },
    { id: 8, timestamp: new Date(now.getTime() - 6 * 3600 * 1000), module: 'Integrity', severity: 'High', description: 'Unauthorized change to kernel32.dll', action: 'Restored' },
    { id: 9, timestamp: new Date(now.getTime() - 2 * 24 * 3600 * 1000), module: 'Antivirus', severity: 'Informational', description: 'Quick Scan completed. No threats found.', action: 'Scan Complete' },
    { id: 10, timestamp: new Date(now.getTime() - 3 * 24 * 3600 * 1000), module: 'Web Protection', severity: 'High', description: 'Blocked malware site: bad-download.net/file.zip', action: 'Blocked' },
    { id: 11, timestamp: new Date(now.getTime() - 8 * 24 * 3600 * 1000), module: 'System', severity: 'Informational', description: 'File shredded: old_tax_records.pdf', action: 'Deleted' },
];

const severityConfig: Record<EventSeverity, { color: string, icon: React.FC<any> }> = {
    'Critical': { color: 'text-red-400', icon: AlertTriangleIcon },
    'High': { color: 'text-orange-400', icon: AlertTriangleIcon },
    'Medium': { color: 'text-yellow-400', icon: AlertTriangleIcon },
    'Informational': { color: 'text-blue-400', icon: CheckCircleIcon },
};

const moduleColors: Record<EventModule, string> = {
    'Antivirus': 'bg-red-500/20 text-red-300',
    'Firewall': 'bg-orange-500/20 text-orange-300',
    'Web Protection': 'bg-yellow-500/20 text-yellow-300',
    'Ransomware': 'bg-purple-500/20 text-purple-300',
    'Network': 'bg-blue-500/20 text-blue-300',
    'Privacy': 'bg-teal-500/20 text-teal-300',
    'System': 'bg-gray-500/20 text-gray-300',
    'Integrity': 'bg-indigo-500/20 text-indigo-300',
};


const SecurityReport: React.FC = () => {
    const [timeFilter, setTimeFilter] = useState<number>(7); // days
    const [moduleFilter, setModuleFilter] = useState<EventModule | 'all'>('all');
    const [severityFilter, setSeverityFilter] = useState<EventSeverity | 'all'>('all');
    
    const filteredEvents = useMemo(() => {
        const timeCutoff = new Date(now.getTime() - timeFilter * 24 * 3600 * 1000);
        return mockEvents.filter(event => {
            const matchesTime = event.timestamp >= timeCutoff;
            const matchesModule = moduleFilter === 'all' || event.module === moduleFilter;
            const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
            return matchesTime && matchesModule && matchesSeverity;
        });
    }, [timeFilter, moduleFilter, severityFilter]);
    
    const summaryStats = useMemo(() => ({
        threats: filteredEvents.filter(e => e.module === 'Antivirus' && e.severity === 'Critical').length,
        sites: filteredEvents.filter(e => e.module === 'Web Protection').length,
        network: filteredEvents.filter(e => e.module === 'Network' && e.severity === 'High').length,
        ransomware: filteredEvents.filter(e => e.module === 'Ransomware').length,
        integrity: filteredEvents.filter(e => e.module === 'Integrity').length,
    }), [filteredEvents]);
    
    const FilterDropdown: React.FC<{ options: string[], value: string, onChange: (value: any) => void, label: string }> = ({ options, value, onChange, label }) => (
        <div>
            <label className="text-xs text-gray-400">{label}</label>
            <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-8">
                <h2 className="text-2xl font-bold text-gray-200 mb-4">Security Report Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div>
                        <label className="text-xs text-gray-400">Time Range</label>
                         <select value={timeFilter} onChange={e => setTimeFilter(parseInt(e.target.value))} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value={1}>Last 24 hours</option>
                            <option value={7}>Last 7 days</option>
                            <option value={30}>Last 30 days</option>
                        </select>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-red-400">{summaryStats.threats}</p>
                        <p className="text-sm text-gray-400">Threats Detected</p>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-yellow-400">{summaryStats.sites}</p>
                        <p className="text-sm text-gray-400">Sites Blocked</p>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-blue-400">{summaryStats.network}</p>
                        <p className="text-sm text-gray-400">Network Events</p>
                    </div>
                     <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-purple-400">{summaryStats.ransomware}</p>
                        <p className="text-sm text-gray-400">Ransomware Blocks</p>
                    </div>
                     <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-indigo-400">{summaryStats.integrity}</p>
                        <p className="text-sm text-gray-400">Integrity Alerts</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="p-6 border-b border-gray-700/50">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-200">Unified Event Log</h3>
                            <p className="text-gray-400">Detailed history of all security activity.</p>
                        </div>
                        <div className="grid grid-cols-2 md:flex gap-4">
                            <FilterDropdown label="Module" options={Object.keys(moduleColors)} value={moduleFilter} onChange={setModuleFilter} />
                            <FilterDropdown label="Severity" options={Object.keys(severityConfig)} value={severityFilter} onChange={setSeverityFilter} />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-gray-400">Timestamp</th>
                                <th className="p-4 font-semibold text-sm text-gray-400">Module</th>
                                <th className="p-4 font-semibold text-sm text-gray-400">Severity</th>
                                <th className="p-4 font-semibold text-sm text-gray-400">Description</th>
                                <th className="p-4 font-semibold text-sm text-gray-400">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map(event => {
                                const Icon = severityConfig[event.severity].icon;
                                return (
                                <tr key={event.id} className="border-t border-gray-800 hover:bg-gray-800/40 transition-colors">
                                    <td className="p-4 text-gray-400 text-sm whitespace-nowrap">{event.timestamp.toLocaleString()}</td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${moduleColors[event.module]}`}>{event.module}</span></td>
                                    <td className="p-4">
                                        <div className={`flex items-center text-sm font-semibold ${severityConfig[event.severity].color}`}>
                                            <Icon className="w-4 h-4 mr-2"/>
                                            {event.severity}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-300 text-sm">{event.description}</td>
                                    <td className="p-4 text-gray-300 text-sm font-semibold">{event.action}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                     {filteredEvents.length === 0 && <p className="text-center text-gray-500 py-16">No events match the current filters.</p>}
                </div>
            </div>
        </div>
    );
};

export default SecurityReport;