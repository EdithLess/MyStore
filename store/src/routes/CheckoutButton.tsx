import axios from "axios";
const back_url="https://mystore-n3gb.onrender.com/"

function CheckoutButton() {
  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login");
      return;
    }

    try {
      const res = await axios.post(`${back_url}api/create-checkout-session/`, {}, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Stripe checkout error", err);
      alert("Error creating payment");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
    >
      Pay with Stripe 💳
    </button>
  );
}

export default CheckoutButton;
