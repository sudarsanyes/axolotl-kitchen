import { useMemo, useState } from "react";
import AddIngredient from "./AddIngredient";
import AddLot from "./AddLot";
import SellLot from "./SellLot";

interface Tab {
  id: "stockpile" | "lot" | "sell";
  label: string;
}

const tabs: Tab[] = [
  { id: "stockpile", label: "Stockpile" },
  { id: "lot", label: "Register Lot" },
  { id: "sell", label: "Make a sale" },
];

export default function InventoryPage() {
  // versions for downstream components to refetch or re-render on change
  const [ingredientsVersion, setIngredientsVersion] = useState(0);
  const [lotsVersion, setLotsVersion] = useState(0);
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]); // default Stockpile

  // Choose the active panel once (memo not strictly needed here, but fine)
  const ActivePanel = useMemo(() => {
    switch (selectedTab.id) {
      case "stockpile":
        return (
          <AddIngredient
            onIngredientAdded={() => setIngredientsVersion((v) => v + 1)}
          />
        );
      case "lot":
        return (
          <AddLot
            ingredientsVersion={ingredientsVersion}
            onLotCreated={() => setLotsVersion((v) => v + 1)}
          />
        );
      case "sell":
        return <SellLot lotsVersion={lotsVersion} />;
      default:
        return null;
    }
  }, [selectedTab.id, ingredientsVersion, lotsVersion]);

  return (
    <div>
      {/* Tab buttons */}

      <div role="tablist" aria-label="Inventory tabs" className="tab-list">
        {tabs.map((tab) => {
          const selected = tab.id === selectedTab.id;
          return (
            <button
              className={`tab-item ${selected ? "tab-item--active" : ""}`}
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active panel only */}
      <div
        id={`tab-panel-${selectedTab.id}`}
        role="tabpanel"
        aria-labelledby={`tab-btn-${selectedTab.id}`}
        className="tabpanel"
        style={{ paddingTop: 8 }}
      >
        {ActivePanel}
      </div>

      <span className="kicker full-width">
        debug data version: {lotsVersion}
      </span>
    </div>
  );
}
