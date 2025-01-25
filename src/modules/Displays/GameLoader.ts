import Event from '../Events/Event';
import Element from '../Elements/Element';
import ElementLoader from '../Utils/ElementLoader';
import Image from '../Elements/Image';
import Timer from '../Utils/Timer';
import Stage from './Stage';

/**
 * ゲームを読み込み、実行するオブジェクトです。
 */
export default class GameLoader extends Element {
  /**
   * @hidden
   */
  private documentBody: Element;

  /**
   * @hidden
   */
  private stage: Stage;

  /**
   * @hidden
   */
  private timer: Timer;

  /**
   * @hidden
   */
  private text: Element;

  /**
   * @hidden
   */
  private images: Image[] = [];

  /**
   * @hidden
   */
  private imageCount: number = 0;

  /**
   * @hidden
   */
  private loader: ElementLoader;

  /**
   * 新しいオブジェクトを作成します。
   */
  constructor() {
    super('div');
    this.drawRect(520, 440, '#000000');
    this.move(0, 0);
    this.documentBody = new Element(document.body);
    this.documentBody.params({
      'css.fontFamily': '"メイリオ", "Meiryo", "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "ＭＳ Ｐゴシック", sans-serif',
      'css.backgroundColor': '#000000'
    });
    this.stage = new Stage();
    this.stage.addEventListener(Event.COMPLETE, this.stageLoadCompleteListener);
    this.timer = new Timer(100, 0);
    this.timer.addEventListener(Event.TIMER, this.timerListener);
    this.text = new Element('label');
    this.text.params({
      'css.width': '81px',
      'css.color': '#FFFFFF',
      'css.fontSize': '15px',
      'css.textAlign': 'center',
      'innerHTML': 'Loading ...'
    });
    this.text.move(220, 265);

    for (let i: number = 0; i < 4; i++) {
      let image: Image = new Image('assets/images/loading_' + (i + 1) + '.png');
      image.move(220, 180);
      this.images.push(image);
    }

    this.loader = new ElementLoader(this.images);
    this.loader.addEventListener(Event.COMPLETE, this.loadCompleteListener);
    this.loader.load();
    this.move((parseInt(this.documentBody.get('scrollWidth')) - 520) / 2, (window.innerHeight - 440) / 2);
    window.addEventListener(Event.RESIZE, this.windowResizeListener);
  }

  /**
   * @hidden
   */
  private loadCompleteListener = (): void => {
    this.documentBody.appendChild(this);
    this.appendChild(this.text);
    this.timer.start();
    this.stage.load();
  }

  /**
   * @hidden
   */
  private timerListener = (): void => {
    try {
      this.removeChild(this.images[this.imageCount]);
    } catch (e) {}

    this.imageCount++;

    if (this.imageCount == 4) {
      this.imageCount = 0;
    }

    this.appendChild(this.images[this.imageCount]);
  }

  /**
   * @hidden
   */
  private stageLoadCompleteListener = (): void => {
    this.timer.reset();
    this.timer.removeEventListener(Event.TIMER, this.timerListener);
    this.stage.removeEventListener(Event.COMPLETE, this.stageLoadCompleteListener);
    this.documentBody.removeChild(this);
    this.stage.move((parseInt(this.documentBody.get('scrollWidth')) - 200) / 2, (window.innerHeight - 440) / 2);
    this.documentBody.appendChild(this.stage);
    this.windowResizeListener();
    window.removeEventListener(Event.RESIZE, this.windowResizeListener);
  }

  /**
   * @hidden
   */
  private windowResizeListener = (): void => {
    this.move((parseInt(this.documentBody.get('scrollWidth')) - 520) / 2, (window.innerHeight - 440) / 2);
  }
}
