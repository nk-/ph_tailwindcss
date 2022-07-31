/**
 * @file
 * Ph TailwindCss theme scripts.
 */
// (function () { 
'use strict';

/*
document.addEventListener('onreadystatechange', event => {
  if (document.readyState == "complete") {
  }
});
*/
   
document.addEventListener('DOMContentLoaded', (event) => {
  
  /*
    for (let key in phFactory) {
      if (typeof phFactory[key] === 'function') {
        phFactory[key] = phFactory[key].bind(phFactory);
      }
      else {
        for (let k in phFactory[key]) {
          
          phFactory[key][k] = phFactory[key][k].bind(phFactory[key]);
          console.log(phFactory[key][k]);
        }  
      }
    };
  */
    
  phFactory.forms.init(phFactory.forms);
  
  // phFactory.forms.uploadFields();
  
  phFactory.collapsible.toggle(phFactory.collapsible);
  //phFactory.collapsible.togglePane(phFactory.collapsible);
     
  phFactory.lazyVideo();
  phFactory.observeSection();
     
     
  if (typeof hljs != 'undefined') {
    document.querySelectorAll('pre code').forEach(element => { 
      hljs.highlightElement(element);
    });
  }

    
  /*
    let timeout; // = setTimeout;
    const closePanes = [].slice.call(document.querySelectorAll('.mouseout'));
    if (closePanes.length) {
      
      
      closePanes.forEach(pane => {
        document.addEventListener('click', event => {
          if(event.target !== pane && !pane.classList.contains('hidden')) {
            pane.classList.add('hidden');
          }
        });
        pane.addEventListener('mouseleave', event => {
          timeout = setTimeout((e) => {
            e.target.classList.toggle('hidden');
          }, 1000, event);
        });
      });
    }
   
   */
   /*
    const phForms = [].slice.call(document.querySelectorAll('.ph-form'));
    if (phForms.length) {
      phForms.forEach(form => {
        const inputs = form .getElementsByTagName('input');
        const textareas = form .getElementsByTagName('textarea');
        const formElements = Object.values(inputs).concat(Object.values(textareas));
        if (formElements.length) {
          formElements.forEach(formElement => {
            formElement.parentForm = form;
            formElement.addEventListener('focus', factory.formElements);
            formElement.addEventListener('blur', factory.formElements);
            formElement.addEventListener('input', factory.formElements);
          });  
        }
      });
    } 
    */


});
  
/*
const phInit = () => {

   phFactory.forms.init(phFactory.forms);
   phFactory.collapsible.toggle(phFactory.collapsible);
   //phFactory.collapsible.togglePane(phFactory.collapsible);
     
   phFactory.lazyVideo();
   phFactory.observeSection();
   return phFactory;  
};
*/
    
/*
  const phBind = (factory) => {
    for (const key in factory) {
      if (typeof factory[key] === 'function') {
        factory[key] = factory[key].bind(factory);
        return factory;
      }
      else {
        return phBind(factory[key]);
      }
    }
  };
*/


const phFactory = {
     
  forms: {
  
    init: (self) => {
      
      const phForms = [].slice.call(document.querySelectorAll('.ph-form'));
      if (phForms.length) {
        
        const skip = [
          'file',
          'submit',
          'hidden'
        ];
        
        phForms.forEach(form => {
          const allInputs = [].slice.call(document.querySelectorAll('input'));
          let inputs = [];
          if (allInputs.length) {
            allInputs .forEach(input => {
              if (skip.indexOf(input.getAttribute('type')) < 0) {
                inputs.push(input); 
              }   
            });
          }
          console.log(inputs);
           
          //const inputs = form .getElementsByTagName('input');
          const textareas = form .getElementsByTagName('textarea');
          const formElements = Object.values(inputs).concat(Object.values(textareas));
        
          if (formElements.length) {
            formElements.forEach(formElement => {
              
              //if (formElement.getAttribute('type') && skip.indexOf(formElement.getAttribute('type')) < 0) {
                formElement.parentForm = form;
                formElement.addEventListener('focus', self.formElements);
                formElement.addEventListener('blur', self.formElements);
                formElement.addEventListener('input', self.formElements);
             // }
            });  
          }
        });
      } 
    },
      
    formElements: (event) => {
      const element = event.currentTarget;
      const parent = element.parentNode;
      
      let buttonHandle = setTimeout((form) => {
        const button = form.querySelector('input.form-submit');
        if (form.checkValidity()) {
          button.removeAttribute('disabled');    
        }
        else {
          button.setAttribute('disabled', '');  
        }
      }, 100, element.parentForm);
       
      const inputOp = (parent, element) => {
       
        const icon = parent.querySelector('.toggle-default');
        const closeIcon = parent.querySelector('.toggle-close');
        
        if (icon) {
          const iconOp = element.value ? 'add' : 'remove';
          icon.classList[iconOp]('hidden');
        }
        if (closeIcon) {
          const closeOp = element.value ? 'remove' : 'add';
          closeIcon.classList[closeOp]('hidden');
          
          // Reset callback ("x" icon click)
          closeIcon.addEventListener('click', event => {
      
            element.focus();
            element.value = '';
            element.blur();
            event.currentTarget.classList.add('hidden');
      
            if (icon) {
              icon.classList.remove('hidden');
            }
            
            const timeout = buttonHandle;
            if (typeof timeout === 'number') {
              clearTimeout(timeout); 
            }
          });
        }  
        
        if (element.parentForm) {
          const timeout = buttonHandle;
          if (typeof timeout === 'number') {
            clearTimeout(timeout); 
          }
        }
      };

      if (parent) {
        
        const label = parent.previousElementSibling;
        let op, floating;
        let setPlaceholder = '';
        
        switch (event.type) {
          case 'focus':
            
            if (label) {
              label.classList.remove('visually-hidden');
              label.classList.add('floating');
            }
            setPlaceholder = '';
            break;
          case 'blur':
            if (label && !element.value) {
              label.classList.add('visually-hidden');
              label.classList.remove('floating');
              setPlaceholder = (label.innerText || label.textContent);
            }
            break;
          case 'input':
            console.log(element);
            inputOp(parent, element);
            break;
        }
   
        element.setAttribute('placeholder', setPlaceholder);
      }
 
    }/*
,
    
    uploadFields: () => {
      const uploads = [].slice.call(document.querySelectorAll('[data-upload-target]'));
      console.log(uploads);
      if (uploads.length) {
        uploads.forEach(upload => {
          const targetId = upload.dataset.uploadTarget;
          if (targetId && document.querySelector('[data-upload-trigger=' + targetId + ']')) {
            const toggle = document.querySelector('[data-upload-trigger=' + targetId + ']');
            toggle.addEventListener('mousedown', event => {
              
              event.preventDefault();
              const mousedown = new Event('mousedown');  
              //const toggleClass = upload.dataset.collapsibleAnimate ? upload.dataset.collapsibleAnimate : 'hidden';
              console.log(mousedown);
              upload.dispatchEvent(mousedown); //fireEvent('mousedown'); //click();
              console.log(upload);  
            });
          }
        });
      }
    }
*/
  },
  
  collapsible: {
  
    toggle: (self) => {
    
      const collapsiblePanes = [].slice.call(document.querySelectorAll('[data-collapsible-target]')); //.collapsible-pane'));
      console.log(collapsiblePanes);
      
      if (collapsiblePanes.length) {
        collapsiblePanes.forEach(pane => {
          const collapsibleId = pane.dataset.collapsibleTarget;
          console.log(collapsibleId);
          if (collapsibleId && document.querySelector('[data-collapsible=' + collapsibleId + ']')) {
            const toggle = document.querySelector('[data-collapsible=' + collapsibleId + ']');
            if (toggle) { // && toggle.classList.contains('collapsible-toggle')) {
              toggle.addEventListener('click', event => {
                event.preventDefault();
                
                //pane.classList.toggle('hidden');
                //pane.classList.remove('hidden');
                
                const toggleClass = pane.dataset.collapsibleAnimate ? pane.dataset.collapsibleAnimate : 'hidden';
                pane.classList.toggle(toggleClass);
                
                event.currentTarget.classList.toggle('is-active');
                
                if (!pane.classList.contains(toggleClass)) {
                  self.toggleRelated(toggle, pane, toggleClass);
                  //self.togglePane();
                }
              });
            }
          }
        });
      }
    },
      
    toggleRelated: (toggle, pane, toggleClass) => {
    
      if (toggle.dataset.hide) {
        const hideParents = [].slice.call(document.querySelectorAll('[data-collapsible-hide=' + toggle.dataset.hide + ']'));
        if (hideParents.length) {
          hideParents.forEach(hideParent => {
          
            hideParent.classList.toggle(toggleClass);
              
            const backIcon = hideParent.previousElementSibling;
            if (backIcon && backIcon.dataset.backIconTarget === toggle.dataset.backIcon) {
              backIcon.classList.toggle('hidden');
              backIcon.addEventListener('click', event => {
                  
                event.currentTarget.classList.toggle('hidden');
                hideParent.classList.toggle(toggleClass);
                  
                pane.classList.toggle(toggleClass);
                return false;
              }, { capture: true, once: true });
            }
          });
        }
      }   
    }
    /*
    ,
      
      togglePane: () => {
        const closePanes = [].slice.call(document.querySelectorAll('.mouseout'));
        if (closePanes.length) {
          closePanes.forEach(pane => {
            document.addEventListener('click', event => {
              if (!pane.classList.contains('hidden') && event.target !== pane) {
                const parent = event.target.parentNode;
                if (!event.target.classList.contains('collapsible-toggle') && !event.target.classList.contains('collapsible-back') && !parent.classList.contains('collapsible-toggle') && !parent.classList.contains('collapsible-back')) {
                  console.log(event.target, parent);
                  pane.classList.add('hidden');
                }
              }
            });
          });
        }
      }
*/

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
 
// })();
