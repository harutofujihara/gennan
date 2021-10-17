/**
 * 数字を丸数字に変換する
 * @param {Number} num
 * @return {String}
 */
declare function toCircled(num: number): string;
/**
 * 配列を分割する
 * ex. split([1, 2, 3, 4], 2) // -> [[1, 2], [3, 4]]
 * @param array
 * @param n
 */
declare const splitArr: <T>(array: T[], n: number) => (T | T[])[];
declare const commentValidate: (s: string) => boolean;
declare const downloadTextFile: (filename: string, text: string) => void;
declare function readFileText(file: any): Promise<string>;
export { toCircled, splitArr, commentValidate, downloadTextFile, readFileText };
