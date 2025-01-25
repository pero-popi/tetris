import Event from '../Events/Event';
import Element from '../Elements/Element';
import Block from '../Elements/Block';
import ElementLoader from '../Utils/ElementLoader';

/**
 * ディスプレイの抽象クラスです。
 */
export default abstract class Display extends Element {
  /**
   * @hidden
   */
  private loader: ElementLoader;

  /**
   * @hidden
   */
  private blocks: Block[] = [];

  /**
   * 新しいオブジェクトを作成します。
   */
  constructor() {
    super('div');
    this.loader = new ElementLoader();
    this.loader.addEventListener(Event.COMPLETE, this.backgroundLoadCompleteListener);
  }

  /**
   * このオブジェクトに必要な要素をロードします。
   */
  public load(): void {
    for (let i: number = 0; i < 8; i++) {
      let block: Block = new Block(Block.WHITE);
      block.setAlpha(0.2);
      this.blocks.push(block);
    }

    this.loader.set(this.blocks).load();
  }

  /**
   * @hidden
   */
  private backgroundLoadCompleteListener = (): void => {
    this.loader.removeEventListener(Event.COMPLETE, this.backgroundLoadCompleteListener);

    for (let i: number = 0, x: number = 0, y: number = 0; i < 8; i++) {
      let block: Block = this.blocks[i];
      block.move(x, y);
      this.appendChild(block);
      x += 20;

      if (x == 80) {
        x = 0;
        y += 20;
      }
    }

    this.blocks.splice(0, this.blocks.length);

    for (let i: number = 0; i < 16; i++) {
      let block: Block = new Block(Block.GRAY);
      this.blocks.push(block);
    }

    this.loader.addEventListener(Event.COMPLETE, this.grayLoadCompleteListener);
    this.loader.set(this.blocks).load();
  }

  /**
   * @hidden
   */
  private grayLoadCompleteListener = (): void => {
    this.loader.removeEventListener(Event.COMPLETE, this.grayLoadCompleteListener);

    for (let i: number = 0, x: number = -20; i < 6; i++ , x += 20) {
      let block: Block = this.blocks[i];
      block.move(x, -20);
      this.appendChild(block);
    }

    for (let i: number = 6, x: number = -20, y: number = 0; i < 10; i++) {
      let block = this.blocks[i];
      block.move(x, y);
      this.appendChild(block);

      if (x == -20) {
        x = 80;
      } else {
        x = -20;
        y += 20;
      }
    }

    this.blocks.splice(0, this.blocks.length);
    this.dispatchEvent(new Event(Event.COMPLETE));
  }
}
