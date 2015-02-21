'use strict';

import template from './template.html';
import styles from './styles.css';
import insertCss from 'insert-css';
const Pi = Math.PI;

insertCss(styles);

export default function () {
  return {
    restrict: 'EA',
    scope: {
      timer: '=',
      diameter: '@',
      stroke: '@'
    },
    controller: CountdownController,
    bindToController: true,
    controllerAs: 'countdown',
    template: template,
    templateNamespace: 'svg'
  };
}

function CountdownController ($scope) {
  this.$id = $scope.$id;
  this.angle = 0;
  Object.defineProperties(this, {
    radius: {
      get () {
        return this.diameter / 2;
      }
    },
    mid: {
      get () {
        return ~~(this.angle > Pi);
      }
    },
    x: {
      get () {
        return Math.sin(this.angle) * this.radius;
      }
    },
    y: {
      get () {
        return Math.cos(this.angle) * -this.radius;
      }
    }
  });
  this.timer
    .on('tick', ticked => this.angle += 2 * Pi * ticked)
    .once('done', () => this.done = true);
}
CountdownController.$inject = ['$scope'];
