import AppRouterProvider from '@/router'; // Importa el proveedor del router
import './styles/index.css';

function App() {
  return (
    <>
      {/* Renderiza el router que manejará las páginas */}
      <AppRouterProvider />
    </>
  );
}

export default App;