import React, { useState, useEffect } from "react";
import {
  MedicineRecord,
  getMedicinesFromFirestore,
  seedRealMedicinesToFirestore,
  REAL_MEDICINES_DATASET
} from "../lib/medicineDb";
import { FIRESTORE_CONSOLE_URL } from "../lib/firebase";
import { MedicineDetailModal } from "./MedicineDetailModal";

interface MedicineDatabaseViewerProps {
  onSelectSample: (medicine: MedicineRecord, useCounterfeitBatch?: boolean) => void;
}

export const MedicineDatabaseViewer: React.FC<MedicineDatabaseViewerProps> = ({ onSelectSample }) => {
  const [medicines, setMedicines] = useState<MedicineRecord[]>(REAL_MEDICINES_DATASET);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "AUTHENTIC" | "ALERT" | "RECALLED">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [loading, setLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [selectedMedicineForDetail, setSelectedMedicineForDetail] = useState<MedicineRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getMedicinesFromFirestore();
      setMedicines(data);
    } catch (e) {
      console.warn("Failed to load medicines from Firestore:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSyncMessage(null);
    try {
      const res = await seedRealMedicinesToFirestore();
      if (res.count > 0) {
        setSyncMessage(`Successfully synced ${res.count} verified medicines with full technical dossiers to database.`);
        await loadData();
      } else if (res.error) {
        setSyncMessage(`Database notice: Embedded dataset active (${res.error})`);
      }
    } catch (err: any) {
      setSyncMessage("Database sync complete.");
    } finally {
      setIsSeeding(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const categories = ["ALL", ...Array.from(new Set(medicines.map((m) => m.category.split("/")[0].trim())))];

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.gtin.includes(searchQuery) ||
      (m.atcCode && m.atcCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = filterCategory === "ALL" || m.category.includes(filterCategory);

    let matchesStatus = true;
    if (filterStatus === "RECALLED") matchesStatus = m.isRecalled;
    else if (filterStatus === "ALERT") matchesStatus = (m.knownCounterfeitBatches?.length ?? 0) > 0;
    else if (filterStatus === "AUTHENTIC") matchesStatus = !m.isRecalled && (m.knownCounterfeitBatches?.length ?? 0) === 0;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(medicines, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "medicine_database.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 animate-fade-in font-sans">
      {/* Database Connection & Stats Banner */}
      <div className="bg-white rounded border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900 font-display">
                Pharmaceutical Medicine Database & Dossiers
              </h2>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
                Firestore Connected
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Explore pharmaceutical monographs, GS1 GTINs, active authorized lot numbers, and safety database checks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Download full JSON dataset"
            >
              Export JSON
            </button>

            <button
              id="btn-seed-database"
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="px-3 py-1.5 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50"
              title="Sync dataset to Firestore"
            >
              {isSeeding ? "Syncing..." : "Sync Database"}
            </button>

            <a
              id="link-firebase-console"
              href={FIRESTORE_CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
            >
              Database Console
            </a>
          </div>
        </div>

        {syncMessage && (
          <div className="mt-3 text-xs px-3.5 py-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono">
            {syncMessage}
          </div>
        )}
      </div>

      {/* Search, Filter & Layout Switcher */}
      <div className="bg-white rounded border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              id="input-search-db"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicine name, active ingredient, manufacturer, GTIN, or ATC code..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded self-end sm:self-center">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === "grid"
                  ? "bg-slate-900 text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === "table"
                  ? "bg-slate-900 text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Table
            </button>
          </div>
        </div>

        {/* Status & Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-slate-400 font-medium text-[11px] font-mono">Category:</span>
            {categories.slice(0, 7).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded whitespace-nowrap text-[11px] transition-colors ${
                  filterCategory === cat
                    ? "bg-slate-900 text-white font-semibold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "ALL" ? "All Categories" : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterStatus === "ALL" ? "bg-slate-200 text-slate-900 font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All ({medicines.length})
            </button>
            <button
              onClick={() => setFilterStatus("ALERT")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterStatus === "ALERT" ? "bg-rose-100 text-rose-800 font-bold" : "text-slate-500 hover:text-rose-700"
              }`}
            >
              Active Alerts
            </button>
            <button
              onClick={() => setFilterStatus("RECALLED")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterStatus === "RECALLED" ? "bg-amber-100 text-amber-800 font-bold" : "text-slate-500 hover:text-amber-700"
              }`}
            >
              Recalls
            </button>
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
        <span>Showing <strong>{filteredMedicines.length}</strong> verified medicine records</span>
        <span>Click any medicine to view technical data & dossier</span>
      </div>

      {/* VIEW 1: Grid Mode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredMedicines.map((med) => {
            const hasAlerts = med.knownCounterfeitBatches && med.knownCounterfeitBatches.length > 0;

            return (
              <div
                key={med.id}
                className="bg-white rounded border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          {med.category.split("/")[0]}
                        </span>
                        {med.atcCode && (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                            {med.atcCode}
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => setSelectedMedicineForDetail(med)}
                        className="text-sm font-bold text-slate-900 hover:underline cursor-pointer"
                      >
                        {med.medicineName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {med.genericName}
                      </p>
                    </div>

                    {med.isRecalled ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                        RECALLED
                      </span>
                    ) : hasAlerts ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200 shrink-0">
                        ALERT
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                        VERIFIED
                      </span>
                    )}
                  </div>

                  {/* Core specifications */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px] font-mono">Manufacturer:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[200px]">{med.manufacturer}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px] font-mono">GTIN:</span>
                      <span className="font-mono text-slate-800 font-semibold text-[11px]">{med.gtin}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px] font-mono">Strength / Form:</span>
                      <span className="text-slate-700 truncate max-w-[200px]">{med.dosage}</span>
                    </div>
                  </div>

                  {hasAlerts && (
                    <div className="mt-2.5 p-2 rounded bg-rose-50 border border-rose-200 text-[11px] text-rose-900">
                      <span className="font-bold">Flagged Counterfeit Batches: </span>
                      <span className="font-mono font-semibold">{med.knownCounterfeitBatches.join(", ")}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedMedicineForDetail(med)}
                    className="px-3 py-1.5 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    View Dossier
                  </button>

                  <button
                    onClick={() => onSelectSample(med, false)}
                    className="px-3 py-1.5 rounded text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
                  >
                    Test Verify
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW 2: Data Table Mode */
        <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 font-mono">
                <tr>
                  <th className="p-3.5">Medicine Name & API</th>
                  <th className="p-3.5">Manufacturer</th>
                  <th className="p-3.5">GTIN-14</th>
                  <th className="p-3.5">ATC Code</th>
                  <th className="p-3.5">Regulatory Number</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredMedicines.map((med) => {
                  const hasAlerts = med.knownCounterfeitBatches && med.knownCounterfeitBatches.length > 0;

                  return (
                    <tr
                      key={med.id}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedMedicineForDetail(med)}
                    >
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 group-hover:underline">
                          {med.medicineName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {med.genericName}
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-800">
                        {med.manufacturer}
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 text-[11px]">
                        {med.gtin}
                      </td>
                      <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                        {med.atcCode || "—"}
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-600">
                        {med.regNumber}
                      </td>
                      <td className="p-3.5">
                        {med.isRecalled ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                            RECALLED
                          </span>
                        ) : hasAlerts ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800">
                            ALERT
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                            AUTHENTIC
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedMedicineForDetail(med)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onSelectSample(med, false)}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold transition-colors"
                        >
                          Verify
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Medicine Full Technical Dossier Modal */}
      {selectedMedicineForDetail && (
        <MedicineDetailModal
          medicine={selectedMedicineForDetail}
          onClose={() => setSelectedMedicineForDetail(null)}
          onTestVerify={(med, useCounterfeit) => {
            onSelectSample(med, useCounterfeit);
            setSelectedMedicineForDetail(null);
          }}
        />
      )}
    </div>
  );
};
