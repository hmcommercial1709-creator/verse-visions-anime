const API_KEY = "CD8QVA9-671M15W-HJ497N1-2ZTX4XA";

export interface CryptoPaymentData {
  amount: number;
  orderId: string;
  description: string;
}

export async function createNowPaymentsInvoice(data: CryptoPaymentData) {
  try {
    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: data.amount,
        price_currency: "usd",
        pay_currency: "usdttrc20",
        order_id: data.orderId,
        order_description: data.description,
      }),
    });

    if (!response.ok) {
      throw new Error("فشل في إنشاء فاتورة NOWPayments");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("NOWPayments Error:", error);
    throw error;
  }
}
