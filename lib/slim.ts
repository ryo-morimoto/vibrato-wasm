/**
 * Workers 等で事前に import した WebAssembly.Module を渡して初期化する slim エントリポイント。
 *
 * ```ts
 * import wasmModule from "./vibrato_wasm_bg.wasm";
 * import { initTokenizerFromModule } from "@ryo-morimoto/vibrato-wasm/slim";
 * ```
 *
 * @module
 */

import * as bg from "../pkg/vibrato_wasm_bg.js";
import type { VibratoToken } from "./types.ts";

const { __wbg_set_wasm, VibratoTokenizer } = bg;

/**
 * WebAssembly.Module から Tokenizer を初期化する。
 * Cloudflare Workers では `import wasm from "./vibrato_wasm_bg.wasm"` で Module が得られる。
 */
export function initTokenizerFromModule(
  wasmModule: WebAssembly.Module,
  dictZstd: Uint8Array,
): { tokenize: (text: string) => VibratoToken[]; free: () => void } {
  const instance = new WebAssembly.Instance(wasmModule, {
    "./vibrato_wasm_bg.js": bg,
  });
  __wbg_set_wasm(instance.exports);

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
