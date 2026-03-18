import { companies, deals, getWatchlisted } from "@/lib/data";
import PageHeader from "@/components/PageHeader";
import CompaniesTable from "@/components/CompaniesTable";
import DealsTable from "@/components/DealsTable";

export default function WatchlistPage() {
  const watchlistedCompanies = getWatchlisted();
  const watchlistedDeals = deals.filter((d) => d.watchlisted);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Watchlist"
        subtitle="Companies and deals you are monitoring closely"
      />

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Companies ({watchlistedCompanies.length})
        </h2>
        <CompaniesTable companies={watchlistedCompanies} showType />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Deals ({watchlistedDeals.length})
        </h2>
        <DealsTable deals={watchlistedDeals} />
      </div>
    </div>
  );
}
