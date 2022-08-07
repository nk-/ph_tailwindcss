/**
 * @file
 * Ph* search widget.
 *
 * @ingroup Ph* core scripts.
 */

(function () { 
  
  'use strict';

  Drupal.behaviors.phSearch = {

    attach: function(context, settings) {
      
      const searchInputs = [].slice.call(context.querySelectorAll('[data-collapsible-search-target]'));
      searchInputs.forEach(input => {
        const collapsibleId = input.dataset.collapsibleSearchTarget;
        if (collapsibleId && context.querySelector('[data-collapsible-search=' + collapsibleId + ']')) {
          const toggle = context.querySelector('[data-collapsible-search=' + collapsibleId + ']');
          if (toggle) {
            let timeout;
            toggle.addEventListener('click', event => {
          
              event.preventDefault();
          
              input.classList.toggle('scale-x-0');
              input.classList.toggle('scale-x-100');
              input.classList.toggle('invisible');
              input.classList.toggle('visible');
          
              if (Drupal.behaviors.phDefault) {
                const collapsibleParentId = event.currentTarget.dataset.collapsibleParent;
                let parent = collapsibleParentId ? context.querySelector('[data-collapsible-parent-id="' + collapsibleParentId + '"]') : event.currentTarget.parentNode.parentNode;
                Drupal.behaviors.phDefault.siblings(event.currentTarget, parent, '[data-collapsible]', { 'class': 'is-active', 'op': 'remove' });
              }
              event.currentTarget.parentNode.classList.toggle('is-active');
   
              if (input.classList.contains('scale-x-100')) {
                timeout = setTimeout((element) => {
                  //element.blur();
                  element.focus();
                }, 600, input);
              }
              else {
                if (typeof timeout === 'number') {
                  clearTimeout(timeout);
                }
              }
            });
            if (typeof timeout === 'number') {
              clearTimeout(timeout);
            }
          }
        }
      });
    }
  };

})(); 