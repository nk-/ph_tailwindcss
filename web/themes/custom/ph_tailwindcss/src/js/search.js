 /**
 * @file
 * Ph TailwindCss search factory.
 */
 
'use strict';

document.addEventListener('DOMContentLoaded', (event) => {

  const searchInputs = [].slice.call(document.querySelectorAll('[data-collapsible-search-target]'));
  searchInputs.forEach(input => {
    const collapsibleId = input.dataset.collapsibleSearchTarget;
    if (collapsibleId && document.querySelector('[data-collapsible-search=' + collapsibleId + ']')) {
      const toggle = document.querySelector('[data-collapsible-search=' + collapsibleId + ']');
      if (toggle) { // && toggle.classList.contains('collapsible-search-toggle')) {
        let timeout;
        toggle.addEventListener('click', event => {
          
          event.preventDefault();
          event.currentTarget.classList.toggle('is-active');
          
          input.classList.toggle('scale-x-0');
          input.classList.toggle('scale-x-100');
          input.classList.toggle('invisible');
          input.classList.toggle('visible');
          
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
});