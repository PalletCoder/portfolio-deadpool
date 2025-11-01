import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { projects } from "./data.js";

// Scene, camera, renderer, controls, aur container ke liye variables
let scene, camera, renderer, controls, container;

// Yeh group saare cards ko hold karega taaki hum poore carousel ko ek saath ghuma sakein
const carouselGroup = new THREE.Group();
const textureLoader = new THREE.TextureLoader();

const allMaterials = [];
const animationProps = { progress: 0.0 };

// Yeh function shatter mesh banata hai
// Isme hum ek plane geometry lete hain aur usko chote chote triangles me tod dete hain
// Fir har triangle ko alag alag delay se animate karte hain, jisse shatter effect banta hai
async function createShatterMesh(texture, animationPhase, planeWidth, planeHeight) {

    // Shader code fetch kar rahe hain
    const vertexShader = await fetch('/src/glsl/vertex.glsl').then(res => res.text());
    const fragmentShader = await fetch('/src/glsl/fragment.glsl').then(res => res.text());

    const segmentsX = 80; 
    const segmentsY = 50;
    const spreadZ = -3.0; 

    const baseGeom = new THREE.PlaneGeometry(planeWidth, planeHeight, segmentsX, segmentsY);
    // toNonIndexed() geometry ko "tod" deta hai. Har triangle alag ho jata hai.
    // Isse hum har triangle ko alag se animate kar sakte hain.
    const geometry = baseGeom.toNonIndexed(); 
    baseGeom.dispose();

    const vertexCount = geometry.attributes.position.count;
    const faceCount = vertexCount / 3; // Har face (triangle) me 3 vertex hote hain
    const pos = geometry.attributes.position.array;

    const controlPos = new Float32Array(vertexCount * 3);
    const delays = new Float32Array(vertexCount);

    for (let i = 0; i < faceCount; i++) {
        const i9 = i * 9; // Har face 9 coordinates leta hai (3 vertex * 3 (x,y,z))
        
        // Triangle ka center X coordinate nikal rahe hain
        const cx = (pos[i9 + 0] + pos[i9 + 3] + pos[i9 + 6]) / 3;
        
        // Animation delay calculate kar rahe hain. 
        // Yeh X position par based hai, isliye animation ek side se doosri side "wipe" hota hai.
        const delay = (cx + (planeWidth / 2.0)) / planeWidth; 

        for (let j = 0; j < 3; j++) {
            const vertexIndex = i * 3 + j;
            delays[vertexIndex] = delay; // Har vertex ko wahi delay milega jo uske triangle ka hai
            
            // Control position set kar rahe hain (animation ka end point)
            controlPos[vertexIndex * 3 + 0] = pos[vertexIndex * 3 + 0];
            controlPos[vertexIndex * 3 + 1] = pos[vertexIndex * 3 + 1];
            controlPos[vertexIndex * 3 + 2] = pos[vertexIndex * 3 + 2] + spreadZ; // Z-axis me "spread" hoga
        }
    }

    // Yeh custom data (attributes) ko vertex shader me bhejenge
    geometry.setAttribute('aControlPosition', new THREE.BufferAttribute(controlPos, 3));
    geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1));

    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uProgress: { value: 0.0 }, // Yeh animation ko control karega (0 se 1)
            uTexture: { value: texture },
            uAnimationPhase: { value: (animationPhase === 'in' ? 1.0 : 0.0) } // 'in' (1.0) ya 'out' (0.0)
        },
        transparent: true,
        side: THREE.DoubleSide
    });

    return new THREE.Mesh(geometry, material);
}

// GSAP animation setup
function createCarouselAnimation() {
    const tl = gsap.timeline({
        repeat: -1,     // Hamesha chalta rahega
        yoyo: true,     // Animation aage jayega fir reverse hoga
        repeatDelay: 2.0 // Har cycle ke beech 2 sec ka delay
    });

    tl.to(animationProps, {
        progress: 3.0, // Progress 0.0 se 3.0 tak animate hoga
        duration: 30.0, // Animation 30 sec tak chalega
        ease: 'power1.inOut'
    });
}

// 3D scene ko initialize karne ka function
export async function initCarousel() {
    container = document.getElementById('carousel-container');
    if (!container) {
        console.error('Carousel container not found!');
        return;
    }

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 6;  // Camera ko thoda peeche rakha hai

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha:true se background transparent hoga
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false; // Zoom disable kar diya

    const numImages = 5; // Kitne cards honge carousel mein
    const radius = 2.8;  // Circle ka radius (center se kitni doori par cards honge)
    const cardWidth = 3;
    const cardHeight = 1.6875;

    // --- YEH HAI CAROUSEL KA MAIN LOGIC ---
    // Har project ke liye ek card banaya jayega aur usko circle me place kiya jayega
    for (let i = 0; i < numImages; i++) {
        const project = projects[i];

        const textureA = textureLoader.load(project.imgA);
        const textureB = textureLoader.load(project.imgB);
        
        // Har card ke do mesh hote hain, ek 'in' aur ek 'out' animation ke liye
        const meshOut = await createShatterMesh(textureA, 'out', cardWidth, cardHeight);
        const meshIn = await createShatterMesh(textureB, 'in', cardWidth, cardHeight);

        allMaterials.push(meshOut.material, meshIn.material);

        // Dono mesh ko ek group me daal rahe hain taaki unhe ek saath move kar sakein
        const cardGroup = new THREE.Group();
        cardGroup.add(meshIn);
        cardGroup.add(meshOut);

        // --- CIRCLE LOGIC  ---
        // Card ko circle me place karne ka logic
        
        // 1. Angle calculate kar rahe hain. 
        // Poora circle (Math.PI * 2) ko 'numImages' se divide kiya taaki har card ko barabar space mile.
        const angle = (i / numImages) * Math.PI * 2;
        
        // 2. X aur Z position calculate kar rahe hain trigonometry (sin/cos) se.
        // Yeh card ko 'radius' ki doori par circular path pe rakhega.
        const x = radius * Math.sin(angle);
        const z = radius * Math.cos(angle);
        
        // 3. Card ki position set kar rahe hain. Y 0 hai matlab sab horizontal plane par hain.
        cardGroup.position.set(x, 0, z);
        
        // --- CIRCLE LOGIC KHATAM ---

        // 4. Card ko orient (face) karwa rahe hain.
        // lookAt(x*2, 0, z*2) card ko center (0,0,0) se "door" ki taraf face karwata hai (outward facing).
        // Agar hum lookAt(0, 0, 0) karte, toh card center ki taraf face karta.
        cardGroup.lookAt(x * 2, 0, z * 2);

        // 5. Card ko main carousel group me add kar rahe hain.
        carouselGroup.add(cardGroup);
    }
    // Poora carousel group (jisme saare cards hain) ko scene me add kar diya.
    scene.add(carouselGroup);
    
    createCarouselAnimation(); // GSAP animation start kiya
    animateCarousel(); // Render loop start kiya
    window.addEventListener('resize', onCarouselWindowResize);
}

// Animation loop (yeh har frame chalta hai)
function animateCarousel() {
    requestAnimationFrame(animateCarousel);
    
    // --- CAROUSEL ROTATION LOGIC ---
    // Yahaan poore carouselGroup ko Y-axis par dheere-dheere rotate kiya ja raha hai.
    // Isse hi "spinning" effect aata hai.
    carouselGroup.rotation.y += 0.002;  
    
    // Shader me progress uniform ko update kiya ja raha hai
    // Yeh 'animationProps.progress' GSAP se update ho raha hai
    const progress = animationProps.progress;
    for (const material of allMaterials) {
        material.uniforms.uProgress.value = progress;
    }

    controls.update(); // Orbit controls ko update kiya
    renderer.render(scene, camera); // Scene ko render kiya
}

// Window resize ko handle karne ka function
function onCarouselWindowResize() {
    if (!container) return; 
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}