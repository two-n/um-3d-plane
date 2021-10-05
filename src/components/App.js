import *  as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js' // library for position tweening
import oc from 'three-orbit-controls'

// lib
import * as UM_LOGO from '../assets/images/UM_Logo_Large.png'

import { images, height, width, cornerLabels, axisLabels, umColors, fontSizes } from "../globals/constants"
// import { useResponsiveSize } from '../globals/helpers'
import { brands } from "../globals/data"

import * as gotham from '../assets/fonts/Gotham_Black_Regular.json'
import * as gothamMd from '../assets/fonts/Gotham_Medium_Regular.json'

export default class App {
  constructor() { }
  init() {
    // instantiate orbit controls (allows user to interact and rotate graph)
    const OrbitControls = oc(THREE)

    // CREATE SCENE
    const scene = new THREE.Scene();
          scene.background = new THREE.Color(0xffffff);
    

    // CREATE CAMERA
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.2, 4500);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          // position camera centered and looking down from above
          camera.position.set(0, 0, 0);

    // CREATE RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(width, height);
          renderer.setPixelRatio(window.devicePixelRatio);
          renderer.autoClear = false;

    // ADD SHAPES

    // SIMPLE GRIDS

    //base grid
    const gridHelper1 = new THREE.GridHelper(10, 10, umColors.umRed, umColors.darkGrey); // creates the center lines
          gridHelper1.scale.set(100, 0, 100);
    scene.add(gridHelper1);
    //top grid
    const gridHelper2 = new THREE.GridHelper(2, 2, umColors.lightGrey, umColors.lightGrey); // creates the center lines
          gridHelper2.scale.set(500, 0, 500);
          gridHelper2.position.y = 500
    scene.add(gridHelper2);
    //bottom grid
    const gridHelper3 = new THREE.GridHelper(2, 2, umColors.lightGrey, umColors.lightGrey); // creates the center lines
          gridHelper3.scale.set(500, 0, 500);
          gridHelper3.position.y = -500
    scene.add(gridHelper3);
    //left-hand grid
    const gridHelper4 = new THREE.GridHelper(2, 2, umColors.lightGrey, umColors.lightGrey); // creates the center lines
          gridHelper4.scale.set(500, 0, 500);
          gridHelper4.position.x = -500
          gridHelper4.rotation.z = Math.PI / 2
    scene.add(gridHelper4);
    //right-hand grid
    const gridHelper5 = new THREE.GridHelper(2, 2, umColors.lightGrey, umColors.lightGrey); // creates the center lines
          gridHelper5.scale.set(500, 0, 500);
          gridHelper5.position.x = 500
          gridHelper5.rotation.z = Math.PI / 2
    scene.add(gridHelper5);
    //far grid
    const gridHelper6 = new THREE.GridHelper(2, 2, umColors.lightGrey, umColors.lightGrey); // creates the center lines
          gridHelper6.scale.set(500, 0, 500);
          gridHelper6.position.z = -500
          gridHelper6.rotation.x = Math.PI / 2
    scene.add(gridHelper6);

    //FUTUREPROOF red plane
    const fpGeometry = new THREE.PlaneGeometry(500,500)
    const fpMaterial = new THREE.MeshBasicMaterial({ color: umColors.umRed, transparent: true, opacity: .05, side: THREE.DoubleSide });
    const fpPlane = new THREE.Mesh(fpGeometry, fpMaterial);
          fpPlane.rotation.x = Math.PI / 2
          fpPlane.position.x = 250
          fpPlane.position.z = -250
          fpPlane.visible = false
    scene.add(fpPlane);


    // draw spheres
    const geometryTransparent = new THREE.SphereGeometry(8, 32, 16);
    const geometry = new THREE.SphereGeometry(18, 32, 16);


    // DRAW SPHERES, LINES and LABELS
    const draw = () => {
      brands.forEach(({ coordinates, color, name }) => {
        // config
        const { previous, current } = coordinates
        const { x, y, z } = previous
        const { x: x1, y: y1, z: z1 } = current

        // origin spheres
        const transparentMaterial = new THREE.MeshPhongMaterial({ color, transparent: true, opacity: 0.5 })

        const sphereTransparent = new THREE.Mesh(
          geometryTransparent,
          transparentMaterial
        );
        sphereTransparent.position.set(0, 1000, 0)
        sphereTransparent.scale.set(0, 0, 0)
        scene.add(sphereTransparent)
        scaleNodes(sphereTransparent, 2000)
        moveNodes(sphereTransparent, previous, 2000)

        // sphere image labels
        const imageBrand = images[name]
        const imageTexture = new THREE.TextureLoader().load(imageBrand);

        //draw image container for logos
        const planeGeometry = new THREE.PlaneGeometry(100, 100);
        const planeMaterial = new THREE.MeshBasicMaterial({ map: imageTexture, transparent: true });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
              plane.position.y = 60
              plane.name = name+"_logo"
              plane.over = false
        
        console.log(plane.name)
        // moving brand spheres
        const brandMaterial = new THREE.MeshPhongMaterial({ color })
        const sphereBrand = new THREE.Mesh(
          geometry,
          brandMaterial
        );

        sphereBrand.position.set(0, 1000, 0)
        sphereBrand.userData.name = name
        sphereBrand.userData.clicked = true
        sphereBrand.scale.set(0, 0, 0)
        scene.add(sphereBrand)

        scaleNodes(sphereBrand, 2000, () => {
          sphereBrand.add(plane);
          plane.scale.set(0, 0, 0)
          scaleNodes(plane, 1000)

        })

        moveNodes(sphereBrand, previous, 2000, () => {
          // draw lines after nodes are drawn
          const tube = new THREE.Mesh(
            new THREE.TubeGeometry(
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(x, y, z),
                new THREE.Vector3(x, y, z)]), 512, 1.5, 8, false),
            new THREE.MeshBasicMaterial({ color: color }));
          tube.name = name+"_line"
          tube.visible = false
          //scene.add(tube);
        })

        //create tube from current sphere to previous
        const tube = new THREE.Mesh(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(x, y, z),
              new THREE.Vector3(x1, y1, z1)]), 512, 1.5, 8, false),
          new THREE.MeshBasicMaterial({ color: color }));
        tube.name = name+"_line"
        tube.visible = false
        scene.add(tube)

      })
    }

    const imageTexture = new THREE.TextureLoader().load(UM_LOGO);

    //draw image container for UM Logo
    const planeGeometry = new THREE.PlaneGeometry(140, 140).rotateX(-Math.PI * 0.5);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: imageTexture, transparent: true });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
          plane.position.y = 10
          plane.userData.name = "um_logo"
          plane.userData.clicked = false;
    scene.add(plane);

    // DRAW RED AXIS LINES
    const xLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-600, 0, 0), new THREE.Vector3(600, 0, 0)]),
      new THREE.LineBasicMaterial({ color: 0xFF0000 })
    );
    scene.add(xLine);

    const yLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -500, 0), new THREE.Vector3(0, 500, 0)]),
      new THREE.LineBasicMaterial({ color: umColors.umRed })
    );
    scene.add(yLine);

    const zLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -600), new THREE.Vector3(0, 0, 600)]),
      new THREE.LineBasicMaterial({ color: umColors.umRed })
    );
    scene.add(zLine);

    

    // TEXT LOADER
    const fontBlk = new THREE.FontLoader().parse(gotham)
    const fontRg = new THREE.FontLoader().parse(gothamMd)


    const cornerFontConfig = {
      font: fontBlk,
      size: fontSizes.xl,
      height: 1,
    }

    //FUTUREPROOF text
    const textGeometry = new THREE.TextGeometry("FUTUREPROOF", cornerFontConfig);
    const textMaterial = new THREE.MeshBasicMaterial({ color: umColors.umRed })
    const fpText = new THREE.Mesh(textGeometry, textMaterial)
    fpText.position.set(80, 250, -500)
    fpText.visible = false
    scene.add(fpText)

    const axisFontConfig = {
      font: fontRg,
      size: fontSizes.lg,
      height: 1,
    }

    axisLabels.forEach(({ label, coordinates, rotateX, rotateY, rotateZ }) => {
      const { x, y, z } = coordinates
      const textGeometry = new THREE.TextGeometry("WINNING\n"+label, axisFontConfig)
      if (rotateX) {
        textGeometry.rotateX(-Math.PI * 0.5)
      }
      if (rotateY) {
        textGeometry.rotateY(Math.PI * 0.5);
      }
      if (rotateZ) {
        textGeometry.rotateZ(Math.PI * 0.5)
      }
      const textMaterial = new THREE.MeshBasicMaterial({ color: umColors.black })
      const textMesh = new THREE.Mesh(textGeometry, textMaterial)
      textMesh.position.set(x, y, z)
      textMesh.name = "WINNING "+label
      //console.log(textMesh.name)
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
    const controls = new OrbitControls(camera, renderer.domElement)
    // disable panning
    controls.screenSpacePanning = false;
    controls.enablePanning = false;
    // restrict rotation
    controls.maxPolarAngle = Math.PI/2;
    controls.minPolarAngle = 0;
    controls.minDistance = 200;
    controls.maxDistance = 1500;
    controls.minAzimuthAngle = -Math.PI / 5;
    controls.maxAzimuthAngle = Math.PI / 5;


    // TWEENING / TRANSITIONS

    // translate positions
    function moveNodes(sphere, target, duration, callback) {
      // instantiate tween using tween library
      var tweenSphere = new TWEEN.Tween(sphere.position).easing(TWEEN.Easing.Sinusoidal.InOut)
      // reverse sphere's clicked data
      sphere.userData.clicked = !sphere.userData.clicked
      // move sphere to target on a 2000ms duration
      tweenSphere.to(target, duration)
      tweenSphere.start()
      tweenSphere.onComplete(function () {
        //when done, show FUTUREPROOF
        fpPlane.visible = true
        fpText.visible = true
        if (callback) callback();
      })
    }
    // animate the line positions
    function animateLines(line, sphere) {
      //console.log("click?: ",sphere.userData.clicked)
      sphere.userData.clicked ? line.visible = false : line.visible = true
    }

    // scale nodes into view
    function scaleNodes(sphere, duration, callback) {
      var tween = new TWEEN.Tween(sphere.scale).easing(TWEEN.Easing.Sinusoidal.InOut)
      tween.to({ x: 1, y: 1, z: 1 }, duration)
      tween.start()
      tween.onComplete(function () {
        if (callback) callback()
      })
    }

    // move logo up and down
    function animateLogo(logo){
      // instantiate tween using tween library
      var tween1 = new TWEEN.Tween(logo.position).easing(TWEEN.Easing.Sinusoidal.InOut)
      var tween2 = new TWEEN.Tween(logo.position).easing(TWEEN.Easing.Sinusoidal.InOut)
      tween1.to({ x: 0, y: 80, z: 0 }, 400)
      tween1.start()
      tween1.onComplete(function () {
        tween2.to({ x: 0, y: 60, z: 0 }, 600)
        tween2.start()
        tween2.onComplete(function(){
          logo.over = false
        })
      })
    }

    // pan camera out at init
    function panOut() {
      var tween1 = new TWEEN.Tween(camera.position).easing(TWEEN.Easing.Cubic.InOut)
      var tween2 = new TWEEN.Tween(camera.position).easing(TWEEN.Easing.Cubic.InOut)

      tween1.to({ x: 0, y: 550, z: 1300 }, 3000)
      tween1.start()
      tween1.onComplete(function () {
        
        if(!plane.userData.clicked){draw()}
        plane.userData.clicked = true
        tween2.to({ x: 600, y: 600, z: 1300 }, 1000)
        tween2.start()
      })
    }

    // pan camera to look at front
    function panFront() {
      var tween1 = new TWEEN.Tween(camera.position).easing(TWEEN.Easing.Cubic.InOut)
      tween1.to({ x: 0, y: 0, z: 1500 }, 1000)
      tween1.start()
      // tween1.onComplete(function () {
      //   plane.userData.clicked = true
      //   draw()
      //   tween2.to({ x: 600, y: 600, z: 1300 }, 1000)
      //   tween2.start()
      // })
    }
    // pan camera to look down
    function panDown() {
      var tween1 = new TWEEN.Tween(camera.position).easing(TWEEN.Easing.Cubic.InOut)
      tween1.to({ x: 0, y: 1500, z: 0 }, 1000)
      tween1.start()
      // tween1.onComplete(function () {
      //   plane.userData.clicked = true
      //   draw()
      //   tween2.to({ x: 600, y: 600, z: 1300 }, 1000)
      //   tween2.start()
      // })
    }

    // CLICK EVENTS
    // Add event listener on keypress
    document.addEventListener("keypress", (event) => {
      console.log(event.key)
      if(event.key == "1"){ panFront()}
      if(event.key == "2"){ panDown()}
      if(event.key == "3"){ panOut()}
    }, false);

    // Add button events
    document.getElementById("view_1").addEventListener("click", function () {
      if(plane.userData.clicked){panFront()}
    })
    document.getElementById("view_2").addEventListener("click", function () {
      if(plane.userData.clicked){panDown()}
    })
    document.getElementById("view_3").addEventListener("click", function () {
      if(plane.userData.clicked){panOut()}
    })

    var cameraOrtho = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 10);
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

    // handle mouse over
    var handleOver = (e) => {
      e.preventDefault();
      if (e.target instanceof HTMLCanvasElement) {
        const x = e.offsetX + e.target.offsetLeft;
        const y = e.offsetY + e.target.offsetTop;
        mouse.screen.x = x;
        mouse.screen.y = y;
        mouse.scene.x = (e.offsetX / width) * 2 - 1;
        mouse.scene.y = -(e.offsetY / height) * 2 + 1;
        if (!mouse.animating) intersectOver();
      }
    }

    // get mouseover event target
    var intersectOver = () => {
      camera.updateMatrixWorld();
      cameraOrtho.updateMatrixWorld();
      raycaster.setFromCamera(mouse.scene, camera);
      // find all elements being intersected by mouse
      const intersects = raycaster.intersectObjects(scene.children);
      // this selects the colored sphere which is superimposed over the greyed out spheres
      const intersectedSphere = intersects.find(intersected => intersected.object.userData.name &&
        intersected.object.userData.name != "um_logo")
      if (intersectedSphere) {
        // use the userData property to identify the logo container by name
        const objName = intersectedSphere.object.userData.name+"_logo"
        // get the corresponding logo plane
        const logo = scene.getObjectByName(objName)
        // only trigger on hover
        if(!logo.over){
          animateLogo(logo)
          logo.over = true
        }
      }
    }

    //get click event target
    var intersect = () => {
      camera.updateMatrixWorld();
      cameraOrtho.updateMatrixWorld();
      raycaster.setFromCamera(mouse.scene, camera);
      // find all elements being intersected by mouse
      const intersects = raycaster.intersectObjects(scene.children);
      const logo = intersects.find(intersected => intersected.object.userData.name == "um_logo")
      // pan out if logo clicked for the first time
      if (logo && !logo.object.userData.clicked) panOut()
      // this selects the colored sphere which is superimposed over the greyed out spheres
      const intersectedSphere = intersects.find(intersected => intersected.object.userData.name &&
        intersected.object.userData.name != "um_logo")
      if (intersectedSphere) {
        // use the userData property to identify the sphere by name
        const objName = intersectedSphere.object.userData.name
        const line = scene.getObjectByName(objName+"_line")
        // get the correct coordinates for the sphere to travel to
        const position1 = brands.find(el => el.name === objName)?.coordinates.current
        const position0 = brands.find(el => el.name === objName)?.coordinates.previous
        // adjust the target position based on the sphere's current position
        const target = intersectedSphere.object.userData.clicked ? position0 : position1

        // move the sphere to the target position
        // intersected.object is the sphere

        //console.log("line: ",line, "sphere: ", intersectedSphere.object,)
        animateLines(line, intersectedSphere.object)
        moveNodes(intersectedSphere.object, target, 1000)
      }
    }

    // HANDLE RESIZE EVENT
    function onWindowResize() {
      camera.aspect = width / height
      camera.updateProjectionMatrix();
      renderer.setSize(width, height)
    }

    // EVENT LISTENERS
    document.body.addEventListener("click", handleClick, false); // to do: possibly remove event listener at page load?
    document.body.addEventListener("mousemove", handleOver, false);
    window.addEventListener("resize", onWindowResize)

    //const moving = false

    // ANIMATE (renders the scene)
    const animate = () => {
      //console.log(controls.getPolarAngle())
      const a = controls.getPolarAngle();
      const wh = scene.getObjectByName("WINNING HEARTS")
      const wm = scene.getObjectByName("WINNING MINDS")
      //console.log(a,wh)
      if(wh && a > .78){
        wh.rotation.set(Math.PI * 0.5,0,0)
        //wm.rotation.set(0,0,-Math.PI * 0.5)
      }else{
        wh.rotation.set(0,0,0)
        //wm.rotation.set(0,0,0)
      }


      TWEEN.update()
      controls.update()
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    document.body.appendChild(renderer.domElement);
  }
}