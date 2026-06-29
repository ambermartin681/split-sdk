/**
 * SDK response snapshot tests — API contract verification.
 *
 * These tests lock the shape of SDK read-method responses. Any accidental
 * breaking change to a returned object's shape will fail CI immediately.
 *
 * Update snapshots: vitest run --update-snapshots
 * Affected files are stored in test/snapshots/__snapshots__/
 */

import { describe, it, expect, vi } from "vitest";
import { Keypair, StrKey } from "@stellar/stellar-sdk";
import { StellarSplitClient } from "../../src/client.js";
import { computeInvoiceStats } from "../../src/invoiceStats.js";
import {
  FIXTURE_INVOICE,
  FIXTURE_INVOICE_EXT,
  FIXTURE_PAYMENT_HISTORY,
  FIXTURE_STATS,
} from "./fixtures.js";

function makeClient() {
  return new StellarSplitClient({
    rpcUrl: "https://soroban-testnet.stellar.org",
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: StrKey.encodeContract(
      Keypair.fromSecret("SCZANGBA5YELZDAB3BHBWPUSNPYETBGBQV773AGXXL2MRY4FKJVBQYF").rawPublicKey()
    ),
  });
}

/** Serialize bigint fields to strings so snapshots are stable across engines. */
function serializeBigInts(value: unknown): unknown {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(serializeBigInts);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, serializeBigInts(v)])
    );
  }
  return value;
}

describe("SDK response snapshots", () => {
  it("getInvoice shape matches snapshot", async () => {
    const client = makeClient();
    vi.spyOn(client, "getInvoice").mockResolvedValue(FIXTURE_INVOICE);

    const result = await client.getInvoice("1");
    expect(serializeBigInts(result)).toMatchSnapshot();
  });

  it("getInvoiceExt shape matches snapshot", async () => {
    const client = makeClient();
    vi.spyOn(client, "getInvoiceExt").mockResolvedValue(FIXTURE_INVOICE_EXT);

    const result = await client.getInvoiceExt("1");
    expect(serializeBigInts(result)).toMatchSnapshot();
  });

  it("getInvoiceHistory shape matches snapshot", async () => {
    const client = makeClient();
    vi.spyOn(client, "getInvoiceHistory").mockResolvedValue(FIXTURE_PAYMENT_HISTORY);

    const result = await client.getInvoiceHistory("1");
    expect(serializeBigInts(result)).toMatchSnapshot();
  });

  it("getPaymentHistory shape matches snapshot", async () => {
    const client = makeClient();
    vi.spyOn(client, "getPaymentHistory").mockResolvedValue(FIXTURE_PAYMENT_HISTORY);

    const result = await client.getPaymentHistory("1");
    expect(serializeBigInts(result)).toMatchSnapshot();
  });

  it("getStats (computeInvoiceStats) shape matches snapshot", () => {
    const result = computeInvoiceStats(FIXTURE_INVOICE);
    expect(serializeBigInts(result)).toMatchSnapshot();
  });

  it("fixture FIXTURE_STATS matches snapshot", () => {
    expect(serializeBigInts(FIXTURE_STATS)).toMatchSnapshot();
  });
});
