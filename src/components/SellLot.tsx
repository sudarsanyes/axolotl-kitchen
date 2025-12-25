import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface ProductLot {
  id: string;
  lot_code: string;
  product_name: string;
  manufactured_on: string;
  expires_on: string;
}

export default function SellLot() {
  const [lots, setLots] = useState<ProductLot[]>([]);
  const [selectedLot, setSelectedLot] = useState("");
  const [customer, setCustomer] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch unsold lots from the view
  useEffect(() => {
    const fetchLots = async () => {
      const { data, error } = await supabase
        .from("unsold_lots") // <- our view
        .select("*")
        .order("manufactured_on", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setLots(data || []);
    };

    fetchLots();
  }, []);

  const handleSubmit = async () => {
    if (!selectedLot || !customer) {
      alert("Please select a lot and enter a customer name.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("sales").insert({
        product_lot_id: selectedLot,
        customer,
        sold_on: new Date().toISOString().slice(0, 10),
      });

      if (error) throw error;

      alert("Sale recorded successfully ✅");

      // Reset form
      setSelectedLot("");
      setCustomer("");

      // Refresh unsold lots
      const { data } = await supabase
        .from("unsold_lots")
        .select("*")
        .order("manufactured_on", { ascending: true });

      setLots(data || []);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while recording the sale.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-grid">
      <h2 className="full-width">🤑 Record a sale</h2>

      <label>Select lot</label>

      <select
        value={selectedLot}
        onChange={(e) => setSelectedLot(e.target.value)}
      >
        <option value="">-- Select a lot --</option>
        {lots.map((lot) => (
          <option key={lot.id} value={lot.id}>
            {lot.product_name} ({lot.lot_code}) – expires {lot.expires_on}
          </option>
        ))}
      </select>

      <label>Customer name</label>

      <input
        type="text"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        placeholder="Customer name"
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Recording..." : "Record sale 🤑"}
      </button>
    </div>
  );
}
