// #pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

uniform float rate;
uniform float time;
uniform vec3 color;
uniform vec2 center;

varying vec2 vUv;


void main(void) {
  // vec2 n = sin(time * 0.1 + vec2(vUv.xy * vec2(2.1, -1.8) * 10.0)) * 0.02;

  // float d = distance(vUv, center + n);
  float d = distance(vUv, center);
  float a = step(rate, d);
  if(a <= 0.01) {
    discard;
  }

  gl_FragColor = vec4(color, a);
}
