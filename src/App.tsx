import AuthGate from "./components/AuthGate";
import InventoryPage from "./components/InventoryPage";
import { Center, Image } from "@chakra-ui/react";
import axey from "./assets/axey-eating.png";

function App() {
  return (
    <div>
      <main>
        <AuthGate>
          <InventoryPage />
        </AuthGate>
        <Center maxW="480px">
          <Image
            src={axey}
            boxSize="32px"
            borderRadius="full"
            fit="cover"
            alt="Axey eating"
          />
        </Center>
      </main>
    </div>
  );
}

export default App;
