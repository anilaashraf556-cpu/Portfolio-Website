# Portfolio — Interactive Shader Hero

This portfolio includes a custom fullscreen GLSL fragment shader in the homepage hero section.

## Shader Hero

The hero uses a custom GLSL fragment shader with three core uniforms:

* `u_time` — drives the animation.
* `u_resolution` — keeps the visual proportional to the canvas size.
* `u_mouse` — lets the shader gently respond to cursor movement.

The shader is rendered behind the hero content while keeping the text readable in both light and dark modes. The dark-mode presentation was customized with a `screen` blend mode and increased visibility so the glowing rings remain clear against the darker background.

## Performance & Accessibility

Device pixel ratio is capped at 1.5, animation pauses when the browser tab is hidden, and users who prefer reduced motion receive a static frame instead of continuous animation.

## Live Demo

The interactive shader hero is available on the deployed portfolio website.
