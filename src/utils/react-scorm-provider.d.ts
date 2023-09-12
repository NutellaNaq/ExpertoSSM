declare module "react-scorm-provider" {
  type ScormVersion = "1.2" | "2004";

  type SuspendData = Record<string, unknown>;

  type Status =
    | "passed"
    | "completed"
    | "failed"
    | "incomplete"
    | "browsed"
    | "not attempted"
    | "unknown";

  type ScoreObj = {
    value: number;
    min: number;
    max: number;
    status: string;
  };

  export type ScoProp = {
    apiConnected: boolean;
    clearSuspendData: () => SuspendData;
    completionStatus: Status;
    get: (param: string) => unknown;
    getSuspendData: () => SuspendData;
    learnerName: string;
    scormVersion: ScormVersion;
    set: (param: string, val: any, deferSaveCall?: boolean) => void;
    setScore: (scoreObj: ScoreObj) => any[];
    setStatus: (status: Status, deferSaveCall?: boolean) => void;
    setSuspendData: (key: string | number, val: any) => SuspendData;
    suspendData: SuspendData;
  };

  const ScormProvider: React.ComponentType<{
    children?: React.ReactNode;
    version?: ScormVersion;
    debug?: boolean;
  }>;

  export const withScorm: () => <P extends object>(
    Component: React.ComponentType<P>
  ) => React.ComponentType<Omit<P, "sco">>;

  export default ScormProvider;
}
