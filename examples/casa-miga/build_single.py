#!/usr/bin/env python3
"""Genera dist/casa-miga.html: la web completa en un solo archivo HTML.

Incrusta la hoja de estilos, las fuentes, los scripts y las imágenes (una resolución por imagen,
la mayor de cada srcset) como data URIs, y convierte las páginas legales en paneles dentro del
mismo archivo, de modo que se abre con doble clic y sin servidor.

Uso: python3 build_single.py
"""
import base64
import mimetypes
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'dist' / 'casa-miga.html'
mimetypes.add_type('image/webp', '.webp')
mimetypes.add_type('font/woff2', '.woff2')


def data_uri(rel):
    path = (ROOT / rel).resolve()
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}'


def largest(srcset):
    best, best_w = None, -1
    for part in srcset.split(','):
        bits = part.strip().split()
        w = int(bits[1][:-1]) if len(bits) > 1 and bits[1].endswith('w') else 0
        if w > best_w:
            best, best_w = bits[0], w
    return best


def inline_images(html):
    # <source srcset="..."> dentro de <picture>: una sola candidata, sin sizes
    def source(m):
        tag = m.group(0)
        tag = re.sub(r'\ssrcset="([^"]+)"', lambda s: f' srcset="{data_uri(largest(s.group(1)))}"', tag)
        return re.sub(r'\ssizes="[^"]*"', '', tag)
    html = re.sub(r'<source\b[^>]*>', source, html)

    # <img>: la mayor resolución del srcset (o su src) como src, sin srcset ni sizes
    def img(m):
        tag = m.group(0)
        srcset = re.search(r'\ssrcset="([^"]+)"', tag)
        src = largest(srcset.group(1)) if srcset else re.search(r'\ssrc="([^"]+)"', tag).group(1)
        tag = re.sub(r'\ssrcset="[^"]*"', '', tag)
        tag = re.sub(r'\ssizes="[^"]*"', '', tag)
        return re.sub(r'\ssrc="[^"]*"', f' src="{data_uri(src)}"', tag)
    return re.sub(r'<img\b[^>]*>', img, html, flags=re.S)


def legal_panel(page, panel_id):
    src = (ROOT / page).read_text(encoding='utf-8')
    body = re.search(r'<main class="legal container">(.*?)</main>', src, re.S).group(1)
    # dentro de la página principal el título baja a h2 y los apartados a h3
    body = body.replace('<h2>', '<h3>').replace('</h2>', '</h3>')
    body = re.sub(r'<h1 class="display-l">(.*?)</h1>', rf'<h2 class="display-l" id="{panel_id}-title">\1</h2>', body)
    return f'''
  <section class="legal-sheet" id="{panel_id}" aria-labelledby="{panel_id}-title" tabindex="-1">
    <div class="legal-sheet__bar container">
      <span class="brand brand--static" aria-hidden="true"><svg class="brand__mark"><use href="#i-sprig"/></svg><span class="brand__word">Casa Miga</span></span>
      <a class="legal-back" href="#pie">Cerrar</a>
    </div>
    <div class="legal container">{body}</div>
  </section>'''


LEGAL_CSS = '''
/* Páginas legales como paneles del archivo único */
.legal-sheet { display: none; position: fixed; inset: 0; z-index: 90; overflow-y: auto; background: var(--crema); }
.legal-sheet:target { display: block; }
.legal-sheet__bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-block: 1.5rem; border-bottom: 1px solid var(--arena); }
.legal-sheet .legal h2.display-l { margin-top: 0; font-size: clamp(2.3rem, 1.55rem + 2.6vw, 3.75rem); font-weight: 400; line-height: 1; }
.legal h3 { margin-top: 2.5rem; font-family: var(--serif); font-size: 1.75rem; font-weight: 500; line-height: 1.15; }
'''


def build():
    html = (ROOT / 'index.html').read_text(encoding='utf-8')

    # cabecera: favicon incrustado; fuera precargas y la imagen social (necesita una URL pública)
    html = html.replace('href="favicon.svg"', f'href="{data_uri("favicon.svg")}"')
    html = re.sub(r'\s*<link rel="preload"[^>]*>', '', html)
    html = re.sub(r'\s*<meta property="og:image[^>]*>', '', html)
    html = html.replace('<meta name="twitter:card" content="summary_large_image">', '<meta name="twitter:card" content="summary">')

    css = (ROOT / 'assets/css/styles.css').read_text(encoding='utf-8')
    css = re.sub(r'url\("\.\./fonts/([^"]+)"\)', lambda m: f'url("{data_uri("assets/fonts/" + m.group(1))}")', css)
    html = html.replace('<link rel="stylesheet" href="assets/css/styles.css">', f'<style>\n{css}{LEGAL_CSS}</style>')

    html = inline_images(html)

    # enlaces legales a sus paneles, y un ancla para volver al pie
    html = html.replace('<footer class="site-footer">', '<footer class="site-footer" id="pie">')
    html = html.replace('href="aviso-legal.html"', 'href="#aviso-legal"').replace('href="privacidad.html"', 'href="#privacidad"')
    panels = legal_panel('aviso-legal.html', 'aviso-legal') + legal_panel('privacidad.html', 'privacidad')

    # scripts en línea, en el mismo orden; al final del body el DOM ya está completo
    scripts = ['assets/js/config.js', 'assets/js/vendor/gsap.min.js', 'assets/js/vendor/ScrollTrigger.min.js',
               'assets/js/steam.js', 'assets/js/main.js']
    for s in scripts:
        code = (ROOT / s).read_text(encoding='utf-8').replace('</script', '<\\/script')
        html = re.sub(rf'<script src="{re.escape(s)}"( defer)?></script>', lambda m, c=code: f'<script>\n{c}\n</script>', html)
    html = html.replace('</footer>', '</footer>' + panels, 1)

    leftovers = re.findall(r'(?:src|href|srcset)="(?!data:|#|https?:|mailto:|tel:)([^"]+)"', html)
    if leftovers:
        raise SystemExit(f'Referencias externas sin incrustar: {leftovers}')
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(html, encoding='utf-8')
    print(f'{OUT.relative_to(ROOT)}: {OUT.stat().st_size / 1024:.0f} KB')


if __name__ == '__main__':
    build()
