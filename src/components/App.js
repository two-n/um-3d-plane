import *  as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js' // library for position tweening
import oc from 'three-orbit-controls'

// lib
import * as optimer from '../assets/fonts/optimer_bold.typeface.json'
import * as uber from '../assets/images/uber.png'
import * as grubhub from '../assets/images/grubhub.png'
import * as doordash from '../assets/images/doordash.png'


export default class App {
  constructor(){}
  init(){
    // instantiate orbit controls (allows user to interact and rotate graph)
   const OrbitControls = oc(THREE)

   // config
   const dimensions = ({width: 954, height: 50, depth: 1060})
   const height = 1008
   const width = 900

   // CREATE SCENE
   const scene = new THREE.Scene();
   scene.position.x = -dimensions.width / 2;
   scene.position.y = dimensions.height
   scene.position.z = -dimensions.depth / 2;
   scene.background = new THREE.Color(0xffffff);

   // CREATE CAMERA
   const camera = new THREE.PerspectiveCamera(75, width/height, 0.2, 4500);
   camera.aspect = width / height;
   camera.updateProjectionMatrix();
   // position camera centered and looking down from above
   camera.position.set(0, 750, 1000);


  // CREATE RENDERER
   const renderer = new THREE.WebGLRenderer({antialias: true});
   renderer.setSize(width, height);
   renderer.setPixelRatio(window.devicePixelRatio);
   renderer.autoClear = false;

   // SHAPES

   // simple plane
   const x = 0;
   const y = -200;
   const z = 0;
   const w = 1000;
   const h = 10;
   const d = 1000;

   const gridHelper = new THREE.GridHelper(10, 10);
   gridHelper.position.set(x + w / 2, y, z + d / 2);
   gridHelper.scale.set(w / 10, h / 2, d / 10);

   // add grid
   scene.add(gridHelper);

    //draw spheres

    const geometry = new THREE.SphereGeometry(15, 32, 16);

    // skin for greyed out spheres
    const greyMaterial = new THREE.MeshPhongMaterial({ color: "rgb(220,220,220)"})

    const sphere2 = new THREE.Mesh(
      geometry,
      greyMaterial
    );

    // [1, 2, 3].forEach( (num) => console.log(num))

    // [{x: 150, y: -180, z: 750}, {x: 300, y: -180, z: 900},  {x: 50, y: -180, z: 800}].forEach(num => {
    //     const greySphere = new THREE.Mesh(
    //       geometry,
    //       greyMaterial
    //     );
    //     scene.add(greySphere)
    //     greySphere.position(num.x, num.y, num.z)
    // })
    //  const sphere2 = new THREE.Mesh(
    //    geometry,
    //    greyMaterial
    //  );

     sphere2.position.set(150, -180, 750);

     const sphere3 = new THREE.Mesh(
       geometry,
       greyMaterial
     );

     scene.add(sphere2)

     sphere3.position.set(300, -180, 900);
     scene.add(sphere3)

     const sphere4 = new THREE.Mesh(
       geometry,
       greyMaterial
     );

     sphere4.position.set(50, -180, 800);

     scene.add(sphere4)

     const material = new THREE.MeshPhongMaterial({ color: "rgb(255, 48, 8)" });
     const sphere = new THREE.Mesh(
       geometry,
       material
     );

     sphere.position.set(150, -180, 750);

     scene.add(sphere);

     const sphereUber = new THREE.Mesh(
       geometry,
       new THREE.MeshPhongMaterial({ color: "rgb(63, 192, 96)" })
     );

     sphereUber.position.set(50, -180, 800);

     scene.add(sphereUber);

     const sphereGrub = new THREE.Mesh(
       geometry,
       new THREE.MeshPhongMaterial({ color: "rgb(246, 52, 63)" })
     );

     sphereGrub.position.set(300, -180, 900);

     scene.add(sphereGrub)

      // TEXT LOADER
      const font = new THREE.FontLoader().parse(optimer)
      console.log(font)

      const fontConfig = {
        font: font,
        size: 20,
        height: 1,
      }

      // add text to spheres
      const geometryDoor = new THREE.TextGeometry('DoorDash', fontConfig);
      const geometryGrub = new THREE.TextGeometry('GrubHub', fontConfig);
      const geometryUber = new THREE.TextGeometry('UberEats', fontConfig);
      const geometryGP = new THREE.TextGeometry('GROW & PROTECT', fontConfig);
      const geometryPB = new THREE.TextGeometry('POWER BRAND', fontConfig);
      const geometryGK = new THREE.TextGeometry('GET KNOWN', fontConfig);
      const geometryR = new THREE.TextGeometry('REINVIGORATE', fontConfig);



      const textMeshDoor = new THREE.Mesh(geometryDoor, new THREE.MeshBasicMaterial({color: 0xFF0000}));
      const textMeshGrub = new THREE.Mesh(geometryGrub, new THREE.MeshBasicMaterial({color: "rgb(246, 52, 63)"}));
      const textMeshUber = new THREE.Mesh(geometryUber, new THREE.MeshBasicMaterial({color: "rgb(63, 192, 96)"}));
      textMeshDoor.position.set(0, 35, 0);
      textMeshGrub.position.set(0, 35, 0);
      textMeshUber.position.set(0, 35, 0)

      // sphere.add(textMeshDoor)
      // sphereGrub.add(textMeshGrub)
      // sphereUber.add(textMeshUber)

    // axis labels
     const textMeshGP = new THREE.Mesh(geometryGP, new THREE.MeshBasicMaterial({color: 000000}))
     textMeshGP.position.set(0, -160, 0)
     const textMeshPB = new THREE.Mesh(geometryPB, new THREE.MeshBasicMaterial({color: 000000}))
     textMeshPB.position.set(800, -160, 0)
     const textMeshGK = new THREE.Mesh(geometryGK, new THREE.MeshBasicMaterial({color: 000000}))
     textMeshGK.position.set(10, -160, 1050)
     const textMeshR = new THREE.Mesh(geometryR, new THREE.MeshBasicMaterial({color: 000000}))
     textMeshR.position.set(800, -160, 1050)
    scene.add(textMeshGP)
    scene.add(textMeshPB)
    scene.add(textMeshGK)
    scene.add(textMeshR)

    // LIGHTING

    // add ambient light
    let hemiLight = new THREE.AmbientLight(0xffffff, 0.50)
    scene.add(hemiLight)

    // // add direct light to cast shadow
    let dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(10, 2000, -30)
    scene.add(dirLight)
    // dirLight.castShadow = true

    // USER CONTROLS
     const controls =  new OrbitControls(camera, renderer.domElement)
     controls.screenSpacePanning = false;
     // restrict rotation
     controls.maxPolarAngle = Math.PI / 2.5;
     controls.minPolarAngle = Math.PI / 5;
     controls.minDistance = 500;
     controls.maxDistance = 1500;
     controls.minAzimuthAngle = -Math.PI / 5;
     controls.maxAzimuthAngle = Math.PI / 5;
     controls.update()

    // IMAGES
    const UTexture = new THREE.TextureLoader().load(uber);
    const GTexture = new THREE.TextureLoader().load(grubhub);
    const DTexture = new THREE.TextureLoader().load(doordash);


    //draw image container for logos
    const planeGeometry = new THREE.PlaneGeometry( 100, 100 );
    //const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    const UplaneMaterial = new THREE.MeshBasicMaterial({ map: UTexture, transparent: true});
    const Uplane = new THREE.Mesh(planeGeometry, UplaneMaterial);
      Uplane.position.y = 100

    sphereUber.add(Uplane);

    const GplaneMaterial = new THREE.MeshBasicMaterial({ map: GTexture, transparent: true});
    const Gplane = new THREE.Mesh(planeGeometry, GplaneMaterial);
      Gplane.position.y = 100
      sphereGrub.add(Gplane);

    const DplaneMaterial = new THREE.MeshBasicMaterial({ map: DTexture, transparent: true});
    const Dplane = new THREE.Mesh(planeGeometry, DplaneMaterial);
      Dplane.position.y = 100
      sphere.add(Dplane);


    // TWEENING

    // define tween for each sphere

    // respond to click events
    const button = document.getElementById("change")
    button.addEventListener("click", () => {
    moveNodes()
    })

     var tween = new TWEEN.Tween(sphere.position).easing(TWEEN.Easing.Sinusoidal.InOut)
     var tween2 = new TWEEN.Tween(sphereGrub.position).easing(TWEEN.Easing.Sinusoidal.InOut)
     var tween3 = new TWEEN.Tween(sphereUber.position).easing(TWEEN.Easing.Sinusoidal.InOut)

     var target;
     var target2;
     var target3;
     var state = true;

     // translate positions
     function moveNodes(){
      if(state){
        target = {x: 600, y: -180, z: 150}
        target2 = {x: 900, y: -180, z: 300}
        target3 = {x: 800, y: -180, z: 50}
        state = false
      }else{
        target = {x: 750, y: -180, z: 750}
        target2 = {x: 300, y: -180, z: 900}
        target3 = {x: 50, y: -180, z: 800}
        state = true
      }
      requestAnimationFrame(animate)
      tween.to(target, 2000)
      tween2.to(target2, 2000)
      tween3.to(target3, 2000)
      tween3.start()
      tween2.start()
      tween.start()
    }

    const animate = () => {
      TWEEN.update()
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    document.body.appendChild( renderer.domElement );
  }
}