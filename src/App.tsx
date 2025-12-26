import AddLot from "./components/AddLot";
import SellLot from "./components/SellLot";
import AddIngredient from "./components/AddIngredient";

function App() {
  return (
    <div className="App">
      <h1>Thea's Cookies & Cakes</h1>
      <AddIngredient />
      <AddLot />
      <SellLot />
    </div>
  );
}

export default App;
