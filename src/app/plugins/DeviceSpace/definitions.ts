export interface DeviceSpacePlugin {
  getFreeDiskSpace(): Promise<{ free: number }>;
  getTotalDiskSpace(): Promise<{ total: number }>;
  getUsedDiskSpace(): Promise<{ used: number }>;
}