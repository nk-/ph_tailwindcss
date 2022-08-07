/**
 * @file
 * Ph form elements UI.
 *
 * @ingroup Ph* core scripts.
 */
(function (Drupal) { 

  'use strict';
  
   Drupal.behaviors.phCollapsible = {
    attach: function(context, settings) {
      let ui;
      if (!ui && typeof phToggle !== 'undefined') {
        ui = phToggle(phToggle, context);
        ui.toggle();
        return false;
      }
    }
  };
   
  const phToggle = (self, context) => { 
  
    self.toggle = () => {    
    
      const collapsiblePanes = [].slice.call(context.querySelectorAll('[data-collapsible-target]'));
      
      if (collapsiblePanes.length) {

        collapsiblePanes.forEach(pane => {
          
          const collapsibleId = pane.dataset.collapsibleTarget;
          if (collapsibleId && context.querySelector('[data-collapsible=' + collapsibleId + ']')) {
            
           
            
            const toggle = context.querySelector('[data-collapsible=' + collapsibleId + ']');
            if (toggle) {
              
              toggle.classList.remove('is-active');
              
              toggle.addEventListener('click', event => {

                event.preventDefault();
                //pane.classList.toggle('hidden');
                //pane.classList.remove('hidden');
                
                const toggleClass = pane.dataset.collapsibleAnimate ? pane.dataset.collapsibleAnimate : 'hidden';
                pane.classList.toggle(toggleClass);
                
                if (Drupal.behaviors.phDefault) {
                  const collapsibleParentId = event.currentTarget.dataset.collapsibleParent;
                  let parent = collapsibleParentId ? context.querySelector('[data-collapsible-parent-id="' + collapsibleParentId + '"]') : event.currentTarget.parentNode.parentNode;
                  Drupal.behaviors.phDefault.siblings(event.currentTarget, parent, '[data-collapsible]', { 'class': 'is-active', 'op': 'remove' });
                }
                event.currentTarget.classList.toggle('is-active');
                
                if (!pane.classList.contains(toggleClass)) {
                  self.toggleRelated(context, toggle, pane, toggleClass);
                  event.currentTarget.classList.remove('is-active');
                  //self.togglePane();
                }
                
              }, { capture: true });
            }
          }
        });
      }
    };
      
    self.siblings = (element, context) => {
      const collapsibleParentId = element.dataset.collapsibleParent;
      
      let parent = collapsibleParentId ? context.querySelector('[data-collapsible-parent-id="' + collapsibleParentId + '"]') : element.parentNode.parentNode;
      
       
      const allToggles = [].slice.call(parent.querySelectorAll('[data-collapsible]'));
      
      allToggles.forEach(sibling => {
        if (sibling !== element) {
          sibling.classList.remove('is-active');
        }
      }); 
    },
    
    self.toggleRelated = (context, toggle, pane, toggleClass) => {
      if (toggle.dataset.hide) {
        const hideParents = [].slice.call(context.querySelectorAll('[data-collapsible-hide=' + toggle.dataset.hide + ']'));
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
    };
    
    /*
    self.togglePane = () => {
        const closePanes = [].slice.call(document.querySelectorAll('.mouseout'));
        if (closePanes.length) {
          closePanes.forEach(pane => {
            document.addEventListener('click', event => {
              if (!pane.classList.contains('hidden') && event.target !== pane) {
                const parent = event.target.parentNode;
                if (!event.target.classList.contains('collapsible-toggle') && !event.target.classList.contains('collapsible-back') && !parent.classList.contains('collapsible-toggle') && !parent.classList.contains('collapsible-back')) {
                  pane.classList.add('hidden');
                }
              }
            });
          });
        }
      }
    */
    return self;
  
  };

})(Drupal); 
