import { formatPrice } from "@/lib/utils/format"

type WhatsAppProduct = {
  name: string
  price: number
}

export function buildWhatsAppUrl(products: WhatsAppProduct[], phoneNumber: string) {
  const lines = products.map((product, index) => `${index + 1}. ${product.name} - ${formatPrice(product.price)}`)
  const message = [
    "Assalam u Alaikum,",
    "",
    "I am interested in the following products:",
    "",
    ...lines,
    "",
    "Can someone guide me regarding:",
    "",
    "- Availability",
    "- Warranty",
    "- Delivery",
    "- Installment options",
    "",
    "Thank you."
  ].join("\n")

  return `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
}
