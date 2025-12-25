import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AddIngredient() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [supplier, setSupplier] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !brand || !supplier || !expiresOn) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("ingredients").insert({
        name,
        brand,
        supplier,
        expires_on: expiresOn,
      });

      if (error) throw error;

      alert("Ingredient added successfully ✅");
      setName("");
      setBrand("");
      setSupplier("");
      setExpiresOn("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while adding the ingredient.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="form-grid">
    //   <h2>Add New Ingredient</h2>

    //   <label>
    //     Name
    //     <input
    //       type="text"
    //       value={name}
    //       onChange={e => setName(e.target.value)}
    //       placeholder="Ingredient Name"
    //     />
    //   </label> <br />

    //   <label>
    //     Brand
    //     <input
    //       type="text"
    //       value={brand}
    //       onChange={e => setBrand(e.target.value)}
    //       placeholder="Brand"
    //     />
    //   </label> <br />

    //   <label>
    //     Supplier
    //     <input
    //       type="text"
    //       value={supplier}
    //       onChange={e => setSupplier(e.target.value)}
    //       placeholder="Supplier"
    //     />
    //   </label> <br />

    //   <label>
    //     Expiry Date
    //     <input
    //       type="date"
    //       value={expiresOn}
    //       onChange={e => setExpiresOn(e.target.value)}
    //     />
    //   </label> <br />

    //   <button onClick={handleSubmit} disabled={loading}>
    //     {loading ? 'Adding...' : 'Add Ingredient'}
    //   </button> <br /> <br />
    //   <hr />
    // </div>
    <div className="form-grid">
      <h2 className="full-width">Stockpile ingredient</h2>

      <label>Name</label>
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

      <label>Expiry Date</label>
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
