import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Urls from '../utils/Urls.js';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) return;

    const verifyPayment = async () => {
      try {
        // Get session from Stripe
        const { data: session } = await axios.get(
          `${Urls.dev}/api/v1/stripe/checkout-session/${sessionId}`,
          { withCredentials: true }
        );

        if (!session.payment_status || session.payment_status !== 'paid') {
          toast.error('Payment not completed!');
          return;
        }

        // Optionally fetch order id from your backend
        const { data: orderData } = await axios.get(
          `${Urls.dev}/api/v1/order/getOrderBySession/${sessionId}`,
          { withCredentials: true }
        );

        if (orderData?.success) {
          navigate(`/orderStatus/${orderData.branchCode}/${orderData.order}`);
        }
      } catch (err) {
        console.error(err);
        toast.error('Error verifying payment.');
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  return <div className="text-white">Verifying payment...</div>;
};

export default PaymentSuccess;
