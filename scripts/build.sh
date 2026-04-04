#!/usr/bin/env bash
set -euo pipefail

# wasm-pack でビルド（wasm-opt は CI の binaryen で別途実行）
wasm-pack build --target bundler --release --out-dir pkg

# wasm-pack が生成する不要ファイルを削除
rm -f pkg/.gitignore pkg/package.json pkg/README.md

echo "Build complete: $(wc -c < pkg/vibrato_wasm_bg.wasm) bytes (raw)"
echo "              : $(gzip -c pkg/vibrato_wasm_bg.wasm | wc -c) bytes (gzip)"
