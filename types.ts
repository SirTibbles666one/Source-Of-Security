// Antivirus
export type ScanType = 'quick' | 'full' | 'custom' | 'smart';
export type ScanStatus = 'idle' | 'scanning' | 'results' | 'complete_clean';
export interface DetectedThreat {
    id: number;
    name: string;
    severity: 'High' | 'Medium' | 'Low';
    filePath: string;
    isAiFinding?: boolean;
    aiAnalysis?: string;
    aiStatus?: 'idle' | 'analyzing';
}
export interface QuarantinedFile {
    id: number;
    name: string;
    originalPath: string;
    dateQuarantined: string;
}

// Firewall
export interface FirewallRule {
    id: number;
    appName: string;
    appIcon: string;
    category: string;
    status: 'allowed' | 'blocked';
}

// Endpoint Security & Sandbox
export type UsbDeviceStatus = 'full_access' | 'ask' | 'read_only' | 'blocked';
export interface UsbDevice {
    id: string;
    name: string;
    vendor: string;
    status: UsbDeviceStatus;
}
export interface BlockedExecutionEvent {
    id: number;
    fileName: string;
    device: string;
    timestamp: string;
}
export interface WhitelistedUsbApp {
    id: number;
    fileName: string;
    publisher: string;
}
export interface AnalyzedUsbFile {
    id: number;
    fileName: string;
    sourceDevice: string;
    dateCopied: string;
    analysisStatus: 'pending' | 'analyzing' | 'analyzed';
    analysisReport?: SandboxAnalysis;
}
export interface UsbMonitorEvent {
    id: number;
    timestamp: string;
    eventType: string;
    details: string;
    color: string;
}
export interface SandboxAnalysis {
    verdict: 'Malicious' | 'Suspicious' | 'Clean';
    behaviorLog: string[];
    networkActivity: {
        ip: string;
        port: number;
        protocol: 'TCP' | 'UDP';
        status: 'Blocked' | 'Allowed';
    }[];
    systemChanges: string[];
}
export interface SandboxFile {
    id: number;
    file: File;
    status: 'pending' | 'analyzing' | 'complete' | 'error';
    result?: SandboxAnalysis;
}


// Identity Protection
export interface Breach {
    site: string;
    date: string;
    compromisedData: string[];
}

export interface PasswordEntry {
    id: number;
    website: string;
    username: string;
    health: 'Strong' | 'Reused' | 'Weak' | 'Vulnerable';
}

// Performance Optimizer
export interface StartupApp {
    id: number;
    name: string;
    publisher: string;
    impact: 'High' | 'Medium' | 'Low';
    enabled: boolean;
}
export interface Game {
    id: number;
    name: string;
    icon: string;
    path: string;
    detected: boolean;
}
export interface BrowserData {
    id: string;
    label: string;
    size: number; // in MB
    selected: boolean;
}
export interface BrowserScanResult {
    id: string;
    name: string;
    icon: string;
    data: BrowserData[];
}
export interface RegistryIssueCategory {
    id: string;
    name: string;
    description: string;
    issueCount: number;
}
export interface AiOptimization {
    title: string;
    description: string;
    action: 'clean_junk' | 'clean_browsers' | 'clean_registry' | 'disable_startup';
    targetId: string;
    buttonText: string;
    status: 'pending' | 'done';
}


// Privacy
export interface HardeningIssue {
    id: string;
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
    status: 'unresolved' | 'fixing' | 'resolved';
}

// Network Scanner
export interface NetworkDevice {
    id: string;
    ip: string;
    name: string;
    manufacturer: string;
    type: 'router' | 'computer' | 'phone' | 'iot' | 'unknown';
    status: 'vulnerable' | 'secure' | 'new';
    vulnerability?: string;
    isTrusted: boolean;
}

// Ransomware
export interface ProtectedFolder {
    id: number;
    path: string;
    type: 'default' | 'user';
}
export interface RansomwareEvent {
    id: number;
    appName: string;
    filePath: string;
    timestamp: string;
}

// Parental Controls
export interface ContentFilterCategory {
    id: string;
    label: string;
    blocked: boolean;
}
export interface ChildProfile {
    id: number;
    name: string;
    age: number;
    avatar: string;
    screenTime: {
        weekdays: number;
        weekends: number;
    };
    filters: ContentFilterCategory[];
}

// Software Updater
export interface SoftwareUpdateInfo {
    id: number;
    name: string;
    publisher: string;
    icon: string;
    currentVersion: string;
    latestVersion: string;
    status: 'up_to_date' | 'available' | 'updating';
}

// File Shredder
export interface FileToShred {
    id: number;
    name: string;
    path: string;
    size: string;
    status: 'pending' | 'shredding' | 'complete';
}

// Security Report
export type EventSeverity = 'Critical' | 'High' | 'Medium' | 'Informational';
export type EventModule = 'Antivirus' | 'Firewall' | 'Web Protection' | 'Ransomware' | 'Network' | 'Privacy' | 'System' | 'Integrity';
export interface SecurityEvent {
    id: number;
    timestamp: Date;
    module: EventModule;
    severity: EventSeverity;
    description: string;
    action: string;
}

// AI Advisor
export interface ChatMessage {
    id: number;
    sender: 'ai' | 'user';
    text: string;
}

// Cloud Backup
export interface BackupFile {
    id: string;
    name: string;
    path: string;
    size: number;
    type: 'folder' | 'file';
}

// Mobile Security
export interface Permission {
    id: string;
    label: string;
    risk: 'High' | 'Medium' | 'Low';
}
export interface MobileAppPermissionInfo {
    id: string;
    name: string;
    icon: string;
    permissions: Permission[];
}

// Safe Transactions
export interface SecureWebsite {
    id: number;
    url: string;
    type: 'banking' | 'shopping';
}

// Advanced Uninstaller
export interface InstalledApp {
    id: number;
    name: string;
    publisher: string;
    icon: string;
    size: number; // in MB
    installDate: string;
    status: 'installed' | 'uninstalling' | 'scanning' | 'complete';
    leftovers?: {
        files: number;
        registryKeys: number;
        size: number; // in MB
    };
}

// System Integrity
export interface SystemFile {
    id: string;
    path: string;
    type: 'File' | 'Registry Key' | 'Application File';
    baselineHash: string;
}
export interface IntegrityAlert {
    file: SystemFile;
    currentHash: string;
    status: 'unresolved' | 'restoring' | 'trusted' | 'healing';
    aiAnalysis?: string;
    aiStatus?: 'idle' | 'analyzing';
    isSelfProtection?: boolean;
}

// Scheduler
export type TaskType = 'quick_scan' | 'full_scan' | 'junk_cleanup' | 'software_updates' | 'cloud_backup';
export type TaskFrequency = 'daily' | 'weekly' | 'monthly';
export interface ScheduledTask {
    id: number;
    type: TaskType;
    frequency: TaskFrequency;
    day: number; // For weekly/monthly
    time: string;
    enabled: boolean;
    lastRun: string;
    nextRun: string;
}

// Admin Panel
export type KeyDuration = '7d' | '30d' | '1y' | 'lifetime';
export interface AccountKey {
    id: number;
    key: string;
    user: string;
    dateGenerated: string;
    duration: KeyDuration;
    expiryDate: string; // ISO string or 'Never'
}