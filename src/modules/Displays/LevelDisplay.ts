import Element from '../Elements/Element';
import Display from './Display';

/**
 * 現在のレベルを表示するディスプレイを作成します。
 */
export default class LevelDisplay extends Display {
  /**
   * @hidden
   */
  private titleLabel: Element;

  /**
   * @hidden
   */
  private levelLabel: Element;

  /**
   * @hidden
   */
  private cover: Element;

  /**
   * @hidden
   */
  private level: number = 1;

  /**
   * @hidden
   */
  private isCounterStop: boolean = false;

  /**
   * 新しいオブジェクトを作成します。
   */
  constructor() {
    super();
    this.titleLabel = new Element('label');
    this.titleLabel.params({
      'css.color': '#FFFF00',
      'css.fontSize': '15px',
      'css.fontWeight': 'bold',
      'innerHTML': 'LEVEL'
    });
    this.titleLabel.move(5, 0);
    this.levelLabel = new Element('label');
    this.levelLabel.params({
      'css.color': '#FFFF00',
      'css.fontSize': '16px',
      'css.fontWeight': 'bold',
      'innerHTML': this.level.toString()
    });
    this.levelLabel.move(5, 19);
    this.cover = new Element('div');
    this.cover.drawRect(120, 80, '#FFFFFF');
    this.cover.setAlpha(0);
    this.cover.move(-20, -20);
  }

  /**
   * レベルを追加します。
   * @param level レベル数です。
   */
  public add(level: number): void {
    if (this.isCounterStop) {
      return;
    }

    this.level += level;
    this.levelCheck();
  }

  /**
   * このオブジェクトをリセットします。
   */
  public reset(): void {
    this.level = 1;
    this.levelLabel.params({
      'css.color': '#FFFF00',
      'innerHTML': this.level.toString()
    });
  }

  /**
   * このオブジェクトを表示します。
   */
  public show(): void {
    this.appendChild(this.titleLabel);
    this.appendChild(this.levelLabel);
    this.appendChild(this.cover);
  }

  /**
   * @hidden
   */
  private levelCheck(): void {
    if (this.level >= 99) {
      this.level = 99;
      this.isCounterStop = true;
      this.levelLabel.params({
        'css.color': '#FF0000',
        'innerHTML': 'OVER'
      });
      return;
    }

    this.levelLabel.set('innerHTML', this.level.toString());
  }
}
