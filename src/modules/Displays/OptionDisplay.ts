import Event from '../Events/Event';
import Element from '../Elements/Element';
import ElementLoader from '../Utils/ElementLoader';
import OptionBlockSpace from './OptionBlockSpace';
import GhostDisplay from './GhostDisplay';
import PauseDisplay from './PauseDisplay';
import Stage from './Stage';

/**
 * オプションボタンを納めたオブジェクトを作成します。
 */
export default class OptionDisplay extends Element {
  /**
   * ゴーストを表示・非表示にするボタンです。
   */
  public ghost: GhostDisplay;

  /**
   * ポーズボタンです。
   */
  public pause: PauseDisplay;

  /**
   * @hidden
   */
  private blockSpace: OptionBlockSpace;

  /**
   * @hidden
   */
  private loader: ElementLoader;

  /**
   * @hidden
   */
  private count: number = 0;

  /**
   * 新しいオブジェクトを作成します。
   * @param stage Stageオブジェクトの参照です。
   */
  constructor(stage: Stage) {
    super('div');
    this.ghost = new GhostDisplay(stage);
    this.pause = new PauseDisplay(stage);
    this.blockSpace = new OptionBlockSpace();
    this.loader = new ElementLoader([this.ghost, this.pause, this.blockSpace]);
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
    this.ghost.addEventListener(Event.SHOW_END, this.showendListener);
    this.pause.addEventListener(Event.SHOW_END, this.showendListener);
    this.ghost.show();
    this.pause.show();
  }

  /**
   * @hidden
   */
  private displayLoadCompleteListener = (): void => {
    this.loader.removeEventListener(Event.COMPLETE, this.displayLoadCompleteListener);
    this.ghost.move(0, 0);
    this.pause.move(0, 60);
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
      this.appendChild(this.ghost);
      this.appendChild(this.pause);
      this.appendChild(this.blockSpace);
      this.dispatchEvent(new Event(Event.SHOW_END));
    }
  }
}
