import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Button,
  Container,
  Field,
  Fieldset,
  HStack,
  Input,
  NumberInput,
  Popover,
  Portal,
  Stack,
  Table,
  Tag,
  Textarea,
} from "@chakra-ui/react";

import { toaster } from "./ui/toaster";
import { FaRegTrashAlt } from "react-icons/fa";

interface Ingredient {
  id: string;
  name: string;
  brand: string;
  expires_on: string;
}

interface AddIngredientProps {
  ingredientsVersion: number;
  onIngredientAdded: () => void;
}

export default function AddIngredient({
  ingredientsVersion,
  onIngredientAdded,
}: AddIngredientProps) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [supplier, setSupplier] = useState("");
  const [lot, setLot] = useState("");
  const [notes, setNotes] = useState("");
  const [mrp, setMrp] = useState(0);
  const [expiresOn, setExpiresOn] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(false);
  const [unavailableIngredients, setUnavailableIngredients] = useState<
    Ingredient[]
  >([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [markedIngredient, setMarkedIngredient] = useState<string | null>(null); // stores the id of the ingredient.

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

  const markIngredientOver = async () => {
    alert("Marked ingredient: " + markedIngredient);
    if (!markedIngredient) {
      console.warn("No ingredient selected");
      return;
    }

    console.log("Updating ingredient:", markedIngredient);

    const { data, error } = await supabase
      .from("ingredients")
      .update({ is_over: true })
      .eq("id", markedIngredient)
      .select();

    if (error) {
      console.log("Error:", data);
      toaster.create({
        description: "Failed to mark ingredient as over",
        type: "error",
      });
    } else {
      console.log("Updated rows:", data);
      toaster.create({
        description: "Ingredient marked as over",
        type: "success",
      });
    }
  };

  const handleSubmit = async () => {
    if (!name || !lot || !expiresOn) {
      toaster.create({
        description: "Please fill in the required fields",
        type: "info",
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("ingredients").insert({
        name,
        brand,
        supplier,
        lot,
        notes,
        mrp,
        expires_on: expiresOn,
      });

      if (error) throw error;

      toaster.create({
        description: "Ingredient added successfully",
        type: "success",
      });
      setName("");
      setBrand("");
      setSupplier("");
      setLot("");
      setNotes("");
      setMrp(0);
      setExpiresOn("");
    } catch (err) {
      console.error(err);
      toaster.create({
        description: "Something went wrong while adding the ingredient!",
        type: "error",
      });
    } finally {
      setLoading(false);
      onIngredientAdded();
    }
  };

  // Fetch ingredients
  useEffect(() => {
    fetchIngredients();
    fetchUnavailableIngredients();
  }, [ingredientsVersion]);

  return (
    <Container maxW="480px" w="full" px={0}>
      <Fieldset.Root>
        <Stack>
          <Fieldset.Legend />
          <Fieldset.HelperText>
            Stockup the cookie pantry by recording ingredients you purchase
          </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field.Root required orientation="horizontal">
            <Field.Label>
              Name
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="Ingredient name"
              variant="subtle"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field.Root>
          <Field.Root orientation="horizontal">
            <Field.Label>
              Brand
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="Which brand?"
              variant="subtle"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </Field.Root>
          <Field.Root orientation="horizontal">
            <Field.Label>
              Supplier
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="Which shop?"
              variant="subtle"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </Field.Root>
          <Stack direction="row">
            <Field.Root required orientation="horizontal">
              <Field.Label>
                LOT
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder="LOT number"
                variant="subtle"
                value={lot}
                onChange={(e) => setLot(e.target.value)}
              />
            </Field.Root>
            <Field.Root required orientation="horizontal">
              <Field.Label>
                Expiry
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="date"
                variant="subtle"
                value={expiresOn}
                onChange={(e) => setExpiresOn(e.target.value)}
              />
            </Field.Root>
          </Stack>
          <Field.Root orientation="horizontal" w="49%">
            <Field.Label>
              MRP
              <Field.RequiredIndicator />
            </Field.Label>
            <NumberInput.Root
              w="stretch"
              variant="subtle"
              value={Number.isFinite(mrp) ? String(mrp) : ""}
              onValueChange={(e) => {
                setMrp(Number.isNaN(e.valueAsNumber) ? 0 : e.valueAsNumber);
              }}
            >
              <NumberInput.Control />
              <NumberInput.Input />
            </NumberInput.Root>
          </Field.Root>
          <Field.Root orientation="vertical">
            <Field.Label>
              Notes
              <Field.RequiredIndicator />
            </Field.Label>
            <Textarea
              placeholder="Some notes about the ingredient"
              variant="outline"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field.Root>
          <Button
            type="submit"
            variant="solid"
            onClick={handleSubmit}
            disabled={loading}
            loading={loading}
          >
            Add ingredient
          </Button>
        </Fieldset.Content>
      </Fieldset.Root>

      <Fieldset.Root mt={8}>
        <Stack>
          <Fieldset.Legend>Pantry</Fieldset.Legend>
          <Fieldset.HelperText>Ingredients in the pantry</Fieldset.HelperText>
        </Stack>

        <Table.Root size="sm" striped>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Ingredient</Table.ColumnHeader>
              <Table.ColumnHeader>Brand</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Expiry</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Clear</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {ingredients.map((ingredient) => (
              <Table.Row key={ingredient.id}>
                <Table.Cell>{ingredient.name}</Table.Cell>
                <Table.Cell>{ingredient.brand}</Table.Cell>
                <Table.Cell textAlign="end">
                  <Tag.Root
                    mt="auto"
                    w="auto"
                    alignSelf="flex-start"
                    colorPalette="red"
                  >
                    <Tag.Label>{ingredient.expires_on}</Tag.Label>
                  </Tag.Root>
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <Popover.Root size="xs">
                    <Popover.Trigger asChild>
                      <Button
                        size="xs"
                        variant="surface"
                        onClick={() => setMarkedIngredient(ingredient.id)}
                      >
                        <FaRegTrashAlt />
                      </Button>
                    </Popover.Trigger>
                    <Portal>
                      <Popover.Positioner>
                        <Popover.Content width="200px" p={0}>
                          <Popover.Arrow />
                          <Popover.Body>
                            <Popover.Title fontWeight="medium">
                              Mark {ingredient.name} as over?
                            </Popover.Title>
                            <HStack my={3}>
                              <Button
                                size="xs"
                                variant="ghost"
                                colorPalette="purple"
                                onClick={markIngredientOver}
                              >
                                Yes
                              </Button>
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => setMarkedIngredient(null)}
                              >
                                No, not yet!
                              </Button>
                            </HStack>
                          </Popover.Body>
                        </Popover.Content>
                      </Popover.Positioner>
                    </Portal>
                  </Popover.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        <Stack>
          <Fieldset.Legend></Fieldset.Legend>
          <Fieldset.HelperText>
            Unavailable ingredients (expired)
          </Fieldset.HelperText>
        </Stack>

        <Table.Root size="sm" striped>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Ingredient</Table.ColumnHeader>
              <Table.ColumnHeader>Brand</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Expiry</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {unavailableIngredients.map((ingredient) => (
              <Table.Row key={ingredient.id}>
                <Table.Cell>{ingredient.name}</Table.Cell>
                <Table.Cell>{ingredient.brand}</Table.Cell>
                <Table.Cell textAlign="end">
                  <Tag.Root
                    mt="auto"
                    w="auto"
                    alignSelf="flex-start"
                    colorPalette="purple"
                  >
                    <Tag.Label>{ingredient.expires_on}</Tag.Label>
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
