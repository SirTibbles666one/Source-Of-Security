import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { GlobeIcon } from './icons/GlobeIcon';
import { KeyIcon } from './icons/KeyIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { Breach, PasswordEntry } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { CopyIcon } from './icons/CopyIcon';

const mockBreaches: Breach[] = [
    { site: 'socialnetwork.com', date: '2023-05-15', compromisedData: ['Email', 'Password', 'Phone Number'] },
    { site: 'ecommercesite.net', date: '2022-11-01', compromisedData: ['Email', 'Password', 'Address'] },
];

const mockPasswords: PasswordEntry[] = [
    { id: 1, website: 'socialnetwork.com', username: 'user@example.com', health: 'Vulnerable' },
    { id: 2, website: 'streaming-service.com', username: 'user@example.com', health: 'Reused' },
    { id: 3, website: 'work-portal.com', username: 'user', health: 'Weak' },
    { id: 4, website: 'secure-bank.com', username: 'user@example.com', health: 'Strong' },
    { id: 5, website: 'ecommercesite.net', username: 'user@example.com', health: 'Reused' },
    { id: 6, website: 'gaming-forum.org', username: 'my_user', health: 'Strong' },
];

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const DarkWebMonitor: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [breachesFound, setBreachesFound] = useState<Breach[]>([]);

    const handleScan = () => {
        setIsScanning(true);
        setScanComplete(false);
        setBreachesFound([]);
        setTimeout(() => {
            setBreachesFound(mockBreaches);
            setIsScanning(false);
            setScanComplete(true);
        }, 3000);
    };

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-xl font-semibold mb-2 text-gray-200 flex items-center"><GlobeIcon className="w-6 h-6 mr-3 text-blue-400" />Dark Web Monitoring</h3>
            <p className="text-gray-400 mb-4">We scan for your email address in data breaches.</p>
            <div className="bg-gray-900/50 p-3 rounded-md text-gray-300 mb-4">user@example.com</div>
            <button onClick={handleScan} disabled={isScanning} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors">
                {isScanning ? 'Scanning...' : 'Scan Now'}
            </button>
            {scanComplete && (
                <div className="mt-4">
                    {breachesFound.length > 0 ? (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">
                            <h4 className="font-bold flex items-center"><AlertTriangleIcon className="w-5 h-5 mr-2"/>Found in {breachesFound.length} data breaches!</h4>
                            <ul className="mt-2 space-y-2 text-sm">
                                {breachesFound.map(b => <li key={b.site}><strong>{b.site}</strong>: {b.compromisedData.join(', ')}</li>)}
                            </ul>
                        </div>
                    ) : (
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300">
                             <h4 className="font-bold flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2"/>Good news! Your email was not found in any new breaches.</h4>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const PasswordGeneratorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generatePassword = async () => {
        setIsLoading(true);
        setPassword('');
        setCopied(false);
        
        let prompt = `Generate a secure, random password. It must be exactly ${length} characters long.`;
        const requirements = [];
        if (includeUppercase) requirements.push('uppercase letters (A-Z)');
        if (includeNumbers) requirements.push('numbers (0-9)');
        if (includeSymbols) requirements.push('symbols (e.g., !@#$%)');

        if (requirements.length > 0) {
            prompt += ` It must include ${requirements.join(', ')}.`;
        }
        prompt += ' Only return the password itself, with no extra text, explanation, or markdown.';

        try {
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setPassword(response.text.trim());
        } catch (e) {
            console.error(e);
            setPassword('Error generating password');
        } finally {
            setIsLoading(false);
        }
    };
    
    const copyToClipboard = () => {
        if (!password) return;
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-lg w-full animate-fade-in">
                <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center"><SparklesIcon className="w-6 h-6 mr-3 text-blue-400"/>Strong Password Generator</h2>
                
                <div className="relative p-4 bg-gray-900/50 rounded-lg font-mono text-xl text-center mb-4 min-h-[60px] flex items-center justify-center">
                    {isLoading ? (
                        <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <span className={password ? 'text-gray-200' : 'text-gray-500'}>{password || 'Click Generate'}</span>
                    )}
                    {password && !isLoading && (
                        <button onClick={copyToClipboard} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                            {copied ? <CheckCircleIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5 text-gray-300" />}
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="flex justify-between items-center text-gray-300">Password Length: <span className="font-bold text-blue-300">{length}</span></label>
                        <input type="range" min="8" max="32" value={length} onChange={e => setLength(parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="uppercase" checked={includeUppercase} onChange={e => setIncludeUppercase(e.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                        <label htmlFor="uppercase" className="ml-2 text-sm text-gray-300">Include Uppercase (A-Z)</label>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="numbers" checked={includeNumbers} onChange={e => setIncludeNumbers(e.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                        <label htmlFor="numbers" className="ml-2 text-sm text-gray-300">Include Numbers (0-9)</label>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="symbols" checked={includeSymbols} onChange={e => setIncludeSymbols(e.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                        <label htmlFor="symbols" className="ml-2 text-sm text-gray-300">Include Symbols (!@#$%)</label>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg">Close</button>
                    <button onClick={generatePassword} disabled={isLoading} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg disabled:bg-gray-500">Generate</button>
                </div>
            </div>
        </div>
    );
};


const PasswordManager: React.FC = () => {
    const [showGenerator, setShowGenerator] = useState(false);

    const healthColors: Record<PasswordEntry['health'], string> = {
        'Vulnerable': 'border-red-500/50 bg-red-500/10 text-red-300',
        'Reused': 'border-orange-500/50 bg-orange-500/10 text-orange-300',
        'Weak': 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300',
        'Strong': 'border-green-500/50 bg-green-500/10 text-green-300',
    };

    return (
        <>
            {showGenerator && <PasswordGeneratorModal onClose={() => setShowGenerator(false)} />}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-200 flex items-center"><KeyIcon className="w-6 h-6 mr-3 text-blue-400" />Password Health</h3>
                    <button onClick={() => setShowGenerator(true)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Generate Password</span>
                    </button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {mockPasswords.map(p => (
                        <div key={p.id} className={`p-3 rounded-md border flex items-center justify-between ${healthColors[p.health]}`}>
                            <div>
                                <p className="font-semibold text-gray-200">{p.website}</p>
                                <p className="text-xs text-gray-400 font-mono">{p.username}</p>
                            </div>
                            <span className="text-xs font-bold">{p.health}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

const IdentityProtection: React.FC = () => {
  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
            <DarkWebMonitor />
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                <h3 className="text-xl font-semibold mb-2 text-gray-200 flex items-center"><ShieldIcon className="w-6 h-6 mr-3 text-blue-400" />Secure Vault</h3>
                <p className="text-gray-400 mb-4">Encrypt and store your most sensitive files.</p>
                <div className="w-full bg-gray-700 rounded-full h-4 my-4">
                    <div className="bg-blue-600 h-4 rounded-full" style={{ width: `25%` }}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                    <span>2.5 GB Used</span>
                    <span>10 GB Total</span>
                </div>
                <button className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 rounded-lg transition-colors">
                    Open Vault
                </button>
            </div>
        </div>
        <div className="space-y-8">
            <PasswordManager />
        </div>
    </div>
  );
};

export default IdentityProtection;