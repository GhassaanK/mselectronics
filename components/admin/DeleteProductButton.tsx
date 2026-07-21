"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "@/lib/firebase/admin-products"

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [status, setStatus] = useState("")
  const router = useRouter()

  async function handleDelete() {
    const confirmed = window.confirm(`Delete ${name}?`)
    if (!confirmed) return
    try {
      setStatus("Deleting...")
      await deleteProduct(id)
      setStatus("Deleted")
      router.refresh()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete product.")
    }
  }

  return (
    <div className="flex items-center gap-sm">
      <Button type="button" variant="ghost" size="sm" onClick={handleDelete} aria-label={`Delete ${name}`} className="text-red-600 hover:bg-red-50 hover:text-red-700">
        <Trash2 size={14} />
        Delete
      </Button>
      {status ? <span className="text-xs text-muted">{status}</span> : null}
    </div>
  )
}
