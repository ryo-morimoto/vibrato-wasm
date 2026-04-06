set shell := ["bash", "-euo", "pipefail", "-c"]

# wasm-pack でビルド
build:
    wasm-pack build --target bundler --release --out-dir pkg
    rm -f pkg/.gitignore pkg/package.json pkg/README.md
    @echo "Build complete: $(wc -c < pkg/vibrato_wasm_bg.wasm) bytes (raw)"
    @echo "              : $(gzip -c pkg/vibrato_wasm_bg.wasm | wc -c) bytes (gzip)"

# wasm-opt でサイズ最適化
optimize: build
    wasm-opt -Oz --enable-bulk-memory -o pkg/vibrato_wasm_bg.wasm.opt pkg/vibrato_wasm_bg.wasm
    mv pkg/vibrato_wasm_bg.wasm.opt pkg/vibrato_wasm_bg.wasm
    @echo "Optimized: $(wc -c < pkg/vibrato_wasm_bg.wasm) bytes (raw)"
    @echo "         : $(gzip -c pkg/vibrato_wasm_bg.wasm | wc -c) bytes (gzip)"

# pkg/ の内容を検証
verify:
    test -f pkg/vibrato_wasm_bg.wasm
    test -f pkg/vibrato_wasm_bg.js
    @echo "All expected files present"

# JSR publish dry-run
publish-dry-run: build verify
    npx jsr publish --dry-run

# JSR publish
publish: optimize verify
    npx jsr publish
