import Event from '../Events/Event';
import Element from '../Elements/Element';
import ElementLoader from '../Utils/ElementLoader';
import Image from '../Elements/Image';
import Display from './Display';
import Stage from './Stage';

/**
 * リセットボタンを作成します。
 */
export default class ResetDisplay extends Display {
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
   * 新しいオブジェクトを作成します。
   * @param stage Stageオブジェクトの参照です。
   */
  constructor(stage: Stage) {
    super();
    this.stage = stage;
    this.upImage = new Image('assets/images/reset_btn_1.png');
    this.upImage.move(0, 0);
    this.downImage = new Image('assets/images/reset_btn_2.png');
    this.downImage.move(0, 0);
    this.cover = new Element('div');
    this.cover.drawRect(80, 40, '#FFFFFF');
    this.cover.set('css.cursor', 'pointer');
    this.cover.move(0, 0);
    this.cover.setAlpha(0);
    this.cover.addEventListener(Event.MOUSE_DOWN, this.imageMouseDownListener);
    this.cover.addEventListener(Event.MOUSE_UP, this.imageMouseUpListener);
    this.cover.addEventListener(Event.MOUSE_OUT, this.imageMouseUpListener);
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
    this.stage.appendChild(this.stage.title);
    this.stage.stopSoundPlay();
    this.appendChild(this.downImage);
    this.appendChild(this.cover);
    this.stage.reset();
  }

  /**
   * @hidden
   */
  private imageMouseUpListener = (): void => {
    this.appendChild(this.upImage);
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
