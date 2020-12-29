// based on https://github.com/darkskyapp/string-hash/blob/master/index.js

export function hash(str) {
  let _hash = 5381;
  let i = str.length;

  while (i) {
    // tslint:disable-next-line:no-bitwise
    _hash = (_hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */

  // tslint:disable-next-line:no-bitwise
  return _hash >>> 0;
}
