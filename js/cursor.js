import { gsap } from "gsap";
import { lerp, getMousePos, getSiblings } from "./utils";

// Grab the mouse position and set it to mouse state

let mouse = { x: 0, y: 0 };

//From Utils
window.addEventListener("mousemove", (ev) => (mouse = getMousePos(ev)));

export default class Cursor {
  constructor(el) {
    //Variables
    //Zřejmě amt počáteční procenta pro lerp this.cursorConfigs[key]current k následování cursoru
    this.Cursor = el;
    this.Cursor.style.opacity = 0;
    this.Item = document.querySelectorAll(".hero-inner-link-item");
    this.Hero = document.querySelector(".hero-inner");
    this.bounds = this.Cursor.getBoundingClientRect();

    // Amt Nastavení Cursor follow dot delay
    this.cursorConfigs = {
      x: { previous: 0, current: 0, amt: 0.2 },
      y: { previous: 0, current: 0, amt: 0.2 },
    };
    //Define mouse move function
    this.onMouseMoveEv = () => {
      this.cursorConfigs.x.previous = this.cursorConfigs.x.current = mouse.x;
      this.cursorConfigs.y.previous = this.cursorConfigs.y.previous = mouse.y;

      // Set cursor opacity to 1 when hovered on screen
      gsap.to(this.Cursor, {
        ease: "Power3.easeOut",
        opacity: 1,
      });

      //Execute Scale
      this.onScaleMouse();

      /* The window.requestAnimationFrame() method tells the browser that
       you wish to perform an animation and requests that the browser calls a specified function
       to update an animation before the next repaint.
       The method takes a callback as an argument to be invoked before the repaint.
     */
      requestAnimationFrame(() => this.render());
      //Clean up function for movement lisener
      window.removeEventListener("mousemove", this.onMouseMoveEv);
    };

    //Assign the mouse function
    window.addEventListener("mousemove", this.onMouseMoveEv);
  }

  //Scale the media of the mouse
  onScaleMouse() {
    this.Item.forEach((link) => {
      if (link.matches(":hover")) {
        this.setVideo(link);
        this.scaleAnimation(this.Cursor.children[0], 0.8);
      }
      link.addEventListener("mouseenter", () => {
        //Gsap animation for scaling media
        this.setVideo(link);
        this.scaleAnimation(this.Cursor.children[0], 0.8);
      });
      //Scale down media on hover off
      link.addEventListener("mouseleave", () => {
        this.scaleAnimation(this.Cursor.children[0], 0);
      });
      //Hover on a tag to expand to 1.2
      link.children[1].addEventListener("mouseenter", () => {
        this.Cursor.classList.add("media-blend");
        this.scaleAnimation(this.Cursor.children[0], 1.2);
      });
      //Off Hover scale to 0.8
      link.children[1].addEventListener("mouseleave", () => {
        this.Cursor.classList.remove("media-blend");
        this.scaleAnimation(this.Cursor.children[0], 0.8);
      });
    });
  }

  //Scale Animaton
  scaleAnimation(el, amt) {
    //Gsap animation for scaling Animaton
    gsap.to(this.Cursor.children[0], {
      duration: 0.6,
      scale: amt,
      ease: "Power3.easeOut",
    });
  }

  //Set Video

  setVideo(el) {
    //Grab the data-video-src and make sure it matches the video that should be displayed
    let src = el.getAttribute("data-video-src");
    let video = document.querySelector(`#${src}`);
    let siblings = getSiblings(video);

    if (video.id == src) {
      gsap.set(video, {zIndex: 4, opacity:1 });
      siblings.forEach((i) =>{
        gsap.set(i, {zIndex: 1, opacity: 0});
      });
    }
  }

  render() {
    this.cursorConfigs.x.current = mouse.x;
    this.cursorConfigs.y.current = mouse.y;

    // lerp Lineární interpolace 
    for (const key in this.cursorConfigs) {
      // key will be x & y
      // WTF IS LERP?
      // Lerp - A lerp returns the value between two numbers at a specified, decimal midpoint:
      // vypočítá procento mezi 2 čísly PŘ ( vypočítá jaké procentuální číslo při zadání 50% mezy 40 a 80)
      //Př lerp {40, 80, 0} = 40
      this.cursorConfigs[key].previous = lerp(
        this.cursorConfigs[key].previous,
        this.cursorConfigs[key].current,
        this.cursorConfigs[key].amt
      );
    }

    // Seting the cursor x and y to our cursor html element
    this.Cursor.style.transform = `translateX(${this.cursorConfigs.x.previous}px) translateY(${this.cursorConfigs.y.previous}px)`;

    //RAF requestAnimationFrame
    requestAnimationFrame(() => this.render());
  }
}
