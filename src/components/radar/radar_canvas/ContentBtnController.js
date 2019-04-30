import pDataHolder from './pDataHolder';

let instance = null;
let counter = 0;

export default class ContentBtnController {
  // singleton pattern
  constructor() {
    if (!instance) {
      instance = this;
    }
    counter += 1;
    return instance;
  }

  // eslint-disable-next-line class-methods-use-this
  get counter() {
    return counter;
  }

  setup(_content) {
    this.pPool = [];
    this.resetPool();
    this.buttonData = [];

    for (let i = 0, len = _content.length; i < len; i++) {
      const p = this.luckyDrawParticle();
      // private data for bd
      let toggled = false;
      const bd = {
        particle: p,
        id: _content[i].id,
        attr: _content[i].attributes,
        tags: _content[i].attributes.tags,
        // toggle letch
        get toggled() {
          return toggled;
        },
        set toggled(_v) {
          toggled = _v;
          this.particle.highlighted = toggled;
        },
      };
      // setup particle size
      p.width = pDataHolder.BUTTON_SIZE;
      p.height = pDataHolder.BUTTON_SIZE;
      p.targetSize = pDataHolder.BUTTON_SIZE;
      p.type = 2;
      this.buttonData.push(bd);
    }
    return this.buttonData;
  }

  activeByTags(_tags) {
    let i = 0;
    do {
      for (let j = 0, len = this.buttonData.length; j < len; j++) {
        if (i === 0) {
          // remove highlight unless fit to the first tag, this is used to reset all highlighted
          this.buttonData[j].particle.targetTint =
              this.buttonData[j].tags.indexOf(_tags[i]) >= 0 ? 1 : 0;
        } else {
          this.buttonData[j].particle.targetTint =
            this.buttonData[j].tags.indexOf(_tags[i]) >= 0 ? 1 :
              this.buttonData[j].particle.targetTint;
        }
      }
      i++;
    } while (i < _tags.length);
  }

  luckyDrawParticle() {
    const random = Math.floor((Math.random() * this.pPool.length) + 1);
    const p = pDataHolder.particles[random];
    this.pPool.splice(random, 1);
    return p;
  }
  resetPool() {
    const particles = pDataHolder.particles;
    const len = particles.length;
    for (let i = 0; i < len; i++) {
      this.pPool.push(particles[i]);
    }
  }
}
