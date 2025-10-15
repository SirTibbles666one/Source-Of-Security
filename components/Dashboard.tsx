import React, { useState, useEffect } from 'react';
import { View } from './Sidebar';
import { SecurityIssue } from '../types';
import SecurityScoreDisplay from './SecurityScoreDisplay';
import { ShieldIcon } from './icons/ShieldIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { ScanIcon } from './icons/ScanIcon';

interface DashboardProps {
    setActiveView: (view: View) => void;
    firewallEnabled: boolean;
    ransomwareEnabled: boolean;
    updatesAvailableCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView, firewallEnabled, ransomwareEnabled, updatesAvailableCount }) => {
    const [lastScanDaysAgo] = useState(2); // Mocked for demonstration
    const [score, setScore] = useState(0);
    const [issues, setIssues] = useState<SecurityIssue[]>([]);

    useEffect(() => {
        const MAX_SCORE = 100;
        let currentScore = MAX_SCORE;
        const newIssues: SecurityIssue[] = [];

        if (!firewallEnabled) {
            const points = 25;
            newIssues.push({ id: 'firewall', title: 'Firewall is Disabled', description: 'Your network is exposed to outside threats.', view: 'Firewall', points });
            currentScore -= points;
        }
        if (!ransomwareEnabled) {
            const points = 25;
            newIssues.push({ id: 'ransomware', title: 'Ransomware Shield is Off', description: 'Your files are not protected from encryption attacks.', view: 'Ransomware Protection', points });
            currentScore -= points;
        }
        if (updatesAvailableCount > 0) {
            const points = 20;
            newIssues.push({ id: 'updates', title: 'Software Updates Available', description: `${updatesAvailableCount} programs need updating.`, view: 'Software Updater', points });
            currentScore -= points;
        }
        if (lastScanDaysAgo > 1) {
            const points = 15;
            newIssues.push({ id: 'scan', title: 'Antivirus Scan Overdue', description: `Your last scan was ${lastScanDaysAgo} days ago.`, view: 'Antivirus', points });
            currentScore -= points;
        }

        setScore(Math.max(0, currentScore));
        setIssues(newIssues);
    }, [firewallEnabled, ransomwareEnabled, updatesAvailableCount, lastScanDaysAgo]);
    
    const getStatusMessage = () => {
        if (score === 100) return { text: "You are fully protected", color: "text-green-300" };
        if (score >= 80) return { text: "Your protection is strong", color: "text-green-300" };
        if (score >= 60) return { text: "Your protection is good but could be improved", color: "text-yellow-300" };
        return { text: "Your device is at risk. Please resolve issues.", color: "text-red-300" };
    };

    const statusMessage = getStatusMessage();

    return (
        <div className="animate-fade-in space-y-8">
             <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Welcome back! Here's your current security status.</p>
            </div>
            
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 flex flex-col lg:flex-row items-center justify-center gap-12">
                <SecurityScoreDisplay score={score} />
                <div className="flex-1 text-center lg:text-left">
                    <h2 className={`text-2xl font-bold ${statusMessage.color}`}>{statusMessage.text}</h2>
                    {issues.length > 0 ? (
                        <p className="text-gray-400 mt-2">Resolve the issues below to increase your security score and stay safe.</p>
                    ) : (
                        <p className="text-gray-400 mt-2">Excellent work. Your system's defenses are in top shape.</p>
                    )}
                    <button onClick={() => setActiveView('Antivirus')} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 mx-auto lg:mx-0">
                        <ScanIcon className="w-5 h-5"/>
                        <span>Run Quick Scan</span>
                    </button>
                </div>
            </div>

            {issues.length > 0 && (
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="p-6 border-b border-gray-700/50">
                        <h3 className="text-xl font-semibold text-gray-200 flex items-center">
                             <AlertTriangleIcon className="w-6 h-6 mr-3 text-yellow-400"/>
                             Issues to Fix ({issues.length})
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {issues.map(issue => (
                             <div key={issue.id} className="p-4 flex items-center justify-between hover:bg-gray-800/40">
                                <div>
                                    <p className="font-semibold text-gray-200">{issue.title}</p>
                                    <p className="text-sm text-gray-400">{issue.description}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="font-bold text-yellow-300">+{issue.points} pts</span>
                                    <button onClick={() => setActiveView(issue.view)} className="bg-yellow-500/20 hover:bg-yellow-500/40 text-white font-medium py-2 px-4 rounded-md text-sm whitespace-nowrap">
                                        Fix Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-400">1</p>
                    <p className="text-sm text-gray-400">Threats Quarantined</p>
                </div>
                 <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-400">2.1 GB</p>
                    <p className="text-sm text-gray-400">Junk Files Cleaned</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-400">{updatesAvailableCount}</p>
                    <p className="text-sm text-gray-400">Updates Available</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-400">12</p>
                    <p className="text-sm text-gray-400">Malicious Sites Blocked</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;