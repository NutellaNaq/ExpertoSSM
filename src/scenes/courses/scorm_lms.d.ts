// scorm.d.ts

declare interface ScormStatus {
  // Define the structure of your SCORM status data here
  // For example:
  cmi: {
    completion_status: string;
    // Add more properties as needed
  };
  // Add other SCORM properties here
}

declare interface ScormAPI {
  LMSInitialize: () => void;
  LMSTerminate: () => void;
  LMSGetValue: (varname: string) => string;
  LMSSetValue: (varname: string, varvalue: string) => void;
  LMSCommit: (e: any) => boolean;
  LMSFinish: (e: any) => void;
  LMSGetLastError: (e: any) => string;
  LMSGetErrorString: (e: any) => string;
  LMSGetDiagnostic: (e: any) => string;
}

declare interface ScormInitOptions {
  window: Window;
  prefixNumber?: number;
  callback?: ({ progress }: { progress: ScormStatus }) => void;
}

declare function scormInit(options: ScormInitOptions): void;

export { ScormAPI, ScormInitOptions, ScormStatus, scormInit };
