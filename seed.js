// seed.js — Ejecutar UNA SOLA VEZ para cargar los datos en Firebase
// Correr con: node seed.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKSw-8lQFDrSUfSgE3uE6gPXH4KjwqRAs",
  authDomain: "contreburger-web.firebaseapp.com",
  projectId: "contreburger-web",
  storageBucket: "contreburger-web.firebasestorage.app",
  messagingSenderId: "108203474204",
  appId: "1:108203474204:web:b55475b2e2bf5cd46a4ed9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PRODUCTS = [
  { name: "La Vikinga", category: "burgers", price: 8500, description: "Doble carne smasheada, cheddar, cebolla crispy y salsa nórdica.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" },
  { name: "Contre Royal", category: "burgers", price: 9200, description: "180g de carne, bacon ahumado, huevo a la plancha y barbacoa.", image: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=800&q=80" },
  { name: "Veggie Roots", category: "burgers", price: 7800, description: "Medallón de lentejas, rúcula, tomates confitados y mayo de palta.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80" },
  { name: "Cheese Bomb", category: "burgers", price: 8900, description: "Triple carne, triple cheddar, inyectada con salsa de queso.", image: "https://s3.eu-central-1.amazonaws.com/qatar-delicious/ItemsImages/ItemImage_36231_(0).jpg" },
  { name: "Tequeños Clásicos (x6)", category: "tequenos", price: 4500, description: "Masa fina y crocante rellena de queso llanero.", image: "https://i0.wp.com/mosaicofrozen.com/wp-content/uploads/2022/01/tequenos-mosaico-frozen-3-1.jpg?fit=600%2C629&ssl=1" },
  { name: "Tequeños Especiales (x6)", category: "tequenos", price: 5000, description: "Rellenos de queso y guayaba o chocolate.", image: "https://storage.ww-api.com/storage_api/v1/commerce_pict/3470081/1710004731146_3233168/tequeno-guayaba.jpeg" },
  { name: "Empanada de Carne Mechada", category: "empanadas", price: 1500, description: "Carne cortada a cuchillo, jugosa y picante.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3gDwiaxDSAIkinV_1cqDznoKvTPq2n33biQ&s" },
  { name: "Empanada de JyQ", category: "empanadas", price: 1400, description: "Jamón cocido natural y mozzarella.", image: "https://imag.bonviveur.com/empanadas-venezolanas-de-pollo.jpg" },
  { name: "Coca Cola", category: "drinks", price: 2000, description: "Lata 354ml bien fría.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80" },
  { name: "Cerveza IPA", category: "drinks", price: 3500, description: "Pinta artesanal 500ml.", image: "https://bruselasbeer.com/cdn/shop/files/Volfas_IPA_150bf91d-9443-472e-afb0-2c87254d5b05.jpg?v=1756164323" },
  { name: "Agua Mineral", category: "drinks", price: 1500, description: "Con o sin gas 500ml.", image: "https://i.pinimg.com/1200x/a4/01/19/a40119e82b50611e73b1565d0fded827.jpg" },
  { name: "Chocotorta", category: "desserts", price: 3000, description: "La clásica argentina, porción generosa.", image: "https://resizer.glanacion.com/resizer/v2/-4WVQEFLGJ5BWRK4WYRLC7PXI3M.jpg?auth=ac8e184e33278619c066a8c11de9711367c8e28b668eca48368ecd77664c00f3&width=1920&height=1282&quality=70&smart=true" },
  { name: "Cheesecake", category: "desserts", price: 3500, description: "Con frutos rojos patagónicos.", image: "https://cdn.blog.paulinacocina.net/wp-content/uploads/2025/01/receta-de-cheesecake-1742898428.jpg" },
];

const CATEGORIES = [
  { id: "burgers",   label: "Hamburguesas", icon: "burger",   image: "https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/Hamburguesa_categoria_9_16.png?alt=media&token=77f54e8b-fb6e-4103-b430-bca8ec65c8d5" },
  { id: "tequenos",  label: "Tequeños",     icon: "utensils", image: "https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/tequenos_9_16.png?alt=media&token=cfa1bcc7-0802-42b5-804e-79a6f5bdcfd2" },
  { id: "empanadas", label: "Empanadas",    icon: "utensils", image: "https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/empanadas_9_16.png?alt=media&token=b3fa27db-7945-47d2-b3c7-2bfccdb3c861" },
  { id: "drinks",    label: "Bebidas",      icon: "coffee",   image: "https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/CAtegoria_bebidas_2_9_16.png?alt=media&token=86af7b5d-4310-478b-a0bb-93efc6011e33" },
  { id: "desserts",  label: "Postres",      icon: "cake",     image: "https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/3%20LECHES_9_16.png?alt=media&token=4316a794-d3a9-4c0e-b172-09837b9bf100" },
];

const SETTINGS = {
  marqueeText: "🕰 Jueves a Domingos | 19:00 a 23:00 hrs • Envíos a todo Moreno • Pedí por WhatsApp y retirá en local"
};

async function seed() {
  console.log("🚀 Iniciando carga de datos...\n");

  // 1. Cargar categorías con ID fijo
  console.log("📂 Cargando categorías...");
  for (const cat of CATEGORIES) {
    const { id, ...data } = cat;
    await setDoc(doc(db, "categories", id), data);
    console.log(`   ✅ ${cat.label}`);
  }

  // 2. Cargar productos
  console.log("\n🍔 Cargando productos...");
  for (const product of PRODUCTS) {
    await addDoc(collection(db, "products"), product);
    console.log(`   ✅ ${product.name}`);
  }

  // 3. Cargar settings (banner)
  console.log("\n📢 Cargando banner...");
  await setDoc(doc(db, "settings", "main_settings"), SETTINGS);
  console.log(`   ✅ Banner configurado`);

  console.log("\n🎉 ¡Todo cargado exitosamente!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});