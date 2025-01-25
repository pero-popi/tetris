import Event from '../Events/Event';
import Element from '../Elements/Element';
import Block from '../Elements/Block';
import ElementLoader from '../Utils/ElementLoader';

/**
 * 外枠のディスプレイを作成します。
 */
export default class PointBlockSpace extends Element {
  /**
   * @hidden
   */
  private list: Block[] = [];

  /**
   * @hidden
   */
  private loader: ElementLoader;

  /**
   * 新しいオブジェクトを作成します。
   */
  constructor() {
    super('div');
    this.drawRect(120, 60, '#FFFFFF');
    this.loader = new ElementLoader();
    this.loader.addEventListener(Event.COMPLETE, this.blockLineCompleteListener);
  }

  /**
   * このオブジェクトに必要な要素をロードします。
   */
  public load(): void {
    for (let i: number = 0, x: number = 0, y: number = 0; i < 18; i++) {
      let block: Block = new Block(Block.GRAY);
      block.move(x, y);
      this.list.push(block);
      this.appendChild(block);
      x += 20;

      if (x == 120) {
        x = 0;
        y += 20;
      }
    }

    this.loader.set(this.list).load();
  }

  /**
   * @hidden
   */
  private blockLineCompleteListener = (): void => {
    this.loader.removeEventListener(Event.COMPLETE, this.blockLineCompleteListener);
    this.list.splice(0, this.list.length);
    this.dispatchEvent(new Event(Event.COMPLETE));
  }
}
