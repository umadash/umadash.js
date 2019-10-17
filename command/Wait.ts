import Command from "./Command";

export default class Wait extends Command {
  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
  private sec: number;
  private timer: any;

  // --------------------------------------------------
  //
  // CONSTRUCTOR
  //
  // --------------------------------------------------
  constructor(sec: number) {
    super();

    this.sec = sec;
  }

  // --------------------------------------------------
  //
  // METHOD
  //
  // --------------------------------------------------
  public execute(): void {
    this.timer = setTimeout(() => {
      this.complete();
    }, this.sec * 1000);
  }

  public interrupt(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public complete() {
    super.complete();
  }
}
