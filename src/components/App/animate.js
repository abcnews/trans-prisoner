/**
 * Parallax scrolling plugin imported manually for debugging & some adjustement from 
 * https://github.com/electerious/basicScroll
 */
import * as basicScroll from './basic-scroll'
import styles from './styles.scss';

const isMobile = !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const sceneOpts = {
  "1": {
    animations: [],
    getAnimations: getAnimations1,
  },
  "2": {
    animations: [],
    getAnimations: getAnimations2,
  },
  "3": {
    animations: [],
    getAnimations: getAnimations3,
  },
  "4": {
    animations: [],
    getAnimations: getAnimations4,
  },
  "5": {
    animations: [],
    getAnimations: getAnimations5,
  },
  "6": {
    animations: [],
    getAnimations: getAnimations6,
  },
  "7": {
    animations: [],
    getAnimations: getAnimations7,
  },
  "8": {
    animations: [],
    getAnimations: getAnimations8,
  },
  "9": {
    animations: [],
    getAnimations: getAnimations9,
  },
  "10": {
    animations: [],
    getAnimations: getAnimations10,
  },
  "11": {
    animations: [],
    getAnimations: getAnimations11,
  },
  "12": {
    animations: [],
    getAnimations: getAnimations12,
  },
  "13": {
    animations: [],
    getAnimations: getAnimations13,
  },
  "14": {
    animations: [],
    getAnimations: getAnimations14,
  },
  "15": {
    animations: [],
    getAnimations: getAnimations15,
  },
  "16": {
    animations: [],
    getAnimations: getAnimations16,
  },
  "17": {
    animations: [],
    getAnimations: getAnimations17,
  },
  "18": {
    animations: [],
    getAnimations: getAnimations18,
  },
  "19": {
    animations: [],
    getAnimations: getAnimations19,
  },
  "20": {
    animations: [],
    getAnimations: getAnimations20,
  }
}

const COMIC_FROM = 'top-bottom';
const COMIC_TO = 'bottom-top'
const PANEL_TRANSITION = 'transform 3s cubic-bezier(0.51, 0.18, 0.51, 0.89) 0.2s';

const WIDE_COMIC_FROM = 'top-bottom';
const WIDE_COMIC_TO = 'bottom-top'

export function animate() {

  const callback = (entries, o) => {
    entries.forEach(entry => {

      const target = entry.target;
      const scene = target.dataset.scene;

      // console.log('isIntersecting: ' + entry.isIntersecting)
      // console.log('scene: ' + scene);

      const sceneFns = sceneOpts[scene];

      if (entry.isIntersecting) {

        let startAnimations;
        if (sceneFns && sceneFns.animations && !sceneFns.animations.length) {
          sceneFns.animations = sceneFns.getAnimations();
        }
        if (sceneFns && sceneFns.getAnimations && !sceneFns.active) {
          sceneFns.start = () => sceneFns.animations.forEach(animation => {
            // console.log(`starting animation: scene --- ${scene}`);
            animation.calculate();
            animation.start();
            sceneFns.active = true;
          });

          // create stop callback
          sceneFns.stop = () => sceneFns.animations.forEach(animation => {
            // console.log(`destroying animation: scene --- ${scene}`);
            animation.stop();
            sceneFns.active = false;
          });

          startAnimations = sceneFns.start;
        }
        // scene should be triggered after images are loaded 
        // for correct height offset calculation
        preloadImages(target, startAnimations);
        preloadBackgrounds(target);
      } else {
        // console.log('NOT intersecting scene --- ' + scene);
        if (sceneFns && sceneFns.stop) {
          sceneFns.stop();
        }
      }
    });
  };

  const scenes = document.querySelectorAll('[data-scene]');

  // if does not have observer support or is IE browser, preload images, do not animate elements
  if (!window.IntersectionObserver || window.document.documentMode) {

    const main = document.getElementById('scrollArea');
    main.classList.add(styles.noAnimations);

    // load images with the timeout, don't trigger animations
    for (var i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const sceneNum = scene.dataset.scene;
      setTimeout(() => {
        preloadImages(scene), sceneNum * 100
        preloadBackgrounds(scene);
      });
    }
  } else {
    const observer = new IntersectionObserver(callback, {
      rootMargin: "1000px 0px 1500px 0px",
    });

    scenes.forEach(el => {
      observer.observe(el);
    });
  }

  // start
  startAnimations();
}


function startAnimations() {
  window.addEventListener('scroll', onScroll, false);

  let innerHeight = window.innerHeight;

  let scrollTop = 0;
  let ticking = false;

  window.addEventListener('resize', () => {
    innerHeight = window.innerHeight;
    loop(scrollTop);
    onScroll();
  });

  function onScroll() {
    scrollTop = basicScroll.getScrollTop();

    if (!ticking) {
      window.requestAnimationFrame(function () {
        loop(scrollTop);

        // checked for fixed positioning here
        updateFixedPosition(innerHeight);
        ticking = false;
      });

      ticking = true;
    }
  }

  // start
  loop(scrollTop);
  onScroll();
}

const loop = function (scrollTop) {
  // Get all active instances
  const activeInstances = basicScroll.getActiveInstances(basicScroll.instances)
  // Only continue when active instances available
  if (activeInstances.length === 0) return;

  // Update instances
  basicScroll.updateInstancesProps(activeInstances, scrollTop);
}

function updateFixedPosition(innerHeight) {
  const fixedFrames = document.querySelectorAll('[data-fixed-el]');

  for (var i = 0; i < fixedFrames.length; i++) {
    const frame = fixedFrames[i];
    const size = frame.parentElement.getBoundingClientRect();

    let className;

    if (size.top > 0) {
      className = styles.stickyBefore;
    } else if (size.bottom < innerHeight) {
      const main = document.getElementById('scrollArea');
      if (main.classList.contains(styles.noAnimations)) {
        className = styles.stickyAfter;
      } else {
        if (!frame.dataset.keepFixed) {
          className = styles.stickyAfter;
        } else {
          className = styles.stickyDuring;
        }
      }
    } else {
      className = styles.stickyDuring;
    }

    frame.classList.remove(styles.stickyBefore);
    frame.classList.remove(styles.stickyAfter);
    frame.classList.remove(styles.stickyDuring);
    frame.classList.add(className);
  };
}
function preloadImages(scene, onImagesLoadedCb) {

  const images = scene.querySelectorAll('img[data-src]');
  if (!images.length) {
    if (onImagesLoadedCb) {
      onImagesLoadedCb();
    }
    return;
  }

  let loadedImages = 0;
  for (var i = 0; i < images.length; i++) {
    const img = images[i];
    if (img.src !== null && img.src.length > 0) {
      loadedImages++;
    }
  }

  // images have already been loaded
  const total = images.length - loadedImages;
  if (total <= 0 && onImagesLoadedCb) {
    onImagesLoadedCb();
    return;
  }

  let counter = 0;

  const onLoadCb = () => {
    counter++;
    if (counter === total && onImagesLoadedCb) {
      onImagesLoadedCb();
    }
  }

  const onErrorCb = () => {
    counter++;

    if (counter === total && onImagesLoadedCb) {
      onImagesLoadedCb();
    }
  }

  for (var i = 0; i < images.length; i++) {
    const img = images[i];
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.onload = onLoadCb;
      img.onerror = onErrorCb;
    }
  }
}

function preloadBackgrounds(scene) {
  const backgrounds = scene.querySelectorAll('[data-background-image]');

  for (var i = 0; i < backgrounds.length; i++) {
    const background = backgrounds[i];
    const url = background.dataset.backgroundImage;
    if (url && background) {
      background.style['background-image'] = `url(${url})`;
    }
  }
}

/**
 * Custom section animation begin
 */
function getAnimations1() {
  const animations = [];

  const figure = document.querySelector('[data-el="s1-figure"]');
  const figureContainer = document.querySelector('[data-el="s1-figureContainer"]');
  const text = document.querySelector('[data-el="s1-text"]');

  animations.push(basicScroll.create({
    elem: text,
    from: 'middle-middle',
    to: 'bottom-middle',
    direct: figure,
    props: {
      '--in-opacity': {
        from: '0',
        to: `0.99`,
      },
    }
  }));

  animations.push(basicScroll.create({
    elem: document.querySelector('[data-el="s1-textContainer"]'),
    from: 'top-bottom',
    to: 'bottom-top',
    direct: figureContainer,
    inside: (instance, percentage, props) => {
      applyScale(figureContainer, props['--innn-scale']);
    },
    outside: (instance, percentage, props) => {
      applyScale(figureContainer, props['--innn-scale']);
    },
    props: {
      '--innn-scale': {
        from: '1',
        to: `1.3`
      },
    }
  }));

  return animations;
}

function getAnimations2() {
  const animations = [];

  const handsRight = document.querySelector('[data-el="s2-handsRight"]');
  const handsLeft = document.querySelector('[data-el="s2-handsLeft"]');

  const bodyTop = document.querySelector('[data-el="s2-bodyTop"]');
  const bodyBottom = document.querySelector('[data-el="s2-bodyBottom"]');

  applyTransformX(handsRight, '30%');
  applyTransformX(handsLeft, '-30%');

  animations.push(basicScroll.create({
    elem: document.querySelector('[data-el="s2-frame"]'),
    from: COMIC_FROM,
    to: COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {

      const bodyPercentage = isMobile ? 40 : 25;
      if (percentage > bodyPercentage) {
        // transform body after 50%
        const r = ((percentage - bodyPercentage) * (0.07 * 2)).toFixed(4);
        applyTransformX(bodyTop, `${-r}%`);
        applyTransformX(bodyBottom, `${r}%`);
      }
      applyTransformX(handsRight, props['--handsRight']);
      applyTransformX(handsLeft, props['--handsLeft']);
    },
    props: {
      '--handsRight': {
        from: '30%',
        to: `0%`
      },
      '--handsLeft': {
        from: '-30%',
        to: `0%`
      },
      '--bodyRight': {
        from: '0%',
        to: `26%`
      },
      '--bodyLeft': {
        from: '0%',
        to: `-26%`
      },
    }
  }));

  return animations;
}

function getAnimations3() {
  const animations = [];

  const wallRight = document.querySelector('[data-el="s3-wallRight"]');
  const wallLeft = document.querySelector('[data-el="s3-wallLeft"]');

  const wallTransformValue = 37;
  applyTransformX(wallRight, `${wallTransformValue}%`);
  applyTransformX(wallLeft, `-${wallTransformValue}%`);

  const defaultProps = {
    '--wallRight': {
      from: `${wallTransformValue}%`,
      to: `0%`
    },
    '--wallLeft': {
      from: `-${wallTransformValue}%`,
      to: `0%`
    },
  };

  // only apply zoom on mobile
  const props = isMobile ? defaultProps : {
    ...defaultProps, '--mara-scale': {
      from: 1,
      to: 1.2,
      timing: 'sineOut'
    }
  }

  animations.push(basicScroll.create({
    elem: document.querySelector('[data-el="s3-frame"]'),
    from: COMIC_FROM,
    to: COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {
      applyTransformX(wallRight, props['--wallRight']);
      applyTransformX(wallLeft, props['--wallLeft']);
    },
    outside: (instance, percentage, props) => {
      applyTransformX(wallRight, props['--wallRight']);
      applyTransformX(wallLeft, props['--wallLeft']);
    },
    props,
  }));

  return animations;
}

function getAnimations4() {
  const animations = [];

  const imageRight = document.querySelector('[data-el="s4-imageRight"]');

  applyTransformXTransformY(imageRight, '10%', '10%')

  animations.push(basicScroll.create({
    elem: imageRight,
    from: WIDE_COMIC_FROM,
    to: WIDE_COMIC_TO,
    inside: (instance, percentage, props) => {
      imageRight.style['transition'] = PANEL_TRANSITION;
      applyTransformXTransformY(imageRight, '0%', '0%');
    },
    direct: true,
  }))

  const imageLeft = document.querySelector('[data-el="s4-imageLeft"]');
  const imageLeftSide = document.querySelector('[data-el="s4-man"]');

  applyTransformXTransformY(imageLeft, '-10%', '10%');
  applyOpacity(imageLeftSide, 0.01);

  animations.push(basicScroll.create({
    elem: imageLeft,
    from: WIDE_COMIC_FROM,
    to: WIDE_COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {
      imageLeft.style['transition'] = PANEL_TRANSITION;
      applyTransformXTransformY(imageLeft, '0%', '0%')
      if (percentage > 35) {
        applyOpacity(imageLeftSide, 0.99);
      }
    },
  }))

  return animations;
}


function getAnimations5() {
  const animations = [];

  const imageRight = document.querySelector('[data-el="s5-imageRight"]');
  const imageRightSide = document.querySelector('[data-el="s5-imageRightSide"]');

  applyTransformXTransformY(imageRight, '10%', '10%')
  applyOpacity(imageRightSide, 0.01);

  animations.push(basicScroll.create({
    elem: imageRight,
    from: WIDE_COMIC_FROM,
    to: WIDE_COMIC_TO,
    inside: (instance, percentage, props) => {
      imageRight.style['transition'] = PANEL_TRANSITION;
      applyTransformXTransformY(imageRight, '0%', '0%');
      if (percentage > 45) {
        applyOpacity(imageRightSide, 0.99);
      }
    },
    direct: true,
  }))

  const imageLeft = document.querySelector('[data-el="s5-imageLeft"]');
  const imageLeftSide = document.querySelector('[data-el="s5-imageLeftSide"]');

  applyTransformXTransformY(imageLeft, '-10%', '10%');
  applyOpacity(imageLeftSide, 0.01);

  animations.push(basicScroll.create({
    elem: imageLeft,
    from: WIDE_COMIC_FROM,
    to: WIDE_COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {
      imageLeft.style['transition'] = PANEL_TRANSITION;
      applyTransformXTransformY(imageLeft, '0%', '0%')
      if (percentage > 35) {
        applyOpacity(imageLeftSide, 0.99);
      }
    },
  }))

  return animations;
}

function getAnimations6() {
  const animations = [];
  const frame = document.querySelector('[data-el="s6-frame"]');
  const cells = document.querySelector('[data-el="s6-cells"]');

  animations.push(basicScroll.create({
    elem: frame,
    from: COMIC_FROM,
    to: COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {
      applyTransformY(cells, props['--scroll']);
    },
    outside: (instance, percentage, props) => {
      applyTransformY(cells, props['--scroll']);
    },
    props: {
      '--scroll': {
        from: '0%',
        to: `-70%`,
      },
    },
    direct: true,
  }));

  return animations;
}

function getAnimations7() {
  const animations = [];
  const frame = document.querySelector('[data-el="s7-frame"]');
  const row1 = document.querySelector('[data-el="s7-row1"]');
  const row2 = document.querySelector('[data-el="s7-row2"]');
  const row3 = document.querySelector('[data-el="s7-row3"]');
  const row4 = document.querySelector('[data-el="s7-row4"]');

  animations.push(basicScroll.create({
    elem: frame,
    from: COMIC_FROM,
    to: COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {
      applyTransformX(row1, `${props['--move']}%`);
      applyTransformX(row2, `${props['--move'] * -0.75}%`);
      applyTransformX(row3, `${props['--move'] * 1.2}%`);
      applyTransformX(row4, `${props['--move'] * -0.8}%`);
    },
    outside: (instance, percentage, props) => {
      applyTransformX(row1, `${props['--move']}%`);
      applyTransformX(row2, `${props['--move'] * -0.75}%`);
      applyTransformX(row3, `${props['--move'] * 1.2}%`);
      applyTransformX(row4, `${props['--move'] * -0.8}%`);
    },
    props: {
      '--move': {
        from: -10,
        to: 5,
      },
    },
    direct: true,
  }));

  return animations;
}

function getAnimations8() {

  const animations = [];
  const anchor = document.querySelector('[data-el="s8-sectionContainer"]');
  const maraFrame = document.querySelector('[data-el="s8-maraContainer"]');

  const cloudLeftLight = document.querySelector('[data-el="s8-cloudLeftLight"]');
  const cloudRightLight = document.querySelector('[data-el="s8-cloudRightLight"]');

  const cloudLeftDark = document.querySelector('[data-el="s8-cloudLeftDark"]');
  const cloudRightDark = document.querySelector('[data-el="s8-cloudRightDark"]');

  const overlay = document.querySelector('[data-el="s8-bg"]');

  animations.push(basicScroll.create({
    elem: anchor,
    from: 'top-bottom',
    to: 'bottom-top',
    direct: true,
    inside: (instance, percentage, props) => {
      applyTransformX(cloudLeftLight, `${props['--move']}%`);
      applyTransformX(cloudRightLight, `${props['--move'] * -0.6}%`);
      applyTransformX(cloudLeftDark, `${props['--move'] * 1.2}%`);
      applyTransformX(cloudRightDark, `${props['--move'] * -0.9}%`);

      applyScale(maraFrame, `${props['--mara-scale']}`);

      if (percentage > 15 && percentage < 80) {
        applyOpacity(overlay, 0.99);
      } else {
        applyOpacity(overlay, 0.01);
      }
    },
    outside: (instance, percentage, props) => {
      applyTransformX(cloudLeftLight, `${props['--move']}%`);
      applyTransformX(cloudRightLight, `${props['--move'] * -0.75}%`);
      applyTransformX(cloudLeftDark, `${props['--move'] * 1.44}%`);
      applyTransformX(cloudRightDark, `${props['--move'] * -0.7}%`);

      applyScale(maraFrame, `${props['--mara-scale']}`);
    },
    props: {
      '--move': {
        from: -55,
        to: isMobile ? 40 : 25,
        timing: 'sineOut',
      },
      '--mara-scale': {
        from: 1,
        to: 0.5,
        timing: 'sineIn'
      }
    },
  }));
  return animations;
}

function getAnimations9() {
  const animations = [];
  const girl = document.querySelector('[data-el="s9-girl"]');

  animations.push(basicScroll.create({
    elem: girl,
    from: COMIC_FROM,
    to: COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {
      const o = (percentage / 100 + 0.3).toFixed(4);
      const opacity = o > 1 ? 1 : o;
      applyOpacity(girl, `${opacity}`);
    },
    props: {
      '--transformX': {
        from: '30%',
        to: `-70%`,
      }
    },
    direct: true,
  }));

  const lightOverlays = document.querySelectorAll('[data-el="sAll-lightOverlay"]');
  const section4 = document.querySelector('[data-section="4"]');

  animations.push(basicScroll.create({
    elem: section4,
    from: 'top-bottom',
    to: 'bottom-top',
    direct: true,
    inside: (instance, percentage, props) => {
      // console.log(percentage);
      if (percentage > 10 && percentage < 90) {
        lightOverlays.forEach(o => {
          applyOpacity(o, 0.99);
        })
      } else {
        lightOverlays.forEach(o => {
          applyOpacity(o, 0.01);
        })
      }
    },
    outside: (instance, percentage, props) => {
      lightOverlays.forEach(o => {
        applyOpacity(o, 0.01);
      })
    },
    direct: true,
  }));

  return animations;
}

function getAnimations10() {
  const animations = [];

  const mum = document.querySelector('[data-el="s10-mum"]');
  const dad = document.querySelector('[data-el="s10-dad"]');
  const frame = document.querySelector('[data-el="s10-frame"]');

  const xVal = '45%';
  const yVal = '-4%';

  applyTransformXTransformY(mum, xVal, yVal);
  applyTransformXTransformY(dad, `-${xVal}`, yVal);

  animations.push(basicScroll.create({
    elem: frame,
    from: COMIC_FROM,
    to: COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {

      applyTransformXTransformYScale(mum, props['--moveX'], props['--moveY'], props['--scale']);
      applyTransformXTransformYScale(dad, `-${props['--moveX']}`, props['--moveY'], props['--scale']);
    },
    outside: (instance, percentage, props) => {

      applyTransformXTransformYScale(mum, props['--moveX'], props['--moveY'], props['--scale']);
      applyTransformXTransformYScale(dad, `-${props['--moveX']}`, props['--moveY'], props['--scale']);
    },
    props: {
      '--moveX': {
        from: xVal,
        to: `0%`
      },
      '--moveY': {
        from: yVal,
        to: `0%`
      },
      '--scale': {
        from: 1,
        to: isMobile ? 1.2 : 1.2,
      },
    }
  }));

  return animations;
}

function getAnimations11() {
  const animations = [];

  const imageRight = document.querySelector('[data-el="s11-imageRight"]');
  applyTransformXTransformY(imageRight, '10%', '10%')

  animations.push(basicScroll.create({
    elem: imageRight,
    from: WIDE_COMIC_FROM,
    to: WIDE_COMIC_TO,
    inside: (instance, percentage, props) => {
      imageRight.style['transition'] = PANEL_TRANSITION;
      applyTransformXTransformY(imageRight, '0%', '0%');
    },
    direct: true,
  }))

  const imageLeft = document.querySelector('[data-el="s11-imageLeft"]');

  applyTransformXTransformY(imageLeft, '-10%', '10%');

  animations.push(basicScroll.create({
    elem: imageLeft,
    from: WIDE_COMIC_FROM,
    to: WIDE_COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {
      imageLeft.style['transition'] = PANEL_TRANSITION;
      applyTransformXTransformY(imageLeft, '0%', '0%')
    },
  }))

  return animations;
}

function getAnimations12() {
  const animations = [];
  const lightOverlays = document.querySelectorAll('[data-el="sAll-lightOverlay"]');
  const section4 = document.querySelector('[data-section="4"]');

  animations.push(basicScroll.create({
    elem: section4,
    from: 'top-bottom',
    to: 'bottom-top',
    direct: true,
    inside: (instance, percentage, props) => {
      if (percentage > 10 && percentage < 90) {
        lightOverlays.forEach(o => {
          applyOpacity(o, 0.99);
        })
      } else {
        lightOverlays.forEach(o => {
          applyOpacity(o, 0.01);
        })
      }
    },
    outside: (instance, percentage, props) => {
      lightOverlays.forEach(o => {
        applyOpacity(o, 0.01);
      })
    },
    direct: true,
  }));

  const maraXavier = document.querySelector('[data-el="s12-maraXavier"]');
  const frame = document.querySelector('[data-el="s12-frame"]');

  animations.push(basicScroll.create({
    elem: frame,
    from: 'middle-bottom',
    to: COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {
      applyOpacity(maraXavier, props['--opacity']);
    },
    outside: (instance, percentage, props) => {
      applyOpacity(maraXavier, props['--opacity']);
    },
    props: {
      '--opacity': {
        from: `0.01`,
        to: `0.8`
      },
    }
  }));

  return animations;
}

function getAnimations13() {
  const animations = [];

  const topPanel = document.querySelector('[data-el="s13-topPanel"]');
  const bottomPeople = document.querySelector('[data-el="s13-bottomPeople"]');
  const frame = document.querySelector('[data-el="s13-frame"]');

  animations.push(basicScroll.create({
    elem: frame,
    from: COMIC_FROM,
    to: COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {
      applyTransformXTransformY(topPanel, props['--top-moveX'], props['--top-moveY']);
      applyTransformXTransformYScale(bottomPeople, props['--bottom-moveX'], props['--bottom-moveY'], props['--bottom-scale']);
    },
    props: {
      '--top-moveX': {
        from: `-2%`,
        to: `0%`
      },
      '--top-moveY': {
        from: `-12%`,
        to: `3%`
      },
      '--bottom-moveX': {
        from: `-1%`,
        to: `10%`
      },
      '--bottom-moveY': {
        from: `3%`,
        to: `-2`
      },
      '--bottom-scale': {
        from: `1`,
        to: `0.85`
      },
    }
  }));

  return animations;
}

function getAnimations14() {
  const animations = [];
  const anchor = document.querySelector('[data-el="s14-sectionContainer"]');
  const mara = document.querySelector('[data-el="s14-maraContainer"]');

  const bg = document.querySelector('[data-el="s14-bg"]');
  animations.push(basicScroll.create({
    elem: anchor,
    from: 'top-bottom',
    to: 'bottom-top',
    direct: true,
    inside: (instance, percentage, props) => {
      applyTransformXTransformY(mara, props['--moveX'], props['--moveY']);
      applyTransformXTransformY(mara, `-${props['--moveX']}`, props['--moveY']);
      applyScale(bg, props['--bg-scale']);
    },
    outside: (instance, percentage, props) => {
      applyTransformXTransformY(mara, props['--moveX'], props['--moveY']);
      applyTransformXTransformY(mara, `-${props['--moveX']}`, props['--moveY']);
      applyScale(bg, props['--bg-scale']);
    },
    props: {
      '--moveX': {
        from: `-30%`,
        to: `0%`,
      },
      '--moveY': {
        from: `-15%`,
        to: `0%`,
        timing: 'sineOut',
      },
      '--bg-scale': {
        from: `1.1`,
        to: `0.9`,
      },
    }
  }));
  return animations;
}

function getAnimations15() {
  const animations = [];

  const bubble = document.querySelector('[data-el="s15-dreamBubble"]');
  const mara = document.querySelector('[data-el="s15-mara"]');
  const frame = document.querySelector('[data-el="s15-frame"]');

  animations.push(basicScroll.create({
    elem: frame,
    from: COMIC_FROM,
    to: COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {
      applyTransformXTransformY(bubble, props['--bubble-moveX'], props['--bubble-moveY']);
      applyTransformY(mara, props['--mara-moveY'], props['--mara-moveY']);
    },
    props: {
      '--bubble-moveX': {
        from: `-8%`,
        to: `6%`
      },
      '--bubble-moveY': {
        from: `-4%`,
        to: `5%`
      },
      '--bubble-scale': {
        from: `0.8`,
        to: `1`
      },
      '--mara-moveY': {
        from: `15%`,
        to: `-5%`
      },
    }
  }));

  return animations;
}

function getAnimations16() {
  const animations = [];

  const prisoners = document.querySelector('[data-el="s16-prisoners"]');
  const frame = document.querySelector('[data-el="s16-frame"]');

  const bars = document.querySelector('[data-el="s16-bars"]');

  animations.push(basicScroll.create({
    elem: frame,
    from: COMIC_FROM,
    to: COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {
      applyTransformXTransformYScale(prisoners, props['--prisoners-moveX'], props['--prisoners-moveY'], props['--prisoners-scale']);
      applyOpacity(prisoners, props['--prisoners-opacity']);
      applyScale(bars, props['--bars-scale']);
    },
    props: {
      '--prisoners-moveX': {
        from: `0%`,
        to: `0%`
      },
      '--prisoners-moveY': {
        from: `-8%`,
        to: `13%`
      },
      '--prisoners-opacity': {
        from: `0.01`,
        to: `0.99`,
        timing: 'sineOut',
      },
      '--bubbles-opacity': {
        from: `0.01`,
        to: `0.99`,
        timing: 'sineOut',
      },
      '--prisoners-scale': {
        from: `1`,
        to: `1.35`
      },
      '--bars-scale': {
        from: `1.4`,
        to: `1`
      },
    }
  }));

  return animations;
}

function getAnimations17() {
  const animations = [];
  const anchor = document.querySelector('[data-el="s17-sectionContainer"]');
  const mara = document.querySelector('[data-el="s17-mara"]');

  const bg = document.querySelector('[data-el="s17-bg"]');

  animations.push(basicScroll.create({
    elem: anchor,
    from: 'top-bottom',
    to: 'bottom-top',
    direct: true,
    inside: (instance, percentage, props) => {
      applyTransformXTransformY(mara, props['--moveX'], props['--moveY']);
      applyTransformXTransformY(mara, `-${props['--moveX']}`, props['--moveY']);
      applyScale(bg, props['--bg-scale']);
    },
    outside: (instance, percentage, props) => {
      applyTransformXTransformY(mara, props['--moveX'], props['--moveY']);
      applyTransformXTransformY(mara, `-${props['--moveX']}`, props['--moveY']);
      applyScale(bg, props['--bg-scale']);
    },
    props: {
      '--moveX': {
        from: `0%`,
        to: `0%`,
      },
      '--moveY': {
        from: `20%`,
        to: `-15%`,
      },
      '--bg-scale': {
        from: `1.2`,
        to: `0.95`,
      },
    }
  }));
  return animations;
}

function getAnimations18() {
  const animations = [];

  const legs = document.querySelector('[data-el="s18-legs"]');
  const mara = document.querySelector('[data-el="s18-mara"]');
  const frame = document.querySelector('[data-el="s18-frame"]');

  animations.push(basicScroll.create({
    elem: frame,
    from: COMIC_FROM,
    to: COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {
      applyTransformXTransformYScale(legs, props['--legs-moveX'], props['--legs-moveY'], props['--legs-scale']);
      applyScale(mara, props['--mara-scale'])
    },
    props: {
      '--legs-scale': {
        from: `1`,
        to: `1.2`
      },
      '--legs-moveY': {
        from: `-2%`,
        to: `2%`
      },
      '--legs-moveX': {
        from: `7%`,
        to: `-3%`
      },
      '--mara-scale': {
        from: `1`,
        to: `0.8`
      }
    }
  }));

  return animations;
}

function getAnimations19() {
  const animations = [];

  const bg = document.querySelector('[data-el="s19-bg"]');
  const frame = document.querySelector('[data-el="s19-frame"]');

  const shadow1 = document.querySelector('[data-el="s19-shadow1"]');
  const shadow2 = document.querySelector('[data-el="s19-shadow2"]');
  const shadow3 = document.querySelector('[data-el="s19-shadow3"]');
  const shadow4 = document.querySelector('[data-el="s19-shadow4"]');

  applyOpacity(shadow2, 0.01);
  applyOpacity(shadow3, 0.01);
  applyOpacity(shadow4, 0.01);

  animations.push(basicScroll.create({
    elem: frame,
    from: COMIC_FROM,
    to: COMIC_TO,
    direct: true,
    inside: (instance, percentage, props) => {
      applyOpacity(shadow1, props['--shadow-opacity'])
      if (percentage > 24) {
        const a = percentage * 7 / 100;
        applyOpacity(shadow2, (percentage - 24) / 100);
      }
      if (percentage > 32) {
        const a = percentage * 7 / 100;
        applyOpacity(shadow3, (percentage - 32) / 100);
      }
      if (percentage > 8) {
        const a = percentage * 7 / 100;
        applyOpacity(shadow4, (percentage - 8) / 100);
      }
      applyScale(bg, props['--bg-scale'])
    },
    props: {
      '--bg-scale': {
        from: `1`,
        to: `0.78`
      },
      '--shadow-opacity': {
        from: 0.01,
        to: 0.8,
      },
    }
  }));

  return animations;
}

function getAnimations20() {

  const animations = [];

  const anchor = document.querySelector('[data-el="s20-sectionContainer"]');

  const mara1 = document.querySelector('[data-el="s20-mara1"]');
  const mara2 = document.querySelector('[data-el="s20-mara2"]');
  const mara3 = document.querySelector('[data-el="s20-mara3"]');
  const mara4 = document.querySelector('[data-el="s20-mara4"]');
  const mara5 = document.querySelector('[data-el="s20-mara5"]');
  const mara6 = document.querySelector('[data-el="s20-mara6"]');

  animations.push(basicScroll.create({
    elem: anchor,
    from: 'top-bottom',
    to: 'bottom-top',
    direct: true,
    inside: (instance, percentage, props) => {
      applyTransformY(mara1, `${props['--moveBottom'] * 1.1}%`);
      applyTransformY(mara2, `${props['--moveBottom'] * 1.5}%`);
      applyTransformY(mara3, `${props['--m3-moveTop'] * 0.9}%`);
      applyTransformY(mara4, `${props['--moveBottom'] * 1.2}%`);
      applyTransformY(mara5, `${props['--moveTop'] * 0.7}%`);
      applyTransformY(mara6, `${props['--moveTop'] * 1}%`);
    },
    outside: (instance, percentage, props) => {
      applyTransformY(mara1, `${props['--moveBottom'] * 1.1}%`);
      applyTransformY(mara2, `${props['--moveBottom'] * 1.5}%`);
      applyTransformY(mara3, `${props['--m3-moveTop'] * 0.9}%`);
      applyTransformY(mara4, `${props['--moveBottom'] * 1.2}%`);
      applyTransformY(mara5, `${props['--moveTop'] * 0.7}%`);
      applyTransformY(mara6, `${props['--moveTop'] * 1}%`);
    },
    props: {
      '--moveTop': {
        from: 20,
        to: 0,
      },
      '--moveBottom': {
        from: -1,
        to: 7,
      },
      '--m3-moveTop': {
        from: 23,
        to: 0,
      },
    },
  }));
  return animations;
}

function applyTransformX(el, value) {
  el.style["transform"] = `translateX(${value}) translateZ(0)`;
}

function applyTransformY(el, value) {
  el.style["transform"] = `translateY(${value}) translateZ(0)`;
}

function applyOpacity(el, value) {
  el.style["opacity"] = value;
}

function applyTransformXTransformY(el, value1, value2) {
  el.style["transform"] = `translateX(${value1}) translateY(${value2}) translateZ(0)`;
}

function applyTransformXTransformYScale(el, value1, value2, value3) {
  el.style["transform"] = `translateX(${value1}) translateY(${value2}) translateZ(0) scale(${value3})`;
}

function applyTransformXScale(el, value1, value2) {
  el.style["transform"] = `translateX(${value1}) scale(${value2}) translateZ(0)`;
}

function applyScale(el, value) {
  el.style["transform"] = `scale(${(+value).toFixed(4)}) translateZ(0)`;
}