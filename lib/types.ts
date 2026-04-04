/** 形態素解析結果のトークン */
export interface VibratoToken {
  /** 表層形 */
  surface: string;
  /** 品詞情報 (CSV形式、辞書依存) */
  feature: string;
}
