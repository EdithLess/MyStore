import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function SearchResults() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    if (query) {
      axios.get("http://127.0.0.1:8000/api/products/")
        .then((res) => {
          const filtered = res.data.filter((product: any) =>
            product.name.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filtered);
        })
        .catch((err) => console.error("Search error:", err));
    }
  }, [query]);

  const goToProductPage = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/${slug}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Search Results for: "{query}"</h2>
      {results.length === 0 ? (
        <p>No products found 😢</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((product: any) => (
            <div
              key={product.id}
              onClick={() => goToProductPage(product.name)}
              className="cursor-pointer bg-gray-800 p-4 rounded shadow hover:shadow-lg"
            >
              <img src={product.image} alt={product.name} className="mb-3 rounded h-48 w-full object-contain border-4" />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-400">Price: {product.price} uah</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
