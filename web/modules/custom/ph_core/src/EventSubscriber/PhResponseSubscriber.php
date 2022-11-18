<?php

namespace Drupal\ph_core\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpFoundation\RequestStack;

use Drupal\Core\Ajax\AjaxResponse;

/**
 * Response subscriber to handle AJAX responses.
 */
class PhResponseSubscriber implements EventSubscriberInterface {

  /**
   * Current request.
   *
   * @var \Symfony\Component\HttpFoundation\Request|null
   */
  protected $request;

  /**
   * AjaxResponseSubscriber constructor.
   *
   * @param \Symfony\Component\HttpFoundation\RequestStack $request_stack
   *   Request stack service.
   */
  public function __construct(RequestStack $request_stack) {
    $this->request = $request_stack->getCurrentRequest();
  }

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
            $form_id = $command['args'][0]['form_id'] ?? NULL;
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
