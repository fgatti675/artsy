import {
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  Light,
  OrthographicCamera,
  Scene,
  WebGLRenderer
} from 'three';


import {
  BlendFunction,
  ChromaticAberrationEffect,
  EffectComposer,
  EffectPass,
  GlitchEffect,
  NoiseEffect,
  RenderPass

// @ts-ignore
} from 'postprocessing';

import {Shape} from './shape';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const CAMERA_FACTOR = 100;

const WHITE = new Color(0xFFFFFF),
  GREY = new Color(0xCCCCCC),
  RED = new Color(0xFF0000),
  YELLOW = new Color(0xFFFF00),
  BLUE = new Color(0x0000FF),
  LIGHT_GREEN = new Color(0x70C4CE),
  ORANGE = new Color(0xf66023),
  PURPLE = new Color(0x590D82),
  MAGENTA = new Color(0xff00ff),
  PINK = new Color(0xCE70A5);

export class App {
  private readonly scene = new Scene();

  private readonly camera = new OrthographicCamera(innerWidth / -CAMERA_FACTOR, innerWidth / CAMERA_FACTOR, innerHeight / CAMERA_FACTOR, innerHeight / -CAMERA_FACTOR, 1, 1000);

  private readonly clock = new Clock();
  private readonly renderer = new WebGLRenderer({
    // powerPreference: 'high-performance',
    antialias: false,
    stencil: false,
    depth: false,
    alpha: true,
    canvas: document.getElementById('canvas') as HTMLCanvasElement,
  });
  private composer;

  private readonly shape: Shape;
  private readonly light: Light;
  private readonly light2: Light;
  private readonly light3: Light;
  private readonly light4: Light;
  private readonly light5: Light;

  constructor() {

    this.shape = new Shape();
    this.scene.add(this.shape);

    this.camera.position.z = 500;

    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(innerWidth, innerHeight);

    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const chromaticAberrationEffect = new ChromaticAberrationEffect();
    const glitchEffect = new GlitchEffect({
      ratio: 0.0,
      // chromaticAberrationOffset: chromaticAberrationEffect.offset,
      duration: .1,
    });

    const noiseEffect = new NoiseEffect({
      blendFunction: BlendFunction.COLOR_DODGE,
      premultiply: true
    });

    this.composer.addPass(new EffectPass(this.camera,  chromaticAberrationEffect));
    this.composer.addPass(new EffectPass(this.camera,  glitchEffect, noiseEffect));

    this.renderer.setSize(innerWidth, innerHeight);
    // this.renderer.setClearColor(new Color('#ACB8BD'));

    this.light = new HemisphereLight(BLUE, RED, .3);
    this.light.position.set(0, 0, 10);
    // this.scene.add(new HemisphereLightHelper(this.light as HemisphereLight, 1));
    // light.target.position.set(shape);
    this.scene.add(this.light);

    this.light2 = new HemisphereLight(YELLOW, BLUE, .3);
    // this.scene.add(new HemisphereLightHelper(this.light2 as HemisphereLight, 1));
    this.scene.add(this.light2);

    this.light3 = new DirectionalLight(BLUE, .4);
    // this.scene.add(new DirectionalLightHelper(this.light3 as DirectionalLight, 1));
    this.scene.add(this.light3);

    this.light4 = new DirectionalLight(ORANGE, .3);
    // this.scene.add(new DirectionalLightHelper(this.light4 as DirectionalLight, 1));
    this.scene.add(this.light4);

    this.light5 = new DirectionalLight(RED, .4);
    // this.scene.add(new DirectionalLightHelper(this.light5 as DirectionalLight, 1));
    this.scene.add(this.light5);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    scaleText();

    window.addEventListener('resize', scaleText);

    this.render();
  }

  private updateLightsPosition(time: number) {
    const LIGHT_DISTANCE = 8;

    const sin = Math.sin(time *3) * LIGHT_DISTANCE;
    const cos = Math.cos(time * 3) * LIGHT_DISTANCE;

    this.light.position.set(
      -4,
      -cos,
      sin
    );
    this.light2.position.set(
      cos,
      5,
      sin
    );

    this.light3.position.set(
      -cos,
      -5,
      sin
    );

    this.light4.position.set(
      sin,
      -cos,
      0
    );
    this.light5.position.set(
      -1,
      cos,
      0
    );
  }


  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
  }

  private render() {

    const delta = this.clock.getElapsedTime() / 3;
    this.updateLightsPosition(delta);
    // @ts-ignore
    // this.shape.material.uniforms.delta.value = delta;

    // @ts-ignore
    this.shape.material.userData.delta.value = delta;

    this.shape.rotateX(.02);
    this.shape.rotateY(-.02);


    this.composer.render(this.clock.getDelta());
    // this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());

    this.adjustCanvasSize();
  }
}

function scaleText() {
  const scalable = document.querySelectorAll('.scale--js');
  const margin = 10;
  for (let i = 0; i < scalable.length; i++) {
    const scalableContainer = scalable[i].parentNode;
    // @ts-ignore
    scalable[i].style.transform = 'scale(1)';
    // @ts-ignore
    const scalableContainerWidth = scalableContainer.offsetWidth - margin;
    // @ts-ignore
    const scalableWidth = scalable[i].offsetWidth;
    // @ts-ignore
    scalable[i].style.transform = 'scale(' + scalableContainerWidth / scalableWidth + ')';
    // @ts-ignore
    scalableContainer.style.height = scalable[i].getBoundingClientRect().height + 'px';
  }
}
