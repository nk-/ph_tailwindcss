<?php

namespace Drupal\ph_core\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
//use Drupal\Core\Routing\RoutingEvents;
use Symfony\Component\Routing\RouteCollection;


/**
 * Class PhCoreRouteSubscriber.
 *
 *
 */
class PhCoreRouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    //$mutable_types = $this->mutableResourceTypes();
    //\Drupal::service('logger.factory')->get('ph_core')->notice('<pre>' . print_r(array_keys($collection), 1) .'</pre>');
    
    
    foreach ($collection as $name => $route) {
      if ($name == 'ph_core.login_form') {
        $defaults = $route->getDefaults();
       // dpm($route);
        //\Drupal::service('logger.factory')->get('ph_core')->notice('<pre>' . print_r($route, 1) .'</pre>');
     }
      
/*
      if (!empty($defaults['_is_jsonapi']) && !empty($defaults['resource_type'])) {
        $methods = $route->getMethods();
        if (in_array('DELETE', $methods)) {
          // We never want to delete data, only unpublish.
          $collection->remove($name);
        }
        else {
          $resource_type = $defaults['resource_type'];
          if (empty($mutable_types[$resource_type])) {
            if (in_array('POST', $methods) || in_array('PATCH', $methods)) {
              $collection->remove($name);
            }
          }
        }
      }
*/
    }
  }

  /**
   * Get mutable resource types, exposed to user changes via API.
   *
   * @return array
   *   List of mutable jsonapi resource types as keys.
   */
/*
  public function mutableResourceTypes(): array {
    return [
      'node--issue_updates' => TRUE,
    ];
  }
*/

}

