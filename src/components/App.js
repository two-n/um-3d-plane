import *  as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js' // library for position tweening
import oc from 'three-orbit-controls'

// lib
import { brands, images, dimensions, height, width, pDims, axisLabels } from "../globals/constants"
import * as optimer from '../assets/fonts/Gotham_Medium_Regular.typeface.json'


export default class App {
  constructor(){}
  init(){
    // instantiate orbit controls (allows user to interact and rotate graph)
   const OrbitControls = oc(THREE)

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

   // ADD SHAPES

   // SIMPLE GRID
   const { x, y, z, w, h, d } = pDims
   const gridHelper = new THREE.GridHelper(10, 2, '#FF00FF'); // creates the center lines
   gridHelper.position.set(x + w / 2, y + 13, z + d / 2);
   gridHelper.scale.set(w / 10, h / 2, d / 10);

   // add grid
   scene.add(gridHelper);

  // CHECKERBOARD
  // ref: https://syntaxbytetutorials.com/three-js-orbit-controls-zoom-pan-rotate/

  // instantiate square geometry and material
   const square = new THREE.BoxGeometry(1, 5, 1);
   const lightsquare = new THREE.MeshBasicMaterial( { color: 0xE0C4A8} );
   const darksquare = new THREE.MeshBasicMaterial( { color: 0x6A4236 });

   // create board
   var board = new THREE.Group();

   // create 10 x 10 board
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

   // position board over grid
   board.position.set(x + w / 20, y, z + d / 20);
   board.scale.set(w / 10, h / 2, d / 10);

   // add board to scene
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


    // DRAW SPHERES, LINES and LABELS

    brands.forEach(({coordinates, color, name}) => {
      // config
      const { year_one, year_two } = coordinates
      const { x, y, z } = year_one
      const {x: x1, y: y1, z: z1 } = year_two

      // placeholder spheres
      const sphereGrey = new THREE.Mesh(
        geometry,
        greyMaterial
      );
      sphereGrey.position.set(x, y, z)
      scene.add(sphereGrey)

      // moving brand spheres
      const brandMaterial = new THREE.MeshPhongMaterial({ color })
      const sphereBrand = new THREE.Mesh(
        geometry,
        brandMaterial
      );

      sphereBrand.position.set(x, y, z)
      sphereBrand.userData.name = name
      sphereBrand.userData.clicked = false
      scene.add(sphereBrand)

      // sphere image labels
      const imageBrand = images[name]
      const imageTexture = new THREE.TextureLoader().load(imageBrand);

      //draw image container for logos
      const planeGeometry = new THREE.PlaneGeometry( 100, 100 );
      const planeMaterial = new THREE.MeshBasicMaterial({ map: imageTexture, transparent: true});
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = 100
      sphereBrand.add(plane);

      // lines
      const points = [];

      points.push( new THREE.Vector3( x, y, z ) );
      points.push( new THREE.Vector3( x1, y1, z1) );
      const lGeometry = new THREE.BufferGeometry().setFromPoints( points );
      const line = new THREE.Line( lGeometry, lMaterial );
      scene.add( line );
    })

      // TEXT LOADER
      const font = new THREE.FontLoader().parse(optimer)

      const fontConfig = {
        font: font,
        size: 20,
        height: 1,
      }

    // create axis labels
    axisLabels.forEach(({label, coordinates}) => {
      const { x, y, z } = coordinates
      const textGeometry = new THREE.TextGeometry(label, fontConfig);
      const textMaterial =  new THREE.MeshBasicMaterial({color: 000000})
      const textMesh = new THREE.Mesh(textGeometry, textMaterial)
      textMesh.position.set(x, y, z)
      scene.add(textMesh)
    })

    // LIGHTING

    // add ambient light
    let hemiLight = new THREE.AmbientLight(0xffffff, 0.50)
    scene.add(hemiLight)

    // add direct light to give 3D effect to spheres
    let dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(10, 2000, -30)
    scene.add(dirLight)
    // dirLight.castShadow = true

    // USER CONTROLS
     const controls =  new OrbitControls(camera, renderer.domElement)
     // disable panning
     controls.screenSpacePanning = false;
     controls.enablePanning = false;
     // restrict rotation
     controls.maxPolarAngle = Math.PI / 2.8;
     controls.minPolarAngle = Math.PI / 5;
     controls.minDistance = 500;
     controls.maxDistance = 1500;
     controls.minAzimuthAngle = -Math.PI / 5;
     controls.maxAzimuthAngle = Math.PI / 5;


    // TWEENING

    // translate positions
    function moveNodes(sphere, target){
      // instantiate tween using tween library
      var tween = new TWEEN.Tween(sphere.position).easing(TWEEN.Easing.Sinusoidal.InOut)
      // reverse sphere's clicked data
      sphere.userData.clicked = !sphere.userData.clicked
      // requestAnimationFrame(animate)
      // move sphere to target on a 2000ms duration
      tween.to(target, 2000)
      tween.start()
    }

    // CLICK EVENTS

    var cameraOrtho =  new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 1, 10);
      cameraOrtho.position.z = 10;

    // raycaster allows us to detect mouse intersects
    var raycaster = new THREE.Raycaster()
    var mouse = ({
      screen: new THREE.Vector2(),
      scene: new THREE.Vector2(),
      animating: false,
      focus: null
    })

    // handle click
    var handleClick = (e) => {
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
      // find all elements being intersected by mouse
      const intersects = raycaster.intersectObjects(scene.children);
      // if the number of intersected objects is greater than one, select the last one
      // this selects the colored sphere which is superimposed over the greyed out spheres
      const index = intersects.length > 1 ? 1 : 0
      // use the userData property to identify the sphere by name
      const objName = intersects[index].object.userData.name
      // get the correct coordinates for the sphere to travel to
      const position1 = brands.find( el => el.name === objName).coordinates.year_two
      const position0 = brands.find( el => el.name === objName).coordinates.year_one
      // adjust the target position based on the sphere's current position
      const target = intersects[index].object.userData.clicked ? position0 : position1
      // move the sphere to the target position
      // intersects[index].object is the sphere
      moveNodes(intersects[index].object, target)
    }

    // HANDLE RESIZE EVENT
    function onWindowResize(){
      camera.aspect = width / height
      camera.updateProjectionMatrix();
      renderer.setSize(width, height)
    }

    // EVENT LISTENERS
    document.body.addEventListener("click", handleClick, false); // to do: possibly remove event listener at page load?
    window.addEventListener("resize", onWindowResize)

    // ANIMATE (renders the scene)
    const animate = () => {
      TWEEN.update()
      controls.update()
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    document.body.appendChild( renderer.domElement );
  }
}