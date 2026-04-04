import { HttpClient } from './client';
import { EmailFinder } from './resources/email-finder';
import { EmailVerifier } from './resources/email-verifier';
import { PhoneFinder } from './resources/phone-finder';
import { ReverseEmail } from './resources/reverse-email';
import { Account } from './resources/account';

export class Enrow {
  email: EmailFinder;
  verify: EmailVerifier;
  phone: PhoneFinder;
  reverseEmail: ReverseEmail;
  account: Account;

  constructor(apiKey: string, options?: { baseUrl?: string }) {
    const http = new HttpClient(apiKey, options?.baseUrl);

    this.email = new EmailFinder(http);
    this.verify = new EmailVerifier(http);
    this.phone = new PhoneFinder(http);
    this.reverseEmail = new ReverseEmail(http);
    this.account = new Account(http);
  }
}

export default Enrow;

export { EnrowError, AuthenticationError, InsufficientBalanceError, RateLimitError } from './errors';

export type {
  EmailFindParams,
  EmailFindResult,
  EmailFindBulkParams,
  EmailFindBulkResponse,
  EmailFindBulkResult,
  VerifySingleParams,
  VerifySingleResult,
  VerifyBulkParams,
  VerifyBulkResponse,
  VerifyBulkResult,
  PhoneFindParams,
  PhoneFindResponse,
  PhoneFindResult,
  PhoneFindBulkParams,
  PhoneBulkResponse,
  PhoneBulkResult,
  ReverseEmailParams,
  ReverseEmailResult,
  ReverseEmailBulkParams,
  ReverseEmailBulkResponse,
  ReverseEmailBulkResult,
  AccountInfo,
  PollOptions,
  Company,
  VerifyChecks,
  VerifyMetadata,
} from './types';
