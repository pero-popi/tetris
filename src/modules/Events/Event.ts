import EventTarget from './EventTarget';

/**
 * カスタムイベントを作成します。
 */
export default class Event {
  /**
   * イベントが現在、キャプチャフェーズであることを表す数値です。
   */
  public static CAPTURING_PHASE: number = 1;

  /**
   * イベントが現在、ターゲットフェーズであることを表す数値です。
   */
  public static AT_TARGET: number = 2;

  /**
   * イベントが現在、バブリングフェーズであることを表す数値です。
   */
  public static BUBBLING_PHASE: number = 3;

  /**
   * タッチスタートイベントの文字列です。
   */
  public static MOUSE_DOWN: string = 'mousedown';

  /**
   * タッチムーブイベントの文字列です。
   */
  public static MOUSE_MOVE: string = 'mousemove';

  /**
   * タッチエンドイベントの文字列です。
   */
  public static MOUSE_UP: string = 'mouseup';

  /**
   * マウスアウトイベントの文字列です。
   */
  public static MOUSE_OUT: string = 'mouseout';

  /**
   * コンプリートイベントの文字列です。
   */
  public static COMPLETE: string = 'complete';

  /**
   * 表示終了イベントの文字列です。
   */
  public static SHOW_END: string = 'showend';

  /**
   * タイマーイベントの文字列です。
   */
  public static TIMER: string = 'timer';

  /**
   * タイマー終了イベントの文字列です。
   */
  public static TIMER_END: string = 'timerend';

  /**
   * リサイズイベントの文字列です。
   */
  public static RESIZE: string = 'resize';

  /**
   * キーダウンイベントの文字列です。
   */
  public static KEY_DOWN: string = 'keydown';

  /**
   * キーアップイベントの文字列です。
   */
  public static KEY_UP: string = 'keyup';

  /**
   * ドロップエンドイベントの文字列です。
   */
  public static DROP_END: string = 'dropend';

  /**
   * ロードイベントの文字列です。
   */
  public static LOAD: string = 'load';

  /**
   * イベントの名前です。
   */
  public type: string;

  /**
   * イベントが最初に送出されたEventTargetです。
   */
  public target: EventTarget | null = null;

  /**
   * 現在処理されているEventTargetです。
   */
  public currentTarget: EventTarget | null = null;

  /**
   * 現在評価中のイベントフローのフェーズです。
   */
  public eventPhase: number = 0;

  /**
   * イベントがバブリングイベントであるかどうかの真偽値です。
   */
  public bubbles: boolean = true;

  /**
   * イベントがデフォルトアクションを防止できるかどうかの真偽値です。
   */
  public cancelable: boolean = true;

  /**
   * イベントが作成された時刻です。
   */
  public timeStamp: Date = new Date();

  /**
   * イベント・フロー中にイベントがさらに伝搬するのを防止するかの真偽値です。
   */
  public propagationStopped: boolean = false;

  /**
   * イベントがキャンセルできるかどうかの真偽値です。
   */
  public defaultPrevented: boolean = false;

  /**
   * 新しいオブジェクトを作成します。
   * @param type
   * @param bubbles
   * @param cancelable
   */
  constructor(type: string, bubbles: boolean = true, cancelable: boolean = true) {
    this.type = type;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
  }

  /**
   * 現在のイベントのさらなる伝播を止めます。
   */
  public stopPropagation(): void {
    this.propagationStopped = true;
  }

  /**
   * イベントがキャンセル可能である場合、上位ノードへのイベントの伝播を止めずに、そのイベントをキャンセルします。
   */
  public preventDefault(): void {
    if (this.cancelable) {
      this.defaultPrevented = true;
    }
  }
}
