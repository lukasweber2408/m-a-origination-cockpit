import { getBuyers } from "@/lib/data";
import PageHeader from "@/components/PageHeader";
import CompaniesTable from "@/components/CompaniesTable";

export default function BuyersPage() {
  const buyers = getBuyers();
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Buyers & Investors"
        subtitle={`${buyers.length} buyers and investors tracked`}
      />
      <CompaniesTable companies={buyers} showType />
    </div>
  );
}
