import Command from "./Command";

export default class Wait extends Command {
  constructor(sec: number = 1000) {
    super();

    this.sec = sec;
    this.timer = -1;
  }

  protected implExecuteFunction(command: Command): void {
    this.timer = window.setTimeout(this.completeHandler, this.sec);
  }

  protected implInterruptFunction(command: Command): void {
    this.cancelTimer();
  }

  protected implDestroyFunction(command: Command): void {
    this.cancelTimer();
  }

  private cancelTimer(): void {
    if (this.timer != -1) {
      clearTimeout(this.timer);
      this.timer = -1;
    }
  }

  private completeHandler: () => void = () => {
    this.notifyComplete();
  };

  private sec: number;
  public getSecond(): number {
    return this.sec;
  }
  public setSecond(sec: number): void {
    this.sec = sec;
  }

  private timer: number;
}
