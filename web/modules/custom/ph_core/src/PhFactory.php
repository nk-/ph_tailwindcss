<?php

namespace Drupal\ph_core;

use Symfony\Component\DependencyInjection\ContainerInterface;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Security\TrustedCallbackInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Form\FormState;
use Drupal\Core\Form\FormBuilderInterface;
use Drupal\Core\Entity\EntityFormBuilderInterface;
use Drupal\Core\Render\RendererInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Url;

use Drupal\Component\Utility\Html;

use Drupal\views\Views;
use Drupal\ph_core\Form\PhLoginForm;

/**
 * Main Ph* services.
 */
class PhFactory implements ContainerInjectionInterface, TrustedCallbackInterface {

  /**
   * Drupal\Core\StringTranslation\StringTranslationTrait instance.
   *
   * @var \Drupal\Core\StringTranslation\StringTranslationTrait
   */
  use StringTranslationTrait;

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
   * Drupal\Core\Entity\EntityFormBuilderInterface definition.
   *
   * @var \Drupal\Core\Entity\EntityFormBuilderInterface
   */
  protected $entityFormbuilder;

  /**
   * Drupal\Core\Render\Renderer definition.
   *
   * @var \Drupal\Core\Render\Renderer
   */
  protected $renderer;

  /**
   * PhFactory constructor.
   *
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Form\FormBuilderInterface $form_builder
   *   For builder interface.
   * @param \Drupal\Core\Entity\EntityFormBuilderInterface $entity_form_builder
   *   Entity form builder interface.
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   Renderer interface.
   */
  public function __construct(AccountInterface $current_user, EntityTypeManagerInterface $entity_type_manager, FormBuilderInterface $form_builder, EntityFormBuilderInterface $entity_form_builder, RendererInterface $renderer) {
    $this->currentUser = $current_user;
    $this->entityTypeManager = $entity_type_manager;
    $this->formBuilder = $form_builder;
    $this->entityFormbuilder = $entity_form_builder;
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
      $container->get('entity.form_builder'),
      $container->get('renderer')
    );
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

  /**
   * Render Search widget.
   *
   * @param string $view_id
   *   View's machine name.
   * @param string $display_id
   *   Display's machine name.
   *
   * @return array
   *   Form views_exposed_form form.
   */
  public function renderSearch(string $view_id, string $display_id) {
    $search_widget = $this->renderViewFilter($view_id, $display_id);
    if (isset($search_widget['form'])) {
      $search_widget['form']['actions']['#attributes']['class'][] = 'visually-hidden';
      $search_widget['form']['keys']['#type'] = 'search';
      return $search_widget['form'];
    }
  }

  /**
   * Render contact form programmatically.
   *
   * @param string $contact_form_id
   *   Machine name of contact form entity.
   *
   * @return array
   *   Entity form.
   */
  public function renderContactForm(string $contact_form_id) {
    if ($contact_form_entity = $this->entityTypeManager->getStorage('contact_message')->create(['contact_form' => $contact_form_id])) {
      return $this->entityFormbuilder->getForm($contact_form_entity);
    }
  }

  /**
   * Render User pane.
   *
   * It is a total override on "menu--account.html.twig"
   *
   * @param array $items
   *   Menu links.
   *
   * @return string
   *   Array with custom links and forms,
   *   to send back to theme to become $variables.
   */
  public function renderUserPane(array &$items) {

    $uid = $this->currentUser->id();
    $vars = [];

    if ($vars['account'] = $this->entityTypeManager->getStorage('user')->load($uid)) {

      $image = $vars['account']->hasField('user_picture') && $vars['account']->get('user_picture')->target_id ? $this->entityTypeManager->getStorage('file')->load($vars['account']->get('user_picture')->target_id) : NULL;

      if ($image) {
        $style_id = NULL;
        if ($settings = $this->entityTypeManager->getStorage('entity_view_display')->load('user.user.default')) {
          if ($settings->getRenderer('user_picture')) {
            $image_settings = $settings->getRenderer('user_picture')->getSettings();
            $style_id = $image_settings['image_style'];
          }
        }
        $vars['image'] = [
          'file' => $image,
          'style' => $style_id ? $this->entityTypeManager->getStorage('image_style')->load($style_id) : NULL,
          'attributes' => [
            '#width' => $vars['account']->get('user_picture')->width,
            '#height' => $vars['account']->get('user_picture')->height,
            '#alt' => $vars['account']->get('user_picture')->alt,
            '#title' => $vars['account']->get('user_picture')->title,
          ],
        ];
      }

      $vars['items'] = [];
      $item_attributes = [
        'data-hide' => 'user_pane',
        'data-back-icon' => 'west',
        'class' => [
          'collapsible-toggle',
          'block',
          'hover:animate-none',
        ],
      ];

      foreach ($items as $route_name => $route) {

        switch ($route_name) {
          case 'user.page':
            $title = $this->t('My page');
            break;

          case 'user.logout':
            $title = $uid == 0 ? $this->t('Sign in') : $route['title'];
            $item_attributes['data-collapsible'] = $uid == 0 ? 'user_login' : str_replace('-', '_', Html::getClass($route_name));
            break;

          default:
            $title = $route['title'];
            $item_attributes['data-collapsible'] = str_replace('-', '_', Html::getClass($route_name));
            break;
        }

        $vars['items'][$route_name] = [
          '#type' => 'link',
          '#url' => $route['url'],
          '#title' => $title,
          '#attributes' => $item_attributes,
        ];
      }

      $vars['forms'] = [];

      if ($uid == 0) {
        $register_url = Url::fromRoute('user.register');
        $item_attributes['data-collapsible'] = 'user_register';
        $vars['items']['user.register'] = [
          '#type' => 'link',
          '#url' => $register_url,
          '#title' => $this->t('Sign up'),
          '#attributes' => $item_attributes,
        ];

        $vars['forms']['login_form'] = $this->formBuilder->getForm(PhLoginForm::class);

        $user_entity = $this->entityTypeManager->getStorage('user')->create([]);
        $formObject = $this->entityTypeManager->getFormObject('user', 'register')->setEntity($user_entity);
        $vars['forms']['register_form'] = $this->formBuilder->getForm($formObject);

        /*
        $vars['forms']['register_form']['#prefix'] = '<div id="user-register-ajax-prefix">';
        // $vars['forms']['register_form']['#suffix'] = '</div>';

        $vars['forms']['register_form']['actions']['submit']['#ajax'] = [
        'callback' => '::ajaxCallback',
        'wrapper' => 'user-register-ajax-prefix',
        'progress' => [
        'type' => NULL,
        ],
        ];
         */
        $vars['forms']['register_form']['user_picture']['#title_display'] = 'invisible';
        $vars['forms']['register_form']['field_about']['widget'][0]['#description_display'] = 'invisible';
        $vars['forms']['register_form']['field_about']['widget'][0]['#attributes']['placeholder'] = $vars['forms']['register_form']['field_about']['widget'][0]['#title'];
      }
    }
    return $vars;
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
      // 'ph_core_data' => $data,
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
  }

}
