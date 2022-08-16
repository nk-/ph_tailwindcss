/**
 * @file
 * Ph form elements UI.
 *
 * @ingroup Ph* core scripts.
 */
(function (Drupal) { 

  'use strict';

  jQuery.fn.phAjaxFormValidatation = function(formId) {
    let form;
    if (form = document.querySelector('#' + formId)) { 
      form.classList.remove('hidden');
    }
  };
  
  Drupal.behaviors.phForms = {
    attach: function(context, settings) {
      let ui;
      if (!ui && typeof phFormsUi !== 'undefined') {
        ui = phFormsUi(phFormsUi, context);
        ui.init();
        return false;
      }
      
      if (Drupal.AjaxCommands && Drupal.AjaxCommands.prototype) {
        Drupal.AjaxCommands.prototype.phAjaxFormValidate = function(ajax, response) {
          if (response.form_build_id) {
            let wrapper;
            if (ajax.wrapper) {
              if (wrapper = document.querySelector(ajax.wrapper)) { 
                [].slice.call(wrapper.children).forEach((child) => {
                  if (child.tagName === 'FORM') {
                    child.classList.remove('hidden');
                  }
                });
              }
            }
          }
        };
      }    
    }
  };

  const phFormsUi = (self, context) => {
  
    self.init = () => {
    
      const phForms = [].slice.call(context.querySelectorAll('.ph-form'));
      if (phForms.length) {
        const skip = [
          'file',
          'submit',
          'hidden',
          //'password'
        ];
        
        phForms.forEach(form => {
          const allInputs = [].slice.call(context.querySelectorAll('input'));
          let inputs = [];
          if (allInputs.length) {
            allInputs .forEach(input => {
              if (skip.indexOf(input.getAttribute('type')) < 0) {
                inputs.push(input); 
              }   
            });
          }
          const textareas = form .getElementsByTagName('textarea');
          const formElements = Object.values(inputs).concat(Object.values(textareas));
        
          if (formElements.length) {
            formElements.forEach(formElement => {
              formElement.parentForm = form;
              formElement.addEventListener('focus', self.formElements);
              formElement.addEventListener('blur', self.formElements);
              formElement.addEventListener('input', self.formElements);
            });  
          }
        });
      } 
    };
      
    self.formElements = (event) => {
      const element = event.currentTarget;
      const parent = element.parentNode;
            
       
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
            
            /*
            const timeout = buttonHandle;
            if (typeof timeout === 'number') {
              //clearTimeout(timeout); 
            }
            */
           
          });
        }  
        /*
        if (element.parentForm) {
          const timeout = buttonHandle;
          if (typeof buttonHandle === 'number') {
            clearTimeout(buttonHandle); 
          }
        }
        */
      };

    
      if (parent) {
        
        let label = parent.previousElementSibling;
        if (!label) {
          label = parent.querySelector('label');
        }
        else {
          label = label.tagName !== 'LABEL' ? parent.querySelector('label') : label;
        }
        
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
            inputOp(parent, element);
            /*
            let buttonHandle = setTimeout((form) => {
            const button = form.querySelector('input.form-submit');
            if (form.checkValidity()) {
              button.removeAttribute('disabled');    
            }
            else {
              button.setAttribute('disabled', '');  
            }
          }, 100, element.parentForm);
          */
            break;
        }
        element.setAttribute('placeholder', setPlaceholder);
      }
 
    };
    return self;
   };

})(Drupal);