import React, { useState } from 'react';

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <div onClick={() => onChange(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${ enabled ? 'bg-blue-600' : 'bg-gray-600' }`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${ enabled ? 'translate-x-6' : 'translate-x-1' }`} />
    </div>
);

const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg text-center">
        <p className="text-3xl font-bold text-blue-400">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </div>
);


const WebProtection: React.FC = () => {
    const [threatBlocking, setThreatBlocking] = useState(true);
    const [adBlocking, setAdBlocking] = useState(true);
    const [trackerBlocking, setTrackerBlocking] = useState(true);

    const recentActivity = [
        { type: 'Phishing', action: 'Blocked', detail: 'malicious-site.com/login', time: '1m ago', color: 'text-red-400'},
        { type: 'Tracker', action: 'Blocked', detail: 'doubleclick.net', time: '3m ago', color: 'text-yellow-400'},
        { type: 'Malware', action: 'Blocked', detail: 'bad-download.net/file.zip', time: '1h ago', color: 'text-red-400'},
        { type: 'Tracker', action: 'Blocked', detail: 'google-analytics.com', time: '2h ago', color: 'text-yellow-400'},
    ];
    
    return (
        <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Toggles & Stats */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4">Protection Settings</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium text-gray-200">Malicious Site Blocking</h4>
                                    <p className="text-sm text-gray-400">Blocks phishing & malware sites.</p>
                                </div>
                                <ToggleSwitch enabled={threatBlocking} onChange={setThreatBlocking} />
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium text-gray-200">Ad Blocker</h4>
                                     <p className="text-sm text-gray-400">Removes annoying ads.</p>
                                </div>
                                <ToggleSwitch enabled={adBlocking} onChange={setAdBlocking} />
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium text-gray-200">Tracker Blocker</h4>
                                    <p className="text-sm text-gray-400">Prevents online tracking.</p>
                                </div>
                                <ToggleSwitch enabled={trackerBlocking} onChange={setTrackerBlocking} />
                            </div>
                        </div>
                    </div>
                     <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4">Browsing Statistics (24h)</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <StatCard value="1,204" label="Pages Scanned" />
                            <StatCard value="12" label="Threats Blocked" />
                            <StatCard value="2,841" label="Trackers Blocked" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity Log */}
                <div className="lg:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="p-6 border-b border-gray-700/50">
                        <h3 className="text-xl font-semibold text-gray-200">Recent Activity</h3>
                        <p className="text-gray-400">A log of recently blocked threats and trackers.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {recentActivity.map((item, index) => (
                            <div key={index} className="flex items-center text-sm">
                                <div className={`font-semibold ${item.color} w-24 flex-shrink-0`}>[{item.type}]</div>
                                <div className="flex-1 font-mono text-gray-300 truncate mr-4">{item.detail}</div>
                                <div className="text-gray-500 ml-auto">{item.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebProtection;