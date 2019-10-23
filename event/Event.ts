export default class Event<T = any> {
  constructor(name: string, target: Object = null, data: T = null) {
    this.name = name;
    this.target = target;
    this.data = data;
  }

  private target: Object;
  public getTarget(): Object {
    return this.target;
  }
  public setTarget(target): void {
    this.target = target;
  }

  private name: string;
  public getName(): string {
    return this.name;
  }

  private data: T;
  public getData(): T {
    return this.data;
  }
  public setData(data: T): void {
    this.data = data;
  }
}
