import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Enrow, AuthenticationError, InsufficientBalanceError, RateLimitError, EnrowError } from '../src/index';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Error handling', () => {
  let enrow: Enrow;

  beforeEach(() => {
    enrow = new Enrow('test_key');
    mockFetch.mockReset();
  });

  it('throws AuthenticationError on 401', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Headers(),
      json: () => Promise.resolve({ error: 'Unauthorized', message: 'Invalid API key', status: 401 }),
    });

    await expect(enrow.email.find({ companyDomain: 'test.com' })).rejects.toThrow(AuthenticationError);
  });

  it('throws InsufficientBalanceError on 402', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 402,
      statusText: 'Payment Required',
      headers: new Headers(),
      json: () => Promise.resolve({ error: 'InsufficientBalance', message: 'Not enough credits', status: 402 }),
    });

    await expect(enrow.email.find({ companyDomain: 'test.com' })).rejects.toThrow(InsufficientBalanceError);
  });

  it('throws RateLimitError on 429', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
      headers: new Headers(),
      json: () => Promise.resolve({ error: 'RateLimitExceeded', message: 'Rate limit exceeded', status: 429 }),
    });

    await expect(enrow.email.find({ companyDomain: 'test.com' })).rejects.toThrow(RateLimitError);
  });

  it('throws EnrowError on other errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers(),
      json: () => Promise.resolve({ error: 'ValidationError', message: 'Missing company_domain', status: 400 }),
    });

    await expect(enrow.email.find({})).rejects.toThrow(EnrowError);
  });
});
