const $ = jQuery;

export default abstract class DOMRecycleViewItem {
  public $elm: JQuery;
  public width: number;
  public height: number;
  public x: number;
  public saveX: number;
  public leftItem: DOMRecycleViewItem;
  public rightItem: DOMRecycleViewItem;

  constructor() {
    this.width = this.height = 0;
    this.x = 0;
  }

  public abstract destoroy(): void;
  public abstract willAppear(): void;

  public attachHTML(html: string): void {
    this.$elm = $(html);
    this.width = parseFloat(this.$elm.attr("data-width"));
    this.height = parseFloat(this.$elm.attr("data-height"));
  }

  public setX(value: number): void {
    this.x = value;
    this.$elm.css("transform", `translate3d(${this.x}px, 0, 0)`);
  }

  public savePosition(): void {
    this.saveX = this.x;
  }
}
