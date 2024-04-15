import * as THREE from "three";
import { LoadGLTFByPath } from "./Helpers/ModelHelper.js";
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { InteractionManager } from "../../node_modules/three.interactive/build/three.interactive.js";
import * as TWEEN from "../../node_modules/@tweenjs/tween.js/dist/tween.esm.js";
import * as REACT from "../../node_modules/react/umd/react.development.js";
//Renderer does the job of rendering the graphics
let renderer = new THREE.WebGLRenderer({
  //Defines the canvas component in the DOM that will be used
  canvas: document.querySelector("#background"),
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

//set up the renderer with the default settings for threejs.org/editor - revision r153
renderer.shadows = true;
renderer.shadowType = 1;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = 0;
renderer.toneMappingExposure = 1;
renderer.useLegacyLights = false;
renderer.toneMapping = THREE.NoToneMapping;
renderer.setClearColor(0xffffff, 0);
//make sure three/build/three.module.js is over r152 or this feature is not available.
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();

let cameraList = [];

let camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

// Load the GLTF model
LoadGLTFByPath(scene)
  .then(() => {
    retrieveListOfCameras(scene);
  })
  .catch((error) => {
    console.error("Error loading JSON scene:", error);
  });

//animate function
const animate = (t) => {
  controls.update();
  renderer.render(scene, camera);
  interactionManager.update();
  TWEEN.update(t);
  requestAnimationFrame(animate);
  //console.log(camera.position)
};

camera.position.set(300, 150, 80);
let controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.rotateSpeed = 0.4;
controls.maxDistance = 23;
controls.target = new THREE.Vector3(-5.5, 1, -1.3);
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.2;
controls.autoRotateSpeed *=-1;
//retrieve list of all cameras
function retrieveListOfCameras(scene) {
  // Get a list of all cameras in the scene
  scene.traverse(function (object) {
    if (object.isCamera) {
      cameraList.push(object);
    }
  });

  updateCameraAspect(camera);
  controls.update();

  // Start the animation loop after the model and cameras are loaded
}

//Set the camera to the first value in the list of cameras
// Set the camera aspect ratio to match the browser window dimensions
function updateCameraAspect(camera) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function createCube({ color, x, y, z }) {
  const geometry = new THREE.PlaneGeometry();
  const material = new THREE.MeshLambertMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z);

  return cube;
}

function createRect({ color, x, y, z }) {
  const geometry = new THREE.BoxGeometry(1.5, 2, 1);
  const material = new THREE.MeshLambertMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z);

  return cube;
}
function createCard({ color, x, y, z }) {
  const geometry = new THREE.BoxGeometry(.8, .6, .8);
  const material = new THREE.MeshLambertMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z);

  return cube;
}

//create resume sign geometry
let sign = createRect({ color: 0x0065d9, x: -3, y: 1, z: -2.85 });
sign.rotateY(90);
sign.visible = false;
scene.add(sign);
const signPosition = new THREE.Vector3(-1.88, 1, -3.89);

//create vendin machine geometry
let vending = createRect({ color: 0x0065d9, x: -4.4, y: 1.3, z: 2.9 });
vending.visible = false;
scene.add(vending);
const vendingPosition = new THREE.Vector3(-4.078, 1.697, 4.73);

let newsStand = createRect({ color: 0x0065d9, x: -9.8, y: 1.2, z: .5 })
newsStand.visible = false;
scene.add(newsStand)
const newsStandPosition = new THREE.Vector3(-10.85,-1,.75)
//A method to be run each time a frame is generated
let businessCard = createCard({ color: 0x0065d9, x: -2.9, y: 1.1, z: -6 })
businessCard.visible = false;
scene.add(businessCard)
function clickedme() {
  console.log("CLICKED");
}
const businessCardPosition = new THREE.Vector3(-2.5,2.46,-5.72)
// const [cameraPosition, setCameraPosition] = REACT.useState(
//   new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z)
// )
var buttonsRevealed =0;
let allreaveled = false;
var aboutRevealed=false;
var resumeRevealed=false;
var projectsRevelased=false;
var contactRevealed = false;
const startPosition = new THREE.Vector3(300, 150, 110);
let state = 0;
// 0:home
// 1:resume
//2:projects
//3:about
//buttons 

var homebutton = document.getElementById("startbutton");
homebutton.addEventListener("click", (event) => {
  moveHome();
});

var resumeButton = document.getElementById("resume");
resumeButton.addEventListener("click", (event)=>{
 moveToSign()
})
//sample
var projectsButton = document.getElementById("projects");
projectsButton.addEventListener("click",(event)=>{
  moveToVending()

})

var aboutButton = document.getElementById("about");
aboutButton.addEventListener("click", (event)=>{
 moveToNews();
})

var contactButton = document.getElementById("contact");
contactButton.addEventListener("click",(event)=>{
  moveToBusinessCard();
})

var revealButton = document.getElementById("reveal")
revealButton.addEventListener("click",(event)=>{
  allreaveled=true;
  aboutButton.style.display="block"
resumeButton.style.display="block"
projectsButton.style.display="block"
contactButton.style.display="block"
revealButton.style.display="none"
})
const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);
sign.addEventListener("click", (event) => {
  if(!resumeRevealed){
    buttonsRevealed++;
    resumeRevealed=true;
  }
  moveToSign();
  resumeButton.style.display = "block"

  if (buttonsRevealed>=4){
    revealButton.style.display="none";
  }
});

vending.addEventListener("click", (event) => {
  if(!projectsRevelased){
    buttonsRevealed++;
    projectsRevelased=true;
  }
  moveToVending();
  projectsButton.style.display = "block"
  if (buttonsRevealed>=4){
    revealButton.style.display="none";
  }
});
newsStand.addEventListener("click",(event)=>{
  
  if(!aboutRevealed){
    buttonsRevealed++;
    aboutRevealed = true;
  }
  moveToNews()
});
businessCard.addEventListener("click", (event)=>{
  if(!contactRevealed){
    buttonsRevealed++;
    contactRevealed = true;
  }
  moveToBusinessCard();
});

  contactButton.style.display = "block";

function moveToNews(){
  if (state!=3){
  toggleAllOff();
  controls.enableRotate=false
   if (state==1){
    moveToNewsFromStand();
  }
  else if (state==2 || state==0){
    console.log("D")
    moveToNewsFromVending()
    aboutButton.style.display = "block"
  }
  else{
   controls.autoRotateSpeed=0;
  new TWEEN.Tween(camera.position)
    .to(newsStandPosition, 1000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate((coords) => {
      camera.position.set(coords.x, coords.y, coords.z);
    })
    .start(); 
  }
    aboutButton.style.display = "block"
    state=3
}
}
function moveToBusinessCard(){
  controls.enableRotate=false
  controls.autoRotateSpeed=0
  toggleAllOff();
  contactButton.style.display = "block"
  controls.target = new THREE.Vector3(-3,.8,-6)
  new TWEEN.Tween(camera.position)
    .to(businessCardPosition, 1000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate((coords) => {
      camera.position.set(coords.x, coords.y, coords.z);
    })
    .start(); 
    state = 4;
    if (buttonsRevealed>=4){
      revealButton.style.display="none";
    }
    
    
}
function moveToSign(){
  toggleAllOff();
  controls.enableRotate=false
  if (state==2){
    moveToSignFromVending();
  }
  else if (state==3){

  }
  else{
  console.log("sign was clicked");
  controls.autoRotateSpeed = 0;
  console.log(camera.position);
  console.log(signPosition);
  new TWEEN.Tween(camera.position)
    .to(signPosition, 1000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate((coords) => {
      camera.position.set(coords.x, coords.y, coords.z);
    })
    .start();
    
}state=1

}
function moveToSignFromVending(){
  const i = new THREE.Vector3(-14.32,2.02,6.975)
  console.log("Vending clicked");
  controls.autoRotateSpeed=0;
  new TWEEN.Tween(camera.position)
    .to(startPosition, 1000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate((coords) => {
      camera.position.set(coords.x, coords.y, coords.z);
    }).chain(new TWEEN.Tween(camera.position)
    .to(signPosition, 1000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate((coords) => {
      camera.position.set(coords.x, coords.y, coords.z);
    }))
    .start();
}
function moveToVendingFromNews(){
  

   const i = new THREE.Vector3(-14.32,2.02,6.975)
  console.log("Vending clicked");
  controls.autoRotateSpeed=0;
  new TWEEN.Tween(camera.position)
    .to(i, 1000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate((coords) => {
      camera.position.set(coords.x, coords.y, coords.z);
    }).chain(new TWEEN.Tween(camera.position)
    .to(vendingPosition, 1000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate((coords) => {
      camera.position.set(coords.x, coords.y, coords.z);
    }))
    .start();
    state=2;
  
}
function moveToNewsFromVending(){
  while(moving);
  const i = new THREE.Vector3(-14.32,2.02,6.975)
 console.log("Vending clicked");
 controls.autoRotateSpeed=0;
 new TWEEN.Tween(camera.position)
   .to(i, 1000)
   .easing(TWEEN.Easing.Linear.None)
   .onUpdate((coords) => {
     camera.position.set(coords.x, coords.y, coords.z);
   }).chain(new TWEEN.Tween(camera.position)
   .to(newsStandPosition, 1000)
   .easing(TWEEN.Easing.Linear.None)
   .onUpdate((coords) => {
     camera.position.set(coords.x, coords.y, coords.z);
   }))
   .start();
   state=3;
}
function moveToNewsFromStand(){
  const i = new THREE.Vector3(-14.32,2.02,6.975)
  new TWEEN.Tween(camera.position)
   .to(startPosition, 1000)
   .easing(TWEEN.Easing.Linear.None)
   .onUpdate((coords) => {
     camera.position.set(coords.x, coords.y, coords.z);
   }).chain(new TWEEN.Tween(camera.position)
   .to(i, 1000)
   .easing(TWEEN.Easing.Linear.None)
   .onUpdate((coords) => {
     camera.position.set(coords.x, coords.y, coords.z);
   }).chain(new TWEEN.Tween(camera.position)
   .to(newsStandPosition, 1000)
   .easing(TWEEN.Easing.Linear.None)
   .onUpdate((coords) => {
     camera.position.set(coords.x, coords.y, coords.z);
   }))).start();
}

function moveToVendingFromStand(){
  while(moving);
   const i = new THREE.Vector3(18.1,8.4,2.27)
  console.log("Vending clicked");
  controls.autoRotateSpeed=0;
  new TWEEN.Tween(camera.position)
    .to(i, 1000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate((coords) => {
      camera.position.set(coords.x, coords.y, coords.z);
    }).chain(new TWEEN.Tween(camera.position)
    .to(vendingPosition, 1000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate((coords) => {
      camera.position.set(coords.x, coords.y, coords.z);
    }))
    .start();
    state=2;
}
function moveToVending(){
  controls.enableRotate=false
  controls.target = new THREE.Vector3(-5.5, 1, -1.3);
  if (state == 3){
    moveToVendingFromNews()
  }
  else if (state==1){
    moveToVendingFromStand();
  }
  else{
  console.log("Vending clicked");
  controls.autoRotateSpeed=0;
  new TWEEN.Tween(camera.position)
    .to(vendingPosition, 1000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate((coords) => {
      camera.position.set(coords.x, coords.y, coords.z);
    })
    .start();
  }
  state=2;
  toggleAllOff();
}
function moveHome(){
  controls.enableRotate=true
  controls.target = new THREE.Vector3(-5.5, 1, -1.3);
  controls.autoRotateSpeed=0.2
  controls.autoRotateSpeed*=-1;
  new TWEEN.Tween(camera.position)
    .to(startPosition, 1000)
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate((coords1) => {
      camera.position.set(coords1.x, coords1.y, coords1.z);
    })
    .start();
    state=0;
    toggleRevealed();
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
interactionManager.add(sign);
interactionManager.add(vending);
interactionManager.add(newsStand)
interactionManager.add(businessCard)
animate();
var moving = false;
aboutButton.style.display="none"
resumeButton.style.display="none"
projectsButton.style.display="none"
contactButton.style.display="none"
document.getElementById("emailME").style.display = "none"
document.getElementById("background").style.display = "none"
document.getElementById("startbutton").style.display = "none"
document.getElementById("reveal").style.display = "none"
document.getElementById("text").style.display = "none"
var timeout;
function loadPage() {
  timeout = setTimeout(stopLoading, 2000);
}
function stopLoading(){

  document.getElementById("background").style.display = "block"
  document.getElementById("startbutton").style.display = "block"
  document.getElementById("reveal").style.display = "block"
  document.getElementById("text").style.display = "block"
  document.getElementById("load").style.display = "none"
  document.getElementById("emailME").style.display = "block"

}
loadPage()
function toggleAllOff(){
document.getElementById("emailME").style.display = "none"
document.getElementById("reveal").style.display = "none"
aboutButton.style.display="none"
resumeButton.style.display="none"
projectsButton.style.display="none"
contactButton.style.display="none"
document.getElementById("audio").style.display = "none"
document.querySelector("audio").play();


}
function toggleRevealed(){
  document.getElementById("emailME").style.display = "block"
  if(allreaveled){
    revealButton.style.display = "none"
    aboutButton.style.display = "block"
    resumeButton.style.display= "block";
    projectsButton.style.display = "block"
    contactButton.style.display= "block"
  }
  else{
  if(aboutRevealed){
    aboutButton.style.display = "block"
  }
  if(resumeRevealed){
    resumeButton.style.display= "block";
  }
  if(projectsRevelased){
    projectsButton.style.display = "block"
  }
  if(contactRevealed){
    contactButton.style.display= "block"
  }
  if(buttonsRevealed>=4){
    revealButton.style.display = "none"
    allreaveled = true;
  }
  else {
    revealButton.style.display = "block"
  }
}
}
var controller = new Controller();
controller.bigScreenTransition()