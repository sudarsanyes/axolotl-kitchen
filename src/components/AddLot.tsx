import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Ingredient {
  id: string;
  name: string;
  brand: string;
  expires_on: string;
}

export default function AddLot() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [productName, setProductName] = useState("");
  const [manufacturedOn, setManufacturedOn] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(false);

  // Fetch ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      const { data, error } = await supabase
        .from("ingredients")
        .select("id, name, brand, expires_on")
        .order("name");

      if (error) {
        console.error(error);
        return;
      }
      setIngredients(data);
    };

    fetchIngredients();
  }, []);

  const toggleIngredient = (id: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!productName || selectedIngredients.length === 0) {
      alert("Please enter a product name and select at least one ingredient.");
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

      alert("Lot created successfully ✅");

      // Reset form
      setProductName("");
      setSelectedIngredients([]);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating the lot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-grid">
      <h2 className="full-width">New lot</h2>

      <label>Product name</label>

      <input
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Cookies? Sables noel?"
      />

      <label>Manufactured on </label>
      <input
        type="date"
        value={manufacturedOn}
        onChange={(e) => setManufacturedOn(e.target.value)}
      />

      <h3 className="full-width">Ingredients</h3>

      {ingredients.map((i) => (
        <label key={i.id}>
          <input
            type="checkbox"
            checked={selectedIngredients.includes(i.id)}
            onChange={() => toggleIngredient(i.id)}
          />
          {i.name}
          <span className="kicker">
            {i.brand} / {i.expires_on}
          </span>
        </label>
      ))}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating…" : "Create lot"}
      </button>
    </div>
  );
}
