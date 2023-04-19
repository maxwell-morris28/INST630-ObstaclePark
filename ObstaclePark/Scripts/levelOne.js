import * as THREE from "three";

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
const material = new THREE.MeshBasicMaterial( {color: 0xFF6347});
const player = new THREE.InstancedMesh(geometry, material, 1);

//Add player to the scene
scene.add(player);
player.translateY(2);

//Create and add the Ground
const groundTexture = new THREE.TextureLoader().load('pexels-pixabay-69927.jpg');
const plane = new THREE.PlaneGeometry(100, 500);
const ground_color = new THREE.MeshBasicMaterial( {map: groundTexture});
const ground = new THREE.Mesh(plane, ground_color);
scene.add(ground);

//Level Obstacles

//base box obstacle
const obstacle = new THREE.BoxGeometry(10,10, 3);
const obstacleMaterial = new THREE.MeshBasicMaterial( {color: 0xFF6347});

//Created instances of box obstacles that are positively and negatively positioned, respectively
const boxObstacleOne = new THREE.InstancedMesh(obstacle, obstacleMaterial, 30);
boxObstacleOne.position.y +=2;

const boxObstacleTwo = new THREE.InstancedMesh(obstacle, obstacleMaterial, 30);
boxObstacleTwo.position.x += 10;
boxObstacleTwo.position.y +=2;

//Create hitbox for player bound to its mesh
const playerBox = new THREE.Box3().setFromObject(player);
player.geometry.computeBoundingBox();
const obstacleBox = new THREE.Box3().setFromObject(boxObstacleOne);
boxObstacleOne.geometry.computeBoundingBox();
const obstacleBoxTwo = new THREE.Box3().setFromObject(boxObstacleTwo);
boxObstacleTwo.geometry.computeBoundingBox();


//Empty array to hold each obstacle
const obstacleList = [];
//obstacleList.push(boxObstacleOne);
//obstacleList.push(boxObstacleTwo);

scene.add(boxObstacleOne);
scene.add(boxObstacleTwo);

boxObstacleOne.position.z -= 20;
boxObstacleTwo.position.z -=20

//boxObstacleOne.position.x += 30;


//Create multiple objects with the properties of the instanced meshes to serve as obstacles
const dummy = new THREE.Object3D();
const dummyTwo = new THREE.Object3D();

for(let i=0; i<0; i++) {
    //dummy.position.y +=1;
    dummy.position.x = Math.random() * 50;
    dummy.position.z = Math.random() * -220;

    dummy.updateMatrix();
    boxObstacleOne.setMatrixAt(i, dummy.matrix);
    //obstacleList.push(boxObstacleOne);

}

for(let i=0; i<1; i++) {
    //dummy.position.y +=1;
    dummyTwo.position.x = Math.random() * -50;
    dummyTwo.position.z = Math.random() * -220;

    dummyTwo.updateMatrix();
    boxObstacleTwo.setMatrixAt(i, dummyTwo.matrix);
    //obstacleList.push(boxObstacleTwo);

}

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
    player.position.z -= 1;
    
    canvas.height=window.innerHeight;
    canvas.width=window.innerWidth;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    playerBox.copy( player.geometry.boundingBox ).applyMatrix4( player.matrixWorld );
    obstacleBox.copy( boxObstacleOne.geometry.boundingBox ).applyMatrix4( boxObstacleOne.matrixWorld );
    obstacleBoxTwo.copy( boxObstacleTwo.geometry.boundingBox ).applyMatrix4( boxObstacleTwo.matrixWorld );


    keyPressed();
    playerMovement();

    //Detect collision: BROKEN!!!
    if(obstacleBox.intersectsBox(playerBox) || obstacleBoxTwo.intersectsBox(playerBox)) {
        console.log("yesssssss");
    }
    else {
        console.log("nope");
    }

    //render every frame
    renderer.render(scene, camera);
}

console.log(player);

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
}
    
function playerMovement() {
    if(leftDown && player.position.x > -48) {
        player.position.x -=1.5;
    }
    else if(rightDown && player.position.x < 48) {
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
    }) 


animate();
console.log(obstacleList);

