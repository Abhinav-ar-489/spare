"use client";

import * as React from "react";
import {
  MessageSquare,
  Phone,
  Mail,
  Car,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Enquiry, EnquiryStatus } from "@/types";
import { formatDate } from "@/lib/utils/formatters";
import { Button } from "../ui/button";

interface EnquiriesViewProps {
  initialEnquiries: Enquiry[];
}

export function EnquiriesView({ initialEnquiries }: EnquiriesViewProps) {
  const [enquiries, setEnquiries] = React.useState(initialEnquiries);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [query, setQuery] = React.useState("");

  const handleUpdateStatus = async (id: string, status: EnquiryStatus) => {
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    } catch {
      alert("Failed to update enquiry status");
    }
  };

  const filtered = React.useMemo(() => {
    return enquiries.filter((e) => {
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.vehicle_details?.toLowerCase().includes(q) ||
        e.product_name?.toLowerCase().includes(q) ||
        e.product_part_number?.toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [enquiries, statusFilter, query]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412]">
          Customer Enquiries & WhatsApp Leads
        </h1>
        <p className="text-xs sm:text-sm text-[#68706b] mt-0.5">
          Manage incoming product requests and reply instantly to customers.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="p-3 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs flex items-center gap-3 flex-1">
          <Search className="w-4 h-4 text-[#16834b] ml-1 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by customer name, phone, part number or car model..."
            className="w-full text-xs sm:text-sm text-[#111412] placeholder:text-[#68706b]/60 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["all", "new", "contacted", "resolved"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? "bg-[#16834b] text-white"
                  : "bg-white border border-[rgba(17,20,18,0.08)] text-[#68706b] hover:text-[#111412]"
              }`}
            >
              {st} ({st === "all" ? enquiries.length : enquiries.filter((e) => e.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white p-12 text-center text-xs text-[#68706b]">
          No enquiries found matching your filter criteria.
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((enq) => {
            const cleanPhone = enq.phone.replace(/[^0-9]/g, "");
            const whatsappReplyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello ${enq.name}, thank you for contacting ApexAuto Genuine Spares regarding your enquiry for ${
                enq.product_name || "automotive spare parts"
              }. How can we assist you with availability and delivery today?`
            )}`;

            return (
              <div
                key={enq.id}
                className="p-5 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs space-y-3 hover:border-[#16834b]/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[rgba(17,20,18,0.06)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#111412]">
                        {enq.name}
                      </span>
                      <select
                        value={enq.status}
                        onChange={(e) =>
                          handleUpdateStatus(enq.id, e.target.value as EnquiryStatus)
                        }
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 border-0 cursor-pointer ${
                          enq.status === "new"
                            ? "bg-[#e8f5ee] text-[#0d6338]"
                            : enq.status === "contacted"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-[#f2f4f2] text-[#68706b]"
                        }`}
                      >
                        <option value="new">● New Lead</option>
                        <option value="contacted">● Contacted</option>
                        <option value="resolved">✓ Resolved</option>
                      </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#68706b] mt-1 font-medium">
                      <a
                        href={`tel:${enq.phone.replace(/[^0-9+]/g, "")}`}
                        className="flex items-center gap-1 hover:text-[#16834b]"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#16834b]" />
                        <span>{enq.phone}</span>
                      </a>
                      {enq.email && (
                        <a
                          href={`mailto:${enq.email}`}
                          className="flex items-center gap-1 hover:text-[#16834b]"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#16834b]" />
                          <span>{enq.email}</span>
                        </a>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(enq.created_at)}</span>
                      </span>
                    </div>
                  </div>

                  <a
                    href={whatsappReplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start sm:self-auto"
                  >
                    <Button variant="primary" size="sm" className="font-semibold gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      <span>Reply on WhatsApp</span>
                    </Button>
                  </a>
                </div>

                {/* Vehicle & Part Context */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-[#f7f8f7]/70 p-3 rounded-xl border border-[rgba(17,20,18,0.04)]">
                  {enq.product_name && (
                    <div>
                      <span className="text-[#68706b] block text-[11px]">
                        Requested Component:
                      </span>
                      <span className="font-semibold text-[#111412]">
                        {enq.product_name}
                      </span>
                      {enq.product_part_number && (
                        <span className="text-mono text-[11px] text-[#16834b] ml-1">
                          (#{enq.product_part_number})
                        </span>
                      )}
                    </div>
                  )}

                  {enq.vehicle_details && (
                    <div>
                      <span className="text-[#68706b] block text-[11px]">
                        Vehicle Description / VIN:
                      </span>
                      <span className="font-semibold text-[#111412] flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-[#16834b]" />
                        {enq.vehicle_details}
                      </span>
                    </div>
                  )}
                </div>

                {/* Message Body */}
                <p className="text-xs text-[#111412] bg-white p-3 rounded-xl border border-[rgba(17,20,18,0.06)] leading-relaxed">
                  &quot;{enq.message}&quot;
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
