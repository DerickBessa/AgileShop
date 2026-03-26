import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProductProvider } from "./context/ProductContext";
import { AppRoutes } from "./routes";
import Navbar from "./components/NavBar";

function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <Navbar />
        <AppRoutes />
        <Toaster position="bottom-right" />
      </ProductProvider>
    </BrowserRouter>
  );
}

export default App;