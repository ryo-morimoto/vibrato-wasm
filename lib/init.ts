/**
 * デフォルトエントリポイント: wasm を fetch で読み込む。
 * ブラウザや Deno 等、compileStreaming が使える環境向け。
 *
 * @module
 */

import * as bg from "../pkg/vibrato_wasm_bg.js";
import type { VibratoToken } from "./types.ts";

const { __wbg_set_wasm, VibratoTokenizer } = bg;

/**
 * zstd 圧縮辞書バイナリから Tokenizer を初期化する。
 * wasm の読み込みは自動で行われる。
 */
export async function initTokenizer(
  dictZstd: Uint8Array,
): Promise<{ tokenize: (text: string) => VibratoToken[]; free: () => void }> {
  const wasmUrl = new URL("../pkg/vibrato_wasm_bg.wasm", import.meta.url);
  const instance = await WebAssembly.instantiateStreaming(fetch(wasmUrl), {
    "./vibrato_wasm_bg.js": bg,
  });
  __wbg_set_wasm(instance.instance.exports);

  const tokenizer = new VibratoTokenizer(dictZstd);

  return {
    tokenize(text: string): VibratoToken[] {
      return tokenizer.tokenize(text) as VibratoToken[];
    },
    free() {
      tokenizer.free();
    },
  };
}
