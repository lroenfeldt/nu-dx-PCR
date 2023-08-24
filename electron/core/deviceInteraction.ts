import shutdown from 'electron-shutdown-command';

export function rebootDevice(): void {
  shutdown.reboot();
}

export function shutdownDevice(): void {
  shutdown.shutdown();
}

