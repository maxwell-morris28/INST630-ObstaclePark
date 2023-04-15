import * as THREE from "three";
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const cameraOffset = new THREE.Vector3(0.0, 5.0, 20.0); // NOTE Constant offset between the camera and the target

//Creating the scene that holds all 
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x24252a);

const loader = new THREE.TextureLoader();
loader.load('pexels-hristo-fidanov-1252890.jpg' , function(texture)
            {
             scene.background = texture;  
            });

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

const groundTexture = new THREE.TextureLoader().load('pexels-pixabay-69927.jpg');
const plane = new THREE.PlaneGeometry(100, 1000);
const ground_color = new THREE.MeshBasicMaterial( {map: groundTexture});
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
    //console.log(camera.position);

    player.position.z -= 1;
    
    canvas.height=window.innerHeight;
    canvas.width=window.innerWidth;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //controls.update();
    keyPressed();
    if(leftDown && player.position.x > -48) {
        console.log(player.position.x);
        player.position.x -=1.5;
    }
    else if(rightDown && player.position.x < 48) {
        console.log(player.position.x);
        player.position.x +=1.5;
    }
    renderer.render(scene, camera);
}

let leftDown = false;
let rightDown = false;

function keyPressed() {
    document.addEventListener("keydown", function(event) {
        //console.log(event.code);
        if(event.code === "KeyA") {
            leftDown = true;
        }
        else if(event.code === "KeyD") {
            rightDown = true;
        }
    }) 

    document.addEventListener("keyup", function(event) {
        console.log(event.code);
        if(event.code === "KeyA") {
            leftDown = false;
        }
        else if(event.code === "KeyD") {
            rightDown = false;
        }
    }) 

}

animate();

