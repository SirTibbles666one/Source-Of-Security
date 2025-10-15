import React, { useState, useEffect } from 'react';
import Sidebar, { View } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Antivirus from './components/Antivirus';
import Firewall from './components/Firewall';
import WebProtection from './components/WebProtection';
import Ransomware from './components/Ransomware';
import EndpointSecurity from './components/EndpointSecurity';
import IdentityProtection from './components/IdentityProtection';
import Privacy from './components/Privacy';
import PerformanceOptimizer from './components/PerformanceOptimizer';
import NetworkScanner from './components/NetworkScanner';
import ParentalControls from './components/ParentalControls';
import SoftwareUpdater from './components/SoftwareUpdater';
import FileShredder from './components/FileShredder';
import CloudBackup from './components/CloudBackup';
import MobileSecurity from './components/MobileSecurity';
import SafeTransactions from './components/SafeTransactions';
import AntiTheft from './components/AntiTheft';
import Sandbox from './components/Sandbox';
import AiAdvisor from './components/AiAdvisor';
import SecurityReport from './components/SecurityReport';
import Settings from './components/Settings';
import AdvancedUninstaller from './components/AdvancedUninstaller';
import SystemIntegrity from './components/SystemIntegrity';
import Scheduler from './components/Scheduler';
import AdminPanel from './components/AdminPanel';
import TitleBar from './components/TitleBar';
import { AccountKey } from './types';

const getInitialExpiry = () => {
    const date = new Date();
    date.setDate(date.getDate() + 29); // Set expiry for the initial key 29 days from now
    return date.toISOString();
}

const initialGeneratedKeys: AccountKey[] = [
    { 
        id: 1, 
        key: 'TSS-ABCDE-FGHIJ-KLMNO-PQRST', 
        user: 'testuser@example.com', 
        dateGenerated: new Date(Date.now() - 86400000).toLocaleString(),
        duration: '30d',
        expiryDate: getInitialExpiry()
    }
];

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('Dashboard');
    const [isGamingMode, setIsGamingMode] = useState(false);
    const [generatedKeys, setGeneratedKeys] = useState<AccountKey[]>(initialGeneratedKeys);
    const [loggedInUser, setLoggedInUser] = useState<{ email: string; keyData: AccountKey } | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const view = params.get('view');
        if (view) {
            // A simple type assertion after validation
            const validViews: View[] = [
                'Dashboard', 'Antivirus', 'Firewall', 'Web Protection', 'Ransomware Protection', 'Endpoint Security',
                'Identity Protection', 'Privacy', 'Performance Optimizer', 'Network Scanner', 'Parental Controls', 
                'Software Updater', 'File Shredder', 'Cloud Backup', 'Mobile Security', 'Safe Transactions', 'Anti-Theft',
                'Sandbox', 'Advanced Uninstaller', 'System Integrity', 'Task Scheduler', 'AI Advisor', 'Reports', 'Settings', 'Admin Panel'
            ];
            if (validViews.includes(view as View)) {
                setActiveView(view as View);
            }
        }
    }, []);


    const renderView = () => {
        switch (activeView) {
            case 'Dashboard': return <Dashboard setActiveView={setActiveView} />;
            case 'Antivirus': return <Antivirus />;
            case 'Firewall': return <Firewall />;
            case 'Web Protection': return <WebProtection />;
            case 'Ransomware Protection': return <Ransomware />;
            case 'Endpoint Security': return <EndpointSecurity />;
            case 'Identity Protection': return <IdentityProtection />;
            case 'Privacy': return <Privacy />;
            case 'Performance Optimizer': return <PerformanceOptimizer isGamingMode={isGamingMode} setIsGamingMode={setIsGamingMode} />;
            case 'Network Scanner': return <NetworkScanner />;
            case 'Parental Controls': return <ParentalControls />;
            case 'Software Updater': return <SoftwareUpdater />;
            case 'File Shredder': return <FileShredder />;
            case 'Cloud Backup': return <CloudBackup />;
            case 'Mobile Security': return <MobileSecurity />;
            case 'Safe Transactions': return <SafeTransactions />;
            case 'Anti-Theft': return <AntiTheft />;
            case 'Sandbox': return <Sandbox />;
            case 'Advanced Uninstaller': return <AdvancedUninstaller />;
            case 'System Integrity': return <SystemIntegrity />;
            case 'Task Scheduler': return <Scheduler />;
            case 'AI Advisor': return <AiAdvisor />;
            case 'Reports': return <SecurityReport />;
            case 'Settings': return <Settings generatedKeys={generatedKeys} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />;
            case 'Admin Panel': return <AdminPanel generatedKeys={generatedKeys} setGeneratedKeys={setGeneratedKeys} />;
            default: return <Dashboard setActiveView={setActiveView} />;
        }
    };

    return (
        <div className="bg-gray-900 text-gray-100 flex flex-col h-screen font-sans">
            <TitleBar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar activeView={activeView} setActiveView={setActiveView} isGamingMode={isGamingMode} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {renderView()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;