import Event from '../Events/Event';
import EventTarget from '../Events/EventTarget';
import Element from '../Elements/Element';

/**
 * 複数の要素のロードを監視するオブジェクトを作成します。
 */
export default class ElementLoader extends EventTarget {
  /**
   * @hidden
   */
  private elements: Element[] = [];

  /**
   * @hidden
   */
  private size: number = 0;

  /**
   * @hidden
   */
  private count: number = 0;

  /**
   * 新しいオブジェクトを作成します。
   * @param elements このオブジェクトがロードする要素の配列です。
   */
  constructor(elements: Element[] | null = null) {
    super();

    if (elements) {
      this.addAll(elements);
    }
  }

  /**
   * このオブジェクトに必要な要素をロードします。
   */
  public load(): void {
    for (let i: number = 0; i < this.size; i++) {
      this.elements[i].load();
    }
  }

  /**
   * このオブジェクトがロードする要素を追加します。
   * @param element 追加する要素です。
   */
  public add(element: Element): void {
    element.addEventListener(Event.COMPLETE, this.displayLoaderListener);
    this.elements.push(element);
    this.size++;
  }

  /**
   * このオブジェクトがロードする要素の配列を指定します。
   * @param elements このオブジェクトに追加する要素の配列です。
   */
  public addAll(elements: Element[]): void {
    for (let key in elements) {
      this.add(elements[key]);
    }
  }

  /**
   * このオブジェクトがロードする要素を、指定した要素の配列に置き換えます。
   * @param elements 置き換える要素の配列です。
   * @returns このオブジェクトの参照です。
   */
  public set(elements: Element[]): ElementLoader {
    this.elements = elements;
    this.size = elements.length;
    this.count = 0;

    for (let key in elements) {
      elements[key].addEventListener(Event.COMPLETE, this.displayLoaderListener);
    }

    return this;
  }

  /**
   * @hidden
   * @param event
   */
  private displayLoaderListener = (event: Event): void => {
    this.count++;
    event.target!.removeEventListener(Event.COMPLETE, this.displayLoaderListener);

    if (this.count != this.size) {
      return;
    }

    this.size = 0;
    this.count = 0;
    this.dispatchEvent(new Event(Event.COMPLETE));
  }
}
