export class PixiUtil {
  public static drawRing(
    graphics: PIXI.Graphics,
    drawPoints: { x: number; y: number }[]
  ): void {
    // 始点を決定する
    let from = drawPoints[0]
    let to = drawPoints[0 + 1]
    let halfX = (from.x + to.x) * 0.5
    let halfY = (from.y + to.y) * 0.5
    graphics.moveTo(halfX, halfY)

    const length = drawPoints.length
    for (let i = 2; i < length; i++) {
      const p = drawPoints[i]
      from = to
      to = p

      halfX = (from.x + to.x) * 0.5
      halfY = (from.y + to.y) * 0.5
      graphics.quadraticCurveTo(from.x, from.y, halfX, halfY)
    }

    graphics.closePath()
  }
}
