import Image from './Image';
import Rect from '../Utils/Rect';
import Rectangle from '../Utils/Rectangle';
import Tetrimino from './Tetrimino';

/**
 * テトリミノを構成するブロックを作成します。
 */
export default class Block extends Image {
  /**
   * レッドを表す整数です。
   */
  public static RED: number = 0;

  /**
   * オレンジを表す整数です。
   */
  public static ORANGE: number = 1;

  /**
   * イエローを表す整数です。
   */
  public static YELLOW: number = 2;

  /**
   * グリーンを表す整数です。
   */
  public static GREEN: number = 3;

  /**
   * ブルーを表す整数です。
   */
  public static BLUE: number = 4;

  /**
   * パープルを表す整数です。
   */
  public static PURPLE: number = 5;

  /**
   * ネイビーを表す整数です。
   */
  public static NAVY: number = 6;

  /**
   * グレイを表す整数です。
   */
  public static GRAY: number = 7;

  /**
   * ホワイトを表す整数です。
   */
  public static WHITE: number = 8;

  /**
   * @hidden
   */
  private static colors: string[] = [
    'assets/images/block_red.png',
    'assets/images/block_orange.png',
    'assets/images/block_yellow.png',
    'assets/images/block_green.png',
    'assets/images/block_blue.png',
    'assets/images/block_purple.png',
    'assets/images/block_navy.png',
    'assets/images/block_gray.png',
    'assets/images/block_white.png'
  ];

  /**
   * @hidden
   */
  private static rectangle: Rectangle = new Rectangle();

  /**
   * @hidden
   */
  private static rectObject: Rect = {x: 0, y: 0, width: 20, height: 20};

  /**
   * このブロックを保持しているテトリミノです。
   */
  public parentTetrimino: Tetrimino | null = null;

  /**
   * 新しいオブジェクトを作成します。
   * @param color ブロックの色を表す整数です。
   * @param parentTetrimino このブロックを保持しているテトリミノです。
   */
  constructor(color: number, parentTetrimino?: Tetrimino) {
    super(Block.colors[color]);
    this.drawRect(20, 20, '#FFFFFF');
    this.move(0, 0);

    if (parentTetrimino) {
      this.parentTetrimino = parentTetrimino;
    }
  }

  /**
   * このブロックのx座標を取得します。
   * @returns このブロックのx座標です。
   */
  public getX(): number {
    return Block.rectangle.getX(this);
  }

  /**
   * このブロックのy座標を取得します。
   * @returns このブロックのy座標です。
   */
  public getY(): number {
    return Block.rectangle.getY(this);
  }

  /**
   * このブロックのRectオブジェクトを取得します。
   * @returns このブロックのRectオブジェクトです。
   */
  public getRect(): Rect {
    return Block.rectangle.getRect(this);
  }

  /**
   * このブロックのフィールド上のx座標を取得します。
   * @returns このブロックのフィールド上のx座標です。
   */
  public getFieldX(): number {
    return Block.rectangle.getX(this) + (this.parentTetrimino ? this.parentTetrimino.getX() : 0);
  }

  /**
   * このブロックのフィールド上のy座標を取得します。
   * @returns このブロックのフィールド上のy座標です。
   */
  public getFieldY(): number {
    return Block.rectangle.getY(this) + (this.parentTetrimino ? this.parentTetrimino.getY() : 0);
  }

  /**
   * このブロックのフィールド上のRectオブジェクトを取得します。
   * @returns このブロックのフィールド上のRectオブジェクトです。
   */
  public getFieldRect(): Rect {
    Block.rectObject.x = this.getFieldX();
    Block.rectObject.y = this.getFieldY();
    return Block.rectObject;
  }

  /**
   * このブロックをクリアします。
   */
  public clear(): void {
    let tetrimino: Tetrimino | null = this.parentTetrimino;

    if (tetrimino) {
      try {
        tetrimino.removeChild(this);
      } catch (e) {}

      for (let i: number = 0, n: number = tetrimino.blocks.length; i < n; i++) {
        if (tetrimino.blocks[i] === this) {
          tetrimino.blocks.splice(i, 1);
          break;
        }
      }

      if (tetrimino.blocks.length == 0) {
        try {
          tetrimino.clear();
        } catch (e) {}
      }
    }
  }
}
