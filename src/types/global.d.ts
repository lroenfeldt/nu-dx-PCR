interface Window {
  api: {
    getConfig: () => ReturnType<typeof getConfig>;
    copyLogos: () => ReturnType<typeof copyLogos>;
    logEvents: (arg0: string, arg1: string) => ReturnType<typeof logEvents>;
    power: (arg0: string | null) => ReturnType<typeof power>;
    exit: () => ReturnType<typeof exit>;
    clearConfig: () => ReturnType<typeof clearConfig>;
    archiveRun: () => ReturnType<typeof archiveRun>;
    saveConfig: (arg0) => ReturnType<typeof saveConfig>;
    toggleLid: () => ReturnType<typeof toggleLid>;
    checkUSB: () => ReturnType<typeof checkUSB>;
    getResult: (arg0, arg1) => ReturnType<typeof getResult>;
    saveToUSB: (arg0, arg1) => ReturnType<typeof saveToUSB>;
    getTests: () => ReturnType<typeof getTests>;
    moveFiles: (arg0) => ReturnType<typeof moveFiles>;
    getUnsubmitted: () => ReturnType<typeof getUnsubmitted>;
    endLineGene: () => ReturnType<typeof endLineGene>;
    moveResultFile: (arg0) => ReturnType<typeof moveResultFile>;
    editResults: (arg0, arg1) => ReturnType<typeof editResults>;
    relaunchApp: () => ReturnType<typeof relaunchApp>;
  };
}
