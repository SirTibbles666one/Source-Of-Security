import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon';
import { BellIcon } from './icons/BellIcon';
import { InfoIcon } from './icons/InfoIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { AccountKey } from '../types';

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <div onClick={() => onChange(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${enabled ? 'bg-blue-600' : 'bg-gray-600'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </div>
);

const SettingsCard: React.FC<{ icon: React.FC<any>, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
        <div className="p-6 border-b border-gray-700/50 flex items-center">
            <Icon className="w-6 h-6 mr-4 text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
        </div>
        <div className="p-6 space-y-4">
            {children}
        </div>
    </div>
);

const SettingRow: React.FC<{ label: string, description: string, children: React.ReactNode }> = ({ label, description, children }) => (
    <div className="flex justify-between items-center">
        <div>
            <p className="font-medium text-gray-200">{label}</p>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
        <div>{children}</div>
    </div>
);

interface SettingsProps {
    generatedKeys: AccountKey[];
    loggedInUser: { email: string; keyData: AccountKey } | null;
    setLoggedInUser: React.Dispatch<React.SetStateAction<{ email: string; keyData: AccountKey } | null>>;
}

const AccountManager: React.FC<SettingsProps> = ({ generatedKeys, loggedInUser, setLoggedInUser }) => {
    const [email, setEmail] = useState('');
    const [accountKey, setAccountKey] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const foundKey = generatedKeys.find(k => k.user.toLowerCase() === email.trim().toLowerCase() && k.key === accountKey.trim());
        
        if (foundKey) {
            if (foundKey.expiryDate !== 'Never') {
                const expiry = new Date(foundKey.expiryDate);
                if (expiry < new Date()) {
                    setError('This account key has expired.');
                    return;
                }
            }
            setLoggedInUser({ email: foundKey.user, keyData: foundKey });
            setEmail('');
            setAccountKey('');
        } else {
            setError('Invalid email or account key.');
        }
    };

    const handleLogout = () => {
        setLoggedInUser(null);
    };

    if (loggedInUser) {
        const expiryText = loggedInUser.keyData.expiryDate === 'Never'
            ? 'Subscription: Lifetime'
            : `Subscription expires on: ${new Date(loggedInUser.keyData.expiryDate).toLocaleDateString()}`;

        return (
            <div className="text-center">
                <p className="text-gray-400">You are signed in as:</p>
                <p className="font-semibold text-lg text-blue-300 my-2">{loggedInUser.email}</p>
                <p className="text-green-400 font-semibold text-sm">Tibbles Source Of Security</p>
                <p className="text-gray-400 text-sm mt-1">{expiryText}</p>
                <button onClick={handleLogout} className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg">
                    Logout
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter the email provided to the admin"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Account Key</label>
                <input
                    type="text"
                    value={accountKey}
                    onChange={e => setAccountKey(e.target.value)}
                    placeholder="Enter your TSS-XXXX-XXXX key"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            {error && <p className="text-red-400 text-center text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors">
                Activate
            </button>
        </form>
    );
};

const Settings: React.FC<SettingsProps> = (props) => {
    const [generalSettings, setGeneralSettings] = useState({
        startWithWindows: true,
        automaticUpdates: true,
        gamingMode: false,
    });
    const [notificationSettings, setNotificationSettings] = useState({
        threatAlerts: true,
        scanComplete: true,
        productUpdates: false,
    });

    const handleGeneralChange = (key: keyof typeof generalSettings, value: boolean) => {
        setGeneralSettings(prev => ({ ...prev, [key]: value }));
    };
    const handleNotificationChange = (key: keyof typeof notificationSettings, value: boolean) => {
        setNotificationSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage application preferences and account settings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                    <SettingsCard icon={SettingsIcon} title="General">
                        <SettingRow label="Start with Windows" description="Launch the application when your computer starts.">
                            <ToggleSwitch enabled={generalSettings.startWithWindows} onChange={(val) => handleGeneralChange('startWithWindows', val)} />
                        </SettingRow>
                        <SettingRow label="Automatic Updates" description="Keep the application and virus definitions up to date.">
                             <ToggleSwitch enabled={generalSettings.automaticUpdates} onChange={(val) => handleGeneralChange('automaticUpdates', val)} />
                        </SettingRow>
                         <SettingRow label="Automatic Gaming Mode" description="Automatically detect games and optimize performance.">
                             <ToggleSwitch enabled={generalSettings.gamingMode} onChange={(val) => handleGeneralChange('gamingMode', val)} />
                        </SettingRow>
                    </SettingsCard>

                    <SettingsCard icon={BellIcon} title="Notifications">
                         <SettingRow label="Threat Alerts" description="Notify me when a threat is blocked or quarantined.">
                            <ToggleSwitch enabled={notificationSettings.threatAlerts} onChange={(val) => handleNotificationChange('threatAlerts', val)} />
                        </SettingRow>
                         <SettingRow label="Scan Complete" description="Show a notification when a scan is finished.">
                             <ToggleSwitch enabled={notificationSettings.scanComplete} onChange={(val) => handleNotificationChange('scanComplete', val)} />
                        </SettingRow>
                         <SettingRow label="Product News & Offers" description="Receive updates about new features and promotions.">
                             <ToggleSwitch enabled={notificationSettings.productUpdates} onChange={(val) => handleNotificationChange('productUpdates', val)} />
                        </SettingRow>
                    </SettingsCard>
                </div>
                <div className="space-y-8">
                    <SettingsCard icon={UserIcon} title="Account & Subscription">
                       <AccountManager {...props} />
                    </SettingsCard>
                    <SettingsCard icon={InfoIcon} title="About">
                         <div className="text-center">
                             <p className="font-bold text-xl text-gray-200">Tibbles Source Of Security</p>
                             <p className="text-sm text-gray-400 mt-1">Version: 2024.5.1</p>
                             <p className="text-xs text-gray-500 mt-1">Virus Definitions: 1.35.21.0</p>
                             <div className="mt-4 space-x-4">
                                 <a href="#" className="text-blue-400 hover:underline text-sm">Privacy Policy</a>
                                 <a href="#" className="text-blue-400 hover:underline text-sm">EULA</a>
                             </div>
                         </div>
                    </SettingsCard>
                </div>
            </div>
        </div>
    );
};

export default Settings;