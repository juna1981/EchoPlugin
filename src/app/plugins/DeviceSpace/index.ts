import { registerPlugin } from '@capacitor/core';

import type { DeviceSpacePlugin } from './definitions';

const DeviceSpace = registerPlugin<DeviceSpacePlugin>('DeviceSpace', {
  web: () => import('./web').then((m) => new m.DeviceSpaceWeb()),
});

export * from './definitions';
export { DeviceSpace };
