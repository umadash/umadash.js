import Command from "./Command";
import CommandList from "./CommandLIst";
import CommandEvent from "./CommandEvent";

export default class SerialList extends CommandList {
  // --------------------------------------------------
  //
  // CONSTRUCTOR
  //
  // --------------------------------------------------
  constructor(...commands: (Command | Function)[]) {
    super(...commands);

    this.position = -1;
    this.currentCommand = null;
  }

  // --------------------------------------------------
  //
  // METHOD
  //
  // --------------------------------------------------

  public addCommand(...commands: (Command | Function)[]) {
    super.addCommand(...commands);
  }

  public insertCommand(...commands: (Command | Function)[]) {
    super.insertCommandAt(this.position + 1, ...commands);
  }

  protected implExecuteFunction(command: Command): void {
    this.position = 0;
    if (this.getLength() > 0) {
      this.next();
    } else {
      this.notifyComplete();
    }
  }

  protected implInterruptFunction(command: Command): void {
    if (this.currentCommand) {
      this.currentCommand.removeEventListener(CommandEvent.Complete, this.completeHandler);
      this.currentCommand.interrupt();
      this.currentCommand = null;
    }

    this.position = -1;
  }

  protected implDestroyFunction(command: Command): void {
    if (this.currentCommand) {
      this.currentCommand.removeEventListener(CommandEvent.Complete, this.completeHandler);
      this.currentCommand.destroy();
      this.currentCommand = null;
    }

    this.commands = null;
    this.position = -1;
    this.currentCommand = null;
  }

  private next(): void {
    this.currentCommand = this.getCommandAt(this.position);
    this.currentCommand.addEventListener(CommandEvent.Complete, this.completeHandler);
    this.currentCommand.execute();
  }

  private completeHandler = (e: CommandEvent): void => {
    this.currentCommand.removeEventListener(CommandEvent.Complete, this.completeHandler);
    this.currentCommand.destroy();

    if (++this.position < this.getLength()) {
      this.next();
    } else {
      this.notifyComplete();
    }
  };

  protected implNotifyBreak(): void {
    this.currentCommand.removeEventListener(CommandEvent.Complete, this.completeHandler);
    this.currentCommand = null;

    this.notifyComplete();
  }

  protected implNotifyReturn(): void {}

  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
  private currentCommand: Command;
  public getCurrentCommand(): Command {
    return this.currentCommand;
  }

  private position: number;
  public getPosition(): number {
    return this.position;
  }
}
