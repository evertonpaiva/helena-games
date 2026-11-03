#!/usr/bin/env bash
# Gera a versão otimizada (minificada) do jogo em dist/. Uso: ./build.sh
# Requer Node.js/npm; terser e clean-css-cli são baixados via npx na primeira execução.
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SAIDA="$RAIZ/dist"

if ! command -v npx >/dev/null 2>&1; then
  echo "npx não encontrado. Instale Node.js/npm para gerar a versão otimizada." >&2
  exit 1
fi

rm -rf "$SAIDA"
mkdir -p "$SAIDA"

TERSER_CMD="npx --yes terser"
if command -v terser >/dev/null 2>&1; then
  TERSER_CMD="terser"
fi

CLEANCSS_CMD="npx --yes clean-css-cli"
CLEANCSS_LOCAL="$(find "$HOME/.npm/_npx" -name cleancss -type f -perm -u+x 2>/dev/null | head -n 1 || true)"
if command -v cleancss >/dev/null 2>&1; then
  CLEANCSS_CMD="cleancss"
elif [ -n "$CLEANCSS_LOCAL" ] && [ -x "$CLEANCSS_LOCAL" ]; then
  CLEANCSS_CMD="$CLEANCSS_LOCAL"
fi

for arquivo in audio.js game.js; do
  $TERSER_CMD "$RAIZ/$arquivo" --compress passes=2 --mangle --output "$SAIDA/$arquivo"
done
$CLEANCSS_CMD -O2 -o "$SAIDA/styles.css" "$RAIZ/styles.css"

# HTML: remove comentários e espaços entre as tags
python3 - "$RAIZ/index.html" "$SAIDA/index.html" <<'PY'
import re, sys
html = open(sys.argv[1], encoding="utf-8").read()
html = re.sub(r"<!--.*?-->", "", html, flags=re.S)
html = re.sub(r">\s+<", "><", html)
open(sys.argv[2], "w", encoding="utf-8").write(html.strip() + "\n")
PY
cp "$RAIZ/logo-helena-games.svg" "$RAIZ/icon.svg" "$RAIZ/icon-180.png" "$SAIDA/"

echo "Versão otimizada em: $SAIDA"
for arquivo in audio.js game.js styles.css index.html; do
  printf '  %-12s %7s -> %7s bytes\n' "$arquivo" "$(wc -c < "$RAIZ/$arquivo")" "$(wc -c < "$SAIDA/$arquivo")"
done
echo "Para servir: python3 -m http.server 8000 --directory dist"
