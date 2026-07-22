import type { Brand, Category, Product, SiteSettings, Testimonial } from "@/types"

const now = { seconds: 0, nanoseconds: 0, toDate: () => new Date(), toMillis: () => 0, isEqual: () => true } as never

export const sampleCategories: Category[] = [
  {
    id: "air-conditioners",
    name: "Air Conditioners",
    slug: "air-conditioners",
    imagePublicId: "",
    imageUrl: "",
    productCount: 0
  },
  {
    id: "refrigerators",
    name: "Refrigerators",
    slug: "refrigerators",
    imagePublicId: "",
    imageUrl: "",
    productCount: 0
  },
  {
    id: "washing-machines",
    name: "Washing Machines",
    slug: "washing-machines",
    imagePublicId: "",
    imageUrl: "",
    productCount: 0
  },
  {
    id: "led-tvs",
    name: "LED TVs",
    slug: "led-tvs",
    imagePublicId: "",
    imageUrl: "",
    productCount: 0
  },
  {
    id: "kitchen-appliances",
    name: "Kitchen Appliances",
    slug: "kitchen-appliances",
    imagePublicId: "",
    imageUrl: "",
    productCount: 0
  },
  {
    id: "fans",
    name: "Fans",
    slug: "fans",
    imagePublicId: "",
    imageUrl: "",
    productCount: 0
  },
]

export const sampleBrands: Brand[] = [
  {
    id: "haier",
    name: "Haier",
    slug: "haier",
    logoPublicId: "",
    logoUrl: "",
    featured: true,
    displayOrder: 1,
  },
  {
    id: "dawlance",
    name: "Dawlance",
    slug: "dawlance",
    logoPublicId: "",
    logoUrl: "",
    featured: true,
    displayOrder: 2,
  },
  {
    id: "samsung",
    name: "Samsung",
    slug: "samsung",
    logoPublicId: "",
    logoUrl: "",
    featured: true,
    displayOrder: 3,
  },
  {
    id: "lg",
    name: "LG",
    slug: "lg",
    logoPublicId: "",
    logoUrl: "",
    featured: true,
    displayOrder: 4,
  },
  {
    id: "orient",
    name: "Orient",
    slug: "orient",
    logoPublicId: "",
    logoUrl: "",
    featured: false,
    displayOrder: 5,
  },
]

export const sampleProducts: Product[] = [
  {
    id: "haier-inverter-ac-1-ton",
    name: "Haier 1 Ton Inverter AC",
    brand: "Haier",
    category: "Air Conditioners",
    price: 158000,
    originalPrice: 172000,
    images: [{ publicId: "samples/ecommerce/leather-bag-gray", alt: "Haier inverter air conditioner" }],
    specs: { Capacity: "1 Ton", Technology: "DC Inverter", Warranty: "Official warranty", Energy: "Low voltage startup" },
    features: ["Fast cooling", "Energy efficient inverter", "Heat and cool support"],
    availability: "In Stock",
    featured: true,
    badge: "Best Seller",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "dawlance-refrigerator-9191",
    name: "Dawlance 9191 Refrigerator",
    brand: "Dawlance",
    category: "Refrigerators",
    price: 146500,
    images: [{ publicId: "samples/ecommerce/car-interior-design", alt: "Dawlance refrigerator" }],
    specs: { Type: "Top mount", Cooling: "Direct cool", Warranty: "Compressor warranty", Finish: "Metallic" },
    features: ["Spacious compartments", "Reliable cooling", "Premium finish"],
    availability: "In Stock",
    featured: true,
    badge: "New Arrival",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "samsung-55-inch-crystal-led",
    name: "Samsung 55 Inch Crystal LED TV",
    brand: "Samsung",
    category: "LED TVs",
    price: 228000,
    originalPrice: 245000,
    images: [{ publicId: "samples/ecommerce/accessories-bag", alt: "Samsung 55 inch LED TV" }],
    specs: { Size: "55 inch", Resolution: "4K UHD", Smart: "Yes", Panel: "Crystal display" },
    features: ["Crisp 4K visuals", "Smart apps", "Slim premium profile"],
    availability: "On Order",
    featured: true,
    badge: "On Sale",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "lg-front-load-washer",
    name: "LG Front Load Washing Machine",
    brand: "LG",
    category: "Washing Machines",
    price: 189000,
    images: [{ publicId: "samples/ecommerce/shoes", alt: "LG front load washing machine" }],
    specs: { Capacity: "8 kg", Motor: "Inverter direct drive", Programs: "Multiple wash programs", Color: "Silver" },
    features: ["Quiet operation", "Fabric care cycles", "Premium front load design"],
    availability: "In Stock",
    featured: false,
    createdAt: now,
    updatedAt: now
  }
]

export const sampleTestimonials: Testimonial[] = [
  { id: "akram-shams", name: "Akram Shams", city: "Karachi", rating: 5, text: "AC ka model samajh nahi aa raha tha, unhon ne simple words main bata diya ke room ke liye konsa theek hai. delivery bhi time pe hogai", createdAt: now },
  { id: "bilal-ahmed", name: "Bilal Ahmed", city: "Karachi", rating: 5, text: "Main ne washing machine li thi, price bhi market jaisa tha aur warranty card proper mila. WhatsApp pe reply thora late aya but kaam sahi hogaya", createdAt: now },
  { id: "shaheen-arshad", name: "Shaheen Arshad", city: "Karachi", rating: 5, text: "Fridge ghar pe check karwaya phir payment ki. mujhe ye acha laga ke jaldi jaldi force nahi kiya, araam se options bata diye", createdAt: now },
  { id: "ghassaan-saif-ullah", name: "Ghassaan Saif Ullah", city: "Karachi", rating: 5, text: "Product same wohi nikla jo picture main tha, koi change ya excuse nahi. installation wale bhi next day aa gaye thay so overall good experience", createdAt: now },
  { id: "hussain-iqbal", name: "Hussain Iqbal", city: "Karachi", rating: 5, text: "Mujhe sirf budget bataya tha aur unhon ne 2 3 options bhej diye. zyada sales wali baat nahi ki, jo practical tha woh suggest kar diya", createdAt: now },
  { id: "syed-zain-ali", name: "Syed Zain Ali", city: "Karachi", rating: 5, text: "Haier AC liya tha, box sealed tha aur bill bhi mil gaya. price confirm karne ke baad koi hidden charges nahi niklay", createdAt: now },
  { id: "naveen-qureshi", name: "Naveen Qureshi", city: "Karachi", rating: 5, text: "Online order karte hue doubt hota hai but inka response normal aur clear tha. machine receive hui to condition clean thi, abhi tak working fine", createdAt: now },
  { id: "asma-malik", name: "Asma Malik", city: "Karachi", rating: 5, text: "Mere parents ke liye fridge chahiye tha, unhon ne size aur bijli wali detail samjha di. delivery boy ne old fridge side pe rakhne main bhi help kar di", createdAt: now }
]

export const sampleSettings: SiteSettings = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923122275812",
  heroHeadline: "Premium appliances with expert buying guidance.",
  heroSubheadline: "Browse leading brands, compare essentials, and send a WhatsApp inquiry for availability, warranty, delivery, and installment options.",
  heroImage: { publicId: "samples/ecommerce/analog-classic", alt: "Premium home appliance display" },
  installmentTitle: "Installment guidance made simple",
  installmentDescription: "Ask our team about available installment options and product-specific eligibility before you buy.",
  companyName: "MS Electronics",
  companyAddress: "Shop 01, Next to Bank Alfalah, Main Chorangi, Landhi 06, Karachi",
  companyPhone: "+92 312 2275812",
  socialLinks: {}
}
