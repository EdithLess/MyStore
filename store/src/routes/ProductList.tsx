import { useEffect } from "react";
import axios from "axios";

function ProductList() {
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/products/")
            .then((response) => {
                console.log("Products:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    return <div>Check the console for product data</div>;
}

export default ProductList;
