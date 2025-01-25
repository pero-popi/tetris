import Event from '../Events/Event';
import Block from '../Elements/Block';
import Element from '../Elements/Element';
import ElementLoader from '../Utils/ElementLoader';
import Image from '../Elements/Image';
import Rect from '../Utils/Rect';
import Tetrimino from '../Elements/Tetrimino';
import TetriminoFactory from '../Elements/TetriminoFactory';
import Timer from '../Utils/Timer';
import ControllDisplay from './ControllDisplay';
import OptionDisplay from './OptionDisplay';
import PointDisplay from './PointDisplay';
import TetriminoHolder from './TetriminoHolder';
import TetriminoList from './TetriminoList';

/**
 * 全てのディスプレイを表示するステージを作成します。
 */
export default class Stage extends Element {
  /**
   * 表示されているブロックの配列です。
   */
  public activeBlocks: any = {};

  /**
   * タイトル画像です。
   */
  public title: Image;

  /**
   * ゴーストテトリミノです。
   */
  public ghostTetrimino: Tetrimino | null = null;

  /**
   * @hidden
   */
  private keyCodes: {left: boolean, right: boolean} = {left: false, right: false};

  /**
   * @hidden
   */
  private score: number[] = [500, 1000, 2000, 4000];

  /**
   * @hidden
   */
  private fields: Block[] = [];

  /**
   * @hidden
   */
  private moveCount: number = 0;

  /**
   * @hidden
   */
  private clearCound: number = 0;

  /**
   * @hidden
   */
  private showCount: number = 0;

  /**
   * @hidden
   */
  private totalMoveCount: number = 0;

  /**
   * @hidden
   */
  private dropCheckFlag: boolean = false;

  /**
   * @hidden
   */
  private ishold: boolean = false;

  /**
   * @hidden
   */
  private isPause: boolean = false;

  /**
   * @hidden
   */
  private result: number[] = [];

  /**
   * @hidden
   */
  private activeTetrimino: Tetrimino | null = null;

  /**
   * @hidden
   */
  private speedTimer: Timer;

  /**
   * @hidden
   */
  private delayTimer: Timer;

  /**
   * @hidden
   */
  private tetriminoHolder: TetriminoHolder;

  /**
   * @hidden
   */
  private pointDisplay: PointDisplay;

  /**
   * @hidden
   */
  private controllDisplay: ControllDisplay;

  /**
   * @hidden
   */
  private optionDisplay: OptionDisplay;

  /**
   * @hidden
   */
  private tetriminoList: TetriminoList;

  /**
   * @hidden
   */
  private gameOver: Image;

  /**
   * @hidden
   */
  private documentBody: Element;

  /**
   * @hidden
   */
  private loader: ElementLoader;

  /**
   * @hidden
   */
  private stopSound: HTMLAudioElement | null = null;

  /**
   * 新しいオブジェクトを作成します。
   */
  constructor() {
    super('div');
    this.title = new Image('assets/images/title.png');
    this.title.move(0, 0);
    this.speedTimer = new Timer(1000, 0);
    this.delayTimer = new Timer(500, 1);
    this.tetriminoHolder = new TetriminoHolder(this);
    this.pointDisplay = new PointDisplay();
    this.controllDisplay = new ControllDisplay(this);
    this.optionDisplay = new OptionDisplay(this);
    this.tetriminoList = new TetriminoList(this);
    this.gameOver = new Image('assets/images/game_over.png');
    this.gameOver.move(20, 190);
    this.documentBody = new Element(document.body);
    this.loader = new ElementLoader();
    this.loader.addEventListener(Event.COMPLETE, this.blockCompleteListener);

    try {
      this.stopSound = new Audio('assets/sounds/stop.mp3');
    } catch (e) {}
  }

  /**
   * このオブジェクトに必要な要素をロードします。
   */
  public load(): void {
    for (let i: number = 0; i < 200; i++) {
      let block: Block = new Block(Block.WHITE);
      block.setAlpha(0.2);
      this.fields.push(block);
    }

    this.loader.set(this.fields).load();
  }

  /**
   * テトリミノを落下させます。
   */
  public startDrop(): void {
    this.isPause = false;
    this.optionDisplay.pause.reset();
    this.activeTetrimino = this.tetriminoList.getTetrimino();

    if (this.activeTetrimino) {
      this.ghostTetrimino = TetriminoFactory.getGhost(this.activeTetrimino);
      this.ghostTetrimino.setStage();

      if (this.optionDisplay.ghost.isGhost) {
        this.appendChild(this.ghostTetrimino);
      }
    }

    if (this.activeTetrimino) {
      this.appendChild(this.activeTetrimino);
    }

    this.moveCount = 0;
    this.totalMoveCount = 0;
    this.dropCheckFlag = false;
    this.keyCodes = {left: false, right: false};
    this.delayTimer.addEventListener(Event.TIMER_END, this.firstGhostDropListener);
    this.delayTimer.set(1, 2).start();
  }

  /**
   * テトリミノの落下を終了します。
   */
  public stopDrop(): void {
    this.stopSoundPlay();

    if (this.ghostTetrimino) {
      this.ghostTetrimino.clear();
    }

    this.pointDisplay.score.add(10);
    this.speedTimer.reset();
    this.speedTimer.removeEventListener(Event.TIMER, this.dropTetriminoListener);
    this.delayTimer.reset();
    this.delayTimer.removeEventListener(Event.TIMER_END, this.dropEndCheckListener);
    this.dropCheckFlag = false;
    document.removeEventListener(Event.KEY_DOWN, this.documentKeyDownListener);
    document.removeEventListener(Event.KEY_UP, this.documentKeyUpListener);

    for (let i: number = 0; i < 4; i++) {
      if (this.activeTetrimino && ! this.createActiveBlock(this.activeTetrimino.blocks[i])) {
        this.appendChild(this.gameOver);
        return;
      }
    }

    this.resultDrop();
  }

  /**
   * 指定した座標にあるブロックがアクティブかを確認します。
   * @param rect 指定する座標です。
   * @returns ブロックがアクティブならtrueを返します。
   */
  public activeBlockCheck(rect: {x: number, y: number}): boolean {
    if (rect.x < 0 || rect.x > 180 || rect.y > 380) {
      return false;
    }

    let x: number = rect.x / 20;
    let y: number = rect.y / 20;
    return this.activeBlocks[y + '' + x] === undefined;
  }

  /**
   * ゲームをポーズします。
   */
  public pause(): void {
    if (this.isPause) {
      this.speedTimer.start();
      this.delayTimer.start();
    } else {
      this.speedTimer.reset();
      this.delayTimer.reset();
    }

    this.isPause = ! this.isPause;
  }

  /**
   * ゲームをリセットします。
   */
  public reset(): void {
    this.speedTimer.reset();
    this.speedTimer.removeEventListener(Event.TIMER, this.dropTetriminoListener);
    this.delayTimer.reset();
    this.delayTimer.removeEventListener(Event.TIMER_END, this.dropEndCheckListener);
    this.delayTimer.removeEventListener(Event.TIMER_END, this.nextBlockListener);
    this.delayTimer.removeEventListener(Event.TIMER_END, this.clearBlockListener);
    document.removeEventListener(Event.KEY_DOWN, this.documentKeyDownListener);
    document.removeEventListener(Event.KEY_UP, this.documentKeyUpListener);

    for (let key in this.activeBlocks) {
      try {
        this.activeBlocks[key].clear();
      } catch (e) {}

      delete this.activeBlocks[key];
    }

    this.keyCodes = {left: false, right: false};

    if (this.activeTetrimino) {
      this.activeTetrimino.clear();
    }

    if (this.ghostTetrimino) {
      this.ghostTetrimino.clear();
    }

    let tetrimino: Tetrimino | null = this.tetriminoHolder.removeTetrimino();

    if (tetrimino) {
      tetrimino.clear();
    }

    this.speedTimer.delay = 1000;
    this.moveCount = 0;
    this.clearCound = 0;
    this.totalMoveCount = 0;
    this.dropCheckFlag = false;
    this.ishold = false;
    this.isPause = false;
    this.tetriminoList.addEventListener(Event.COMPLETE, this.tetriminoListResetCompleteListener);
    this.tetriminoList.reset();
  }

  /**
   * 効果音をストップします。
   */
  public stopSoundPlay(): void {
    if (! this.stopSound) {
      return;
    }

    try {
      this.stopSound.pause();
      this.stopSound.currentTime = 0;
      this.stopSound.play();
    } catch (e) {}
  }

  /**
   * @hidden
   */
  private resultDrop(): void {
    this.result = [];
    this.ishold = false;

    for (let y: number = 0; y < 20; y++) {
      let flag: boolean = true;

      for (let x: number = 0; x < 10; x++) {
        if (! this.activeBlocks[y + '' + x]) {
          flag = false;
          break;
        }
      }

      if (flag) {
        this.result.push(y);
      }
    }

    if (this.result.length == 0) {
      this.dispatchEvent(new Event(Event.DROP_END));
      this.delayTimer.addEventListener(Event.TIMER_END, this.nextBlockListener);
      this.delayTimer.set(300, 1).start();
      return;
    }

    for (var i: number = 0, n: number = this.result.length; i < n; i++) {
      for (let x = 0; x < 10; x++) {
        let y = this.result[i];
        this.activeBlocks[y + '' + x].clear();
        delete this.activeBlocks[y + '' + x];
      }
    }

    this.pointDisplay.score.add(this.score[n - 1]);
    this.pointDisplay.line.add(n);
    this.clearCound += n;

    if (this.clearCound >= 10) {
      this.setDropSpeed();
      this.pointDisplay.level.add(1);
      this.clearCound = 0;
    }

    this.delayTimer.addEventListener(Event.TIMER_END, this.clearBlockListener);
    this.delayTimer.set(500, 1).start();
  }

  /**
   * @hidden
   */
  private setDropSpeed(): void {
    if (this.speedTimer.delay == 1) {
      return;
    }

    if (this.speedTimer.delay > 100) {
      this.speedTimer.delay -= 100;
    } else {
      this.speedTimer.delay -= 10;
    }

    if (this.speedTimer.delay <= 0) {
      this.speedTimer.delay = 1;
    }
  }

  /**
   * @hidden
   */
  private slide(): void {
    if (this.keyCodes['left'] && ! this.keyCodes['right']) {
      if (this.activeTetrimino) {
        this.activeTetrimino.leftMove();
      }

      this.ghostHardDrop();
    }

    if (! this.keyCodes['left'] && this.keyCodes['right']) {
      if (this.activeTetrimino) {
        this.activeTetrimino.rightMove();
      }

      this.ghostHardDrop();
    }
  }

  /**
   * @hidden
   */
  private ghostHardDrop(): void {
    if (this.ghostTetrimino && this.activeTetrimino) {
      this.ghostTetrimino.move(this.activeTetrimino.getX(), this.activeTetrimino.getY());
      this.ghostTetrimino.hardDrop();
    }
  }

  /**
   * @hidden
   */
  private ghostForwardRoll(): void {
    if (this.ghostTetrimino && this.activeTetrimino) {
      this.ghostTetrimino.move(this.activeTetrimino.getX(), this.activeTetrimino.getY());
      this.ghostTetrimino.forwardRoll();
      this.ghostTetrimino.hardDrop();
    }
  }

  /**
   * @hidden
   */
  private ghostReverseRoll(): void {
    if (this.ghostTetrimino && this.activeTetrimino) {
      this.ghostTetrimino.move(this.activeTetrimino.getX(), this.activeTetrimino.getY());
      this.ghostTetrimino.reverseRoll();
      this.ghostTetrimino.hardDrop();
    }
  }

  /**
   * @hidden
   * @param block
   */
  private createActiveBlock(block: Block): boolean {
    let x: number = block.getFieldX() / 20;
    let y: number = block.getFieldY() / 20;

    if (this.activeBlocks[y + '' + x]) {
      return false;
    }

    this.activeBlocks[y + '' + x] = block;
    return true;
  }

  /**
   * @hidden
   */
  private addHoldTetrimino(): void {
    this.stopSoundPlay();
    document.removeEventListener(Event.KEY_DOWN, this.documentKeyDownListener);
    document.removeEventListener(Event.KEY_UP, this.documentKeyUpListener);
    this.tetriminoHolder.addEventListener(Event.COMPLETE, this.tetriminoHolderLoadCompleteListener);

    if (this.activeTetrimino) {
      this.tetriminoHolder.addTetrimino(TetriminoFactory.getClone(this.activeTetrimino));
    }
  }

  /**
   * @hidden
   */
  private removeHoldTetrimino(): void {
    this.stopSoundPlay();
    document.removeEventListener(Event.KEY_DOWN, this.documentKeyDownListener);
    document.removeEventListener(Event.KEY_UP, this.documentKeyUpListener);
    let tetrimino: Tetrimino | null = this.tetriminoHolder.removeTetrimino();

    if (tetrimino) {
      tetrimino.setStage();
    }

    if (this.activeTetrimino) {
      this.removeChild(this.activeTetrimino);
    }

    if (this.ghostTetrimino) {
      this.ghostTetrimino.clear();
    }

    if (this.activeTetrimino) {
      this.tetriminoHolder.addTetrimino(this.activeTetrimino);
    }

    this.activeTetrimino = tetrimino;

    if (this.activeTetrimino) {
      this.ghostTetrimino = TetriminoFactory.getGhost(this.activeTetrimino);
    }

    if (this.ghostTetrimino) {
      this.ghostTetrimino.setStage();
    }

    if (this.ghostTetrimino && this.optionDisplay.ghost.isGhost) {
      this.appendChild(this.ghostTetrimino);
    }

    if (this.activeTetrimino) {
      this.appendChild(this.activeTetrimino);
    }

    this.ishold = true;
    this.dropCheckFlag = false;
    this.moveCount = 0;
    this.totalMoveCount = 0;
    this.delayTimer.reset();
    this.delayTimer.removeEventListener(Event.TIMER_END, this.dropEndCheckListener);
    this.delayTimer.addEventListener(Event.TIMER_END, this.firstGhostDropListener);
    this.delayTimer.set(1, 2).start();
  }

  /**
   * @hidden
   */
  private clearBlockListener = (): void => {
    this.delayTimer.removeEventListener(Event.TIMER_END, this.clearBlockListener);
    let count: number = this.result.length;

    for (let i: number = 0; i < count; i++) {
      for (let y: number = this.result[i] - 1; y >= 0; y--) {
        for (let x: number = 0; x < 10; x++) {
          let block: Block = this.activeBlocks[y + '' + x];

          if (block) {
            delete this.activeBlocks[y + '' + x];
            this.activeBlocks[(y + 1) + '' + x] = block;
            block.set('css.top', (block.getY() + 20) + 'px');
          }
        }
      }
    }

    this.dispatchEvent(new Event(Event.DROP_END));
    this.delayTimer.addEventListener(Event.TIMER_END, this.nextBlockListener);
    this.delayTimer.set(300, 1).start();
  }

  /**
   * @hidden
   */
  private tetriminoListResetCompleteListener = (): void => {
    this.tetriminoList.removeEventListener(Event.COMPLETE, this.tetriminoListResetCompleteListener);
    this.pointDisplay.score.reset();
    this.pointDisplay.line.reset();
    this.pointDisplay.level.reset();
    this.pointDisplay.reset();
    this.optionDisplay.ghost.reset();
    this.optionDisplay.pause.reset();
    this.controllDisplay.start.reset();

    try {
      this.removeChild(this.gameOver);
    } catch (e) {}
  }

  /**
   * @hidden
   */
  private tetriminoHolderLoadCompleteListener = (): void => {
    this.tetriminoHolder.removeEventListener(Event.COMPLETE, this.tetriminoHolderLoadCompleteListener);

    if (this.activeTetrimino) {
      this.activeTetrimino.clear();
    }

    if (this.ghostTetrimino) {
      this.ghostTetrimino.clear();
    }

    this.ishold = true;
    this.speedTimer.reset();
    this.speedTimer.removeEventListener(Event.TIMER, this.dropTetriminoListener);
    this.delayTimer.reset();
    this.delayTimer.removeEventListener(Event.TIMER_END, this.dropEndCheckListener);
    this.delayTimer.addEventListener(Event.TIMER_END, this.nextBlockListener);
    this.delayTimer.set(300, 1).start();
  }

  /**
   * @hidden
   */
  private nextBlockListener = (): void => {
    this.delayTimer.removeEventListener(Event.TIMER_END, this.nextBlockListener);
    this.startDrop();
  }

  /**
   * @hidden
   */
  private dropTetriminoListener = (): void => {
    if (this.activeTetrimino && ! this.activeTetrimino.bottomMove() && ! this.dropCheckFlag) {
      this.dropCheckFlag = true;
      this.moveCount = this.totalMoveCount;
      this.delayTimer.addEventListener(Event.TIMER_END, this.dropEndCheckListener);
      this.delayTimer.set(300, 1).start();
    }
  }

  /**
   * @hidden
   * @param event
   */
  private documentKeyDownListener = (event: any): void => {

    if (event.key === 'ArrowLeft' && ! this.isPause) {
      if (this.activeTetrimino) {
        this.activeTetrimino.leftMove();
      }

      this.ghostHardDrop();
      this.keyCodes['left'] = true;
      this.totalMoveCount++;
    }

    if (event.key === 'ArrowRight' && ! this.isPause) {
      if (this.activeTetrimino) {
        this.activeTetrimino.rightMove();
      }

      this.ghostHardDrop();
      this.keyCodes['right'] = true;
      this.totalMoveCount++;
    }

    if (event.key === 'ArrowUp' && ! this.isPause) {
      if (this.activeTetrimino) {
        this.activeTetrimino.hardDrop()
      }

      this.stopDrop();
    }

    if (event.key === 'ArrowDown' && ! this.isPause) {
      if (this.activeTetrimino && ! this.activeTetrimino.bottomMove()) {
        this.stopDrop();
      }
    }

    if (event.key === 'z' && ! this.isPause) {
      if (this.activeTetrimino) {
        this.activeTetrimino.reverseRoll();
      }

      this.ghostReverseRoll();
      this.slide();
      this.totalMoveCount++;
    }

    if (event.key === 'x' && ! this.isPause) {
      if (this.activeTetrimino) {
        this.activeTetrimino.forwardRoll();
      }

      this.ghostForwardRoll();
      this.slide();
      this.totalMoveCount++;
    }

    if (event.key === 'c' && ! this.isPause) {
      if (this.activeTetrimino && this.tetriminoHolder.isEmpty() && ! this.ishold) {
        this.addHoldTetrimino();
      } else if (this.activeTetrimino && ! this.tetriminoHolder.isEmpty() && ! this.ishold) {
        this.removeHoldTetrimino();
      }
    }
  }

  /**
   * @hidden
   * @param event
   */
  private documentKeyUpListener = (event: any): void => {
    if (event.key === 'ArrowLeft') {
      this.keyCodes['left'] = false;
    }

    if (event.key === 'ArrowRight') {
      this.keyCodes['right'] = false;
    }
  }

  /**
   * @hidden
   */
  private dropEndCheckListener = (): void => {
    if (this.moveCount == this.totalMoveCount) {
      this.stopDrop();
    }

    this.dropCheckFlag = false;
  }

  /**
   * @hidden
   */
  private blockCompleteListener = (): void => {
    this.loader.removeEventListener(Event.COMPLETE, this.blockCompleteListener);

    for (let i: number = 0, x: number = 0, y: number = 0; i < 200; i++) {
      let block: Block = this.fields[i];
      block.move(x, y);
      this.appendChild(block);
      x += 20;

      if (x == 200) {
        x = 0;
        y += 20;
      }
    }

    this.fields.splice(0, this.fields.length);

    for (let i = 0; i < 64; i++) {
      this.fields.push(new Block(Block.GRAY));
    }

    this.loader.addEventListener(Event.COMPLETE, this.grayBlockCompleteListener);
    this.loader.set(this.fields).load();
  }

  /**
   * @hidden
   */
  private grayBlockCompleteListener = (): void => {
    this.loader.removeEventListener(Event.COMPLETE, this.grayBlockCompleteListener);

    for (let i: number = 0, x: number = -20; i < 12; i++ , x += 20) {
      let block: Block = this.fields[i];
      block.move(x, -20);
      this.appendChild(block);
    }

    for (let i: number = 12, x: number = -20, y: number = 0; i < 52; i++) {
      let block: Block = this.fields[i];
      block.move(x, y);
      this.appendChild(block);

      if (x == -20) {
        x = 200;
      } else {
        x = -20;
        y += 20;
      }
    }

    for (let i: number = 52, x: number = -20; i < 64; i++ , x += 20) {
      let block: Block = this.fields[i];
      block.move(x, 400);
      this.appendChild(block);
    }

    this.fields.splice(0, this.fields.length);
    this.loader.addEventListener(Event.COMPLETE, this.holdersCompleteListener);
    this.loader.set([
      this.controllDisplay,
      this.optionDisplay,
      this.tetriminoHolder,
      this.pointDisplay,
      this.title,
      this.gameOver,
      this.tetriminoList
    ]).load();
  }

  /**
   * @hidden
   */
  private holdersCompleteListener = (): void => {
    this.loader.removeEventListener(Event.COMPLETE, this.holdersCompleteListener);
    this.tetriminoHolder.move(-140, 0);
    this.pointDisplay.move(-140, 60);
    this.optionDisplay.move(-140, 300);
    this.controllDisplay.move(260, 300);
    this.tetriminoList.move(190, 0);
    this.pointDisplay.score.show();
    this.pointDisplay.line.show();
    this.pointDisplay.level.show();
    this.controllDisplay.addEventListener(Event.SHOW_END, this.displayShowEndCompleteListener);
    this.optionDisplay.addEventListener(Event.SHOW_END, this.displayShowEndCompleteListener);
    this.controllDisplay.show();
    this.optionDisplay.show();
  }

  /**
   * @hidden
   * @param event
   */
  private displayShowEndCompleteListener = (event: Event): void => {
    event.target!.removeEventListener(Event.SHOW_END, this.displayShowEndCompleteListener);
    this.showCount++;

    if (this.showCount == 2) {
      window.addEventListener(Event.RESIZE, this.fieldResizeListener);
      this.appendChild(this.tetriminoHolder);
      this.appendChild(this.tetriminoList);
      this.appendChild(this.optionDisplay);
      this.appendChild(this.controllDisplay);
      this.appendChild(this.pointDisplay);
      this.appendChild(this.title);
      this.dispatchEvent(new Event(Event.COMPLETE));
    }
  }

  /**
   * @hidden
   */
  private firstGhostDropListener = (): void => {
    this.delayTimer.reset();
    this.delayTimer.removeEventListener(Event.TIMER_END, this.firstGhostDropListener);
    this.ghostHardDrop();

    for (let i: number = 0; i < 4; i++) {
      if (this.activeTetrimino) {
        let rect: Rect = this.activeTetrimino.blocks[i].getFieldRect();

        if (! this.activeBlockCheck(rect)) {
          this.appendChild(this.gameOver);
          return;
        }
      }
    }

    this.speedTimer.addEventListener(Event.TIMER, this.dropTetriminoListener);
    this.speedTimer.start();
    document.addEventListener(Event.KEY_DOWN, this.documentKeyDownListener);
    document.addEventListener(Event.KEY_UP, this.documentKeyUpListener);
  }

  /**
   * @hidden
   */
  private fieldResizeListener = (): void => {
    this.move((parseInt(this.documentBody.get('scrollWidth')) - 200) / 2, (window.innerHeight - 440) / 2);
  }
}
