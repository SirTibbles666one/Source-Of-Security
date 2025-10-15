import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { TrashIcon } from './icons/TrashIcon';
import { GameControllerIcon } from './icons/GameControllerIcon';
import { BrowserIcon } from './icons/BrowserIcon';
import { RegistryIcon } from './icons/RegistryIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { StartupApp, Game, AiOptimization } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const initialStartupApps: StartupApp[] = [
    { id: 1, name: 'Spotify Web Helper', publisher: 'Spotify AB', impact: 'High', enabled: true },
    { id: 2, name: 'Discord Updater', publisher: 'Discord Inc.', impact: 'Medium', enabled: true },
    { id: 3, name: 'Steam Client Bootstrapper', publisher: 'Valve Corporation', impact: 'High', enabled: false },
    { id: 4, name: 'Creative Cloud Desktop', publisher: 'Adobe Inc.', impact: 'Medium', enabled: true },
];

const initialGames: Game[] = [
    { id: 1, name: 'Cyberpunk 2077', icon: '🤖', path: 'C:\\Games\\Cyberpunk 2077\\bin\\x64\\Cyberpunk2077.exe', detected: true },
    { id: 2, name: 'Baldur\'s Gate 3', icon: '🎲', path: 'C:\\Games\\Baldurs Gate 3\\bin\\bg3.exe', detected: true },
    { id: 3, name: 'Valorant', icon: '🎯', path: 'C:\\Riot Games\\VALORANT\\live\\VALORANT.exe', detected: false },
];

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <div onClick={() => onChange(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${ enabled ? 'bg-purple-600' : 'bg-gray-600' }`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${ enabled ? 'translate-x-6' : 'translate-x-1' }`} />
    </div>
);

const GamingMode: React.FC<{ isGamingMode: boolean; setIsGamingMode: (active: boolean) => void }> = ({ isGamingMode, setIsGamingMode }) => {
    return (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
            <div className="p-6 border-b border-gray-700/50 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold text-gray-200 flex items-center"><GameControllerIcon className="w-6 h-6 mr-3 text-purple-400"/>Gaming Mode</h3>
                    <p className="text-gray-400 mt-1">Maximize performance and silence interruptions for a seamless gaming experience.</p>
                </div>
                <ToggleSwitch enabled={isGamingMode} onChange={setIsGamingMode} />
            </div>
            {isGamingMode && (
                <div className="p-6 bg-purple-900/20">
                    <h4 className="font-semibold text-purple-300 mb-3">Optimizations Active:</h4>
                    <ul className="list-disc list-inside text-sm text-purple-400/80 space-y-1">
                        <li>All non-critical notifications are silenced.</li>
                        <li>Background scans and updates are paused.</li>
                        <li>System resources are prioritized for games.</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

interface PerformanceOptimizerProps {
    isGamingMode: boolean;
    setIsGamingMode: (active: boolean) => void;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ isGamingMode, setIsGamingMode }) => {
    const [startupApps, setStartupApps] = useState(initialStartupApps);
    const [junkFound, setJunkFound] = useState(2.1 * 1024); // in MB
    const [registryIssues, setRegistryIssues] = useState(50);
    const [browserCache, setBrowserCache] = useState(555); // in MB

    const [aiScanStatus, setAiScanStatus] = useState<'idle' | 'scanning' | 'results'>('idle');
    const [aiRecommendations, setAiRecommendations] = useState<AiOptimization[]>([]);

    const runAiScan = async () => {
        setAiScanStatus('scanning');
        setAiRecommendations([]);
        try {
            const highImpactApps = startupApps.filter(a => a.impact === 'High' && a.enabled).map(a => a.name).join(', ');

            const prompt = `You are a performance optimization expert for a security suite app. Based on the following system scan data:
- Junk files: ${junkFound.toFixed(0)} MB
- High impact startup apps: ${highImpactApps || 'None'}
- Browser cache to clean: ${browserCache} MB
- Registry issues: ${registryIssues} total issues found

Generate a list of 3-4 specific, actionable recommendations to improve PC performance. Provide a variety of suggestions based on the data. For startup apps, pick one from the list provided.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                action: { type: Type.STRING },
                                targetId: { type: Type.STRING },
                                buttonText: { type: Type.STRING }
                            },
                            required: ['title', 'description', 'action', 'targetId', 'buttonText']
                        }
                    }
                }
            });
            
            const recommendations = JSON.parse(response.text) as Omit<AiOptimization, 'status'>[];
            setAiRecommendations(recommendations.map(r => ({ ...r, status: 'pending' })));

        } catch (error) {
            console.error("AI Scan failed:", error);
            // Handle error, maybe show a message
        } finally {
            setAiScanStatus('results');
        }
    };

    const handleRecommendationAction = (rec: AiOptimization) => {
        switch (rec.action) {
            case 'clean_junk':
                setJunkFound(0);
                break;
            case 'clean_browsers':
                setBrowserCache(0);
                break;
            case 'clean_registry':
                setRegistryIssues(0);
                break;
            case 'disable_startup':
                setStartupApps(prev => prev.map(app => app.name === rec.targetId ? { ...app, enabled: false } : app));
                break;
        }
        setAiRecommendations(prev => prev.map(r => r.title === rec.title ? { ...r, status: 'done' } : r));
    };
    
    const SimpleToggle: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
        <div onClick={() => onChange(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${ enabled ? 'bg-blue-600' : 'bg-gray-600' }`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${ enabled ? 'translate-x-6' : 'translate-x-1' }`} />
        </div>
    );

    return (
        <div className="animate-fade-in space-y-8">
            <GamingMode isGamingMode={isGamingMode} setIsGamingMode={setIsGamingMode} />
            
            {/* AI Smart Optimization */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-semibold text-gray-200 flex items-center mb-2"><SparklesIcon className="w-6 h-6 mr-3 text-blue-400"/>AI Smart Optimization</h3>
                <p className="text-gray-400 mb-4">Let our AI find personalized optimizations to boost your PC's speed and stability.</p>
                {aiScanStatus === 'idle' && (
                    <button onClick={runAiScan} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg">Run Smart Optimization</button>
                )}
                {aiScanStatus === 'scanning' && (
                    <div className="text-center p-4">
                        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-blue-300 font-semibold">AI is analyzing your system...</p>
                    </div>
                )}
                {aiScanStatus === 'results' && (
                    <div className="space-y-3">
                        {aiRecommendations.map((rec, i) => (
                             <div key={i} className={`p-4 rounded-lg flex items-center justify-between transition-colors ${rec.status === 'done' ? 'bg-green-500/10' : 'bg-gray-900/50'}`}>
                                <div>
                                    <h4 className="font-semibold text-gray-100">{rec.title}</h4>
                                    <p className="text-sm text-gray-400">{rec.description}</p>
                                </div>
                                {rec.status === 'pending' ? (
                                    <button onClick={() => handleRecommendationAction(rec)} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg text-sm whitespace-nowrap">{rec.buttonText}</button>
                                ) : (
                                    <span className="text-green-400 font-semibold flex items-center whitespace-nowrap"><CheckCircleIcon className="w-5 h-5 mr-2" /> Done</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Manual Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Junk Cleaner */}
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                    <h3 className="text-xl font-semibold text-gray-200 flex items-center"><TrashIcon className="w-6 h-6 mr-3 text-blue-400"/>Junk Cleaner</h3>
                    <p className="text-4xl font-bold text-blue-400 my-3">{(junkFound / 1024).toFixed(2)} <span className="text-2xl">GB</span></p>
                    <p className="text-gray-400">{junkFound > 0 ? 'Junk files found' : 'System is Clean!'}</p>
                </div>

                {/* Startup Manager */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="p-6 border-b border-gray-700/50">
                        <h3 className="text-xl font-semibold text-gray-200">Startup Manager</h3>
                    </div>
                    <div className="divide-y divide-gray-800 max-h-40 overflow-y-auto">
                        {startupApps.map(app => (
                            <div key={app.id} className="p-4 flex items-center justify-between hover:bg-gray-800/40">
                                <div>
                                    <p className="font-medium text-gray-200">{app.name}</p>
                                    <p className="text-sm text-gray-500">{app.publisher}</p>
                                </div>
                                <SimpleToggle enabled={app.enabled} onChange={(val) => setStartupApps(prev => prev.map(a => a.id === app.id ? {...a, enabled: val} : a))} />
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Browser Cleaner */}
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                    <h3 className="text-xl font-semibold text-gray-200 flex items-center"><BrowserIcon className="w-6 h-6 mr-3 text-blue-400"/>Browser Cleaner</h3>
                    <p className="text-4xl font-bold text-blue-400 my-3">{browserCache.toFixed(0)} <span className="text-2xl">MB</span></p>
                    <p className="text-gray-400">Browser cache to be cleaned.</p>
                </div>

                {/* Registry Cleaner */}
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                    <h3 className="text-xl font-semibold text-gray-200 flex items-center"><RegistryIcon className="w-6 h-6 mr-3 text-blue-400"/>Registry Cleaner</h3>
                    <p className="text-4xl font-bold text-yellow-400 my-3">{registryIssues}</p>
                    <p className="text-gray-400">Registry issues found.</p>
                </div>
            </div>
        </div>
    );
};

export default PerformanceOptimizer;