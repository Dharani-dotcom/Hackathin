import React from "react";
import {
  BookOpen,
  X,
  Eye,
  Layers,
  Sparkles,
  AlertTriangle,
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
      icon: <Sparkles className="w-5 h-5 text-sky-400" />,
      desc: "Genuine medicine cartons feature specialized micro-optic security holograms that shift color and reveal hidden logos when tilted. Fake packaging often uses flat rainbow foil or low-resolution stickers that do not change depth.",
    },
    {
      title: "2. Embossed Lot & Expiry Stamping",
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      desc: "Authentic blister packs deboss or crimp the Batch Number and Expiry Date deeply into the foil edge. Falsified packs frequently just print them using cheap inkjet dots that smudge when rubbed with alcohol.",
    },
    {
      title: "3. Spelling & Typography Audit",
      icon: <FileSearch className="w-5 h-5 text-amber-400" />,
      desc: "Scrutinize manufacturer names and active ingredients. Counterfeiters regularly make typographical errors (e.g. 'Pharamceuticals', 'Paracetmol', 'Maufactured by'). Font weights should be razor-sharp, not blurry.",
    },
    {
      title: "4. GS1 2D DataMatrix vs Standard QR",
      icon: <CheckCircle2 className="w-5 h-5 text-cyan-400" />,
      desc: "Legitimate pharmaceuticals utilize GS1 2D DataMatrix barcodes containing Application Identifiers: (01) GTIN, (10) Batch, (17) Expiry Date, and (21) Serial Number. If a QR code merely links to a generic commercial website, suspect tampering.",
    },
    {
      title: "5. Physical Pill Characteristics",
      icon: <Eye className="w-5 h-5 text-purple-400" />,
      desc: "Inspect tablet consistency. Authentic pills have uniform coloration, clean score lines, and crisp debossed logos. Crumbly textures, uneven speckles, chipped edges, or strange chemical odors indicate substandard formulations.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Forensic Safety Field Guide</h3>
              <p className="text-[11px] text-slate-400">How to detect counterfeit drugs with your smartphone</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3 text-slate-300 leading-relaxed">
            <strong className="text-sky-400 block mb-0.5">WHO Global Surveillance:</strong>
            1 in 10 medical products circulating in low-to-middle-income countries is either substandard or falsified. Always verify barcodes before ingestion.
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1 text-xs">{step.title}</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Regulatory Hotline Assistance */}
          <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-850 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>International Pharmacovigilance Hotlines</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div>
                <strong className="text-slate-300 block">FDA MedWatch (USA):</strong>
                1-800-FDA-1088
              </div>
              <div>
                <strong className="text-slate-300 block">WHO Global Rapid Alert:</strong>
                rapidalert@who.int
              </div>
              <div>
                <strong className="text-slate-300 block">EMA Pharmacovigilance (EU):</strong>
                eudravigilance@ema.europa.eu
              </div>
              <div>
                <strong className="text-slate-300 block">Interpol Health Security:</strong>
                ilicit-medicines@interpol.int
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
