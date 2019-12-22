const $ = jQuery;

export default abstract class DOMRecycleViewItem {
  constructor() {
    this.width = this.height = 0;
    this.x = 0;
  }

  public setup($elm: JQuery): void {
    this.$elm = $elm;
    this.$elm.css({
      position: "absolute",
      top: 0,
      left: 0
    });
    this.width = parseFloat(this.$elm.attr("data-width"));
    this.height = parseFloat(this.$elm.attr("data-height"));

    this.impDidSetup();
  }

  public destroy(): void {
    this.impWillDestroy();

    if (this.$elm) {
      this.$elm.off();
      this.$elm.remove();
      this.$elm = null;
    }

    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.saveX = 0;
  }

  public setX(value: number): void {
    this.x = value;
    this.$elm.css("transform", `translate3d(${this.x}px, 0, 0)`);
  }

  public savePosition(): void {
    this.saveX = this.x;
  }

  protected abstract impWillDestroy(): void;
  protected abstract impDidSetup(): void;

  public $elm: JQuery;
  public width: number;
  public height: number;
  public x: number;
  public saveX: number;
}
