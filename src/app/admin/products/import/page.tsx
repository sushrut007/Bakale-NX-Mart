"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import Papa from "papaparse";
import { z } from "zod";
import BrandLoader from "@/components/BrandLoader";
import { useRouter } from "next/navigation";

// Define the validation schema
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  originalPrice: z.coerce.number().optional(),
  image: z.string().min(1, "Image URL is required"),
  images: z.union([z.string(), z.array(z.string())]).optional(),
  description: z.string().min(1, "Description is required"),
  isCutPiece: z.union([z.boolean(), z.string()]).transform((val) => val === "true" || val === true).optional(),
  inStock: z.union([z.boolean(), z.string()]).transform((val) => val === "false" || val === false ? false : true).optional(),
  isNew: z.union([z.boolean(), z.string()]).transform((val) => val === "true" || val === true).optional(),
  isBestseller: z.union([z.boolean(), z.string()]).transform((val) => val === "true" || val === true).optional(),
  features: z.union([z.string(), z.array(z.string())]).optional(),
  rating: z.coerce.number().optional(),
  reviewCount: z.coerce.number().optional(),
});

type ValidationError = {
  row: number;
  errors: string[];
};

export default function ImportProducts() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus("idle");
    setStatusMessage("");
    setValidationErrors([]);
    setParsedData([]);

    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          validateAndSetData(results.data);
        },
        error: (error) => {
          setImportStatus("error");
          setStatusMessage(`CSV Parsing Error: ${error.message}`);
        }
      });
    } else if (file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (!Array.isArray(json)) throw new Error("JSON must be an array of product objects");
          validateAndSetData(json);
        } catch (error: any) {
          setImportStatus("error");
          setStatusMessage(`JSON Parsing Error: ${error.message}`);
        }
      };
      reader.readAsText(file);
    } else {
      setImportStatus("error");
      setStatusMessage("Unsupported file format. Please upload a .csv or .json file.");
    }
  };

  const validateAndSetData = (data: any[]) => {
    const errors: ValidationError[] = [];
    const validData: any[] = [];

    data.forEach((row, index) => {
      // Clean up stringified arrays for JSON or CSV if needed
      if (typeof row.features === 'string') {
        try { row.features = JSON.parse(row.features); } catch { /* ignore */ }
      }
      if (typeof row.images === 'string') {
        try { row.images = JSON.parse(row.images); } catch { /* ignore */ }
      }

      const result = productSchema.safeParse(row);
      
      if (!result.success) {
        errors.push({
          row: index + 1,
          errors: result.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`)
        });
      } else {
        validData.push(result.data);
      }
    });

    setValidationErrors(errors);
    setParsedData(validData);

    if (errors.length > 0) {
      setImportStatus("error");
      setStatusMessage(`Found validation errors in ${errors.length} rows.`);
    } else if (validData.length > 0) {
      setStatusMessage(`Successfully parsed ${validData.length} valid products. Ready to import.`);
    } else {
      setImportStatus("error");
      setStatusMessage("No data found in the file.");
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0 || validationErrors.length > 0) return;
    
    setLoading(true);
    setImportStatus("idle");

    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Import failed");

      setImportStatus("success");
      setStatusMessage(`Successfully imported ${data.count} products!`);
      
      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } catch (error: any) {
      setImportStatus("error");
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "name", "brand", "category", "price", "originalPrice", "image", 
      "description", "isCutPiece", "inStock", "isNew", "isBestseller"
    ];
    const sampleRow = [
      "Sample Shirt", "Raymond", "Shirting", "1299", "1599", "https://example.com/img.jpg",
      "Premium cotton fabric", "false", "true", "true", "false"
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + sampleRow.join(",");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "product_import_template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black" style={{ color: "var(--primary)" }}>
            Bulk Import Products
          </h1>
        </div>
        
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-sm transition-colors"
        >
          <FileSpreadsheet size={16} />
          Download Template
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors">
          <input
            type="file"
            accept=".csv, .json"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center gap-4"
          >
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <Upload size={32} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">
                Click to upload CSV or JSON file
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Make sure your columns match the provided template
              </p>
            </div>
          </label>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl border mb-6 flex items-center gap-3 ${
          importStatus === "error" ? "bg-red-50 border-red-200 text-red-700" :
          importStatus === "success" ? "bg-green-50 border-green-200 text-green-700" :
          "bg-blue-50 border-blue-200 text-blue-700"
        }`}>
          {importStatus === "error" ? <AlertCircle size={20} /> : 
           importStatus === "success" ? <CheckCircle2 size={20} /> : null}
          <p className="font-medium">{statusMessage}</p>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden mb-6">
          <div className="bg-red-50 px-6 py-4 border-b border-red-200 flex items-center gap-2 text-red-800 font-bold">
            <AlertCircle size={18} /> Validation Errors
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-bold">Row</th>
                  <th className="px-6 py-3 font-bold">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {validationErrors.map((err, i) => (
                  <tr key={i} className="hover:bg-red-50/50">
                    <td className="px-6 py-4 font-bold text-gray-900 w-24">Row {err.row}</td>
                    <td className="px-6 py-4 text-red-600 font-medium">
                      <ul className="list-disc pl-4 space-y-1">
                        {err.errors.map((msg, j) => (
                          <li key={j}>{msg}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {parsedData.length > 0 && validationErrors.length === 0 && (
        <div className="flex justify-end pt-4 pb-12">
          <button
            onClick={handleImport}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-white text-sm uppercase tracking-wider transition-opacity disabled:opacity-50 hover:opacity-90 shadow-xl shadow-red-900/20"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {loading ? <BrandLoader size={18} /> : <Upload size={18} />}
            {loading ? "Importing..." : `Import ${parsedData.length} Products`}
          </button>
        </div>
      )}
    </div>
  );
}
