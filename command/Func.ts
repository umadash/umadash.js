import Command from "./Command";

export class Func extends Command {
  public execute(): void {
    if (this.immediatelyComplete) {
      this.callback(this);
      this.notifyComplete();
    } else {
      this.callback(this);
    }
  }

  private callback: (f: Func) => void;
  private immediatelyComplete: boolean;

  constructor(callback: (f: Func) => void, immediatelyComplete: boolean = true) {
    super();
    this.callback = callback;
    this.immediatelyComplete = immediatelyComplete;
  }
}
