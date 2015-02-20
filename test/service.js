'use strict';

import angular from 'angular';
import {expect} from 'chai';
import sinon from 'sinon';

export default function () {

  let CountdownTimer, timer, $interval;
  beforeEach(angular.mock.inject(function (_CountdownTimer_, _$interval_) {
    CountdownTimer = _CountdownTimer_;
    timer = new CountdownTimer(1500);
    $interval = _$interval_;
  }));

  describe('Constructor', function () {

    it('captures the length', function () {
      expect(timer).to.have.property('length', 1500);
    });

    it('can set options', function () {
      expect(new CountdownTimer(1000, {
        tickInterval: 30
      }))
      .to.have.deep.property('options.tickInterval', 30);
    });

  });

  describe('#start', function () {

    it('emits a tick every interval', function () {
      const onTick = sinon.spy();
      timer.on('tick', onTick);
      timer.start();
      expect(onTick.callCount).to.equal(0);
      $interval.flush(15);
      expect(onTick.callCount).to.equal(1);
      $interval.flush(15);
      expect(onTick.callCount).to.equal(2);
    });

    it('emits the distance and tick proportion', function () {
      const onTick = sinon.spy();
      timer.on('tick', onTick);
      timer.start();
      $interval.flush(15);
      expect(onTick.firstCall.args[0]).to.equal(Math.PI * 2 / 100);
      expect(onTick.firstCall.args[1]).to.equal(.01);
    });

  });

}
