import { useEffect, useState } from "react";
import axios from "axios";
import Banner from './Banner';
import { useNavigate } from "react-router-dom";

function Home() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 15;
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://mystore-n3gb.onrender.com/api/products/`)
            .then((response) => setProducts(response.data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    const handleAddToCart = async (productId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("You must enter the account");
                return;
            }

            await axios.post("http://127.0.0.1:8000/api/cart/", {
                product_id: productId
            }, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Error adding to cart ❌");
        }
    };

    const goToProductPage = (name: string) => {
        const slug = name.toLowerCase().replace(/\s+/g, "-");
        navigate(`/${slug}`);
    };

    const goToCategoryPage = (category: string) => {
        navigate(`/categories/${category}`);
    };


const populateProducts = async () => {
  try {
    const products = [
  {
    name: "Smartphone XR22",
    price: "599.99",
    image: "https://via.placeholder.com/150?text=Phone",
    description: "Latest smartphone with AI camera",
    category: 2
  },
  {
    name: "Wooden Desk",
    price: "249.99",
    image: "https://via.placeholder.com/150?text=Desk",
    description: "Stylish and sturdy wooden desk",
    category: 3
  },
  {
    name: "Running Shoes Pro",
    price: "89.99",
    image: "https://via.placeholder.com/150?text=Shoes",
    description: "Comfortable running shoes with grip",
    category: 4
  },
  {
    name: "Bluetooth Headphones",
    price: "129.99",
    image: "https://via.placeholder.com/150?text=Headphones",
    description: "Noise cancelling wireless headphones",
    category: 2
  },
  {
    name: "Minimalist Lamp",
    price: "39.99",
    image: "https://via.placeholder.com/150?text=Lamp",
    description: "LED desk lamp with touch controls",
    category: 5
  }
];
    await axios.post("https://generous-nurturing-production.up.railway.app/api/populate-products/", products);
    alert("✅ Products added!");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to add products");
  }
};

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(products.length / productsPerPage);

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="mb-6">
                <Banner />
            </div>

            <div className="flex">
                <aside className="w-1/4 pr-4 border-r border-gray-700 text-bg-gray-800">
                    <h2 className="text-xl font-semibold mb-4">Categories</h2>
                    <ul className="space-y-3">
                        {[
                            { name: "Clothes", emoji: "👕", slug: "clothes" },
                            { name: "Electronics", emoji: "🔌", slug: "electronics" },
                            { name: "Shoes", emoji: "👟", slug: "shoes" },
                            { name: "Miscellaneous", emoji: "📦", slug: "miscellaneous" },
                            { name: "Furniture", emoji: "🪑", slug: "furniture" },
                        ].map((category) => (
                            <li
                                key={category.slug}
                                onClick={() => goToCategoryPage(category.slug)}
                                className="flex items-center gap-2 text-gray-800 hover:text-blue-400 transition cursor-pointer"
                            >
                                <span className="text-xl">{category.emoji}</span>
                                <span className="text-base font-medium">{category.name}</span>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="w-3/4 pl-4">
                <div className="flex gap-4 mb-4">
    <button onClick={populateProducts} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
        Add Products
    </button>
</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentProducts.map((product: any) => (
                            <div
                                key={product.id}
                                onClick={() => goToProductPage(product.name)}
                                className="flex flex-col justify-between bg-gray-800 text-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
                            >
                                <div>
                                    <img
                                        src={product.image || "https://via.placeholder.com/150"}
                                        alt={product.name}
                                        className="mb-3 rounded object-cover h-48 w-full"
                                    />
                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                    <p className="text-gray-400">Price: {product.price}$</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product.id);
                                    }}
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                >
                                    Add to cart
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-6 gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
                                className={`px-3 py-1 rounded border ${currentPage === i + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    
                </main>
            </div>
        </div>
    );
}

export default Home;
