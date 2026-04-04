/**
 * vibrato-wasm: Japanese morphological analyzer powered by vibrato, compiled to WebAssembly.
 *
 * ## Usage (default: inline wasm)
 *
 * ```ts
 * import { initTokenizer } from "@ryo-morimoto/vibrato-wasm";
 *
 * const dictBytes = new Uint8Array(await fetch("system.dic.zst").then(r => r.arrayBuffer()));
 * const tokenizer = initTokenizer(dictBytes);
 * const tokens = tokenizer.tokenize("すもももももももものうち");
 * ```
 *
 * ## Usage (slim: bring your own WebAssembly.Module)
 *
 * ```ts
 * import { initTokenizerFromModule } from "@ryo-morimoto/vibrato-wasm/slim";
 * import wasmModule from "./vibrato_wasm_bg.wasm";
 *
 * const dictBytes = new Uint8Array(await fetch("system.dic.zst").then(r => r.arrayBuffer()));
 * const tokenizer = initTokenizerFromModule(wasmModule, dictBytes);
 * ```
 *
 * @module
 */

export type { VibratoToken } from "./types.ts";
export { initTokenizer } from "./init.ts";
export { initTokenizerFromModule } from "./slim.ts";
