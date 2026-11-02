#!/usr/bin/env bash
# Serve o jogo na rede local. Uso: ./servidor.sh [porta]   (padrão: 8000)
set -euo pipefail

PORTA="${1:-${PORTA:-8000}}"
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 não encontrado. Instale-o para iniciar o servidor." >&2
  exit 1
fi

echo "Tower Defense - Datas Comemorativas"
echo "Neste computador: http://localhost:${PORTA}"
if command -v hostname >/dev/null 2>&1; then
  for ip in $(hostname -I 2>/dev/null || true); do
    case "$ip" in
      *:*|172.17.*|172.18.*) ;;
      *) echo "Na rede:          http://${ip}:${PORTA}" ;;
    esac
  done
fi
echo "Pressione Ctrl+C para encerrar. Se outros aparelhos não acessarem, libere a porta ${PORTA} no firewall."
echo

exec python3 -m http.server "$PORTA" --bind 0.0.0.0 --directory "$RAIZ"
