"use client";

import * as React from "react";
import { Check, Settings, Save, Phone, MessageSquare, Mail, MapPin, Globe } from "lucide-react";
import { SiteSettings } from "@/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = React.useState<SiteSettings>(initialSettings);
  const [isSaving, setIsSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to update settings");
      } else {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412]">
            Site & Business Configuration
          </h1>
          <p className="text-xs sm:text-sm text-[#68706b] mt-0.5">
            Configure live business metadata, WhatsApp desk number, and homepage announcements.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSaving}
          className="font-bold gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-[#e8f5ee] border border-[#16834b]/20 text-xs font-semibold text-[#0d6338] flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-[#16834b]" />
          <span>Settings successfully updated across store.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* Group 1: General Business Identity */}
      <div className="p-5 sm:p-6 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white space-y-4">
        <h2 className="text-sm font-bold text-[#111412] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#16834b]" />
          <span>1. Business Identity & Taglines</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111412] mb-1">
              Business Name *
            </label>
            <Input
              value={settings.business_name}
              onChange={(e) =>
                setSettings({ ...settings, business_name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111412] mb-1">
              Tagline *
            </label>
            <Input
              value={settings.business_tagline}
              onChange={(e) =>
                setSettings({ ...settings, business_tagline: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#111412] mb-1">
            Top Announcement Banner Text
          </label>
          <Input
            value={settings.announcement}
            onChange={(e) =>
              setSettings({ ...settings, announcement: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#111412] mb-1">
            Homepage Hero Headline *
          </label>
          <Input
            value={settings.headline}
            onChange={(e) =>
              setSettings({ ...settings, headline: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#111412] mb-1">
            Homepage Hero Description *
          </label>
          <textarea
            rows={2}
            value={settings.hero_description}
            onChange={(e) =>
              setSettings({ ...settings, hero_description: e.target.value })
            }
            className="w-full rounded-xl border border-[rgba(17,20,18,0.12)] p-3 text-sm text-[#111412] focus:border-[#16834b] focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Group 2: Contact & WhatsApp Desk */}
      <div className="p-5 sm:p-6 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white space-y-4">
        <h2 className="text-sm font-bold text-[#111412] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#16834b]" />
          <span>2. Live Communications & WhatsApp Desk</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111412] mb-1">
              WhatsApp Desk Phone Number (with Country Code) *
            </label>
            <Input
              icon={<MessageSquare className="w-4 h-4" />}
              value={settings.whatsapp_number}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp_number: e.target.value })
              }
              placeholder="e.g. 7736523385 or 9717736523385"
              required
            />
            <p className="text-[11px] text-[#68706b] mt-1">
              All product enquiry clicks generate wa.me links to this phone number.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111412] mb-1">
              Public Telephone *
            </label>
            <Input
              icon={<Phone className="w-4 h-4" />}
              value={settings.phone}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111412] mb-1">
              Official Email *
            </label>
            <Input
              icon={<Mail className="w-4 h-4" />}
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111412] mb-1">
              Working Hours
            </label>
            <Input
              value={settings.business_hours}
              onChange={(e) =>
                setSettings({ ...settings, business_hours: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#111412] mb-1">
            Logistics & Hub Address *
          </label>
          <Input
            icon={<MapPin className="w-4 h-4" />}
            value={settings.address}
            onChange={(e) =>
              setSettings({ ...settings, address: e.target.value })
            }
            required
          />
        </div>
      </div>

      {/* Group 3: Social & Currency */}
      <div className="p-5 sm:p-6 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white space-y-4">
        <h2 className="text-sm font-bold text-[#111412] flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#16834b]" />
          <span>3. Regional & Social Channels</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111412] mb-1">
              Default Currency Code
            </label>
            <Input
              value={settings.default_currency}
              onChange={(e) =>
                setSettings({ ...settings, default_currency: e.target.value })
              }
              placeholder="INR"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111412] mb-1">
              Instagram Profile URL
            </label>
            <Input
              value={settings.social_links.instagram || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  social_links: {
                    ...settings.social_links,
                    instagram: e.target.value,
                  },
                })
              }
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Button */}
      <div className="sticky bottom-14 lg:bottom-4 z-20 bg-white/95 backdrop-blur-xl border border-[rgba(17,20,18,0.1)] p-4 rounded-2xl shadow-xl flex items-center justify-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSaving}
          className="font-bold gap-2 px-8"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>
    </form>
  );
}
