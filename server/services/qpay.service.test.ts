// @vitest-environment node
import { describe, it, expect } from "vitest";
import { qpayService } from "@server/services/qpay.service";

// With no QPAY_* env in tests, the service runs in sandbox mode.

describe("qpayService (sandbox)", () => {
  it("reports sandbox mode when credentials are absent", () => {
    expect(qpayService.isSandbox).toBe(true);
  });

  it("creates a deterministic mock invoice carrying the amount", async () => {
    const invoice = await qpayService.createInvoice({
      senderInvoiceNo: "res123-999",
      receiverCode: "99112233",
      description: "test deposit",
      amount: 50000,
      callbackRef: "res123",
    });
    expect(invoice.invoiceId).toBe("sandbox-res123-999");
    expect(invoice.qrText).toContain("50000");
    expect(invoice.qrImage).toBeNull();
  });

  it("never reports paid from a sandbox gateway check", async () => {
    const result = await qpayService.checkPayment("sandbox-anything");
    expect(result.paid).toBe(false);
    expect(result.paidAmount).toBe(0);
  });
});
