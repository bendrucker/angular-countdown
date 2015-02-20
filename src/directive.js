'use strict';

export default {
  restrict: 'EA',
  scope: {
    timer: '='
  },
  controller: CountdownController,
  bindToController: true,
  controllerAs: 'countdown'
}

class CountdownController {}
