import React, { useState } from 'react';
import { AccountKey, KeyDuration } from '../types';
import { AdminIcon } from './icons/AdminIcon';
import { KeyIcon } from './icons/KeyIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface AdminPanelProps {
    generatedKeys: AccountKey[];
    setGeneratedKeys: React.Dispatch<React.SetStateAction<AccountKey[]>>;
}

const getExpiryDate = (duration: KeyDuration): string => {
    if (duration === 'lifetime') return 'Never';
    const date = new Date();
    if (duration === '7d') date.setDate(date.getDate() + 7);
    else if (duration === '30d') date.setDate(date.getDate() + 30);
    else if (duration === '1y') date.setFullYear(date.getFullYear() + 1);
    return date.toISOString();
};

const getKeyStatus = (expiryDate: string): { text: string; color: string } => {
    if (expiryDate === 'Never') {
        return { text: 'Active', color: 'text-green-400' };
    }
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24);

    if (daysLeft < 0) {
        return { text: 'Expired', color: 'text-red-400' };
    }
    if (daysLeft <= 7) {
        return { text: `Expires in ${Math.ceil(daysLeft)}d`, color: 'text-yellow-400' };
    }
    return { text: 'Active', color: 'text-green-400' };
};

const DurationOption: React.FC<{ value: KeyDuration; label: string; selected: KeyDuration; onChange: (value: KeyDuration) => void }> = ({ value, label, selected, onChange }) => (
    <label className={`px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium ${selected === value ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
        <input type="radio" name="duration" value={value} checked={selected === value} onChange={() => onChange(value)} className="hidden" />
        {label}
    </label>
);

const AdminPanel: React.FC<AdminPanelProps> = ({ generatedKeys, setGeneratedKeys }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const [userName, setUserName] = useState('');
    const [duration, setDuration] = useState<KeyDuration>('30d');
    const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<AccountKey | null>(null);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === 'samsmith91@tutanota.com' && password === 'N2szU7VR') {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    const generateKeyString = () => {
        return 'TSS-' + Array.from({ length: 4 }, () => 
            Math.random().toString(36).substring(2, 8).toUpperCase()
        ).join('-');
    };

    const handleGenerateKey = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName.trim()) return;

        const newKey: AccountKey = {
            id: Date.now(),
            user: userName.trim(),
            key: generateKeyString(),
            dateGenerated: new Date().toLocaleString(),
            duration: duration,
            expiryDate: getExpiryDate(duration),
        };

        setGeneratedKeys(prev => [newKey, ...prev]);
        setNewlyGeneratedKey(newKey);
        setUserName('');
    };
    
    const copyToClipboard = (key: string) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    if (!isLoggedIn) {
        return (
            <div className="animate-fade-in flex items-center justify-center h-full">
                <div className="w-full max-w-md bg-gray-800/50 p-8 rounded-xl border border-gray-700/50">
                    <div className="text-center mb-6">
                        <AdminIcon className="w-12 h-12 mx-auto text-blue-400 mb-2"/>
                        <h1 className="text-2xl font-bold text-gray-100">Admin Panel Login</h1>
                        <p className="text-gray-400">Restricted Access</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                 <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                    <p className="text-gray-400">Welcome, Sam Smith. Generate and manage user account keys.</p>
                </div>
                <button onClick={() => setIsLoggedIn(false)} className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg text-sm">Logout</button>
            </div>
           
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                <h2 className="text-xl font-bold text-gray-200 mb-4">Generate Account Key</h2>
                <form onSubmit={handleGenerateKey}>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Enter user's name or email"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                            className="flex-grow bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" disabled={!userName.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2">
                            <KeyIcon className="w-5 h-5"/>
                            <span>Generate</span>
                        </button>
                    </div>
                     <div className="flex items-center justify-center space-x-3 mt-4">
                        <span className="text-sm font-medium text-gray-400">Duration:</span>
                        <DurationOption value="7d" label="7 Days" selected={duration} onChange={setDuration} />
                        <DurationOption value="30d" label="30 Days" selected={duration} onChange={setDuration} />
                        <DurationOption value="1y" label="1 Year" selected={duration} onChange={setDuration} />
                        <DurationOption value="lifetime" label="Lifetime" selected={duration} onChange={setDuration} />
                    </div>
                </form>
                {newlyGeneratedKey && (
                    <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/50 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-300">New key for <span className="font-bold">{newlyGeneratedKey.user}</span>:</p>
                            <p className="font-mono text-lg text-white">{newlyGeneratedKey.key}</p>
                            <p className="text-xs text-blue-400/80">Expires: {newlyGeneratedKey.expiryDate === 'Never' ? 'Never' : new Date(newlyGeneratedKey.expiryDate).toLocaleDateString()}</p>
                        </div>
                         <button onClick={() => copyToClipboard(newlyGeneratedKey.key)} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-md">
                            {copiedKey === newlyGeneratedKey.key ? <CheckCircleIcon className="w-5 h-5 text-white" /> : <CopyIcon className="w-5 h-5 text-white" />}
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="p-6 border-b border-gray-700/50">
                    <h3 className="text-xl font-semibold text-gray-200">Generated Keys ({generatedKeys.length})</h3>
                </div>
                <div className="max-h-[50vh] overflow-y-auto">
                    {generatedKeys.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="p-4 font-semibold text-sm text-gray-400">User</th>
                                    <th className="p-4 font-semibold text-sm text-gray-400">Key</th>
                                    <th className="p-4 font-semibold text-sm text-gray-400">Expires On</th>
                                    <th className="p-4 font-semibold text-sm text-gray-400">Status</th>
                                    <th className="p-4 font-semibold text-sm text-gray-400 text-right">Copy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generatedKeys.map(k => {
                                    const status = getKeyStatus(k.expiryDate);
                                    return (
                                        <tr key={k.id} className="border-b border-gray-800">
                                            <td className="p-4 text-gray-200 font-semibold">{k.user}</td>
                                            <td className="p-4 text-blue-300 font-mono text-sm">{k.key}</td>
                                            <td className="p-4 text-gray-400 text-sm">{k.expiryDate === 'Never' ? 'Never' : new Date(k.expiryDate).toLocaleDateString()}</td>
                                            <td className="p-4 text-sm font-semibold">
                                                <span className={status.color}>{status.text}</span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => copyToClipboard(k.key)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                                                    {copiedKey === k.key ? <CheckCircleIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5 text-gray-300" />}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500 py-10">No keys generated yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;