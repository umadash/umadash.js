import { Command } from './../command/Command';
import { SerialList } from './../command/SerialList';
import { ParallelList } from './../command/ParallelList';

export class CommandUtil {

    public static serial(commands: Command[], execute: boolean = true): SerialList{
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