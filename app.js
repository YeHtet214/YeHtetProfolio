// HIDE SPINNER WHEN PAGE IS LOADED
$(function() {
  $('.spinner-wrapper').fadeOut();
  // Send Email on click Icon
  $('#email-btn').on('click', function() {
    window.location.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=yhtet1934@gmail.com';
  })
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

$(window).on('scroll', function() {
  $('nav .nav-item a').each(function(){
    let eachAttr = $(this).attr('href');
    highlight(eachAttr);
  });
});

$('nav .nav-item a').each(function() {
  let eachAttr = $(this).attr('href');
  $(this).on('click', () => {
    $('.navbar ul').toggleClass('open-menu');
    $('.mobile-menu-btn').toggleClass('active-toggler');
    highlight(eachAttr)
  });
})

/* 
  Mobile Menu Toggler
*/
$('.mobile-menu-btn').on('click', function() {
  $('.navbar ul').toggleClass('open-menu');
  $(this).toggleClass('active-toggler');
})

/* Page Animations */
/* GSAP ANIMATIONS */
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  gsap.set('.description span', { display: 'inline-block'});
  gsap.from('.navbar', { duration: 1, y: -50 });

  /* HERO SECTION TEXT ANIMATION */
  // Overlay Effect
  gsap.to('#home', {
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: '+=700px',
      pin: '#home',
      pinSpacing: false,
      anticipatePin: 2,
    },
  })

  const heroTL = gsap.timeline();
  const words = "I\'m a Frontend Developer";
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
    let heroContentTop = $('.hero-content').position().top;
    let heroContentHeight = $('.hero-content').css('height').slice(0, -2); // Slice out the integer and remove the 'px' string from return value
    let actionBtnsMargin = 0;

    const ACTION_BTNS_POS = Number(heroContentHeight) + Number(heroContentTop) + actionBtnsMargin;
    $('.action-btns').css({'scale': 1, top: ACTION_BTNS_POS + 'px' });
    btnTL.set('.action-btns', { zIndex: 2, autoAlpha: 1})
  }

  btnTL.from('.mobile-hire-btn', { duration: .5, x: -500})
       .from('.explore-btn', { duration: .5, x: 500})

  gsap.to('.action-btns', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top center+=200px',
      end: '+=100px',
      toggleActions: 'play none reverse none',
    },
    duration: 0.5,
    scale: 0
  })
       
  heroTL.add(btnTL);

  function textColor() {
    const replaceText = $('.text').text();
    $('.text').html('');
    replaceText.split(' ').forEach(word => {
      $( `<span class="${word.toLowerCase()}">${word}&nbsp; </span>`).appendTo($('.text'));
    })

    gsap.fromTo('.frontend', { y: 100, }, { y: 0, color: '#E31B6D',}) // Search 'frontend' word and give it a color
  }

  /***** 
   * ABOUT SECTION ANIMATIONS 
   * ******/

  const about_elements = ['.my-image', '.about-paragraph', '.download-btn', '.contact-info', '.about-heading'];

  function aboutHead(){
    const aboutHeadingTL = gsap.timeline();
    const aboutHeadingAnimate = aboutHeadingTL.to('.about-heading p', {duration: 1, text: 'Discover'})
                                              .to('.about-heading h3', {duration: .5, autoAlpha: 1, ease: 'Power1.out'});

    ScrollTrigger.create({
      trigger: '.about-heading',
      start: 'top 90%',
      end: 'top center',
      animation: aboutHeadingAnimate,
      toggleActions: 'play none repeat none',
      scrub: true,
      ease: 'Power2.out'
    })
  }

  about_elements.map(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
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
              gsap.to(el, { duration: 1, scale: 1, ease: 'back', autoAlpha: 1});
              break;

            case 'contact-info':
              gsap.to(el, { duration: 1, x: 0, ease: 'back'});
              break;
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
    start: 'top 85%',
    end: '+=300px',
    animation: skillAnimate
  })

  /* PROJECTS SECTION ANIMATION */
  const projectsHeadingTL = gsap.timeline();
  const proHeadings = projectsHeadingTL.to('.projects-heading p', {duration: 1, text: 'What I\'ve Done?'})
  .from('.projects-heading h3', {duration: .5, y: 100, autoAlpha: 1, ease: 'Power1.out'});

  ScrollTrigger.create({
    trigger: '.projects-heading',
    start: 'top 85%',
    end: '+=300px',
    animation: proHeadings,
    scrub: true
  })

  function animatePro() {
    // Elements in Each Project to animate
    const elements = ['.project-image', '.project-name', '.project-title-underline', '.project-p', '.technologies', '.project-detail ul', '.tech-in-project img' ];
    const pro_elements_tl = gsap.timeline();

    ['#project1', '#project2', '#project3'].forEach(project => {
      elements.map(ele => {
        const getElement = project.concat(' '+ele);
        gsap.from(getElement, {
          scrollTrigger: {
            trigger: getElement,
            start: 'top 90%',
            once: true,
            onEnter: () => {
              if (ele === '.project-image') { // Image Animation
                pro_elements_tl.from(getElement, { duration: .5, ease: 'Power2.inOut', scale: 0, autoAlpha: 0 });
              } 
              if ( ele === '.project-name' ) { // Image Title
                pro_elements_tl.from(getElement, { duration: 0.5, ease: 'Power4.out', y: 50, autoAlpha: 0 });
              } 
              if ( ele === '.project-title-underline' ) { // Image Title Underline
                pro_elements_tl.from(getElement, { duration: 0.5, ease: 'Power4.out', width: 0, autoAlpha: 0 });
              } 
              if ( ele === '.project-p'  ) { // Image Title
                pro_elements_tl.from(getElement, { duration: 0.5, ease: 'Power4.out', autoAlpha: 0, stagger: 0.25 });
              } 
              if ( ele === '.tech-in-project img' ) { // Thumbnails Animaitons
                pro_elements_tl.from(getElement, { duration: 0.5, ease: 'Power4.out', autoAlpha: 0, stagger: 0.1 });
              }
              if ( ele === '.technologies' ) { // Thumbnails Animaitons
                pro_elements_tl.from(getElement, { duration: 0.5, ease: 'Power4.out', autoAlpha: 0, stagger: 0.25 });
              }
            }
          }
        })
      })
    })
  }

  animatePro();

  // SMALL PROJECTS ANIMATIONS
  const moreProjectsTL = gsap.timeline();
  gsap.from('.more-projects', {
    scrollTrigger: {
      trigger: '.more-projects h4',
      start: 'top 95%',
      once: true,
      onEnter: () => {
        moreProjectsTL.from('.more-projects h4', { duration: 1, scale: 0 })
        moreProjectsTL.from('.more-projects .title-underline', { duration: 0.5, width: 0 })
        moreProjectsTL.from('.more-projects .small-project-card', { duration: 1, scale: 0, autoAlpha: 0, stagger: 0.25})
      }
    },
  })

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
                                      .from('.submit-message-btn', { duration: 1, ease: 'Power2.inOut', autoAlpha: 0, scale: 0 })

  ScrollTrigger.create({
    trigger: '#contact form', 
    start: 'top 85%',
    end: '+=300px',
    animation: formInputsAnimation
  })         

  // Responsive on Element Width Changes
  const observer = new ResizeObserver(entries => {
    const target = entries[0];
    const width = target.contentRect.width;

    // About Image Size Change
    if ($(target.target).attr('id') === 'about') {
      if (width < 460) {
        $('.my-image').css({'width': '60vw', 'height': '60vw'});
      } else if (width < 510) {
        $('.my-image').css({'width': '45vw', 'height': '45vw'});
      } else {
        $('.my-image').css({'width': '30vw', 'height': '30vw'});
      }
      $('.my-image img').css({'height': '150%'});
    }
  });

  observer.observe($('#about')[0])


