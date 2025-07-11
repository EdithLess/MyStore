import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category_name: string;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 21;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Product[]>("http://127.0.0.1:8000/api/products/")
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
        setFilteredProducts(res.data);

        const uniqueCategories = [...new Set(res.data.map((p) => p.category_name))] as string[];
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  useEffect(() => {
    let result = [...products];
    if (minPrice) result = result.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= parseFloat(maxPrice));
    if (selectedCategory) result = result.filter(p => p.category_name === selectedCategory);
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [minPrice, maxPrice, selectedCategory, products]);

    const goToProductPage = (name: string) => {
        const slug = name.toLowerCase().replace(/\s+/g, "-");
        navigate(`/${slug}`);
    };
  
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (page: number) => setCurrentPage(page);
  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory("");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Catalog</h2>

      <div className="flex flex-wrap justify-center gap-4 mb-6 bg-gray-100 p-4 rounded shadow">
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border rounded p-2 w-32"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border rounded p-2 w-32"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded p-2 w-48"
        >
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={resetFilters}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg shadow hover:shadow-lg cursor-pointer transition w-full max-w-xs"
            onClick={() => goToProductPage(product.name)}
          >
            <img
              src={product.image || "https://via.placeholder.com/300"}
              alt={product.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-blue-600 font-bold">${product.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
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
    </div>
  );
}
