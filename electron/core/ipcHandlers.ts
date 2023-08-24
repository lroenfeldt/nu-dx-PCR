import { IpcMainInvokeEvent } from 'electron';
import { fileExists } from './fileOperations';

export function checkResultFileHandler(event: IpcMainInvokeEvent, testid: string): void {
  // logic for IPC handler "checkResultFile"
}

export function moveResultFileHandler(event: IpcMainInvokeEvent, testid: string): void {
  // logic for IPC handler "moveResultFile"
}

// ... other IPC handlers can be added here
