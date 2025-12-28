import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Button,
  Container,
  createListCollection,
  Field,
  Fieldset,
  HStack,
  Input,
  NumberInput,
  Portal,
  Select,
  Stack,
  Table,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { toaster } from "./ui/toaster";

interface SellLotProps {
  lotsVersion: number;
}

interface ProductLot {
  id: string;
  lot_code: string;
  product_name: string;
  manufactured_on: string;
  expires_on: string;
}

interface SaleLot {
  id: string;
  customer: string;
  sold_on: string;
  product_name: string;
  expires_on: string;
}

export default function SellLot({ lotsVersion }: SellLotProps) {
  const [unsoldLots, setUnsoldLots] = useState<ProductLot[]>([]);
  const [saleLot, setSaleLot] = useState<SaleLot[]>([]); // sale <-> lot map
  const [selectedLot, setSelectedLot] = useState("");
  const [customer, setCustomer] = useState("");
  const [sellingPrice, setSellingPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const unsoldLotsCollection = createListCollection<ProductLot>({
    items: unsoldLots,
    itemToString: (lot) => lot.product_name,
    itemToValue: (lot) => lot.id,
  });

  const fetchUnsoldLots = async () => {
    const { data, error } = await supabase
      .from("unsold_lots") // <- our view
      .select("*")
      .order("manufactured_on", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setUnsoldLots(data || []);
  };

  const fetchSaleLots = async () => {
    const { data, error } = await supabase
      .from("salelot") // <- our view
      .select("*")
      .order("sold_on", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setSaleLot(data || []);
  };

  // Fetch unsold lots from the view
  useEffect(() => {
    fetchUnsoldLots();
    fetchSaleLots();
  }, [lotsVersion]);

  const handleSubmit = async () => {
    if (!selectedLot && !customer) {
      toaster.create({
        description: "Please select a lot and enter a customer name",
        type: "info",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Selected lot:" + selectedLot);
      console.log(
        customer + sellingPrice + new Date().toISOString().slice(0, 10)
      );
      const { error } = await supabase.from("sales").insert({
        product_lot_id: selectedLot,
        customer,
        selling_price: sellingPrice,
        sold_on: new Date().toISOString().slice(0, 10),
      });

      if (error) throw error;

      toaster.create({
        description: "Sale recorded successfully",
        type: "success",
      });

      // Reset form
      setSelectedLot("");
      setCustomer("");
      setSellingPrice(0);

      // Refresh unsold lots
      const { data } = await supabase
        .from("unsold_lots")
        .select("*")
        .order("manufactured_on", { ascending: true });

      setUnsoldLots(data || []);
    } catch (err) {
      console.error(err);
      toaster.create({
        description: "Something went wrong while recording the sale!",
        type: "error",
      });
    } finally {
      setLoading(false);
      fetchSaleLots();
    }
  };

  return (
    <Container maxW="480px" w="full" px={0}>
      <Fieldset.Root>
        <Stack>
          <Fieldset.Legend />
          <Fieldset.HelperText>Add crumbs to the ledger</Fieldset.HelperText>
        </Stack>
        <Fieldset.Content>
          <Field.Root required orientation="horizontal">
            <Field.Label>
              Lot
              <Field.RequiredIndicator />
            </Field.Label>
            <Select.Root
              collection={unsoldLotsCollection}
              variant="subtle"
              onValueChange={(e) => {
                const selectedLotId = e.value?.[0] ?? null;
                console.log("Selected value: ", selectedLotId);
                setSelectedLot(selectedLotId);
              }}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select a lot" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {unsoldLotsCollection.items.map((unsoldLot) => (
                      <Select.Item item={unsoldLot} key={unsoldLot.id}>
                        <VStack>
                          {unsoldLot.product_name}
                          <Tag.Root
                            mt="auto"
                            w="auto"
                            alignSelf="flex-start"
                            colorPalette="red"
                            position="absolute"
                            top={5}
                            variant="subtle"
                            right={9}
                          >
                            <Tag.Label>{unsoldLot.expires_on}</Tag.Label>
                          </Tag.Root>
                          <Tag.Root
                            mt="auto"
                            w="auto"
                            alignSelf="flex-start"
                            colorPalette="gray"
                          >
                            <Tag.Label>{unsoldLot.lot_code}</Tag.Label>
                          </Tag.Root>
                        </VStack>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Field.Root>
          <HStack>
            <Field.Root required orientation="horizontal">
              <Field.Label>
                Customer
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder="Customer name"
                variant="subtle"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </Field.Root>
            <Field.Root orientation="horizontal">
              <Field.Label>
                Amount
                <Field.RequiredIndicator />
              </Field.Label>
              <NumberInput.Root
                w="stretch"
                variant="subtle"
                value={
                  Number.isFinite(sellingPrice) ? String(sellingPrice) : ""
                }
                onValueChange={(e) => {
                  setSellingPrice(
                    Number.isNaN(e.valueAsNumber) ? 0 : e.valueAsNumber
                  );
                }}
              >
                <NumberInput.Control />
                <NumberInput.Input />
              </NumberInput.Root>
            </Field.Root>
          </HStack>
          <Button onClick={handleSubmit} loading={loading} disabled={loading}>
            Record sale
          </Button>
        </Fieldset.Content>
      </Fieldset.Root>

      <Fieldset.Root mt={8}>
        <Stack>
          <Fieldset.Legend>Sale made so far</Fieldset.Legend>
          <Fieldset.HelperText>Happy customers list</Fieldset.HelperText>
        </Stack>

        <Table.Root size="sm" striped>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Customer</Table.ColumnHeader>
              <Table.ColumnHeader>Product</Table.ColumnHeader>
              <Table.ColumnHeader>Sold</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Expiry</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {saleLot.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.customer}</Table.Cell>
                <Table.Cell>{item.product_name}</Table.Cell>
                <Table.Cell>
                  <Tag.Root
                    mt="auto"
                    w="auto"
                    alignSelf="flex-start"
                    colorPalette="blue"
                  >
                    <Tag.Label>{item.sold_on}</Tag.Label>
                  </Tag.Root>
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <Tag.Root
                    mt="auto"
                    w="auto"
                    alignSelf="flex-start"
                    colorPalette="red"
                  >
                    <Tag.Label>{item.expires_on}</Tag.Label>
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
