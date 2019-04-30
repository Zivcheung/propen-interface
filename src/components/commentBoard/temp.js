mounted() {
  //new post animation
  const np = this.$refs.npl3;
  const npl1 = this.$refs.npl1;
  const npl2 = this.$refs.npl2;
  let dragStartPos = [];
  let droped = false;
  let startAnimation = [];


  np.ondragstart = (e) => {
    // const img = new Image();
    // e.dataTransfer.setDragImage(img,0,0);
    dragStartPos[0] = e.screenX;
    dragStartPos[1] = e.screenY;
    startAnimation.push(
      anime({
        targets: [npl1, npl2],
        translateX: -6,
        translateY: 6,
        duration: 1000,
      })
    );
    startAnimation.push(
      anime({
        targets: np,
        opacity: 0,
        duration: 1000,
      })
    );
    
    np.style['z-index'] = 100;
  };
  np.ondragend = (e) => {
    const fleetLevel = 0.2;
    startAnimation.forEach(item => item.pause());
    if (!droped) {
      anime({
        targets: [npl1, npl2],
        translateX: 0,
        translateY: 0,
        duration: 1000,
      });
      np.style.opacity = 1;
      anime({
        targets: np,
        translateX: [(e.screenX - dragStartPos[0]) * fleetLevel, 0],
        translateY: [(e.screenY - dragStartPos[1]) * fleetLevel, 0],
        duration: 100,
        easing: 'easeOutElastic(1,1.5)',

      });
      // anime({
      //   targets: np,
      //   translateX: [e.screenX - dragStartPos[0],0],
      //   translateY: [e.screenY - dragStartPos[1],0],
      //   duration: 500,
      //   easing: 'easeOutElastic(1,1.5)',
      //   'z-index': 0,
      // });
    } else {
      const allNp = [np,npl1,npl2];
      allNp.forEach(item => {
        item.style.transform = "";
      });
    }
  };
  // np.ondrag = (e) => {
  //   let xDist = e.screenX - dragStartPos[0];
  //   let yDist = e.screenY - dragStartPos[1];
  //   np.style.transform = `translateX(${xDist}px) translateY(${yDist}px)`;
  // };
},