# Enrow Node.js / TypeScript SDK

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/EnrowAPI/enrow-js)](https://github.com/EnrowAPI/enrow-js)
[![Last commit](https://img.shields.io/github/last-commit/EnrowAPI/enrow-js)](https://github.com/EnrowAPI/enrow-js/commits)

Find and verify professional emails, phone numbers, and contact information with the [Enrow API](https://enrow.io).

## Install

```bash
npm install enrow
```

## Quick start

```typescript
import Enrow from 'enrow';

const enrow = new Enrow('your_api_key');

const result = await enrow.email.find({
  companyDomain: 'apple.com',
  fullName: 'Tim Cook',
});

console.log(result.email); // tcook@apple.com
```

## Email Finder

```typescript
// Find a single email
const search = await enrow.email.find({
  companyDomain: 'apple.com',
  fullName: 'Tim Cook',
  settings: { countryCode: 'US' },
});

// Pass custom data and request gender detection
const result = await enrow.email.find({
  companyDomain: 'apple.com',
  fullName: 'Tim Cook',
  custom: { internalId: '42', source: 'crm' },
  settings: { retrieveGender: true },
});
console.log(result.info?.gender); // "male"

// Wait for result (auto-polling)
const result = await enrow.email.find(
  { companyDomain: 'apple.com', fullName: 'Tim Cook' },
  { waitForResult: true, pollInterval: 2000, timeout: 30000 }
);

// Get result by ID
const result = await enrow.email.get('search_abc123');

// Bulk search
const batch = await enrow.email.findBulk({
  searches: [
    { companyDomain: 'apple.com', fullName: 'Tim Cook' },
    { companyDomain: 'microsoft.com', fullName: 'Satya Nadella' },
  ],
  settings: { webhook: 'https://yourapp.com/webhook' },
});

const results = await enrow.email.getBulk(batch.batchId);
```

## Email Verifier

```typescript
const verification = await enrow.verify.single({ email: 'tcook@apple.com' });
console.log(verification.qualification); // "valid"

// Bulk
const batch = await enrow.verify.bulk({ emails: ['a@b.com', 'c@d.com'] });
const results = await enrow.verify.getBulk(batch.batchId);
```

## Phone Finder

```typescript
// By LinkedIn URL (recommended)
const phone = await enrow.phone.find({
  linkedinUrl: 'https://linkedin.com/in/timcook',
});

// By name + company
const phone = await enrow.phone.find({
  firstName: 'Tim',
  lastName: 'Cook',
  companyDomain: 'apple.com',
});

// Wait for result
const result = await enrow.phone.find(
  { linkedinUrl: 'https://linkedin.com/in/timcook' },
  { waitForResult: true }
);

const details = await enrow.phone.get('phone_abc123');
```

## Account

```typescript
const account = await enrow.account.info();
console.log(account.credits); // 8500
```

## Error handling

```typescript
import Enrow, { RateLimitError, InsufficientBalanceError, EnrowError } from 'enrow';

try {
  await enrow.email.find({ companyDomain: 'apple.com', fullName: 'Tim Cook' });
} catch (err) {
  if (err instanceof RateLimitError) {
    // 429 — too many requests
  }
  if (err instanceof InsufficientBalanceError) {
    // 422 — not enough credits
  }
  if (err instanceof EnrowError) {
    console.log(err.status, err.message);
  }
}
```

## Credits

| Endpoint | Cost |
|----------|------|
| Email Finder | 1 credit/email |
| Email Verifier | 0.25 credit/email |
| Phone Finder | 50 credits/phone |

## Links

- [API Documentation](https://docs.enrow.io)
- [Enrow](https://enrow.io)

## License

MIT
