import { WebPlugin } from '@capacitor/core';
import type { DeviceSpacePlugin } from './definitions';

export class DeviceSpaceWeb extends WebPlugin implements DeviceSpacePlugin {
  async getFreeDiskSpace(): Promise<{ free: number }> {
    console.warn('DeviceSpace.getFreeDiskSpace() is not available on web');
    return { free: -1 };
  }

  async getTotalDiskSpace(): Promise<{ total: number }> {
    console.warn('DeviceSpace.getTotalDiskSpace() is not available on web');
    return { total: -1 };
  }

  async getUsedDiskSpace(): Promise<{ used: number }> {
    console.warn('DeviceSpace.getUsedDiskSpace() is not available on web');
    return { used: -1 };
  }
}
