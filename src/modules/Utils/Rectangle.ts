import Element from '../Elements/Element';
import Rect from './Rect';

/**
 * オブジェクトの座標空間での左上の点(x,y)、およびその幅と高さによって囲まれる座標空間内の領域を指定します。
 */
export default class Rectangle {
  /**
   * 指定した要素のx座標を返します。
   * @param element 指定する要素です。
   * @returns x座標(px)です。
   */
  public getX(element: Element): number {
    let x: string = element.get('css.left');
    return parseFloat(x.substring(0, x.length - 2));
  }

  /**
   * 指定した要素のy座標を返します。
   * @param element 指定する要素です。
   * @returns y座標(px)です。
   */
  public getY(element: Element): number {
    let y: string = element.get('css.top');
    return parseFloat(y.substring(0, y.length - 2));
  }

  /**
   * 指定した要素の横幅を返します。
   * @param element 指定する要素です。
   * @returns 横幅(px)です。
   */
  public getWidth(element: Element): number {
    let width: string = element.get('css.width');
    return parseFloat(width.substring(0, width.length - 2));
  }

  /**
   * 指定した要素の縦幅を返します。
   * @param element 指定する要素です。
   * @returns 縦幅(px)です。
   */
  public getHeight(element: Element): number {
    let height: string = element.get('css.height');
    return parseFloat(height.substring(0, height.length - 2));
  }

  /**
   * 指定した要素のRectオブジェクトを返します。
   * @param element 指定する要素です。
   * @returns 指定した要素のRectオブジェクトです。
   */
  public getRect(element: Element): Rect {
    return {
      x: this.getX(element),
      y: this.getY(element),
      width: this.getWidth(element),
      height: this.getHeight(element)
    };
  }

  /**
   * 指定した要素の衝突を判定します。
   * @param element1 指定する要素1です。
   * @param element2 指定する要素2です。
   * @returns 要素1と要素2が衝突していたらtrueを返します。
   */
  public hitTest(element1: Element, element2: Element): boolean {
    let rect1: Rect = this.getRect(element1);
    let rect2: Rect = this.getRect(element2);

    if (rect1.x < rect2.x && ((rect2.x - rect1.x) >= rect1.width)) {
      return false;
    }

    if (rect1.x > rect2.x && ((rect1.x - rect2.x) >= rect2.width)) {
      return false;
    }

    if (rect1.y < rect2.y && ((rect2.y - rect1.y) >= rect1.height)) {
      return false;
    }

    if (rect1.y > rect2.y && ((rect1.y - rect2.y) >= rect2.height)) {
      return false;
    }

    return true;
  }
}
