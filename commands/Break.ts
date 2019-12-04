import Command from "./Command";
import CommandList from "./CommandList";

export default class Break extends Command {
  constructor() {
    super();
  }

  protected implExecuteFunction(command: Command): void {
    const func: Function = this.getParent().getNotifyBreakFunction();
    if (func) func();
    this.notifyComplete();
  }

  protected implInterruptFunction(command: Command): void {}

  protected implDestroyFunction(command: Command): void {}
}
