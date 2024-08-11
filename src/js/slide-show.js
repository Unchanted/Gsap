(function() {
  'use strict';

  // Setup slides and navigation
  let currentIndex = 0;
  let useAnchors = false;
  const nav = document.querySelectorAll('.slide-show__nav a');
  const slides = Array.from(nav).map((navElement, index) => {
    const slideId = navElement.getAttribute('href');
    const slideElement = document.querySelector(`.slide-show__slides section[data-id="${slideId}"]`);
    const tl = new TimelineMax();

    navElement.addEventListener('click', event => {
      event.preventDefault();
      scrollTo(index);
    });

    slideElement.style.zIndex = nav.length - index;

    return { id: slideId, tl, element: slideElement };
  });

  // Show slide show
  const cloak = document.querySelector('.slide-show__cloak');
  cloak.style.visibility = 'visible';
  cloak.style.opacity = 1;

  // Set active class on nav
  function setActiveNav(index) {
    nav.forEach((navElement, i) => {
      navElement.classList.toggle('slide-show__nav--active', i === index);
    });
  }

  // Animate slide, pause all other slides
  function animateSlide(index) {
    slides.forEach(slide => slide.tl.pause());
    slides[index].tl.restart();
  }

  // Scroll to selected slide
  function scrollTo(index) {
    if (currentIndex === index) return;

    slides.forEach((slide, i) => {
      slide.element.style.top = i < index ? '-100%' : '0';
    });

    currentIndex = index;
    setActiveNav(index);
    animateSlide(index);
    if (useAnchors) window.location.hash = slides[index].id;
  }

  // Initialize with the default slide
  setActiveNav(currentIndex);

})();
