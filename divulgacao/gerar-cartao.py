#!/usr/bin/env python3
"""Gera o cartão de divulgação (90 x 55 mm) em SVG e PNG com QR Code.

Uso (precisa de Python 3 e Google Chrome):
    ./divulgacao/gerar-cartao.py

Se o pacote `segno` não estiver instalado, o script cria sozinho um ambiente
virtual em divulgacao/.venv e se executa novamente dentro dele.
"""
import base64
import pathlib
import subprocess
import tempfile

import os
import sys

try:
    import segno
except ImportError:
    venv = pathlib.Path(__file__).resolve().parent / ".venv"
    python = venv / "bin" / "python"
    if not python.exists():
        subprocess.run([sys.executable, "-m", "venv", str(venv)], check=True)
    subprocess.run([str(python), "-m", "pip", "install", "--quiet", "segno"], check=True)
    os.execv(str(python), [str(python), __file__])

URL = "https://evertonpaiva.github.io/helena-games/"
AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent
W, H = 900, 550

qr = segno.make(URL, error="q", boost_error=False)
modulos = list(qr.matrix)
n = len(modulos)
quiet = 2
lado = 290
cel = lado / (n + 2 * quiet)
qx, qy = 560, 95
partes = []
for y, linha in enumerate(modulos):
    for x, bit in enumerate(linha):
        if bit:
            partes.append(f"M{qx + (x + quiet) * cel:.2f} {qy + (y + quiet) * cel:.2f}h{cel + .3:.2f}v{cel + .3:.2f}h-{cel + .3:.2f}z")
qr_path = "".join(partes)

icone = base64.b64encode((RAIZ / "icon.svg").read_bytes()).decode()
logo = base64.b64encode((RAIZ / "logo-helena-games.svg").read_bytes()).decode()

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="'Segoe UI', 'Noto Sans', Arial, sans-serif">
  <defs>
    <linearGradient id="fundo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a1670"/><stop offset=".55" stop-color="#5a1f9a"/><stop offset="1" stop-color="#b8337f"/></linearGradient>
    <linearGradient id="titulo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd34d"/><stop offset=".6" stop-color="#ff9ee0"/><stop offset="1" stop-color="#7dd8ff"/></linearGradient>
    <linearGradient id="trilha" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe066"/><stop offset="1" stop-color="#e89a10"/></linearGradient>
    <clipPath id="canto"><rect width="{W}" height="{H}" rx="34"/></clipPath>
  </defs>
  <g clip-path="url(#canto)">
    <rect width="{W}" height="{H}" fill="url(#fundo)"/>
    <g opacity=".22" fill="#fff">
      <circle cx="80" cy="60" r="3"/><circle cx="330" cy="30" r="2.5"/><circle cx="470" cy="120" r="3"/>
      <circle cx="40" cy="300" r="2"/><circle cx="500" cy="330" r="3"/><circle cx="200" cy="470" r="2.5"/>
    </g>
    <rect y="478" width="{W}" height="72" fill="#12082e" opacity=".55"/>
    <image href="data:image/svg+xml;base64,{icone}" x="40" y="38" width="86" height="86"/>
    <text x="146" y="70" font-size="19" font-weight="700" letter-spacing="3" fill="#ffd34d">UMA CAMPANHA DE DEFESA</text>
    <text x="146" y="115" font-size="46" font-weight="800" fill="#fff" textLength="340" lengthAdjust="spacingAndGlyphs">Tower Defense</text>
    <text x="40" y="180" font-size="40" font-weight="800" fill="url(#titulo)" textLength="450" lengthAdjust="spacingAndGlyphs">Datas Comemorativas</text>
    <text x="40" y="228" font-size="23" fill="#f3e9ff" textLength="450" lengthAdjust="spacingAndGlyphs">Defenda o caminho, pesquise evoluções</text>
    <text x="40" y="260" font-size="23" fill="#f3e9ff" textLength="450" lengthAdjust="spacingAndGlyphs">e vença os invasores em 6 temas!</text>
    <text x="40" y="326" font-size="40" textLength="450" lengthAdjust="spacing">🎃🎄🐰🌎🎭🌽</text>
    <rect x="40" y="356" width="470" height="62" rx="31" fill="#ffffff" opacity=".96"/>
    <text x="275" y="395" font-size="24" font-weight="800" text-anchor="middle" fill="#3a1858" textLength="410" lengthAdjust="spacingAndGlyphs">evertonpaiva.github.io/helena-games</text>
    <rect x="530" y="65" width="350" height="400" rx="28" fill="#fff"/>
    <rect x="540" y="75" width="330" height="380" rx="22" fill="none" stroke="#b8337f" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/>
    <path d="{qr_path}" fill="#2a1670"/>
    <text x="705" y="420" font-size="25" font-weight="800" text-anchor="middle" fill="#5a1f9a" textLength="290" lengthAdjust="spacingAndGlyphs">Aponte a câmera e jogue!</text>
    <text x="705" y="443" font-size="16" text-anchor="middle" fill="#6b5a80">Grátis · direto no navegador</text>
    <image href="data:image/svg+xml;base64,{logo}" x="40" y="486" width="140" height="45"/>
    <text x="860" y="515" font-size="19" font-weight="700" text-anchor="end" fill="#ffe98f">Jogue no celular ou no computador 🎮</text>
  </g>
</svg>
'''
(AQUI / "cartao.svg").write_text(svg, encoding="utf-8")

html = f'<!doctype html><meta charset="utf-8"><style>html,body{{margin:0;background:#0000}}svg{{display:block;width:{W*2}px;height:{H*2}px}}</style>{svg}'
with tempfile.TemporaryDirectory() as tmp:
    pagina = pathlib.Path(tmp) / "cartao.html"
    pagina.write_text(html, encoding="utf-8")
    subprocess.run([
        "google-chrome", "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
        "--default-background-color=00000000", f"--window-size={W*2},{H*2}",
        f"--screenshot={AQUI / 'cartao.png'}", pagina.as_uri(),
    ], check=True, timeout=90, capture_output=True)
print("Gerado:", AQUI / "cartao.svg", AQUI / "cartao.png")
