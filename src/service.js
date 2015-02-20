'use strict';

import EventEmitter from 'events';
import angular from 'angular';

const factory = function ($interval) {
  return class CountdownTimer extends EventEmitter {
    constructor (length, options) {
      this.length = length;
      this.options = angular.extend({
        tickInterval: 15
      }, options);
    }
    start () {
      const tickInterval = this.options.tickInterval;
      this.$$position = 0;
      this.$$interval = $interval(() => {
        const tickProportion = tickInterval / this.length;
        this.$$position += (tickProportion * 2 * Math.PI);
        this.emit('tick', this.$$position, tickProportion);
      }, tickInterval, this.length / tickInterval);
    }
  };
};
factory.$inject = ['$interval'];

export default factory;
