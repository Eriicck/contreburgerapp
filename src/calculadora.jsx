import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  Banknote, 
  Plus, 
  Trash2, 
  Save, 
  Menu, 
  X,
  Calculator,
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  BarChart3,
  Calendar,
  Edit2,
  TrendingUp,
  Target,
  Eye,
  Settings,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Scale,
  RefreshCw,
  Box,
  CheckSquare,
  Square
} from 'lucide-react';

// --- Estilos Globales (Tema Claro Moderno) ---
const bgPatternStyle = {
  background: `
    radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 100% 0%, rgba(249, 115, 22, 0.08) 0%, transparent 40%),
    linear-gradient(to bottom right, #f1f5f9, #e2e8f0)
  `,
  minHeight: '100vh'
};

const noSpinnerClass = "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

// --- Componentes UI Reutilizables ---

const Card = ({ children, className = "" }) => (
  // Tarjetas blancas con sombra suave sobre fondo gris (efecto "hoja de papel")
  <div className={`bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 shadow-lg shadow-slate-200/50 ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, variant = "primary", className = "", size = "md", disabled = false, title="" }) => {
  const baseStyle = "rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };
  const variants = {
    // Naranja vibrante para acciones principales
    primary: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] border border-orange-500/20",
    // Botones secundarios más visibles en tema claro
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)]",
    ghost: "hover:bg-slate-100 text-slate-500 hover:text-slate-800"
  };
  return (
    <button onClick={onClick} disabled={disabled} title={title} className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const CleanInput = ({ label, type = "text", value, onChange, placeholder, className = "" }) => {
  const handleChange = (e) => {
    const val = e.target.value;
    if (type === 'number') {
      onChange(val === '' ? '' : parseFloat(val));
    } else {
      onChange(val);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full`}>
      {label && <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold ml-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        // Input claro: fondo blanco o gris muy suave, texto oscuro
        className={`w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 focus:outline-none placeholder:text-slate-400 text-sm font-semibold transition-all ${type === 'number' ? noSpinnerClass : ''} ${className}`}
      />
    </div>
  );
};

const Badge = ({ children, color = "slate" }) => {
  const colors = {
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
    red: "bg-red-50 text-red-600 border-red-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200"
  };
  return (
    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border ${colors[color]}`}>
      {children}
    </span>
  );
};

// --- Funciones Auxiliares ---
const formatCurrency = (amount) => {
  if (amount === '' || amount === null || amount === undefined) return '$ 0';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatNumber = (amount) => {
  if (amount === '' || amount === null || amount === undefined) return '0';
  return new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0
  }).format(amount);
};

// --- Gráfico SVG Curvo (Adaptado a Tema Claro) ---
const SmoothAreaChart = ({ data, targetDaily }) => {
    if (!data || data.length < 2) return <div className="h-48 flex items-center justify-center text-slate-400 text-sm font-medium">Necesitas al menos 2 días de ventas</div>;

    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-10);
    const values = sortedData.map(d => d.amount);
    const maxVal = Math.max(...values, targetDaily * 1.2); 
    const minVal = 0;
    
    const width = 100;
    const height = 50;
    const padding = 6; 

    const getX = (index) => (index / (sortedData.length - 1)) * (width - padding * 2) + padding;
    const getY = (value) => height - padding - ((value - minVal) / (maxVal - minVal)) * (height - padding * 2);

    let pathD = `M ${getX(0)} ${getY(values[0])}`;
    for (let i = 0; i < sortedData.length - 1; i++) {
        const x0 = getX(i);
        const y0 = getY(values[i]);
        const x1 = getX(i + 1);
        const y1 = getY(values[i + 1]);
        const cp1x = x0 + (x1 - x0) / 2;
        const cp1y = y0;
        const cp2x = x1 - (x1 - x0) / 2;
        const cp2y = y1;
        pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1} ${y1}`;
    }
    const areaPathD = `${pathD} L ${getX(sortedData.length - 1)} ${height} L ${getX(0)} ${height} Z`;
    const targetY = getY(targetDaily);

    return (
        <div className="relative w-full h-64 select-none">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4"/> {/* Azul más fuerte para fondo claro */}
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                    </linearGradient>
                </defs>
                {targetDaily > 0 && (
                  <>
                    <line x1="0" y1={targetY} x2="100" y2={targetY} stroke="#94a3b8" strokeOpacity="0.5" strokeWidth="0.5" strokeDasharray="2"/>
                    <text x="0" y={targetY - 2} fill="#64748b" fontSize="2.5" className="font-sans font-bold">Meta: {formatCurrency(targetDaily)}</text>
                  </>
                )}
                <path d={areaPathD} fill="url(#gradient)" />
                <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                {sortedData.map((d, i) => {
                    const x = getX(i);
                    const y = getY(d.amount);
                    const isPeak = (i === 0 || d.amount >= values[i-1]) && (i === sortedData.length - 1 || d.amount >= values[i+1]);
                    const showLabel = isPeak || i === sortedData.length - 1;
                    return (
                        <g key={i}>
                            <circle cx={x} cy={y} r="1.5" fill="#f8fafc" stroke="#2563eb" strokeWidth="0.8" />
                            {showLabel && (
                                <text x={x} y={y - 4} fill="#1e293b" fontSize="3" fontWeight="bold" textAnchor="middle" className="font-sans">
                                    {formatNumber(d.amount)}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
                {sortedData.map((d, i) => (
                    <span key={i} className="hidden md:inline-block font-mono">{d.date.slice(5)}</span>
                ))}
            </div>
        </div>
    );
};

// --- Paginación ---
const PaginatedList = ({ items, renderItem, itemsPerPage = 5, className = "space-y-3 mb-4" }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (items.length === 0) return <p className="text-slate-400 text-sm italic text-center py-4">No hay elementos registrados.</p>;

    return (
        <div>
            <div className={className}>{currentItems.map(renderItem)}</div>
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-30 transition-all shadow-sm"><ChevronLeft size={16} /></button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i + 1} onClick={() => paginate(i + 1)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${currentPage === i + 1 ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{i + 1}</button>
                    ))}
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-30 transition-all shadow-sm"><ChevronRight size={16} /></button>
                </div>
            )}
        </div>
    );
};

// --- Datos Iniciales ---
const initialSupplies = [
  { id: 's1', name: 'Carne Roast Beef', unit: 'kg', quantity: 1, cost: 6500, category: 'Alimentos' },
  { id: 's2', name: 'Pan de Papa', unit: 'u', quantity: 12, cost: 4800, category: 'Alimentos' },
  { id: 's3', name: 'Cheddar Fetas', unit: 'u', quantity: 196, cost: 18000, category: 'Alimentos' },
];
const initialProducts = [
  { id: 'p1', name: "Contre Doble", price: 9500, category: 'Hamburguesas', recipe: [{ supplyId: 's1', quantity: 0.24 }, { supplyId: 's2', quantity: 1 }, { supplyId: 's3', quantity: 4 }] }
];
const initialFixedCosts = [
  { id: 1, name: 'Alquiler', cost: 400000 },
  { id: 2, name: 'Sueldos', cost: 850000 },
  { id: 3, name: 'Servicios', cost: 120000 },
];
const initialSales = [
    { id: 1, date: '2023-10-20', amount: 150000 },
    { id: 2, date: '2023-10-21', amount: 220000 },
    { id: 3, date: '2023-10-22', amount: 180000 },
];
const defaultCategories = ['Alimentos', 'Bebidas', 'Papelería', 'Limpieza'];
const unitOptions = ['u', 'kg', 'g', 'porcion', 'l', 'ml', 'paq', 'docena'];

// --- Vistas ---

const SuppliesView = ({ supplies, setSupplies, categories, setCategories }) => {
    const [editingId, setEditingId] = useState(null);
    const [formState, setFormState] = useState({ name: '', unit: 'u', quantity: 1, cost: '', category: 'Alimentos' });
    const [openCategories, setOpenCategories] = useState({});

    useEffect(() => {
        if (categories.length > 0) setOpenCategories({ [categories[0]]: true });
    }, [categories]);

    const toggleCategory = (category) => setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));

    const handleSubmit = () => {
        if (!formState.name || formState.cost === '') return;
        const safeQuantity = Number(formState.quantity) > 0 ? Number(formState.quantity) : 1;
        
        if (editingId) {
            setSupplies(supplies.map(s => s.id === editingId ? { ...formState, id: editingId, cost: Number(formState.cost), quantity: safeQuantity } : s));
            setEditingId(null);
        } else {
            setSupplies([...supplies, { ...formState, id: Date.now().toString(), cost: Number(formState.cost), quantity: safeQuantity }]);
        }
        setFormState({ name: '', unit: 'u', quantity: 1, cost: '', category: 'Alimentos' });
    };

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setFormState({ name: item.name, unit: item.unit, quantity: item.quantity || 1, cost: item.cost, category: item.category });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        if (val === '__NEW__') {
            const newCat = prompt("Nombre de la nueva categoría:");
            if (newCat) {
                if (!categories.includes(newCat)) setCategories([...categories, newCat]);
                setFormState({ ...formState, category: newCat });
                setOpenCategories(prev => ({...prev, [newCat]: true}));
            }
        } else {
            setFormState({ ...formState, category: val });
        }
    };

    const groupedSupplies = useMemo(() => {
        return supplies.reduce((acc, item) => {
            (acc[item.category] = acc[item.category] || []).push(item);
            return acc;
        }, {});
    }, [supplies]);

    const allCategoriesToShow = [...new Set([...categories, ...Object.keys(groupedSupplies)])];

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-end">
                <div><h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight drop-shadow-sm">Insumos</h2><p className="text-slate-500 text-sm font-medium ml-1">Control de materia prima</p></div>
            </div>

            <Card className={editingId ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20' : ''}>
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center gap-2">{editingId ? <Edit2 size={14}/> : <Plus size={14}/>} {editingId ? 'Editar Item' : 'Agregar Nuevo'}</h3>
                    {editingId && <button onClick={() => { setEditingId(null); setFormState({ name: '', unit: 'u', quantity: 1, cost: '', category: 'Alimentos' }); }} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Cancelar</button>}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-12 gap-4 items-start">
                    {/* Nombre */}
                    <div className="col-span-2 md:col-span-3">
                        <CleanInput label="Nombre" value={formState.name} onChange={val => setFormState({...formState, name: val})} />
                    </div>

                    {/* Categoría */}
                    <div className="col-span-1 md:col-span-3 flex flex-col gap-1.5 w-full">
                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold ml-1">Categoría</label>
                        <select value={formState.category} onChange={handleCategoryChange} className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-orange-500 transition-all font-semibold">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            <option value="__NEW__" className="font-bold text-orange-600">+ CREAR NUEVA</option>
                        </select>
                    </div>
                    
                    {/* Cantidad Envase (Angosto) */}
                    <div className="col-span-1 md:col-span-1">
                        <CleanInput label="Cant." type="number" value={formState.quantity} onChange={val => setFormState({...formState, quantity: val})} placeholder="1" className="text-center" />
                    </div>

                    {/* Unidad */}
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5 w-full">
                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold ml-1">Unidad</label>
                        <select value={formState.unit} onChange={e => setFormState({...formState, unit: e.target.value})} className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-orange-500 transition-all font-semibold">
                            {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                    
                    {/* Costo */}
                    <div className="col-span-1 md:col-span-2">
                        <CleanInput label="Costo Total" type="number" value={formState.cost} onChange={val => setFormState({...formState, cost: val})} placeholder="$ Total" />
                    </div>
                    
                    {/* Botón */}
                    <div className="col-span-2 md:col-span-1 flex flex-col justify-end">
                        <div className="h-[21px] mb-1.5 hidden md:block"></div> 
                        <Button onClick={handleSubmit} variant={editingId ? "success" : "primary"} className="h-[46px] shadow-lg w-full">{editingId ? <Save size={18}/> : <Plus size={18}/>}</Button>
                    </div>
                </div>
            </Card>

            <div className="space-y-4">
                {allCategoriesToShow.map((category) => {
                    const items = groupedSupplies[category] || [];
                    const isOpen = openCategories[category];
                    if (items.length === 0 && !categories.includes(category)) return null;

                    return (
                        <div key={category} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                            <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3"><h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{category}</h3><span className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded-full text-slate-600">{items.length}</span></div>
                                {isOpen ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
                            </button>
                            
                            {isOpen && (
                                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                                    <PaginatedList items={items} itemsPerPage={15} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3" renderItem={(item) => {
                                        const unitPrice = item.cost / (item.quantity || 1);
                                        return (
                                            <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col justify-between group hover:border-orange-300 hover:shadow-md transition-all h-full">
                                                <div className="flex items-start gap-2 mb-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div><h4 className="font-bold text-slate-800 text-xs leading-tight">{item.name}</h4></div>
                                                <div className="flex flex-col gap-1 mt-auto pt-2 border-t border-slate-100">
                                                    <div className="flex justify-between items-baseline">
                                                        <span className="text-[10px] text-slate-400">Total:</span>
                                                        <span className="text-[10px] font-bold text-slate-700">{formatCurrency(item.cost)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-baseline">
                                                        <span className="text-[9px] text-slate-400 flex items-center gap-1"><Box size={8}/> x{item.quantity || 1}{item.unit}</span>
                                                        {/* Precio unitario destacado */}
                                                        <span className="text-[10px] font-mono font-bold text-orange-600">{formatCurrency(unitPrice)}/{item.unit}</span>
                                                    </div>
                                                    <div className="flex gap-1 justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEditClick(item)} className="p-1 rounded bg-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Edit2 size={12}/></button>
                                                        <button onClick={() => setSupplies(supplies.filter(s => s.id !== item.id))} className="p-1 rounded bg-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 size={12}/></button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }}/>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ProductsView = ({ products, setProducts, supplies, estimatedMargin }) => {
    const [viewMode, setViewMode] = useState('list');
    const [editingProduct, setEditingProduct] = useState(null);
    const [openCategories, setOpenCategories] = useState({});
    
    // --- Estado para selección múltiple de ingredientes ---
    const [isAddingIngredients, setIsAddingIngredients] = useState(false);
    const [selectedSupplyIds, setSelectedSupplyIds] = useState([]);

    const emptyProduct = { id: '', name: '', price: '', category: 'Hamburguesas', recipe: [] };

    const productCategories = ['Hamburguesas', 'Panchos', 'Bebidas', 'Combos'];

    useEffect(() => {
        if (productCategories.length > 0) setOpenCategories({ [productCategories[0]]: true });
    }, []);

    const toggleCategory = (category) => setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));

    const handleEdit = (product) => {
        setEditingProduct(product ? {...product} : {...emptyProduct, id: Date.now().toString()});
        setViewMode('editor');
        setIsAddingIngredients(false);
        setSelectedSupplyIds([]);
    };

    const saveProduct = () => {
        if (!editingProduct.name) return;
        const exists = products.find(p => p.id === editingProduct.id);
        if (exists) {
            setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
        } else {
            setProducts([...products, editingProduct]);
        }
        setViewMode('list');
    };

    const calculateCost = (recipe) => recipe.reduce((total, item) => {
        const supply = supplies.find(s => s.id === item.supplyId);
        if (!supply) return total;
        const unitCost = supply.cost / (supply.quantity || 1);
        return total + (unitCost * item.quantity);
    }, 0);

    const groupedProducts = useMemo(() => {
        return products.reduce((acc, item) => {
            (acc[item.category] = acc[item.category] || []).push(item);
            return acc;
        }, {});
    }, [products]);

    const allCategoriesToShow = [...new Set([...productCategories, ...Object.keys(groupedProducts)])];

    if (viewMode === 'editor') {
        const currentCost = calculateCost(editingProduct.recipe);
        const margin = (editingProduct.price || 0) - currentCost;
        const marginPercent = editingProduct.price > 0 ? ((margin / editingProduct.price) * 100) : 0;
        
        const marginDecimal = estimatedMargin / 100;
        let suggestedPrice = 0;
        if (marginDecimal < 1) {
            suggestedPrice = currentCost / (1 - marginDecimal);
        }

        const applySuggestedPrice = () => {
             setEditingProduct({...editingProduct, price: Math.ceil(suggestedPrice)});
        };
        
        return (
            <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setViewMode('list')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"><ChevronLeft size={20}/></button>
                        <h2 className="text-2xl font-black text-slate-800 drop-shadow-sm">{editingProduct.name || 'NUEVO PRODUCTO'}</h2>
                    </div>
                    <Button onClick={saveProduct} size="sm" variant="success" className="shadow-lg px-4" title="Guardar cambios"><Save size={18}/> <span>GUARDAR</span></Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CleanInput label="Nombre del Producto" value={editingProduct.name} onChange={val => setEditingProduct({...editingProduct, name: val})} />
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold ml-1">Categoría</label>
                                    <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full mt-1.5 bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-orange-500 font-semibold">
                                        <option>Hamburguesas</option><option>Panchos</option><option>Bebidas</option><option>Combos</option>
                                    </select>
                                </div>
                            </div>
                        </Card>
                        <Card>
                             <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <h3 className="text-sm font-bold text-slate-500 flex items-center gap-2"><Utensils size={16} className="text-orange-500"/> RECETA</h3>
                                <span className="text-xs bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-slate-600 font-bold">Costo Total: {formatCurrency(currentCost)}</span>
                             </div>
                             <div className="space-y-2 mb-6">
                                {editingProduct.recipe.map((comp, idx) => {
                                    const supply = supplies.find(s => s.id === comp.supplyId);
                                    if(!supply) return null;
                                    const unitCost = supply.cost / (supply.quantity || 1);
                                    const itemCost = unitCost * comp.quantity;
                                    
                                    return (
                                        <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 hover:bg-white hover:shadow-sm transition-all">
                                            <div className="flex-1">
                                                <span className="text-sm font-bold text-slate-700 block">{supply.name}</span>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                                                    Costo item: <span className="text-orange-600 font-bold text-xs ml-1">{formatCurrency(itemCost)}</span>
                                                    <span className="text-[8px] text-slate-400 ml-1">({formatCurrency(unitCost)}/{supply.unit})</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <CleanInput type="number" className="w-20 !gap-0" value={comp.quantity} onChange={val => {
                                                        const newRecipe = [...editingProduct.recipe]; newRecipe[idx].quantity = val; setEditingProduct({...editingProduct, recipe: newRecipe});
                                                    }}/>
                                                <span className="text-xs text-slate-500 w-6">{supply.unit}</span>
                                                <button onClick={() => { const newRecipe = editingProduct.recipe.filter((_, i) => i !== idx); setEditingProduct({...editingProduct, recipe: newRecipe}); }} className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><X size={16}/></button>
                                            </div>
                                        </div>
                                    )
                                })}
                             </div>
                             
                             {/* Nueva sección de selección múltiple */}
                             {!isAddingIngredients ? (
                                <Button onClick={() => setIsAddingIngredients(true)} variant="secondary" className="w-full border-dashed border-2 border-slate-300 text-slate-500 hover:text-orange-600 hover:border-orange-300">
                                    <Plus size={16} /> Agregar Insumos
                                </Button>
                             ) : (
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fadeIn">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-bold text-slate-700 text-sm">Seleccionar Insumos</h4>
                                        <button onClick={() => { setIsAddingIngredients(false); setSelectedSupplyIds([]); }} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                                    </div>
                                    
                                    {/* Lista con checkboxes */}
                                    <div className="max-h-60 overflow-y-auto space-y-2 mb-4 custom-scrollbar pr-2">
                                        {supplies
                                            .filter(s => !editingProduct.recipe.find(r => r.supplyId === s.id)) // Filtramos los que ya están
                                            .map(s => (
                                            <label key={s.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${selectedSupplyIds.includes(s.id) ? 'bg-orange-50 border-orange-200' : 'bg-white border-transparent hover:border-slate-200 hover:shadow-sm'}`}>
                                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedSupplyIds.includes(s.id) ? 'bg-orange-500 text-white' : 'bg-slate-200 text-transparent'}`}>
                                                    <CheckSquare size={14} className={selectedSupplyIds.includes(s.id) ? 'opacity-100' : 'opacity-0'}/>
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedSupplyIds.includes(s.id)}
                                                    onChange={(e) => {
                                                        if(e.target.checked) setSelectedSupplyIds([...selectedSupplyIds, s.id]);
                                                        else setSelectedSupplyIds(selectedSupplyIds.filter(id => id !== s.id));
                                                    }}
                                                    className="hidden" // Ocultamos el checkbox nativo para usar uno personalizado
                                                />
                                                <span className={`text-sm font-medium ${selectedSupplyIds.includes(s.id) ? 'text-orange-900' : 'text-slate-700'}`}>{s.name} <span className="text-slate-400 text-xs font-normal">({s.unit})</span></span>
                                            </label>
                                        ))}
                                        {supplies.filter(s => !editingProduct.recipe.find(r => r.supplyId === s.id)).length === 0 && (
                                            <div className="text-center py-4 text-slate-400 text-xs italic">
                                                No hay más insumos disponibles para agregar.
                                            </div>
                                        )}
                                    </div>
                                    
                                    <Button onClick={() => {
                                        const newIngredients = selectedSupplyIds.map(id => ({ supplyId: id, quantity: 1 }));
                                        setEditingProduct({...editingProduct, recipe: [...editingProduct.recipe, ...newIngredients]});
                                        setIsAddingIngredients(false);
                                        setSelectedSupplyIds([]);
                                    }} disabled={selectedSupplyIds.length === 0} className="w-full shadow-md">
                                        Confirmar Selección ({selectedSupplyIds.length})
                                    </Button>
                                </div>
                             )}
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card className="bg-white border-orange-100 shadow-xl shadow-orange-500/5">
                            <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-6 flex items-center gap-2"><Sparkles size={14}/> Estrategia de Precio</h3>
                            <div className="space-y-6">
                                <div>
                                    <CleanInput label="Precio de Venta" type="number" value={editingProduct.price} onChange={val => setEditingProduct({...editingProduct, price: val})} className="text-2xl font-black text-slate-800" />
                                    {suggestedPrice > 0 && (
                                        <button 
                                            onClick={applySuggestedPrice}
                                            className="mt-2 text-[10px] text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 px-2 py-1 rounded border border-orange-100 transition-colors font-bold"
                                            title={`Basado en tu margen objetivo del ${estimatedMargin}%`}
                                        >
                                            <Scale size={10}/> Sugerido: <strong>{formatCurrency(suggestedPrice)}</strong> (Click para aplicar)
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Costo Elaboración</span><span className="text-slate-700 font-mono font-bold">{formatCurrency(currentCost)}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Margen Bruto ($)</span><span className={`font-bold font-mono ${margin > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(margin)}</span></div>
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-2">
                                        <span className="text-slate-500 text-xs uppercase font-bold">Rentabilidad</span>
                                        <span className={`text-xl font-black ${marginPercent > 35 ? 'text-emerald-500' : marginPercent > 20 ? 'text-yellow-500' : 'text-red-500'}`}>{marginPercent.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
             <div className="flex justify-between items-end">
                <div><h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight drop-shadow-sm">Menú</h2><p className="text-slate-500 text-sm font-medium ml-1">Gestiona productos y precios</p></div>
                <Button onClick={() => handleEdit(null)}><Plus size={18}/> Nuevo</Button>
            </div>
            
            <div className="space-y-4">
                {allCategoriesToShow.map((category) => {
                    const items = groupedProducts[category] || [];
                    const isOpen = openCategories[category];
                    if (items.length === 0) return null;

                    return (
                        <div key={category} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                             <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3"><h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{category}</h3><span className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded-full text-slate-600">{items.length}</span></div>
                                {isOpen ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
                            </button>
                            
                            {isOpen && (
                                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                                    <PaginatedList items={items} itemsPerPage={12} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3" renderItem={(product) => {
                                        const cost = calculateCost(product.recipe);
                                        const margin = (product.price || 0) - cost;
                                        const marginPercent = product.price > 0 ? (margin / product.price) * 100 : 0;
                                        return (
                                            <div key={product.id} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col justify-between group hover:border-orange-300 hover:shadow-md transition-all h-full relative overflow-hidden">
                                                 <div className="flex justify-between items-start mb-2 relative z-10">
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                                                        <h3 className="text-xs font-bold text-slate-800 leading-tight">{product.name}</h3>
                                                    </div>
                                                    <button onClick={() => handleEdit(product)} className="text-slate-400 hover:text-slate-800 transition-colors"><Edit2 size={12}/></button>
                                                 </div>
                                                 
                                                 <div className="mt-auto pt-2 border-t border-slate-100 relative z-10">
                                                    <div className="flex justify-between items-end mb-1">
                                                        <span className="text-[10px] text-slate-400">Precio</span>
                                                        <span className="text-sm font-black text-slate-800">{formatCurrency(product.price)}</span>
                                                    </div>
                                                    {/* Barra de Margen Compacta (Fondo gris claro) */}
                                                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden flex mb-1">
                                                        <div className="bg-red-400" style={{ width: `${Math.min(100, 100 - marginPercent)}%` }}></div>
                                                        <div className="bg-emerald-500" style={{ width: `${Math.max(0, marginPercent)}%` }}></div>
                                                    </div>
                                                    <div className="flex justify-between text-[8px] font-mono text-slate-500">
                                                        <span>Costo: {formatCurrency(cost)}</span>
                                                        <span className={marginPercent > 30 ? "text-emerald-600 font-bold" : "text-yellow-600 font-bold"}>{marginPercent.toFixed(0)}%</span>
                                                    </div>
                                                 </div>
                                            </div>
                                        );
                                    }}/>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SalesView = ({ sales, setSales, targetRevenueDaily, monthlyStats }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');
    
    const handleAddSale = () => {
        if (!amount || amount <= 0) return;
        const newSale = { id: Date.now(), date, amount: parseFloat(amount) };
        setSales([...sales, newSale]);
        setAmount('');
    };

    const currentMonth = new Date().getMonth();
    const monthlySales = sales.filter(s => new Date(s.date).getMonth() === currentMonth).reduce((acc, curr) => acc + curr.amount, 0);
    const { surplus, dynamicDailyTarget, isSurplus } = monthlyStats;
    const todayDateString = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(s => s.date === todayDateString).reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6 animate-fadeIn">
            <header className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div><h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight drop-shadow-sm">Facturación</h2><p className="text-slate-500 text-sm font-medium ml-1">Registro diario de caja</p></div>
                <Card className="!p-2 flex items-center gap-3 bg-white border-orange-200 shadow-md">
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-slate-600 text-sm px-2 outline-none font-medium"/>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <CleanInput placeholder="$ 0.00" type="number" value={amount} onChange={setAmount} className="w-32 !gap-0 !py-0 border-none bg-transparent !text-lg !font-bold"/>
                    <Button size="sm" onClick={handleAddSale} className="shadow-none">CARGAR</Button>
                </Card>
            </header>
            <Card className="bg-white border-blue-100 shadow-lg shadow-blue-500/5">
                <div className="flex justify-between items-center mb-4"><h4 className="font-bold text-slate-700 flex items-center gap-2"><Target size={18} className="text-blue-500"/> Estado Financiero Dinámico</h4>
                    <Badge color={isSurplus ? 'green' : 'orange'}>{isSurplus ? 'SUPERÁVIT (ADELANTADO)' : 'RITMO DE AJUSTE'}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Meta Diaria Ajustada</p>
                        <p className={`text-2xl font-black ${isSurplus ? 'text-emerald-600' : 'text-slate-800'}`}>{formatCurrency(dynamicDailyTarget)}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{isSurplus ? '¡Relajado! Vas sobrado' : 'Necesario para llegar'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 md:border-x-0 md:bg-transparent md:border-y-0"><p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Facturado Hoy</p><p className={`text-2xl font-black ${todaySales >= dynamicDailyTarget ? 'text-emerald-600' : 'text-orange-500'}`}>{formatCurrency(todaySales)}</p></div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Balance de Ritmo</p>
                        <p className={`text-2xl font-bold flex items-center justify-center gap-1 ${isSurplus ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isSurplus ? <ArrowUpRight size={24}/> : <ArrowDownRight size={24}/>}
                            {formatCurrency(Math.abs(surplus))}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">{isSurplus ? 'A favor sobre el plan' : 'A recuperar'}</p>
                    </div>
                </div>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 relative overflow-hidden group h-[400px]">
                     <div className="absolute top-[-50%] left-[20%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]"></div>
                    <div className="flex justify-between items-center mb-6 relative z-10"><h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={14} className="text-blue-500"/> Tendencia de Ventas</h3></div>
                    <SmoothAreaChart data={sales} targetDaily={dynamicDailyTarget} />
                </Card>
                <div className="space-y-4">
                     <Card className="bg-white border-l-4 border-l-emerald-500 shadow-lg"><h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Facturación Mes Actual</h4><p className="text-4xl font-black text-slate-800 tracking-tight">{formatCurrency(monthlySales)}</p></Card>
                     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[280px]">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center"><h4 className="text-xs font-bold text-slate-500 uppercase">Últimos movimientos</h4></div>
                        <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                            <PaginatedList items={[...sales].sort((a,b) => new Date(b.date) - new Date(a.date))} itemsPerPage={5} renderItem={(sale) => (
                                    <div key={sale.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl group transition-colors border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200"><Banknote size={14}/></div><div><p className="text-sm font-bold text-slate-700">{formatCurrency(sale.amount)}</p><p className="text-[10px] text-slate-400">{sale.date}</p></div></div>
                                        <button onClick={() => setSales(sales.filter(s => s.id !== sale.id))} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"><X size={14}/></button>
                                    </div>
                                )}/>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

const FinanceView = ({ fixedCosts, setFixedCosts, sales, estimatedMargin, setEstimatedMargin, monthlyStats }) => {
    const [savingsGoal, setSavingsGoal] = useState(200000); 
    const [savingsType, setSavingsType] = useState('fixed'); 
    const [newCostName, setNewCostName] = useState('');
    const [newCostAmount, setNewCostAmount] = useState('');

    const handleAddCost = () => {
        if (!newCostName || !newCostAmount) return;
        setFixedCosts([...fixedCosts, { id: Date.now(), name: newCostName, cost: Number(newCostAmount) }]);
        setNewCostName('');
        setNewCostAmount('');
    };

    const totalFixed = fixedCosts.reduce((acc, curr) => acc + curr.cost, 0);
    const marginDecimal = estimatedMargin / 100;

    let targetRevenueMonthly = 0;
    if (savingsType === 'fixed') {
        targetRevenueMonthly = marginDecimal > 0 ? (totalFixed + (savingsGoal || 0)) / marginDecimal : 0;
    } else {
        const savingsDecimal = (savingsGoal || 0) / 100;
        const effectiveMargin = marginDecimal - savingsDecimal;
        targetRevenueMonthly = effectiveMargin > 0 ? totalFixed / effectiveMargin : 0;
    }

    const currentMonth = new Date().getMonth();
    const actualRevenueMonth = sales.filter(s => new Date(s.date).getMonth() === currentMonth).reduce((acc, curr) => acc + curr.amount, 0);
    const actualGrossProfit = actualRevenueMonth * marginDecimal; 
    const profitVsCosts = actualGrossProfit - totalFixed; 
    const costsCoveredPercent = totalFixed > 0 ? (actualGrossProfit / totalFixed) * 100 : 0;
    const { dynamicDailyTarget, surplus, isSurplus } = monthlyStats;

    return (
        <div className="space-y-6 animate-fadeIn">
            <div><h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight drop-shadow-sm">Finanzas</h2><p className="text-slate-500 text-sm font-medium ml-1">Planificación y Metas</p></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6">
                     <Card>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Gastos Fijos (OpEx)</h3>
                        <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {fixedCosts.map(fc => (
                                <div key={fc.id} className="flex justify-between items-center text-sm p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
                                    <span className="text-slate-600 font-medium">{fc.name}</span>
                                    <div className="flex items-center gap-3"><span className="text-slate-800 font-bold font-mono">{formatCurrency(fc.cost)}</span><button onClick={() => setFixedCosts(fixedCosts.filter(f => f.id !== fc.id))} className="text-slate-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><X size={14}/></button></div>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-slate-100 flex justify-between text-base font-bold text-slate-800 mt-2"><span>TOTAL FIJO</span><span>{formatCurrency(totalFixed)}</span></div>
                        </div>
                        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-3">
                            <input type="text" placeholder="Concepto (ej: Luz)" value={newCostName} onChange={e => setNewCostName(e.target.value)} className="w-full bg-transparent text-sm text-slate-800 border-b border-slate-300 focus:border-orange-500 outline-none px-1 py-1 placeholder:text-slate-400"/>
                            <div className="flex gap-2">
                                <input type="number" placeholder="$ Monto" value={newCostAmount} onChange={e => setNewCostAmount(e.target.value)} className="w-full bg-transparent text-sm text-slate-800 border-b border-slate-300 focus:border-orange-500 outline-none px-1 py-1 placeholder:text-slate-400"/>
                                <button onClick={handleAddCost} className="bg-orange-500 text-white px-4 rounded-lg text-xs font-bold hover:bg-orange-600 shadow-md">Agregar</button>
                            </div>
                        </div>
                     </Card>
                     <Card className="bg-orange-50 border-orange-100">
                         <div className="flex items-start gap-3"><AlertCircle size={20} className="text-orange-500 shrink-0 mt-1"/><div className="text-xs text-orange-700/80 leading-relaxed"><strong className="text-orange-800 block mb-1">Nota Importante:</strong>La "Ganancia Bruta" es lo que te queda después de pagar la mercadería. Con eso pagas los gastos fijos (Alquiler, Luz, etc).</div></div>
                     </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-white border-l-4 border-l-blue-500 shadow-lg">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <PieChart size={18} className="text-blue-500"/> ¿Cubren mis ventas los gastos?
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Ventas Totales</p>
                                <p className="text-xl font-bold text-slate-600">{formatCurrency(actualRevenueMonth)}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">Ganancia Bruta Real <span className="text-orange-600 bg-orange-100 text-[9px] px-1 rounded">{estimatedMargin}%</span></p>
                                <p className="text-2xl font-black text-slate-800">{formatCurrency(actualGrossProfit)}</p>
                                <p className="text-[10px] text-slate-500 mt-1">Dinero disponible</p>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Resultado Neto (Hoy)</p>
                                <p className={`text-xl font-bold ${profitVsCosts >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {profitVsCosts >= 0 ? '+' : ''}{formatCurrency(profitVsCosts)}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-1">{profitVsCosts >= 0 ? 'Gastos Cubiertos 🎉' : 'Falta para cubrir fijos'}</p>
                            </div>
                        </div>

                        <div className="relative pt-4">
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className={costsCoveredPercent >= 100 ? 'text-emerald-600' : 'text-slate-400'}>Progreso Cobertura Gastos</span>
                                <span className="text-slate-500">{costsCoveredPercent.toFixed(1)}%</span>
                            </div>
                            <div className="h-4 bg-slate-200 rounded-full overflow-hidden relative border border-slate-100">
                                <div className={`h-full transition-all duration-1000 ${costsCoveredPercent >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, costsCoveredPercent)}%` }}></div>
                                <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-slate-400"></div>
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono">
                                <span>$0</span>
                                <span className="text-slate-600">Meta: {formatCurrency(totalFixed)}</span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                         <div className="flex flex-col md:flex-row gap-6 mb-8">
                             <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Meta de Crecimiento</label>
                                    <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200"><button onClick={() => setSavingsType('fixed')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${savingsType === 'fixed' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>$ FIJO</button><button onClick={() => setSavingsType('percent')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${savingsType === 'percent' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>% VENTA</button></div>
                                </div>
                                <div className="relative"><CleanInput type="number" value={savingsGoal} onChange={setSavingsGoal} placeholder={savingsType === 'fixed' ? "Monto a ahorrar" : "Porcentaje ej: 10"} />{savingsType === 'percent' && <span className="absolute right-4 top-3.5 text-slate-500 font-bold">%</span>}</div>
                             </div>
                             <div className="flex-1">
                                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 block">Margen Promedio Estimado</label>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-4"><input type="range" min="10" max="80" value={estimatedMargin} onChange={e => setEstimatedMargin(Number(e.target.value))} className="flex-1 accent-orange-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"/><span className="text-slate-800 font-bold font-mono text-lg">{estimatedMargin}%</span></div>
                             </div>
                         </div>
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden backdrop-blur-sm">
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                <div><p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">Meta Facturación Mensual</p><p className="text-2xl font-black text-slate-800">{formatCurrency(targetRevenueMonthly)}</p></div>
                                <div className="md:border-x border-slate-200"><p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">Meta Diaria Ajustada</p><p className={`text-2xl font-black ${isSurplus ? 'text-emerald-600' : 'text-orange-500'}`}>{formatCurrency(dynamicDailyTarget)}</p></div>
                                <div><p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">Status Ritmo</p><p className={`text-xl font-bold ${isSurplus ? 'text-emerald-600' : 'text-red-500'}`}>{isSurplus ? 'ADELANTADO' : 'ATRASADO'}</p></div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [supplies, setSupplies] = useState(initialSupplies);
  const [products, setProducts] = useState(initialProducts);
  const [fixedCosts, setFixedCosts] = useState(initialFixedCosts);
  const [sales, setSales] = useState(initialSales);
  const [categories, setCategories] = useState(defaultCategories);
  
  const [estimatedMargin, setEstimatedMargin] = useState(35);

  const totalFixed = fixedCosts.reduce((acc, curr) => acc + curr.cost, 0);
  const savingsGoal = 200000; 
  const marginDecimal = estimatedMargin / 100;
  const monthlyGoal = marginDecimal > 0 ? (totalFixed + savingsGoal) / marginDecimal : 0;

  const currentMonth = new Date().getMonth();
  const date = new Date();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const currentDay = date.getDate();
  const remainingDays = Math.max(1, daysInMonth - currentDay); 

  const monthlySales = sales.filter(s => new Date(s.date).getMonth() === currentMonth).reduce((acc, curr) => acc + curr.amount, 0);
  
  const linearTargetToday = (monthlyGoal / daysInMonth) * currentDay;
  const surplus = monthlySales - linearTargetToday;
  const isSurplus = surplus > 0;

  const remainingGoal = Math.max(0, monthlyGoal - monthlySales);
  const dynamicDailyTarget = remainingGoal / remainingDays;

  const monthlyStats = {
      monthlyGoal,
      monthlySales,
      daysInMonth,
      currentDay,
      remainingDays,
      surplus,
      isSurplus,
      dynamicDailyTarget
  };

  useEffect(() => {
    const saved = localStorage.getItem('contreburger_v13'); // Version 13
    if (saved) {
        try {
            const data = JSON.parse(saved);
            setSupplies(data.supplies || initialSupplies);
            setProducts(data.products || initialProducts);
            setFixedCosts(data.fixedCosts || initialFixedCosts);
            setSales(data.sales || initialSales);
            setCategories(data.categories || defaultCategories);
            if(data.estimatedMargin) setEstimatedMargin(data.estimatedMargin);
        } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => { 
      localStorage.setItem('contreburger_v13', JSON.stringify({ supplies, products, fixedCosts, sales, categories, estimatedMargin })); 
  }, [supplies, products, fixedCosts, sales, categories, estimatedMargin]);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen font-sans flex overflow-hidden text-slate-800" style={bgPatternStyle}>
      <aside onClick={toggleSidebar} className={`fixed md:relative z-30 h-screen bg-slate-900 text-white backdrop-blur-xl border-r border-slate-800 transition-all duration-300 flex flex-col cursor-pointer ${sidebarOpen ? 'w-72 shadow-2xl' : 'w-20 hidden md:flex'}`}>
        <div className="p-6 flex items-center justify-center border-b border-slate-800 h-24 bg-gradient-to-b from-orange-600/10 to-transparent">
           {sidebarOpen ? ( <div className="text-center"><h1 className="font-black text-2xl text-white tracking-tighter drop-shadow-lg">CONTRE<span className="text-orange-500">ADMIN</span></h1><p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mt-1 font-bold">Management System</p></div> ) : ( <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-orange-500/30">C</div> )}
        </div>
        <nav className="flex-1 p-4 space-y-3 mt-4" id="sidebar-spacer">
            <NavItem active={activeTab === 'supplies'} onClick={() => setActiveTab('supplies')} icon={<Package size={22}/>} label="Insumos" isOpen={sidebarOpen} />
            <NavItem active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Utensils size={22}/>} label="Menú & Costos" isOpen={sidebarOpen} />
            <NavItem active={activeTab === 'sales'} onClick={() => setActiveTab('sales')} icon={<Banknote size={22}/>} label="Facturación" isOpen={sidebarOpen} />
            <NavItem active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon={<TrendingUp size={22}/>} label="Metas Financieras" isOpen={sidebarOpen} />
        </nav>
      </aside>
      <main className="flex-1 h-screen overflow-y-auto relative custom-scrollbar bg-transparent">
         <div className="md:hidden p-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 border-b border-slate-200 z-20 shadow-sm">
            <div className="flex items-center gap-3"><button onClick={toggleSidebar} className="text-slate-800 p-2 rounded-lg hover:bg-slate-100"><Menu/></button><span className="font-black text-slate-800">CONTRE<span className="text-orange-500">ADMIN</span></span></div>
         </div>
         <div className="p-4 md:p-10 max-w-7xl mx-auto pb-32">
            {activeTab === 'supplies' && <SuppliesView supplies={supplies} setSupplies={setSupplies} categories={categories} setCategories={setCategories} />}
            {activeTab === 'products' && <ProductsView products={products} setProducts={setProducts} supplies={supplies} estimatedMargin={estimatedMargin} />}
            {activeTab === 'sales' && <SalesView sales={sales} setSales={setSales} targetRevenueDaily={monthlyStats.dynamicDailyTarget} monthlyStats={monthlyStats} />}
            {activeTab === 'finance' && <FinanceView fixedCosts={fixedCosts} setFixedCosts={setFixedCosts} sales={sales} monthlyStats={monthlyStats} estimatedMargin={estimatedMargin} setEstimatedMargin={setEstimatedMargin} setTargetRevenueDaily={()=>{}} />}
         </div>
      </main>
    </div>
  );
}

const NavItem = ({ active, onClick, icon, label, isOpen }) => (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all relative group ${active ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'} ${!isOpen && 'justify-center px-2'}`}>
      <div className="shrink-0 drop-shadow-sm">{icon}</div> {isOpen && <span className="text-sm tracking-wide">{label}</span>} {!isOpen && active && <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"></div>}
    </button>
);