import React from "react";
import {
  BookOpen,
  X,
  Eye,
  Layers,
  Sparkles,
  FileSearch,
  PhoneCall,
  CheckCircle2
} from "lucide-react";

interface EducationalGuideProps {
  onClose: () => void;
}

export const EducationalGuide: React.FC<EducationalGuideProps> = ({ onClose }) => {
  const steps = [
    {
      title: "1. 3D Holographic Security Seal",
      icon: <Sparkles className="w-5 h-5 text-sky-600" />,
      desc: "Genuine medicine cartons feature micro-optic security holograms that shift color and reveal hidden manufacturer emblems when tilted. Fake packaging often uses flat rainbow foil or low-resolution stickers that do not change depth.",
    },
    {
      title: "2. Embossed Lot & Expiry Stamping",
      icon: <Layers className="w-5 h-5 text-emerald-600" />,
      desc: "Authentic blister packs deboss or crimp the Batch Number and Expiry Date deeply into the foil edge. Falsified packs frequently just print them using cheap inkjet dots that smudge when rubbed with alcohol or moisture.",
    },
    {
      title: "3. Spelling & Typography Audit",
      icon: <FileSearch className="w-5 h-5 text-amber-600" />,
      desc: "Scrutinize manufacturer names and active ingredients. Counterfeiters regularly make typographical errors (e.g. 'Pharamceuticals', 'Paracetmol', 'Maufactured by'). Font weights should be crisp, not blurry.",
    },
    {
      title: "4. GS1 2D DataMatrix vs Standard QR",
      icon: <CheckCircle2 className="w-5 h-5 text-sky-700" />,
      desc: "Legitimate pharmaceuticals utilize GS1 2D DataMatrix barcodes containing Application Identifiers: (01) GTIN, (10) Batch, (17) Expiry Date, and (21) Serial Number. If a QR code merely links to a generic website, suspect tampering.",
    },
    {
      title: "5. Physical Tablet & Solution Characteristics",
      icon: <Eye className="w-5 h-5 text-indigo-600" />,
      desc: "Inspect tablet consistency. Authentic pills have uniform coloration, clean score lines, and crisp debossed logos. Crumbly textures, uneven speckles, chipped edges, or strange chemical odors indicate substandard formulations.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Forensic Safety Field Guide</h3>
              <p className="text-[11px] text-slate-500">How to inspect and verify authentic medicine packaging</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-sky-950 leading-relaxed">
            <strong className="text-sky-800 block mb-0.5">WHO Global Surveillance Advisory:</strong>
            1 in 10 medical products circulating in low-to-middle-income countries is either substandard or falsified. Always verify barcodes and seals before ingestion.
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  {step.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-xs">{step.title}</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Regulatory Hotline Assistance */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>International Pharmacovigilance Hotlines</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div>
                <strong className="text-slate-800 block">FDA MedWatch (USA):</strong>
                1-800-FDA-1088
              </div>
              <div>
                <strong className="text-slate-800 block">WHO Global Rapid Alert:</strong>
                rapidalert@who.int
              </div>
              <div>
                <strong className="text-slate-800 block">EMA Pharmacovigilance:</strong>
                eudravigilance@ema.europa.eu
              </div>
              <div>
                <strong className="text-slate-800 block">Interpol Health Security:</strong>
                ilicit-medicines@interpol.int
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
