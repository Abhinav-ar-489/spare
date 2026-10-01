import { settingsService } from "@/services";
import { SettingsForm } from "@/components/admin/settings-form";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await settingsService.getSettings();

  return <SettingsForm initialSettings={settings} />;
}
