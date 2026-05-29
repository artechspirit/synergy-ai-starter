# [FITUR/PROJECT] - Threat Model

## 1. Scope
- Feature/project:
- Maturity level:
- Data sensitivity:
- In scope:
- Out of scope:

## 2. Assets To Protect
- [Asset 1]
- [Asset 2]

## 3. Actors
- Legitimate users:
- Admin/support:
- External services:
- Potential attackers/abusers:

## 4. Trust Boundaries
- Client:
- API:
- Database:
- Storage:
- Third-party:

## 5. Abuse Cases
| Abuse Case | Impact | Likelihood | Mitigation | Residual Risk |
|---|---|---:|---|---|
| Unauthorized access | High | Medium | Authz check server-side |  |
| Replay/duplicate submit | Medium | Medium | Idempotency key |  |

## 6. Security Controls
- Authentication:
- Authorization:
- Validation:
- Rate limiting:
- Logging/audit:
- Encryption:
- Secrets:

## 7. Test Plan
- [ ] Negative auth/permission test
- [ ] Rate limit/manual abuse check
- [ ] Input validation test
- [ ] Audit log verification

## 8. Open Risks
- [Risk 1]
- [Risk 2]

## 9. Approval
- Owner:
- Reviewer:
- Approved at:
