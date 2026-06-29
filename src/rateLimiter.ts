import { RateLimitQueueFullError } from "./errors.js";

export interface RateLimiterConfig {
  maxRequestsPerSecond: number;
  /** Maximum number of requests that can queue while waiting for a token. Default: 50. */
  queueCap?: number;
}

export interface RateLimitStats {
  tokensAvailable: number;
  queuedRequests: number;
  totalThrottled: number;
}

export class RateLimiter {
  private _tokens: number;
  private _maxTokens: number;
  private _refillIntervalMs: number;
  private _lastRefillTime: number;
  private _queue: Array<() => void> = [];
  private _processing = false;
  private _queueCap: number;
  private _totalThrottled = 0;

  constructor(config: RateLimiterConfig) {
    this._maxTokens = config.maxRequestsPerSecond;
    this._tokens = this._maxTokens;
    this._refillIntervalMs = 1000;
    this._lastRefillTime = Date.now();
    this._queueCap = config.queueCap ?? 50;
  }

  private _refill(): void {
    const now = Date.now();
    const elapsed = now - this._lastRefillTime;
    if (elapsed >= this._refillIntervalMs) {
      const periods = Math.floor(elapsed / this._refillIntervalMs);
      this._tokens = Math.min(
        this._maxTokens,
        this._tokens + periods * this._maxTokens
      );
      this._lastRefillTime += periods * this._refillIntervalMs;
    }
  }

  acquire(): Promise<void> {
    this._refill();
    if (this._tokens > 0) {
      this._tokens--;
      return Promise.resolve();
    }
    if (this._queue.length >= this._queueCap) {
      throw new RateLimitQueueFullError(this._queueCap);
    }
    this._totalThrottled++;
    return new Promise<void>((resolve) => {
      this._queue.push(resolve);
      if (!this._processing) {
        this._processQueue();
      }
    });
  }

  getRateLimitStats(): RateLimitStats {
    return {
      tokensAvailable: this._tokens,
      queuedRequests: this._queue.length,
      totalThrottled: this._totalThrottled,
    };
  }

  private _processQueue(): void {
    this._processing = true;
    const msUntilRefill = Math.max(
      0,
      this._refillIntervalMs - (Date.now() - this._lastRefillTime)
    );
    setTimeout(() => {
      this._refill();
      while (this._tokens > 0 && this._queue.length > 0) {
        const next = this._queue.shift();
        if (next) {
          this._tokens--;
          next();
        }
      }
      if (this._queue.length > 0) {
        this._processQueue();
      } else {
        this._processing = false;
      }
    }, msUntilRefill);
  }
}
