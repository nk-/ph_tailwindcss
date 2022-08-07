<?php

namespace Drupal\ph_core\EventSubscriber;

use Drupal\Core\Ajax\AjaxResponse;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Response subscriber to handle AJAX responses.
 */
class AjaxResponseSubscriber implements EventSubscriberInterface {

  /**
   * Renders the ajax commands right before preparing the result.
   *
   * @param \Symfony\Component\HttpKernel\Event\FilterResponseEvent $event
   *   The response event, which contains the possible AjaxResponse object.
   */
  public function onResponse(FilterResponseEvent $event) {

    $response = $event->getResponse();
    if ($response instanceof AjaxResponse) {

      $commands = &$response->getCommands();
      $form_id = NULL;
      $form_build_id = NULL;

      if (!empty($commands)) {
        foreach ($commands as $command) {
          if (isset($command['command']) && $command['command'] = 'update_build_id' && isset($command['new'])) {
            $form_build_id = $command['new'];
          }
          if (isset($command['method']) && $command['method'] == 'phAjaxFormValidatation' && !empty($command['args'])) {
            $form_id = isset($command['args'][0]['form_id']) ? $command['args'][0]['form_id'] : NULL;
          }
        }
      }

      $commands[] = [
        'command' => 'phAjaxFormValidate',
        'form_id' => $form_id,
        'form_build_id' => $form_build_id,
      ];
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [KernelEvents::RESPONSE => [['onResponse']]];
  }

}
