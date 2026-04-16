import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, onSnapshot, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions"; 


// --- 1. FIREBASE INITIALIZATION ---
const firebaseConfig = {
  apiKey: "AIzaSyCKSw-8lQFDrSUfSgE3uE6gPXH4KjwqRAs",
  authDomain: "contreburger-web.firebaseapp.com",
  projectId: "contreburger-web",
  storageBucket: "contreburger-web.firebasestorage.app",
  messagingSenderId: "108203474204",
  appId: "1:108203474204:web:b55475b2e2bf5cd46a4ed9"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// --- 2. CONSTANTES Y UTILIDADES ---
const WHATSAPP_NUMBER = "5491176612886";

const HEADER_IMAGES = [
  "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=2069&auto=format&fit=crop"
];

const Icons = {
  Cart: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Minus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>,
  Code: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Instagram: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  TikTok: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0-1 13.6 6.84 6.84 0 0 0 6.82-6.84V9.28a9 9 0 0 0 5-1.55z"/></svg>,
};

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

// --- COMPONENTE PRODUCTO CARD ---
function ProductCard({ product, isMobile, addToCart }) {
  const isOutOfStock = product.outOfStock === true;
  const isComingSoon = product.comingSoon === true;
  const isUnavailable = isOutOfStock || isComingSoon;
  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 flex flex-col h-full transition-all duration-300 ${isUnavailable ? '' : 'hover:-translate-y-2 hover:shadow-xl group'}`}>
      <div className={`overflow-hidden relative ${isMobile ? 'h-64 aspect-square' : 'h-48'}`}>
        <img 
          src={product.image} 
          alt={product.name}
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
          className={`w-full h-full object-cover transition-transform duration-700 select-none
            ${isUnavailable ? 'brightness-75' : 'group-hover:scale-110'}
            ${isOutOfStock ? 'grayscale' : ''}`} 
        />

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 backdrop-blur-[2px] w-full py-2.5 text-center transform -rotate-0">
              <span className="text-white font-bold text-sm tracking-widest uppercase">Sin stock hoy</span>
              <span className="block text-stone-300 text-[10px] mt-0.5 italic">¡Volvemos pronto! 🙏</span>
            </div>
          </div>
        )}
        {isComingSoon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <span className="text-2xl mb-1">👀</span>
            <span className="text-white font-bold text-sm tracking-widest uppercase">Próximamente</span>
            <span className="text-stone-300 text-[10px] mt-0.5 italic">¡Algo rico se viene! 🤫</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className={`text-lg font-bold leading-tight mb-1 ${isUnavailable ? 'text-stone-400' : 'text-stone-900'}`}>{product.name}</h3>
        <p className="text-stone-500 text-xs mb-4 flex-grow leading-relaxed line-clamp-3">{product.description}</p>
        {isOutOfStock ? (
          <div className="w-full bg-stone-100 text-stone-400 font-bold py-2 rounded-lg text-sm text-center border border-stone-200 cursor-not-allowed select-none">SIN STOCK HOY</div>
        ) : isComingSoon ? (
          <div className="w-full bg-amber-50 text-amber-600 font-bold py-2 rounded-lg text-sm text-center border border-amber-200 cursor-not-allowed select-none">MUY PRONTO ✨</div>
        ) : (
          <div className="flex items-center justify-between bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
            <span className="text-sm font-extrabold text-stone-900 px-3">${product.price.toLocaleString('es-AR')}</span>
            <button onClick={() => addToCart(product)} className="bg-stone-900 text-white font-bold py-2 px-4 text-xs flex items-center gap-1.5 hover:bg-amber-600 transition-colors active:scale-95 whitespace-nowrap">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Agregar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- LOGIN (MOCK) ---
function LoginPage({ onLoginSuccess }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-stone-100">
        <h2 className="text-3xl font-extrabold text-stone-900 text-center mb-2">Acceso a Contreburger</h2>
        <button onClick={onLoginSuccess} className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors shadow-lg mt-4">
          Ingresar al Panel
        </button>
      </div>
    </div>
  );
}

// --- ADMIN (MOCK) ---
function AdminPage({ setView }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-stone-900 mb-4">Panel de Administración</h1>
      <button onClick={() => setView('home')} className="w-full max-w-xs bg-stone-900 text-white font-bold py-3 rounded-xl hover:bg-stone-800 transition-colors shadow-sm">
        Volver a la Tienda
      </button>
    </div>
  );
}

// --- COMPONENTE TIENDA (EL DISEÑO VISUAL PRO) ---
function StorePage({ setView }) {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const menuRef = useRef(null);

  // DATOS REALES DE FIREBASE
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [marqueeText, setMarqueeText] = useState("Cargando...");
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // ESTADO DE MERCADOPAGO 
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const unsubProd = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
    });
    const unsubCats = onSnapshot(collection(db, "categories"), (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(c => !c.hidden).sort((a, b) => (a.order ?? 99) - (b.order ?? 99)));
    });
    const unsubSett = onSnapshot(doc(db, "settings", "main_settings"), (d) => {
       if(d.exists()) {
         setMarqueeText(d.data().marqueeText);
         setDeliveryCost(d.data().deliveryCost ?? 0);
       }
       else setMarqueeText("🕰 Jueves a Domingos | 19:00 a 23:00 hrs • Envíos a todo Moreno");
    });
    return () => { unsubProd(); unsubCats(); unsubSett(); };
  }, []);

  const [checkoutData, setCheckoutData] = useState({
    type: 'delivery', paymentMethod: '', cashAmount: '', name: '', address: '', number: '', crossStreets: ''
  });


/// 👇 AGREGA ESTA LÍNEA 👇
  const [paymentSuccess, setPaymentSuccess] = useState(null);

// 👇 👇 👇 NUEVO CÓDIGO: EL RECIBIDOR DE MERCADOPAGO 👇 👇 👇
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const paymentId = urlParams.get('payment_id');

    if (status === 'approved' && paymentId) {
      // Buscamos en la memoria del navegador el pedido que guardamos antes de ir a pagar
      const pedidoGuardado = JSON.parse(localStorage.getItem('ultimo_pedido_mp'));


    
      if (pedidoGuardado) {

        const orderNumber = `ORD-${paymentId.slice(-6).toUpperCase()}`;


        const { cart: carritoMP, checkoutData: clienteMP, totalConEnvio } = pedidoGuardado;
        const { type, name, address, number, crossStreets } = clienteMP;

        // Armamos el ticket para la distribuidora
        let mensaje = `✅ *¡NUEVO PEDIDO PAGADO CON MERCADOPAGO!* ✅\n\n`;
        mensaje += `*ID de Transacción:* ${paymentId}\n`;
        mensaje += `-----------------------------------\n`;
        
        carritoMP.forEach(item => {
          mensaje += `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString('es-AR')})\n`;
          if (item.note && item.note.trim()) mensaje += `  _(${item.note.trim()})_\n`;
        });

        mensaje += `-----------------------------------\n`;
        mensaje += `*TOTAL PAGADO:* $${totalConEnvio.toLocaleString('es-AR')}\n\n`;

        if (type === 'delivery') {
          mensaje += `🛵 *DELIVERY*\n👤 *Nombre:* ${name}\n📍 *Dirección:* ${address} ${number}\n`;
          if (crossStreets) mensaje += `🛣 *Entre calles:* ${crossStreets}\n`;
        } else {
          mensaje += `🏪 *RETIRO EN EL LOCAL*\n👤 *Nombre:* ${name}\n`;
        }


        ///REVISAR SI ESTA BIEN UBICADO 
        setPaymentSuccess({
          paymentId: paymentId,
          orderNumber: orderNumber,
          pedido: pedidoGuardado
        });




        // Vaciamos la memoria y limpiamos la URL para que no se reenvíe si refrescan la página
        localStorage.removeItem('ultimo_pedido_mp');
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Vaciamos el carrito de la página
        setCart([]);

        // Abrimos WhatsApp automáticamente (¡ACUÉRDATE DE CAMBIAR ESTE NÚMERO!)
        /// const numeroLocal = "5491176612886"; 
        /// window.open(`https://wa.me/${numeroLocal}?text=${encodeURIComponent(mensaje)}`, '_blank');
      }
    }
  }, []);
  // 👆 👆 👆 FIN DEL NUEVO CÓDIGO 👆 👆 👆

////////////////////////// 👇 NUEVO CÓDIGO: BLOQUEO DE SCROLL CUANDO EL CART SE ABRE 👇
useEffect(() => {
  if (paymentSuccess) {
    document.body.style.overflow = 'hidden'; // Bloquea el scroll
  } else {
    document.body.style.overflow = 'auto'; // Lo libera al cerrar
  }
}, [paymentSuccess]);

///// 👆 NUEVO CÓDIGO: BLOQUEO DE SCROLL CUANDO EL CART SE ABRE 👆


  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const itemsPerPage = isMobile ? 5 : 8;

  useEffect(() => {
    const interval = setInterval(() => setCurrentHeaderIndex(prev => (prev + 1) % HEADER_IMAGES.length), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentPage > 1) menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentPage]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, quantity: Math.max(0, item.quantity + delta) };
      return item;
    }).filter(item => item.quantity > 0));
  };

  const updateNote = (id, note) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, note } : item));
  };

  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.price * item.quantity), 0), [cart]);

  const handleCategorySelect = (catId) => {
    setCategoryFilter(catId);
    setSearchTerm("");
    setCurrentPage(1);
    menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    let items = products;
    if (categoryFilter !== 'all') items = items.filter(p => p.category === categoryFilter);
    if (searchTerm) items = items.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return [...items].sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'alpha-asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [searchTerm, categoryFilter, sortOption, products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);






  // LÓGICA DE CHECKOUT ACTUALIZADA PARA MERCADOPAGO
  const handleCheckout = async () => {
    const { type, paymentMethod, cashAmount, name, address, number, crossStreets } = checkoutData;
    const totalConEnvio = type === 'delivery' ? cartTotal + deliveryCost : cartTotal;

    // --- RUTA 1: EFECTIVO ---
    if (paymentMethod === 'efectivo') {
      const grouped = {};
      cart.forEach(item => {
        const catId = item.category || 'otros';
        if (!grouped[catId]) grouped[catId] = [];
        grouped[catId].push(item);
      });

      const catLabels = { burgers: '🍔 Hamburguesas', tequenos: '🧀 Tequeños', empanadas: '🥟 Empanadas', drinks: '🥤 Bebidas', desserts: '🍰 Postres', otros: '🍽 Otros' };
      const getCatLabel = (catId) => catLabels[catId] || `🍽 ${catId}`;

      let message = `*🍔 HOLA CONTREBURGER!*\n\nQuiero hacer un pedido 📋\n\n*MI PEDIDO:*\n`;

      Object.entries(grouped).forEach(([catId, items]) => {
        message += `\n*${getCatLabel(catId)}:*\n`;
        items.forEach(item => {
          message += `  - ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString('es-AR')})`;
          if (item.note && item.note.trim()) message += ` _(${item.note.trim()})_`;
          message += `\n`;
        });
      });

      message += `\n*SUBTOTAL: $${cartTotal.toLocaleString('es-AR')}*\n`;
      if (type === 'delivery') message += `🛵 *ENVÍO: $${deliveryCost.toLocaleString('es-AR')}*\n`;
      message += `*TOTAL: $${totalConEnvio.toLocaleString('es-AR')}*\n----------------------------\n`;

      if (type === 'delivery') {
        message += `🛵 *DELIVERY*\n👤 *Nombre:* ${name}\n📍 *Dirección:* ${address} ${number}\n`;
        if (crossStreets) message += `🛣 *Entre calles:* ${crossStreets}\n`;
      } else {
        message += `🏪 *RETIRO EN EL LOCAL*\n👤 *Nombre:* ${name}\n`;
      }

      message += `\n💳 *PAGO CON:* Efectivo`;
      if (type === 'delivery' && cashAmount) message += `\n💵 *ABONO CON:* $${cashAmount} (Calcular vuelto)`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      return; 
    }

    // --- RUTA 2: MERCADOPAGO ---
    if (paymentMethod === 'mercadopago') {
      setIsProcessingPayment(true); // Mostrar que está cargando
      
      try {

          
          // 👇 ESTO ES LO NUEVO: Guardamos el pedido completo en la mochila antes de irnos 👇
        const pedidoCompleto = { cart, checkoutData, totalConEnvio };
        localStorage.setItem('ultimo_pedido_mp', JSON.stringify(pedidoCompleto));
        // 👆 ------------------------------------------------------------------------- 👆

          // Ya no necesitas 'getFunctions' aquí, usa la 'functions' que importaste arriba
          const createPreference = httpsCallable(functions, 'createPreference');
        
        const result = await createPreference({
          cart: cart,
          deliveryCost: type === 'delivery' ? deliveryCost : 0,
          customerInfo: { name, address, number, type }
        });

        const data = result.data;
        
        if (data.init_point) {
          window.location.href = data.init_point; // Redirigir a pagar
        } else {
          alert("Error: No se recibió el link de pago.");
          setIsProcessingPayment(false);
        }

      } catch (error) {
        console.error("Error al conectar con MercadoPago:", error);
        alert("Ocurrió un error al procesar el pago. Por favor, intenta de nuevo o elige Efectivo.");
        setIsProcessingPayment(false);
      }
    }
  };

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
      `}</style>
      <div className="font-sans text-stone-900 bg-stone-50 min-h-screen">
        
        {/* HERO */}
        <section className="relative h-screen overflow-hidden bg-black flex flex-col">
          <div className="absolute top-0 left-0 right-0 z-20 bg-black/80 text-stone-200 py-2 text-xs md:text-sm font-bold tracking-widest uppercase backdrop-blur-sm border-b border-stone-800 overflow-hidden whitespace-nowrap">
              <div className="animate-marquee flex gap-12">
                  {[...Array(5)].map((_, i) => <span key={i}>{marqueeText}</span>)}
              </div>
          </div>

          {HEADER_IMAGES.map((img, index) => (
            <div key={index} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentHeaderIndex ? 'opacity-60' : 'opacity-0'}`} style={{ backgroundImage: `url(${img})` }} />
          ))}
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-white tracking-tight drop-shadow-2xl mb-6">
              CONTRE<span className="text-amber-500">BURGER</span>
            </h1>
            <p className="text-white text-base sm:text-xl md:text-3xl font-light tracking-widest drop-shadow-lg mb-8">SABOR QUE HACE HISTORIA</p>
            <div className="mt-8">
               <button onClick={() => menuRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg">VER MENÚ</button>
            </div>
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section className="relative min-h-screen bg-stone-900 flex flex-col justify-center py-12 px-4 md:px-8 overflow-hidden relative">
          <div className="absolute inset-0 z-0 overflow-hidden">
               <div className="absolute left-0 right-0 pointer-events-none" style={{ top: '-50%', height: '200%', backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '30px 30px', transform: `translateY(${scrollY * 0.15}px)`, opacity: 0.7 }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full h-full flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 uppercase tracking-tight">¿Qué te provoca <span className="text-amber-500">hoy?</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:h-[55vh]">
              {categories.map((cat) => {
                const isOutOfStock = cat.outOfStock === true;
                const isComingSoon = cat.comingSoon === true;
                const isUnavailable = isOutOfStock || isComingSoon;
                return (
                  <button key={cat.id} onClick={() => !isUnavailable && handleCategorySelect(cat.id)}
                    className={`group relative h-40 md:h-full rounded-2xl overflow-hidden border shadow-2xl transition-all duration-300 focus:outline-none
                      ${isUnavailable ? 'border-stone-700 cursor-default' : 'border-stone-700 hover:scale-[1.03] hover:border-amber-500 hover:z-10 focus:ring-2 focus:ring-amber-500/50'}`}>
                    <img 
                      src={cat.image} 
                      alt={cat.label}
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 opacity-60 select-none
                        ${isUnavailable ? 'grayscale brightness-50' : 'group-hover:scale-110 group-hover:opacity-80'}`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    {isComingSoon ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                        <span className="text-2xl mb-1">👀</span>
                        <h3 className="text-base font-extrabold text-white uppercase tracking-wide leading-tight">{cat.label}</h3>
                        <div className="mt-2 bg-amber-500/20 border border-amber-400/40 rounded-full px-3 py-0.5">
                          <span className="text-amber-300 text-[10px] font-bold uppercase tracking-widest">Muy pronto...</span>
                        </div>
                        <span className="text-stone-400 text-[10px] mt-1.5 italic">¡Algo rico se viene! 🤫</span>
                      </div>
                    ) : isOutOfStock ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                        <h3 className="text-base font-extrabold text-white uppercase tracking-wide leading-tight">{cat.label}</h3>
                        <div className="mt-2 bg-white/10 border border-white/20 rounded-full px-3 py-0.5">
                          <span className="text-white text-[10px] font-bold uppercase tracking-widest">Sin stock hoy</span>
                        </div>
                        <span className="text-stone-400 text-[10px] mt-1.5 italic">¡Volvemos pronto! 🙏</span>
                      </div>
                    ) : (
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 text-center transform transition-transform duration-300 group-hover:-translate-y-1">
                        <h3 className="text-base md:text-xl font-bold text-white uppercase tracking-wide group-hover:text-amber-400 leading-tight">{cat.label}</h3>
                        <span className="text-xs text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 block">VER MENÚ →</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="text-center mt-12">
              <button onClick={() => handleCategorySelect('all')} className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">Ver todo el menú <Icons.ArrowRight /></button>
            </div>
          </div>
        </section>

        {/* GRID DE PRODUCTOS */}
        <div ref={menuRef} className="bg-stone-50 py-12 min-h-screen">
          <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm py-4 px-4 md:px-8 border-b border-stone-200 mb-8">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
                      <button onClick={() => {setCategoryFilter('all'); setCurrentPage(1);}} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${categoryFilter === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>Todo</button>
                      {categories.filter(cat => cat.available !== false).map(cat => (
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
              {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {[1,2,3,4].map(i => <div key={i} className="h-64 bg-stone-200 animate-pulse rounded-2xl"></div>)}
                  </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentItems.map(product => (
                    <ProductCard key={product.id} product={product} isMobile={isMobile} addToCart={addToCart} />
                ))}
                </div>
              )}

              {/* Paginación */}
              {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12 pb-12">
                      <button aria-label="Página anterior" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-3 rounded-full bg-white border border-stone-200 shadow hover:bg-stone-50 disabled:opacity-30"><Icons.ArrowLeft /></button>
                      <span className="font-bold text-stone-600">Página {currentPage} / {totalPages}</span>
                      <button aria-label="Página siguiente" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-3 rounded-full bg-white border border-stone-200 shadow hover:bg-stone-50 disabled:opacity-30"><Icons.ArrowRight /></button>
                  </div>
              )}
              
              {!isLoading && currentItems.length === 0 && (
                  <div className="text-center py-20 text-stone-400">
                      <p className="text-xl">No encontramos productos en esta categoría 🍔</p>
                      <button onClick={() => handleCategorySelect('all')} className="mt-4 text-amber-600 font-bold hover:underline">Ver todo</button>
                  </div>
              )}
          </main>
        </div>

        {/* FOOTER */}
        <footer className="relative h-screen bg-stone-900 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/footer%20contreburger%201.jpg?alt=media&token=b36ba75c-df03-4569-adc8-d189d30675ce')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 }} />
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex-grow flex flex-col justify-center">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter drop-shadow-lg">SÍGUENOS EN <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">REDES SOCIALES</span></h2>
              <p className="text-stone-300 text-xl mb-12 max-w-2xl mx-auto drop-shadow-md font-medium">Participa en nuestros sorteos, mira el detrás de escena de nuestras cocinas y comparte tu experiencia Contreburger.</p>
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                  <a href="https://www.instagram.com/contreburger" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-8 py-4 bg-white text-stone-900 rounded-full font-bold text-lg hover:bg-amber-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl w-full md:w-auto justify-center"><Icons.Instagram /> @contreburger</a>
                  <a href="#" className="flex items-center gap-3 px-8 py-4 bg-black text-white border border-stone-800 rounded-full font-bold text-lg hover:bg-stone-800 transition-all transform hover:-translate-y-1 shadow-xl w-full md:w-auto justify-center"><Icons.TikTok /> @contreburger</a>
              </div>
          </div>
          <div className="relative z-20 w-full bg-black/80 backdrop-blur-md py-4 text-center border-t border-stone-800">
              <button onClick={() => setView('login')} className="inline-flex items-center gap-2 text-stone-400 text-sm hover:text-white transition-colors cursor-default"><Icons.Code /> Diseñado y Desarrollado por <span className="text-amber-400 font-bold cursor-pointer">Erick Dev</span></button>
              <p className="text-stone-600 text-[10px] mt-1">© {new Date().getFullYear()} Contreburger. Todos los derechos reservados.</p>
          </div>
        </footer>

        {/* FLOATING CART */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40 animate-slide-up">
            <button onClick={() => setIsCartOpen(true)} className="bg-amber-500 text-white h-16 w-16 md:w-auto md:px-6 md:h-14 rounded-full shadow-2xl flex items-center justify-center gap-3 hover:scale-110 hover:bg-amber-400 transition-all group">
              <div className="relative"><Icons.Cart /><span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-amber-500">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span></div>
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
                  <div key={item.id} className="border-b border-stone-100 pb-3 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img 
                            src={item.image} 
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0 select-none" 
                            alt={item.name} 
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-stone-900 text-sm">{item.name}</h4>
                          </div>
                          <p className="text-sm text-amber-700 font-bold">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                          {!item.note && (
                            <button onClick={() => updateNote(item.id, ' ')} className="text-[11px] text-stone-400 hover:text-amber-600 transition-colors underline underline-offset-2">
                              + Aclaración
                            </button>
                          )}
                        </div>
                      </div>
                      <QuantityControl quantity={item.quantity} size="sm" onIncrease={() => updateQuantity(item.id, 1)} onDecrease={() => updateQuantity(item.id, -1)} />
                    </div>
                    {item.note && (
                      <div className="flex items-center gap-2 mt-1 ml-1">
                        <input
                          autoFocus
                          type="text"
                          maxLength={40}
                          placeholder="Ej: sin cebolla, extra salsa..."
                          className="flex-1 text-xs p-2 bg-stone-50 border border-amber-300 rounded-lg focus:outline-none focus:border-amber-500 text-stone-700 placeholder:text-stone-400"
                          value={item.note.trimStart()}
                          onChange={e => updateNote(item.id, e.target.value)}
                        />
                        <button onClick={() => updateNote(item.id, null)} className="text-stone-400 hover:text-red-400 text-xs font-bold px-1 transition-colors">✕</button>
                      </div>
                    )}
                  </div>
                ))}
                {cart.length === 0 && <p className="text-center text-stone-500 py-8">El carrito está vacío :(</p>}
              </div>
              {cart.length > 0 && (
                <div className="p-6 bg-stone-100 border-t border-stone-200">
                  <div className="flex justify-between items-center mb-4"><span className="text-stone-500 font-medium">Subtotal</span><span className="text-2xl font-extrabold text-stone-900">${cartTotal.toLocaleString('es-AR')}</span></div>
                  <button onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-amber-600 transition-colors shadow-lg mb-2">CONTINUAR COMPRA</button>
                  <button onClick={() => setIsCartOpen(false)} className="w-full py-2.5 text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors border border-amber-200">🛒 Seguir agregando</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL CHECKOUT */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm" onClick={() => setIsCheckoutOpen(false)}>
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col" style={{maxHeight: '88vh'}} onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-stone-100 flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold text-stone-900">Finalizar Pedido</h2>
                <button onClick={() => setIsCheckoutOpen(false)} className="text-stone-400 hover:text-stone-900"><Icons.Close /></button>
              </div>
              <div className="p-4 overflow-y-auto space-y-4 flex-1">
                  <section>
                      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">1. Tipo de Entrega</h3>
                      <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => setCheckoutData({...checkoutData, type: 'delivery'})} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${checkoutData.type === 'delivery' ? 'border-amber-600 bg-amber-50' : 'border-stone-200 text-stone-400 hover:border-stone-300'}`}>
                            <span style={{fontSize:'28px',lineHeight:1}}>🛵</span>
                            <span className={`font-bold text-sm ${checkoutData.type === 'delivery' ? 'text-amber-700' : ''}`}>Delivery</span>
                            <span className={`text-xs font-bold ${checkoutData.type === 'delivery' ? 'text-amber-600' : 'text-stone-400'}`}>+${deliveryCost.toLocaleString('es-AR')}</span>
                          </button>
                          <button onClick={() => setCheckoutData({...checkoutData, type: 'pickup'})} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${checkoutData.type === 'pickup' ? 'border-amber-600 bg-amber-50' : 'border-stone-200 text-stone-400 hover:border-stone-300'}`}>
                            <span style={{fontSize:'28px',lineHeight:1}}>🏪</span>
                            <span className={`font-bold text-sm ${checkoutData.type === 'pickup' ? 'text-amber-700' : ''}`}>Retiro en local</span>
                            <span className={`text-xs font-bold ${checkoutData.type === 'pickup' ? 'text-green-600' : 'text-stone-400'}`}>GRATIS</span>
                          </button>
                      </div>
                  </section>
                  <section className="space-y-2">
                      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">2. {checkoutData.type === 'delivery' ? 'Datos de Envío' : 'Datos de Contacto'}</h3>
                      <input type="text" placeholder="Tu Nombre Completo" className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 text-sm" value={checkoutData.name} onChange={e => setCheckoutData({...checkoutData, name: e.target.value})} />
                      {checkoutData.type === 'delivery' && (
                          <div className="space-y-2 animate-fade-in">
                              <div className="grid grid-cols-3 gap-2">
                                  <input type="text" placeholder="Calle" className="col-span-2 w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 text-sm" value={checkoutData.address} onChange={e => setCheckoutData({...checkoutData, address: e.target.value})} />
                                  <input type="text" placeholder="Altura" className="col-span-1 w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 text-sm" value={checkoutData.number} onChange={e => setCheckoutData({...checkoutData, number: e.target.value})} />
                              </div>
                              <input type="text" placeholder="Entre calles (Opcional)" className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 text-sm" value={checkoutData.crossStreets} onChange={e => setCheckoutData({...checkoutData, crossStreets: e.target.value})} />
                          </div>
                      )}
                  </section>
                  <section>
                      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">3. Forma de Pago</h3>
                      <div className="space-y-2">
                          <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${checkoutData.paymentMethod === 'mercadopago' ? 'border-amber-600 bg-amber-50' : 'border-stone-200'}`}>
                              <input type="radio" name="payment" className="accent-amber-600 w-4 h-4" onChange={() => setCheckoutData({...checkoutData, paymentMethod: 'mercadopago'})} />
                              <span className="font-bold text-stone-800 text-sm">MercadoPago</span>
                          </label>
                          <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${checkoutData.paymentMethod === 'efectivo' ? 'border-amber-600 bg-amber-50' : 'border-stone-200'}`}>
                              <input type="radio" name="payment" className="accent-amber-600 w-4 h-4" onChange={() => setCheckoutData({...checkoutData, paymentMethod: 'efectivo'})} />
                              <span className="font-bold text-stone-800 text-sm">Efectivo</span>
                          </label>
                          {checkoutData.paymentMethod === 'efectivo' && checkoutData.type === 'delivery' && (
                              <div className="animate-fade-in pl-6">
                                  <label className="text-xs text-stone-500 block mb-1">¿Con cuánto abonas? (Para el vuelto)</label>
                                  <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-stone-400">$</span>
                                      <input type="number" placeholder="Monto exacto..." className="w-full pl-7 p-2.5 bg-white border border-amber-600 rounded-xl focus:outline-none text-sm" value={checkoutData.cashAmount} onChange={e => setCheckoutData({...checkoutData, cashAmount: e.target.value})} />
                                  </div>
                              </div>
                          )}
                      </div>
                  </section>
              </div>
              <div className="p-3 border-t border-stone-100 bg-stone-50 space-y-2 shrink-0">
                {/* RESUMEN DE COSTOS */}
                <div className="bg-white rounded-xl border border-stone-200 px-4 py-2.5 space-y-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="font-bold text-stone-700">${cartTotal.toLocaleString('es-AR')}</span>
                  </div>
                  {checkoutData.type === 'delivery' ? (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-stone-500">🛵 Envío</span>
                      <span className="font-bold text-amber-700">${deliveryCost.toLocaleString('es-AR')}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-stone-500">🏪 Envío</span>
                      <span className="font-bold text-green-600">GRATIS</span>
                    </div>
                  )}
                  <div className="border-t border-stone-100 pt-1.5 flex justify-between items-center">
                    <span className="font-bold text-stone-800 text-sm">Total</span>
                    <span className="text-xl font-extrabold text-stone-900">
                      ${(checkoutData.type === 'delivery' ? cartTotal + deliveryCost : cartTotal).toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
                
                {/* BOTÓN MÁGICO DE PAGO */}
                <button 
                  onClick={handleCheckout} 
                  disabled={isProcessingPayment || !checkoutData.paymentMethod || !checkoutData.name || (checkoutData.type === 'delivery' && (!checkoutData.address || !checkoutData.number))} 
                  className="w-full bg-stone-900 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm flex justify-center items-center gap-2"
                >
                  {isProcessingPayment ? (
                    <> <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> PROCESANDO PAGO... </>
                  ) : (
                    checkoutData.paymentMethod === 'mercadopago' ? 'PAGAR CON MERCADOPAGO 💳' : 'ENVIAR PEDIDO POR WHATSAPP 🚀'
                  )}
                </button>

                <div className="flex gap-2">
                  <button onClick={() => { setIsCheckoutOpen(false); setIsCartOpen(true); }} className="flex-1 py-2 text-xs font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors">
                    ← Volver
                  </button>
                  <button onClick={() => { setIsCheckoutOpen(false); setIsCartOpen(false); }} className="flex-1 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors border border-amber-200">
                    🛒 Seguir agregando
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}////// FIN MODAL CHECKOUT


{/* 👇 CARTEL VISUAL DE PAGO EXITOSO 👇 */}
      {paymentSuccess && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', textAlign: 'center', maxWidth: '400px', width: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>✅</div>
            <h2 style={{ color: '#4CAF50', marginBottom: '5px', fontSize: '24px' }}>¡Pago Exitoso!</h2>
            <p style={{ color: '#333', fontSize: '16px', marginBottom: '10px' }}>Tu orden <strong>{paymentSuccess.orderNumber}</strong> está confirmada.</p>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '25px' }}>Comprobante MP: {paymentSuccess.paymentId}</p>

            <button


////////// Aquí es donde ocurre la magia del mensaje de WhatsApp
onClick={() => {
  const { cart: carritoMP, checkoutData: clienteMP, totalConEnvio } = paymentSuccess.pedido;
  const { type, name, address, number, crossStreets } = clienteMP;

  // Armamos el mensaje con un tono más amigable
  let mensaje = `🍔 *¡Hola Contreburger!* 👋%0A%0A`;
  mensaje += `Acabo de realizar un pedido y ya realicé el pago online. ✅%0A%0A`;
  mensaje += `📍 *Orden:* ${paymentSuccess.orderNumber}%0A`;
  mensaje += `💳 *Comprobante MP:* ${paymentSuccess.paymentId}%0A`;
  mensaje += `-----------------------------------%0A`;
  
  carritoMP.forEach(item => {
    mensaje += `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString('es-AR')})%0A`;
    if (item.note && item.note.trim()) mensaje += `   _(${item.note.trim()})_%0A`;
  });

  mensaje += `-----------------------------------%0A`;
  mensaje += `💰 *TOTAL PAGADO:* $${totalConEnvio.toLocaleString('es-AR')}%0A%0A`;

  if (type === 'delivery') {
    mensaje += `🛵 *MODO:* Envío a domicilio%0A`;
    mensaje += `👤 *Nombre:* ${name}%0A`;
    mensaje += `🏠 *Dirección:* ${address} ${number}%0A`;
    if (crossStreets) mensaje += `🛣 *Entre calles:* ${crossStreets}%0A`;
  } else {
    mensaje += `🏪 *MODO:* Retiro en el local%0A`;
    mensaje += `👤 *Nombre:* ${name}%0A`;
  }

  mensaje += `%0A🙏 *¡Muchas gracias!*`;

  // Usamos WHATSAPP_NUMBER que ya definiste arriba
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, '_blank');
  
  // Cerramos el cartel
  setPaymentSuccess(null);
}}
             

              style={{ backgroundColor: '#25D366', color: 'white', padding: '15px 20px', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
            >
               📲 Enviar pedido al Local
            </button>
          </div>
        </div>
      )}
      {/* 👆 FIN DEL CARTEL DE ÉXITO 👆 */}




      </div>
    </>
  );
}

// ====== 🚀 INICIO DEL COMPONENTE RAÍZ (APP) 🚀 ======
export default function App() {
  const [view, setView] = useState('home'); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (view === 'admin' && !user) return <LoginPage onLoginSuccess={() => setView('admin')} />;
  if (view === 'login' && user) {
     setView('admin');
     return null;
  }

  return (
    <>
      {view === 'home' && <StorePage setView={setView} />}
      {view === 'login' && <LoginPage onLoginSuccess={() => setView('admin')} />}
      {view === 'admin' && <AdminPage setView={setView} />}
    </>
  );
}