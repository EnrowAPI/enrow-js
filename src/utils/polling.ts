import type { PollOptions } from '../types';

const DEFAULT_INTERVAL = 2000;
const DEFAULT_TIMEOUT = 30000;

const PENDING_STATES = ['pending', 'processing', 'ongoing'];

export async function pollUntilDone<T>(
  fetcher: () => Promise<T>,
  isDone: (result: T) => boolean,
  options: PollOptions = {}
): Promise<T> {
  const interval = options.pollInterval || DEFAULT_INTERVAL;
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  const start = Date.now();

  while (true) {
    const result = await fetcher();

    if (isDone(result)) {
      return result;
    }

    if (Date.now() - start >= timeout) {
      return result;
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

export function isNotPending(result: { status?: string; qualification?: string }): boolean {
  const state = result.status || result.qualification || '';
  return !PENDING_STATES.includes(state);
}
