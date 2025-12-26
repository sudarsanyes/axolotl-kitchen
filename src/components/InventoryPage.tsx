import { useState } from "react";
import AddIngredient from "./AddIngredient";
import AddLot from "./AddLot";
import SellLot from "./SellLot";

export default function InventoryPage() {
  const [ingredientsVersion, setIngredientsVersion] = useState(0);
  const [lotsVersion, setLotsVersion] = useState(0);

  return (
    <>
      <AddIngredient
        onIngredientAdded={() => setIngredientsVersion((v) => v + 1)}
      />

      <AddLot
        ingredientsVersion={ingredientsVersion}
        onLotCreated={() => setLotsVersion((v) => v + 1)}
      />

      <SellLot lotsVersion={lotsVersion} />

      <span className="kicker full-width">
        debug data version: {lotsVersion}
      </span>
    </>
  );
}
