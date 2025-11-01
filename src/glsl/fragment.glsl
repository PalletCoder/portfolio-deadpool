uniform sampler2D uTexture;
varying vec2 vUv;
varying float vAlpha;

// Fragment shader ka main function
void main() {
    // Texture se color nikala rahe hai
    vec4 color = texture2D(uTexture, vUv);
    // Final color set rahe hai , alpha ke saath
    gl_FragColor = vec4(color.rgb, color.a * vAlpha);
}
