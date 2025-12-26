import InventoryPage from "./components/InventoryPage";
import logo from "./assets/logo.png";

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <img src={logo} alt="Thea's Cookies & Cakes Logo" className="logo" />
        <h1>Thea's Cookies & Cakes</h1>
      </header>

      <InventoryPage />
    </div>
  );
}

export default App;
