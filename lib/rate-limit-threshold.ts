export class RateLimitThreshold {

  public static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private queue: number[] = [];
  private readonly period: number;

  /**
   * @param requests Number of allowed requests with period
   * @param period Period in seconds
   */
  public constructor(private requests: number, period: number) {
    this.period = 1000 * period;
  }

  /**
   * Call limit before the function you want call no more than `requests` in per `period`.
   * @return Resolved when timeout completed comply with rate limit threshold
   */
  public async limit(): Promise<number> {
    const now = new Date().getTime();
    const t0 = now - (this.period);
    while (this.queue.length > 0 && this.queue[0] < t0) {
      this.queue.shift();
    }
    let delay = 0;
    // debug(`Current rate is  ${this.queue.length} per ${this.period / 1000} sec`);
    if (this.queue.length >= this.requests) {
      delay = this.queue[0] + this.period - now;
      await RateLimitThreshold.sleep(delay);
    }
    this.queue.push(new Date().getTime());
    return delay;
  }

}
