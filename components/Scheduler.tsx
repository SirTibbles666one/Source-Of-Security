import React, { useState } from 'react';
import { ScheduledTask, TaskType, TaskFrequency } from '../types';
import { SchedulerIcon } from './icons/SchedulerIcon';
import { ScanIcon } from './icons/ScanIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PerformanceIcon } from './icons/PerformanceIcon';
import { UpdaterIcon } from './icons/UpdaterIcon';
import { CloudBackupIcon } from './icons/CloudBackupIcon';

const initialTasks: ScheduledTask[] = [
    { id: 1, type: 'quick_scan', frequency: 'daily', day: 0, time: '02:00', enabled: true, lastRun: '22 hours ago', nextRun: 'in 2 hours' },
    { id: 2, type: 'junk_cleanup', frequency: 'weekly', day: 1, time: '03:00', enabled: true, lastRun: '6 days ago', nextRun: 'in 1 day' },
    { id: 3, type: 'software_updates', frequency: 'weekly', day: 3, time: '14:00', enabled: true, lastRun: '4 days ago', nextRun: 'in 3 days' },
    { id: 4, type: 'cloud_backup', frequency: 'daily', day: 0, time: '23:30', enabled: false, lastRun: '1 week ago', nextRun: 'Paused' },
];

const taskDetails: Record<TaskType, { name: string, icon: React.FC<any> }> = {
    'quick_scan': { name: 'Quick Antivirus Scan', icon: ScanIcon },
    'full_scan': { name: 'Full Antivirus Scan', icon: ScanIcon },
    'junk_cleanup': { name: 'Junk File Cleanup', icon: TrashIcon },
    'software_updates': { name: 'Software Update Check', icon: UpdaterIcon },
    'cloud_backup': { name: 'Cloud Backup', icon: CloudBackupIcon },
};

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <div onClick={() => onChange(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${ enabled ? 'bg-blue-600' : 'bg-gray-600' }`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${ enabled ? 'translate-x-6' : 'translate-x-1' }`} />
    </div>
);

const Scheduler: React.FC = () => {
    const [tasks, setTasks] = useState<ScheduledTask[]>(initialTasks);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
    };

    const CreateTaskModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
        // Dummy state for the modal form
        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-lg w-full animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-100 mb-6">Create New Scheduled Task</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-400">Task Type</label>
                            <select className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white mt-1">
                                {Object.entries(taskDetails).map(([key, value]) => <option key={key} value={key}>{value.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-400">Frequency</label>
                            <select className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white mt-1">
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-400">Time</label>
                            <input type="time" defaultValue="02:00" className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white mt-1" />
                        </div>
                    </div>
                     <div className="flex justify-end space-x-4 mt-8">
                        <button onClick={onClose} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg">Cancel</button>
                        <button onClick={onClose} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg">Create Task</button>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className="animate-fade-in">
            {showCreateModal && <CreateTaskModal onClose={() => setShowCreateModal(false)} />}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-8 flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-200 flex items-center mb-2">
                        <SchedulerIcon className="w-6 h-6 mr-3"/>
                        Task Scheduler
                    </h2>
                    <p className="text-gray-400">Automate your security and maintenance routines to keep your PC in top shape.</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="w-full md:w-auto mt-4 md:mt-0 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    Create New Task
                </button>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                         <thead className="bg-gray-900/50">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-gray-400">Task</th>
                                <th className="p-4 font-semibold text-sm text-gray-400">Schedule</th>
                                <th className="p-4 font-semibold text-sm text-gray-400">Last Run</th>
                                <th className="p-4 font-semibold text-sm text-gray-400">Next Run</th>
                                <th className="p-4 font-semibold text-sm text-gray-400 text-center">Enabled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => {
                                const Icon = taskDetails[task.type].icon;
                                const scheduleString = `${task.frequency.charAt(0).toUpperCase() + task.frequency.slice(1)} at ${task.time}`;
                                return (
                                <tr key={task.id} className="border-t border-gray-800 hover:bg-gray-800/40 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <Icon className="w-6 h-6 mr-3 text-blue-400"/>
                                            <span className="font-semibold text-gray-200">{taskDetails[task.type].name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm">{scheduleString}</td>
                                    <td className="p-4 text-gray-400 text-sm">{task.lastRun}</td>
                                    <td className="p-4 text-sm font-semibold text-gray-300">{task.nextRun}</td>
                                    <td className="p-4 text-center">
                                        <ToggleSwitch enabled={task.enabled} onChange={() => toggleTask(task.id)} />
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Scheduler;
