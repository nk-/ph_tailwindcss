<?php

namespace Drupal\ph_core\Form;

use Drupal\Core\Form\FormStateInterface;

use Drupal\user\Form\UserLoginForm;

/**
 * Provides a user login form override.
 *
 * @internal
 */
class PhLoginForm extends UserLoginForm {

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $config = $this->config('system.site');

    $form = parent::buildForm($form, $form_state);
    $form['#prefix'] = '<div id="user-login-ajax-prefix">';
    $form['#suffix'] = '</div>';

    $form['actions']['submit']['#attributes']['id'] = 'login-submit';
    /*
    $form['actions']['submit']['#ajax'] = [
    'callback' => [get_class($this), 'ajaxSubmitAndValidate'],
    'wrapper' => 'user-login-ajax-prefix',
    'progress' => [
    'type' => NULL,
    ],
    ];
     */
    // $form['actions']['submit']['#executes_submit_callback'] = FALSE;
    $this->renderer->addCacheableDependency($form, $config);
    return $form;
  }

}
