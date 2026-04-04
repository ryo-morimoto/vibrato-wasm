# vibrato-wasm

[vibrato](https://github.com/daac-tools/vibrato) (Rust製日本語形態素解析器) を WebAssembly にコンパイルしたパッケージ。

## サイズ

| コンポーネント | サイズ |
|---|---|
| wasm バイナリ | 139KB (52KB gzip) |
| IPADIC辞書 (zstd) | 7.9MB (別途必要) |

## 使い方

### Cloudflare Workers (推奨: slim エントリ)

```ts
import wasmModule from "../path/to/vibrato_wasm_bg.wasm";
import { initTokenizerFromModule } from "@ryo-morimoto/vibrato-wasm/slim";

const dictBytes = new Uint8Array(await env.R2.get("system.dic.zst").arrayBuffer());
const tokenizer = initTokenizerFromModule(wasmModule, dictBytes);

const tokens = tokenizer.tokenize("すもももももももものうち");
// [{ surface: "すもも", feature: "名詞,一般,*,*,*,*,すもも,スモモ,スモモ" }, ...]
```

### ブラウザ / Deno

```ts
import { initTokenizer } from "@ryo-morimoto/vibrato-wasm";

const dictBytes = new Uint8Array(await fetch("system.dic.zst").then(r => r.arrayBuffer()));
const tokenizer = await initTokenizer(dictBytes);

const tokens = tokenizer.tokenize("東京都に住む");
```

## Token

```ts
interface VibratoToken {
  surface: string;  // 表層形
  feature: string;  // 品詞情報 (CSV, 辞書依存)
}
```

IPADIC の場合、`feature` は `品詞,品詞細分類1,品詞細分類2,品詞細分類3,活用型,活用形,原形,読み,発音` の CSV。

## 辞書

vibrato の [Releases](https://github.com/daac-tools/vibrato/releases) からプリコンパイル済み辞書をダウンロード:

```bash
wget https://github.com/daac-tools/vibrato/releases/download/v0.5.2/ipadic-mecab-2_7_0.tar.xz
tar xf ipadic-mecab-2_7_0.tar.xz
# ipadic-mecab-2_7_0/system.dic.zst を R2 等にアップロード
```

## ビルド

```bash
# 前提: Rust + wasm32-unknown-unknown ターゲット + wasm-pack
bash scripts/build.sh
```

## ライセンス

Apache-2.0
