import { useState } from "react";
import AddIngredient from "./AddIngredient";
import AddLot from "./AddLot";
import SellLot from "./SellLot";
import { Container, Box, Heading, Tabs } from "@chakra-ui/react";

export default function InventoryPage() {
  const [lotsVersion, setLotsVersion] = useState(0);
  const [ingredientsVersion, setIngredientsVersion] = useState(0);
  return (
    <Box minH="100dvh" p={4}>
      <Container maxW="480px" w="full" px={0}>
        <Heading size="2xl" px={4}>
          Thea's Cookies & Cakes
        </Heading>
        <Tabs.Root defaultValue="stockpile">
          <Tabs.List>
            <Tabs.Trigger value="stockpile">Stockpile</Tabs.Trigger>
            <Tabs.Trigger value="create_lot">Create lot</Tabs.Trigger>
            <Tabs.Trigger value="register_sale">Register sale</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="stockpile">
            <AddIngredient
              onIngredientAdded={() => setIngredientsVersion((v) => v + 1)}
            />
          </Tabs.Content>
          <Tabs.Content value="create_lot">
            <AddLot
              ingredientsVersion={ingredientsVersion}
              onLotCreated={() => setLotsVersion((v) => v + 1)}
            />
          </Tabs.Content>
          <Tabs.Content value="register_sale">
            <SellLot lotsVersion={lotsVersion} />
          </Tabs.Content>
        </Tabs.Root>
      </Container>
    </Box>
  );
}
