import InventoryPage from "./components/InventoryPage";
import logo from "./assets/logo.png";

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <img src={logo} alt="Thea's Cookies & Cakes Logo" className="logo" />
        <h3>Thea's Cookies & Cakes</h3>
      </header>
      <main>
        <InventoryPage />
      </main>
    </div>
  );
}

export default App;
