import Command from "../commands/Command";
import { EventDispatcher } from "../events/EventDispatcher";

export default abstract class View<T = any> extends EventDispatcher {
  private static _id: number = 0;

  constructor(view: T) {
    super();

    this.view = view;
    this.id = View._id++;
    this.isShown = false;
  }

  public initialize(): void {}

  public ready(): void {}

  public show(): void {
    if (this.isShown) return;
    this.cancelAppearCommands();
    this.showCommand = this.impGetShowCommand();
    this.showCommand.execute();

    this.isShown = true;
  }

  public hide(): void {
    if (!this.isShown) return;

    this.cancelAppearCommands();
    this.hideCommand = this.impGetHideCommand();
    this.hideCommand.execute();

    this.isShown = false;
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

  protected abstract impGetShowCommand(): Command;
  protected abstract impGetHideCommand(): Command;

  private view: T;
  public getView(): T {
    return this.view;
  }

  private id: number;
  private showCommand: Command;
  private hideCommand: Command;
  private isShown: boolean;
}
