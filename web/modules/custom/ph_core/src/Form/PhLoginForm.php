<?php

namespace Drupal\ph_core\Form;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\InvokeCommand;
use Drupal\Core\Ajax\RedirectCommand;
use Drupal\Core\Ajax\ReplaceCommand;

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

    $form['actions']['submit']['#ajax'] = [
      'callback' => '::ajaxCallback',
      'wrapper' => 'user-login-ajax-prefix',
      'progress' => [
        'type' => NULL,
      ],
    ];

    // $form['actions']['submit']['#executes_submit_callback'] = FALSE;
    $this->renderer->addCacheableDependency($form, $config);
    return $form;
  }

  /**
   * Callback for all ajax actions.
   *
   * Returns parent container element for each group.
   */
  public function ajaxCallback(array &$form, FormStateInterface $form_state) {

    $response = new AjaxResponse();
    // Validation failed.
    if (!empty($form_state->getErrors())) {
      $form_state->setRebuild(TRUE);
      $response->addCommand(new ReplaceCommand('#user-login-ajax-prefix', $form));
      $response->addCommand(new InvokeCommand(NULL, 'phAjaxFormValidatation', [$form['#id']]));
      return $response;
    }
    // Submit form and reload the page.
    else {
      $this->submitForm($form, $form_state);
      $currentURL = Url::fromRoute('<current>');
      $response->addCommand(new RedirectCommand($currentURL->toString()));
      return $response;
    }
  }

}
