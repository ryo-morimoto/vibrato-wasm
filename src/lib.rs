use std::io::Read;

use serde::Serialize;
use wasm_bindgen::prelude::*;

#[derive(Serialize)]
pub struct Token {
    /// 表層形
    pub surface: String,
    /// 品詞情報 (CSV形式、辞書依存)
    pub feature: String,
}

#[wasm_bindgen]
pub struct VibratoTokenizer {
    tokenizer: vibrato::Tokenizer,
}

#[wasm_bindgen]
impl VibratoTokenizer {
    /// zstd 圧縮された辞書バイナリから Tokenizer を初期化する。
    /// R2 等から fetch した system.dic.zst をそのまま渡せる。
    #[wasm_bindgen(constructor)]
    pub fn new(dict_zstd: &[u8]) -> Result<VibratoTokenizer, JsError> {
        let mut decoder = ruzstd::StreamingDecoder::new(dict_zstd)
            .map_err(|e| JsError::new(&format!("zstd decode error: {e}")))?;
        let mut buf = Vec::new();
        decoder
            .read_to_end(&mut buf)
            .map_err(|e| JsError::new(&format!("zstd read error: {e}")))?;
        let dict = vibrato::Dictionary::read(buf.as_slice())
            .map_err(|e| JsError::new(&format!("dictionary read error: {e}")))?;
        let tokenizer = vibrato::Tokenizer::new(dict);
        Ok(Self { tokenizer })
    }

    /// テキストを形態素解析し、Token 配列を返す。
    /// Worker は毎回生成される（ライフタイム問題の回避）。
    pub fn tokenize(&self, text: &str) -> Result<JsValue, JsError> {
        let mut worker = self.tokenizer.new_worker();
        worker.reset_sentence(text);
        worker.tokenize();
        let tokens: Vec<Token> = worker
            .token_iter()
            .map(|t| Token {
                surface: t.surface().to_string(),
                feature: t.feature().to_string(),
            })
            .collect();
        serde_wasm_bindgen::to_value(&tokens)
            .map_err(|e| JsError::new(&format!("serialization error: {e}")))
    }
}
