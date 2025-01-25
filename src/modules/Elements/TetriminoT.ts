import Block from './Block';
import Tetrimino from './Tetrimino';

/**
 * テトリミノTを作成します。
 */
export default class TetriminoT extends Tetrimino {
  /**
   * 新しいオブジェクトを作成します。
   */
  constructor() {
    super();
    this.move(60, -80);
    this.type = 6;
    this.initParam = {x: 60, width: 60};
    this.holdPoint = {x: 0, y: -20};
    this.blocks = [
      new Block(Block.PURPLE, this),
      new Block(Block.PURPLE, this),
      new Block(Block.PURPLE, this),
      new Block(Block.PURPLE, this)
    ];
    this.rollPositions = [
      [{x: 0, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 20, y: 40}],
      [{x: 0, y: 20}, {x: 20, y: 0}, {x: 20, y: 20}, {x: 20, y: 40}],
      [{x: 20, y: 20}, {x: 0, y: 40}, {x: 20, y: 40}, {x: 40, y: 40}],
      [{x: 20, y: 0}, {x: 20, y: 20}, {x: 20, y: 40}, {x: 40, y: 20}]
    ];
  }
}
