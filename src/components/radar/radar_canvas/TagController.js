import event from 'src/utils/observer';
import pDataHolder from './pDataHolder';
import particleEngine from './ParticleEngine';
import ButtonController from './ContentBtnController';


let instance = null;
let count = 0;

export default class {
  /*
      output layout:
      {
          particle,
          angle,
          displayOrder??
          id,
          attr,
      }
  */
  constructor() {
    if (!instance) {
      instance = this;
    }
    count++;

    return instance;
  }

  // eslint-disable-next-line class-methods-use-this
  get count() {
    return count;
  }

  setup(_tags) {
    // didn't aim to handel more than 120 tags;
    if (_tags.length > 120) console.log(`warning: the tags number beyond threshold of 120 --  + ${_tags.length}`);
    this.particles = [];
    this.tagData = [];
    this.selected = [];
    this.center = new PIXI.Point(pDataHolder.CANVAS_WIDTH / 2, pDataHolder.CANVAS_HEIGHT / 2);
    this.radian = (2 * Math.PI) / _tags.length;
    this.radius = 330;

    for (let i = 0, len = _tags.length; i < len; i++) {
      const rc = this.radius / Math.cos(this.radian / 2);
      // eslint-disable-next-line
      const pos = new PIXI.Point(this.center.x + rc * Math.cos(this.radian * (i + 1) - this.radian), this.center.y + rc * Math.sin(this.radian * (i + 1) - this.radian));
      const p = particleEngine.createParticle(pos, `###${i}`, 30);

      p.type = 1;
      this.tagData.push({
        particle: p,
        angle: this.radian * i,
        id: _tags[i].id,
        attr: {
          title: _tags[i].title,
          selected: false,
        },
        tagController: this,
      });
    }
    // register select Event
    event.$on('selectTag', this.selectTag.bind(this));

    return this.tagData;
  }

  selectTag(_tagName) {
    const selected = this.selected;
    let dupIndex; // if already selected mark to remove;

    // highlight all selected tags
    // eslint-disable-next-line no-cond-assign
    if ((dupIndex = this.selected.indexOf(_tagName)) >= 0) {
      selected.splice(dupIndex, 1);
    } else {
      selected.push(_tagName);
    }

    new ButtonController().activeByTags(this.selected);

    // call all press event;
    let i = 0;
    const len = this.selected.length;
    do {
      // do while is used to iterate any way to find the _tagName;
      for (let j = 0; j < len; j++) {
        if (this.tagData[j].attr.title === this.selected[i]) {
          this.tagData[j].particle.press();
        } else if (this.tagData[j].attr.title === _tagName && i === 0) {
          // still call press for the unselected tag
          this.tagData[j].particle.press();
        }
      }
      i++;
    } while (i < len);
  }
}
