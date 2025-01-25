import Random from '../Utils/Random';
import Block from './Block';
import TetriminoI from './TetriminoI';
import TetriminoJ from './TetriminoJ';
import TetriminoL from './TetriminoL';
import TetriminoO from './TetriminoO';
import TetriminoS from './TetriminoS';
import TetriminoT from './TetriminoT';
import TetriminoZ from './TetriminoZ';
import Tetrimino from './Tetrimino';

/**
 * テトリミノのファクトリーです。
 */
export default class TetriminoFactory {
  /**
   * @hidden
   */
  private static random: Random = new Random(7);

  /**
   * テトリミノを取得します。
   * @param type テトリミノのタイプです。
   * @returns テトリミノです。
   */
  public static get(type: number): Tetrimino {
    return TetriminoFactory.getTetrimino(type);
  }

  /**
   * テトリミノをランダムで取得します。
   * @returns テトリミノです。
   */
  public static getRandom(): Tetrimino {
    return TetriminoFactory.getTetrimino(TetriminoFactory.random.next());
  }

  /**
   * 指定したテトリミノのクローンを作成します。
   * @param tetrimino 指定するテトリミノです。
   * @returns 指定したテトリミノのクローンです。
   */
  public static getClone(tetrimino: Tetrimino): Tetrimino {
    let clone: Tetrimino = TetriminoFactory.getTetrimino(tetrimino.type);
    clone.stage = tetrimino.stage;
    return clone;
  }

  /**
   * 指定したテトリミノのゴーストを作成します。
   * @param tetrimino 指定するテトリミノです。
   * @returns 指定したテトリミノのゴーストです。
   */
  public static getGhost(tetrimino: Tetrimino): Tetrimino {
    let ghost: Tetrimino = TetriminoFactory.getClone(tetrimino);
    ghost.blocks = [
      new Block(Block.GRAY, ghost),
      new Block(Block.GRAY, ghost),
      new Block(Block.GRAY, ghost),
      new Block(Block.GRAY, ghost)
    ];

    for (let key in ghost.blocks) {
      ghost.blocks[key].setAlpha(0.2);
    }

    ghost.load();
    return ghost;
  }

  /**
   * @hidden
   */
  private static getTetrimino(type: number): Tetrimino {
    if (type == 0) {
      return new TetriminoI();
    } else if (type == 1) {
      return new TetriminoO();
    } else if (type == 2) {
      return new TetriminoJ();
    } else if (type == 3) {
      return new TetriminoL();
    } else if (type == 4) {
      return new TetriminoS();
    } else if (type == 5) {
      return new TetriminoZ();
    } else if (type == 6) {
      return new TetriminoT();
    } else {
      throw new TypeError('There is no type of Tetrimino.');
    }
  }
}
