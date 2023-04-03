import * as THREE from "three";

//Creating the scene that holds all 
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x24252a);


//Perspective Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight , 0.1, 1000);

//instantiate renderer and map it to existing canvas
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#field'),
});

const canvas = document.querySelector('#field');

const geometry = new THREE.BoxGeometry(3, 3, 3);
const material = new THREE.MeshBasicMaterial( {color: 0xFF6347});
//const torus = new THREE.Mesh(geometry, material);
const player = new THREE.Mesh(geometry, material);

//scene.add(torus);
scene.add(player);


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild( renderer.domElement );

camera.position.setZ(30);

renderer.render(scene, camera);

canvas.height=window.innerHeight;
canvas.width=window.innerWidth;


function animate() {
    requestAnimationFrame(animate);

    player.rotation.y += .01;

    canvas.height=window.innerHeight;
    canvas.width=window.innerWidth;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //camera.position.setZ(30);

    renderer.render(scene, camera);
}

animate();
