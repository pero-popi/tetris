import EventTarget from '../Events/EventTarget';

/**
 * 表示要素を作成します。
 */
export default class Element extends EventTarget {
  /**
   * このオブジェクトが内部に持つオブジェクトです。
   */
  public node: Element | null = null;

  /**
   * このオブジェクトの親要素です。
   */
  public parentNode: Element | null = null;

  /**
   * @hidden
   */
  private alpha: number = 1;

  /**
   * 現在の要素の複製を返します。
   * @param deep 要素の子孫も複製する場合はtrueを指定します。
   * @returns 複製した要素です。
   */
  public static cloneNode(deep: boolean): Element {
    return new Element(document.cloneNode(deep));
  }

  /**
   * 与えられたタグ名を持つ要素のリストを返します。
   * @param tagName タグ名です。
   * @returns 要素のリストです。
   */
  public static getElementsByTagName(tagName: string): Element[] {
    let elements: HTMLCollectionOf<globalThis.Element> = document.getElementsByTagName(tagName);
    let array: Element[] = [];

    for (let i: number = 0, n: number = length; i < n; i++) {
      array.push(new Element(elements[i]));
    }

    return array;
  }

  /**
   * 指定されたID属性を持つ要素を返します。
   * @returns 指定されたID属性を持つ要素です。
   */
  public static getElementById(elementId: string): Element {
    return new Element(document.getElementById(elementId));
  }

  /**
   * 指定したname属性値を持つ要素のリストを返します。
   * @param elementName name属性値です。
   * @returns 要素のリストです。
   */
  public static getElementsByName(elementName: string): Element[] {
    let elements: NodeList = document.getElementsByName(elementName);
    let array: Element[] = [];

    for (let i: number = 0, n: number = length; i < n; i++) {
      array.push(new Element(elements[i]));
    }

    return array;
  }

  /**
   * 新しいオブジェクトを作成します。
   * @param target ターゲットオブジェクトです。
   */
  constructor(target: any) {
    super();

    if (target) {
      if (target instanceof HTMLElement) {
        this.readElement(target);
      } else {
        this.readElement(document.createElement(target));
      }
    }
  }

  /**
   * このオブジェクトにイベントリスナーを登録します。
   * @param type 対象とするイベントの種類を表す文字列です。
   * @param listener 指定されたタイプのイベントが発生するときに通知を受け取るオブジェクトです。
   * @param useCapture キャプチャフェーズを使用する場合はtrueを指定します。
   */
  public addEventListener(type: string, listener: any, useCapture: boolean = false): void {
    super.addEventListener(type, listener, useCapture);

    if (this.node) {
      this.node.addEventListener(type, listener, useCapture);
    }
  }

  /**
   * このオブジェクトからイベントリスナーを削除します。
   * @param type 対象とするイベントの種類を表す文字列です。
   * @param listener 指定されたタイプのイベントが発生するときに通知を受け取るオブジェクトです。
   * @param useCapture キャプチャフェーズを使用する場合はtrueを指定します。
   */
  public removeEventListener(type: string, listener: any, useCapture: boolean = false): void {
    super.removeEventListener(type, listener, useCapture);

    if (this.node) {
      this.node.removeEventListener(type, listener, useCapture);
    }
  }

  /**
   * 現在の要素の複製を返します。
   * @param deep 要素の子孫も複製する場合はtrueを指定します。
   * @returns 複製した要素です。
   */
  public cloneNode(deep: boolean): Element | null {
    if (this.node) {
      return new Element(this.node.cloneNode(deep));
    }
  
    return null;
  }

  /**
   * 与えられたタグ名を持つ要素のリストを返します。
   * @param tagName タグ名です。
   * @returns 要素のリストです。
   */
  public getElementsByTagName(tagName: string): Element[] {
    if (! this.node) {
      return [];
    }

    let elements: Element[] = this.node.getElementsByTagName(tagName);
    let array: Element[] = [];

    for (let i: number = 0, n: number = length; i < n; i++) {
      array.push(new Element(elements[i]));
    }

    return array;
  }

  /**
   * 指定した属性名の値を返します。
   * @param name 属性名です。
   * @returns 属性の値です。
   */
  public get(name: string): string {
    if (! this.node) {
      return '';
    }

    if (name.indexOf('css.') == -1) {
      return (<any>this.node)[name];
    }

    name = name.substring(4, name.length);
    return (<any>this.node).style[name];
  }

  /**
   * 指定した属性名に、指定した値を設定します。
   * @param name 属性名です。
   * @param value 属性に設定する値です。
   */
  public set(name: string, value: string): void {
    if (! this.node) {
      return;
    }

    if (name.indexOf('css.') == -1) {
      (<any>this.node)[name] = value;
      return;
    }

    (<any>this.node).style[name.substring(4, name.length)] = value;
  }

  /**
   * 指定したオブジェクトのキーと値を、属性に設定します。
   * @param object 指定するオブジェクトです。
   */
  public params(object: {[name: string]: string}): void {
    for (let key in object) {
      this.set(key, object[key]);
    }
  }

  /**
   * 指定した属性名に、指定した値を追加します。
   * @param name 属性名です。
   * @param value 属性に追加する値です。
   */
  public append(name: string, value: string): void {
    if (! this.node) {
      return;
    }

    if (name.indexOf('css.') == -1) {
      (<any>this.node).setAttribute(name, (<any>this.node).getAttribute(name) + value);
      return;
    }

    name = name.substring(4, name.length);
    (<any>this.node).style.setProperty(name, (<any>this.node).style.getPropertyValue(name) + value);
  }

  /**
   * このオブジェクトの子要素の末尾に、指定した要素を追加します。
   * @param element 追加する要素です。
   * @returns 追加した要素です。
   */
  public appendChild(element: Element): Element {
    if (this.node && element.node) {
      this.node.appendChild(element.node);
    }

    element.parentNode = this;
    return element;
  }

  /**
   * このオブジェクトから指定した要素を取り除きます。
   * @param element 取り除く要素です。
   * @returns 取り除かれた要素です。
   */
  public removeChild(element: Element): Element {
    if (this.node && element.node) {
      try {
        this.node.removeChild(element.node);
      } catch (e) {}
    }

    element.parentNode = null;
    return element;
  }

  /**
   * 指定した要素を別の要素に置き換えます。
   * @param insertedElement 置き換える新しい要素です。
   * @param replacedElement 置き換えられる要素です。
   * @returns 置き換えられた要素（replacedElement）です。
   */
  public replaceChild(insertedElement: Element, replacedElement: Element): Element {
    if (this.node && insertedElement.node && replacedElement.node) {
      this.node.replaceChild(insertedElement.node, replacedElement.node);
    }

    insertedElement.parentNode = replacedElement.parentNode;
    replacedElement.parentNode = null;
    return replacedElement;
  }

  /**
   * 指定した要素をこのオブジェクトの子要素として参照要素の前に挿入します。
   * @param insertedElement 挿入される要素です。
   * @param replacedElement 新しく挿入される要素の親要素です。
   * @returns 挿入された要素（insertedElement）です。
   */
  public insertBefore(insertedElement: Element, replacedElement: Element): Element {
    if (! replacedElement) {
      return this.appendChild(insertedElement);
    }

    if (this.node && insertedElement.node && replacedElement.node) {
      this.node.insertBefore(insertedElement.node, replacedElement.node);
    }

    insertedElement.parentNode = replacedElement.parentNode;
    replacedElement.parentNode = insertedElement;
    return insertedElement;
  }

  /**
   * このオブジェクトを移動します。
   * @param x 移動するx座標の距離(px)です。
   * @param x 移動するy座標の距離(px)です。
   */
  public move(x: number, y: number): void {
    this.params({
      'css.position': 'absolute',
      'css.left': x + 'px',
      'css.top': y + 'px'
    });
  }

  /**
   * このオブジェクトに矩形を線画します。
   * @param width 横幅(px)です。
   * @param height 縦幅(px)です。
   * @param bgColor 塗りつぶす背景色です。
   * @param cursor カーソルのスタイル文字列を指定します。
   */
  public drawRect(width: number, height: number, bgColor: string, cursor: string = 'auto'): void {
    this.params({
      'css.width': width + 'px',
      'css.height': height + 'px',
      'css.backgroundColor': bgColor,
      'css.cursor': cursor
    });
  }

  /**
   * このオブジェクトのアルファを取得します。
   * @returns アルファ値です。
   */
  public getAlpha(): number {
    return this.alpha;
  }

  /**
   * このオブジェクトのアルファを設定します。
   * @param value 設定するアルファ値です。
   */
  public setAlpha(value: number): void {
    if (value > 1) {
      value = 1;
    } else if (value < 0) {
      value = 0;
    }

    this.params({
      'css.opacity': value.toString(),
      'css.filter': 'alpha(opacity=' + (value * 100) + ')'
    });

    this.alpha = value;
  }

  /**
   * 指定したHTMLElementをこのオブジェクトの内部要素に指定します。
   * @param element 指定するHTMLElementです。
   */
  public readElement(element: HTMLElement): void {
    this.alpha = 1;
    (<any>this.node) = element;

    if ((<any>this.node) == document.body) {
      return;
    }

    this.parentNode = function(target: Element): Element | null {
      if (target.node && target.node.parentNode) {
        return new Element(target.node.parentNode);
      }

      return null;
    }(this);

    if (this.get('css.webkitTapHighlightColor')) {
      this.set('css.webkitTapHighlightColor', 'rgba(0, 0, 0, 0)');
    }
  }

  /**
   * このオブジェクトに必要な要素をロードします。
   */
  public load(): void {}
}
