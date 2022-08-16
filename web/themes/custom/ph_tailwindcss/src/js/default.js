/**
 * @file
 * Ph TailwindCss theme scripts.
 */
   
(function (Drupal) { 

  'use strict';
  
  document.onreadystatechange = () => {

    let timeout;
    if (document.readyState == 'interactive') {
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
      
      const mainHeart = document.getElementById('main-heart');
      if (mainHeart) {
        //mainHeart.classList.add('animate__bounceIn')
        mainHeart.classList.remove('hidden');
      }
    }
  };

  Drupal.behaviors.phDefault = {
    attach: function(context, settings) {
      if (typeof hljs != 'undefined') {
        document.querySelectorAll('pre code').forEach(element => { 
          hljs.highlightElement(element);
        });
      }
      
      if (settings.path.isFront) {
        const logo = document.getElementById('site-logo');
        if (logo) {
          const paths = logo.children[0].children;
          if (paths[1]) {
            paths[1].setAttribute('fill', '#ef4444b3');
          }
        }
      }
      
      let factory;
      if (!factory && typeof phFactory !== 'undefined') {
        
        factory = phFactory;
        Object.assign(this, factory);
        
        this.lazyVideo();
        this.observeSection();
        this.removables();
        return false;
      }
    }
  };

  const phFactory = {

    staggered: (attributes) => {
    
      const staggered = [].slice.call(document.querySelectorAll('[data-staggered]'));
      if (staggered.length && attributes.class.length && attributes.op) {
        staggered.forEach(element => {
          attributes.class.forEach(animate => {
            element.classList[attributes.op](animate);
          });
        });
      } 
    },
    
    removables: () => {
      const removables = [].slice.call(document.querySelectorAll('[data-remove]'));
      if (removables.length) {
        removables.forEach(element => {
          element.addEventListener('click', event => {
            const targetId = event.currentTarget.dataset.remove;
            if (targetId) {
              const target = document.querySelector('[' + targetId + ']');
              if (target) {
                target.remove();
              }
            }  
          });
        });
      }
    },
    
    siblings: (element, parent, selector, properties) => {
      if (parent) {
        const allToggles = [].slice.call(parent.querySelectorAll(selector));
        allToggles.forEach(sibling => {
          if (sibling !== element) {
            if (properties.class && properties.op) {
              sibling.classList[properties.op](properties.class);
            }
          }
        });
      } 
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