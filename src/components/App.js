import *  as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js' // library for position tweening
import oc from 'three-orbit-controls'

// lib
import * as UM_LOGO from '../assets/images/UM_Logo.png'

import { brands, images, dimensions, height, width, pDims, axisLabels, transformedData } from "../globals/constants"

import * as optimer from '../assets/fonts/Gotham_Medium_Regular.typeface.json'


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
    const { x, y, z, w, h, d } = pDims
    const gridHelper = new THREE.GridHelper(10, 10, 'black', "lightgrey"); // creates the center lines
    gridHelper.scale.set(100, 0, 100);

    // add grid
    scene.add(gridHelper);

    const gridHelper2 = new THREE.GridHelper(10, 10, 'black', "lightgrey").rotateX(-Math.PI * 0.5); // creates the center lines
    gridHelper2.scale.set(100, 0, 100);
    gridHelper2.position.z = -500
    gridHelper2.position.y = 500

    // scene.add(gridHelper2)


    //draw spheres

    const geometry = new THREE.SphereGeometry(15, 32, 16);

    // skin for greyed out spheres
    const greyMaterial = new THREE.MeshPhongMaterial({ color: "rgb(220,220,220)" })


    const lMaterial = new THREE.LineDashedMaterial({
      color: 0xffff,
      linewidth: 1,
      linecap: 'round', //ignored by WebGLRenderer
      linejoin: 'round', //ignored by WebGLRenderer
    });


    // DRAW SPHERES, LINES and LABELS

    const draw = () => {
      brands.forEach(({ coordinates, color, name }) => {
        // config
        const { previous, current } = coordinates
        const { x, y, z } = previous
        const { x: x1, y: y1, z: z1 } = current

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
        const planeGeometry = new THREE.PlaneGeometry(100, 100);
        const planeMaterial = new THREE.MeshBasicMaterial({ map: imageTexture, transparent: true });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = 60
        sphereBrand.add(plane);

        // lines
        const points = [];

        points.push(new THREE.Vector3(x, y, z));
        points.push(new THREE.Vector3(x1, y1, z1));
        const lGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lGeometry, lMaterial);
        scene.add(line);
      })
    }

    const imageTexture = new THREE.TextureLoader().load(UM_LOGO);

    //draw image container for UM Logo
    const planeGeometry = new THREE.PlaneGeometry(100, 100).rotateX(-Math.PI * 0.5);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: imageTexture, transparent: true });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = 10
    plane.userData.name = "um_logo"
    scene.add(plane);

    // TEXT LOADER
    const font = new THREE.FontLoader().parse(optimer)

    const fontConfig = {
      font: font,
      size: 20,
      height: 1,
    }

    // create axis labels
    // axisLabels.forEach(({ label, coordinates }) => {
    //   const { x, y, z } = coordinates
    //   const textGeometry = new THREE.TextGeometry(label, fontConfig);
    //   const textMaterial = new THREE.MeshBasicMaterial({ color: 000000 })
    //   const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    //   textMesh.position.set(x, y, z)
    //   scene.add(textMesh)
    // })

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

      const target = { x: 0, y: 750, z: 1500 }
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