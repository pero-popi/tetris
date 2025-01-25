import Event from './Event';
import Element from '../Elements/Element';

/**
 * イベントを受け取り、そのリスナーを持つオブジェクトを作成します。
 */
export default abstract class EventTarget {
  /**
   * @hidden
   */
  private listeners: any = {};

  /**
   * このオブジェクトにイベントリスナーを登録します。
   * @param type 対象とするイベントの種類を表す文字列です。
   * @param listener 指定されたタイプのイベントが発生するときに通知を受け取るオブジェクトです。
   * @param useCapture キャプチャフェーズを使用する場合はtrueを指定します。
   */
  public addEventListener(type: string, listener: any, useCapture: boolean = false): void {
    let listeners: EventListener[] = this.listeners[type + !! useCapture];

    if (! listeners) {
      listeners = this.listeners[type + !! useCapture] = [];
    }

    for (let i: number = 0, n: number = listeners.length; i < n; i++) {
      if (listeners[i] == listener) {
        return;
      }
    }

    listeners.push(listener);
  }

  /**
   * このオブジェクトからイベントリスナーを削除します。
   * @param type 対象とするイベントの種類を表す文字列です。
   * @param listener 指定されたタイプのイベントが発生するときに通知を受け取るオブジェクトです。
   * @param useCapture キャプチャフェーズを使用する場合はtrueを指定します。
   */
  public removeEventListener(type: string, listener: any, useCapture: boolean = false): void {
    let listeners: EventListener[] = this.listeners[type + !! useCapture];

    if (! listeners) {
      return;
    }

    for (let i: number = 0, n: number = listeners.length; i < n; i++) {
      if (listeners[i] == listener) {
        listeners.splice(i, 1);
        return;
      }
    }
  }

  /**
   * このオブジェクトにイベントをディスパッチします。
   * @param event ディスパッチされるイベントオブジェクトです。
   */
  public dispatchEvent(event: Event): boolean {
    if (! event) {
      return false;
    }

    event.target = this;
    let targets: EventTarget[] = [event.target];
    let ancestor: Element | null = <Element>event.target;

    while ((ancestor = ancestor.parentNode)) {
      targets.unshift(ancestor);
    }

    if (event.bubbles) {
      Array.prototype.push.apply(targets, targets.slice(0, -1).reverse());
    }

    event.eventPhase = Event.CAPTURING_PHASE;

    for (let i: number = 0, n: number = targets.length; i < n; i++) {
      let currentTarget: EventTarget = event.currentTarget = targets[i];
      let isTargetPhase: boolean = (currentTarget == event.target);

      if (isTargetPhase) {
        event.eventPhase = Event.AT_TARGET;
      }

      let isCapturingPhase: boolean = (event.eventPhase == Event.CAPTURING_PHASE);
      let listeners: Function[] = currentTarget.listeners[event.type + isCapturingPhase];

      if (listeners) {
        for (let j: number = 0, t: number = listeners.length; j < t; j++) {
          try {
            listeners[j].call(currentTarget, event);
          } catch (e) {}
        }

        if (event.propagationStopped) {
          break;
        }
      }

      if (isTargetPhase && event.bubbles) {
        event.eventPhase = Event.BUBBLING_PHASE;
      }
    }

    let defaultPrevented: boolean = event.defaultPrevented;
    event.eventPhase = 0;
    event.propagationStopped = event.defaultPrevented = false;
    return ! defaultPrevented;
  }
}
