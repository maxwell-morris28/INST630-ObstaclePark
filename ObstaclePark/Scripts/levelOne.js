import * as THREE from "three";
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const cameraOffset = new THREE.Vector3(0.0, 5.0, 20.0); // NOTE Constant offset between the camera and the target

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
const player = new THREE.Mesh(geometry, material);

scene.add(player);

player.translateY(2);


const plane = new THREE.PlaneGeometry(100, 1000);
const ground_color = new THREE.MeshBasicMaterial( {color: 0xD3D3D3});
const ground = new THREE.Mesh(plane, ground_color);

scene.add(ground);


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

ground.rotateX(- Math.PI / 2);

renderer.render(scene, camera);

canvas.height=window.innerHeight;
canvas.width=window.innerWidth;

//const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0,7,20); // Set position like this
//controls.update();

const objectPosition = player.position;

function animate() {
    requestAnimationFrame(animate);

    player.getWorldPosition(objectPosition);
    //console.log(player.getWorldPosition(objectPosition));
  
    camera.position.copy(objectPosition).add(cameraOffset);
    console.log(camera.position);

    player.position.z -= 1;
    
    canvas.height=window.innerHeight;
    canvas.width=window.innerWidth;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //controls.update();

    renderer.render(scene, camera);
}

animate();

