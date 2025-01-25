import Event from '../Events/Event';
import Element from '../Elements/Element';
import ElementLoader from '../Utils/ElementLoader';
import PointBlockSpace from './PointBlockSpace';
import LevelDisplay from './LevelDisplay';
import LineDisplay from './LineDisplay';
import ScoreDisplay from './ScoreDisplay';

/**
 * 全ての点数ディスプレイを納めたオブジェクトを作成します。
 */
export default class PointDisplay extends Element {
  /**
   * スコアディスプレイです。
   */
  public score: ScoreDisplay;

  /**
   * ラインディスプレイです。
   */
  public line: LineDisplay;

  /**
   * レベルディスプレイです。
   */
  public level: LevelDisplay;

  /**
   * @hidden
   */
  private blockSpace: PointBlockSpace;

  /**
   * @hidden
   */
  private loader: ElementLoader;

  /**
   * 新しいオブジェクトを作成します。
   */
  constructor() {
    super('div');
    this.score = new ScoreDisplay();
    this.line = new LineDisplay();
    this.level = new LevelDisplay();
    this.blockSpace = new PointBlockSpace();
    this.loader = new ElementLoader([this.score, this.line, this.level, this.blockSpace]);
    this.loader.addEventListener(Event.COMPLETE, this.displayLoadCompleteListener);
  }

  /**
   * このオブジェクトに必要な要素をロードします。
   */
  public load(): void {
    this.loader.load();
  }

  /**
   * リセットします。
   */
  public reset(): void {}

  /**
   * @hidden
   */
  private displayLoadCompleteListener = (): void => {
    this.loader.removeEventListener(Event.COMPLETE, this.displayLoadCompleteListener);
    this.score.move(0, 0);
    this.line.move(0, 60);
    this.level.move(0, 120);
    this.blockSpace.move(-20, 160);
    this.appendChild(this.score);
    this.appendChild(this.line);
    this.appendChild(this.level);
    this.appendChild(this.blockSpace);
    this.dispatchEvent(new Event(Event.COMPLETE));
  }
}
