import { useState } from "react";
import { supabase } from "../supabaseClient";

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
  const [expiresOn, setExpiresOn] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !lot || !expiresOn) {
      alert("⚠️ Please fill in the required fields");
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

      alert("✅ Ingredient added successfully");
      setName("");
      setBrand("");
      setSupplier("");
      setLot("");
      setNotes("");
      setMrp(0);
      setExpiresOn("");
    } catch (err) {
      console.error(err);
      alert("🛑 Something went wrong while adding the ingredient");
    } finally {
      setLoading(false);
      onIngredientAdded();
    }
  };

  return (
    <div className="form-grid">
      <h2 className="full-width">🛒 Stock up the cookie pantry</h2>

      <label>* Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ingredient name"
      />

      <label>Brand</label>
      <input
        type="text"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        placeholder="What brand is it?"
      />

      <label>Supplier</label>
      <input
        type="text"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        placeholder="Where did you get it from?"
      />

      <label>* LOT</label>
      <input
        type="text"
        value={lot}
        onChange={(e) => setLot(e.target.value)}
        placeholder="LOT number"
      />

      <label>Notes</label>
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any notes?"
      />

      <label>MRP</label>
      <input
        type="number"
        value={mrp}
        onChange={(e) => setMrp(Number(e.target.value))}
        placeholder="MRP"
      />

      <label>* Expiry Date</label>
      <input
        type="date"
        value={expiresOn}
        onChange={(e) => setExpiresOn(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Adding..." : "Add ingredient"}
      </button>
    </div>
  );
}
