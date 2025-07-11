import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function CategoryPage() {
    const { categoryName } = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/products/")
            .then((response) => {
                const allProducts = response.data;
                allProducts.filter((product: any) => console.log(product))
                const categoryFiltered = allProducts.filter(
                    (product: any) =>
                        product.category_name.toLowerCase().replace(/\s+/g, "-") === categoryName?.toLowerCase()
                );

                setFilteredProducts(categoryFiltered);
            })
            .catch((error) => console.error("Error loading products:", error));
    }, [categoryName]);

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-black mb-6">
                Products in category: {categoryName}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product: any) => (
                    <div key={product.id} className="bg-gray-800 text-white p-4 rounded shadow">
                        <img
                            src={product.image || "https://via.placeholder.com/150"}
                            alt={product.name}
                            className="mb-3 rounded object-contain w-full h-64"
                        />
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-400">Price: {product.price}$</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryPage;
