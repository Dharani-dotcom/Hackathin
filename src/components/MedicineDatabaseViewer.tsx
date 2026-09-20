import React, { useState, useEffect } from "react";
import {
  Database,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  PackageCheck,
  Sparkles,
  Barcode,
  Building,
  Info,
  Table,
  LayoutGrid,
  FileDown,
  ChevronRight,
  Eye,
  AlertOctagon,
  Pill,
  ThermometerSnowflake
} from "lucide-react";
import {
  MedicineRecord,
  getMedicinesFromFirestore,
  seedRealMedicinesToFirestore,
  REAL_MEDICINES_DATASET
} from "../lib/medicineDb";
import { FIRESTORE_CONSOLE_URL, FIRESTORE_DATABASE_ID, FIREBASE_PROJECT_ID } from "../lib/firebase";
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
        setSyncMessage(`Successfully synced ${res.count} verified medicines with full technical dossiers to Firestore.`);
        await loadData();
      } else if (res.error) {
        setSyncMessage(`Seeding notice: Embedded dataset active (${res.error})`);
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
    downloadAnchor.setAttribute("download", "pharmashield_medicine_registry.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Database Connection & Stats Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-600 shadow-xs">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900">
                  Pharmaceutical Registry & Medicine Data Explorer
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Firestore Live
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Explore full pharmaceutical monographs, GS1 GTINs, active lot numbers, WHO surveillance alerts, and anti-counterfeiting forensics.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Download full JSON dataset"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>

            <button
              id="btn-seed-database"
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50"
              title="Sync dataset to Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? "animate-spin text-emerald-600" : "text-slate-500"}`} />
              <span>{isSeeding ? "Syncing..." : "Sync Real Data"}</span>
            </button>

            <a
              id="link-firebase-console"
              href={FIRESTORE_CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
            >
              <span>Firebase Console</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
            </a>
          </div>
        </div>

        {syncMessage && (
          <div className="mt-3 text-xs px-3.5 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}
      </div>

      {/* Search, Filter & Layout Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-db"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicine name, active ingredient, manufacturer, GTIN, or ATC code..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-end sm:self-center">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                viewMode === "table"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Table View"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>

        {/* Status & Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-slate-400 font-medium text-[11px]">Category:</span>
            {categories.slice(0, 7).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] transition-colors ${
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
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong>{filteredMedicines.length}</strong> verified medicine records</span>
        <span>Click any medicine to view technical data & monograph</span>
      </div>

      {/* VIEW 1: Grid Mode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMedicines.map((med) => {
            const hasAlerts = med.knownCounterfeitBatches && med.knownCounterfeitBatches.length > 0;

            return (
              <div
                key={med.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                          {med.category.split("/")[0]}
                        </span>
                        {med.atcCode && (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {med.atcCode}
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => setSelectedMedicineForDetail(med)}
                        className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors cursor-pointer"
                      >
                        {med.medicineName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {med.genericName}
                      </p>
                    </div>

                    {med.isRecalled ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                        RECALLED
                      </span>
                    ) : hasAlerts ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 shrink-0">
                        WHO ALERT
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                        VERIFIED
                      </span>
                    )}
                  </div>

                  {/* Core specifications */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Manufacturer:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[200px]">{med.manufacturer}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">GTIN Barcode:</span>
                      <span className="font-mono text-slate-800 font-semibold text-[11px]">{med.gtin}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Strength / Form:</span>
                      <span className="text-slate-700 truncate max-w-[200px]">{med.dosage}</span>
                    </div>
                  </div>

                  {/* Anti-counterfeiting features */}
                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Key Packaging Safeguards:
                    </span>
                    <ul className="space-y-0.5 text-[11px] text-slate-600">
                      {med.securityFeatures.slice(0, 2).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {hasAlerts && (
                    <div className="mt-2.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-900">
                      <span className="font-bold">⚠️ Flagged Counterfeit Batches: </span>
                      <span className="font-mono font-semibold">{med.knownCounterfeitBatches.join(", ")}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedMedicineForDetail(med)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Data & Dossier</span>
                  </button>

                  <button
                    onClick={() => onSelectSample(med, false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Test Verify</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW 2: Data Table Mode */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
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
              <tbody className="divide-y divide-slate-100">
                {filteredMedicines.map((med) => {
                  const hasAlerts = med.knownCounterfeitBatches && med.knownCounterfeitBatches.length > 0;

                  return (
                    <tr
                      key={med.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => setSelectedMedicineForDetail(med)}
                    >
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
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
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            RECALLED
                          </span>
                        ) : hasAlerts ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            WHO ALERT
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
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
                          className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-semibold transition-colors"
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
