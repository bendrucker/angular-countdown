'use strict';

import angular from 'angular';
import {expect} from 'chai';

export default function () {

  let CountdownTimer;
  beforeEach(angular.mock.inject(function (_CountdownTimer_) {
    CountdownTimer = _CountdownTimer_;
  }));

  it('works', function () {
    expect(CountdownTimer).to.be.a('function');
  });

}
