/**
 * Swami Medical - Database Seed Script (Plain JavaScript)
 * Run: node seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swami-medical';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'customer' },
  phone: String,
  addresses: { type: Array, default: [] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const MedicineSchema = new mongoose.Schema({
  name: String, category: String, composition: String,
  manufacturer: String, price: Number, stock: { type: Number, default: 0 },
  expiryDate: Date, batchNumber: String, description: String,
  prescriptionRequired: { type: Boolean, default: false },
  imageUrl: String, isActive: { type: Boolean, default: true },
  totalSold: { type: Number, default: 0 }, discount: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Medicine = mongoose.model('Medicine', MedicineSchema);

const medicines = [
  { name: 'Crocin 500mg', category: 'Tablets', composition: 'Paracetamol 500mg', manufacturer: 'GSK', price: 32, stock: 150, prescriptionRequired: false, batchNumber: 'B001', expiryDate: new Date('2026-06-30'), description: 'For fever and mild to moderate pain relief' },
  { name: 'Azithromycin 500mg', category: 'Tablets', composition: 'Azithromycin 500mg', manufacturer: 'Cipla', price: 85, stock: 80, prescriptionRequired: true, batchNumber: 'B002', expiryDate: new Date('2025-12-31'), description: 'Antibiotic for bacterial infections' },
  { name: 'Pan D Capsule', category: 'Capsules', composition: 'Pantoprazole 40mg + Domperidone 30mg', manufacturer: 'Alkem', price: 120, stock: 200, prescriptionRequired: false, batchNumber: 'B003', expiryDate: new Date('2026-03-31'), description: 'For acidity, heartburn and gastric reflux' },
  { name: 'Cetirizine 10mg', category: 'Tablets', composition: 'Cetirizine Hydrochloride 10mg', manufacturer: 'Sun Pharma', price: 25, stock: 300, prescriptionRequired: false, batchNumber: 'B004', expiryDate: new Date('2026-08-31'), description: 'Antihistamine for allergy relief' },
  { name: 'Amoxicillin 500mg', category: 'Capsules', composition: 'Amoxicillin 500mg', manufacturer: 'Mankind', price: 65, stock: 60, prescriptionRequired: true, batchNumber: 'B005', expiryDate: new Date('2025-11-30'), description: 'Broad-spectrum antibiotic' },
  { name: 'Himalaya Septilin Syrup', category: 'Syrups', composition: 'Guggul, Licorice, Indian Tinospora', manufacturer: 'Himalaya', price: 118, stock: 45, prescriptionRequired: false, batchNumber: 'B006', expiryDate: new Date('2026-02-28'), description: 'Herbal immunity booster' },
  { name: 'Betadine Solution', category: 'Antiseptics', composition: 'Povidone Iodine 10%', manufacturer: 'Win-Medicare', price: 99, stock: 70, prescriptionRequired: false, batchNumber: 'B007', expiryDate: new Date('2026-04-30'), description: 'Antiseptic solution for wound care' },
  { name: 'Vitamin D3 Sachet', category: 'Vitamins', composition: 'Cholecalciferol 60000 IU', manufacturer: 'Cadila', price: 45, stock: 200, prescriptionRequired: false, batchNumber: 'B008', expiryDate: new Date('2026-10-31'), description: 'Weekly vitamin D supplement' },
  { name: 'Metformin 500mg', category: 'Tablets', composition: 'Metformin Hydrochloride 500mg', manufacturer: 'USV', price: 38, stock: 120, prescriptionRequired: true, batchNumber: 'B009', expiryDate: new Date('2026-05-31'), description: 'For type 2 diabetes management' },
  { name: 'Atorvastatin 10mg', category: 'Tablets', composition: 'Atorvastatin 10mg', manufacturer: "Dr. Reddy's", price: 72, stock: 90, prescriptionRequired: true, batchNumber: 'B010', expiryDate: new Date('2025-09-30'), description: 'For cholesterol management' },
  { name: 'Dolo 650mg', category: 'Tablets', composition: 'Paracetamol 650mg', manufacturer: 'Micro Labs', price: 30, stock: 5, prescriptionRequired: false, batchNumber: 'B011', expiryDate: new Date('2026-07-31'), description: 'Fever and pain relief - higher strength' },
  { name: 'Allegra 120mg', category: 'Tablets', composition: 'Fexofenadine 120mg', manufacturer: 'Sanofi', price: 175, stock: 55, prescriptionRequired: false, batchNumber: 'B012', expiryDate: new Date('2026-01-31'), description: 'Non-drowsy antihistamine for allergies' },
  { name: 'Volini Gel 30g', category: 'Topical', composition: 'Diclofenac + Linseed Oil + Menthol', manufacturer: 'Ranbaxy', price: 145, stock: 80, prescriptionRequired: false, batchNumber: 'B013', expiryDate: new Date('2026-06-30'), description: 'Pain relief gel for muscles and joints' },
  { name: 'Glucometer OneTouch', category: 'Medical Devices', composition: 'N/A', manufacturer: 'LifeScan', price: 1499, stock: 15, prescriptionRequired: false, batchNumber: 'B014', expiryDate: new Date('2028-12-31'), description: 'Digital blood glucose monitoring device' },
  { name: 'ENO Fruit Salt', category: 'Antacids', composition: 'Sodium Bicarbonate + Citric Acid', manufacturer: 'GSK', price: 95, stock: 150, prescriptionRequired: false, batchNumber: 'B015', expiryDate: new Date('2026-03-31'), description: 'Fast relief from acidity and indigestion' },
  { name: 'ORS Electrolyte Sachet', category: 'Syrups', composition: 'Sodium Chloride + Potassium Chloride + Glucose', manufacturer: 'Abbott', price: 22, stock: 200, prescriptionRequired: false, batchNumber: 'B016', expiryDate: new Date('2027-01-31'), description: 'Oral rehydration salts for dehydration' },
  { name: 'B-Complex Tablets', category: 'Vitamins', composition: 'Vitamin B1, B2, B3, B5, B6, B12, Biotin, Folic Acid', manufacturer: 'Pfizer', price: 55, stock: 180, prescriptionRequired: false, batchNumber: 'B017', expiryDate: new Date('2026-11-30'), description: 'Complete B-complex vitamin supplement' },
  { name: 'Omez 20mg', category: 'Capsules', composition: 'Omeprazole 20mg', manufacturer: "Dr. Reddy's", price: 48, stock: 160, prescriptionRequired: false, batchNumber: 'B018', expiryDate: new Date('2026-04-30'), description: 'Proton pump inhibitor for acid reflux' },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB:', MONGODB_URI);

    // Clear existing data
    await User.deleteMany({});
    await Medicine.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    const admin = await User.create({
      name: 'Swami Medical Admin',
      email: 'admin@swamimedical.com',
      password: adminPassword,
      role: 'admin',
      phone: '+91 98765 43210',
      isActive: true,
    });
    console.log('👤 Admin created:', admin.email);

    // Create customer
    const customerPassword = await bcrypt.hash('Customer@123', 12);
    const customer = await User.create({
      name: 'Rahul Sharma',
      email: 'customer@example.com',
      password: customerPassword,
      role: 'customer',
      phone: '+91 98765 00001',
      isActive: true,
    });
    console.log('👤 Customer created:', customer.email);

    // Create medicines
    await Medicine.insertMany(medicines);
    console.log(`💊 Created ${medicines.length} medicines`);

    console.log('\n🎉 Seed complete!\n');
    console.log('  Admin:    admin@swamimedical.com  /  Admin@123');
    console.log('  Customer: customer@example.com    /  Customer@123\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
