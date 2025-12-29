import { useState } from "react";
import AddIngredient from "./AddIngredient";
import AddLot from "./AddLot";
import SellLot from "./SellLot";
import {
  Image,
  Container,
  Box,
  Heading,
  Tabs,
  HStack,
  VStack,
} from "@chakra-ui/react";
import logo from "../assets/logo.png";

export default function InventoryPage() {
  const [lotsVersion, setLotsVersion] = useState(0);
  const [ingredientsVersion, setIngredientsVersion] = useState(0);

  return (
    <Box minH="100dvh" p={4}>
      <Container maxW="480px" w="full" px={0}>
        <HStack
          justify="space-between"
          align="center"
          w="full"
          // Optional padding/border if this is a header bar
          // py={4}
        >
          {/* Left: stacked title */}
          <VStack align="start" lineHeight="1">
            <Heading
              as="h1"
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
              fontFamily='"bebas-neue", system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", "Helvetica Neue", sans-serif'
              letterSpacing="0.02em"
              color="#8c008c"
            >
              Thea's
            </Heading>
            <Heading
              as="div"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontFamily='"krul", serif'
              letterSpacing="wide" /* or "0.02em" if you prefer */
              mt={-3}
            >
              Cookies and Cakes
            </Heading>
          </VStack>

          {/* Right: logo, vertically centered by the HStack's align="center" */}
          <Image
            src={logo}
            alt="Thea's Cookies & Cakes Logo"
            boxSize={{ base: "72px", md: "84px", lg: "92px" }}
            borderRadius="full"
            objectFit="cover"
            flexShrink={0}
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
              ingredientsVersion={ingredientsVersion}
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
