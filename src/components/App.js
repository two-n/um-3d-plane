import *  as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js' // library for position tweening
import oc from 'three-orbit-controls'

// lib
import * as UM_LOGO from '../assets/images/UM_Logo_Large.png'

import { images, height, width, cornerLabels, axisLabels, umColors, fontSizes } from "../globals/constants"

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

    // SIMPLE GRID

    const gridHelper = new THREE.GridHelper(10, 10, umColors.black, umColors.lightGrey); // creates the center lines
    gridHelper.scale.set(100, 0, 100);

    // add grid
    scene.add(gridHelper);

    const gridHelper2 = new THREE.GridHelper(10, 10, umColors.black, umColors.lightGrey).rotateX(-Math.PI * 0.5); // creates the center lines
    gridHelper2.scale.set(100, 0, 100);
    gridHelper2.position.z = -500
    gridHelper2.position.y = 500

    // scene.add(gridHelper2)


    //draw spheres

    const geometry = new THREE.SphereGeometry(15, 32, 16);

    // DRAW SPHERES, LINES and LABELS

    const draw = () => {
      brands.forEach(({ coordinates, color, name }) => {
        // config
        const { previous, current } = coordinates
        const { x, y, z } = previous
        const { x: x1, y: y1, z: z1 } = current

        // placeholder spheres

        const transparentMaterial = new THREE.MeshPhongMaterial({ color, transparent: true, opacity: 0.5 })

        const sphereTransparent = new THREE.Mesh(
          geometry,
          transparentMaterial
        );
        sphereTransparent.position.set(x, y, z)
        scene.add(sphereTransparent)

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
        const planeGeometry = new THREE.PlaneGeometry(100, 100);
        const planeMaterial = new THREE.MeshBasicMaterial({ map: imageTexture, transparent: true });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = 60
        sphereBrand.add(plane);

        // lines
        const tube = new THREE.Mesh(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(x, y, z),
              new THREE.Vector3(x1, y1, z1)]), 512, .5, 8, false),
          new THREE.MeshBasicMaterial({ color: color }));
        scene.add(tube);
      })
    }

    const imageTexture = new THREE.TextureLoader().load(UM_LOGO);

    //draw image container for UM Logo
    const planeGeometry = new THREE.PlaneGeometry(140, 140).rotateX(-Math.PI * 0.5);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: imageTexture, transparent: true });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = 10
    plane.userData.name = "um_logo"
    scene.add(plane);

    // DRAW RED AXIS LINES

    const yLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 500, 0)]),
      new THREE.LineBasicMaterial({ color: umColors.umRed })
    );

    scene.add(yLine);

    const xLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-500, 0, 0), new THREE.Vector3(500, 0, 0)]),
      new THREE.LineBasicMaterial({ color: 0xFF0000 })
    );

    scene.add(xLine);

    // TEXT LOADER
    const fontBlk = new THREE.FontLoader().parse(gotham)
    const fontRg = new THREE.FontLoader().parse(gothamMd)


    const cornerFontConfig = {
      font: fontBlk,
      size: fontSizes.lg,
      height: 1,
    }

    // create axis labels
    cornerLabels.forEach(({ label, coordinates }) => {
      const { x, y, z } = coordinates
      const textGeometry = new THREE.TextGeometry(label, cornerFontConfig);
      const textMaterial = new THREE.MeshBasicMaterial({ color: umColors.umRed })
      const textMesh = new THREE.Mesh(textGeometry, textMaterial)
      textMesh.position.set(x, y, z)
      scene.add(textMesh)
    })

    const axisFontConfig = {
      font: fontRg,
      size: fontSizes.md,
      height: 1,
    }

    axisLabels.forEach(({ label, coordinates, rotateX, rotateY, rotateZ }) => {
      const { x, y, z } = coordinates
      const textGeometry = new THREE.TextGeometry(label, axisFontConfig)
      if (rotateX) {
        textGeometry.rotateX(-Math.PI * 0.5)
      }
      if (rotateY) {
        textGeometry.rotateY(Math.PI * 0.5);
      }
      if (rotateZ) {
        textGeometry.rotateZ(Math.PI * 0.5)
      }
      const textMaterial = new THREE.MeshBasicMaterial({ color: umColors.umRed })
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
    const controls = new OrbitControls(camera, renderer.domElement)
    // disable panning
    controls.screenSpacePanning = false;
    controls.enablePanning = false;
    // restrict rotation
    controls.maxPolarAngle = Math.PI / 2.8;
    controls.minPolarAngle = 0;
    controls.minDistance = 200;
    controls.maxDistance = 1500;
    controls.minAzimuthAngle = -Math.PI / 5;
    controls.maxAzimuthAngle = Math.PI / 5;


    // TWEENING

    // translate positions
    function moveNodes(sphere, target) {
      // instantiate tween using tween library
      var tween = new TWEEN.Tween(sphere.position).easing(TWEEN.Easing.Sinusoidal.InOut)
      // reverse sphere's clicked data
      sphere.userData.clicked = !sphere.userData.clicked
      // requestAnimationFrame(animate)
      // move sphere to target on a 2000ms duration
      tween.to(target, 1000)
      tween.start()
    }

    function panOut() {
      var tween = new TWEEN.Tween(camera.position).easing(TWEEN.Easing.Sinusoidal.InOut)
      const target = { x: 100, y: 550, z: 1300 }
      tween.to(target, 3000)
      tween.start()
      tween.onComplete(function () {

        draw()
      })
    }

    // CLICK EVENTS

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


    var intersect = () => {
      camera.updateMatrixWorld();
      cameraOrtho.updateMatrixWorld();
      raycaster.setFromCamera(mouse.scene, camera);
      // find all elements being intersected by mouse
      const intersects = raycaster.intersectObjects(scene.children);
      const logo = intersects.find(intersected => intersected.object.userData.name == "um_logo")
      if (logo) panOut()
      // this selects the colored sphere which is superimposed over the greyed out spheres
      const intersectedSphere = intersects.find(intersected => intersected.object.userData.name &&
        intersected.object.userData.name != "um_logo")
      if (intersectedSphere) {
        // use the userData property to identify the sphere by name
        const objName = intersectedSphere.object.userData.name
        // get the correct coordinates for the sphere to travel to
        const position1 = brands.find(el => el.name === objName)?.coordinates.current
        const position0 = brands.find(el => el.name === objName)?.coordinates.previous
        // adjust the target position based on the sphere's current position
        const target = intersectedSphere.object.userData.clicked ? position0 : position1
        // move the sphere to the target position
        // intersected.object is the sphere
        moveNodes(intersectedSphere.object, target)
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
    window.addEventListener("resize", onWindowResize)

    // ANIMATE (renders the scene)
    const animate = () => {
      TWEEN.update()
      controls.update()
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    document.body.appendChild(renderer.domElement);
  }
}