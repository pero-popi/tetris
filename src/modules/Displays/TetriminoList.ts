import Block from '../Elements/Block';
import Event from '../Events/Event';
import Element from '../Elements/Element';
import ElementLoader from '../Utils/ElementLoader';
import Tetrimino from '../Elements/Tetrimino';
import TetriminoFactory from '../Elements/TetriminoFactory';
import Stage from './Stage';
import TetriminoHolder from './TetriminoHolder';

/**
 * テトリミノホルダーのリストを作成します。
 */
export default class TetriminoList extends Element {
  /**
   * @hidden
   */
  private stage: Stage;

  /**
   * @hidden
   */
  private first: TetriminoHolder;

  /**
   * @hidden
   */
  private second: TetriminoHolder;

  /**
   * @hidden
   */
  private third: TetriminoHolder;

  /**
   * @hidden
   */
  private four: TetriminoHolder;

  /**
   * @hidden
   */
  private blockLine: Element;

  /**
   * @hidden
   */
  private loader: ElementLoader;

  /**
   * @hidden
   */
  private list: Tetrimino[] = [];

  /**
   * 新しいオブジェクトを作成します。
   * @param stage Stageオブジェクトの参照です。
   */
  constructor(stage: Stage) {
    super('div');
    this.stage = stage;
    this.first = new TetriminoHolder(stage);
    this.second = new TetriminoHolder(stage);
    this.third = new TetriminoHolder(stage);
    this.four = new TetriminoHolder(stage);
    this.blockLine = new Element('div');
    this.blockLine.drawRect(120, 60, '#FFFFFF');
    this.blockLine.move(0, 0);
    this.loader = new ElementLoader();
  }

  /**
   * このオブジェクトに必要な要素をロードします。
   */
  public load(): void {
    this.loader.addEventListener(Event.COMPLETE, this.tetriminoHolderCompleteListener);
    this.loader.set([
      this.first,
      this.second,
      this.third,
      this.four
    ]).load();
  }

  /**
   * このオブジェクトを初期化します。
   */
  public init(): void {
    this.list.splice(0, this.list.length);

    for (let i: number = 0; i < 10; i++) {
      let tetrimino: Tetrimino = TetriminoFactory.getRandom();
      tetrimino.stage = this.stage;
      this.list.push(tetrimino);
    }

    this.loader.addEventListener(Event.COMPLETE, this.tetriminoLoadCompleteListener);
    this.loader.set(this.list).load();
  }

  /**
   * このオブジェクトの先頭のテトリミノを取り出します。
   * @returns 取り出したテトリミノです。
   */
  public getTetrimino(): Tetrimino | null {
    let oldTetrimino: Tetrimino | null = this.first.removeTetrimino();

    if (oldTetrimino) {
      oldTetrimino.setStage();
    }

    let newTetrimino: Tetrimino = TetriminoFactory.getRandom();
    newTetrimino.stage = this.stage;
    newTetrimino.addEventListener(Event.COMPLETE, this.newTetriminoCompleteListener);
    newTetrimino.load();
    return oldTetrimino;
  }

  /**
   * このオブジェクトをリセットします。
   */
  public reset(): void {
    this.first.removeTetrimino();
    this.second.removeTetrimino();
    this.third.removeTetrimino();
    this.four.removeTetrimino();

    for (let i: number = 0; i < 10; i++) {
      try {
        this.list[i].clear();
      } catch (e) {}
    }

    this.list.splice(0, 10);
    this.init();
  }

  /**
   * @hidden
   */
  private tetriminoHolderCompleteListener = (): void => {
    this.loader.removeEventListener(Event.COMPLETE, this.tetriminoHolderCompleteListener);
    let array: Block[] = [];

    for (let i: number = 0, x: number = 0, y: number = 0; i < 18; i++) {
      let block: Block = new Block(Block.GRAY);
      block.move(x, y);
      this.blockLine.appendChild(block);
      array.push(block);
      x += 20;

      if (x == 120) {
        x = 0;
        y += 20;
      }
    }

    this.loader.addEventListener(Event.COMPLETE, this.blockLineCompleteListener);
    this.loader.set(array).load();
  }

  /**
   * @hidden
   */
  private tetriminoLoadCompleteListener = (): void => {
    this.loader.removeEventListener(Event.COMPLETE, this.tetriminoLoadCompleteListener);
    this.first.setTetrimino(this.list[0]);
    this.second.setTetrimino(this.list[1]);
    this.third.setTetrimino(this.list[2]);
    this.four.setTetrimino(this.list[3]);
    this.dispatchEvent(new Event(Event.COMPLETE));
  }

  /**
   * @hidden
   * @param event
   */
  private newTetriminoCompleteListener = (event: Event): void => {
    let tetrimino: Tetrimino = <Tetrimino>event.target;
    tetrimino.removeEventListener(Event.COMPLETE, this.newTetriminoCompleteListener);
    this.list.splice(0, 1);
    this.list.push(tetrimino);
    this.first.setTetrimino(this.list[0]);
    this.second.setTetrimino(this.list[1]);
    this.third.setTetrimino(this.list[2]);
    this.four.setTetrimino(this.list[3]);
    this.dispatchEvent(new Event(Event.COMPLETE));
  }

  /**
   * @hidden
   */
  private blockLineCompleteListener = (): void => {
    this.loader.removeEventListener(Event.COMPLETE, this.blockLineCompleteListener);
    this.first.move(70, 0);
    this.second.move(70, 60);
    this.third.move(70, 120);
    this.four.move(70, 180);
    this.blockLine.move(50, 220);
    this.appendChild(this.first);
    this.appendChild(this.second);
    this.appendChild(this.third);
    this.appendChild(this.four);
    this.appendChild(this.blockLine);
    this.init();
  }
}
