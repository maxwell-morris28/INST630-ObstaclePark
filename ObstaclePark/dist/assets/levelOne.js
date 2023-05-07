import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";

//Initialize the scene

//Create camera offset
const cameraOffset = new THREE.Vector3(0.0, 5.0, 20.0); // NOTE Constant offset between the camera and the target

//Creating the scene that holds all 
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x24252a);

//Load texture for background
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

//Map canvas
const canvas = document.querySelector('#field');

const geometry = new THREE.BoxGeometry(3, 3, 3);
const material = new THREE.MeshBasicMaterial( {color: "green"});
const player = new THREE.InstancedMesh(geometry, material, 1);

//Add player to the scene
scene.add(player);
player.translateY(2);

//Create and add the Ground
const groundTexture = new THREE.TextureLoader().load('pexels-pixabay-69927.jpg');
const plane = new THREE.PlaneGeometry(100, 350);
const ground_color = new THREE.MeshBasicMaterial( {map: groundTexture});
const ground = new THREE.Mesh(plane, ground_color);
scene.add(ground);

//Level Obstacles

//base box obstacle
const obstacle = new THREE.BoxGeometry(3, 3, 3);
const obstacleMaterial = new THREE.MeshBasicMaterial( {color: 0xFF6347});

//Created instances of box obstacles that are positively and negatively positioned, respectively
const boxObstacleOne = new THREE.InstancedMesh(obstacle, obstacleMaterial, 30);
boxObstacleOne.position.y +=2;

const boxObstacleTwo = new THREE.InstancedMesh(obstacle, obstacleMaterial, 30);
boxObstacleTwo.position.x -= 10;
boxObstacleTwo.position.y +=2;

const boxObstacleThree = new THREE.InstancedMesh(obstacle, obstacleMaterial, 30);
//boxObstacleThree.position.x += 10;
boxObstacleThree.position.y +=2;
boxObstacleThree.position.z -= 60;

//Goal box
const goalGeo = new THREE.BoxGeometry(100, 3, 3);
const goalMat = new THREE.MeshBasicMaterial( {color: "white"} );
const goal = new THREE.Mesh(goalGeo, goalMat);

scene.add(goal);
goal.position.z -= 140;

//Create hitbox for player bound to its mesh
const playerBox = new THREE.Box3().setFromObject(player);
player.geometry.computeBoundingBox();

//obstacle hitboxes
const obstacleBox = new THREE.Box3().setFromObject(boxObstacleOne);
boxObstacleOne.geometry.computeBoundingBox();
const obstacleBoxTwo = new THREE.Box3().setFromObject(boxObstacleTwo);
boxObstacleTwo.geometry.computeBoundingBox();
const obstacleBoxThree = new THREE.Box3().setFromObject(boxObstacleThree);
boxObstacleThree.geometry.computeBoundingBox();


//goal hitbox
const goalBox = new THREE.Box3().setFromObject(goal);
goal.geometry.computeBoundingBox();


//Empty array to hold each obstacle
const obstacleList = [];
//obstacleList.push(boxObstacleOne);
//obstacleList.push(boxObstacleTwo);

scene.add(boxObstacleOne);
scene.add(boxObstacleTwo);
scene.add(boxObstacleThree);

boxObstacleOne.position.z -= 20;
boxObstacleTwo.position.z -=20

boxObstacleOne.position.x += 10;


//Create multiple objects with the properties of the instanced meshes to serve as obstacles

/*const dummy = new THREE.Mesh(geometry, material);
const dummyTwo = new THREE.Mesh(geometry, material);
dummy.name = "dummyOne";



const dummyBox = new THREE.Box3().setFromObject(dummy);
const dummyBoxTwo = new THREE.Box3().setFromObject(dummyTwo);

for(let i=0; i<30; i++) {
    //dummy.position.x = Math.random() * 50;
    boxObstacleOne.position.z = Math.random() * -220;

    //dummy.updateMatrix();
    //boxObstacleOne.setMatrixAt(i, dummy.matrix);

    //console.log(dummy.matrix);
}

for(let i=0; i<30; i++) {
    //dummyTwo.position.x = Math.random() * -50;
    boxObstacleTwo.position.z = Math.random() * -220;

    //dummyTwo.updateMatrix();
    //boxObstacleTwo.setMatrixAt(i, dummyTwo.matrix);
}

console.log(dummy);

dummy.geometry.computeBoundingBox();
dummyTwo.geometry.computeBoundingBox();*/

obstacleList.push(boxObstacleOne);
obstacleList.push(boxObstacleTwo);

//render the scene
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

ground.rotateX(- Math.PI / 2);

renderer.render(scene, camera);

canvas.height=window.innerHeight;
canvas.width=window.innerWidth;

//Set intiial camera position
camera.position.set(0,7,20); 

//Create the variable necessary to bind the position of the camera to the object
const objectPosition = player.position;


//Recursive function for things that need to happen every frame
function animate() {
    requestAnimationFrame(animate);

    player.getWorldPosition(objectPosition);
  
    camera.position.copy(objectPosition).add(cameraOffset);
    
    canvas.height=window.innerHeight;
    canvas.width=window.innerWidth;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    playerBox.copy( player.geometry.boundingBox ).applyMatrix4( player.matrixWorld );
    obstacleBox.copy( boxObstacleOne.geometry.boundingBox ).applyMatrix4( boxObstacleOne.matrixWorld );
    obstacleBoxTwo.copy( boxObstacleTwo.geometry.boundingBox ).applyMatrix4( boxObstacleTwo.matrixWorld );
    obstacleBoxThree.copy( boxObstacleThree.geometry.boundingBox ).applyMatrix4( boxObstacleThree.matrixWorld );
    goalBox.copy( goal.geometry.boundingBox ).applyMatrix4( goal.matrixWorld );


    keyPressed();
    playerMovement();
    if(pause === true) {
        player.position.z += 0;
    }
    else {
        player.position.z -= 1;
    }
    //Detect collision: BROKEN!!!
    if(obstacleBox.intersectsBox(playerBox) || obstacleBoxTwo.intersectsBox(playerBox) || obstacleBoxThree.intersectsBox(playerBox)) {
        console.log("yesssssss");
        player.position.x = 0;
        player.position.z = 0;
    
    }
    else if(goalBox.intersectsBox(playerBox)) {
        console.log("Level clear!");
        const goalScreen = document.querySelector(".main");
        goalScreen.style.visibility = "visible";
        goalScreen.style.opacity = 1;
        goalScreen.style.transition = "1s";

        //goalScreen.style.transition = "2s"; 
    }

    //render every frame
    renderer.render(scene, camera);
}

console.log(player);

let leftDown = false;
let rightDown = false;
let pause = false;

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
}
    
function playerMovement() {
    if(leftDown && player.position.x > -48 && pause === false) {
        player.position.x -=1.5;
    }
    else if(rightDown && player.position.x < 48 && pause === false) {
        player.position.x +=1.5;
    } 
}

document.addEventListener("keyup", function(event) {
    console.log(event.code);
    if(event.code === "KeyA") {
        leftDown = false;
    }
    else if(event.code === "KeyD") {
        rightDown = false;
    }
});

function pauseGame() {
    document.addEventListener("keyup", function(event) {
        if(pause === false && event.code === "KeyP") {
            console.log("paused");
            pause = true;
        }
        else if(pause === true && event.code === "KeyP") {
            pause = false;
            console.log(pause);
        }
    })
}

pauseGame();
animate();
console.log(obstacleList);


