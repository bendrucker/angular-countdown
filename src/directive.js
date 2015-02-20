'use strict';

import template from './template.html';

export default {
  restrict: 'EA',
  scope: {
    timer: '='
  },
  controller: CountdownController,
  bindToController: true,
  controllerAs: 'countdown',
  template: template
}

class CountdownController {}
