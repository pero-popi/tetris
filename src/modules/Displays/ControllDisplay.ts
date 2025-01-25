import Event from '../Events/Event';
import Element from '../Elements/Element';
import ElementLoader from '../Utils/ElementLoader';
import ControllBlockSpace from './ControllBlockSpace';
import ResetDisplay from './ResetDisplay';
import StartDisplay from './StartDisplay';
import Stage from './Stage';

/**
 * コントロールボタンを納めたオブジェクトを作成します。
 */
export default class ControllDisplay extends Element {
  /**
   * スタートボタンです。
   */
  public start: StartDisplay;

  /**
   * リセットボタンです。
   */
  public reset: ResetDisplay;

  /**
   * @hidden
   */
  private blockSpace: ControllBlockSpace;

  /**
   * @hidden
   */
  private count: number = 0;

  /**
   * @hidden
   */
  private loader: ElementLoader;

  /**
   * 新しいオブジェクトを作成します。
   * @param stage Stageオブジェクトの参照です。
   */
  constructor(stage: Stage) {
    super('div');
    this.start = new StartDisplay(stage);
    this.reset = new ResetDisplay(stage);
    this.blockSpace = new ControllBlockSpace();
    this.loader = new ElementLoader([this.start, this.reset, this.blockSpace]);
    this.loader.addEventListener(Event.COMPLETE, this.displayLoadCompleteListener);
  }

  /**
   * このオブジェクトに必要な要素をロードします。
   */
  public load(): void {
    this.loader.load();
  }

  /**
   * このオブジェクトを表示します。
   */
  public show(): void {
    this.start.addEventListener(Event.SHOW_END, this.showendListener);
    this.reset.addEventListener(Event.SHOW_END, this.showendListener);
    this.start.show();
    this.reset.show();
  }

  /**
   * @hidden
   */
  private displayLoadCompleteListener = (): void => {
    this.loader.removeEventListener(Event.COMPLETE, this.displayLoadCompleteListener);
    this.start.move(0, 0);
    this.reset.move(0, 60);
    this.blockSpace.move(-20, 100);
    this.dispatchEvent(new Event(Event.COMPLETE));
  }

  /**
   * @hidden
   * @param event
   */
  private showendListener = (event: Event): void => {
    event.target!.removeEventListener(Event.SHOW_END, this.showendListener);
    this.count++;

    if (this.count == 2) {
      this.appendChild(this.start);
      this.appendChild(this.reset);
      this.appendChild(this.blockSpace);
      this.dispatchEvent(new Event(Event.SHOW_END));
    }
  }
}
