import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// if using package manager: npm install @avaturn/sdk
import { AvaturnSDK } from "https://cdn.jsdelivr.net/npm/@avaturn/sdk/dist/index.js";

let scene, renderer, camera, stats, animationGroup;
let model, mixer, clock;
let currentAvatar;
let idleAction;

let cameraAngle = 0;  // Variable to track the current camera angle
let cameraRadius = 5;  // Radius at which the camera orbits around the player
let isUserInteracting = false;  // Track if the user is interacting with the scene
let transitionProgress = 0;  // Variable to track the smooth transition

let controls;

async function loadAvatar(url) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);
  model = gltf.scene;
  scene.add(model);

  model.traverse(function (object) {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
      object.material.envMapIntensity = 0.3;
      // Turn off mipmaps to make textures look crispier (only use if texture resolution is 1k)
      if (object.material.map && !object.material.name.includes("hair")) {
        object.material.map.generateMipmaps = false;
      }
    }
  });

  animationGroup.add(model);
  return model;
}

function filterAnimation(animation) {
  animation.tracks = animation.tracks.filter((track) => {
    const name = track.name;
    return name.endsWith("Hips.position") || name.endsWith(".quaternion");
  });
  return animation;
}

async function init() {
  const container = document.getElementById("container");

  // Init renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Init camera and controls
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(cameraRadius, 2, 0);  // Initial position of the camera
  controls.target.set(0, 1, 0);  // Target the player's center

  controls.enableDamping = true;  // Smooth camera rotation
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2;  // Prevent looking below the ground

  // Add zoom limits
  controls.minDistance = 2; // Minimum zoom distance (prevents over-zooming in)
  controls.maxDistance = 10; // Maximum zoom distance (prevents over-zooming out)

  controls.update();

  // Listen for mouse or touch interactions to pause automatic rotation
  controls.addEventListener("start", function () {
    isUserInteracting = true;  // User is interacting with the camera
    transitionProgress = 0;    // Reset transition progress
  });

  controls.addEventListener("end", function () {
    isUserInteracting = false;  // User interaction ended, start transitioning back
  });

  clock = new THREE.Clock();
  animationGroup = new THREE.AnimationObjectGroup();
  mixer = new THREE.AnimationMixer(animationGroup);

  // Init scene
  scene = new THREE.Scene();

  // Add the custom image as background
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("https://img.freepik.com/premium-photo/landscape-simple-illustration_905829-2768.jpg", function (texture) {
    scene.background = texture; // Set the image as background
  });

  // Init lighting
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(3, 3, 5);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  dirLight.shadow.bias = -0.001;
  dirLight.intensity = 3;
  scene.add(dirLight);

  // Load environment map (optional)
  new RGBELoader().load("public/brown_photostudio_01.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  });

  // Create ground plane with a new color
  const groundColor = 0x006400;  // Dark green ground
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: groundColor, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // Load default avatar
  currentAvatar = await loadAvatar("public/default_model.glb");

  // Load default animation
  const loader = new GLTFLoader();
  loader.load("public/animation.glb", function (gltf) {
    const clip = filterAnimation(gltf.animations[0]);
    const action = mixer.clipAction(clip);
    idleAction = action;
    idleAction.play();
  });

  stats = new Stats();
  container.appendChild(stats.dom);

  window.addEventListener("resize", onWindowResize);
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  // Render loop
  requestAnimationFrame(animate);

  let mixerUpdateDelta = clock.getDelta();
  mixer.update(mixerUpdateDelta);

  // Calculate automatic camera position
  cameraAngle += 0.002;  // Slower rotation speed
  const targetX = Math.sin(cameraAngle) * cameraRadius;
  const targetZ = Math.cos(cameraAngle) * cameraRadius;

  // Check if the user is not interacting; if so, smoothly transition back to the automatic rotation
  if (!isUserInteracting) {
    transitionProgress = Math.min(transitionProgress + 0.005, 1);  // Increment progress smoothly
    const currentX = camera.position.x;
    const currentZ = camera.position.z;

    // Smoothly interpolate between the current position and the target position
    camera.position.x = THREE.MathUtils.lerp(currentX, targetX, transitionProgress);
    camera.position.z = THREE.MathUtils.lerp(currentZ, targetZ, transitionProgress);
    camera.lookAt(new THREE.Vector3(0, 1, 0));  // Always look at the player's position
  }

  stats.update();
  controls.update();  // Make sure damping is applied even when not rotating
  renderer.render(scene, camera);
}

function openIframe() {
  initAvaturn();
  document.querySelector("#avaturn-sdk-container").hidden = false;
  document.querySelector("#buttonOpen").disabled = true;
}

function closeIframe() {
  document.querySelector("#avaturn-sdk-container").hidden = true;
  document.querySelector("#buttonOpen").disabled = false;
}

function initAvaturn() {
  const container = document.getElementById("avaturn-sdk-container");

  const subdomain = "demo";
  const url = `https://${subdomain}.avaturn.dev`;

  const sdk = new AvaturnSDK();
  sdk.init(container, { url }).then(() => {
    sdk.on("export", (data) => {
      const modelUrl = data.url;
      console.log("Exported model URL:", modelUrl);
      localStorage.setItem("avatarModelUrl", modelUrl);

      loadAvatar(modelUrl).then((model) => {
        currentAvatar.visible = false;
        currentAvatar.removeFromParent();
        animationGroup.uncache(currentAvatar);
        animationGroup.remove(currentAvatar);

        currentAvatar = model;
      });
      closeIframe();
    });
  });
}

await init();
closeIframe();
document.querySelector("#buttonOpen").addEventListener("click", openIframe);
document.querySelector("#buttonClose").addEventListener("click", closeIframe);
