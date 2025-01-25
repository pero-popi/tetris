import Event from '../Events/Event';
import Element from './Element';

/**
 * 画像要素を作成します。
 */
export default class Image extends Element {
  /**
   * このオブジェクトの画像URLです。
   */
  public src: string;

  /**
   * 新しいオブジェクトを作成します。
   * @param src このオブジェクトの画像URLです。
   */
  constructor(src: string) {
    super('img');
    this.src = src;

    if (this.node) {
      this.node.addEventListener(Event.LOAD, this.loadCompleteListener);
    }
  }

  /**
   * このオブジェクトに必要な要素をロードします。
   */
  public load(): void {
    if (this.node) {
      (<any>this.node).setAttribute('src', this.src);
    }
  }

  /**
   * @hidden
   */
  private loadCompleteListener = (): void => {
    if (this.node) {
      this.node.removeEventListener(Event.LOAD, this.loadCompleteListener);
    }

    this.dispatchEvent(new Event(Event.COMPLETE));
  }
}
