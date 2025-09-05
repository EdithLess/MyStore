import { useEffect } from "react";
import axios from "axios";
const back_url="https://mystore-n3gb.onrender.com/"

function ProductList() {
    useEffect(() => {
        axios.get(`${back_url}api/products/`)
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
