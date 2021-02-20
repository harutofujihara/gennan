/**
 * 数字を丸数字に変換する
 * @param {Number} num
 * @return {String}
 */
function toCircled(num: number): string {
  if (num <= 20) {
    const base = "①".charCodeAt(0);
    return String.fromCharCode(base + num - 1);
  }
  if (num <= 35) {
    const base = "㉑".charCodeAt(0);
    return String.fromCharCode(base + num - 21);
  }
  const base = "㊱".charCodeAt(0);
  return String.fromCharCode(base + num - 36);
}

/**
 * 配列を分割する
 * ex. split([1, 2, 3, 4], 2) // -> [[1, 2], [3, 4]]
 * @param array
 * @param n
 */
const splitArr = <T>(array: Array<T>, n: number) =>
  array.reduce(
    (a: Array<T | Array<T>>, c: T, i: number): Array<T | Array<T>> =>
      i % n == 0
        ? [...a, [c]]
        : [...a.slice(0, -1), [...(a[a.length - 1] as Array<T>), c]],
    []
  );
export { toCircled, splitArr };
