import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5); // Set camera position

// Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a basic ambient light
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

// Add a directional light from above
const topLight = new THREE.DirectionalLight(0xffffff, 4);
topLight.position.set(0, 2, 0).normalize(); // Position the light above the model
scene.add(topLight);

// Add a directional light from forward
const forcLight = new THREE.DirectionalLight(0xffffff, 4);
forcLight.position.set(0, 5, 10).normalize(); // Position the light in front of the model
scene.add(forcLight);

// Load the 3D model
const loader = new GLTFLoader();
let model;
loader.load(
    'earth/scene.gltf', 
    function (gltf) {
        console.log("Model loaded successfully!");
        model = gltf.scene;
        scene.add(model);

        model.position.set(1, 0, 0);
        model.scale.set(2, 2, 2);
    },
    undefined,
    function (error) {
        console.error('An error occurred:', error);
    }
);

// Variables for tracking mouse movement and scroll
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let scrollValue = 0;

// Handle mouse down event
document.addEventListener('mousedown', (event) => {
    isDragging = true;
});

// Handle mouse up event
document.addEventListener('mouseup', (event) => {
    isDragging = false;
});

// Handle mouse move event
document.addEventListener('mousemove', (event) => {
    if (isDragging && model) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        const rotationSpeed = 0.005; // Adjust rotation speed as needed

        // Update model rotation based on mouse movement
        model.rotation.y += deltaMove.x * rotationSpeed;
        model.rotation.x += deltaMove.y * rotationSpeed;

        // Limit rotation on x-axis to prevent the model from flipping
        model.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, model.rotation.x));
    }

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

// Handle scroll event
window.addEventListener('scroll', () => {
    scrollValue = window.scrollY;

    // Move the model slightly based on scroll position, but ensure it stays within bounds
    if (model) {
        const moveDistance = Math.max(-1, Math.min(1, scrollValue * 0.01)); // Limit movement to stay within view
        model.position.x = moveDistance;
    }

    // Animate text
    const text = document.getElementById('text');
    if (scrollValue > 100) {
        text.style.left = '10%'; // Move text into view
    } else {
        text.style.left = '-100%'; // Hide text
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Start animation
animate();
