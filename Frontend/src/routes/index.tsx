import { Routes, Route } from "react-router-dom";
import { ProductsPage } from "../pages/ProductPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProductsPage />} />
    </Routes>
  );
}