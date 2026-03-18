"use client";

import { useRef, useState } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { parseCompaniesCSV } from "@/lib/csv";
import { Company } from "@/lib/types";

interface CSVImportProps {
  onImport: (rows: Partial<Company>[]) => void;
}

export default function CSVImport({ onImport }: CSVImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    parseCompaniesCSV(
      file,
      (rows) => {
        setState("success");
        setMessage(`Parsed ${rows.length} rows from ${file.name}`);
        onImport(rows);
      },
      (err) => {
        setState("error");
        setMessage(err);
      }
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] border border-[#1e2a3a] rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition"
      >
        <Upload size={12} /> Import CSV
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Import Companies from CSV</h2>
              <button
                onClick={() => { setIsOpen(false); setState("idle"); setMessage(""); }}
                className="text-slate-600 hover:text-slate-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Upload a CSV file with columns: Name, Type, Sector, HQ, Country, Revenue ($M),
              EBITDA ($M), Status, Priority, Priority Score, Ownership Type, Website, Source, Notes.
            </p>

            <div
              className="border-2 border-dashed border-[#1e2a3a] rounded-xl p-8 text-center cursor-pointer hover:border-slate-600 transition-colors mb-4"
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={24} className="text-slate-600 mx-auto mb-2" />
              <div className="text-sm text-slate-400">Click to upload CSV</div>
              <div className="text-xs text-slate-600 mt-1">or drag and drop</div>
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFile}
              />
            </div>

            {state === "success" && (
              <div className="flex items-center gap-2 p-3 bg-emerald-900/30 border border-emerald-800/50 rounded-lg text-xs text-emerald-300">
                <CheckCircle size={13} />
                {message}
              </div>
            )}
            {state === "error" && (
              <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-xs text-red-300">
                <AlertCircle size={13} />
                {message}
              </div>
            )}

            <div className="mt-4 text-[10px] text-slate-600">
              Note: Imported data will be shown in the table but not persisted. Connect a database to save imports.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
