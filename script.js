/**
 * main script with Three.js Background & GSAP animations
 */

// --- Custom Cursor ---
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
    
    // Slight delay for follower
    setTimeout(() => {
        follower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, 50);
});

// Cursor Effects on Hover
const hoverElements = document.querySelectorAll('a, .btn, .menu-toggle, .project-card, .skill-category');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.style.width = '60px';
        follower.style.height = '60px';
        follower.style.borderColor = 'var(--secondary-accent)';
    });
    el.addEventListener('mouseleave', () => {
        follower.style.width = '40px';
        follower.style.height = '40px';
        follower.style.borderColor = 'rgba(0, 255, 204, 0.5)';
    });
});

// --- Mobile Navigation ---
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// --- GSAP Animations ---
gsap.registerPlugin(ScrollTrigger);

// Hero Section Animation
const tl = gsap.timeline();
tl.from('.hero .greeting', {y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'})
  .from('.hero .glitch', {y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'}, '-=0.6')
  .from('.hero .role', {y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'}, '-=0.6')
  .from('.hero .hero-desc', {y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'}, '-=0.6')
  .from('.hero .cta-group', {y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'}, '-=0.6')
  .from('.social-links', {y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'}, '-=0.6');

// Scroll Animations for sections
document.querySelectorAll('section').forEach((section) => {
    if(section.id !== 'home') {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleClass: {targets: section, className: "section-hidden"},
                once: false
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        });
    } else {
        section.classList.remove('section-hidden');
    }
});

// --- Vanilla Tilt for Cards ---
VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
    scale: 1.05
});

// --- Three.js 3D Background ---
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.001);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particles
const geometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material
const material = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00ffcc,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

// Add some floating geometric shapes
const shapes = [];
const geometries = [
    new THREE.TorusGeometry(3, 0.5, 16, 50),
    new THREE.OctahedronGeometry(2),
    new THREE.IcosahedronGeometry(2)
];

const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff007f,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});

for(let i = 0; i < 5; i++) {
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const mesh = new THREE.Mesh(geo, wireframeMaterial);
    
    mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * -40 - 10
    );
    
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    shapes.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.01,
        rotSpeedY: (Math.random() - 0.5) * 0.01
    });
    
    scene.add(mesh);
}

camera.position.z = 15;

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Slowly move particles
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;
    
    // Parallax effect on mouse move
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

    // Animate shapes
    shapes.forEach(shapeObj => {
        shapeObj.mesh.rotation.x += shapeObj.rotSpeedX;
        shapeObj.mesh.rotation.y += shapeObj.rotSpeedY;
        
        // Gentle floating
        shapeObj.mesh.position.y += Math.sin(elapsedTime * 0.5 + shapeObj.mesh.position.x) * 0.01;
    });

    renderer.render(scene, camera);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
