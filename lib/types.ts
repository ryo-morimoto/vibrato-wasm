/**
 * Shared public types for vibrato-wasm.
 *
 * @module
 */

/** A token emitted by the vibrato tokenizer. */
export interface VibratoToken {
  /** 表層形 */
  surface: string;
  /** 品詞情報 (CSV形式、辞書依存) */
  feature: string;
}
