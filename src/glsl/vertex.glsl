uniform float uProgress;
uniform float uAnimationPhase; 

attribute vec3 aControlPosition;
attribute float aDelay;

varying vec2 vUv;
varying float vAlpha;

// Yeh function easing ke liye hai
float easeInOutCubic(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void main() {
    vUv = uv;

    float tDuration = 1.0;
    float tDelay = aDelay * 1.0;
    float tTime = clamp(uProgress - tDelay, 0.0, tDuration);
    float tProgress = easeInOutCubic(tTime / tDuration);

    vec3 startPos = (uAnimationPhase == 1.0) ? aControlPosition : position;
    vec3 endPos = (uAnimationPhase == 1.0) ? position : aControlPosition;

    vec3 newPosition = mix(startPos, endPos, tProgress);

    // Plane ko bend karne ka code
    float bendRadius = 3.5; 
    float xPos = position.x; 
    float arc = sqrt(bendRadius * bendRadius - xPos * xPos);
    newPosition.z += arc - bendRadius;
    
    vAlpha = (uAnimationPhase == 1.0) ? tProgress : 1.0 - tProgress;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
