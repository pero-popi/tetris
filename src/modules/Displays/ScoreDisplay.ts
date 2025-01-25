import Element from '../Elements/Element';
import Display from './Display';

/**
 * スコア表示ディスプレイを作成します。
 */
export default class ScoreDisplay extends Display {
  /**
   * @hidden
   */
  private titleLabel: Element;

  /**
   * @hidden
   */
  private scoreLabel: Element;

  /**
   * @hidden
   */
  private cover: Element;

  /**
   * @hidden
   */
  private score: number = 0;

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
      'innerHTML': 'SCORE'
    });
    this.titleLabel.move(5, 0);
    this.scoreLabel = new Element('label');
    this.scoreLabel.params({
      'css.color': '#FFFF00',
      'css.fontSize': '16px',
      'css.fontWeight': 'bold',
      'innerHTML': this.score.toString()
    });
    this.scoreLabel.move(5, 19);
    this.cover = new Element('div');
    this.cover.drawRect(120, 80, '#FFFFFF');
    this.cover.setAlpha(0);
    this.cover.move(-20, -20);
  }

  /**
   * スコアを追加します。
   * @param score 追加するスコアです。
   */
  public add(score: number): void {
    if (this.isCounterStop) {
      return;
    }

    this.score += score;
    this.scoreCheck();
  }

  /**
   * スコアをリセットします。
   */
  public reset(): void {
    this.score = 0;
    this.scoreLabel.params({
      'css.color': '#FFFF00',
      'innerHTML': this.score.toString()
    });
  }

  /**
   * このオブジェクトを表示します。
   */
  public show(): void {
    this.appendChild(this.titleLabel);
    this.appendChild(this.scoreLabel);
    this.appendChild(this.cover);
  }

  /**
   * @hidden
   */
  private scoreCheck(): void {
    if (this.score >= 999999) {
      this.score = 999999;
      this.isCounterStop = true;
      this.scoreLabel.params({
        'css.color': '#FF0000',
        'innerHTML': 'OVER'
      });
      return;
    }

    this.scoreLabel.set('innerHTML', this.score.toString());
  }
}
