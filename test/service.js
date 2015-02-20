'use strict';

import angular from 'angular';
import {expect} from 'chai';

export default function () {

  let CountdownTimer;
  beforeEach(angular.mock.inject(function (_CountdownTimer_) {
    CountdownTimer = _CountdownTimer_;
  }));

  describe('Constructor', function () {

    it('captures the length', function () {
      expect(new CountdownTimer(1000)).to.have.property('length', 1000);
    });

    it('can set options', function () {
      expect(new CountdownTimer(1000, {
        tickInterval: 30
      }))
      .to.have.deep.property('options.tickInterval', 30);
    });

  });

}
