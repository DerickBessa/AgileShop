import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProductProvider } from "./context/ProductContext";
import { AppRoutes } from "./routes";
import Navbar from "./components/NavBar";
import { CartDrawer } from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
		<CartProvider>
			<Navbar />
			<CartDrawer />
			<AppRoutes />
			<Toaster position="bottom-right" />
		</CartProvider>
      </ProductProvider>
    </BrowserRouter>
  );
}

export default App;