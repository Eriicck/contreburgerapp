import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- ICONOS SVG ---
const Icons = {
  Cart: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Minus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Bike: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.5 17a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm13 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M2 17h1.5"/><path d="M19 17h3"/><path d="M8 17h5.5"/><path d="M16.5 12H8L6 4H3"/><path d="M21 9h-7l-1 3h9l-1 5Z"/></svg>,
  Store: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>,
  Code: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Instagram: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  TikTok: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0-1 13.6 6.84 6.84 0 0 0 6.82-6.84V9.28a9 9 0 0 0 5-1.55z"/></svg>,
  Whatsapp: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  PatternBurgers: ({ className }) => (
    <div className={className} style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
    }} />
  )
};

// --- DATOS DEL NEGOCIO ---
const WHATSAPP_NUMBER = "5491124952866";

// Imágenes de alta calidad para las secciones
const HEADER_IMAGES = [
  "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=2069&auto=format&fit=crop"
];

const CATEGORIES = [
  { id: 'burgers', label: 'Hamburguesas', image: 'https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/Hamburguesa_categoria_9_16.png?alt=media&token=77f54e8b-fb6e-4103-b430-bca8ec65c8d5' },
  { id: 'tequenos', label: 'Tequeños', image: 'https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/tequenos_9_16.png?alt=media&token=cfa1bcc7-0802-42b5-804e-79a6f5bdcfd2' },
  { id: 'empanadas', label: 'Empanadas', image: 'https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/empanadas_9_16.png?alt=media&token=b3fa27db-7945-47d2-b3c7-2bfccdb3c861' },
  { id: 'drinks', label: 'Bebidas', image: 'https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/CAtegoria_bebidas_2_9_16.png?alt=media&token=86af7b5d-4310-478b-a0bb-93efc6011e33' },
  { id: 'desserts', label: 'Postres', image: 'https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/3%20LECHES_9_16.png?alt=media&token=4316a794-d3a9-4c0e-b172-09837b9bf100' },
];

const PRODUCTS = [
  // --- BURGERS ---
  { id: 1, name: "La Vikinga", category: "burgers", price: 8500, description: "Doble carne smasheada, cheddar, cebolla crispy y salsa nórdica.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "Contre Royal", category: "burgers", price: 9200, description: "180g de carne, bacon ahumado, huevo a la plancha y barbacoa.", image: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Veggie Roots", category: "burgers", price: 7800, description: "Medallón de lentejas, rúcula, tomates confitados y mayo de palta.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Cheese Bomb", category: "burgers", price: 8900, description: "Triple carne, triple cheddar, inyectada con salsa de queso.", image: "https://s3.eu-central-1.amazonaws.com/qatar-delicious/ItemsImages/ItemImage_36231_(0).jpg" },
  
  // --- TEQUEÑOS ---
  { id: 10, name: "Tequeños Clásicos (x6)", category: "tequenos", price: 4500, description: "Masa fina y crocante rellena de queso llanero.", image: "https://i0.wp.com/mosaicofrozen.com/wp-content/uploads/2022/01/tequenos-mosaico-frozen-3-1.jpg?fit=600%2C629&ssl=1" },
  { id: 11, name: "Tequeños Especiales (x6)", category: "tequenos", price: 5000, description: "Rellenos de queso y guayaba o chocolate.", image: "https://storage.ww-api.com/storage_api/v1/commerce_pict/3470081/1710004731146_3233168/tequeno-guayaba.jpeg" },
  
  // --- EMPANADAS ---
  { id: 20, name: "Empanada de Carne Mechada", category: "empanadas", price: 1500, description: "Carne cortada a cuchillo, jugosa y picante.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3gDwiaxDSAIkinV_1cqDznoKvTPq2n33biQ&s" },
  { id: 21, name: "Empanada de JyQ", category: "empanadas", price: 1400, description: "Jamón cocido natural y mozzarella.", image: "https://imag.bonviveur.com/empanadas-venezolanas-de-pollo.jpg" },
  
  // --- BEBIDAS ---
  { id: 30, name: "Coca Cola", category: "drinks", price: 2000, description: "Lata 354ml bien fría.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80" },
  { id: 31, name: "Cerveza IPA", category: "drinks", price: 3500, description: "Pinta artesanal 500ml.", image: "https://bruselasbeer.com/cdn/shop/files/Volfas_IPA_150bf91d-9443-472e-afb0-2c87254d5b05.jpg?v=1756164323" },
  { id: 32, name: "Agua Mineral", category: "drinks", price: 1500, description: "Con o sin gas 500ml.", image: "https://i.pinimg.com/1200x/a4/01/19/a40119e82b50611e73b1565d0fded827.jpg" },
  
  // --- POSTRES ---
  { id: 40, name: "Chocotorta", category: "desserts", price: 3000, description: "La clásica argentina, porción generosa.", image: "https://resizer.glanacion.com/resizer/v2/-4WVQEFLGJ5BWRK4WYRLC7PXI3M.jpg?auth=ac8e184e33278619c066a8c11de9711367c8e28b668eca48368ecd77664c00f3&width=1920&height=1282&quality=70&smart=true" },
  { id: 41, name: "Cheesecake", category: "desserts", price: 3500, description: "Con frutos rojos patagónicos.", image: "https://cdn.blog.paulinacocina.net/wp-content/uploads/2025/01/receta-de-cheesecake-1742898428.jpg" },
];

// --- COMPONENTES AUXILIARES ---
const QuantityControl = ({ quantity, onIncrease, onDecrease, size = 'md' }) => {
  const btnClass = `flex items-center justify-center rounded-full bg-stone-200 hover:bg-amber-600 hover:text-white transition-colors ${size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'}`;
  return (
    <div className="flex items-center gap-3 bg-white rounded-full border border-stone-200 px-2 py-1 shadow-sm">
      <button onClick={onDecrease} className={btnClass}><Icons.Minus /></button>
      <span className={`font-bold text-stone-900 ${size === 'sm' ? 'text-sm' : 'text-base'}`}>{quantity}</span>
      <button onClick={onIncrease} className={btnClass}><Icons.Plus /></button>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  // ESTADOS
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  
  // Estado para detectar móvil
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Modales y UI
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  
  // Refs para Scroll
  const menuRef = useRef(null);

  // Checkout Form
  const [checkoutData, setCheckoutData] = useState({
    type: 'delivery',
    paymentMethod: '',
    cashAmount: '',
    name: '',
    address: '',
    number: '',
    crossStreets: ''
  });

  // Detectar Móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Parallax Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
        setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Items por página dinámico
  const itemsPerPage = isMobile ? 5 : 8;

  // Slider Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeaderIndex(prev => (prev + 1) % HEADER_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Scroll top on page change (solo en móvil o si es necesario)
  useEffect(() => {
    if (currentPage > 1) {
        menuRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

  // Lógica del Carrito
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  // Selección de Categoría
  const handleCategorySelect = (catId) => {
    setCategoryFilter(catId);
    setSearchTerm("");
    setCurrentPage(1);
    menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtrado y Paginación
  const filteredProducts = useMemo(() => {
    let items = PRODUCTS;
    if (categoryFilter !== 'all') items = items.filter(p => p.category === categoryFilter);
    if (searchTerm) items = items.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return [...items].sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'alpha-asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [searchTerm, categoryFilter, sortOption]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Checkout
  const handleCheckout = () => {
    const { type, paymentMethod, cashAmount, name, address, number, crossStreets } = checkoutData;
    let message = `*HOLA CONTREBURGER! 🍔 QUIERO HACER UN PEDIDO*\n\n*MI PEDIDO:*\n`;
    
    cart.forEach(item => {
      message += `▪ ${item.quantity}x ${item.name} ($${item.price * item.quantity})\n`;
    });
    
    message += `\n*TOTAL: $${cartTotal.toLocaleString('es-AR')}*\n----------------------------\n`;
    
    if (type === 'delivery') {
      message += `🛵 *DELIVERY*\n👤 *Nombre:* ${name}\n📍 *Dirección:* ${address} ${number}\n`;
      if (crossStreets) message += `🛣 *Entre calles:* ${crossStreets}\n`;
    } else {
      message += `🏃 *RETIRO EN EL LOCAL*\n👤 *Nombre:* ${name}\n`;
    }
    
    message += `\n💳 *PAGO CON:* ${paymentMethod === 'mercadopago' ? 'MercadoPago' : 'Efectivo'}`;
    if (paymentMethod === 'efectivo' && type === 'delivery' && cashAmount) {
      message += `\n💵 *ABONO CON:* $${cashAmount} (Calcular vuelto)`;
    }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
    <style>{`
        /* Ocultar barra de scroll en navegadores Webkit (Chrome, Safari) */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        /* Ocultar barra de scroll en Firefox e IE */
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            animation: marquee 20s linear infinite;
        }
    `}</style>
    <div className="font-sans text-stone-900 bg-stone-50 min-h-screen">
      
      {/* SECCIÓN 1: HERO (100vh) */}
      <section className="relative h-screen overflow-hidden bg-black flex flex-col">
        {/* Banner Superior - MARQUEE INFINITO */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-black/80 text-stone-200 py-2 text-xs md:text-sm font-bold tracking-widest uppercase backdrop-blur-sm border-b border-stone-800 overflow-hidden whitespace-nowrap">
            <div className="animate-marquee flex gap-12">
                <span>🕰 Jueves a Domingos | 19:00 a 23:00 hrs • Envíos a todo Moreno • Pedí por WhatsApp y retira</span>
                <span>🕰 Jueves a Domingos | 19:00 a 23:00 hrs • Envíos a todo Moreno • Pedí por WhatsApp y retira</span>
                <span>🕰 Jueves a Domingos | 19:00 a 23:00 hrs • Envíos a todo Moreno • Pedí por WhatsApp y retira</span>
                <span>🕰 Jueves a Domingos | 19:00 a 23:00 hrs • Envíos a todo Moreno • Pedí por WhatsApp y retira</span>
            </div>
        </div>

        {/* Imágenes de Fondo */}
        {HEADER_IMAGES.map((img, index) => (
          <div key={index} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentHeaderIndex ? 'opacity-60' : 'opacity-0'}`} style={{ backgroundImage: `url(${img})` }} />
        ))}
        
        {/* Contenido Central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight drop-shadow-2xl mb-6">
            CONTRE<span className="text-amber-500">BURGER</span>
          </h1>
          <p className="text-white text-xl md:text-3xl font-light tracking-widest drop-shadow-lg mb-8">
            SABOR QUE HACE HISTORIA
          </p>
          <div className="mt-8">
             <button onClick={() => menuRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg">
                 VER MENÚ
             </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: CATEGORÍAS (100vh) CON PARALLAX DE VECTORES */}
      <section className="relative min-h-screen bg-stone-900 flex flex-col justify-center py-12 px-4 md:px-8 overflow-hidden relative">
        {/* Fondo Parallax Vectorial (Single Model - Crosses) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
             {/* Capa Única: Cruces Blancas - Parallax */}
             <div 
                className="absolute left-0 right-0 pointer-events-none" // Ajustado para que cubra todo
                style={{ 
                    top: '-50%', // Empieza mucho más arriba para cubrir el hueco
                    height: '200%', // Doble altura para compensar el movimiento
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px', // Pequeñas
                    transform: `translateY(${scrollY * 0.15}px)`, // Parallax suave hacia abajo
                    opacity: 0.7
                }}
             />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full h-full flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 uppercase tracking-tight">
            ¿Qué te provoca <span className="text-amber-500">hoy?</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-full md:h-[60vh]">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="group relative h-40 md:h-full rounded-2xl overflow-hidden border border-stone-700 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-amber-500 hover:z-10 focus:outline-none focus:ring-4 focus:ring-amber-500/50"
              >
                <img 
                  src={cat.image} 
                  alt={cat.label} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center transform transition-transform duration-300 group-hover:-translate-y-2">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider group-hover:text-amber-400">{cat.label}</h3>
                  <span className="text-xs text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 block">VER MENÚ →</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button 
                onClick={() => handleCategorySelect('all')}
                className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
            >
                Ver todo el menú <Icons.ArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: GRID DE PRODUCTOS */}
      <div ref={menuRef} className="bg-stone-50 py-12 min-h-screen">
        {/* Filtros Sticky */}
        <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm py-4 px-4 md:px-8 border-b border-stone-200 mb-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Categorías Scrolleables (scrollbar-hide) */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
                    <button onClick={() => {setCategoryFilter('all'); setCurrentPage(1);}} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${categoryFilter === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>Todo</button>
                    {CATEGORIES.map(cat => (
                        <button key={cat.id} onClick={() => {setCategoryFilter(cat.id); setCurrentPage(1);}} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${categoryFilter === cat.id ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>{cat.label}</button>
                    ))}
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-grow">
                        <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 bg-stone-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <div className="absolute left-3 top-2.5 text-stone-400"><Icons.Search /></div>
                    </div>
                </div>
            </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 flex-grow w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentItems.map(product => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 flex flex-col h-full hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
                <div className={`overflow-hidden relative ${isMobile ? 'h-64 aspect-square' : 'h-48'}`}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-stone-900 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        ${product.price.toLocaleString('es-AR')}
                    </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-stone-900 leading-tight mb-1">{product.name}</h3>
                    <p className="text-stone-500 text-xs mb-4 flex-grow leading-relaxed line-clamp-3">{product.description}</p>
                    <button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-stone-100 text-stone-900 font-bold py-2 rounded-lg hover:bg-stone-900 hover:text-white transition-colors text-sm active:scale-95 border border-stone-200 hover:border-stone-900"
                    >
                        AGREGAR +
                    </button>
                </div>
                </div>
            ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12 pb-12">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-3 rounded-full bg-white border border-stone-200 shadow hover:bg-stone-50 disabled:opacity-30"><Icons.ArrowLeft /></button>
                    <span className="font-bold text-stone-600">Página {currentPage} / {totalPages}</span>
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-3 rounded-full bg-white border border-stone-200 shadow hover:bg-stone-50 disabled:opacity-30"><Icons.ArrowRight /></button>
                </div>
            )}
            
            {currentItems.length === 0 && (
                <div className="text-center py-20 text-stone-400">
                    <p className="text-xl">No encontramos productos en esta categoría 🍔</p>
                    <button onClick={() => handleCategorySelect('all')} className="mt-4 text-amber-600 font-bold hover:underline">Ver todo</button>
                </div>
            )}
        </main>
      </div>

      {/* SECCIÓN 4: FOOTER (100vh) */}
      <footer className="relative h-screen bg-stone-900 flex flex-col justify-between overflow-hidden">
        {/* Fondo Social Personalizado */}
        <div className="absolute inset-0" style={{ 
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/footer%20contreburger%201.png?alt=media&token=5823de6d-6e79-4a5d-88bf-293f4467eef8')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3
        }} />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex-grow flex flex-col justify-center">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter drop-shadow-lg">
                SÍGUENOS EN <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">REDES SOCIALES</span>
            </h2>
            <p className="text-stone-300 text-xl mb-12 max-w-2xl mx-auto drop-shadow-md font-medium">
                Participa en nuestros sorteos, mira el detrás de escena de nuestras cocinas y comparte tu experiencia Contreburger.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <a href="#" className="flex items-center gap-3 px-8 py-4 bg-white text-stone-900 rounded-full font-bold text-lg hover:bg-amber-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl w-full md:w-auto justify-center">
                    <Icons.Instagram /> @contreburger
                </a>
                <a href="#" className="flex items-center gap-3 px-8 py-4 bg-black text-white border border-stone-800 rounded-full font-bold text-lg hover:bg-stone-800 transition-all transform hover:-translate-y-1 shadow-xl w-full md:w-auto justify-center">
                    <Icons.TikTok /> @contreburger
                </a>
            </div>
        </div>

        {/* Créditos del Creador - Ubicado en una barra inferior separada */}
        <div className="relative z-20 w-full bg-black/80 backdrop-blur-md py-4 text-center border-t border-stone-800">
            <a href="#" className="inline-flex items-center gap-2 text-stone-400 text-sm hover:text-white transition-colors">
                <Icons.Code /> Diseñado y Desarrollado por <span className="text-amber-400 font-bold">Erick Dev</span>
            </a>
            <p className="text-stone-600 text-[10px] mt-1">© {new Date().getFullYear()} Contreburger. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* FLOATING CART BTN (Modificado) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-slide-up">
          <button onClick={() => setIsCartOpen(true)} className="bg-amber-500 text-white h-16 w-16 md:w-auto md:px-6 md:h-14 rounded-full shadow-2xl flex items-center justify-center gap-3 hover:scale-110 hover:bg-amber-400 transition-all group">
            <div className="relative">
              <Icons.Cart />
              <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-amber-500">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            {/* Solo monto, sin paréntesis */}
            <span className="font-bold text-lg hidden md:block">${cartTotal.toLocaleString('es-AR')}</span>
          </button>
        </div>
      )}

      {/* MODAL CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-stone-900 text-white flex justify-between items-center">
              <h2 className="text-2xl font-bold">Tu Pedido</h2>
              <button onClick={() => setIsCartOpen(false)} className="hover:text-amber-500"><Icons.Close /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between border-b border-stone-100 pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt={item.name} />
                    <div>
                      <h4 className="font-bold text-stone-900">{item.name}</h4>
                      <p className="text-sm text-amber-700 font-bold">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                    </div>
                  </div>
                  <QuantityControl 
                    quantity={item.quantity} size="sm"
                    onIncrease={() => updateQuantity(item.id, 1)}
                    onDecrease={() => updateQuantity(item.id, -1)}
                  />
                </div>
              ))}
              {cart.length === 0 && <p className="text-center text-stone-500 py-8">El carrito está vacío :(</p>}
            </div>
            {cart.length > 0 && (
              <div className="p-6 bg-stone-100 border-t border-stone-200">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-stone-500 font-medium">Total Estimado</span>
                  <span className="text-3xl font-extrabold text-stone-900">${cartTotal.toLocaleString('es-AR')}</span>
                </div>
                <button onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-amber-600 transition-colors shadow-lg">CONTINUAR COMPRA</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL CHECKOUT */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsCheckoutOpen(false)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-stone-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-stone-900">Finalizar Pedido</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-stone-400 hover:text-stone-900"><Icons.Close /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
                {/* 1. Entrega */}
                <section>
                    <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wide mb-3">1. Tipo de Entrega</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setCheckoutData({...checkoutData, type: 'delivery'})} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${checkoutData.type === 'delivery' ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-stone-200 text-stone-400 hover:border-stone-300'}`}><Icons.Bike /><span className="font-bold">Delivery</span></button>
                        <button onClick={() => setCheckoutData({...checkoutData, type: 'pickup'})} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${checkoutData.type === 'pickup' ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-stone-200 text-stone-400 hover:border-stone-300'}`}><Icons.Store /><span className="font-bold">Retiro</span></button>
                    </div>
                </section>
                {/* 2. Datos */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wide mb-3">2. {checkoutData.type === 'delivery' ? 'Datos de Envío' : 'Datos de Contacto'}</h3>
                    <input type="text" placeholder="Tu Nombre Completo" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500" value={checkoutData.name} onChange={e => setCheckoutData({...checkoutData, name: e.target.value})} />
                    {checkoutData.type === 'delivery' && (
                        <div className="space-y-3 animate-fade-in">
                            <div className="grid grid-cols-3 gap-3">
                                <input type="text" placeholder="Calle" className="col-span-2 w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500" value={checkoutData.address} onChange={e => setCheckoutData({...checkoutData, address: e.target.value})} />
                                <input type="text" placeholder="Altura" className="col-span-1 w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500" value={checkoutData.number} onChange={e => setCheckoutData({...checkoutData, number: e.target.value})} />
                            </div>
                            <input type="text" placeholder="Entre calles (Opcional)" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500" value={checkoutData.crossStreets} onChange={e => setCheckoutData({...checkoutData, crossStreets: e.target.value})} />
                        </div>
                    )}
                </section>
                {/* 3. Pago */}
                <section>
                    <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wide mb-3">3. Forma de Pago</h3>
                    <div className="space-y-3">
                        <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${checkoutData.paymentMethod === 'mercadopago' ? 'border-amber-600 bg-amber-50' : 'border-stone-200'}`}>
                            <input type="radio" name="payment" className="accent-amber-600 w-5 h-5" onChange={() => setCheckoutData({...checkoutData, paymentMethod: 'mercadopago'})} />
                            <span className="font-bold text-stone-800">MercadoPago (Link / QR)</span>
                        </label>
                        <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${checkoutData.paymentMethod === 'efectivo' ? 'border-amber-600 bg-amber-50' : 'border-stone-200'}`}>
                            <input type="radio" name="payment" className="accent-amber-600 w-5 h-5" onChange={() => setCheckoutData({...checkoutData, paymentMethod: 'efectivo'})} />
                            <span className="font-bold text-stone-800">Efectivo</span>
                        </label>
                        {checkoutData.paymentMethod === 'efectivo' && checkoutData.type === 'delivery' && (
                            <div className="animate-fade-in pl-8">
                                <label className="text-xs text-stone-500 block mb-1">¿Con cuánto abonas? (Para el vuelto)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-stone-400">$</span>
                                    <input type="number" placeholder="Monto exacto..." className="w-full pl-7 p-3 bg-white border border-amber-600 rounded-xl focus:outline-none" value={checkoutData.cashAmount} onChange={e => setCheckoutData({...checkoutData, cashAmount: e.target.value})} />
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
            <div className="p-6 border-t border-stone-100 bg-stone-50">
                <button onClick={handleCheckout} disabled={!checkoutData.paymentMethod || !checkoutData.name || (checkoutData.type === 'delivery' && (!checkoutData.address || !checkoutData.number))} className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#20bd5a] transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Icons.Whatsapp /> ENVIAR PEDIDO A WHATSAPP
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}