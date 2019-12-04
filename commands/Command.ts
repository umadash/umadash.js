import { EventDispatcher } from "./../events/EventDispatcher";
import CommandState from "./CommandState";
import CommandEvent from "./CommandEvent";
import CommandList from "./CommandLIst";

export type CommandFunction = (notifier: Command) => void;

export default class Command extends EventDispatcher {
  // --------------------------------------------------
  //
  // CONSTRUCTOR
  //
  // --------------------------------------------------
  constructor(exectuteFunction: CommandFunction = null, interruptFunction: CommandFunction = null, destroyFunction: CommandFunction = null) {
    super();

    this.executeFunction = exectuteFunction;
    this.interruptFunction = interruptFunction;
    this.destroyFunction = destroyFunction;

    this.state = CommandState.Sleeping;
    this.parent = null;
  }

  // --------------------------------------------------
  //
  // METHOD
  //
  // --------------------------------------------------

  public execute(): void {
    if (this.state > CommandState.Sleeping) {
      throw new Error("[Command.execute] + Command is already executing.");
    }
    this.state = CommandState.Executing;
    this.getExecuteFunction().call(this, this);
  }

  public interrupt(): void {
    if (this.state === CommandState.Executing) {
      this.state = CommandState.Interrupting;
      this.getInterruptFunction().call(this, this);
    }
  }

  public destroy(): void {
    this.state = CommandState.Sleeping;
    this.getDestroyFunction().call(this, this);

    this.parent = null;
    this.executeFunction = null;
    this.interruptFunction = null;
    this.destroyFunction = null;
  }

  public notifyComplete(): void {
    switch (this.state) {
      case CommandState.Executing:
      case CommandState.Interrupting:
        this.dispatchEventType(CommandEvent.Complete);
        this.destroy();
        break;

      case CommandState.Sleeping:
        break;
    }
  }

  protected implExecuteFunction(command: Command): void {
    this.notifyComplete();
  }

  protected implInterruptFunction(command: Command): void {}

  protected implDestroyFunction(command: Command): void {}

  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------

  private executeFunction: CommandFunction;
  protected getExecuteFunction(): CommandFunction {
    return this.executeFunction || this.implExecuteFunction;
  }
  protected setExecuteFunction(func: CommandFunction): void {
    this.executeFunction = func;
  }

  private interruptFunction: CommandFunction;
  protected getInterruptFunction(): CommandFunction {
    return this.interruptFunction || this.implInterruptFunction;
  }
  protected setInterruptFunction(func: CommandFunction): void {
    this.interruptFunction = func;
  }

  private destroyFunction: CommandFunction;
  protected getDestroyFunction(): CommandFunction {
    return this.destroyFunction || this.implDestroyFunction;
  }
  protected setDestroyFunction(func: CommandFunction): void {
    this.destroyFunction = func;
  }

  private parent: CommandList;
  public getParent(): CommandList {
    return this.parent;
  }
  public setParent(parent: CommandList): void {
    this.parent = parent;
  }

  private state: CommandState;
  public getState(): CommandState {
    return this.state;
  }
}
