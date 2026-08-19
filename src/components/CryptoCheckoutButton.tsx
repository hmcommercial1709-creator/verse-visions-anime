import { useState } from 'react';
import { createNowPaymentsInvoice } from '@/services/nowpayments';

interface CryptoButtonProps {
  amount: number;
  orderId: string;
  productName: string;
}

export const CryptoCheckoutButton = ({ amount, orderId, productName }: CryptoButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const invoice = await createNowPaymentsInvoice({
        amount,
        orderId,
        description: `شراء منتج: ${productName}`,
      });

      if (invoice && invoice.invoice_url) {
        window.location.href = invoice.invoice_url;
      } else {
        alert("حدث خطأ أثناء توليد فاتورة الدفع.");
      }
    } catch (error) {
      console.error(error);
      alert("فشل الاتصال ببوابة الدفع.");
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
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%'
      }}
    >
      {loading ? 'جاري تجهيز الدفع...' : 'الدفع بالعملات الرقمية (USDT)'}
    </button>
  );
};
