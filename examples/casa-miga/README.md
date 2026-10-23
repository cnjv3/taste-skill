# CASA MIGA · web

Web de una página para CASA MIGA, cafetería artesanal mediterránea ficticia: *El placer de ir más despacio.*

HTML, CSS y JavaScript sin framework ni paso de compilación. GSAP y ScrollTrigger van incluidos en `assets/js/vendor/` para las dos escenas de scroll; todo lo demás es CSS y JavaScript propio.

## Cómo verla

Cualquier servidor estático sirve. Desde esta carpeta:

```bash
python3 -m http.server 8000
# o
npx serve .
```

y abre `http://localhost:8000`. Abrir `index.html` con doble clic también funciona, pero un servidor reproduce mejor la carga real (fuentes, imágenes diferidas).

## Archivo único

`dist/casa-miga.html` es la web entera en un solo archivo (unos 1,5 MB): estilos, fuentes, scripts e imágenes van incrustados, así que se abre con doble clic, sin servidor y sin conexión. Se regenera con:

```bash
python3 build_single.py
```

Diferencias con la versión de carpeta: cada imagen va en una sola resolución (la mayor) en lugar de varias según la pantalla; no lleva `og:image`, porque las redes sociales necesitan una URL pública; y el aviso legal y la política de privacidad se abren como paneles dentro de la misma página. Para publicar en un servidor, mejor la versión de carpeta, que carga menos en móvil.

## Estructura

```
index.html               página principal (8 secciones)
build_single.py          genera dist/casa-miga.html, la web en un solo archivo
dist/casa-miga.html      la web en un solo archivo
aviso-legal.html         plantilla de aviso legal (pendiente de completar)
privacidad.html          plantilla de política de privacidad (pendiente de completar)
favicon.svg
assets/css/styles.css    tokens de marca, componentes, secciones y movimiento
assets/js/config.js      datos del negocio: el único archivo que hay que tocar para publicarlos
assets/js/main.js        cabecera, menú móvil, carta por pestañas, revelados, escenas de scroll
assets/js/steam.js       vapor en WebGL (shader de ruido, sin dependencias)
assets/js/vendor/        GSAP 3.13 y ScrollTrigger
assets/fonts/            Cormorant Garamond y Manrope, servidas desde la propia web
assets/img/              fotografías en WebP en varios tamaños, y og.jpg para redes
```

## Antes de publicar

**Datos del negocio.** Rellena `assets/js/config.js`: dirección, horario, teléfono, correo, Instagram, enlace de Google Maps y URL pública. Mientras un campo esté vacío, la web muestra el valor de ejemplo con la etiqueta *Ejemplo* y no genera enlaces: el botón *Cómo llegar* aparece desactivado hasta que haya un enlace de Maps. Con dirección, teléfono y horario completos, la página añade los datos estructurados `CafeOrCoffeeShop` para buscadores.

**Carta y precios.** Están en `index.html`, sección `#carta`. Cada precio es un `<data value="2.20">2,20 €</data>`: cambia los dos valores. Son precios de ejemplo; la nota bajo la carta lo indica y debe retirarse cuando sean definitivos. Falta la información de alérgenos.

**Fotografías.** Todas las imágenes son provisionales: recortes del mock de referencia (imágenes generadas, no fotos del local), limpiados de texto y ampliados ×4 con Real-ESRGAN. Hace falta una sesión real con luz natural lateral. Lista de planos:

| Archivo | Plano |
| --- | --- |
| `hero-*.webp`, `hero-mobile-*.webp` | Cappuccino en taza de cerámica moteada y croissant, mesa de piedra, luz de ventana desde la izquierda; la mitad izquierda del encuadre luminosa y despejada para el titular |
| `ritual-*.webp`, `ritual-soft.webp` | Vertido de café en taza de cerámica, fondo oscuro desenfocado; panorámico con aire a la izquierda |
| `cup-*.webp` | La taza terminada con arte latte y el croissant, mismo set de luz que el hero, con aire a la izquierda para el texto (en el móvil el ritual reutiliza `hero-mobile-*`) |
| `pour-580.webp` | Vertido cercano en vertical para la carta |
| `dough-*.webp` | Manos espolvoreando harina sobre masa |
| `loaves-*.webp` | Hogazas recién horneadas en el obrador |
| `croissant-macro.webp` | Macro del hojaldre con luz rasante |
| `strip-*.webp` | Cuatro detalles: masa, hojaldre, horno, miga |
| `interior-*.webp` | La sala del local real |
| `croissant-thumb.webp`, `cinnamon-thumb.webp` | Producto de vitrina sobre fondo claro |
| `og.jpg` | Imagen para compartir (1200 × 630) |

Junto a cada imagen hay un `.json` con su procedencia; actualízalo o bórralo al sustituirla. Al sustituirlas, conserva los nombres o actualiza `index.html`. Si cambias el encuadre del hero o de la taza final, ajusta las coordenadas del vapor (`STEAM_HERO`, `STEAM_HERO_MOBILE`, `STEAM_CUP` en `main.js`), que marcan en píxeles de la imagen fuente dónde está la superficie del café. Retira también la etiqueta *Imagen ilustrativa del ambiente* y la línea *Prototipo de diseño* del pie.

**Textos legales.** `aviso-legal.html` y `privacidad.html` son plantillas con los apartados habituales (LSSI-CE y RGPD) y huecos para los datos del titular. Deben completarse y revisarse por un profesional.

**Metadatos.** Cuando haya dominio, cambia `og:image` a una URL absoluta y añade `<link rel="canonical">`.

**Analítica.** No hay ninguna instalada. Los botones principales llevan `data-track`; si se añade Google Tag Manager u otra herramienta con `window.dataLayer`, cada clic envía `{ event: 'cta_click', cta: '<nombre>' }`. Instalarla obliga a actualizar la política de privacidad y añadir aviso de cookies.

## Qué es real y qué es demostrativo

Funciona de verdad: navegación y anclas, menú móvil (diálogo modal con foco atrapado, Esc para cerrar), pestañas de la carta (ratón, táctil y teclado con flechas, Inicio y Fin), revelados al hacer scroll, escena del ritual, zoom del croissant, vapor en WebGL, carga diferida de imágenes, preferencias de movimiento reducido y los enlaces legales.

Es demostrativo: precios, horario, dirección, teléfono, correo e Instagram (marcados como *Ejemplo*), todas las fotografías y el contenido de las páginas legales.

## Decisiones técnicas

- **Movimiento.** La entrada del hero son animaciones CSS (corren fuera del hilo principal y no bloquean la interacción) y espera a que las fuentes estén listas, con un máximo de 0,7 s. Los revelados usan `IntersectionObserver` y transiciones CSS. GSAP solo mueve lo que va ligado al scroll: el ritual fijado, el zoom del croissant, un paralaje mínimo en *Nuestra casa* y el giro del sello.
- **El ritual.** Es una secuencia fotográfica, no 3D: el plano entra desenfocado, la cámara se acerca al vertido, baja hasta la superficie del café y funde a la taza terminada mientras sube el vapor. No se usa Three.js porque no hay modelos 3D que aporten más que la fotografía y el coste en móvil sería alto.
- **Vapor.** Un shader de ruido fBm con deformación de dominio en un lienzo pequeño (`steam.js`), con densidad de píxel limitada a 1,5, pausado fuera de pantalla y desactivado con movimiento reducido.
- **Movimiento reducido.** Sin entrada animada ni revelados; el ritual se muestra como una composición fija con los cuatro pasos visibles.
- **Fuentes.** Servidas desde la propia web (sin Google Fonts en tiempo de ejecución), lo que evita enviar la IP de cada visitante a terceros.
- **Imágenes.** WebP con `srcset`, dimensiones declaradas para evitar saltos de maquetación, `fetchpriority="high"` y precarga para el hero, `loading="lazy"` para el resto. Unos 1,3 MB en total para toda la página.
- **Precio.** Formato español, `2,20 €`.

## Licencias

GSAP 3.13: licencia estándar de GreenSock, de uso gratuito (gsap.com/standard-license). Cormorant Garamond y Manrope: SIL Open Font License 1.1.
