/*
 * Vapor orgánico para CASA MIGA.
 * Un shader de ruido fBm con deformación de dominio dibuja volutas que suben, se abren y se disipan.
 * Lienzo pequeño, densidad de píxel limitada, pausa fuera de pantalla. Sin dependencias.
 */
(function () {
  'use strict';

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';

  var FRAG = [
    'precision mediump float;',
    'uniform vec2 uRes;uniform float uTime;uniform float uAmount;uniform float uSeed;',
    'float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);',
    'return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);}',
    'float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+17.0;a*=0.5;}return v;}',
    'void main(){',
    '  vec2 uv=gl_FragCoord.xy/uRes;',
    '  float t=uTime+uSeed;',
    '  float h=uv.y;',
    // la columna oscila y se abre a medida que sube
    '  float sway=(fbm(vec2(h*1.4-t*0.12,uSeed))-0.5)*0.55*h;',
    '  float x=uv.x-0.5-sway;',
    '  float width=mix(0.07,0.34,smoothstep(0.0,1.0,h));',
    '  float column=smoothstep(width,width*0.15,abs(x));',
    // volutas: ruido ascendente deformado por otro ruido
    '  vec2 q=vec2(x*3.2,h*2.4-t*0.32);',
    '  vec2 warp=vec2(fbm(q+vec2(0.0,t*0.05)),fbm(q+vec2(5.2,1.3)));',
    '  float d=fbm(q*1.6+warp*1.8);',
    '  float wisps=smoothstep(0.42,0.78,d);',
    '  float fade=smoothstep(0.0,0.12,h)*(1.0-smoothstep(0.5,1.0,h));',
    '  float a=wisps*column*fade*uAmount;',
    '  gl_FragColor=vec4(vec3(1.0,0.975,0.94)*a,a);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }

  function create(canvas, options) {
    options = options || {};
    var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, powerPreference: 'low-power' });
    if (!gl) return null;

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, 'uRes');
    var uTime = gl.getUniformLocation(prog, 'uTime');
    var uAmount = gl.getUniformLocation(prog, 'uAmount');
    gl.uniform1f(gl.getUniformLocation(prog, 'uSeed'), options.seed != null ? options.seed : Math.random() * 20);
    gl.clearColor(0, 0, 0, 0);

    var amount = options.amount != null ? options.amount : 0.7;
    var enabled = false;
    var visible = false;
    var lost = false;
    var raf = 0;
    var t0 = performance.now();

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    }

    function frame(now) {
      raf = 0;
      if (!enabled || !visible || lost) return;
      resize();
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform1f(uAmount, amount);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (amount > 0.002) gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }

    function play() {
      if (enabled && visible && !raf && !lost) raf = requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(function (entries) {
      visible = entries[entries.length - 1].isIntersecting;
      play();
    });
    io.observe(canvas);

    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      lost = true;
      canvas.classList.remove('is-live');
    });

    return {
      start: function () { enabled = true; canvas.classList.add('is-live'); play(); },
      stop: function () { enabled = false; canvas.classList.remove('is-live'); },
      setAmount: function (v) { amount = v; },
      get running() { return enabled; }
    };
  }

  /*
   * Coloca el lienzo sobre un punto de una imagen con object-fit: cover.
   * spec usa las coordenadas de la imagen fuente: { w, h, x, y, bw, bh }, donde (x, y) es la base del vapor
   * (la superficie del café) y bw × bh el tamaño de la columna.
   */
  function place(img, canvas, spec) {
    var box = img.getBoundingClientRect();
    var W = img.clientWidth, H = img.clientHeight;
    if (!W || !H || !box) return;
    var pos = getComputedStyle(img).objectPosition.split(' ').map(function (v) { return parseFloat(v) / 100; });
    var s = Math.max(W / spec.w, H / spec.h);
    var rw = spec.w * s, rh = spec.h * s;
    var ox = (W - rw) * (isNaN(pos[0]) ? 0.5 : pos[0]);
    var oy = (H - rh) * (isNaN(pos[1]) ? 0.5 : pos[1]);
    canvas.style.width = Math.round(spec.bw * s) + 'px';
    canvas.style.height = Math.round(spec.bh * s) + 'px';
    canvas.style.transform = 'translate(' + Math.round(ox + (spec.x - spec.bw / 2) * s) + 'px,' + Math.round(oy + (spec.y - spec.bh) * s) + 'px)';
  }

  window.CasaSteam = { create: create, place: place };
})();
