import Event from '../Events/Event';
import Stage from '../Displays/Stage';
import Block from './Block';
import Element from './Element';
import ElementLoader from '../Utils/ElementLoader';
import Rect from '../Utils/Rect';
import Rectangle from '../Utils/Rectangle';

/**
 * テトリミノを作成します。
 */
export default class Tetrimino extends Element {
  /**
   * @hidden
   */
  private static rectangle: Rectangle = new Rectangle();

  /**
   * @hidden
   */
  private static rectObject: Rect = {x: 0, y: 0, width: 20, height: 20};

  /**
   * Stageオブジェクトの参照です。
   */
  public stage: Stage | null = null;

  /**
   * このテトリミノが保持するブロックの配列です。
   */
  public blocks: Block[] = [];

  /**
   * このテトリミノの回転を指示するオブジェクトです。
   */
  public rollPositions: {x: number, y: number}[][] = [];

  /**
   * このテトリミノの回転を指示するオブジェクトです。
   */
  public rollPositions1: {x: number, y: number}[][] = [];

  /**
   * このテトリミノの回転を指示するオブジェクトです。
   */
  public rollPositions2: {x: number, y: number}[][] = [];

  /**
   * このテトリミノの時計回りの回転を指示するオブジェクトです。
   */
  public forwardPositions: {x: number, y: number}[][] = [];

  /**
   * このテトリミノの反時計回りの回転を指示するオブジェクトです。
   */
  public reversePositions: {x: number, y: number}[][] = [];

  /**
   * このテトリミノの初期値の座標を表すオブジェクトです。
   */
  public initParam: {x: number, width: number} = {x: 0, width: 0};

  /**
   * このテトリミノのホールド状態の座標を表すオブジェクトです。
   */
  public holdPoint: {x: number, y: number} = {x: 0, y: 0};

  /**
   * このテトリミノの回転位置を表す
   */
  public position: number = 0;

  /**
   * このテトリミノがロードされたかを表す真偽値です。
   */
  public isLoaded: boolean = false;

  /**
   * このテトリミノのタイプです。
   */
  public type: number = 0;

  /**
   * @hidden
   */
  private isForward: boolean = true;

  /**
   * @hidden
   */
  private loader: ElementLoader;

  /**
   * 新しいオブジェクトを作成します。
   */
  constructor() {
    super('div');
    this.loader = new ElementLoader();
    this.loader.addEventListener(Event.COMPLETE, this.blockLoadCompleteListener);
  }

  /**
   * このテトリミノのx座標を取得します。
   * @returns このテトリミノのx座標です。
   */
  public getX(): number {
    return Tetrimino.rectangle.getX(this);
  }

  /**
   * このテトリミノのy座標を取得します。
   * @returns このテトリミノのy座標です。
   */
  public getY(): number {
    return Tetrimino.rectangle.getY(this);
  }

  /**
   * このテトリミノをロードします。
   */
  public load(): void {
    if (this.loader) {
      this.loader.set(this.blocks).load();
    }
  }

  /**
   * このテトリミノをステージに追加します。
   */
  public setStage(): void {
    if (this.initParam.width == 40) {
      this.move(this.initParam.x, 0);
    } else if (this.getY() == -60) {
      this.move(this.initParam.x, 0);
    } else {
      this.move(this.initParam.x, -20);
    }
  }

  /**
   * このテトリミノが右移動できるかの真偽値を返します。
   * @returns 右移動できる場合はtrueを返します。
   */
  public rightMoveCheck(): boolean {
    for (let i: number = 0; i < 4; i++) {
      let rect: Rect = this.blocks[i].getFieldRect();
      rect.x += 20;

      if (rect.x > 180) {
        return false;
      }

      if (this.stage && ! this.stage.activeBlockCheck(rect)) {
        return false;
      }
    }

    return true;
  }

  /**
   * このテトリミノが左移動できるかの真偽値を返します。
   * @returns 左移動できる場合はtrueを返します。
   */
  public leftMoveCheck(): boolean {
    for (let i: number = 0; i < 4; i++) {
      let rect: Rect = this.blocks[i].getFieldRect();
      rect.x -= 20;

      if (rect.x < 0) {
        return false;
      }

      if (this.stage && ! this.stage.activeBlockCheck(rect)) {
        return false;
      }
    }

    return true;
  }

  /**
   * このテトリミノが下移動できるかの真偽値を返します。
   * @returns 下移動できる場合はtrueを返します。
   */
  public bottomMoveCheck(): boolean {
    for (let i: number = 0; i < 4; i++) {
      let rect: Rect = this.blocks[i].getFieldRect();
      rect.y += 20;

      if (rect.y > 380) {
        return false;
      }

      if (this.stage && ! this.stage.activeBlockCheck(rect)) {
        return false;
      }
    }

    return true;
  }

  /**
   * このテトリミノが上移動できるかの真偽値を返します。
   * @returns 上移動できる場合はtrueを返します。
   */
  public topMoveCheck(): boolean {
    for (let i: number = 0; i < 4; i++) {
      let rect: Rect = this.blocks[i].getFieldRect();
      rect.y -= 20;

      if (this.stage && ! this.stage.activeBlockCheck(rect)) {
        return false;
      }
    }

    return true;
  }

  /**
   * このテトリミノを右に移動します。
   */
  public rightMove(): boolean {
    if (this.rightMoveCheck()) {
      this.set('css.left', (this.getX() + 20) + 'px');
      return true;
    }

    return false;
  }

  /**
   * このテトリミノを左に移動します。
   */
  public leftMove(): boolean {
    if (this.leftMoveCheck()) {
      this.set('css.left', (this.getX() - 20) + 'px');
      return true;
    }

    return false;
  }

  /**
   * このテトリミノを下に移動します。
   */
  public bottomMove(): boolean {
    if (this.bottomMoveCheck()) {
      this.set('css.top', (this.getY() + 20) + 'px');
      return true;
    }

    return false;
  }

  /**
   * このテトリミノを上に移動します。
   */
  public topMove(): boolean {
    if (this.topMoveCheck()) {
      this.set('css.top', (this.getY() - 20) + 'px');
      return true;
    }

    return false;
  }

  /**
   * このテトリミノをハードドロップします。
   */
  public hardDrop(): void {
    while (this.bottomMove()) {}
  }

  /**
   * このテトリミノの回転位置を指定します。
   * @param position 指定する回転位置です。
   */
  public createPosition(position: number): void {
    let positions: {x: number, y: number}[] = this.rollPositions[position];

    for (let i: number = 0; i < 4; i++) {
      let block: Block = this.blocks[i];
      let rect: {x: number, y: number} = positions[i];
      block.move(rect.x, rect.y);
    }
  }

  /**
   * このテトリミノを時計周りに回転できるか確認します。
   * @returns 回転できる場合にtrueを返します。
   */
  public forwardRoll(): boolean {
    this.isForward = true;
    return this.rollCheck();
  }

  /**
   * このテトリミノを反時計周りに回転できるか確認します。
   * @returns 回転できる場合にtrueを返します。
   */
  public reverseRoll(): boolean {
    this.isForward = false;
    return this.rollCheck();
  }

  /**
   * このテトリミノをクリアします。
   */
  public clear(): void {
    if (this.stage) {
      this.stage.removeChild(this);
    }

    for (let i: number = 0; i < 4; i++) {
      try {
        this.blocks[i].clear();
      } catch (e) {}
    }
  }

  /**
   * @hidden
   */
  private rollPositionCheck(): boolean {
    let position: number = this.isForward ? (this.position + 1) : (this.position - 1);

    if (position == 4) {
      position = 0;
    }

    if (position == -1) {
      position = 3;
    }

    let positions: {x: number, y: number}[] = this.rollPositions[position];

    for (let i: number = 0; i < 4; i++) {
      let pos: {x: number, y: number} = positions[i];
      let rect: Rect = this.createRect(pos);

      if (this.stage && ! this.stage.activeBlockCheck(rect)) {
        return false;
      }
    }

    return true;
  }

  /**
   * @hidden
   */
  private rollFieldCheck(): boolean {
    this.rollTypeCheck();

    if (this.rollPositionCheck()) {
      return true;
    }

    if (this.leftMove()) {
      if (this.rollPositionCheck()) {
        return true;
      }

      this.rightMove();
    }

    if (this.rightMove()) {
      if (this.rollPositionCheck()) {
        return true;
      }

      if (this.type == 0 && (this.position == 1 || this.position == 3) && this.rightMove()) {
        if (this.rollPositionCheck()) {
          return true;
        }

        this.leftMove();
        this.leftMove();
      } else {
        this.leftMove();
      }
    }

    this.set('css.left', (this.getX() + 20) + 'px');

    if (this.rollPositionCheck()) {
      return true;
    }

    this.leftMove();
    this.set('css.left', (this.getX() - 20) + 'px');

    if (this.rollPositionCheck()) {
      return true;
    }

    this.rightMove();
    return false;
  }

  /**
   * @hidden
   */
  private rollTypeCheck(): void {
    if (this.type == 0) {
      this.rollPositions = this.bottomMoveCheck() ? this.rollPositions1 : this.rollPositions2;
    }
  }

  /**
   * @hidden
   */
  private rollCheck(): boolean {
    if (this.rollFieldCheck()) {
      this.roll();
      return true;
    }

    if (this.topMove()) {
      if (this.rollFieldCheck()) {
        this.roll();
        return true;
      }

      if (this.topMove()) {
        if (this.rollFieldCheck()) {
          this.roll();
          return true;
        }

        if (this.topMove()) {
          if (this.rollFieldCheck()) {
            this.roll();
            return true;
          }

          this.bottomMove();
          this.bottomMove();
          this.bottomMove();
          return false;
        }

        this.bottomMove();
        this.bottomMove();
        return false;
      }

      this.bottomMove();
      return false;
    }

    return false;
  }

  /**
   * @hidden
   */
  private roll(): void {
    this.isForward ? this.position++ : this.position--;

    if (this.position == 4) {
      this.position = 0;
    }

    if (this.position == -1) {
      this.position = 3;
    }

    this.createPosition(this.position);
  }

  /**
   * @hidden
   * @param position
   */
  private createRect(position: {x: number, y: number}): Rect {
    Tetrimino.rectObject.x = position.x + this.getX();
    Tetrimino.rectObject.y = position.y + this.getY();
    return Tetrimino.rectObject;
  }

  /**
   * @hidden
   */
  private blockLoadCompleteListener = (): void => {
    this.loader.removeEventListener(Event.COMPLETE, this.blockLoadCompleteListener);
    this.createPosition(this.position);

    for (let i: number = 0; i < 4; i++) {
      this.appendChild(this.blocks[i]);
    }

    this.isLoaded = true;
    this.dispatchEvent(new Event(Event.COMPLETE));
  }
}
