import { deals } from "@/lib/data";
import PageHeader from "@/components/PageHeader";
import DealsTable from "@/components/DealsTable";

export default function DealsPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Deals"
        subtitle={`${deals.length} deals in the pipeline`}
      />
      <DealsTable deals={deals} />
    </div>
  );
}
