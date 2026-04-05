/**
 * vibrato-wasm: Japanese morphological analyzer powered by vibrato, compiled to WebAssembly.
 *
 * ## Usage (default: inline wasm)
 *
 * ```ts
 * import { initTokenizer } from "@ryo-morimoto/vibrato-wasm";
 *
 * const dictBytes = new Uint8Array(await fetch("system.dic.zst").then(r => r.arrayBuffer()));
 * const tokenizer = await initTokenizer(dictBytes);
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

/** Token returned by the vibrato tokenizer. */
export type { VibratoToken } from "./types.ts";

/**
 * Initializes a tokenizer by loading the bundled WebAssembly binary.
 *
 * Suitable for browsers and Deno where the package can fetch its own wasm asset.
 */
export { initTokenizer } from "./init.ts";

/**
 * Initializes a tokenizer from a preloaded `WebAssembly.Module`.
 *
 * Suitable for runtimes like Cloudflare Workers that import `.wasm` as a module.
 */
export { initTokenizerFromModule } from "./slim.ts";
