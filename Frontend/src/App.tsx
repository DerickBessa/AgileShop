import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { ProductProvider } from './context/ProductContext'
import { useTheme } from './hooks/useTheme'
import { BrowserRouter } from "react-router-dom";



function App() {
	const { isDark, toggleTheme } = useTheme();

return(
	<BrowserRouter>
      <ProductProvider>
        <div>App funcionando</div>
      </ProductProvider>
    </BrowserRouter>
);
}

export default App
