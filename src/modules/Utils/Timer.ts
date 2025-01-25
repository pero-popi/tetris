import Event from '../Events/Event';
import EventTarget from '../Events/EventTarget';

/**
 * タイマーです。タイマーを使用すると、指定した時間系列に従ってコードを実行できます。
 */
export default class Timer extends EventTarget {
  /**
   * ゼロで開始してから現在までに起動されたタイマーの合計回数です。
   */
  public currentCount: number = 0;

  /**
   * ミリ秒単位で指定したタイマーイベント間の遅延です。
   */
  public delay: number = 100;

  /**
   * タイマーを実行する合計回数です。
   */
  public repeatCount: number = 0;

  /**
   * @hidden
   */
  private timeoutID: number = 0;

  /**
   * 新しいオブジェクトを作成します。
   * @param delay ミリ秒単位で指定したタイマーイベント間の遅延です。
   * @param repeatCount タイマーを実行する合計回数です。
   */
  constructor(delay: number = 100, repeatCount: number = 0) {
    super();
    this.delay = delay;
    this.repeatCount = repeatCount;
  }

  /**
   * タイマーがまだ実行されていない場合は、タイマーを起動します。
   */
  public start(): void {
    if (this.repeatCount == 0 || this.currentCount < this.repeatCount) {
      window.clearTimeout(this.timeoutID);
      this.timeoutID = window.setTimeout(this.intervalListener, this.delay);
    }
  }

  /**
   * タイマーを停止します。
   */
  public stop(): void {
    window.clearTimeout(this.timeoutID);
  }

  /**
   * タイマーが実行されている場合はタイマーを停止して、currentCountプロパティを0に戻します。
   */
  public reset(): void {
    window.clearTimeout(this.timeoutID);
    this.currentCount = 0;
  }

  /**
   * タイマーをセットします。
   * @param delay ミリ秒単位で指定したタイマーイベント間の遅延です。
   * @param repeatCount タイマーを実行する合計回数です。
   * @returns このオブジェクトの参照です。
   */
  public set(delay: number = 100, repeatCount: number = 0): Timer {
    this.reset();
    this.delay = delay;
    this.repeatCount = repeatCount;
    return this;
  }

  /**
   * @hidden
   */
  private intervalListener = (): void => {
    this.currentCount++;
    this.dispatchEvent(new Event(Event.TIMER));

    if (this.repeatCount != 0 && this.currentCount == this.repeatCount) {
      this.reset();
      this.dispatchEvent(new Event(Event.TIMER_END));
      return;
    }

    this.start();
  }
}
