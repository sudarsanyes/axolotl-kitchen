import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Select from "react-select";

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

  const [todayTotal, setTodayTotal] = useState(0);
  const [showTotals, setShowTotals] = useState(false);

  const lotOptionsForSelect = unsoldLots.map((lot) => ({
    value: lot.id,
    label: (
      <div className="full-width">
        {lot.product_name}
        <span className="kicker full-width">LOT: {lot.lot_code}</span>
        <span className="kicker full-width">Exp: {lot.expires_on}</span>
      </div>
    ),
  }));

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

  const fetchTodayTotal = async () => {
    const { data, error } = await supabase.rpc("today_sales_total");

    if (!error) {
      setTodayTotal(data);
    }
  };

  // Fetch unsold lots from the view
  useEffect(() => {
    fetchUnsoldLots();
    fetchSaleLots();
  }, [lotsVersion]);

  const handleSubmit = async () => {
    if (!selectedLot && !customer) {
      alert("⚠️ Please select a lot and enter a customer name");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("sales").insert({
        product_lot_id: selectedLot,
        customer,
        selling_price: sellingPrice,
        sold_on: new Date().toISOString().slice(0, 10),
      });

      if (error) throw error;

      alert("✅ Sale recorded successfully");

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
      alert("🛑 Something went wrong while recording the sale!");
    } finally {
      setLoading(false);
      fetchSaleLots();
      setShowTotals(false);
    }
  };

  return (
    <div className="form-grid">
      <h2 className="full-width">🤑 Add crumbs to the ledger</h2>
      <label>* Select lot</label>
      {/* Classic drop-down */}
      {/* <select
        value={selectedLot}
        onChange={(e) => setSelectedLot(e.target.value)}
      >
        <option value="">-- Select a lot --</option>
        {lots.map((lot) => (
          <option key={lot.id} value={lot.id}>
            {lot.product_name} - {lot.lot_code} / {lot.expires_on}
          </option>
        ))}
      </select> */}
      <Select
        options={lotOptionsForSelect}
        value={lotOptionsForSelect.find((o) => o.value === selectedLot) || null}
        onChange={(opt) => setSelectedLot(opt?.value || "")}
      />
      <label>* Customer name</label>
      <input
        type="text"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        placeholder="Customer name"
      />
      <label>* Selling price</label>
      <input
        type="number"
        value={sellingPrice}
        onChange={(e) => setSellingPrice(Number(e.target.value))}
        placeholder="Selling price"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Recording..." : "Record sale"}
      </button>
      <hr />
      <h2 className="full-width">🍪 Cookie trail</h2>
      <table className="full-width">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Sold vs Exp</th>
          </tr>
        </thead>
        {saleLot.map((sale) => (
          <tr>
            <td>{sale.customer}</td>
            <td>{sale.product_name}</td>
            <td className="kicker">
              {sale.sold_on} / {sale.expires_on}
            </td>
          </tr>
        ))}
      </table>
      <button
        onClick={() => {
          fetchTodayTotal();
          setShowTotals(!showTotals);
        }}
      >
        {showTotals ? "Hide totals" : "Show totals"}
      </button>

      {showTotals && (
        <span className="full-width kicker">Today's total: {todayTotal}</span>
      )}
    </div>
  );
}
