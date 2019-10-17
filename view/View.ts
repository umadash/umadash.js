import Command from "../command/Command";
import { EventDispatcher } from "../event/EventDispatcher";

export default abstract class View<T> extends EventDispatcher {
  private static _id: number = 0;

  private id: number;
  private showCommand: Command;
  private hideCommand: Command;

  constructor() {
    super();

    this.id = View._id++;
  }

  public initialize(): void {}

  public ready(): void {}

  public show(): void {
    this.cancelAppearCommands();
    this.showCommand = this.getShowCommand(true);
  }

  public hide(): void {
    this.cancelAppearCommands();
    this.hideCommand = this.getHideCommand(true);
  }

  private cancelAppearCommands(): void {
    if (this.showCommand) {
      this.showCommand.interrupt();
      this.showCommand = null;
    }

    if (this.hideCommand) {
      this.hideCommand.interrupt();
      this.hideCommand = null;
    }
  }

  protected abstract getShowCommand(execute: boolean): Command;
  protected abstract getHideCommand(execute: boolean): Command;
}
