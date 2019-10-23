import Command from "./Command";
import Func from "./Func";

export default abstract class CommandList extends Command {
  constructor(...commands: (Command | Function)[]) {
    super();

    this.commands = [];
    this.addCommand(...commands);
  }

  // --------------------------------------------------
  //
  // METHODS
  //
  // --------------------------------------------------
  public addCommand(...commands: (Command | Function)[]): void {
    if (commands.length > 0) {
      this.preProcess(commands);
      this.commands = this.commands.concat(<Command[]>commands);
    }
  }

  protected insertCommandAt(index: number, ...commands: (Command | Function)[]): void {
    this.preProcess(commands);
    Array.prototype.splice.apply(this.commands, (<any[]>[index, 0]).concat(commands));
  }

  public addCommandArray(commands: (Command | Function)[]) {
    this.addCommand(...commands);
  }

  public getLength(): number {
    return this.commands.length;
  }

  public getCommandAt(index: number): Command {
    return this.commands[index];
  }

  // Change Function to Command Func
  private preProcess(commands: (Command | Function)[]): void {
    const length: number = commands.length;
    let command: Command | Function;
    for (let i: number = 0; i < length; i++) {
      command = commands[i];
      if (typeof command === "function") command = new Func(command);
      command.setParent(this);
    }
  }

  protected implExecuteFunction(command: Command): void {
    this.notifyComplete();
  }

  protected implInterruptFunction(command: Command): void {}

  protected implDestroyFunction(command: Command): void {}

  protected abstract implNotifyBreak(): void;
  protected abstract implNotifyReturn(): void;

  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
  public getNotifyBreakFunction(): Function {
    return this.implNotifyBreak || null;
  }
  public getNotifyReturnFunction(): Function {
    return this.implNotifyReturn || null;
  }

  protected commands: Command[];
  public getCommands(): Command[] {
    return this.commands;
  }
}
