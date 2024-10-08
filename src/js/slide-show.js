var slideShow = (function(exports) {
  'use strict';

  var exports = {};

  let currentIndex = 0;
  let useAnchors = false;
  const nav = document.querySelectorAll('.slide-show__nav a');
  const slides = [];

  for (const key of Object.keys(nav)) {
    slides[key] = {};
    slides[key].id = nav[key].getAttribute('href');
    slides[key].tl = new TimelineMax();
    const navElement = document.querySelector(`.slide-show__nav a[href="${slides[key].id}"]`);
    navElement.addEventListener('click', event => {
      event.preventDefault();
      const slide = event.currentTarget.getAttribute('href');
      scrollTo(slide);
    });
  }

  let totalSlides = slides.length;

  for (let i = 0; i < totalSlides; i++) {
    const slide = document.querySelector(`.slide-show__slides section[data-id="${slides[i].id}"]`);
    slide.style.zIndex = totalSlides - i;
  }

  const cloak = document.querySelector('.slide-show__cloak');
  cloak.style.visibility = 'visible';
  cloak.style.opacity = 1;

  function slideId(index) {
    return slides[index].id;
  }

  function slideIndex(slide) {
    for (let i = 0; i < totalSlides; i++) {
      if (slide === slides[i].id) {
        return i;
      }
    }
  }

  function activeNav(slide) {
    for (const key of Object.keys(nav)) {
      const navElement = document.querySelector('.slide-show__nav a[href="' + slides[key].id + '"]');
      const link = nav[key].getAttribute('href');
      if (slide === link) {
        navElement.classList.add('slide-show__nav--active');
      } else {
        navElement.classList.remove('slide-show__nav--active');
      }
    }
  }

  activeNav(slides[currentIndex].id);

  function animateSlide(index) {
    for (const slide of slides) {
      slide.tl.pause();
    }
    slides[index].tl.restart();
  }

  function scrollTo(newSlide) {
    let newIndex;
    if (typeof newSlide === 'string') {
      newIndex = slideIndex(newSlide)
    } else {
      newIndex = newSlide;
    }
    if (currentIndex === newIndex) { return; }
    for (let i = 0; i < totalSlides; i++) {
      const slide = document.querySelector(`.slide-show__slides section[data-id="${slides[i].id}"]`);
      if (i === newIndex) {
        currentIndex = i;
        slide.style.top = '0';
        activeNav(slideId(i)); // set active nav element
        animateSlide(i); // animate active slide
        useAnchors && (window.location = '#' + slideId(i)); // set window location
      } else if (i < newIndex) {
        slide.style.top = '-100%';
      } else if (i > newIndex) {
        slide.style.top = '0';
      }
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      scrollTo(currentIndex - 1);
    }
  }

  // scroll to next slide
  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      scrollTo(currentIndex + 1);
    }
  }

  // mouse wheel events
  let allowSlide = true;
  let seconds = 1.5; // should match slide transition time
  let wait = seconds * 1000;

  window.addEventListener('wheel', event => {
    if (allowSlide) {
      allowSlide = false;
      setTimeout(() => {
        allowSlide = true;
      }, wait);
      const nextIndex = currentIndex + (1 * Math.sign(event.deltaY));
      if (nextIndex > currentIndex && nextIndex <= totalSlides - 1) {
        nextSlide();
      } else if (nextIndex < currentIndex && nextIndex >= 0) {
        prevSlide();
      }
    }
  });

  // key events
  window.addEventListener('keydown', event => {
    let keys = {
      up: 38,
      down: 40,
      left: 37,
      right: 39,
      space: 32
    };
    switch (event.which) {
      case keys.up:
        return prevSlide(); // previous slide
      case keys.down:
      case keys.space:
        return nextSlide(); // next slide
      case keys.left:
        return scrollTo(0); // first slide
      case keys.right:
        return scrollTo(totalSlides - 1); // last slide
    }
  });

  // touch events
  let isDragging = false;
  let yStartPos = null;

  window.addEventListener('touchstart', event => {
    isDragging = true;
    yStartPos = event.changedTouches[0].pageY;
  });

  window.addEventListener('touchmove', event => {
    event.preventDefault();
    if (isDragging) {
      isDragging = false; // cancel additional dragging
      // update slide based on
      const yEndPos = event.changedTouches[0].pageY;
      const yDelta = yStartPos - yEndPos;
      if (yDelta > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      yStartPos = null;
    }
  });

  window.addEventListener('touchend', event => {
    isDragging = false;
    yStartPos = null;
  });

  // export slides
  exports.slides = slides;

  // return module exports
  return exports;

}(slideShow || {}));
