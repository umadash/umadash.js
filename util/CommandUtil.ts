import { ParallelList } from './../commands/ParallelList';
import { Command } from './../commands/Command';
import { SerialList } from './../commands/SerialList';
export class CommandUtil {


    public static serial(execute: boolean = true, commands: Command[]): SerialList{
        const serial = new SerialList(commands);
        if (execute) serial.execute();
        return serial;
    }

    public static parallel(execute: boolean = true, commands: Command[]): ParallelList {
        const parallel: ParallelList = new ParallelList(commands);
        if (execute) parallel.execute();
        return parallel;
    }
    
}