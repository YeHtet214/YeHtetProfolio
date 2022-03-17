// HIDE SPINNER WHEN PAGE IS LOADED
$(document).ready(function() {
  $('.spinner-wrapper').fadeOut();
})

const canvas = document.getElementById('hero-canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext('2d');
let particlesArray = [];
const adjustX = 10;
const adjustY = 10;

const mouse = {
  x: null,
  y: null,
  radius: 100,
}

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
})

ctx.fillStyle = 'white';
ctx.font = '30px Verdana';
ctx.fillText('Ye', 5, 30);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.baseX = this.x;
    this.baseY = this.y;
    this.size = Math.random();
    this.speed = Math.random();
    this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    this.density = (Math.random() * 30) + 1;
  }
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx*dx + dy*dy);
    let forceDirectionX = dx/distance;
    let forceDirectionY = dy/distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance)/maxDistance;
    let directionX = force * forceDirectionX * this.density;
    let directionY = force * forceDirectionY * this.density;
    
    if (distance < maxDistance) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
        if ( this.x !== this.baseX ){
          dx = this.x - this.baseX;
          this.x -= dx/10;
        }
        if ( this.y !== this.baseY ){
          dy = this.y - this.baseY;
          this.y -= dy/10;
        }
    }

    this.y -= this.speed;
    this.baseY -= this.speed;
    if ( this.y < 0 ) {
      this.y = canvas.height;
      this.baseY = this.y;
      this.x = Math.random() * canvas.width;
      this.baseX = this.x;
    }
    
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, Math.PI * 2, 0);
    ctx.closePath();
    ctx.fill();
  }
}

(function init() {
  particlesArray = [];
  for (let i=0; i<1000; i++ ){
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    particlesArray.push(new Particle(x, y))
  }
})()

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particlesArray.map(particle => {
    particle.update();
    particle.draw();
  })
  
  requestAnimationFrame(animate)
}

animate()

/***
  Switch Active on Window Location 
*/

function highlight(item) {
  let itemTop = $(item).position().top;

  let windowTop = $(window).scrollTop(); 
  let topDifference = (windowTop - itemTop); 

  let itemHeight = $(item).height();
  let bottomDifference = topDifference - itemHeight; 

  let menuId = $('nav .nav-item a').attr('href');
  if (menuId = item)
  {
      if(topDifference > -1 && bottomDifference < 0)
      {
          $("nav .nav-item a[href='" + item + "']").addClass('active');
          $("nav .nav-item a[href!='" + item + "']").removeClass('active');
      }
      else {
          $("nav .nav-item a[href='" + item + "']").removeClass('active');
      }
  }
}

$(window).scroll(function() {
  $('nav .nav-item a').each(function(){
    let eachAttr = $(this).attr('href');
    highlight(eachAttr);
  });
});

$('nav .nav-item a').each(function() {
  let eachAttr = $(this).attr('href');
  $(this).click(() => {
    $('.navbar ul').toggleClass('open-menu');
    $('.mobile-menu-btn').toggleClass('active-toggler');
    highlight(eachAttr)
  });
})

/* 
  Mobile Menu Toggler
*/
$('.mobile-menu-btn').click(function() {
  $('.navbar ul').toggleClass('open-menu');
  $(this).toggleClass('active-toggler');
})

//////////
/* GSAP ANIMATIONS */
gsap.registerPlugin(ScrollTrigger, TextPlugin);

gsap.set('.description span', { display: 'inline-block'});
gsap.from('.navbar', { duration: 1, y: -50 });

/* HERO SECTION TEXT ANIMATION */
const heroTL = gsap.timeline();
const words = 'I\'m a Frontend Developer';
heroTL
  .from('.hello', {
  duration: .5,
  y: 100,
  ease: 'Power4.out'
  })
  .to('.text', {
  duration: 1,
  text: {
    value: words,
    speed: 1,
  },
  onComplete: () => textColor(),
  })
  .from('.description span', { 
    duration: 0.2,
    ease: "bounce.inOut",
    opacity: 0, y: 20,
    stagger: 0.06
  })

const btnTL = gsap.timeline();
if ($('.action-btns').css('display') === 'block') { // Animate Action Buttons on Mobile Devices
  let heroContentTop = $('.hero-content').offset().top;
  let heroContentHeight = $('.hero-content').css('height').slice(0, -2); // Slice out the integer and remove the 'px' string from return value
  let actionBtnsMargin = 10;
  const ACTION_BTNS_POS = Number(heroContentHeight) + Number(heroContentTop) + actionBtnsMargin;
  $('.action-btns').css('scale', 1);
  btnTL.set('.action-btns', { zIndex: 2, autoAlpha: 1, top: ACTION_BTNS_POS })
  btnTL.to('.action-btns', {
    scrollTrigger: {
      trigger: '.action-btns',
      start: 'top 20%',
      end: '+=500px',
      scrub: true
    },
    duration: 1,
    scale: 0,
  })
}

btnTL.from('.mobile-hire-btn', { duration: .5, x: -1000})
     .from('.explore-btn', { duration: .5, x: 1000});

heroTL.add(btnTL);

function textColor() {
  const replaceText = $('.text').text();
  $('.text').html('');
  replaceText.split(' ').forEach(word => {
    $( `<span class="${word.toLowerCase()}">${word}&nbsp; </span>`).appendTo($('.text'));
  })

  gsap.fromTo('.frontend', { y: 100, }, { y: 0, color: '#E31B6D',}) // Search 'frontend' word and give it a color
}

/* ABOUT SECTION ANIMATIONS */

// Overlay Effect
ScrollTrigger.create({
  trigger: '#home',
  start: 'top top',
  end: '+=400px',
  pin: true,
  pinSpacing: false,
})

const about_elements = ['.my-image', '.about-paragraph', '.download-btn', '.contact-info', '.about-heading'];

function aboutHead(){
  const aboutHeadingTL = gsap.timeline();
  const aboutHeadingAnimate = aboutHeadingTL.to('.about-heading p', {duration: 1, text: 'Discover'})
                                            .to('.about-heading h3', {duration: .5, autoAlpha: 1, ease: 'Power1.out'});

  ScrollTrigger.create({
    trigger: '.about-heading',
    start: 'top 70%',
    end: '+=300px',
    animation: aboutHeadingAnimate,
    scrub: true
  })
}

about_elements.map(el => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 70%',
      end: '+=300px',
      once: true,
      onEnter: () => {
        switch (el.slice(1)) {
          case 'my-image':
            gsap.to(el, {duration: 1.5, scale: 1, autoAlpha: 1, y: 0, ease: 'elastic'})
            break;

          case 'about-heading':
            aboutHead();
            break;

          case 'about-paragraph':
            gsap.from(el, {duration: 1, x: 1000})  
            $(el).map((i, p) => { 
              gsap.to(el, { opacity: 1})
              textReveal(p);
            });
            break;

          case 'download-btn':
            gsap.from(el, { duration: 1, scale: 0, ease: 'back', autoAlpha: 0});
            break;

          case 'contact-info':
            gsap.from(el, { duration: 1, x: -300, ease: 'back'});
            break;

          defalut: 
            break;
            // gsap.from(el, {duration: 1, ease: 'Power3.inOut', scale: 0})
        }
      }
    },
  })
  
})

function textReveal(text) {
  var newDom = '';
  var animationDelay = 6;

  for(let i = 0; i < text.innerText.length; i++)
  {
      newDom += '<span class="char">' + (text.innerText[i] == ' ' ? '&nbsp;' : text.innerText[i])+ '</span>';
  }

  text.innerHTML = newDom;
  var length = text.children.length;

  for(let i = 0; i < length; i++)
  {
      text.children[i].style['animation-delay'] = animationDelay * i + 'ms';
  }
}

/* Skills Section Animations */
const skillsTL = gsap.timeline();
const skillAnimate = skillsTL.from('.skills-heading p', { duration: .5, ease: 'sine.in', autoAlpha: 0})
        .to('.skills-heading h4', { duration: 1, text: {value: 'My Skills'}})
        .from('.skill-item', {duration: .3,opacity: 0,ease: 'back', y: 'random(-50, 50)', stagger: 0.24})

ScrollTrigger.create({
  trigger: '.skills-container',
  start: 'top 70%',
  end: '+=300px',
  animation: skillAnimate
})

/* PROJECTS SECTION ANIMATION */
const projectsHeadingTL = gsap.timeline();
const proHeadings = projectsHeadingTL.to('.projects-heading p', {duration: 1, text: 'What I\'ve Done?'})
.from('.projects-heading h3', {duration: .5, y: 100, autoAlpha: 1, ease: 'Power1.out'});

ScrollTrigger.create({
  trigger: '.projects-heading',
  start: 'top 70%',
  end: '+=300px',
  animation: proHeadings,
  scrub: true
})

function animatePro(pro) {
  const projectsTL = gsap.timeline();
  const projectAnimate = projectsTL.from( pro + ' .project-image', { duration: .5, ease: 'Power2.out', scale: 0 })
                                  .from(pro + ' .project-detail .project-name', { duration: .5, ease: 'back', y: 100, opacity: 0 })
                                  .from(pro + ' .project-detail .project-title-underline', { duration: .5, ease: 'Power2.out', width: 0, opacity: 0 })
                                  .from(pro + ' .project-detail p' + ',' + pro + ' .project-detail ul', { duration: .5, ease: 'Power4.in-out', opacity: 0, stagger: 0.25 })
                                  .from(pro + ' .tech-in-project img', {duration: .3, opacity: 0, stagger: 0.1})

  ScrollTrigger.create({
    trigger: pro,
    start: 'top 60%',
    end: '+=300px',
    animation: projectAnimate,
  })

}

['#project1', '#project2', '#project3'].map(pro => animatePro(pro))

/* CONTACT SECTION ANIMATION */
const contactTL = gsap.timeline();
const contactHeading = contactTL.to('.contact-heading p', {duration: 1, text: 'What I\'ve Done?'})
.from('.contact-heading h3', {duration: .5, y: 100, autoAlpha: 0, ease: 'Power1.out'});

ScrollTrigger.create({
  trigger: '.contact-heading',
  start: 'top 70%',
  end: '+=300px',
  animation: contactHeading,
})

// form animation 
const formInputsAnimation = contactTL.from('#contact form input[name="name"]', { duration: .5, ease: 'Power4.out', x: -200, autoAlpha: 0 })
                                     .from('#contact form input[name="email"]', { duration: .5, ease: 'Power4.out', x: 200, autoAlpha: 0 })
                                     .to('#contact form textarea', { duration: .5, ease: 'Power4.out', autoAlpha: 1, rows: 12})

ScrollTrigger.create({
  trigger: '#contact form', 
  start: 'top 70%',
  end: '+=300px',
  animation: formInputsAnimation
})         

gsap.from('.submit-message-btn', {
  scrollTrigger: {
    trigger: '.submit-message-btn',
    start: 'top 80%',

  },
  duration: 1,
  ease: 'Power3.out',
  scale: 0
})


// HIRE PAGE ANIMATION 
$('#router').on('change', function() {
  if (!$('#router:checked').length) {
    const hirePageTL = gsap.timeline();
    hirePageTL.from('.hire-me-page .outer', { duration: 0.5, ease: 'Power2.out', y: -500, x: 500, autoAlpha: 0 })
                              .from('.hire-me-page .middle', { delay: .2, duration: .5, ease: 'Power4.out', y: -500, x: 500, autoAlpha: 0 })
                              .from('.hire-me-page .inner', { duration: .5, ease: 'Power4.out', y: -500, x: 500, autoAlpha: 0 })
                              .from('.hire-me-page .inner-most', { duration: .5, ease: 'Power4.out', y: -500, x: 500, autoAlpha: 0 })

    }
})

