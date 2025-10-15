
import React, { useState, useMemo } from 'react';
import { FirewallRule } from '../types';

const initialRules: FirewallRule[] = [
  { id: 1, appName: 'chrome.exe', appIcon: '🌐', category: 'Browser', status: 'allowed' },
  { id: 2, appName: 'Spotify.exe', appIcon: '🎵', category: 'Music', status: 'allowed' },
  { id: 3, appName: 'svchost.exe', appIcon: '⚙️', category: 'System', status: 'allowed' },
  { id: 4, appName: 'Discord.exe', appIcon: '💬', category: 'Communication', status: 'allowed' },
  { id: 5, appName: 'Steam.exe', appIcon: '🎮', category: 'Gaming', status: 'allowed' },
  { id: 6, appName: 'unknown_agent.exe', appIcon: '❓', category: 'Unknown', status: 'blocked' },
  { id: 7, appName: 'nvcontainer.exe', appIcon: '⚙️', category: 'System', status: 'allowed' },
  { id: 8, appName: 'Teams.exe', appIcon: '💬', category: 'Communication', status: 'allowed' },
  { id: 9, appName: 'powershell.exe', appIcon: '⚙️', category: 'System', status: 'blocked' },
];

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => {
  return (
    <div
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${
        enabled ? 'bg-green-500' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </div>
  );
};


const Firewall: React.FC = () => {
  const [rules, setRules] = useState<FirewallRule[]>(initialRules);
  const [firewallEnabled, setFirewallEnabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'allowed' | 'blocked'>('all');

  const toggleRuleStatus = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, status: rule.status === 'allowed' ? 'blocked' : 'allowed' } : rule
    ));
  };

  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      const matchesSearch = rule.appName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = statusFilter === 'all' || rule.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [rules, searchTerm, statusFilter]);

  const FilterButton: React.FC<{ filter: typeof statusFilter, label: string }> = ({ filter, label }) => (
    <button
        onClick={() => setStatusFilter(filter)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${statusFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
    >{label}</button>
  );

  return (
    <div className="animate-fade-in">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-8 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-gray-200">Firewall Status</h2>
                <p className={`text-sm ${firewallEnabled ? 'text-green-400' : 'text-red-400'}`}>
                    {firewallEnabled ? 'Your network is protected.' : 'Firewall is disabled! Your network is at risk.'}
                </p>
            </div>
            <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-300">Firewall</span>
                <ToggleSwitch enabled={firewallEnabled} onChange={setFirewallEnabled} />
            </div>
        </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-700/50">
            <h3 className="text-xl font-semibold text-gray-200">Application Rules</h3>
            <p className="text-gray-400 mb-4">Manage incoming and outgoing connections for applications.</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search rules..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-grow bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                    <FilterButton filter="all" label="All" />
                    <FilterButton filter="allowed" label="Allowed" />
                    <FilterButton filter="blocked" label="Blocked" />
                </div>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="p-4 font-semibold text-sm text-gray-400">Application</th>
                <th className="p-4 font-semibold text-sm text-gray-400">Category</th>
                <th className="p-4 font-semibold text-sm text-gray-400 text-center">Status</th>
                <th className="p-4 font-semibold text-sm text-gray-400 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="border-t border-gray-800 hover:bg-gray-800/40 transition-colors">
                  <td className="p-4 text-gray-200">
                      <div className="flex items-center">
                          <span className="text-2xl mr-3">{rule.appIcon}</span>
                          <span>{rule.appName}</span>
                      </div>
                  </td>
                  <td className="p-4 text-gray-400">{rule.category}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        rule.status === 'allowed'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {rule.status === 'allowed' ? 'Allowed' : 'Blocked'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <ToggleSwitch 
                        enabled={rule.status === 'allowed'} 
                        onChange={() => toggleRuleStatus(rule.id)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRules.length === 0 && <p className="text-center text-gray-500 py-8">No rules match your criteria.</p>}
        </div>
      </div>
    </div>
  );
};

export default Firewall;