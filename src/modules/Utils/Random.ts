/**
 * 乱数を作成します。
 */
export default class Random {
  /**
   * 取得する乱数の最大値です。
   */
  private max: number = 0;

  /**
   * 新しいオブジェクトを作成します。
   * @param max 取得する乱数の最大値です。
   */
  constructor(max: number) {
    this.max = max;
  }

  /**
   * 取得する乱数の最大値を設定します。
   * @param max 取得する乱数の最大値です。
   */
  public setMax(max: number): void {
    this.max = max;
  }

  /**
   * 新しい乱数を取得します。
   * @returns 乱数です。
   */
  public next(): number {
    return Math.floor(Math.random() * this.max);
  }
}
