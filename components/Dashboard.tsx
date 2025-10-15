
import React from 'react';
import { View } from './Sidebar';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ScanIcon } from './icons/ScanIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { PerformanceIcon } from './icons/PerformanceIcon';
import { AiIcon } from './icons/AiIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface DashboardProps {
    setActiveView: (view: View) => void;
}

const StatCard: React.FC<{ value: string; label: string; }> = ({ value, label }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg text-center">
        <p className="text-2xl font-bold text-blue-400">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </div>
);

const ActionCard: React.FC<{ icon: React.FC<any>, title: string, description: string, onClick: () => void, buttonText: string }> = ({ icon: Icon, title, description, onClick, buttonText }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex flex-col">
        <div className="flex items-center mb-3">
            <Icon className="w-6 h-6 mr-3 text-blue-400" />
            <h3 className="text-xl font-bold text-gray-200">{title}</h3>
        </div>
        <p className="text-gray-400 mb-4 flex-grow">{description}</p>
        <button onClick={onClick} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-colors">
            {buttonText}
        </button>
    </div>
);

const Recommendation: React.FC<{ title: string; description: string; view: View; setActiveView: (view: View) => void }> = ({ title, description, view, setActiveView }) => (
    <div className="bg-yellow-500/10 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center">
            <AlertTriangleIcon className="w-6 h-6 mr-4 text-yellow-400" />
            <div>
                <h4 className="font-semibold text-yellow-300">{title}</h4>
                <p className="text-sm text-yellow-400/80">{description}</p>
            </div>
        </div>
        <button onClick={() => setActiveView(view)} className="bg-yellow-500/20 hover:bg-yellow-500/40 text-white font-medium py-2 px-4 rounded-md text-sm whitespace-nowrap">
            View Details
        </button>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Welcome back! Here's a summary of your system's security and performance.</p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                <div className="flex items-center mb-4 sm:mb-0">
                    <CheckCircleIcon className="w-12 h-12 text-green-400 mr-4" />
                    <div>
                        <h2 className="text-2xl font-bold text-green-300">Your System is Protected</h2>
                        <p className="text-gray-400">No immediate threats detected. Last scan was 2 hours ago.</p>
                    </div>
                </div>
                <button onClick={() => setActiveView('Antivirus')} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <ScanIcon className="w-5 h-5"/>
                    <span>Run Quick Scan</span>
                </button>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Security Recommendations</h3>
                <Recommendation
                    title="Firewall Rule Review"
                    description="An unknown app 'unknown_agent.exe' has been blocked. Review firewall rules."
                    view="Firewall"
                    setActiveView={setActiveView}
                />
                 <Recommendation
                    title="New Network Device"
                    description="An unrecognized device has connected to your network."
                    view="Network Scanner"
                    setActiveView={setActiveView}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard value="1" label="Threats Quarantined" />
                <StatCard value="2.1 GB" label="Junk Files Cleaned" />
                <StatCard value="4" label="Updates Available" />
                <StatCard value="12" label="Malicious Sites Blocked" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ActionCard 
                    icon={ShieldIcon}
                    title="Security"
                    description="Review and manage your core protection modules like Antivirus and Firewall."
                    onClick={() => setActiveView('Antivirus')}
                    buttonText="Manage Security"
                />
                <ActionCard 
                    icon={PerformanceIcon}
                    title="Performance"
                    description="Optimize your PC by cleaning junk files, managing startup apps, and boosting games."
                    onClick={() => setActiveView('Performance Optimizer')}
                    buttonText="Boost Performance"
                />
                <ActionCard 
                    icon={AiIcon}
                    title="AI Advisor"
                    description="Get personalized security recommendations and insights from our AI."
                    onClick={() => setActiveView('AI Advisor')}
                    buttonText="Ask AI Advisor"
                />
            </div>
        </div>
    );
};

export default Dashboard;
