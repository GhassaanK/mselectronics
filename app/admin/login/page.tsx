import { AdminGuard } from "@/components/admin/AdminGuard"

export default function AdminLoginPage() {
  return <AdminGuard><div className="container-page py-2xl">You are signed in.</div></AdminGuard>
}
