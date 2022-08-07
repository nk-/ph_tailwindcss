/**
 * @file
 * Ph TailwindCss theme scripts.
 */
   
(function (Drupal) { 

  'use strict';
  
  document.onreadystatechange = () => {
    
    
    let timeout;
    /*
    let attributes = {
      class: [
        'animate__animated',
      ]
    };   
    */
    
    if (document.readyState == 'interactive') {
      /*
      //localStorage.clear();
      const phStaggered = localStorage.getItem('phStaggered');
      attributes.op = phStaggered ? 'remove' : 'add';
      phFactory.staggered(attributes); 
      */
      
      if (typeof timeout === 'number') {
        clearTimeout(timeout);
      }

    }
    else if (document.readyState == 'complete') {
    
      // Remove blur from the <main> element.
      document.querySelector('main').classList.remove('blur-sm');
      
      // Loading spinner animation handling.
      const spinner = document.querySelector('[data-spinner="main"]');
      if (spinner) {
        spinner.classList.add('animate__fadeOut');
        timeout = setTimeout((s) => {
          s.remove();
        }, 1500, spinner);
      }
      
      /*
      const phStaggered = localStorage.getItem('phStaggered');
      attributes.op = 'remove'; //phStaggered ? 'remove' : 'add';
      localStorage.setItem('phStaggered', 'done');
      timeout = setTimeout((f, a) => {
        f.staggered(a);
      }, 4100, phFactory, attributes);
      */
    }
  };

  Drupal.behaviors.phDefault = {
    attach: function(context, settings) {
      if (typeof hljs != 'undefined') {
        document.querySelectorAll('pre code').forEach(element => { 
          hljs.highlightElement(element);
        });
      }
      
      let factory;
      if (!factory && typeof phFactory !== 'undefined') {
        
        factory = phFactory;
        Object.assign(this, factory);
        
        this.lazyVideo();
        this.observeSection();
        return false;
      }
    }
  };

  const phFactory = {

    staggered: (attributes) => {
    
      const staggered = [].slice.call(document.querySelectorAll('[data-staggered]'));
      if (staggered.length && attributes.class.length && attributes.op) {
        staggered.forEach(element => {
          /*
          if (attributes.op === 'remove') {
            localStorage.setItem('phStaggered', 'done');
          }
          else {
            localStorage.removeItem('phStaggered', 'done');
          }
          */
          
          attributes.class.forEach(animate => {
            element.classList[attributes.op](animate);
          });
        
        });
      } 
    },
    
    siblings: (element, parent, selector, properties) => {
      const allToggles = [].slice.call(parent.querySelectorAll(selector));
      allToggles.forEach(sibling => {
        if (sibling !== element) {
          if (properties.class && properties.op) {
            sibling.classList[properties.op](properties.class);
          }
        }
      }); 
    },
 
    observeSection: () => {
      const sections = [].slice.call(document.querySelectorAll('.observe-section'));
      if (sections.length) {
        if ("IntersectionObserver" in window) {
          const sectionObserver = new IntersectionObserver((element, observer) => {
            element.forEach(section => {
              if (section.isIntersecting) {
                section.target.classList.remove("opacity-0");
                section.target.classList.add('opacity-100');
                sectionObserver.unobserve(section.target);
              }
            });
          });

          sections.forEach(section => {
            sectionObserver.observe(section);
          });
        } 
      }
    },
    
    lazyVideo: () => {
      
      const lazyVideos = [].slice.call(document.querySelectorAll('.video-wrapper'));
      
      if (lazyVideos.length) {
        
        lazyVideos.forEach(lazyVideo => {
          const playButton = lazyVideo.querySelector('.play-arrow');
          if (playButton) {
            playButton.addEventListener('click', event => {
              
              const button = event.currentTarget;
              const parent = event.currentTarget.parentNode;
              const video = parent.querySelector('video');
              
              if (video && video.children.length) {
              
                const overlay = parent.querySelector('.overlay-wrapper');
                
                video.addEventListener('pause', pause => {
                  // Show overlay.
                  if (overlay) {
                    overlay.classList.remove('hidden');
                  }
                  // Show play button on play.
                  button.classList.remove('hidden');
                });
                
                video.addEventListener('play', play => {
                  // Hide play button on play.
                  button.classList.add('hidden');
                  // Hide overlay.
                  if (overlay) {
                    overlay.classList.add('hidden');
                  }
                });
                
                const children = [].slice.call(video.children);
                children.forEach(source => {
                  source.setAttribute('src', source.getAttribute('data-src'));
                  video.classList.remove('lazy');
                }); 
                
                if (!video.classList.contains('played')) {
                  video.load();
                  video.classList.add('played');
                }
                video.setAttribute('controls', 'true');
                video.play();
              }
            });  
          }
        });
      }
    }
  };
 
})(Drupal);