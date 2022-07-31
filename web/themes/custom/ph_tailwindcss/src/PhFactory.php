<?php

namespace Drupal\ph_tailwindcss;

use Symfony\Component\DependencyInjection\ContainerInterface;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Security\TrustedCallbackInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Form\FormState;
use Drupal\Core\Form\FormBuilderInterface;
use Drupal\Core\Render\RendererInterface;

use Drupal\Component\Plugin\Exception\PluginNotFoundException;

use Drupal\views\Views;


/**
 * User picture build callback for the ph_tailwindcss theme.
 */
class PhFactory implements ContainerInjectionInterface, TrustedCallbackInterface {

  /**
   * The currently authenticated user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Drupal\Core\Form\FormBuilderInterface definition.
   *
   * @var \Drupal\Core\Form\FormBuilderInterface
   */
  protected $formBuilder;

  /**
   * Drupal\Core\Render\Renderer definition.
   *
   * @var \Drupal\Core\Render\Renderer
   */
  protected $renderer;

  /**
   * PhUserPicture constructor.
   *
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(AccountInterface $current_user, EntityTypeManagerInterface $entity_type_manager, FormBuilderInterface $form_builder, RendererInterface $renderer) {
    $this->currentUser = $current_user;
    $this->entityTypeManager = $entity_type_manager;
    $this->formBuilder = $form_builder;
    $this->renderer = $renderer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('current_user'),
      $container->get('entity_type.manager'),
      $container->get('form_builder'),
      $container->get('renderer')
    );
  }

  /**
   * Render view filter programmatically.
   *
   * @param string $view_id
   *   View's machine name.
   * @param string $display_id
   *   Display's machine name.
   * @param array $data
   *   Some data to return back to a caller.
   * @param bool $render
   *   If true view will be rendered and returned as markup/string.
   *
   * @return array|string
   *   Array with form and form state. Or rendered views filter element.
   */
  public function renderViewFilter(string $view_id, string $display_id, array &$data = [], bool $render = FALSE) {

    static $count = 0;
    $count++;
    
    $view = Views::getView($view_id);
    $view->setDisplay($display_id);
    $view->initHandlers();

    // Define FormState.
    $form_state = new FormState();
    
    $values = [
      'view' => $view,
      'display' => $view->display_handler->display,
      'exposed_form_plugin' => $view->display_handler->getPlugin('exposed_form'),
      'method' => 'get',
      'rerender' => TRUE,
      'no_redirect' => TRUE,
      'always_process' => TRUE,
      //'nk_tools_search_input_data' => $data,
    ];

    $form_state->setFormState($values);

    $form_state->setRequestMethod('POST');
    $form_state->setCached(TRUE);

    $form = $this->formBuilder->buildForm('Drupal\views\Form\ViewsExposedForm', $form_state);
    $form['#id'] = 'ph-form-generated-' . $count;
       
    // $form['#attributes']['data-dom-id'] = $view->dom_id;
    // We do not want submit button visible here,
    // but we want it operational (JS/Ajax).
    // $form['actions']['#attributes']['class'][] = 'visually-hidden';
   
    if ($render) {
      return [
        '#markup' => $this->renderer->render($form),
        '#cache' => [
          'contexts' => [
            'views',
          ],
        ],
      ];
    }
    else {
      return [
        'form_state' => $form_state,
        'form' => $form, 
      ];
    }
/*
    return $render ? $this->renderer->render($form) : [
      'form_state' => $form_state,
      'form' => $form,
    ];
*/
  }
  
  
  
  /**
   * Lazy builder callback for the user picture.
   */
  public function build() { //: array {

    /** @var \Drupal\user\UserInterface $user */
    $user = $this->entityTypeManager->getStorage('user')->load($this->currentUser->id());

    $build = [
      '#type' => 'link',
      '#url' => $user->toUrl(),
      '#title' => [
        '#markup' => $user->getDisplayName(),
      ],
      '#attributes' => [
        'id' => 'toolbar-item-user',
        'class' => [
          'toolbar-icon',
          'toolbar-icon-user',
          'trigger',
          'toolbar-item',
        ],
        'role' => 'button',
      ],
    ];

    /** @var \Drupal\image\ImageStyleInterface $style */
    $style = NULL;
    try {
      $style = $this->entityTypeManager->getStorage('image_style')->load('thumbnail');
    }
    catch (PluginNotFoundException $e) {
      // The image style plugin does not exists. $style stays NULL and no user
      // picture will be added.
    }
    if ($style === NULL) {
      
      return ['link' => $build];
    }

    $file = $user->user_picture ? $user->user_picture->entity : NULL;
    if ($file === NULL) {
      return ['link' => $build];
    }

    $image_url = $style->buildUrl($file->getFileUri());

    $build['#attributes']['class'] = ['toolbar-item icon-user'];
    $build['#title'] = [
      '#type' => 'html_tag',
      '#tag' => 'img',
      '#attributes' => [
        'src' => $image_url,
        'alt' => $user->getAccountName(),
        'class' => [
          'icon-user__image',
        ],
      ],
    ];

    
    return ['link' => $build];
  }

  /**
   * {@inheritdoc}
   */
  public static function trustedCallbacks() {
    return [
      'build',
      'renderViewFilter',
    ];
  }

}
