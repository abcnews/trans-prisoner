import styles from './styles.scss';

import classnames from 'classnames';
import { animate } from './animate';
import acto from '@abcnews/alternating-case-to-object';

import anchors from '../../odyssey/src/app/utils/anchors';
import { selectMounts, isMount } from "@abcnews/mount-utils";

const text = {
  frame1: '<p id="hardcoded">It’s 2018. I’m a woman in a men’s prison - why am I here?</p>',
  frame2: '<p>On entry, they strip search me. Two male officers inspect my bottom half, but two female officers inspect my top half.</p>',
  frame3: '<p>I\'m terrified. I don\'t know what\'s going to happen. If I can just get through the night...</p>',
  frame4_1: '<p>About a week later, I’m on a phone call and I can’t hear.</p>',
  frame4_2: '<p>This dude is walking up and down the hall saying some outer space shit. I yell at him so the guards put us in our cells to cool off. </p>',
  frame5_1: '<p>Later on, the same guy looks at me - mumbling under his breath.</p><p>“What did you call me?” I ask. </p><p>“I called you a faggot”. <br> </p><p>So I punch him.<br> </p>',
  frame5_2: '<p>I’m handcuffed and taken to Unit One.<br> </p>',
  frame6: '<p>Unit One is the punishment unit. You go there if you fuck up. <br><br>You\'re in isolation... only allowed out for an hour a day.<br> </p>',
  frame7_1: '<p>When my punishment finishes they take me to a different part of Unit One.<br> </p>',
  frame7_2: '<p>Spending 21 hours a day in your cell is excruciating. <br><br>You wake up really early in the morning wishing you\'d had ten hours more sleep. <br><br>There\'s no room to move.<br><br>It’s like the prison couldn\'t come up with a good, safe way to deal with me, and I’m being punished for it. <br> </p>',
  frame8_1: '<p>I’ve felt alone before, but this is much worse. There are times I feel like I can’t get through. My mind is breaking...<br> </p>',
  frame8_2: '<p>All these crazy conversations in my head at night... I revisit all the shit that led me to prison in the first place.<br> </p>',
  frame9: '<p>I grew up in a small town. At 16, I felt like I was definitely a girl. <br><br>It was scary... you’re a bit wary of how the world might react.<br> </p>',
  frame10_1: '<p>When I came out to my dad and step-mum, I felt really lonely and isolated.</p><p>They could’ve helped me move forward, but instead urged me to keep it a secret.<br> </p>',
  frame10_2: '<p>After high school I moved out. Conflict at home resulted in me getting punched in the face. I felt unsafe.<br> </p>',
  frame11_1: '<p>I couch surfed and eventually became homeless.<br> </p>',
  frame11_2: '<p>I was suicidal at the time... Heroin made everything just float away.<br> </p>',
  frame12: '<p>My relationship was turbulent. I was charged with assaulting my partner. Two weeks later I assaulted two police officers and that’s how I ended up in prison.<br> </p>',
  frame13_1: '<p>I\'ve been inside for three months. Now I get to go back to court. I just want out. I’m feeling hectic. Mentally fried from enduring the days of isolation.<br> </p>',
  frame13_2: '<p>After the hearing, I realise I’m not going home. I flip out. I feel like they’re not listening to me. I start yelling.<br> </p>',
  frame13_3: '<p>This guard sort of grabs me from behind. I think he’s attacking me so I turn around to hold him at arm\'s length. More guards come in and drag me along.<br> </p>',
  frame14_1: '<p>My punishment has been going for a few days now…<br> </p>',
  frame14_2: '<p>They come to me and say, “Because of your little stunt with the guards at the video link, we\'re sending you to mainstream”.<br> </p>',
  frame15: '<p>So after months in isolation, all of a sudden I\'m allowed to go to the fucking mainstream prison and share a cell with a dude? <br><br>Why are you sending me here after you’ve been keeping me segregated from the rest of the population up until now? Why?<br> </p>',
  frame16: '<p>I get to the end cell and look back towards the gate and everyone is standing in the hallway staring at me. I hear someone say, “What the fuck?” <br><br>I’m getting everyone\'s attention. I’m terrified and shaking.<br> </p>',
  frame17_1: '<p>I feel constantly harassed and there is no privacy. I feel like I’ve lost control of my identity and my body.<br> </p>',
  frame17_2: '<p>I hate being so seen... like I can’t hide myself away. <br><br>Being a transwoman in a men’s prison, you don\'t get to just do prison... you have to be constantly experienced by other people.<br> </p>',
  frame18_1: '<p>One day I’m in my cell and these two dudes come in... <br><br>They are pressuring me to suck their dicks. I’m telling them I don’t want to. They keep going. <br><br>I don’t want to be beaten up or anything... I don’t know what to do… so I finally concede and go to do it… but they leave. <br><br>I feel like all my power has been taken away from me.<br> </p>',
  frame18_2: '<p>What concern is there for my safety? I feel very angry they put me in this position.</p>',
  frame19: '<p>When I got out… I managed to stay sober for a year, but I’m not sober now. <br><br><br>I’ve had time to reflect on my actions. I still have the same anger. It’s tough.</p>',
  frame20_1: '<p>I\'m not hopeful about the future. I\'m just doing things so that I have a future, and hopefully I find hope along the way.<br> </p>',
  frame20_2: '<p>I could have done prison in a way that didn\'t put me through such a traumatic, horrible experience. </p>'
}

export default function App({ projectName, env }) {

  window.onload = function () {
    getText();
  };

  this.el = document.createElement('div');
  this.el.className = styles.root;

  const getUrl = (img) => getImgUrl(img, env);

  this.el.innerHTML = getDom(getUrl);

  // Needs timeout after innerHTML so that layout can be calculated properly for animations
  setTimeout(() => animate(), 300)
}

function getText() {


  selectMounts('slide').forEach((slide, index) => {
    // const paras = slide && slide.betweenNodes;
    // console.log(slide);

    const panels = [];
    let contentEl = slide.nextElementSibling;
    let hasMoreContent = true;
    while (hasMoreContent && contentEl) {
      if (isMount(contentEl, `endslide`, true)) {
        hasMoreContent = false;
      } else {
        panels.push(contentEl);
        contentEl = contentEl.nextElementSibling;
      }
    }

    const config = acto(slide.getAttribute('id'));

    const frameText = config.text ? `frame${config.frame}_${config.text}` : `frame${config.frame}`;

    if (frameText && panels.length > 0) {
      const frameTextEl = document.querySelector(`[data-text="${frameText}"]`)
      if (frameTextEl) {
        frameTextEl.innerHTML = '';
        for (var i = 0; i < panels.length; i++) {
          const para = panels[i];
          frameTextEl.appendChild(para.cloneNode(true));
        }
      }
    }

    for (var i = 0; i < panels.length; i++) {
      const para = panels[i];
      // remove from dom
      para.parentNode.removeChild(para);
    }
  })
}

function getDom(getUrl) {
  const width = window.innerWidth;
  const isMobile = !!(width < 800);

  return `
    <main id="scrollArea" class="${styles.main}">

      <section data-section="1" data-scene="1" class="${classnames(styles.section, styles.section1)}">
        <div data-fixed-el class="${classnames(styles.sticky, styles.full)}">
            
          <div class="${classnames(styles.scene1)}">
            <div class="${classnames(styles.fillParent, styles.bg)}">
            </div>
            <div class="${styles.prisoners}">
            </div>
            <div data-el="s1-figureContainer" class="${styles.mara}">
              <img src="${getUrl("s1-mara-shadow.png")}">
              <img data-el="s1-figure" class="${styles.figure}" src="${getUrl("s1-mara.png")}">
            </div>
            <div class="${styles.bars}">
            </div>
          </div>

        </div>
        <div class="${styles.space}"></div>
        <div data-el="s1-textContainer" class="${classnames(styles.textContainer, styles.textCenter, styles.inCloud, styles.tall, styles.first)}">
          <div data-el="s1-text" data-text="frame1" class="${styles.text}">
            ${text.frame1}
          </div>
        </div>
      </section>

      <section data-section="2" class="${classnames(styles.section, styles.section2)}">
       
        <div data-scene="2" class="${classnames(styles.comicContainer, styles.scene2)}">
          <div class="${classnames(styles.imagesContainer, styles.half)}">
            <div data-el="s2-frame" class="${styles.frame}">
              <div data-el="s2-handsLeft" class="${classnames(styles.hands, styles.left)}">
                <img src="${getUrl("s2-hands-left.png")}">
              </div>
              <div data-el="s2-handsRight" class="${classnames(styles.hands, styles.right)}">
                <img src="${getUrl("s2-hands-right.png")}">
              </div>
              <div data-el="s2-bodyTop" class="${styles.bodyTop}">
                <img src="${getUrl("s2-top.png")}">
              </div>
              <div data-el="s2-bodyBottom" class="${styles.bodyBottom}">
                <img src="${getUrl("s2-bottom.png")}">
              </div>
              <div data-el="s2-line" class="${styles.line}">
                <img src="${getUrl("s2-line.png")}">
              </div>
            </div>
          </div>
          <div class="${classnames(styles.textContainer, styles.half)}">
            <div data-text="frame2" class="${styles.text}">
              ${text.frame2}
            </div>
          </div>
        </div>
        
        <div data-scene="3" class="${classnames(styles.comicContainer, styles.textFirst, styles.scene3)}">
          <div class="${classnames(styles.imagesContainer, styles.half)}">
            <div data-el="s3-frame" class="${styles.frame}">
              <div data-el="s3-backWall" class="${styles.backWall}">
                <img data-src="${getUrl("s3-back-wall.jpg")}">
              </div>
              <div data-el="s3-mara" class="${styles.mara}">
               <img data-src="${getUrl("s3-mara.png")}">
              </div>
              <div data-el="s3-wallLeft" class="${classnames(styles.wall, styles.left)}">
                <img data-src="${getUrl("s3-brick-left.jpg")}">
              </div>
              <div data-el="s3-wallRight" class="${classnames(styles.wall, styles.right)}">
                <img data-src="${getUrl("s3-brick-right.jpg")}">
              </div>
            </div>
          </div>
          <div class="${classnames(styles.textContainer, styles.half)}">
            <div data-text="frame3" class="${styles.text}">
              ${text.frame3}
            </div>
          </div>
        </div>

        <div class="${styles.wideComicContainerWrapper}">
          <div data-scene="4" class="${classnames(styles.wideComicContainer, styles.scene4)}">

            <div class="${classnames(styles.textContainer, styles.first)}">
              <div data-text="frame4_1" class="${styles.text}">
                ${text.frame4_1}
              </div>
            </div>

            <div class="${classnames(styles.panelContainer, styles.left, styles.first, styles.small, styles.withShadow)}">

              <div data-el="s4-man" class="${styles.man}">
                <img data-src="${getUrl("s4-man.png")}">
              </div>
              <div data-el="s4-imageLeft" class="${classnames(styles.image, styles.imageLeft)}">
                <div class="${styles.imageInner}">
                  <img data-src="${getUrl("s4-top-panel.png")}">
                </div>
              </div>
            </div>

            <div class="${classnames(styles.textContainer, styles.second)}">
              <div data-text="frame4_2" class="${styles.text}">
                ${text.frame4_2}
              </div>
            </div>

            <div class="${classnames(styles.panelContainer, styles.right, styles.last, styles.small)}">
              <div data-el="s4-imageRight" class="${classnames(styles.image)}">
                <div class="${styles.imageInner}">
                  <img data-src="${getUrl("s4-bottom-panel.png")}">
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <div class="${styles.wideComicContainerWrapper}">
          <div data-scene="5" class="${classnames(styles.wideComicContainer, styles.scene5)}">
            
            <div class="${classnames(styles.textContainer, styles.firstText)}">
              <div data-text="frame5_1" class="${styles.text}">
                ${text.frame5_1}
              </div>
            </div>

            <div class="${classnames(styles.panelContainer, styles.right, styles.first)}">
              <div data-el="s5-imageRightSide" class="${styles.sideImage}">
                <img data-src="${getUrl("s5-top-bubble.png")}">
              </div>
              <div data-el="s5-imageRight" class="${styles.image}">
                <div class="${styles.imageInner}">
                  <img data-src="${getUrl("s5-top-panel.png")}">
                </div>
              </div>
            </div>
            
            <div class="${classnames(styles.panelContainer, styles.left, styles.last)}">
              <div data-el="s5-imageLeft" class="${styles.image}">
                <div class="${styles.imageInner}">
                  <img data-src="${getUrl("s5-bottom-panel.png")}">
                </div>
              </div>
              <div data-el="s5-imageLeftSide" class="${styles.sideImage}">
                <img data-src="${getUrl("s5-bottom-bubble.png")}">
              </div>
            </div>

            <div class="${classnames(styles.textContainer)}">
              <div data-text="frame5_2" class="${styles.text}">
                ${text.frame5_2}
              </div>
            </div>

          </div>
        </div>

        <div data-scene="6" class="${classnames(styles.comicContainer, styles.textFirst, styles.scene6)}">
          <div class="${classnames(styles.imagesContainer, styles.half)}">
            <div data-el="s6-frame" class="${styles.frame}">
              <div data-el="s6-cells" class="${classnames(styles.cells, styles.willTransform)}">
                <img data-src="${getUrl("s6-cells.jpg")}">
              </div>
              <div data-el="s6-mara" class="${styles.mara}">
                <img data-src="${getUrl("s6-mara-guards.png")}">
              </div>
            </div>
          </div>
          <div class="${classnames(styles.textContainer, styles.half)}">
            <div data-text="frame6" class="${styles.text}">
              ${text.frame6}
            </div>
          </div>
        </div>
        
        <div class="${styles.textBlock}">
          <div class="${classnames(styles.textContainer)}">
            <div data-text="frame7_1" class="${styles.text}">
              ${text.frame7_1}
            </div>
          </div>
        </div>

        <div data-scene="7" class="${classnames(styles.comicContainer, styles.scene7)}">
          <div class="${classnames(styles.imagesContainer, styles.half)}">
            <div data-el="s7-frame" class="${styles.frame}">
              <div data-el="s7-row1" class="${styles.row1}">
                <img data-src="${getUrl("s7-row1.png")}">
              </div>
              <div data-el="s7-row2" class="${styles.row2}">
                <img data-src="${getUrl("s7-row2.png")}">
              </div>
              <div data-el="s7-row3" class="${styles.row3}">
                <img data-src="${getUrl("s7-row3.png")}">
              </div>
              <div data-el="s7-row4" class="${styles.row4}">
                <img data-src="${getUrl("s7-row4.png")}">
              </div>
            </div> 
          </div>
          <div class="${classnames(styles.textContainer, styles.half, styles.negativeMargin)}">
            <div data-text="frame7_2" class="${styles.text}">
              ${text.frame7_2}
            </div>
          </div>
        </div>

      </section>
      
      <section data-scene="8" data-el="s8-sectionContainer" data-section="3" class="${classnames(styles.section, styles.section3, styles.full, styles.scene8)}">
        
        <div data-el="sAll-lightOverlay" class="${classnames(styles.fillParent, styles.lightOverlay)}">
        </div>
        
        <div data-fixed-el class="${classnames(styles.sticky, styles.full)}">
          <div data-el="s8-bg" class="${classnames(styles.fillParent, styles.bg)}" data-background-image="${getUrl("s8-bg.jpg")}">
          </div>
          <div data-el="s8-maraContainer" class="${styles.maraContainer}">
            <img data-src="${getUrl("s8-mara.png")}">
          </div>
          <div class="${styles.cloudsContainer}">
            <div data-el="s8-cloudLeftLight" class="${styles.cloudLeftLight}">
              <img data-src="${getUrl("s8-left-bottom.png")}">
            </div>
            <div data-el="s8-cloudRightLight" class="${styles.cloudRightLight}">
              <img data-src="${getUrl("s8-right-top.png")}">
            </div>
            <div data-el="s8-cloudRightDark" class="${styles.cloudRightDark}">
              <img data-src="${getUrl("s8-right-bottom.png")}">
            </div>
            <div data-el="s8-cloudLeftDark" class="${styles.cloudLeftDark}">
              <img data-src="${getUrl("s8-left-top.png")}">
            </div>
          </div>
        </div>
        <div data-el="s8-textContainer" class="${classnames(styles.textContainer, styles.first, styles.textCenter, styles.inCloud, styles.tall)}">
          <div data-text="frame8_1" class="${styles.text}">
            ${text.frame8_1}
          </div>
        </div>
        <div class="${classnames(styles.textContainer, styles.second, styles.textCenter, styles.inCloud, styles.tall)}">
          <div data-text="frame8_2" class="${styles.text}">
            ${text.frame8_2}
          </div>
        </div>
      </section>

      <section data-section="4" class="${classnames(styles.section, styles.section4, styles.full)}">
        <div data-el="sAll-lightOverlay" class="${classnames(styles.fillParent, styles.lightOverlay)}">
        </div>
        <div data-scene="9" class="${classnames(styles.comicContainer, styles.scene9)}">
          <div class="${classnames(styles.imagesContainer, styles.half)}">
            <div data-el="s9-frame" class="${styles.frame}">
              <div data-el="s9-house" class="${styles.house}">
                <img data-src="${getUrl("s9-house.jpg")}">
              </div>
              <div data-el="s9-girl" class="${classnames(styles.girl, styles.person)}">
                <img data-src="${getUrl("s9-girl.png")}">
              </div>
              <div data-el="s9-pre" class="${classnames(styles.pre, styles.person)}">
                <img data-src="${getUrl("s9-pre.png")}">
              </div>
            </div>
          </div>
          <div class="${classnames(styles.textContainer, styles.half, styles.dark)}">
            <div data-text="frame9" class="${styles.text}">
              ${text.frame9}
            </div>
          </div>
        </div>

        <div data-scene="10" class="${classnames(styles.comicContainer, styles.textFirst, styles.scene10)}">
          <div class="${classnames(styles.imagesContainer, styles.half)}">
            <div data-el="s10-frame" class="${styles.frame}" data-background-image="${getUrl("s10-bg.jpg")}">
              <div data-el="s10-dad" class="${classnames(styles.dad, styles.person)}">
                <img data-src="${getUrl("s10-dad.png")}">
              </div>
              <div data-el="s10-mum" class="${classnames(styles.mum, styles.person)}">
                <img data-src="${getUrl("s10-mum.png")}">
              </div>
              <div data-el="s10-mara" class="${classnames(styles.mara, styles.person)}">
                <img data-src="${getUrl("s10-mara.png")}">
              </div>
            </div>
          </div>
          <div class="${classnames(styles.textContainer, styles.half, styles.dark)}">
            <div data-text="frame10_1" class="${styles.text}">
              ${text.frame10_1}
            </div>
          </div>
        </div> 

        <div class="${styles.textBlock}">
          <div class="${classnames(styles.textContainer, styles.dark)}">
            <div data-text="frame10_2" class="${styles.text}">
              ${text.frame10_2}
            </div>
          </div>
        </div>

        <div class="${styles.wideComicContainerWrapper}">
          <div data-scene="11" class="${classnames(styles.wideComicContainer, styles.scene11)}">
            
            <div class="${classnames(styles.panelContainer, styles.left, styles.first)}">
              <div data-el="s11-imageLeft" class="${styles.image}">
                <div class="${styles.imageInner}">
                  <img data-src="${getUrl("s11-top-panel.png")}">
                </div>
              </div>
            </div>
            
            <div class="${classnames(styles.textContainer, styles.dark)}">
              <div data-text="frame11_1" class="${styles.text}">
                ${text.frame11_1}
              </div>
            </div>

            <div class="${classnames(styles.panelContainer, styles.right, styles.last)}">
              <div data-el="s11-imageRight" class="${styles.image}">
                <div class="${styles.imageInner}">
                  <img data-src="${getUrl("s11-bottom-panel.png")}">
                </div>
              </div>
            </div>

            <div class="${classnames(styles.textContainer, styles.dark)}">
              <div data-text="frame11_2" class="${styles.text}">
                ${text.frame11_2}
              </div>
            </div>

          </div>
        </div>

        <div data-scene="12" class="${classnames(styles.comicContainer, styles.scene12)}">
          <div class="${classnames(styles.imagesContainer, styles.half)}">
            <div data-el="s12-frame" class="${styles.frame}">
              <div data-el="s12-shelf" class="${styles.shelf}">
                <img data-src="${getUrl("s12-shelf.jpg")}">
              </div>
              <div data-el="s12-maraXavier" class="${classnames(styles.maraXavier)}">
                <img data-src="${getUrl("s12-mara-xavier.png")}">
              </div>
            </div>
          </div>
          <div class="${classnames(styles.textContainer, styles.half, styles.dark)}">
            <div data-text="frame12" class="${styles.text}">
              ${text.frame12}
            </div>
          </div>
        </div>

      </section>

       
      <section data-section="5" class="${classnames(styles.section, styles.section5)}">
        <div  data-el="sAll-lightOverlay" class="${classnames(styles.fillParent, styles.lightOverlay)}">
        </div>
        
        <div class="${styles.textBlock}">
          <div class="${classnames(styles.textContainer)}">
            <div data-text="frame13_1" class="${styles.text}">
              ${text.frame13_1}
            </div>
          </div>
        </div>

        <div data-scene="13" class="${classnames(styles.comicContainer, styles.textFirst, styles.scene13)}">
          <div class="${classnames(styles.imagesContainer, styles.half)}">
            
            <div class="${classnames(styles.mobileOnly, styles.whiteText)}">
                ${text.frame13_2}
            </div>

            <div data-el="s13-frame" class="${styles.frame}">
              <div data-el="s13-bottomPanel" class="${classnames(styles.bottomPanel)}">
                <div class="${classnames(styles.bottomBg)}">
                  <img data-src="${getUrl("s13-bottom-bg.png")}">
                </div>
                <div data-el="s13-bottomPeople" class="${classnames(styles.bottomPeople)}">
                  <img data-src="${getUrl("s13-bottom-people.png")}">
                </div>
              </div>
              <div data-el="s13-topPanel" class="${classnames(styles.topPanel)}">
                <img data-src="${getUrl("s13-top-panel.png")}">
              </div>
            </div>
          </div>
          <div class="${classnames(styles.textContainer, styles.half)}">
            <div class="${styles.text}">
              <span data-text="frame13_2" class="${styles.desktopOnly}">
                ${text.frame13_2}
              </span>
              <span data-text="frame13_3">
                ${text.frame13_3}
              </span>
            </div>
          </div>
        </div>

      </section>


      <section data-scene="14" data-el="s14-sectionContainer" data-section="6" class="${classnames(styles.section, styles.section6, styles.full, styles.scene14)}">
        
        <div data-fixed-el class="${classnames(styles.sticky, styles.full)}">
          <div data-el="s14-bg" class="${classnames(styles.fillParent)}" data-background-image="${getUrl("s14-background.jpg")}">
          </div>
          <div data-el="s14-maraContainer" class="${styles.maraContainer}">
            <img data-src="${getUrl("s14-mara.png")}">
          </div>
        </div>
        <div data-el="s14-textContainer" class="${classnames(styles.textContainer, styles.first, styles.textCenter, styles.inCloud, styles.tall)}">
          <div data-text="frame14_1" class="${styles.text}">
            ${text.frame14_1}
          </div>
        </div>
        <div class="${classnames(styles.textContainer, styles.second, styles.textCenter, styles.inCloud, styles.tall)}">
          <div data-text="frame14_2" class="${styles.text}">
            ${text.frame14_2}
          </div>
        </div>

      </section>

      <section data-section="7" class="${classnames(styles.section, styles.section7, styles.full)}">

        <div data-scene="15" class="${classnames(styles.comicContainer, styles.scene15)}">
          <div class="${classnames(styles.imagesContainer, styles.half)}">
            <div data-el="s15-frame" class="${styles.frame}">
              <div data-el="s15-dreamBubble" class="${styles.dreamBubble}">
                <img data-src="${getUrl("s15-dream-bubble.png")}">
              </div>
              <div data-el="s15-mara" class="${classnames(styles.mara)}">
                <img data-src="${getUrl("s15-mara.png")}">
              </div>
            </div>
          </div>
          <div class="${classnames(styles.textContainer, styles.half)}">
            <div data-text="frame15" class="${styles.text}">
              ${text.frame15}
            </div>
          </div>
        </div>

        <div data-scene="16" class="${classnames(styles.comicContainer, styles.textFirst, styles.scene16)}">
          <div class="${classnames(styles.imagesContainer, styles.half)}">
            <div data-el="s16-frame" class="${styles.frame}">
              <div data-el="s16-prisoners" class="${classnames(styles.prisoners)}">
                <img data-src="${getUrl("s16-prisoners.png")}">
              </div>
              <div data-el="s16-mara" class="${classnames(styles.mara)}">
                <img data-src="${getUrl("s16-mara.png")}">
              </div>
              <div data-el="s16-bars" class="${classnames(styles.bars)}">
                <img data-src="${getUrl("s16-bars.png")}">
              </div>
            </div>
          </div>
          <div class="${classnames(styles.textContainer, styles.half)}">
            <div data-text="frame16" class="${styles.text}">
              ${text.frame16}
            </div>
          </div>
        </div>

      </section>

      <section data-scene="17" data-el="s17-sectionContainer" data-section="8" class="${classnames(styles.section, styles.section8, styles.full, styles.scene17)}">
        
        <div data-fixed-el class="${classnames(styles.sticky, styles.full)}">
          <div data-el="s17-bg" class="${classnames(styles.fillParent, styles.bg)}" data-background-image="${getUrl("s17-bg.jpg")}">
          </div>

          <div data-el="s17-mara" class="${classnames(styles.maraContainer, styles.full)}">
            <div class="${classnames(styles.mara)}">
              <img data-src="${getUrl("s17-mara.png")}">
            </div>
          </div>
        </div>
        <div data-el="s17-textContainer" class="${classnames(styles.textContainer, styles.first, styles.textCenter, styles.inCloud, styles.tall)}">
          <div data-text="frame17_1" class="${styles.text}">
            ${text.frame17_1}
          </div>
        </div>
        <div class="${classnames(styles.textContainer, styles.second, styles.textCenter, styles.inCloud, styles.tall)}">
          <div data-text="frame17_2" class="${styles.text}">
            ${text.frame17_2}
          </div>
        </div>

      </section>

      <section data-scene="18" data-el="s18-sectionContainer" data-section="9" class="${classnames(styles.section, styles.section9, styles.full)}">

        <div data-scene="18" class="${classnames(styles.comicContainer, styles.scene18)}">
          <div class="${classnames(styles.imagesContainer, styles.half)}">
            <div data-el="s18-frame" class="${styles.frame}">
              <div data-el="s18-bg" class="${styles.bg}">
                <img data-src="${getUrl("s18-bg.jpg")}">
              </div>
              <div data-el="s18-mara" class="${classnames(styles.mara)}">
                <img data-src="${getUrl("s18-mara.png")}">
              </div>
              <div data-el="s18-legs" class="${classnames(styles.legs)}">
                <img data-src="${getUrl("s18-legs.png")}">
              </div>
            </div>
          </div>
          <div class="${classnames(styles.textContainer, styles.half)}">
            <div data-text="frame18_1" class="${styles.text}">
              ${text.frame18_1}
            </div>
          </div>
        </div>

        <div class="${styles.textBlock}">
          <div class="${classnames(styles.textContainer)}">
            <div data-text="frame18_2" class="${styles.text}">
              ${text.frame18_2}
            </div>
          </div>
        </div>

        <div data-scene="19" class="${classnames(styles.comicContainer, styles.textFirst, styles.scene19)}">
          <div class="${classnames(styles.imagesContainer, styles.half)}">
            <div data-el="s19-frame" class="${styles.frame}">
              <div data-el="s19-bg" class="${classnames(styles.bg)}">
                <img data-src="${getUrl("s19-bg.jpg")}">
              </div>
              <div data-el="s19-shadow1" class="${styles.shadow1}">
                <img data-src="${getUrl("s19-shadow1.png")}">
              </div>
              <div data-el="s19-shadow2" class="${styles.shadow2}">
                <img data-src="${getUrl("s19-shadow2.png")}">
              </div>
              <div data-el="s19-shadow3" class="${styles.shadow3}">
                <img data-src="${getUrl("s19-shadow4.png")}">
              </div>
              <div data-el="s19-shadow4" class="${styles.shadow4}">
                <img data-src="${getUrl("s19-shadow3.png")}">
              </div>
            </div>
          </div>
          <div class="${classnames(styles.textContainer, styles.half)}">
            <div data-text="frame19" class="${styles.text}">
              ${text.frame19}
            </div>
          </div>
        </div>

      </section>

      <section data-scene="20" data-el="s20-sectionContainer" data-section="8" class="${classnames(styles.section, styles.section10, styles.full, styles.scene20)}">
        
        <div data-fixed-el class="${classnames(styles.sticky, styles.full)}">
          <div class="${styles.maraWrapper}">
            <div class="${styles.maraContainer}">
              <div data-el="s20-mara1" class="${styles.mara1}">
                <img data-src="${getUrl("s20-mara-1.png")}">
              </div>
              <div data-el="s20-mara2" class="${styles.mara2}">
                <img data-src="${getUrl("s20-mara-2.png")}">
              </div>
              <div data-el="s20-mara3" class="${styles.mara3}">
                <img data-src="${getUrl("s20-mara-3.png")}">
              </div>
              <div data-el="s20-mara4" class="${styles.mara4}">
                <img data-src="${getUrl("s20-mara-4.png")}">
              </div>
              <div data-el="s20-mara5" class="${styles.mara5}">
                <img data-src="${getUrl("s20-mara-5.png")}">
              </div>
              <div data-el="s20-mara6" class="${styles.mara6}">
                <img data-src="${getUrl("s20-mara-6.png")}">
              </div>
            </div>
          </div>

        </div>

        <div data-el="s20-textContainer" class="${classnames(styles.textContainer, styles.first, styles.textCenter, styles.inCloud, styles.tall)}">
          <div data-text="frame20_1" class="${styles.text}">
            ${text.frame20_1}
          </div>
        </div>
        <div class="${classnames(styles.textContainer, styles.second, styles.textCenter, styles.inCloud, styles.tall)}">
          <div data-text="frame20_2" class="${styles.text}">
            ${text.frame20_2}
          </div>
        </div>

      </section>

    </main>
  `;
}

function getImgUrl(img, env) {
  if (env === 'dev') {
    return `./imgs/${img}`;
  } else {
    return `https://www.abc.net.au/res/sites/news-projects/2020-trans-prisoner/1.0.5/imgs/${img}`;
  }
}


