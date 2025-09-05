import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const back_url="https://mystore-n3gb.onrender.com/"

function ProductPage() {
    const [product, setProduct] = useState<any>(null);
    const { slug } = useParams();

    useEffect(() => {
        axios.get(`${back_url}api/products/`)
            .then((response) => {
                const found = response.data.find((p: any) => {
                    const normalizedName = p.name.toLowerCase().replace(/\s+/g, "-");
                    return normalizedName === slug;
                });
                setProduct(found);
            })
            .catch((error) => console.error("Error fetching products:", error));
    }, [slug]);

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please sign in or sign up before adding the product");
                return;
            }

            await axios.post(`${back_url}api/cart/`, {
                product_id: product.id,
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            alert("Added to cart ✅");
        } catch (error) {
            console.error("error:", error);
            alert("Couldn't add to cart ❌");
        }
    };

    if (!product) {
        return <div className="text-white p-6 text-lg">Can't find the product...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-900 text-white rounded shadow-lg mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div>
                    <img
                        src={product.image || "https://via.placeholder.com/300"}
                        alt={product.name}
                        className="w-full h-auto rounded-lg shadow-md object-cover"
                    />
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-lg text-gray-400 mb-4">Category: <span className="text-white font-medium">{product.category_name}</span></p>

                    <p className="text-2xl font-semibold text-green-400 mb-4">{product.price}$</p>

                    <p className="text-md text-gray-300 mb-6">
                        {product.description || "Unfortunately right now we don't have a description for the required product"}
                    </p>

                    <button
                        onClick={handleAddToCart}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg text-lg transition"
                    >
                        Add to cart 🛒
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductPage;
