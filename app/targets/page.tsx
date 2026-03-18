import { getTargets } from "@/lib/data";
import PageHeader from "@/components/PageHeader";
import CompaniesTable from "@/components/CompaniesTable";

export default function TargetsPage() {
  const targets = getTargets();
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Targets"
        subtitle={`${targets.length} target companies tracked`}
      />
      <CompaniesTable companies={targets} />
    </div>
  );
}
