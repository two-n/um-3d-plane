import *  as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js' // library for position tweening
import oc from 'three-orbit-controls'

// lib
import { brands } from "../globals/constants"
import * as optimer from '../assets/fonts/Gotham_Medium_Regular.typeface.json'
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
   const height = window.innerHeight
   const width = window.innerWidth

   // CREATE SCENE
   const scene = new THREE.Scene();
   scene.position.x = -width / 2;
   scene.position.y = height / 2
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

   // HANDLE RESIZE
   function onWindowResize(){
     camera.aspect = window.innerHeight / window.innerHeight
     camera.updateProjectionMatrix();
     renderer.setSize(window.innerWidth, window.innerHeight)
   }

   window.addEventListener("resize", onWindowResize)

   // SHAPES

   // simple plane
   const x = 0;
   const y = 0;
   const z = 0;
   const w = 1000;
   const h = 10;
   const d = 1000;

   const gridHelper = new THREE.GridHelper(10, 2, '#FF00FF');
   gridHelper.position.set(x + w / 2, y + 13, z + d / 2);
   gridHelper.scale.set(w / 10, h / 2, d / 10);

   // add grid
   scene.add(gridHelper);

  // Checkerboard
  // ref: https://syntaxbytetutorials.com/three-js-orbit-controls-zoom-pan-rotate/

   const square = new THREE.BoxGeometry(1, 5, 1);
   const lightsquare = new THREE.MeshBasicMaterial( { color: 0xE0C4A8} );
   const darksquare = new THREE.MeshBasicMaterial( { color: 0x6A4236 });

   var board = new THREE.Group();

   let squareNumber = 1;
   for (let x = 0; x < 10; x++) {
     for (let z = 0; z < 10; z++) {
       let cube;
       if (z % 2 == 0) {
         cube = new THREE.Mesh(square, x % 2 == 0 ? lightsquare : darksquare);
         if (x % 2 != 0) {
           cube.userData.squareNumber = squareNumber;
           squareNumber++;
         }
       } else {
         cube = new THREE.Mesh(square, x % 2 == 0 ? darksquare : lightsquare);
         if (x % 2 == 0) {
           cube.userData.squareNumber = squareNumber;
           squareNumber++;
         }
       }

       cube.position.set(x, 0, z);
       board.add(cube);
     }
   }

   board.position.set(x + w / 20, y, z + d / 20);
   board.scale.set(w / 10, h / 2, d / 10);



   scene.add(board);

    //draw spheres

    const geometry = new THREE.SphereGeometry(15, 32, 16);

    // skin for greyed out spheres
    const greyMaterial = new THREE.MeshPhongMaterial({ color: "rgb(220,220,220)"})


  const lMaterial = new THREE.LineDashedMaterial( {
    color: 0xffff,
    linewidth: 1,
    linecap: 'round', //ignored by WebGLRenderer
    linejoin:  'round', //ignored by WebGLRenderer
  } );



    brands.forEach(({coordinates, color}) => {
      // placeholder spheres
      const sphereGrey = new THREE.Mesh(
        geometry,
        greyMaterial
      );

      const { year_one, year_two } = coordinates
      const { x, y, z } = year_one
      const {x: x1, y: y1, z: z1 } = year_two
      sphereGrey.position.set(x, y, z)
      scene.add(sphereGrey)

      // moving brand spheres // TODO: figure out how to dynamically select them (possibly do all logic in here?)
      // const brandMaterial = new THREE.MeshPhongMaterial({ color })

      // const sphereBrand = new THREE.Mesh(
      //   geometry,
      //   brandMaterial
      // );
      // sphereBrand.position.set(x, y, z)
      // scene.add(sphereBrand)

      // lines
      const points = [];

      points.push( new THREE.Vector3( x, y, z ) );
      // points.push( new THREE.Vector3( 700, 20, 0 ) );
      points.push( new THREE.Vector3( x1, y1, z1) );

      const lGeometry = new THREE.BufferGeometry().setFromPoints( points );

      const line = new THREE.Line( lGeometry, lMaterial );

      scene.add( line );
    })

     const material = new THREE.MeshPhongMaterial({ color: "rgb(255, 48, 8)" });
     const sphere = new THREE.Mesh(
       geometry,
       material
     );

     sphere.position.set(150, 60, 750);
     sphere.userData.name = "A"
     sphere.userData.clicked = false
     console.log(sphere)

     scene.add(sphere);

     console.log(sphere.userData.name)

     const sphereUber = new THREE.Mesh(
       geometry,
       new THREE.MeshPhongMaterial({ color: "rgb(63, 192, 96)" })
     );

     sphereUber.position.set(50, 60, 800);
     sphereUber.userData.name = "B"
     sphereUber.userData.clicked = false

     scene.add(sphereUber);

     const sphereGrub = new THREE.Mesh(
       geometry,
       new THREE.MeshPhongMaterial({ color: "rgb(246, 52, 63)" })
     );


     sphereGrub.position.set(300, 60, 900);

     sphereGrub.userData.name = "C"
     sphereGrub.userData.clicked = false

     scene.add(sphereGrub)

      // TEXT LOADER
      const font = new THREE.FontLoader().parse(optimer)

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
     textMeshGP.position.set(0, 80, 0)
     const textMeshPB = new THREE.Mesh(geometryPB, new THREE.MeshBasicMaterial({color: 000000}))
     textMeshPB.position.set(800, 80, 0)
     const textMeshGK = new THREE.Mesh(geometryGK, new THREE.MeshBasicMaterial({color: 000000}))
     textMeshGK.position.set(10, 80, 1050)
     const textMeshR = new THREE.Mesh(geometryR, new THREE.MeshBasicMaterial({color: 000000}))
     textMeshR.position.set(800, 80, 1050)
    scene.add(textMeshGP)
    scene.add(textMeshPB)
    scene.add(textMeshGK)
    scene.add(textMeshR)

    // lines

//   const lMaterial = new THREE.LineBasicMaterial( {
// 	color: 0000000,
// 	linewidth: 1,
// 	linecap: 'round', //ignored by WebGLRenderer
// 	linejoin:  'round' //ignored by WebGLRenderer
// } );

//   const points = [];
// points.push( new THREE.Vector3( 150, 20, 750 ) );
// // points.push( new THREE.Vector3( 700, 20, 0 ) );
// points.push( new THREE.Vector3( 750, 20, 150) );

// const lGeometry = new THREE.BufferGeometry().setFromPoints( points );

// const line = new THREE.Line( lGeometry, lMaterial );

// scene.add( line );


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
     controls.enablePanning = false;
     // restrict rotation
     controls.maxPolarAngle = Math.PI / 2.8;
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

    // var toggleOn = false
    // // respond to click events
    // const button = document.getElementById("change")
    // button.addEventListener("click", () => {
    // moveNodes()


    // brands.forEach(({coordinates, color, name}) => {


    //   const { year_one, year_two } = coordinates
    //   const { x, y, z } = year_one
    //   const {x: x1, y: y1, z: z1 } = year_two

    //   // lines
    //   const points = [];
    //   scene.remove(name)
    //   if (toggleOn) {
    //   points.push( new THREE.Vector3( x, y, z ) );
    //   // points.push( new THREE.Vector3( 700, 20, 0 ) );
    //   points.push( new THREE.Vector3( x1, y1, z1) );
    //   }
    //   const lGeometry = new THREE.BufferGeometry().setFromPoints( points );

    //   const line = new THREE.Line( lGeometry, lMaterial );
    //   line.name = name

    //   scene.add( line );
    // })
    // })

     var tween = new TWEEN.Tween(sphere.position).easing(TWEEN.Easing.Sinusoidal.InOut)
     var tween2 = new TWEEN.Tween(sphereGrub.position).easing(TWEEN.Easing.Sinusoidal.InOut)
     var tween3 = new TWEEN.Tween(sphereUber.position).easing(TWEEN.Easing.Sinusoidal.InOut)

     var target;
     var target2;
     var target3;
     var state = true;

    // translate positions
    function moveNodes(sphere, target){
      var tween = new TWEEN.Tween(sphere.position).easing(TWEEN.Easing.Sinusoidal.InOut)
      sphere.userData.clicked = !sphere.userData.clicked
      requestAnimationFrame(animate)
      tween.to(target, 2000)
      tween.start()
    }

    const animate = () => {
      TWEEN.update()
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };


    // click

    var cameraOrtho =  new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 1, 10);
      cameraOrtho.position.z = 10;

    var raycaster = new THREE.Raycaster()
    var mouse = ({
      screen: new THREE.Vector2(),
      scene: new THREE.Vector2(),
      animating: false,
      focus: null
    })

    var trackMouse = (e) => {
      console.log('tracking mouse')
      e.preventDefault();
      if (e.target instanceof HTMLCanvasElement) {
        const x = e.offsetX + e.target.offsetLeft;
        const y = e.offsetY + e.target.offsetTop;
        mouse.screen.x = x;
        mouse.screen.y = y;
        mouse.scene.x = (e.offsetX / width) * 2 - 1;
        mouse.scene.y = -(e.offsetY / height) * 2 + 1;
        if (!mouse.animating) intersect();
      }
    }

   var intersect = () => {
      camera.updateMatrixWorld();
      cameraOrtho.updateMatrixWorld();
      raycaster.setFromCamera(mouse.scene, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      const index = intersects.length > 1 ? 1 : 0
      const objName = intersects[index].object.userData.name
      const position1 = brands.find( el => el.name === objName).coordinates.year_two
      const position0 = brands.find( el => el.name === objName).coordinates.year_one
      const target = intersects[index].object.userData.clicked ? position0 : position1
      moveNodes(intersects[index].object, target)

    }

    document.body.addEventListener("click", trackMouse, false);
    animate();

    document.body.appendChild( renderer.domElement );
  }
}