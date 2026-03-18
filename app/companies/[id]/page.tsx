import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCompanyById,
  getContactsByCompanyId,
  getDealsByCompanyId,
  getTagsByIds,
} from "@/lib/data";
import {
  companyStatusConfig,
  priorityConfig,
  dealStatusConfig,
  confidenceConfig,
  formatCurrency,
  formatMultiple,
} from "@/lib/utils";
import Badge from "@/components/Badge";
import ScoreBar from "@/components/ScoreBar";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Tag,
  ArrowLeft,
  Bookmark,
  Phone,
  Mail,
} from "lucide-react";

export default function CompanyPage({
  params,
}: {
  params: { id: string };
}) {
  const company = getCompanyById(params.id);
  if (!company) notFound();

  const contacts = getContactsByCompanyId(company.id);
  const relatedDeals = getDealsByCompanyId(company.id);
  const tags = getTagsByIds(company.tags);
  const statusCfg = companyStatusConfig[company.status];
  const pCfg = priorityConfig[company.priority];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        href={company.type === "target" ? "/targets" : "/buyers"}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-5 transition-colors"
      >
        <ArrowLeft size={12} />
        {company.type === "target" ? "Targets" : "Buyers & Investors"}
      </Link>

      {/* Header */}
      <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-6 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-xl font-semibold text-white">{company.name}</h1>
              {company.watchlisted && (
                <Bookmark size={14} className="text-amber-400 fill-amber-400 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge label={statusCfg.label} color={statusCfg.color} bg={statusCfg.bg} />
              <Badge
                label={company.type === "target" ? "Target" : company.type === "buyer" ? "Buyer" : "Investor"}
                color="text-slate-300"
                bg="bg-slate-700"
              />
              {tags.map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: t.color + "40", border: `1px solid ${t.color}60` }}
                >
                  {t.name}
                </span>
              ))}
            </div>
            {company.description && (
              <p className="text-sm text-slate-400 leading-relaxed">{company.description}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-slate-500 mb-1">Priority Score</div>
            <div className="text-3xl font-bold text-white mb-1">{company.priorityScore}</div>
            <div className={`text-xs flex items-center justify-end gap-1.5 ${pCfg.color}`}>
              <span className={`w-2 h-2 rounded-full ${pCfg.dot}`} />
              {pCfg.label} Priority
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Key details */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Company Details</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Building2 size={13} />
              <span>Sector</span>
              <span className="ml-auto text-slate-300">{company.sector}</span>
            </div>
            {company.subsector && (
              <div className="flex items-center gap-2 text-slate-500">
                <Tag size={13} />
                <span>Subsector</span>
                <span className="ml-auto text-slate-300">{company.subsector}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin size={13} />
              <span>HQ</span>
              <span className="ml-auto text-slate-300">{company.hq}, {company.country}</span>
            </div>
            {company.employees && (
              <div className="flex items-center gap-2 text-slate-500">
                <Users size={13} />
                <span>Employees</span>
                <span className="ml-auto text-slate-300">{company.employees.toLocaleString()}</span>
              </div>
            )}
            {company.revenue !== undefined && (
              <div className="flex items-center gap-2 text-slate-500">
                <DollarSign size={13} />
                <span>Revenue</span>
                <span className="ml-auto text-slate-300">{formatCurrency(company.revenue)}</span>
              </div>
            )}
            {company.ebitda !== undefined && (
              <div className="flex items-center gap-2 text-slate-500">
                <DollarSign size={13} />
                <span>EBITDA</span>
                <span className="ml-auto text-slate-300">{formatCurrency(company.ebitda)}</span>
              </div>
            )}
            {company.ebitda !== undefined && company.revenue !== undefined && company.revenue > 0 && (
              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-xs">%</span>
                <span>EBITDA Margin</span>
                <span className="ml-auto text-slate-300">
                  {((company.ebitda / company.revenue) * 100).toFixed(1)}%
                </span>
              </div>
            )}
            {company.ownershipType && (
              <div className="flex items-center gap-2 text-slate-500">
                <Building2 size={13} />
                <span>Ownership</span>
                <span className="ml-auto text-slate-300">{company.ownershipType}</span>
              </div>
            )}
            {company.founded && (
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar size={13} />
                <span>Founded</span>
                <span className="ml-auto text-slate-300">{company.founded}</span>
              </div>
            )}
            {company.website && (
              <div className="flex items-center gap-2 text-slate-500">
                <Globe size={13} />
                <span>Website</span>
                <a
                  href={`https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-blue-400 hover:text-blue-300"
                >
                  {company.website}
                </a>
              </div>
            )}
            {company.source && (
              <div className="flex items-center gap-2 text-slate-500">
                <Tag size={13} />
                <span>Source</span>
                <span className="ml-auto text-slate-300">{company.source}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contacts */}
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">
            Contacts ({contacts.length})
          </h2>
          {contacts.length === 0 ? (
            <p className="text-xs text-slate-600">No contacts added yet.</p>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-300 shrink-0">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-200">
                        {contact.name}
                        {contact.isPrimary && (
                          <span className="ml-1.5 text-[10px] text-blue-400 bg-blue-900/40 px-1 py-0.5 rounded">Primary</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">{contact.title}</div>
                    </div>
                  </div>
                  <div className="ml-9 mt-1.5 space-y-0.5">
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-blue-400">
                      <Mail size={10} /> {contact.email}
                    </a>
                    {contact.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Phone size={10} /> {contact.phone}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {company.notes && (
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5 mb-4">
          <h2 className="text-sm font-semibold text-white mb-2">Notes</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{company.notes}</p>
          <div className="mt-3 text-xs text-slate-600">Last updated: {company.updatedAt}</div>
        </div>
      )}

      {/* Related deals */}
      {relatedDeals.length > 0 && (
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">
            Related Deals ({relatedDeals.length})
          </h2>
          <div className="space-y-3">
            {relatedDeals.map((deal) => {
              const dStatusCfg = dealStatusConfig[deal.status];
              const confCfg = confidenceConfig[deal.confidence];
              return (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  className="block group"
                >
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors border border-transparent hover:border-[#1e2a3a]">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-200 group-hover:text-blue-300 transition-colors">
                        {deal.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {deal.dealType} · {deal.sector}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <span className="text-slate-400">{formatCurrency(deal.estimatedEV)}</span>
                      <span className="text-slate-500">{formatMultiple(deal.evEbitdaMultiple)} EBITDA</span>
                      <span className={confCfg.color}>{confCfg.label}</span>
                      <Badge label={dStatusCfg.label} color={dStatusCfg.color} bg={dStatusCfg.bg} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
