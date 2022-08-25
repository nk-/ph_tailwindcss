<?php

namespace Drupal\ph_core\Plugin\Field\FieldFormatter;

use Drupal\Component\Utility\Html;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'ph_core_code_default' formatter.
 *
 * @FieldFormatter(
 *   id = "ph_core_code_default",
 *   label = @Translation("Code (ph_core)"),
 *   field_types = {
 *     "ph_core_code"
 *   }
 * )
 */
class PhCoreCodeFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
        // Implement default settings.
      ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    return [
        // Implement settings form.
      ] + parent::settingsForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];
    // Implement settings summary.
    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];
    foreach ($items as $delta => $item) {
      $value = $item->getValue();
      //$language = (!empty($value['languages'])) ? $value['languages'] : '';
      $elements[$delta] = [
        //'#markup' => '<div class="ph_core-wrapper" rel="' . $language . '"><pre><code class="language-' . $language . '">' . $this->viewValue($item) . '</code></pre></div>',
        '#markup' => $this->viewValue($item),
        '#attached' => [
          'library' => [
            'ph_core/code',
          ],
        ],
      ];
    }

    return $elements;
  }

  /**
   * Generate the output appropriate for one field item.
   *
   * @param \Drupal\Core\Field\FieldItemInterface $item
   *   One field item.
   *
   * @return string
   *   The textual output generated.
   */
  protected function viewValue(FieldItemInterface $item) {
    // The text value has no text format assigned to it, so the user input
    // should equal the output, including newlines.
    return nl2br(Html::escape($item->value));
  }

}
