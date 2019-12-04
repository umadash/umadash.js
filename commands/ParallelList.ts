import Command from "./Command";
import CommandList from "./CommandLIst";
import CommandEvent from "./CommandEvent";

export default class ParallelList extends CommandList {
  constructor(...commands: (Command | Function)[]) {
    super(...commands);

    this.completeCount = 0;
  }

  public implExecuteFunction(): void {
    const length: number = this.getLength();
    if (length > 0) {
      for (let i: number = 0; i < length; i++) {
        const command: Command = this.getCommandAt(i);
        command.addEventListener(CommandEvent.Complete, this.completeHandler);
        command.execute();
      }
    } else {
      this.notifyComplete();
    }
  }

  public implInterruptFunction(): void {
    const length: number = this.getLength();
    if (length > 0) {
      for (let i: number = 0; i < length; i++) {
        const command: Command = this.getCommandAt(i);
        command.removeEventListener(CommandEvent.Complete, this.completeHandler);
        command.interrupt();
      }
    }
  }

  public implDestroyFunction(): void {
    const length: number = this.getLength();
    if (length > 0) {
      for (let i: number = 0; i < length; i++) {
        const command: Command = this.getCommandAt(i);
        command.removeEventListener(CommandEvent.Complete, this.completeHandler);
        command.destroy();
      }
    }
  }

  protected implNotifyBreak(): void {}

  protected implNotifyReturn(): void {}

  private completeHandler = (e: CommandEvent): void => {
    if (++this.completeCount >= this.getLength()) {
      this.notifyComplete();
    }
  };

  private completeCount: number;
  public getCompleteCount(): number {
    return (this.completeCount = 0);
  }
}
