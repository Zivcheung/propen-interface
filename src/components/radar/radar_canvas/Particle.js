import utils from 'src/utils/renderUtil';
import BasicParticle from './BasicParticle';

class Particle extends BasicParticle {
  // new CustomButton('ico_powerdream.png', 160, 160, 0xFFFFFF, 1, 0x67666b, 1, 1.5)
  constructor(_t, _p, _i) {
    super(_t, _p);
    this.target = new PIXI.Point(0, 0);
    // tint
    this.tintAmount = 0;
    this.targetTint = 0;
    this.vel = 0.1;
    this.index = 0;
    this.bros = [];
    this.brosLen = 0;
    this.idTime = 0;
    this.width = 2;
    this.height = 2;
    this.targetSize = 2;
    this.type = 0; // 0-->grid 1-->tag 2-->button

    // assign parameters
    this.index = _i;
  }

  // add bros
  addBros(_bro) {
    this.brosLen = this.bros.push(_bro);
  }

  // red interpolation
  getLerpTint() {
    return utils.lerpColor('#000000', '#ff0000', this.tintAmount);
  }

  // wave animation
  doWave(_n, _id, tintAmount) {
    if (_id === this.idWave || _n < 3) {
      return;
    }
    if (this.type === 1) {
      const me = this;
      this.idWave = _id;
      cancelAnimationFrame(this.idTime);
      this.idTime = requestAnimationFrame(() => {
        for (let i = 0, len = me.brosLen; i < len; i++) {
          me.bros[i].doWave(_n, _id, tintAmount);
        }
      });
    } else {
      const me = this;
      this.idWave = _id;
      this.tintAmount = tintAmount;
      this.tint = this.getLerpTint();
      this.width = _n + this.targetSize;
      this.height = this.width;
      cancelAnimationFrame(this.idTIme);
      this.idTime = requestAnimationFrame(() => {
        for (let i = 0, len = me.brosLen; i < len; i++) {
          const bro = me.bros[i];
          bro.doWave(_n - 0.9, _id, tintAmount - 0.01);
        }
      });
    }
  }
  // interaction : hover
  hover() {
    const tintAmount = 0.5;
    this.doWave(16, new Date().valueOf(), tintAmount);
  }
  // interaction : press (two states include on and off)
  press(_toggled) {
    // eslint-disable-next-line no-param-reassign
    if (_toggled === undefined) _toggled = true;
    if (_toggled) {
      const tintAmount = 1;
      this.doWave(30, new Date().valueOf(), tintAmount);
    } else {
      // eslint-disable-next-line prefer-const
      let tintAmount = 1;
      this.doWave(30, new Date().valueOf(), tintAmount);
    }
  }

  // animation
  recoverLoop() {
    const reduce = (this.targetSize - this.width) > -0.5 ? 0 : (this.targetSize - this.width);
    this.width = this.width + (reduce * this.vel);
    this.height = this.width;
    // color tint

    const tintReduce = this.targetTint - this.tintAmount;
    this.tintAmount = this.tintAmount + (tintReduce * this.vel);
    this.tint = utils.lerpColor('#000000', '#ff0000', this.tintAmount);
  }
}

export default Particle;
