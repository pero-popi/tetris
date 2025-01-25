import Event from '../Events/Event';
import Element from '../Elements/Element';
import ElementLoader from '../Utils/ElementLoader';
import Image from '../Elements/Image';
import Display from './Display';
import Stage from './Stage';

/**
 * ポーズボタンを作成します。
 */
export default class PauseDisplay extends Display {
  /**
   * @hidden
   */
  private stage: Stage;

  /**
   * @hidden
   */
  private upImage: Image;

  /**
   * @hidden
   */
  private downImage: Image;

  /**
   * @hidden
   */
  private cover: Element;

  /**
   * @hidden
   */
  private isPause: boolean = false;

  /**
   * 新しいオブジェクトを作成します。
   * @parem stage Stageオブジェクトの参照です。
   */
  constructor(stage: Stage) {
    super();
    this.stage = stage;
    this.upImage = new Image('assets/images/pause_btn_1.png');
    this.upImage.move(0, 0);
    this.downImage = new Image('assets/images/pause_btn_2.png');
    this.downImage.move(0, 0);
    this.cover = new Element('div');
    this.cover.drawRect(80, 40, '#FFFFFF');
    this.cover.set('css.cursor', 'pointer');
    this.cover.move(0, 0);
    this.cover.setAlpha(0);
    this.cover.addEventListener(Event.MOUSE_DOWN, this.imageMouseDownListener);
  }

  /**
   * このオブジェクトをリセットします。
   */
  public reset(): void {
    this.appendChild(this.downImage);
    this.appendChild(this.upImage);
    this.appendChild(this.cover);
    this.isPause = false;
  }

  /**
   * このオブジェクトを表示します。
   */
  public show(): void {
    this.removeEventListener(Event.COMPLETE, this.buttonImageLoadCompleteListener);
    let loader: ElementLoader = new ElementLoader([this.upImage, this.downImage]);
    loader.addEventListener(Event.COMPLETE, this.buttonImageLoadCompleteListener);
    loader.load();
  }

  /**
   * @hidden
   */
  private imageMouseDownListener = (): void => {
    this.stage.stopSoundPlay();
    this.appendChild(this.isPause ? this.upImage : this.downImage);
    this.isPause = ! this.isPause;
    this.stage.pause();
    this.appendChild(this.cover);
  }

  /**
   * @hidden
   * @param event
   */
  private buttonImageLoadCompleteListener = (event: Event): void => {
    event.target!.removeEventListener(Event.COMPLETE, this.buttonImageLoadCompleteListener);
    this.appendChild(this.downImage);
    this.appendChild(this.upImage);
    this.appendChild(this.cover);
    this.dispatchEvent(new Event(Event.SHOW_END));
  }
}
