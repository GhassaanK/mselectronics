"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "@/lib/firebase/admin-products"

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [status, setStatus] = useState("")

  async function handleDelete() {
    const confirmed = window.confirm(`Delete ${name}?`)
    if (!confirmed) return
    try {
      setStatus("Deleting...")
      await deleteProduct(id)
      setStatus("Deleted")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete product.")
    }
  }

  return (
    <div className="flex items-center gap-sm">
      <Button type="button" variant="ghost" size="icon" onClick={handleDelete} aria-label={`Delete ${name}`}>
        <Trash2 size={16} />
      </Button>
      {status ? <span className="text-xs text-muted">{status}</span> : null}
    </div>
  )
}
