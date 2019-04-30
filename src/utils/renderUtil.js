/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
export default {
  pointDist(_point1, _point2) {
    return Math.sqrt(((_point1.x - _point2.x) ** 2) + ((_point1.y - _point2.y) ** 2));
  },
  lerpColor(a, b, amount) {
    // eslint-disable-next-line
    const ah = parseInt(a.replace(/#/g, ''), 16),
      ar = ah >> 16,
      ag = ah >> 8 & 0xff,
      ab = ah & 0xff,
      bh = parseInt(b.replace(/#/g, ''), 16),
      br = bh >> 16,
      bg = bh >> 8 & 0xff,
      bb = bh & 0xff,
      rr = ar + amount * (br - ar),
      rg = ag + amount * (bg - ag),
      rb = ab + amount * (bb - ab);

    // eslint-disable-next-line prefer-template
    return '0x' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
  },
};
