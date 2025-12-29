import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Accordion,
  Button,
  CheckboxCard,
  Container,
  Field,
  Fieldset,
  Grid,
  Input,
  Span,
  Stack,
  Table,
  Tag,
} from "@chakra-ui/react";
import { toaster } from "./ui/toaster";

interface AddLotProps {
  ingredientsVersion: number;
  onLotCreated: () => void;
}

interface ProductLot {
  id: string;
  lot_code: string;
  product_name: string;
  manufactured_on: string;
  expires_on: string;
}

interface Ingredient {
  id: string;
  name: string;
  brand: string;
  expires_on: string;
}

export default function AddLot({
  ingredientsVersion,
  onLotCreated,
}: AddLotProps) {
  const [unavailableIngredients, setUnavailableIngredients] = useState<
    Ingredient[]
  >([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [productName, setProductName] = useState("");
  const [manufacturedOn, setManufacturedOn] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(false);
  const [lots, setLots] = useState<ProductLot[]>([]);

  const fetchLots = async () => {
    const { data, error } = await supabase
      .from("product_lots")
      .select("*")
      .order("manufactured_on", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setLots(data || []);
  };

  const fetchIngredients = async () => {
    const { data, error } = await supabase
      .from("available_ingredients")
      .select("id, name, brand, expires_on")
      .order("name");

    if (error) {
      console.error(error);
      return;
    }
    setIngredients(data);
  };

  const fetchUnavailableIngredients = async () => {
    const { data, error } = await supabase
      .from("unavailable_ingredients")
      .select("id, name, brand, expires_on")
      .order("name");

    if (error) {
      console.error(error);
      return;
    }
    setUnavailableIngredients(data);
  };

  // Fetch ingredients
  useEffect(() => {
    fetchIngredients();
    fetchUnavailableIngredients();
    fetchLots();
  }, [ingredientsVersion]);

  const toggleIngredient = (id: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!productName || selectedIngredients.length === 0) {
      toaster.create({
        description:
          "Please enter a product name and select at least one ingredient",
        type: "info",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Generate lot code
      const { data: lotCode, error: lotCodeError } = await supabase.rpc(
        "generate_lot_code",
        { p_date: manufacturedOn }
      );

      if (lotCodeError) throw lotCodeError;

      // 2. Insert product lot
      const expiresOn = new Date(manufacturedOn);
      expiresOn.setDate(expiresOn.getDate() + 21);

      const { data: newLot, error: lotInsertError } = await supabase
        .from("product_lots")
        .insert({
          lot_code: lotCode,
          product_name: productName,
          manufactured_on: manufacturedOn,
          expires_on: expiresOn.toISOString().slice(0, 10),
        })
        .select()
        .single();

      if (lotInsertError) throw lotInsertError;

      // 3. Link ingredients
      const links = selectedIngredients.map((ingredientId) => ({
        product_lot_id: newLot.id,
        ingredient_id: ingredientId,
        quantity_used: null,
      }));

      const { error: linkError } = await supabase
        .from("lot_ingredients")
        .insert(links);

      if (linkError) throw linkError;

      toaster.create({
        description: "Lot created successfully",
        type: "success",
      });
      // Reset form
      setProductName("");
      setSelectedIngredients([]);
      fetchLots(); // <------------- check here
    } catch (err) {
      console.error(err);
      toaster.create({
        description: "Something went wrong while creating the lot!",
        type: "error",
      });
    } finally {
      setLoading(false);
      onLotCreated();
    }
  };

  return (
    <Container maxW="480px" w="full" px={0}>
      <Fieldset.Root>
        <Stack>
          <Fieldset.Legend />
          <Fieldset.HelperText>
            Product and document details for the new lot
          </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field.Root required orientation="horizontal">
            <Field.Label>
              Product
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="Product name"
              variant="subtle"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Field.Root>
          <Field.Root required orientation="horizontal">
            <Field.Label>
              Made on
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="Manufactured on"
              type="date"
              variant="subtle"
              value={manufacturedOn}
              onChange={(e) => setManufacturedOn(e.target.value)}
            />
          </Field.Root>
          <Accordion.Root
            collapsible
            defaultValue={["available_ingredients"]}
            w="full"
          >
            <Accordion.Item value="available_ingredients">
              <Accordion.ItemTrigger
                display="flex"
                alignItems="center"
                w="full"
                px={2}
              >
                <Span>Available ingredients</Span>
                <Accordion.ItemIndicator ml="auto" />
              </Accordion.ItemTrigger>

              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <Grid templateColumns="repeat(2, 1fr)" gap="1">
                    {ingredients.map((ingredient) => (
                      <CheckboxCard.Root
                        variant="outline"
                        onChange={() => toggleIngredient(ingredient.id)}
                      >
                        <CheckboxCard.HiddenInput />
                        <CheckboxCard.Control
                          position="relative"
                          display="flex"
                          flexDirection="column"
                          h="full"
                        >
                          <CheckboxCard.Indicator
                            position="absolute"
                            top={5}
                            right={3}
                          />
                          <CheckboxCard.Label mr={4}>
                            {ingredient.name}
                          </CheckboxCard.Label>
                          <Tag.Root
                            mt="auto"
                            w="auto"
                            alignSelf="flex-start"
                            colorPalette="red"
                          >
                            <Tag.Label>{ingredient.expires_on}</Tag.Label>
                          </Tag.Root>
                        </CheckboxCard.Control>
                      </CheckboxCard.Root>
                    ))}
                  </Grid>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="unavailable_ingredients">
              <Accordion.ItemTrigger
                display="flex"
                alignItems="center"
                w="full"
                px={2}
              >
                <Span>Unavailable ingredients</Span>
                <Accordion.ItemIndicator ml="auto" />
              </Accordion.ItemTrigger>

              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <Grid templateColumns="repeat(2, 1fr)" gap="3">
                    {unavailableIngredients.map((ingredient) => (
                      <CheckboxCard.Root size="sm" disabled>
                        <CheckboxCard.HiddenInput />
                        <CheckboxCard.Control
                          position="relative"
                          display="flex"
                          flexDirection="column"
                          h="full"
                        >
                          <CheckboxCard.Indicator
                            position="absolute"
                            top={5}
                            right={3}
                          />
                          <CheckboxCard.Label mr={4}>
                            {ingredient.name}
                          </CheckboxCard.Label>
                          <Tag.Root
                            mt="auto"
                            w="auto"
                            alignSelf="flex-start"
                            colorPalette="purple"
                          >
                            <Tag.Label>{ingredient.expires_on}</Tag.Label>
                          </Tag.Root>
                        </CheckboxCard.Control>
                      </CheckboxCard.Root>
                    ))}
                  </Grid>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
          <Button onClick={handleSubmit} loading={loading} disabled={loading}>
            Save lot
          </Button>
        </Fieldset.Content>

        <Stack>
          <Fieldset.Legend>Lots</Fieldset.Legend>
          <Fieldset.HelperText>Current lot list</Fieldset.HelperText>
        </Stack>

        <Table.Root size="sm" striped>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Product</Table.ColumnHeader>
              <Table.ColumnHeader>Lot code</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Expiry</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {lots.map((lot) => (
              <Table.Row key={lot.id}>
                <Table.Cell>{lot.product_name}</Table.Cell>
                <Table.Cell>
                  <Tag.Root
                    mt="auto"
                    w="auto"
                    alignSelf="flex-start"
                    colorPalette="gray"
                  >
                    <Tag.Label>{lot.lot_code}</Tag.Label>
                  </Tag.Root>
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <Tag.Root
                    mt="auto"
                    w="auto"
                    alignSelf="flex-start"
                    colorPalette="red"
                  >
                    <Tag.Label>{lot.expires_on}</Tag.Label>
                  </Tag.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Fieldset.Root>
    </Container>
  );
}
