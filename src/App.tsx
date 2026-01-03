import AuthGate from "./components/AuthGate";
import InventoryPage from "./components/InventoryPage";

function App() {
  return (
    <div>
      <main>
        <AuthGate>
          <InventoryPage />
        </AuthGate>
      </main>
    </div>
  );
}

export default App;
