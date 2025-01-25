import Block from './Block';
import Tetrimino from './Tetrimino';

/**
 * テトリミノIを作成します。
 */
export default class TetriminoI extends Tetrimino {
  /**
   * 新しいオブジェクトを作成します。
   */
  constructor() {
    super();
    this.move(60, -80);
    this.type = 0;
    this.initParam = {x: 60, width: 80};
    this.holdPoint = {x: 0, y: 0};
    this.blocks = [
      new Block(Block.BLUE, this),
      new Block(Block.BLUE, this),
      new Block(Block.BLUE, this),
      new Block(Block.BLUE, this)
    ];
    this.rollPositions1 = [
      [{x: 0, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 60, y: 20}],
      [{x: 40, y: 0}, {x: 40, y: 20}, {x: 40, y: 40}, {x: 40, y: 60}],
      [{x: 0, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 60, y: 20}],
      [{x: 40, y: 0}, {x: 40, y: 20}, {x: 40, y: 40}, {x: 40, y: 60}]
    ];
    this.rollPositions2 = [
      [{x: 0, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 60, y: 20}],
      [{x: 40, y: -40}, {x: 40, y: -20}, {x: 40, y: 0}, {x: 40, y: 20}],
      [{x: 0, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 60, y: 20}],
      [{x: 40, y: -40}, {x: 40, y: -20}, {x: 40, y: 0}, {x: 40, y: 20}]
    ];
    this.rollPositions = this.rollPositions1;
  }
}
