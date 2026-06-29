/**
 * Deterministic fixture data for SDK snapshot tests.
 *
 * All values are static — no timestamps that change, no random IDs.
 * bigint fields serialized as strings in Vitest snapshots automatically.
 */

import type { Invoice, Payment, Recipient, InvoiceExt } from "../../src/types.js";
import { computeInvoiceStats } from "../../src/invoiceStats.js";

export const FIXTURE_RECIPIENT: Recipient = {
  address: "GBBD47IF6LWK7P7MLAEHCFTEZBWIVDRIAS5OEWROOPT2NMHQSPIUHGP",
  amount: 5000000n,
};

export const FIXTURE_PAYMENT: Payment = {
  payer: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN",
  amount: 5000000n,
  timestamp: 1700000000,
  ledger: 1000,
};

export const FIXTURE_INVOICE: Invoice = {
  id: "1",
  creator: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGZWM7MDQNYCXGFBPBRSQF",
  recipients: [FIXTURE_RECIPIENT],
  token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
  deadline: 2000000000,
  funded: 5000000n,
  payments: [FIXTURE_PAYMENT],
  status: "Pending",
};

export const FIXTURE_INVOICE_EXT: InvoiceExt = {
  parentInvoiceId: null,
  cloneDepth: 0,
};

export const FIXTURE_PAYMENT_HISTORY: Payment[] = [
  FIXTURE_PAYMENT,
  {
    payer: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN",
    amount: 2500000n,
    timestamp: 1700000060,
    ledger: 1001,
  },
];

export const FIXTURE_STATS = computeInvoiceStats(FIXTURE_INVOICE);
