import { useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Button,
  Container,
  Field,
  Fieldset,
  Input,
  NumberInput,
  Stack,
  Textarea,
} from "@chakra-ui/react";

import { toaster } from "./ui/toaster";

interface AddIngredientProps {
  onIngredientAdded: () => void;
}

export default function AddIngredient({
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
        type: "info",
      });
    } finally {
      setLoading(false);
      onIngredientAdded();
    }
  };

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
    </Container>

    // <div>
    //   <h2>🛒 Stock up the cookie pantry</h2>

    //   <label>* Name</label>
    //   <input
    //     type="text"
    //     value={name}
    //     onChange={(e) => setName(e.target.value)}
    //     placeholder="Ingredient name"
    //   />

    //   <label>Brand</label>
    //   <input
    //     type="text"
    //     value={brand}
    //     onChange={(e) => setBrand(e.target.value)}
    //     placeholder="What brand is it?"
    //   />

    //   <label>Supplier</label>
    //   <input
    //     type="text"
    //     value={supplier}
    //     onChange={(e) => setSupplier(e.target.value)}
    //     placeholder="Where did you get it from?"
    //   />

    //   <label>* LOT</label>
    //   <input
    //     type="text"
    //     value={lot}
    //     onChange={(e) => setLot(e.target.value)}
    //     placeholder="LOT number"
    //   />

    //   <label>Notes</label>
    //   <input
    //     type="text"
    //     value={notes}
    //     onChange={(e) => setNotes(e.target.value)}
    //     placeholder="Any notes?"
    //   />

    //   <label>MRP</label>
    //   <input
    //     type="number"
    //     value={mrp}
    //     onChange={(e) => setMrp(Number(e.target.value))}
    //     placeholder="MRP"
    //   />

    //   <label>* Expiry Date</label>
    //   <input
    //     type="date"
    //     value={expiresOn}
    //     onChange={(e) => setExpiresOn(e.target.value)}
    //   />

    //   <button onClick={handleSubmit} disabled={loading}>
    //     {loading ? "Adding..." : "Add ingredient"}
    //   </button>
    // </div>
  );
}
