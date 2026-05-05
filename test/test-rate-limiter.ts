import {RateLimitThreshold} from '../lib/index.js';
import {assert} from 'chai';
import {performance} from 'node:perf_hooks';

describe('RateLimitThreshold', function () {

  this.timeout(40000); // MusicBrainz has a rate limiter

  it('Measure rate', async () => {
    const rateLimitThreshold = new RateLimitThreshold(10, 5);

    const t0 = performance.now();
    for (let n = 0; n < 20; ++n) {
      await rateLimitThreshold.limit();
    }
    const delta = (performance.now() - t0) / 1000;
    assert.approximately(delta, 5, 1, "Total call duration");
  });

});
