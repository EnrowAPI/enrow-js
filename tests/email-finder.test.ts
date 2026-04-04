import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Enrow } from '../src/index';

const mockFetch = vi.fn();
global.fetch = mockFetch;

function mockResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: 'OK',
    headers: new Headers(),
    json: () => Promise.resolve(data),
  };
}

describe('EmailFinder', () => {
  let enrow: Enrow;

  beforeEach(() => {
    enrow = new Enrow('test_key');
    mockFetch.mockReset();
  });

  it('find() sends correct request', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse({
        id: 'search_123',
        status: 'completed',
        email: 'tcook@apple.com',
        qualification: 'valid',
        first_name: 'Tim',
        last_name: 'Cook',
        company: { name: 'Apple Inc.', domain: 'apple.com' },
        verified: true,
        credits_used: 1,
      })
    );

    const result = await enrow.email.find({
      companyDomain: 'apple.com',
      firstName: 'Tim',
      lastName: 'Cook',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.enrow.io/email/find/single',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'x-api-key': 'test_key',
          'Content-Type': 'application/json',
        },
      })
    );

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.company_domain).toBe('apple.com');
    expect(body.first_name).toBe('Tim');

    expect(result.email).toBe('tcook@apple.com');
    expect(result.qualification).toBe('valid');
    expect(result.company.domain).toBe('apple.com');
  });

  it('get() fetches by id', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse({
        id: 'search_123',
        status: 'completed',
        email: 'tcook@apple.com',
        qualification: 'valid',
      })
    );

    const result = await enrow.email.get('search_123');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.enrow.io/email/find/single/search_123',
      expect.objectContaining({ method: 'GET' })
    );
    expect(result.email).toBe('tcook@apple.com');
  });

  it('findBulk() sends array of searches', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse({
        batch_id: 'batch_xyz',
        total: 2,
        status: 'processing',
        credits_used: 2,
      })
    );

    const result = await enrow.email.findBulk({
      searches: [
        { companyDomain: 'apple.com', firstName: 'Tim', lastName: 'Cook' },
        { companyDomain: 'microsoft.com', firstName: 'Satya', lastName: 'Nadella' },
      ],
    });

    expect(result.batchId).toBe('batch_xyz');
    expect(result.total).toBe(2);
  });

  it('find() with waitForResult polls until completed', async () => {
    mockFetch
      .mockResolvedValueOnce(
        mockResponse({ id: 'search_123', status: 'pending' })
      )
      .mockResolvedValueOnce(
        mockResponse({ id: 'search_123', status: 'pending' })
      )
      .mockResolvedValueOnce(
        mockResponse({
          id: 'search_123',
          status: 'completed',
          email: 'tcook@apple.com',
          qualification: 'valid',
        })
      );

    const result = await enrow.email.find(
      { companyDomain: 'apple.com', firstName: 'Tim', lastName: 'Cook' },
      { waitForResult: true, pollInterval: 10, timeout: 5000 }
    );

    expect(result.status).toBe('completed');
    expect(result.email).toBe('tcook@apple.com');
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});
