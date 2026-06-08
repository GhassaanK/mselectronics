"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { updateSiteSettings } from "@/lib/firebase/admin-settings"
import type { SiteSettings } from "@/types"

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState(settings)
  const [status, setStatus] = useState("")

  function updateField<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setStatus("Saving...")
      await updateSiteSettings(form)
      setStatus("Settings saved.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save settings.")
    }
  }

  return (
    <Card className="p-lg">
      <form className="grid gap-md" onSubmit={handleSubmit}>
        <div className="grid gap-md md:grid-cols-2">
          <Input placeholder="WhatsApp number" value={form.whatsappNumber} onChange={(event) => updateField("whatsappNumber", event.target.value)} />
          <Input placeholder="Company name" value={form.companyName} onChange={(event) => updateField("companyName", event.target.value)} />
          <Input placeholder="Company address" value={form.companyAddress} onChange={(event) => updateField("companyAddress", event.target.value)} />
          <Input placeholder="Company phone" value={form.companyPhone} onChange={(event) => updateField("companyPhone", event.target.value)} />
        </div>
        <Input placeholder="Hero headline" value={form.heroHeadline} onChange={(event) => updateField("heroHeadline", event.target.value)} />
        <textarea className="min-h-24 rounded-md border bg-background p-md text-sm outline-none" placeholder="Hero subheadline" value={form.heroSubheadline} onChange={(event) => updateField("heroSubheadline", event.target.value)} />
        <div className="grid gap-md md:grid-cols-2">
          <Input placeholder="Hero image public ID" value={form.heroImage.publicId} onChange={(event) => updateField("heroImage", { ...form.heroImage, publicId: event.target.value })} />
          <Input placeholder="Hero image alt" value={form.heroImage.alt} onChange={(event) => updateField("heroImage", { ...form.heroImage, alt: event.target.value })} />
        </div>
        <Input placeholder="Installment title" value={form.installmentTitle} onChange={(event) => updateField("installmentTitle", event.target.value)} />
        <textarea className="min-h-24 rounded-md border bg-background p-md text-sm outline-none" placeholder="Installment description" value={form.installmentDescription} onChange={(event) => updateField("installmentDescription", event.target.value)} />
        <div className="flex flex-wrap items-center gap-md">
          <Button type="submit" className="w-fit">Save Settings</Button>
          {status ? <p className="text-sm text-muted">{status}</p> : null}
        </div>
      </form>
    </Card>
  )
}
