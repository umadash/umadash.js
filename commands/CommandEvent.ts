import Event from "../events/Event";

export default class CommandEvent extends Event {
  // --------------------------------------------------
  //
  // CONSTRUCTOR
  //
  // --------------------------------------------------
  constructor(eventName: string, data: any = null) {
    super(eventName, data);
  }

  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
  public static Complete: string = "complete";
}
