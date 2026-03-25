import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { ProductProvider } from './context/ProductContext'
import { useTheme } from './hooks/useTheme'


function App() {
	const { isDark, toggleTheme } = useTheme();

return(
	<ProductProvider>
		<></>
	</ProductProvider>
);
}

export default App
