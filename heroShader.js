// =============================================================
// Animated GLSL background for the homepage hero section.
//
// A raw WebGL setup (no libraries) that renders a full-screen
// fragment shader on <canvas id="heroCanvas">, sitting behind the
// hero text. Uses all three of the core shader uniforms:
//   - u_time       drives the animation
//   - u_resolution keeps the pattern proportional at any screen size
//   - u_mouse      lets the pattern gently lean toward the cursor
//
// Fails silently on old browsers / no WebGL: the hero still looks
// fine as a plain panel without it (see the .home-hero CSS).
// =============================================================

(function () {
  var canvas = document.getElementById("heroCanvas");
  if (!canvas) return; // this page has no hero canvas — nothing to do

  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return; // WebGL unsupported — hero panel still looks fine without it

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Shaders ----

  // The vertex shader just passes through two full-screen triangles —
  // all the actual visuals happen per-pixel in the fragment shader below.
  var vertexSource = [
    "attribute vec2 a_position;",
    "void main() {",
    "  gl_Position = vec4(a_position, 0.0, 1.0);",
    "}",
  ].join("\n");

  var fragmentSource = [
    "precision mediump float;",
    "uniform vec2 u_resolution;", // canvas size in pixels, used to fix aspect ratio
    "uniform float u_time;",      // seconds since start, used to animate
    "uniform vec2 u_mouse;",      // cursor position, 0.0-1.0 across the canvas

    // Turns a single 0-1 number into a moving color. This is a standard
    // "cosine palette" trick: three sine-like waves (offset by vector d)
    // sweep through color space as t changes, giving smooth color cycling
    // without needing a lookup texture.
    "vec3 palette(float t) {",
    "  vec3 a = vec3(0.05, 0.08, 0.15);", // base (dark navy)
    "  vec3 b = vec3(0.13, 0.5, 0.47);",  // amplitude (how far each channel swings)
    "  vec3 c = vec3(1.0, 1.0, 1.0);",    // frequency (how fast each channel cycles)
    "  vec3 d = vec3(0.0, 0.15, 0.25);",  // phase offset (staggers R/G/B so it's teal, not grey)
    "  return a + b * cos(6.28318 * (c * t + d));",
    "}",

    "void main() {",
    // Center the pixel coordinates on (0,0) and divide by height (not width)
    // so the pattern is a perfect circle/ring shape, not stretched sideways
    // on wide screens.
    "  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;",

    // Pull the pattern's center toward the cursor. u_mouse is 0-1 across
    // the canvas; subtracting 0.5 centers it at the canvas middle, so a
    // cursor dead-center has zero effect, and moving toward an edge drags
    // the glow's origin that direction.
    "  vec2 mouseOffset = (u_mouse - 0.5) * 0.6;",
    "  vec2 uv0 = uv - mouseOffset;",

    "  vec3 finalColor = vec3(0.0);",

    // Domain warping: fold space onto itself with fract() and shrink it
    // (*1.5) three times, drawing the same ring pattern at each of the
    // three scales. Layering slightly different scales/offsets like this
    // is what gives the pattern its organic, non-repeating look instead
    // of one flat ring.
    "  for (float i = 0.0; i < 3.0; i++) {",
    "    uv = fract(uv * 1.5) - 0.5;",

    // Distance from the center of this folded cell, dimmed further from
    // the true (pre-fold, mouse-shifted) center — this is what makes the
    // glow brightest near the cursor and fade out toward the edges.
    "    float d = length(uv) * exp(-length(uv0));",

    // Color depends on distance from center, which of the 3 layers this
    // is, and time — so the whole thing slowly cycles color as it animates.
    "    vec3 col = palette(length(uv0) + i * 0.4 + u_time * 0.1);",

    // Turn plain distance into thin glowing rings that drift outward over
    // time: sin() creates repeating rings, abs() makes them symmetric,
    // and pow(small/d) turns each ring into a sharp bright line with a glow falloff.
    "    d = sin(d * 8.0 - u_time * 0.5) / 8.0;",
    "    d = abs(d);",
    "    d = pow(0.02 / d, 1.15);",

    "    finalColor += col * d;",
    "  }",

    "  gl_FragColor = vec4(finalColor, 1.0);",
    "}",
  ].join("\n");

  function compileShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("Hero shader compile error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  var vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
  var fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return;

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("Hero shader link error:", gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  // ---- Full-screen quad (two triangles covering the whole canvas) ----
  // This is boilerplate every WebGL scene needs: hand the GPU 6 corner
  // points forming 2 triangles that exactly cover the canvas, so the
  // fragment shader above runs once per visible pixel.

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  var positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var timeLocation = gl.getUniformLocation(program, "u_time");
  var mouseLocation = gl.getUniformLocation(program, "u_mouse");

  // ---- Sizing ----
  // devicePixelRatio is capped at 1.5 (instead of using the real value,
  // which can be 2-3 on phones) so we're not asking the GPU to shade
  // 3-4x more pixels than necessary — a real perf cost for a background.

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var displayWidth = Math.round(canvas.clientWidth * dpr);
    var displayHeight = Math.round(canvas.clientHeight * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  // ---- Mouse tracking ----
  // targetMouse is where the pointer actually is right now.
  // mouse is a smoothed value that slowly eases toward targetMouse each
  // frame (see the 0.06 lerp in render()), so the glow "gently leans"
  // toward the cursor instead of snapping to it instantly.
  var targetMouse = [0.5, 0.5];
  var mouse = [0.5, 0.5];

  if (!prefersReducedMotion) {
    window.addEventListener("pointermove", function (e) {
      var rect = canvas.getBoundingClientRect();
      targetMouse[0] = (e.clientX - rect.left) / rect.width;
      // Flip Y: browser pointer coords count down from the top,
      // GLSL/WebGL coords count up from the bottom.
      targetMouse[1] = 1.0 - (e.clientY - rect.top) / rect.height;
    });
  }

  // ---- Animation loop, with tab-visibility pausing ----
  // When the browser tab isn't visible, there's no reason to keep asking
  // the GPU to render — it wastes battery/CPU for nothing anyone can see.
  // We cancel the animation frame loop on hide, and restart it on show.

  var rafId = null;

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function startLoop() {
    if (rafId === null && !prefersReducedMotion) {
      rafId = requestAnimationFrame(render);
    }
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopLoop();
    } else {
      startLoop();
    }
  });

  function render(timeMs) {
    resize();

    // Ease the smoothed mouse position 6% of the way toward the real
    // cursor position every frame — a simple, cheap "lerp".
    mouse[0] += (targetMouse[0] - mouse[0]) * 0.06;
    mouse[1] += (targetMouse[1] - mouse[1]) * 0.06;

    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, timeMs * 0.001);
    gl.uniform2f(mouseLocation, mouse[0], mouse[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    rafId = requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);

  if (prefersReducedMotion) {
    // Reduced-motion fallback: render exactly one still frame (mouse
    // centered, time frozen at 0) and never start the animation loop.
    resize();
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, 0.0);
    gl.uniform2f(mouseLocation, 0.5, 0.5);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  } else if (!document.hidden) {
    startLoop();
  }
})();
