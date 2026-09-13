const container = document.getElementById("container");
let clock = new THREE.Clock();

let scene, camera, renderer, material;
let settings = { fps: 60, parallaxVal: 0 };
let videoElement;

async function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight, 2);
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  material = new THREE.ShaderMaterial({
    uniforms: {
      u_tex0: { type: "t" },
      u_time: { value: 0, type: "f" },

      // === Hard-coded Lively settings ===
      u_intensity: { value: 1.0, type: "f" },        // rainIntensity 100
      u_speed: { value: 0.52, type: "f" },          // rainSpeed 52
      u_brightness: { value: 1.0, type: "f" },      // brightness 100
      u_normal: { value: 0.60, type: "f" },         // rainNormal 60
      u_zoom: { value: 2.39, type: "f" },           // rainZoom 239

      u_blur_intensity: { value: 0.08, type: "f" }, // blurIntensity 8
      u_blur_iterations: { value: 16, type: "i" },  // blurQuality = Low

      u_panning: { value: false, type: "b" },
      u_post_processing: { value: false, type: "b" },
      u_lightning: { value: false, type: "b" },
      u_texture_fill: { value: true, type: "b" },   // mediaScaling = Fill

      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight), type: "v2" },
      u_tex0_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight), type: "v2" },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
  });

  material.fragmentShader = await (await fetch("shaders/rain.frag")).text();

  // Load your custom background image
  new THREE.TextureLoader().load("media/Majestic Gurvir.png", function (tex) {
    material.uniforms.u_tex0_resolution.value =
      new THREE.Vector2(tex.image.width, tex.image.height);
    material.uniforms.u_tex0.value = tex;
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 1, 1), material);
  scene.add(quad);
}

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight, 2);
  material.uniforms.u_resolution.value =
    new THREE.Vector2(window.innerWidth, window.innerHeight);
});

function render() {
  setTimeout(function () {
    requestAnimationFrame(render);
  }, 1000 / settings.fps);

  // Reset every 6 hours
  if (clock.getElapsedTime() > 21600) clock = new THREE.Clock();
  material.uniforms.u_time.value = clock.getElapsedTime();

  renderer.render(scene, camera);
}

init();
render();
