const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo"

function buildCloudinaryUrl(publicId: string, transforms: string) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`
}

export function getProductImageUrl(publicId: string) {
  return buildCloudinaryUrl(publicId, "f_auto,q_auto,c_fill,w_1200,h_900")
}

export function getProductThumbnail(publicId: string) {
  return buildCloudinaryUrl(publicId, "f_auto,q_auto,c_fill,w_480,h_420")
}
