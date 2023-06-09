import * as THREE from "three";
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


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
const materialList = [];
//const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const geometry = new THREE.IcosahedronGeometry(18, 1);
const material = new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true  });
const greenMaterial = new THREE.MeshBasicMaterial( {color: 'lightgreen', wireframe: true  });
const yellowMaterial = new THREE.MeshBasicMaterial( {color: 'yellow', wireframe: true  });
const whiteMaterial = new THREE.MeshBasicMaterial( {color: 'white', wireframe: true  });

materialList.push(greenMaterial);
materialList.push(material);
materialList.push(yellowMaterial);
materialList.push(whiteMaterial);
//const torus = new THREE.Mesh(geometry, material);
const hedron = new THREE.Mesh(geometry, material);
//hedron.material = greenMaterial;
//scene.add(torus);
scene.add(hedron);

//const controls = new OrbitControls(camera, renderer.domElement);



function animate() {
    requestAnimationFrame(animate);

    hedron.rotation.x += 0.01;
    hedron.rotation.y += 0.005;
    //hedron.rotation.z += 0.005;

    canvas.height=window.innerHeight;
    canvas.width=window.innerWidth;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //camera.position.setZ(30);

    //controls.update();
    renderer.render(scene, camera);
}

animate();



document.addEventListener('mousemove', function(e){
    let scale = -0.005;
    hedron.rotateY( e.movementX * scale );
    hedron.rotateX( e.movementY * scale ); 
    //hedron.rotation.z = 0; //this is important to keep the camera level..
})
    
//the camera rotation pivot
hedron.rotation.order = "XYZ"; //this is important to keep level, so Z should be the last axis to rotate in order...
//hedron.position.copy( mesh.position );
scene.add(hedron );

//offset the camera and add it to the pivot
//you could adapt the code so that you can 'zoom' by changing the z value in camera.position in a mousewheel event..
let cameraDistance = 1;
//camera.position.z = cameraDistance;
//hedron.add( camera );

const clientId = "c801ed81d22d414699983ae86e6677dc";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const token = await getAccessToken(clientId, code);
    const profile = await fetchProfile(token);
    console.log(profile);
    //populateUI(profile);
}

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:5173/");
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://127.0.0.1:5173/");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

//const token = 'BQDlJTy1bsCVjEWOqbOnv69CHxapqF4yesneaspv4dHpVMEAEC-FVVvM0QgahTc5Lzjr54dOoTzTMEn7mISqzDOz0cYM1gAYAaxrPIwxc0-DMkh3pxbt';
const token = await getAccessToken(clientId, code);
//console.log(token);
async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/tracks/?ids=7ovUcF5uHTBRzUpB6ZOmvt,6k0X05danQOXSBTVek5DU1,14Bcv6siTBPw3TlP84dasC,3PXmiB8Htr95ccAdKyIsyR,6EO56btPzDF3LUrfwlXi2j", 
    {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

const profile = await fetchProfile(token);
const trackList = [];
for(let i=0; i<5; i++) {
    trackList.push(profile["tracks"][i]);
    console.log(trackList[i]);
}
console.log(`list is ${trackList}`);
//const trackName = profile.name;
//const artistName = profile.artists[0]["name"];
//console.log(artistName);
/*for (let element in profile.artists[0]) {
    console.log(element);
}*/
//console.log(trackName);
//console.log(artistName);

const playing = document.querySelector('.test');
const randomNumber = Math.floor(Math.random() * 2);
const slides = document.querySelectorAll('.item');
const slidesArray = Array.from(slides);
//console.log(randomNumber);
slidesArray.forEach((slide) => {
    slide.classList.remove('visible'); // Let's remove any visibility
    slide.classList.add('hidden'); // and "add" the 'hidden' class, which sets display="none" for us in the css
  });

  slides[randomNumber].classList.add('visible');
playing.setHTML(`${trackList[randomNumber]["name"]} by ${trackList[randomNumber].artists[0]["name"]}`);
//console.log(playing);*/

const shuffleBtn = document.querySelector('#shuffle');
console.log(shuffleBtn);
shuffleBtn.addEventListener("click", function() {
    //const playing = document.querySelector('.test');
    const randomNumber = Math.floor(Math.random() * 5);
    const randomColor = Math.floor(Math.random() * 4);
    slidesArray.forEach((slide) => {
        slide.classList.remove('visible'); // Let's remove any visibility
        slide.classList.add('hidden'); // and "add" the 'hidden' class, which sets display="none" for us in the css
      });
    
      slides[randomNumber].classList.add('visible');
    //console.log(randomNumber);
    playing.setHTML(`${trackList[randomNumber]["name"]} by ${trackList[randomNumber].artists[0]["name"]}`);
    hedron.material = materialList[randomColor];
    //console.log(playing);
    //console.log('clicked!');
});




