import Event from '../Events/Event';
import Tetrimino from '../Elements/Tetrimino';
import Display from './Display';
import Stage from './Stage';

/**
 * テトリミノを納めたホルダーを作成します。
 */
export default class TetriminoHolder extends Display {
  /**
   * このオブジェクトがロードされたかの真偽値です。
   */
  public isLoaded: boolean = false;

  /**
   * @hidden
   */
  private tetrimino: Tetrimino | null = null;

  /**
   * @hidden
   */
  private stage: Stage;

  /**
   * 新しいオブジェクトを作成します。
   * @param stage Stageオブジェクトの参照です。
   */
  constructor(stage: Stage) {
    super();
    this.stage = stage;
  }

  /**
   * このオブジェクトにテトリミノを追加します。
   * @param tetrimino 追加するテトリミノです。
   */
  public addTetrimino(tetrimino: Tetrimino): void {
    tetrimino.position = 0;
    tetrimino.createPosition(0);

    if (! tetrimino.isLoaded) {
      tetrimino.addEventListener(Event.COMPLETE, this.tetriminoLoadCompleteListener);
      tetrimino.load();
      tetrimino.stage = this.stage;
      return;
    }

    tetrimino.move(tetrimino.holdPoint.x, tetrimino.holdPoint.y);
    this.appendChild(tetrimino);
    this.tetrimino = tetrimino;
    tetrimino.stage = this.stage;
    this.dispatchEvent(new Event(Event.COMPLETE));
  }

  /**
   * このオブジェクトに追加されているテトリミノを、指定したテトリミノに置き換えます。
   * @param tetrimino 追加するテトリミノです。
   */
  public setTetrimino(tetrimino: Tetrimino): void {
    this.removeTetrimino();
    this.addTetrimino(tetrimino);
  }

  /**
   * このオブジェクトからテトリミノを削除します。
   * @returns 削除されたテトリミノです。
   */
  public removeTetrimino(): Tetrimino | null {
    let tetrimino: Tetrimino | null = this.tetrimino;

    if (tetrimino) {
      this.removeChild(tetrimino);
    }

    return tetrimino;
  }

  /**
   * このオブジェクトにテトリミノが追加されているか確認します。
   * @returns テトリミノが追加されていなければtrueを返します。
   */
  public isEmpty(): boolean {
    return this.tetrimino == null;
  }

  /**
   * @hidden
   * @param event
   */
  private tetriminoLoadCompleteListener = (event: Event): void => {
    let tetrimino: Tetrimino = <Tetrimino>event.target;
    tetrimino.removeEventListener(Event.COMPLETE, this.tetriminoLoadCompleteListener);
    tetrimino.move(tetrimino.holdPoint.x, tetrimino.holdPoint.y);
    this.appendChild(tetrimino);
    this.tetrimino = tetrimino;
    this.dispatchEvent(new Event(Event.COMPLETE));
  }
}
