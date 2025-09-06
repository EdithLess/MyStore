import { useEffect, useState } from "react";
import axios from "axios";
import CheckoutButton from "./CheckoutButton";
const back_url="https://mystore-n3gb.onrender.com/"

function Cart() {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Enter your account");
            return;
        }

        try {
            const response = await axios.get(`${back_url}api/cart/`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            setOrder(response.data);
        } catch (error) {
            console.error("Error durint load:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (productId: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Enter your account!");
                return;
            }

            await axios.delete(`${back_url}api/cart/remove/`, {
                headers: {
                    Authorization: `Token ${token}`
                },
                data: {
                    product_id: productId
                }
            });

            fetchCart();

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading) return <div className="text-white p-4">Loading...</div>;

    if (!order || order.items.length === 0) {
        return <div className="text-white p-4">cart is empty</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 text-white">
            <h2 className="text-2xl font-bold mb-4">🛒 your products</h2>
            <div className="space-y-4">
                {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center bg-gray-800 p-4 rounded shadow">
                        <img
                            src={item.product.image || "https://via.placeholder.com/100"}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover rounded mr-4"
                        />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">{item.product.name}</h3>
                            <p className="text-gray-400">Price: {item.product.price}$</p>
                            <p className="text-gray-400">Quantity: {item.quantity}</p>
                            <button
                                onClick={() => deleteProduct(item.product.id)}
                                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                <div className="text-right text-xl font-bold text-black">
  Total: $
  {order.items.reduce(
    (total: number, item: any) => total + item.product.price * item.quantity,
    0
  )}
</div>
                                            <div className="mt-4">
  <CheckoutButton />
</div>
            </div>
        </div>
    );
}

export default Cart;
