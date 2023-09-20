export interface ICheck {
  request: (arg0: string, arg1: { token: string }) => Promise<any>;
}
