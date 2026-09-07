// ==========================================================================
// QUEEN JIYU'S UNIVERSE - GLSL GALAXY SHADER
// Procedural spiral galaxy disc with rotating arms, core bloom, and stardust
// ==========================================================================

export const GalaxyShader = {
    vertexShader: `
        uniform float uTime;
        uniform float uSize;
        
        attribute float aScale;
        attribute vec3 aRandomness;
        
        varying vec3 vColor;
        varying float vDistance;

        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            
            // Subtle spiral rotation over time
            float angle = atan(modelPosition.x, modelPosition.z);
            float distanceToCenter = length(modelPosition.xz);
            float angleOffset = (1.0 / (distanceToCenter + 20.0)) * uTime * 0.4;
            angle += angleOffset;
            
            modelPosition.x = cos(angle) * distanceToCenter + aRandomness.x;
            modelPosition.z = sin(angle) * distanceToCenter + aRandomness.z;
            modelPosition.y += aRandomness.y + sin(uTime * 0.5 + distanceToCenter * 0.02) * 4.0;

            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;

            gl_Position = projectedPosition;
            
            // Size attenuation
            gl_PointSize = uSize * aScale * (1200.0 / -viewPosition.z);
            
            vDistance = distanceToCenter;
            
            // Color gradient from golden core to royal violet periphery
            vec3 coreColor = vec3(1.0, 0.92, 0.65);       // Champagne Gold
            vec3 midColor = vec3(0.38, 0.51, 0.96);        // Moonlight Blue
            vec3 outerColor = vec3(0.58, 0.20, 0.92);      // Royal Violet
            
            float t = clamp(distanceToCenter / 450.0, 0.0, 1.0);
            if (t < 0.35) {
                vColor = mix(coreColor, midColor, t / 0.35);
            } else {
                vColor = mix(midColor, outerColor, (t - 0.35) / 0.65);
            }
        }
    `,
    fragmentShader: `
        varying vec3 vColor;
        varying float vDistance;

        void main() {
            // Radial point falloff
            float strength = distance(gl_PointCoord, vec2(0.5));
            strength = 1.0 - strength;
            strength = pow(strength, 4.5);

            if (strength < 0.01) discard;

            vec3 finalColor = vColor * (1.0 + strength * 1.5);
            gl_FragColor = vec4(finalColor, strength);
        }
    `
};

