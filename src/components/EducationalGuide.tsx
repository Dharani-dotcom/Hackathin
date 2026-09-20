import React from "react";

interface EducationalGuideProps {
  onClose: () => void;
}

export const EducationalGuide: React.FC<EducationalGuideProps> = ({ onClose }) => {
  const steps = [
    {
      title: "1. 3D Holographic Security Seal",
      desc: "Genuine medicine cartons feature micro-optic security holograms that shift color and reveal hidden manufacturer emblems when tilted. Fake packaging often uses flat rainbow foil or low-resolution stickers that do not change depth.",
    },
    {
      title: "2. Embossed Lot & Expiry Stamping",
      desc: "Authentic blister packs deboss or crimp the Batch Number and Expiry Date deeply into the foil edge. Falsified packs frequently just print them using cheap inkjet dots that smudge when rubbed with alcohol or moisture.",
    },
    {
      title: "3. Spelling & Typography Audit",
      desc: "Scrutinize manufacturer names and active ingredients. Counterfeiters regularly make typographical errors (e.g. 'Pharamceuticals', 'Paracetmol', 'Maufactured by'). Font weights should be crisp, not blurry.",
    },
    {
      title: "4. GS1 2D DataMatrix vs Standard QR",
      desc: "Legitimate pharmaceuticals utilize GS1 2D DataMatrix barcodes containing Application Identifiers: (01) GTIN, (10) Batch, (17) Expiry Date, and (21) Serial Number. If a QR code merely links to a generic website, suspect tampering.",
    },
    {
      title: "5. Physical Tablet & Solution Characteristics",
      desc: "Inspect tablet consistency. Authentic pills have uniform coloration, clean score lines, and crisp debossed logos. Crumbly textures, uneven speckles, chipped edges, or strange chemical odors indicate substandard formulations.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fade-in font-sans">
      <div className="bg-white border border-slate-200 rounded w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Forensic Safety Field Guide
            </h3>
            <p className="text-[11px] text-slate-500">How to inspect and verify authentic medicine packaging</p>
          </div>

          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded p-3 text-slate-900 leading-relaxed">
            <strong className="text-slate-900 block mb-0.5 font-mono uppercase text-[11px]">
              WHO Global Surveillance Advisory:
            </strong>
            1 in 10 medical products circulating in low-to-middle-income countries is either substandard or falsified. Always verify barcodes and seals before ingestion.
          </div>

          <div className="space-y-2.5">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-3 rounded border border-slate-200"
              >
                <h4 className="font-bold text-slate-900 mb-1 text-xs font-mono uppercase">
                  {step.title}
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Regulatory Hotline Assistance */}
          <div className="bg-slate-50 rounded p-3.5 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs font-mono uppercase">
              International Pharmacovigilance Hotlines
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div>
                <strong className="text-slate-800 block font-mono">FDA MedWatch (USA):</strong>
                1-800-FDA-1088
              </div>
              <div>
                <strong className="text-slate-800 block font-mono">WHO Global Rapid Alert:</strong>
                rapidalert@who.int
              </div>
              <div>
                <strong className="text-slate-800 block font-mono">EMA Pharmacovigilance:</strong>
                eudravigilance@ema.europa.eu
              </div>
              <div>
                <strong className="text-slate-800 block font-mono">Interpol Health Security:</strong>
                illicit-medicines@interpol.int
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
