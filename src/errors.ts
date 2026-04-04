export class EnrowError extends Error {
  status: number;
  error: string;

  constructor(status: number, error: string, message: string) {
    super(message);
    this.name = 'EnrowError';
    this.status = status;
    this.error = error;
  }
}

export class AuthenticationError extends EnrowError {
  constructor(message = 'Invalid or missing API key') {
    super(401, 'Unauthorized', message);
    this.name = 'AuthenticationError';
  }
}

export class InsufficientBalanceError extends EnrowError {
  constructor(message = 'Your credit balance is insufficient.') {
    super(402, 'InsufficientBalance', message);
    this.name = 'InsufficientBalanceError';
  }
}

export class RateLimitError extends EnrowError {
  retryAfter?: number;

  constructor(message = 'Rate limit exceeded', retryAfter?: number) {
    super(429, 'RateLimitExceeded', message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}
