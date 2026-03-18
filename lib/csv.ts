import Papa from "papaparse";
import { Company, Deal } from "./types";
import { getCompanyById } from "./data";

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCompaniesToCSV(companies: Company[]) {
  const rows = companies.map((c) => ({
    ID: c.id,
    Name: c.name,
    Type: c.type,
    Sector: c.sector,
    Subsector: c.subsector ?? "",
    HQ: c.hq,
    Country: c.country,
    "Revenue ($M)": c.revenue ?? "",
    "EBITDA ($M)": c.ebitda ?? "",
    Employees: c.employees ?? "",
    Status: c.status,
    Priority: c.priority,
    "Priority Score": c.priorityScore,
    "Ownership Type": c.ownershipType ?? "",
    Founded: c.founded ?? "",
    Website: c.website ?? "",
    Source: c.source ?? "",
    Notes: c.notes ?? "",
    Watchlisted: c.watchlisted ? "Yes" : "No",
    "Created At": c.createdAt,
    "Updated At": c.updatedAt,
  }));
  const csv = Papa.unparse(rows);
  downloadCSV(csv, `companies_export_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportDealsToCSV(deals: Deal[]) {
  const rows = deals.map((d) => {
    const target = getCompanyById(d.targetId);
    const buyer = d.buyerId ? getCompanyById(d.buyerId) : undefined;
    return {
      ID: d.id,
      Name: d.name,
      Target: target?.name ?? d.targetId,
      Buyer: buyer?.name ?? "",
      Status: d.status,
      "Deal Type": d.dealType,
      Sector: d.sector,
      Priority: d.priority,
      "Priority Score": d.priorityScore,
      "Estimated EV ($M)": d.estimatedEV ?? "",
      "Estimated Revenue ($M)": d.estimatedRevenue ?? "",
      "Estimated EBITDA ($M)": d.estimatedEbitda ?? "",
      "EV/Revenue": d.evRevMultiple ?? "",
      "EV/EBITDA": d.evEbitdaMultiple ?? "",
      Confidence: d.confidence,
      Source: d.source ?? "",
      Notes: d.notes ?? "",
      Watchlisted: d.watchlisted ? "Yes" : "No",
      "Closed At": d.closedAt ?? "",
      "Created At": d.createdAt,
      "Updated At": d.updatedAt,
    };
  });
  const csv = Papa.unparse(rows);
  downloadCSV(csv, `deals_export_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function parseCompaniesCSV(
  file: File,
  onComplete: (companies: Partial<Company>[]) => void,
  onError: (error: string) => void
) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const rows = results.data as Record<string, string>[];
      const companies: Partial<Company>[] = rows.map((row, i) => ({
        id: row["ID"] || `import_${i}`,
        name: row["Name"] || "",
        type: (row["Type"] as Company["type"]) || "target",
        sector: row["Sector"] || "",
        subsector: row["Subsector"] || undefined,
        hq: row["HQ"] || "",
        country: row["Country"] || "",
        revenue: row["Revenue ($M)"] ? parseFloat(row["Revenue ($M)"]) : undefined,
        ebitda: row["EBITDA ($M)"] ? parseFloat(row["EBITDA ($M)"]) : undefined,
        employees: row["Employees"] ? parseInt(row["Employees"]) : undefined,
        status: (row["Status"] as Company["status"]) || "active",
        priority: (row["Priority"] as Company["priority"]) || "medium",
        priorityScore: row["Priority Score"] ? parseInt(row["Priority Score"]) : 50,
        ownershipType: row["Ownership Type"] || undefined,
        website: row["Website"] || undefined,
        source: row["Source"] || undefined,
        notes: row["Notes"] || undefined,
        watchlisted: row["Watchlisted"] === "Yes",
        tags: [],
        contacts: [],
        createdAt: row["Created At"] || new Date().toISOString().slice(0, 10),
        updatedAt: row["Updated At"] || new Date().toISOString().slice(0, 10),
      }));
      onComplete(companies);
    },
    error: (error) => onError(error.message),
  });
}
