import { useState } from "react";
import AddIngredient from "./AddIngredient";
import AddLot from "./AddLot";
import SellLot from "./SellLot";
import { Image, Container, Box, Heading, Tabs, HStack } from "@chakra-ui/react";
import logo from "../assets/logo.png";

export default function InventoryPage() {
  const [lotsVersion, setLotsVersion] = useState(0);
  const [ingredientsVersion, setIngredientsVersion] = useState(0);
  return (
    <Box minH="100dvh" p={4}>
      <Container maxW="480px" w="full" px={0}>
        <HStack justify="space-between" w="full">
          <Heading size="2xl">Thea's Cookies & Cakes</Heading>
          <Image
            src={logo}
            alt="Thea's Cookies & Cakes Logo"
            boxSize="92px"
            borderRadius="full"
            objectFit="cover"
          />
        </HStack>

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
