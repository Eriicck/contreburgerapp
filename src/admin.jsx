import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- ICONOS DE ADMINISTRACIÓN ---
const AdminIcons = {
  Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Burger: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.1 2.2a2 2 0 0 0-1.8 1.1L7 9h10l-2.3-5.7a2 2 0 0 0-1.8-1.1h-1.8z"/><path d="m3 11 1.7 6.9a2 2 0 0 0 2 1.5h10.6a2 2 0 0 0 2-1.5L21 11H3z"/><path d="M5.6 20.3a2 2 0 0 0 1.8 1.1h9.2a2 2 0 0 0 1.8-1.1l.6-2.3H5l.6 2.3z"/></svg>,
  List: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>,
  Megaphone: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  Upload: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Logout: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
};

// --- DATOS INICIALES ---
const INITIAL_PRODUCTS = [
  { id: 1, name: "La Vikinga", category: "burgers", price: 8500, description: "Doble carne smasheada, cheddar, cebolla crispy y salsa nórdica.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "Contre Royal", category: "burgers", price: 9200, description: "180g de carne, bacon ahumado, huevo a la plancha y barbacoa.", image: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Veggie Roots", category: "burgers", price: 7800, description: "Medallón de lentejas, rúcula, tomates confitados y mayo de palta.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Cheese Bomb", category: "burgers", price: 8900, description: "Triple carne, triple cheddar, inyectada con salsa de queso.", image: "https://s3.eu-central-1.amazonaws.com/qatar-delicious/ItemsImages/ItemImage_36231_(0).jpg" },
  { id: 10, name: "Tequeños Clásicos (x6)", category: "tequenos", price: 4500, description: "Masa fina y crocante rellena de queso llanero.", image: "https://i0.wp.com/mosaicofrozen.com/wp-content/uploads/2022/01/tequenos-mosaico-frozen-3-1.jpg?fit=600%2C629&ssl=1" },
  { id: 11, name: "Tequeños Especiales (x6)", category: "tequenos", price: 5000, description: "Rellenos de queso y guayaba o chocolate.", image: "https://storage.ww-api.com/storage_api/v1/commerce_pict/3470081/1710004731146_3233168/tequeno-guayaba.jpeg" },
  { id: 20, name: "Empanada de Carne Mechada", category: "empanadas", price: 1500, description: "Carne cortada a cuchillo, jugosa y picante.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3gDwiaxDSAIkinV_1cqDznoKvTPq2n33biQ&s" },
  { id: 21, name: "Empanada de JyQ", category: "empanadas", price: 1400, description: "Jamón cocido natural y mozzarella.", image: "https://imag.bonviveur.com/empanadas-venezolanas-de-pollo.jpg" },
  { id: 30, name: "Coca Cola", category: "drinks", price: 2000, description: "Lata 354ml bien fría.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80" },
  { id: 31, name: "Cerveza IPA", category: "drinks", price: 3500, description: "Pinta artesanal 500ml.", image: "https://bruselasbeer.com/cdn/shop/files/Volfas_IPA_150bf91d-9443-472e-afb0-2c87254d5b05.jpg?v=1756164323" },
  { id: 32, name: "Agua Mineral", category: "drinks", price: 1500, description: "Con o sin gas 500ml.", image: "https://i.pinimg.com/1200x/a4/01/19/a40119e82b50611e73b1565d0fded827.jpg" },
  { id: 40, name: "Chocotorta", category: "desserts", price: 3000, description: "La clásica argentina, porción generosa.", image: "https://resizer.glanacion.com/resizer/v2/-4WVQEFLGJ5BWRK4WYRLC7PXI3M.jpg?auth=ac8e184e33278619c066a8c11de9711367c8e28b668eca48368ecd77664c00f3&width=1920&height=1282&quality=70&smart=true" },
  { id: 41, name: "Cheesecake", category: "desserts", price: 3500, description: "Con frutos rojos patagónicos.", image: "https://cdn.blog.paulinacocina.net/wp-content/uploads/2025/01/receta-de-cheesecake-1742898428.jpg" },
];

const INITIAL_CATEGORIES = [
  { id: 'burgers', label: 'Hamburguesas', image: 'https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/Hamburguesa_categoria_9_16.png?alt=media&token=77f54e8b-fb6e-4103-b430-bca8ec65c8d5' },
  { id: 'tequenos', label: 'Tequeños', image: 'https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/tequenos_9_16.png?alt=media&token=cfa1bcc7-0802-42b5-804e-79a6f5bdcfd2' },
  { id: 'empanadas', label: 'Empanadas', image: 'https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/empanadas_9_16.png?alt=media&token=b3fa27db-7945-47d2-b3c7-2bfccdb3c861' },
  { id: 'drinks', label: 'Bebidas', image: 'https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/CAtegoria_bebidas_2_9_16.png?alt=media&token=86af7b5d-4310-478b-a0bb-93efc6011e33' },
  { id: 'desserts', label: 'Postres', image: 'https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/3%20LECHES_9_16.png?alt=media&token=4316a794-d3a9-4c0e-b172-09837b9bf100' },
];

const INITIAL_MARQUEE = "🕰 Jueves a Domingos | 19:00 a 23:00 hrs • Envíos a todo Moreno • Pedí por WhatsApp y retira";

export default function Admin() {
  const navigate = useNavigate(); // Hook para navegación y logout
  
  // --- ESTADOS LOCALES ---
  const [activeTab, setActiveTab] = useState('products'); // products, categories, banner
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [marqueeText, setMarqueeText] = useState(INITIAL_MARQUEE);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado Sidebar
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Ajustado para móviles
  
  // Modal de Producto
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); 

  // --- LÓGICA DE PRODUCTOS ---
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCreateProduct = () => {
    setCurrentProduct({ id: Date.now(), name: '', price: '', category: 'burgers', description: '', image: '' });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const productToSave = { ...currentProduct, price: Number(currentProduct.price) };

    if (products.find(p => p.id === productToSave.id)) {
      setProducts(products.map(p => p.id === productToSave.id ? productToSave : p));
    } else {
      setProducts([...products, productToSave]);
    }
    setIsProductModalOpen(false);
  };

  // --- FUNCIÓN DE LOGOUT CORRECTA ---
  const handleLogout = () => {
    if (window.confirm("¿Deseas cerrar sesión?")) {
      localStorage.removeItem('contre_auth'); // Borra el token
      navigate('/login'); // Redirige al login usando el Router
    }
  };

  // --- LÓGICA DE PAGINACIÓN ---
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // --- LÓGICA DE IMAGEN ---
  const handleImageChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        setter(prev => ({ ...prev, image: imageUrl }));
    }
  };

  // --- COMPONENTE SIDEBAR ITEM ---
  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button 
      onClick={(e) => { 
        e.stopPropagation(); // Evita que se dispare el click del aside
        setActiveTab(id); 
        setIsMobileSidebarOpen(false); 
      }}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium whitespace-nowrap overflow-hidden z-20 relative
        ${activeTab === id ? 'bg-amber-600 text-white shadow-lg' : 'text-stone-400 hover:bg-stone-800 hover:text-white'}
      `}
      title={label}
    >
      <div className="min-w-[20px]"><Icon /></div>
      <span className={`transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 md:hidden group-hover:block'}`}>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-stone-50 font-sans text-stone-900 overflow-hidden relative">
      
      {/* SIDEBAR DESKTOP & MOBILE */}
      <aside 
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className={`fixed md:relative inset-y-0 left-0 z-30 bg-stone-900 flex flex-col p-3 shadow-xl transition-all duration-300 ease-in-out cursor-pointer group/sidebar
          ${isMobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${isSidebarExpanded ? 'md:w-64' : 'md:w-20'}
        `}
        title="Clic para expandir/contraer"
      >
        {/* Fondo con Patrón Vectorial (Igual al Frontend) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
        }} />

        <div className="relative z-10 flex flex-col h-full">
            {/* Header Sidebar */}
            <div className="mb-8 px-2 mt-4 flex items-center justify-between md:justify-center">
                <div className={`overflow-hidden transition-all duration-300 ${isSidebarExpanded ? 'w-full opacity-100' : 'w-0 opacity-0 md:w-auto md:opacity-100'}`}>
                    {/* Mostrar solo logo pequeño si está colapsado en desktop */}
                    {isSidebarExpanded || isMobileSidebarOpen ? (
                        <div>
                            <h1 className="text-xl font-extrabold text-white tracking-tight whitespace-nowrap">
                                CONTRE<span className="text-amber-500">ADMIN</span>
                            </h1>
                            <p className="text-stone-500 text-[10px]">v1.0</p>
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center font-bold text-stone-900 shadow-lg shadow-amber-500/20">C</div>
                    )}
                </div>
                {/* Botón Cerrar en Móvil */}
                <button onClick={(e) => { e.stopPropagation(); setIsMobileSidebarOpen(false); }} className="md:hidden text-stone-400 hover:text-white"><AdminIcons.X /></button>
            </div>
            
            {/* Menú */}
            <nav className="space-y-2 flex-grow">
                <SidebarItem id="products" label="Productos" icon={AdminIcons.Burger} />
                <SidebarItem id="categories" label="Categorías" icon={AdminIcons.List} />
                <SidebarItem id="banner" label="Cinta / Banner" icon={AdminIcons.Megaphone} />
            </nav>

            {/* Logout */}
            <div className="mt-auto pt-4 border-t border-stone-800 relative z-20">
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Evita que se dispare el click del aside
                        handleLogout();
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300`}
                    title="Cerrar Sesión"
                >
                    <div className="min-w-[20px]"><AdminIcons.Logout /></div>
                    <span className={`transition-opacity duration-300 whitespace-nowrap ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>Cerrar Sesión</span>
                </button>
            </div>
        </div>
      </aside>

      {/* Overlay para Móvil */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto relative w-full">
        {/* Header Superior */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsMobileSidebarOpen(true)} className="md:hidden text-stone-600 hover:text-stone-900">
                    <AdminIcons.Menu />
                </button>
                <h2 className="text-lg md:text-xl font-bold text-stone-800 capitalize truncate">
                    {activeTab === 'products' ? 'Productos' : activeTab === 'categories' ? 'Categorías' : 'Banner'}
                </h2>
            </div>
            <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                    <p className="text-sm font-bold text-stone-900">Erick Dev</p>
                    <p className="text-xs text-stone-500">Administrador</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold border border-amber-200">E</div>
            </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
            
            {/* VISTA PRODUCTOS */}
            {activeTab === 'products' && (
                <div className="space-y-6">
                    {/* Barra de Herramientas */}
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <input 
                                type="text" 
                                placeholder="Buscar..." 
                                className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm text-sm"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <div className="absolute left-3 top-3.5 text-stone-400"><AdminIcons.Search /></div>
                        </div>
                        <button onClick={handleCreateProduct} className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm">
                            <AdminIcons.Plus /> Nuevo
                        </button>
                    </div>

                    {/* Tabla de Productos (Desktop) y Cards (Mobile) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                        {/* Vista Desktop */}
                        <table className="w-full text-left hidden md:table">
                            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Producto</th>
                                    <th className="px-6 py-4 font-bold">Categoría</th>
                                    <th className="px-6 py-4 font-bold">Precio</th>
                                    <th className="px-6 py-4 font-bold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {currentProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-stone-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover shadow-sm bg-stone-100" />
                                                <div>
                                                    <p className="font-bold text-stone-900">{product.name}</p>
                                                    <p className="text-xs text-stone-500 truncate max-w-[200px]">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold border border-stone-200">
                                                {categories.find(c => c.id === product.category)?.label || product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-stone-900">
                                            ${product.price.toLocaleString('es-AR')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEditProduct(product)} className="p-2 bg-stone-50 hover:bg-amber-100 text-stone-500 hover:text-amber-700 rounded-lg transition-colors"><AdminIcons.Edit /></button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-stone-50 hover:bg-red-100 text-stone-500 hover:text-red-600 rounded-lg transition-colors"><AdminIcons.Trash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Vista Mobile (Cards) */}
                        <div className="md:hidden divide-y divide-stone-100">
                             {currentProducts.map(product => (
                                <div key={product.id} className="p-4 flex gap-4 items-start">
                                    <img src={product.image} alt="" className="w-20 h-20 rounded-xl object-cover shadow-sm bg-stone-100 flex-shrink-0" />
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-stone-900">{product.name}</h3>
                                            <span className="font-bold text-amber-600">${product.price.toLocaleString('es-AR')}</span>
                                        </div>
                                        <p className="text-xs text-stone-500 line-clamp-2 mb-2">{product.description}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[10px] bg-stone-100 px-2 py-1 rounded text-stone-500 uppercase font-bold">
                                                {categories.find(c => c.id === product.category)?.label}
                                            </span>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditProduct(product)} className="p-2 bg-stone-100 text-stone-600 rounded-lg"><AdminIcons.Edit /></button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-50 text-red-500 rounded-lg"><AdminIcons.Trash /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             ))}
                        </div>

                        {currentProducts.length === 0 && <div className="p-12 text-center text-stone-400">No hay productos.</div>}
                    </div>

                    {/* Controles de Paginación */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-stone-200">
                            <button onClick={prevPage} disabled={currentPage === 1} className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-stone-600 bg-stone-100 rounded-lg disabled:opacity-50 hover:bg-amber-100 transition-colors">
                                <AdminIcons.ChevronLeft /> Anterior
                            </button>
                            <span className="text-sm font-medium text-stone-500">
                                Página <span className="text-stone-900 font-bold">{currentPage}</span> de {totalPages}
                            </span>
                            <button onClick={nextPage} disabled={currentPage === totalPages} className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-stone-600 bg-stone-100 rounded-lg disabled:opacity-50 hover:bg-amber-100 transition-colors">
                                Siguiente <AdminIcons.ChevronRight />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* VISTA CATEGORÍAS */}
            {activeTab === 'categories' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(cat => (
                        <div key={cat.id} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex flex-col gap-4">
                            <div className="relative h-40 rounded-xl overflow-hidden group">
                                <img src={cat.image} className="w-full h-full object-cover" alt={cat.label} />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <label className="cursor-pointer bg-white text-stone-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-500 hover:text-white transition-colors flex items-center gap-2 shadow-lg">
                                        <AdminIcons.Upload /> Cambiar
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if(file) {
                                                const url = URL.createObjectURL(file);
                                                setCategories(categories.map(c => c.id === cat.id ? {...c, image: url} : c));
                                            }
                                        }}/>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg">{cat.label}</h3>
                                <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded">ID: {cat.id}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* VISTA BANNER */}
            {activeTab === 'banner' && (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
                        <div className="bg-stone-900 p-6 text-white">
                            <h3 className="text-xl font-bold flex items-center gap-2"><AdminIcons.Megaphone /> Editar Cinta</h3>
                        </div>
                        <div className="p-6 md:p-8">
                            <label className="block font-bold text-stone-700 mb-2">Texto del Anuncio</label>
                            <textarea 
                                rows="4"
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium text-stone-800"
                                value={marqueeText}
                                onChange={(e) => setMarqueeText(e.target.value)}
                            />
                            
                            <div className="mt-6 bg-amber-50 p-4 rounded-xl border border-amber-100">
                                <p className="text-xs font-bold text-amber-800 uppercase mb-2">Previsualización:</p>
                                <div className="overflow-hidden whitespace-nowrap bg-black py-2 px-4 rounded text-white text-xs font-bold">
                                    {marqueeText}
                                </div>
                            </div>

                            <button className="w-full mt-6 bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg flex justify-center items-center gap-2">
                                <AdminIcons.Check /> Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </main>

      {/* MODAL CREAR/EDITAR PRODUCTO */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in my-auto">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                    <h2 className="text-xl font-bold text-stone-900">{currentProduct.name ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                    <button onClick={() => setIsProductModalOpen(false)} className="text-stone-400 hover:text-stone-900"><AdminIcons.X /></button>
                </div>
                
                <form onSubmit={handleSaveProduct} className="p-6 md:p-8 overflow-y-auto space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Carga de Imagen */}
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-bold text-stone-700 mb-2">Imagen</label>
                            <div className="aspect-square rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center overflow-hidden relative group hover:border-amber-500 transition-colors">
                                {currentProduct.image ? (
                                    <img src={currentProduct.image} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="text-stone-400 text-center p-4">
                                        <AdminIcons.Upload />
                                        <span className="text-xs block mt-2">Subir Foto</span>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => handleImageChange(e, setCurrentProduct)}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="text-white text-xs font-bold">Cambiar</span>
                                </div>
                            </div>
                        </div>

                        {/* Campos de Texto */}
                        <div className="w-full md:w-2/3 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1">Nombre</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
                                    value={currentProduct.name}
                                    onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">Precio ($)</label>
                                    <input 
                                        required
                                        type="number" 
                                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
                                        value={currentProduct.price}
                                        onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">Categoría</label>
                                    <select 
                                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
                                        value={currentProduct.category}
                                        onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                                    >
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1">Descripción</label>
                                <textarea 
                                    rows="3"
                                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
                                    value={currentProduct.description}
                                    onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-stone-100 flex gap-4">
                        <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 py-3 font-bold text-stone-500 hover:bg-stone-100 rounded-xl transition-colors">Cancelar</button>
                        <button type="submit" className="flex-1 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-lg">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}