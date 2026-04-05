// TestPayment.jsx
import axios from "axios";
import { DB_URL } from "../../utils/variables.js";

const TestPayment = () => {
  const handlePayment = async () => {
    try {
      const res = await axios.post(
        `${DB_URL}/payment/create-order`,
      );

      const options = {
        key: res.data.key,
        // amount: data.order.amount,
        amount: 10000,
        currency: `INR`,
        name: `Test App`,
        order_id: res.data.order_id,
        handler: async (response) => {
          const verifyRes = await axios.post(
            `${DB_URL}/payment/verify-payment`,
            response,
          );
          if (verifyRes.data.success) alert("✅ Payment Successful!");
          else alert("❌ Payment Failed!");
        },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.log(error);
    }
  };

  return <button onClick={handlePayment}>Buy Plan ₹999</button>;
};

export default TestPayment;
// ```

// ---

// ### Test Card Details
// ```
// Card Number : 4111 1111 1111 1111
// Expiry      : Any future date
// CVV         : Any 3 digits
// OTP         : 1234 (Razorpay test OTP)
