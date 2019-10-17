import Command from "./Command";

export class SerialList extends Command {
  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
  private commands: Command[];
  private currentCommand: Command;
  private flgCancel: boolean;

  // --------------------------------------------------
  //
  // CONSTRUCTOR
  //
  // --------------------------------------------------
  constructor(commands = null) {
    super();

    this.commands = commands;
    this.currentCommand = null;
    this.flgCancel = false;
  }

  // --------------------------------------------------
  //
  // METHOD
  //
  // --------------------------------------------------
  public execute() {
    if (this.commands == null) return;

    this.flgCancel = false;
    this.next();
  }

  public addCommand(command) {
    if (this.commands == null) this.commands = [];
    this.commands.push(command);
  }

  public addCommands(commands) {
    if (this.commands == null) this.commands = [];
    for (let i = 0, length = commands.length; i < length; i += 1) {
      this.addCommand(commands[i]);
    }
  }

  public next() {
    if (this.commands.length > 0) {
      const nextCommand: Command = this.commands.shift();
      const callback = () => {
        nextCommand.removeEventListener("complete", callback);
        if (this.flgCancel) return;
        this.next();
      };
      this.currentCommand = nextCommand;
      nextCommand.addEventListener("complete", callback);
      nextCommand.execute();
    } else {
      this.notifyComplete();
      this.currentCommand = null;
    }
  }

  public interrupt() {
    if (this.commands == null) return;

    this.flgCancel = true;

    this.interruptAllCommands();
  }

  public interruptAllCommands() {
    if (this.currentCommand) {
      this.currentCommand.interrupt();
    }

    const length = this.commands.length;
    for (let i = 0; i < length; i += 1) {
      const command = this.commands[i];
      command.interrupt();
    }
  }
}
