import axios from "axios";

function CheckoutButton() {
  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/create-checkout-session/", {}, {
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
