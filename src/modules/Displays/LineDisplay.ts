import Element from '../Elements/Element';
import Display from './Display';

/**
 * ライン数を表示するディスプレイを作成します。
 */
export default class LineDisplay extends Display {
  /**
   * @hidden
   */
  private titleLabel: Element;

  /**
   * @hidden
   */
  private lineLabel: Element;

  /**
   * @hidden
   */
  private cover: Element;

  /**
   * @hidden
   */
  private line: number = 0;

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
      'innerHTML': 'LINE'
    });
    this.titleLabel.move(5, 0);
    this.lineLabel = new Element('label');
    this.lineLabel.params({
      'css.color': '#FFFF00',
      'css.fontSize': '16px',
      'css.fontWeight': 'bold',
      'innerHTML': this.line.toString()
    });
    this.lineLabel.move(5, 19);
    this.cover = new Element('div');
    this.cover.drawRect(120, 80, '#FFFFFF');
    this.cover.setAlpha(0);
    this.cover.move(-20, -20);
  }

  /**
   * ライン数を追加します。
   * @param line 追加するライン数です。
   */
  public add(line: number): void {
    if (this.isCounterStop) {
      return;
    }

    this.line += line;
    this.lineCheck();
  }

  /**
   * ライン数をリセットします。
   */
  public reset(): void {
    this.line = 0;
    this.lineLabel.params({
      'css.color': '#FFFF00',
      'innerHTML': this.line.toString()
    });
  }

  /**
   * このオブジェクトを表示します。
   */
  public show(): void {
    this.appendChild(this.titleLabel);
    this.appendChild(this.lineLabel);
    this.appendChild(this.cover);
  }

  /**
   * @hidden
   */
  private lineCheck(): void {
    if (this.line >= 999) {
      this.line = 999;
      this.isCounterStop = true;
      this.lineLabel.params({
        'css.color': '#FF0000',
        'innerHTML': 'OVER'
      });
      return;
    }

    this.lineLabel.set('innerHTML', this.line.toString());
  }
}
