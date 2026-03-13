/**
 * Swami Medical - Database Seed Script
 * Run: npx ts-node src/seed.ts
 * Creates admin user and sample medicines
 */

import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/swami-medical";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    phone: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const MedicineSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    composition: String,
    manufacturer: String,
    price: Number,
    stock: Number,
    expiryDate: Date,
    batchNumber: String,
    description: String,
    prescriptionRequired: Boolean,
    imageUrl: String,
    isActive: { type: Boolean, default: true },
    totalSold: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);
const Medicine = mongoose.model("Medicine", MedicineSchema);

const medicines = [
  {
    name: "Crocin 500mg",
    category: "Tablets",
    composition: "Paracetamol 500mg",
    manufacturer: "GSK",
    price: 32,
    stock: 150,
    prescriptionRequired: false,
    batchNumber: "B001",
    expiryDate: new Date("2026-06-30"),
    description: "For fever and mild to moderate pain relief",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/822/822143.png",
  },
  {
    name: "Azithromycin 500mg",
    category: "Tablets",
    composition: "Azithromycin 500mg",
    manufacturer: "Cipla",
    price: 85,
    stock: 80,
    prescriptionRequired: true,
    batchNumber: "B002",
    expiryDate: new Date("2025-12-31"),
    description: "Antibiotic for bacterial infections",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/4320/4320337.png",
  },
  {
    name: "Pan D Capsule",
    category: "Capsules",
    composition: "Pantoprazole 40mg + Domperidone 30mg",
    manufacturer: "Alkem",
    price: 120,
    stock: 200,
    prescriptionRequired: false,
    batchNumber: "B003",
    expiryDate: new Date("2026-03-31"),
    description: "For acidity, heartburn and gastric reflux",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966481.png",
  },
  {
    name: "Cetirizine 10mg",
    category: "Tablets",
    composition: "Cetirizine Hydrochloride 10mg",
    manufacturer: "Sun Pharma",
    price: 25,
    stock: 300,
    prescriptionRequired: false,
    batchNumber: "B004",
    expiryDate: new Date("2026-08-31"),
    description: "Antihistamine for allergy relief",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
  },
  {
    name: "Amoxicillin 500mg",
    category: "Capsules",
    composition: "Amoxicillin 500mg",
    manufacturer: "Mankind",
    price: 65,
    stock: 60,
    prescriptionRequired: true,
    batchNumber: "B005",
    expiryDate: new Date("2025-11-30"),
    description: "Broad-spectrum antibiotic",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/4320/4320337.png",
  },
  {
    name: "Himalaya Septilin Syrup",
    category: "Syrups",
    composition: "Guggul, Licorice, Indian Tinospora",
    manufacturer: "Himalaya",
    price: 118,
    stock: 45,
    prescriptionRequired: false,
    batchNumber: "B006",
    expiryDate: new Date("2026-02-28"),
    description: "Herbal immunity booster",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/822/822143.png",
  },
  {
    name: "Betadine Solution",
    category: "Antiseptics",
    composition: "Povidone Iodine 10%",
    manufacturer: "Win-Medicare",
    price: 99,
    stock: 70,
    prescriptionRequired: false,
    batchNumber: "B007",
    expiryDate: new Date("2026-04-30"),
    description: "Antiseptic solution for wound care",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966481.png",
  },
  {
    name: "Vitamin D3 Sachet",
    category: "Vitamins",
    composition: "Cholecalciferol 60000 IU",
    manufacturer: "Cadila",
    price: 45,
    stock: 200,
    prescriptionRequired: false,
    batchNumber: "B008",
    expiryDate: new Date("2026-10-31"),
    description: "Weekly vitamin D supplement",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/822/822143.png",
  },
  {
    name: "Metformin 500mg",
    category: "Tablets",
    composition: "Metformin Hydrochloride 500mg",
    manufacturer: "USV",
    price: 38,
    stock: 120,
    prescriptionRequired: true,
    batchNumber: "B009",
    expiryDate: new Date("2026-05-31"),
    description: "For type 2 diabetes management",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/4320/4320337.png",
  },
  {
    name: "Atorvastatin 10mg",
    category: "Tablets",
    composition: "Atorvastatin 10mg",
    manufacturer: "Dr. Reddy's",
    price: 72,
    stock: 90,
    prescriptionRequired: true,
    batchNumber: "B010",
    expiryDate: new Date("2025-09-30"),
    description: "For cholesterol management",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/4320/4320337.png",
  },
  {
    name: "Dolo 650mg",
    category: "Tablets",
    composition: "Paracetamol 650mg",
    manufacturer: "Micro Labs",
    price: 30,
    stock: 5,
    prescriptionRequired: false,
    batchNumber: "B011",
    expiryDate: new Date("2026-07-31"),
    description: "Fever and pain relief - higher strength",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/822/822143.png",
  },
  {
    name: "Allegra 120mg",
    category: "Tablets",
    composition: "Fexofenadine 120mg",
    manufacturer: "Sanofi",
    price: 175,
    stock: 55,
    prescriptionRequired: false,
    batchNumber: "B012",
    expiryDate: new Date("2026-01-31"),
    description: "Non-drowsy antihistamine for allergies",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
  },
  {
    name: "Volini Gel 30g",
    category: "Topical",
    composition: "Diclofenac + Linseed Oil + Menthol",
    manufacturer: "Ranbaxy",
    price: 145,
    stock: 80,
    prescriptionRequired: false,
    batchNumber: "B013",
    expiryDate: new Date("2026-06-30"),
    description: "Pain relief gel for muscles and joints",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966481.png",
  },
  {
    name: "Glucometer OneTouch",
    category: "Medical Devices",
    composition: "N/A",
    manufacturer: "LifeScan",
    price: 1499,
    stock: 15,
    prescriptionRequired: false,
    batchNumber: "B014",
    expiryDate: new Date("2028-12-31"),
    description: "Digital blood glucose monitoring device",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966481.png",
  },
  {
    name: "ENO Fruit Salt",
    category: "Antacids",
    composition: "Sodium Bicarbonate + Citric Acid",
    manufacturer: "GSK",
    price: 95,
    stock: 150,
    prescriptionRequired: false,
    batchNumber: "B015",
    expiryDate: new Date("2026-03-31"),
    description: "Fast relief from acidity and indigestion",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/4320/4320337.png",
  },
  {
    name: "ORS Electrolyte",
    category: "Syrups",
    composition: "Sodium Chloride + Potassium Chloride + Glucose",
    manufacturer: "Abbott",
    price: 22,
    stock: 200,
    prescriptionRequired: false,
    batchNumber: "B016",
    expiryDate: new Date("2027-01-31"),
    description: "Oral rehydration salts for dehydration",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/822/822143.png",
  },
  {
    name: "B-Complex Tablets",
    category: "Vitamins",
    composition: "Vitamin B1, B2, B3, B5, B6, B12, Biotin, Folic Acid",
    manufacturer: "Pfizer",
    price: 55,
    stock: 180,
    prescriptionRequired: false,
    batchNumber: "B017",
    expiryDate: new Date("2026-11-30"),
    description: "Complete B-complex vitamin supplement",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/822/822143.png",
  },
  {
    name: "Omez 20mg",
    category: "Capsules",
    composition: "Omeprazole 20mg",
    manufacturer: "Dr. Reddy's",
    price: 48,
    stock: 160,
    prescriptionRequired: false,
    batchNumber: "B018",
    expiryDate: new Date("2026-04-30"),
    description: "Proton pump inhibitor for acid reflux",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966481.png",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Medicine.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create admin user
    const adminPassword = await bcrypt.hash("Admin@123", 12);
    await User.create({
      name: "Swami Medical Admin",
      email: "admin@swamimedical.com",
      password: adminPassword,
      role: "admin",
      phone: "+91 94237 54244",
    });
    console.log("👤 Admin user created: admin@swamimedical.com / Admin@123");

    // Create customer user
    const customerPassword = await bcrypt.hash("Customer@123", 12);
    await User.create({
      name: "Rahul Sharma",
      email: "customer@example.com",
      password: customerPassword,
      role: "customer",
      phone: "+91 98765 00001",
    });
    console.log(
      "👤 Customer user created: customer@example.com / Customer@123",
    );

    // Create medicines
    await Medicine.insertMany(medicines);
    console.log(`💊 Created ${medicines.length} sample medicines`);

    console.log("\n🎉 Database seeded successfully!\n");
    console.log("Login credentials:");
    console.log("  Admin: admin@swamimedical.com / Admin@123");
    console.log("  Customer: customer@example.com / Customer@123\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
