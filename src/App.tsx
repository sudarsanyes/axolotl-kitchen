// import AddLot from "./components/AddLot";
// import SellLot from "./components/SellLot";
// import AddIngredient from "./components/AddIngredient";
import InventoryPage from "./components/InventoryPage";

function App() {
  return (
    <div className="App">
      <img
        src="./assets/logo.png"
        alt="Thea's Cookies & Cakes Logo"
        className="logo"
      />
      <h1>Thea's Cookies & Cakes</h1>
      {/* <AddIngredient />
      <AddLot />
      <SellLot /> */}
      <InventoryPage />
    </div>
  );
}

export default App;
