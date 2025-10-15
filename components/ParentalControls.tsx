
import React, { useState } from 'react';
import { ChildProfile, ContentFilterCategory } from '../types';

const initialFilterCategories: Omit<ContentFilterCategory, 'blocked'>[] = [
    { id: 'adult', label: 'Adult Content' },
    { id: 'social', label: 'Social Media' },
    { id: 'gambling', label: 'Gambling' },
    { id: 'games', label: 'Online Games' },
    { id: 'violence', label: 'Violence & Hate' },
];

const createDefaultFilters = (): ContentFilterCategory[] =>
    initialFilterCategories.map(cat => ({ ...cat, blocked: false }));

const initialProfiles: ChildProfile[] = [
    { 
        id: 1, name: 'Liam', age: 12, avatar: '👦', 
        screenTime: { weekdays: 2, weekends: 4 },
        filters: initialFilterCategories.map(cat => ({ ...cat, blocked: ['adult', 'gambling'].includes(cat.id) }))
    },
    { 
        id: 2, name: 'Sophia', age: 8, avatar: '👧',
        screenTime: { weekdays: 1, weekends: 2 },
        filters: initialFilterCategories.map(cat => ({...cat, blocked: true }))
    },
];

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <div onClick={() => onChange(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${ enabled ? 'bg-blue-600' : 'bg-gray-600' }`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${ enabled ? 'translate-x-6' : 'translate-x-1' }`} />
    </div>
);


const ParentalControls: React.FC = () => {
    const [profiles, setProfiles] = useState<ChildProfile[]>(initialProfiles);
    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(profiles[0]?.id ?? null);

    const selectedProfile = profiles.find(p => p.id === selectedProfileId);

    const updateFilter = (profileId: number, filterId: string, blocked: boolean) => {
        setProfiles(profiles.map(p => {
            if (p.id === profileId) {
                return {
                    ...p,
                    filters: p.filters.map(f => f.id === filterId ? { ...f, blocked } : f)
                };
            }
            return p;
        }));
    };
    
    return (
        <div className="animate-fade-in flex gap-8 h-full">
            {/* Left Column: Profiles List */}
            <div className="w-1/4 bg-gray-800/50 rounded-xl border border-gray-700/50 flex flex-col">
                <div className="p-4 border-b border-gray-700/50">
                    <h2 className="text-lg font-semibold text-gray-200">Family</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {profiles.map(profile => (
                        <button key={profile.id} onClick={() => setSelectedProfileId(profile.id)} className={`w-full text-left p-4 flex items-center transition-colors ${selectedProfileId === profile.id ? 'bg-blue-600/20' : 'hover:bg-gray-800'}`}>
                            <span className="text-4xl mr-4">{profile.avatar}</span>
                            <div>
                                <p className={`font-bold ${selectedProfileId === profile.id ? 'text-blue-300' : 'text-gray-200'}`}>{profile.name}</p>
                                <p className="text-sm text-gray-400">{profile.age} years old</p>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-700/50">
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 rounded-lg text-sm">Add Profile</button>
                </div>
            </div>

            {/* Right Column: Profile Settings */}
            <div className="flex-1 bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-y-auto">
                {selectedProfile ? (
                    <div>
                        <div className="p-6 border-b border-gray-700/50 flex items-center">
                            <span className="text-5xl mr-5">{selectedProfile.avatar}</span>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-100">{selectedProfile.name}'s Settings</h1>
                                <p className="text-gray-400">Manage digital rules and protection for {selectedProfile.name}.</p>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Web Content Filtering */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-200 mb-3">Web Content Filtering</h3>
                                <div className="space-y-3">
                                    {selectedProfile.filters.map(filter => (
                                        <div key={filter.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                                            <span className="text-gray-300">{filter.label}</span>
                                            <ToggleSwitch enabled={filter.blocked} onChange={(val) => updateFilter(selectedProfile.id, filter.id, val)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Screen Time & App Blocking */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-200 mb-3">Screen Time Limits</h3>
                                    <div className="bg-gray-900/50 p-4 rounded-md space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-gray-300">Weekdays</p>
                                            <p className="font-semibold text-blue-300">{selectedProfile.screenTime.weekdays} hours / day</p>
                                        </div>
                                         <div className="flex justify-between items-center">
                                            <p className="text-gray-300">Weekends</p>
                                            <p className="font-semibold text-blue-300">{selectedProfile.screenTime.weekends} hours / day</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-200 mb-3">Application Blocking</h3>
                                    <div className="bg-gray-900/50 p-4 rounded-md">
                                        <p className="text-center text-sm text-gray-500">App blocking settings coming soon.</p>
                                    </div>
                                </div>
                                 <div>
                                    <h3 className="text-lg font-semibold text-gray-200 mb-3">Activity Summary</h3>
                                    <div className="bg-gray-900/50 p-4 rounded-md">
                                        <p className="text-sm text-gray-400">Today: <span className="text-gray-200">1.5h used</span></p>
                                        <p className="text-sm text-gray-400">Blocked sites visited: <span className="text-red-400">3 attempts</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Select a profile to view or edit settings.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentalControls;