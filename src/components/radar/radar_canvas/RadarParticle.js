import img from 'src/assets/dot.png';
import emiter from 'src/utils/observer';
import pDataHolder from './pDataHolder';
import particleEngine from './ParticleEngine';

export default class RadarParticle {
  constructor(_domTarget) {
    this.texturePattern = img;
    this.dom = document.querySelector(`${_domTarget}`);
    this.canvasWidth = pDataHolder.CANVAS_WIDTH;
    this.canvasHeight = pDataHolder.CANVAS_HEIGHT;
    this.particleEngine = particleEngine;
    // need to destory
    this.app = new PIXI.Application({
      width: pDataHolder.CANVAS_WIDTH,
      height: pDataHolder.CANVAS_HEIGHT,
      autoResize: true,
      transparent: false,
      antialias: true,
      resolution: window.devicePixelRatio,
      roundPixels: true,
      backgroundColor: '0xffffff',
    });
    this.dom.appendChild(this.app.view);

    // responsice size
    this.onresize();
    this.resizeListener = window.addEventListener('resize', this.onresize);
  }
  setup() {
    return new Promise((resolve, reject) => {
      PIXI.loader
        .add(this.texturePattern)
        .load(() => {
          try {
            this.texture = PIXI.loader.resources[this.texturePattern].texture;
            this.mainContainer = new PIXI.Container();
            this.particleEngine.setup(this.texture);
            this.app.stage.addChild(particleEngine.particleContainer);
            this.activeAnimation = true;
            this.loop();
          } catch (err) {
            reject(err);
          }
          resolve();
        });
    });
  }

  onresize = () => {
    const scaleRatio = this.getRespRatio();
    this.dom.style.transform = `scale(${scaleRatio})`;
    this.dom.style.transformOrigin = '0% 0%';
  }

  getRespRatio() {
    const parentDomSize = this.dom.parentElement.getBoundingClientRect();
    const width = parentDomSize.width;
    const height = parentDomSize.height;
    let scaleRatio;
    if (width > height) {
      scaleRatio = this.climp(0, 1, height / this.canvasHeight);
    } else {
      scaleRatio = this.climp(0, 1, width / this.canvasWidth);
    }

    return scaleRatio;
  }

  // eslint-disable-next-line
  climp(_min, _max, _value) {
  // eslint-disable-next-line
    return _value > _max ? _max :
      _value < _min ? _min : _value;
  }

  loop() {
    this.particleEngine.loop();
    if (this.activeAnimation) {
      this.tl = requestAnimationFrame(() => {
        this.loop();
      });
    }
  }

  destroy() {
    this.activeAnimation = false;
    cancelAnimationFrame(this.tl);
    this.texture.destroy(true);
    PIXI.loader.reset();
    removeEventListener('resize', this.resizeListener);
    this.particleEngine.destroy();
    this.app.destroy();
    console.log('pixi destroyed');
  }
}
