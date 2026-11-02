#!/usr/bin/env python3
"""Gera divulgacao/cartoes-a4.pdf: folha A4 com 10 cartões (2 x 5) de 90 x 55 mm,
com marcas de corte nas margens.

Uso (precisa de Python 3 e Google Chrome):
    ./divulgacao/gerar-pdf-a4.py

Usa divulgacao/cartao.png; se ele não existir, roda antes ./gerar-cartao.py.
Imprima em A4 a 100% (sem "ajustar à página").
"""
import pathlib
import subprocess
import sys
import tempfile

AQUI = pathlib.Path(__file__).resolve().parent
COLUNAS, LINHAS = 2, 5
CARTAO_W, CARTAO_H = 90, 55
A4_W, A4_H = 210, 297
MARGEM_X = (A4_W - COLUNAS * CARTAO_W) / 2
MARGEM_Y = (A4_H - LINHAS * CARTAO_H) / 2
MARCA = 4

png = AQUI / "cartao.png"
if not png.exists():
    subprocess.run([sys.executable, str(AQUI / "gerar-cartao.py")], check=True)

xs = [MARGEM_X + i * CARTAO_W for i in range(COLUNAS + 1)]
ys = [MARGEM_Y + j * CARTAO_H for j in range(LINHAS + 1)]
marcas = []
for y in ys:
    marcas.append(f'<line x1="{xs[0] - MARCA}" y1="{y}" x2="{xs[0] - 1}" y2="{y}"/>')
    marcas.append(f'<line x1="{xs[-1] + 1}" y1="{y}" x2="{xs[-1] + MARCA}" y2="{y}"/>')
for x in xs:
    marcas.append(f'<line x1="{x}" y1="{ys[0] - MARCA}" x2="{x}" y2="{ys[0] - 1}"/>')
    marcas.append(f'<line x1="{x}" y1="{ys[-1] + 1}" x2="{x}" y2="{ys[-1] + MARCA}"/>')

imagens = "".join(
    f'<img src="{png.as_uri()}" style="left:{xs[c]}mm;top:{ys[r]}mm">'
    for r in range(LINHAS) for c in range(COLUNAS)
)
html = f"""<!doctype html><meta charset="utf-8">
<style>
@page {{ size: A4; margin: 0 }}
html, body {{ margin: 0; width: {A4_W}mm; height: {A4_H}mm }}
img {{ position: absolute; width: {CARTAO_W}mm; height: {CARTAO_H}mm }}
svg {{ position: absolute; left: 0; top: 0 }}
</style>
<svg width="{A4_W}mm" height="{A4_H}mm" viewBox="0 0 {A4_W} {A4_H}" stroke="#555" stroke-width=".2">{"".join(marcas)}</svg>
{imagens}"""

saida = AQUI / "cartoes-a4.pdf"
with tempfile.TemporaryDirectory() as tmp:
    pagina = pathlib.Path(tmp) / "folha.html"
    pagina.write_text(html, encoding="utf-8")
    subprocess.run([
        "google-chrome", "--headless=new", "--no-sandbox", "--disable-gpu",
        "--no-pdf-header-footer", f"--print-to-pdf={saida}", pagina.as_uri(),
    ], check=True, timeout=120, capture_output=True)
print("Gerado:", saida)
