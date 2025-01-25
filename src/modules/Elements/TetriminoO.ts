import Block from './Block';
import Tetrimino from './Tetrimino';

/**
 * テトリミノOを作成します。
 */
export default class TetriminoO extends Tetrimino {
  /**
   * 新しいオブジェクトを作成します。
   */
  constructor() {
    super();
    this.move(80, -60);
    this.type = 1;
    this.initParam = {x: 80, width: 40};
    this.holdPoint = {x: 20, y: 0};
    this.blocks = [
      new Block(Block.YELLOW, this),
      new Block(Block.YELLOW, this),
      new Block(Block.YELLOW, this),
      new Block(Block.YELLOW, this)
    ];
    this.rollPositions = [
      [{x: 0, y: 0}, {x: 20, y: 0}, {x: 0, y: 20}, {x: 20, y: 20}],
      [{x: 0, y: 0}, {x: 20, y: 0}, {x: 0, y: 20}, {x: 20, y: 20}],
      [{x: 0, y: 0}, {x: 20, y: 0}, {x: 0, y: 20}, {x: 20, y: 20}],
      [{x: 0, y: 0}, {x: 20, y: 0}, {x: 0, y: 20}, {x: 20, y: 20}]
    ];
  }
}
