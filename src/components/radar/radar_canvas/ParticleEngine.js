import utils from 'src/utils/renderUtil';
import Particle from './Particle';
import pDataHolder from './pDataHolder';

export default {
  isStart: false,
  particleNumber: 0,

  setup(_t) {
    this.particles = pDataHolder.particles;
    this.texture = _t;
    this.particleContainer = new PIXI.particles.ParticleContainer(1500, {
      vertices: true,
      tint: true,
      position: false,
    });

    const centerX = pDataHolder.CANVAS_WIDTH / 2;
    const centerY = pDataHolder.CANVAS_HEIGHT / 2;
    let radius = 0;
    let pNumber = 1;
    let radian;
    let rc;

    // generate circular grid layout
    for (let i = 0; i < 20; i++) {
      radian = (2 * Math.PI) / pNumber;
      for (let j = 0; j < pNumber; j++) {
        rc = radius / Math.cos(radian * 0.5);
        // eslint-disable-next-line
        const pos = new PIXI.Point(centerX + rc * Math.cos(radian * (j + 1) - radian * .5), centerY + rc * Math.sin(radian * (j + 1) - radian * .5));
        const p = new Particle(_t, pos, j);
        this.particleNumber = this.particles.push(p);
        this.particleContainer.addChild(p);
      }
      radius += 16;
      pNumber += 6;
    }
    // setup bro relationship
    for (let i = 0; i < this.particleNumber; i++) {
      this.setupBros(this.particles[i], 25);
    }
  },

  // setup Bro relationship
  setupBros(_p, _dist) {
    let p2;
    for (let i = 0; i < this.particleNumber; i++) {
      p2 = this.particles[i];
      if (utils.pointDist(_p.position, p2.position) < _dist) {
        _p.addBros(p2);
      }
    }
  },
  createParticle(_pos, _j, _broZone) {
    if (!_pos && !_j && !_broZone) throw new Error('parameter missing: ParticleEngine.createParticle() accepts three params  _pos, _j, _broZone ');
    const p = new Particle(this.texture, _pos, _j);
    this.particleNumber = this.particles.push(p);
    this.addParticle(p, _broZone);
    return p;
  },

  addParticle(_p, _broZone) {
    this.setupBros(_p, _broZone);
    this.particles.push(_p);
  },

  loop() {
    for (let i = 0, len = this.particles.length; i < len; i++) {
      this.particles[i].recoverLoop();
    }
  },
  destroy() {
    this.particleContainer.destroy();
    pDataHolder.particles = [];
    this.particles = pDataHolder.particles;
  },
};
