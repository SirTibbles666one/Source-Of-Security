
import React, { useState } from 'react';
import { SecureWebsite } from '../types';
import { SafeTransactionsIcon } from './icons/SafeTransactionsIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ShieldIcon } from './icons/ShieldIcon';

const initialWebsites: SecureWebsite[] = [
    { id: 1, url: 'chase.com', type: 'banking' },
    { id: 2, url: 'bankofamerica.com', type: 'banking' },
    { id: 3, url: 'amazon.com', type: 'shopping' },
    { id: 4, url: 'ebay.com', type: 'shopping' },
];

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <div onClick={() => onChange(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${ enabled ? 'bg-green-500' : 'bg-gray-600' }`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${ enabled ? 'translate-x-6' : 'translate-x-1' }`} />
    </div>
);

const SecureBrowserModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-gray-800 rounded-2xl border-2 border-green-500 shadow-2xl max-w-5xl w-full h-[80vh] animate-fade-in flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-2 bg-gray-900 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                    <button onClick={onClose} className="w-3.5 h-3.5 bg-red-500 rounded-full hover:bg-red-600"></button>
                    <div className="w-3.5 h-3.5 bg-yellow-500 rounded-full"></div>
                    <div className="w-3.5 h-3.5 bg-green-500 rounded-full"></div>
                </div>
                 <div className="flex-1 px-4">
                    <div className="bg-gray-700/80 rounded-full py-1.5 px-4 flex items-center text-sm">
                        <ShieldIcon className="w-4 h-4 mr-2 text-green-400"/>
                        <span className="text-gray-300">https://www.your-bank.com</span>
                    </div>
                </div>
                <div className="w-20"></div>
            </div>
            <div className="flex-1 bg-gray-100 text-gray-900 relative">
                 {/* Mock browser content */}
                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-4">Your Bank</h1>
                    <div className="max-w-sm space-y-4">
                        <input type="text" placeholder="Username" className="w-full p-3 border border-gray-300 rounded-md" />
                        <input type="password" placeholder="Password" className="w-full p-3 border border-gray-300 rounded-md" />
                        <button className="w-full p-3 bg-blue-600 text-white font-bold rounded-md">Sign In</button>
                    </div>
                </div>
                 {/* Shopping Assistant Simulation */}
                <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 animate-fade-in">
                    <p className="font-bold text-green-600">Shopping Assistant Active!</p>
                    <p className="text-sm text-gray-600">✓ 2 coupons found & applied!</p>
                </div>
            </div>
            <div className="p-3 bg-gray-900 text-center text-green-400 font-semibold text-sm rounded-b-xl border-t border-t-green-500">
                You are in a Secure Browser session
            </div>
        </div>
    </div>
);

const SafeTransactions: React.FC = () => {
    const [protectionEnabled, setProtectionEnabled] = useState(true);
    const [websites, setWebsites] = useState<SecureWebsite[]>(initialWebsites);
    const [showSecureBrowser, setShowSecureBrowser] = useState(false);

    return (
        <div className="animate-fade-in">
            {showSecureBrowser && <SecureBrowserModal onClose={() => setShowSecureBrowser(false)} />}

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-8 flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-200 flex items-center"><SafeTransactionsIcon className="w-6 h-6 mr-3"/>Safe Transactions</h2>
                    <p className={`text-sm ${protectionEnabled ? 'text-green-400' : 'text-red-400'}`}>
                        {protectionEnabled ? 'Your online banking and shopping is protected.' : 'Protection is disabled! Your financial data may be at risk.'}
                    </p>
                </div>
                <button onClick={() => setShowSecureBrowser(true)} className="w-full md:w-auto mt-4 md:mt-0 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <ShieldIcon className="w-5 h-5" />
                    <span>Launch Secure Browser</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column: Settings */}
                 <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-200">Protection Settings</h3>
                        <ToggleSwitch enabled={protectionEnabled} onChange={setProtectionEnabled} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start bg-gray-900/50 p-3 rounded-md">
                            <CheckCircleIcon className="w-5 h-5 mr-3 text-green-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-medium text-gray-200">Secure Browser</h4>
                                <p className="text-sm text-gray-400">Isolates your browser from threats for banking and shopping.</p>
                            </div>
                        </div>
                        <div className="flex items-start bg-gray-900/50 p-3 rounded-md">
                            <CheckCircleIcon className="w-5 h-5 mr-3 text-green-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-medium text-gray-200">Shopping Assistant</h4>
                                <p className="text-sm text-gray-400">Automatically finds coupons and compares prices.</p>
                            </div>
                        </div>
                         <div className="flex items-start bg-gray-900/50 p-3 rounded-md">
                            <CheckCircleIcon className="w-5 h-5 mr-3 text-green-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-medium text-gray-200">Anti-Phishing & Keylogger Protection</h4>
                                <p className="text-sm text-gray-400">Blocks fake websites and prevents your keystrokes from being recorded.</p>
                            </div>
                        </div>
                    </div>
                 </div>

                {/* Right Column: Protected Websites */}
                 <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-200">Protected Websites</h3>
                            <p className="text-gray-400 text-sm">These sites will automatically open in the Secure Browser.</p>
                        </div>
                         <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg text-sm">Add Site</button>
                    </div>
                     <div className="divide-y divide-gray-800 max-h-80 overflow-y-auto">
                        {websites.map(site => (
                            <div key={site.id} className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-mono text-gray-200">{site.url}</p>
                                </div>
                                <div>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${site.type === 'banking' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>{site.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default SafeTransactions;