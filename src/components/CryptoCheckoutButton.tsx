import React, { useState } from 'react';
import { createNowPaymentsInvoice } from '../services/nowpayments';

interface CryptoButtonProps {
  amount: number;
  orderId: string;
  productName: string;
}

export const CryptoCheckoutButton: React.FC<CryptoButtonProps> = ({ amount, orderId, productName }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const invoice = await createNowPaymentsInvoice({
        amount: amount,
        orderId: orderId,
        description: `شراء منتج: ${productName}`,
      });

      if (invoice && invoice.invoice_url) {
        // توجيه العميل مباشرة إلى صفحة الدفع الآمنة في NOWPayments
        window.location.href = invoice.invoice_url;
      } else {
        alert("حدث خطأ أثناء توليد فاتورة الدفع.");
      }
    } catch (error) {
      console.error(error);
      alert("فشل الاتصال ببوابة الدفع، تأكد من البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      style={{
        backgroundColor: '#10b981',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
        display: 'flex',
        alignItem: 'center',
        gap: '8px'
      }}
    >
      {loading ? 'جاري تجهيز الدفع...' : 'الدفع بالعملات الرقمية (USDT)'}
    </button>
  );
};
