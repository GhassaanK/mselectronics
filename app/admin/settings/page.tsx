import { AdminShell } from "@/components/admin/AdminShell"
import { SettingsForm } from "@/components/admin/SettingsForm"
import { getSiteSettings } from "@/lib/firebase/catalog"

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <AdminShell>
      <h1 className="heading-tight mb-lg text-3xl">Settings</h1>
      <SettingsForm settings={settings} />
    </AdminShell>
  )
}
