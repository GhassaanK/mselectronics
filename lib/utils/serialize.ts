import type { Product, SerializableProduct, SerializableTestimonial, Testimonial } from "@/types"

type TimestampLike = {
  toMillis?: () => number
  toDate?: () => Date
  seconds?: number
}

function timestampToMillis(value: unknown): number {
  const timestamp = value as TimestampLike
  if (typeof timestamp?.toMillis === "function") return timestamp.toMillis()
  if (typeof timestamp?.toDate === "function") return timestamp.toDate().getTime()
  if (typeof timestamp?.seconds === "number") return timestamp.seconds * 1000
  return 0
}

export function serializeProduct(product: Product): SerializableProduct {
  return {
    ...product,
    createdAt: timestampToMillis(product.createdAt),
    updatedAt: timestampToMillis(product.updatedAt)
  }
}

export function serializeProducts(products: Product[]): SerializableProduct[] {
  return products.map(serializeProduct)
}

export function serializeTestimonial(testimonial: Testimonial): SerializableTestimonial {
  return {
    ...testimonial,
    createdAt: timestampToMillis(testimonial.createdAt)
  }
}

export function serializeTestimonials(testimonials: Testimonial[]): SerializableTestimonial[] {
  return testimonials.map(serializeTestimonial)
}
