import React from 'react';
import { ShieldIcon } from './icons/ShieldIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { ScanIcon } from './icons/ScanIcon';
import { FirewallIcon } from './icons/FirewallIcon';
import { WebProtectionIcon } from './icons/WebProtectionIcon';
import { RansomwareIcon } from './icons/RansomwareIcon';
import { UsbIcon } from './icons/UsbIcon';
import { IdentityIcon } from './icons/IdentityIcon';
import { PrivacyIcon } from './icons/PrivacyIcon';
import { PerformanceIcon } from './icons/PerformanceIcon';
import { NetworkIcon } from './icons/NetworkIcon';
import { ParentalControlsIcon } from './icons/ParentalControlsIcon';
import { UpdaterIcon } from './icons/UpdaterIcon';
import { FileShredderIcon } from './icons/FileShredderIcon';
import { CloudBackupIcon } from './icons/CloudBackupIcon';
import { MobileIcon } from './icons/MobileIcon';
import { SafeTransactionsIcon } from './icons/SafeTransactionsIcon';
import { AntiTheftIcon } from './icons/AntiTheftIcon';
import { SandboxIcon } from './icons/SandboxIcon';
import { UninstallerIcon } from './icons/UninstallerIcon';
import { AiIcon } from './icons/AiIcon';
import { ReportIcon } from './icons/ReportIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { GameControllerIcon } from './icons/GameControllerIcon';
import { SystemIntegrityIcon } from './icons/SystemIntegrityIcon';
import { SchedulerIcon } from './icons/SchedulerIcon';
import { AdminIcon } from './icons/AdminIcon';

export type View = 
    'Dashboard' | 'Antivirus' | 'Firewall' | 'Web Protection' | 'Ransomware Protection' | 'Endpoint Security' |
    'Identity Protection' | 'Privacy' | 'Performance Optimizer' | 'Network Scanner' | 'Parental Controls' | 
    'Software Updater' | 'File Shredder' | 'Cloud Backup' | 'Mobile Security' | 'Safe Transactions' | 'Anti-Theft' |
    'Sandbox' | 'Advanced Uninstaller' | 'System Integrity' | 'Task Scheduler' | 'AI Advisor' | 'Reports' | 'Settings' | 'Admin Panel';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
    isGamingMode: boolean;
}

const mainFeatures = [
    { name: 'Dashboard', icon: DashboardIcon },
    { name: 'Antivirus', icon: ScanIcon },
    { name: 'Firewall', icon: FirewallIcon },
    { name: 'Web Protection', icon: WebProtectionIcon },
    { name: 'Ransomware Protection', icon: RansomwareIcon },
];

const allFeatures = [
    { name: 'Endpoint Security', label: 'Endpoint & USB Intel', icon: UsbIcon },
    { name: 'Identity Protection', label: 'Identity Protection', icon: IdentityIcon },
    { name: 'Privacy', label: 'Privacy', icon: PrivacyIcon },
    { name: 'Performance Optimizer', label: 'Performance', icon: PerformanceIcon },
    { name: 'Network Scanner', label: 'Network Scanner', icon: NetworkIcon },
    { name: 'Parental Controls', label: 'Parental Controls', icon: ParentalControlsIcon },
    { name: 'Software Updater', label: 'Software Updater', icon: UpdaterIcon },
    { name: 'Advanced Uninstaller', label: 'Uninstaller', icon: UninstallerIcon },
    { name: 'File Shredder', label: 'File Shredder', icon: FileShredderIcon },
    { name: 'Cloud Backup', label: 'Cloud Backup', icon: CloudBackupIcon },
    { name: 'Mobile Security', label: 'Mobile Security', icon: MobileIcon },
    { name: 'Safe Transactions', label: 'Safe Transactions', icon: SafeTransactionsIcon },
    { name: 'Anti-Theft', label: 'Anti-Theft', icon: AntiTheftIcon },
    { name: 'Sandbox', label: 'Sandbox', icon: SandboxIcon },
    { name: 'System Integrity', label: 'System Integrity', icon: SystemIntegrityIcon },
    { name: 'Task Scheduler', label: 'Task Scheduler', icon: SchedulerIcon },
];

const otherFeatures = [
    { name: 'AI Advisor', icon: AiIcon },
    { name: 'Reports', icon: ReportIcon },
    { name: 'Settings', icon: SettingsIcon },
    { name: 'Admin Panel', icon: AdminIcon },
];

const NavButton: React.FC<{ name: View; label: string; icon: React.FC<any>; activeView: View; onClick: (view: View) => void }> = ({ name, label, icon: Icon, activeView, onClick }) => {
    const isActive = activeView === name;
    return (
        <button
            onClick={() => onClick(name)}
            className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                isActive
                ? 'bg-blue-600/30 text-blue-300'
                : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
            }`}
        >
            <Icon className="w-6 h-6 mr-4" />
            <span className="font-medium">{label}</span>
        </button>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isGamingMode }) => {
    return (
        <aside className="w-72 bg-gray-800/50 p-4 flex flex-col border-r border-gray-700/50">
            <div className="flex items-center p-4 mb-4">
                <ShieldIcon className="w-8 h-8 text-blue-400 mr-3" />
                <h1 className="text-2xl font-bold text-gray-100">Tibbles</h1>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
                {mainFeatures.map(item => <NavButton key={item.name} name={item.name as View} label={item.name} icon={item.icon} activeView={activeView} onClick={setActiveView} />)}
                <div className="pt-4 mt-4 border-t border-gray-700/50 space-y-2">
                    <h2 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Features</h2>
                    {allFeatures.map(item => <NavButton key={item.name} name={item.name as View} label={item.label} icon={item.icon} activeView={activeView} onClick={setActiveView} />)}
                </div>
                 <div className="pt-4 mt-4 border-t border-gray-700/50 space-y-2">
                     {otherFeatures.map(item => <NavButton key={item.name} name={item.name as View} label={item.name} icon={item.icon} activeView={activeView} onClick={setActiveView} />)}
                </div>
            </nav>

            <div className="mt-4">
                 {isGamingMode && (
                    <div className="p-3 mb-2 bg-purple-900/50 rounded-lg text-purple-300 flex items-center justify-center font-semibold text-sm">
                        <GameControllerIcon className="w-5 h-5 mr-2"/> Gaming Mode ON
                    </div>
                )}
                <div className="p-4 bg-gray-900/50 rounded-lg text-center">
                    <p className="text-green-400 font-semibold">You are protected</p>
                    <p className="text-xs text-gray-500 mt-1">Last update: 5 minutes ago</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;