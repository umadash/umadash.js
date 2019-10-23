import Command from "./../command/Command";
import SerialList from "./../command/SerialList";
import ParallelList from "./../command/ParallelList";

export default class CommandUtil {
  public static serial(commands: (Command | Function)[], execute: boolean = true): SerialList {
    const serial = new SerialList(...commands);
    if (execute) serial.execute();
    return serial;
  }

  public static parallel(commands: (Command | Function)[], execute: boolean = true): ParallelList {
    const parallel: ParallelList = new ParallelList(...commands);
    if (execute) parallel.execute();
    return parallel;
  }
}
