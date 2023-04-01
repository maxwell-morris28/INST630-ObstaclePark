import './style.css'
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


//const OrbitControls = oc(THREE);

//Creating the scene that holds all 
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x24252a);


//Perspective Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight , 0.1, 1000);

//instantiate renderer and map it to existing canvas
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

const canvas = document.querySelector('#bg');


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild( renderer.domElement );

camera.position.setZ(30);

renderer.render(scene, camera);

canvas.height=window.innerHeight;
canvas.width=window.innerWidth;

//const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const geometry = new THREE.IcosahedronGeometry(18, 1);
const material = new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true  });
//const torus = new THREE.Mesh(geometry, material);
const hedron = new THREE.Mesh(geometry, material);

//scene.add(torus);
scene.add(hedron);

const controls = new OrbitControls(camera, renderer.domElement);


function animate() {
    requestAnimationFrame(animate);

    hedron.rotation.x += 0.01;
    hedron.rotation.y += 0.005;
    //hedron.rotation.z += 0.005;

    canvas.height=window.innerHeight;
    canvas.width=window.innerWidth;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    controls.update();
    renderer.render(scene, camera);
}

animate();

