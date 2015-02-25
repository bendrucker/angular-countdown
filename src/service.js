'use strict';

import EventEmitter from 'events';
import angular from 'angular';

function factory ($interval) {
  return class CountdownTimer extends EventEmitter {
    constructor (length, options) {
      this.length = length;
      this.options = angular.extend({
        tickInterval: 15
      }, options);
    }
    start () {
      const tickInterval = this.options.tickInterval;
      this.$$interval = $interval(() => {
        this.emit('tick', tickInterval / this.length);
      }, tickInterval, this.length / tickInterval);

      this.$$interval.then(() => this.emit('done'));

      return this;
    }
    cancel () {
      if (this.$$interval) {
        $interval.cancel(this.$$interval);
        this.emit('done');
      }
      return this;
    }
  };
}
factory.$inject = ['$interval'];

export default factory;
