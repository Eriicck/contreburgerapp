imp ort React, { useState, useEffect, useMemo, useRef } from 'react';
import { auth, db, storage } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


// --- 2. CONSTANTES Y UTILIDADES ---
const WHATSAPP_NUMBER = "5491124952866";

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

const Icons = {
  // Store Icons
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
  
  // Login Icons
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.03 1.28-.09"/><line x1="2" x2="22" y1="2" y2="22"/></svg>,
  ShieldCheck: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>,

  // Admin Icons
  Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Burger: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.1 2.2a2 2 0 0 0-1.8 1.1L7 9h10l-2.3-5.7a2 2 0 0 0-1.8-1.1h-1.8z"/><path d="m3 11 1.7 6.9a2 2 0 0 0 2 1.5h10.6a2 2 0 0 0 2-1.5L21 11H3z"/><path d="M5.6 20.3a2 2 0 0 0 1.8 1.1h9.2a2 2 0 0 0 1.8-1.1l.6-2.3H5l.6 2.3z"/></svg>,
  List: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>,
  Megaphone: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
  AdminPlus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  Upload: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Logout: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
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

// --- 3. COMPONENTE LOGIN (DISEÑO PREMIUM + FIREBASE) ---
function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(); // Notificamos al componente padre que se logueó
    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-stone-900 font-sans text-stone-900">
      {/* FONDO */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-40"/>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-stone-900/60" />
      </div>
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none animate-pulse" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '30px 30px' }} />

      {/* TARJETA DE LOGIN */}
      <div className="relative z-10 w-full max-w-md p-4 animate-fade-in">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                <Icons.ShieldCheck />
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                CONTRE<span className="text-amber-500">ADMIN</span>
            </h1>
            <p className="text-stone-400 text-sm">Acceso exclusivo para personal autorizado</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-300 uppercase tracking-wider ml-1">Usuario / Email</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-amber-500 transition-colors"><Icons.User /></div>
                        <input type="text" placeholder="admin@email.com" className="w-full bg-stone-900/50 border border-stone-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-stone-600" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-300 uppercase tracking-wider ml-1">Contraseña</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-amber-500 transition-colors"><Icons.Lock /></div>
                        <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-stone-900/50 border border-stone-700 text-white rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-stone-600" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-stone-500 hover:text-white transition-colors focus:outline-none">{showPassword ? <Icons.EyeOff /> : <Icons.Eye />}</button>
                    </div>
                </div>
                {error && (<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-200 text-sm animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />{error}</div>)}
                <button disabled={isLoading} type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 font-bold py-4 rounded-xl shadow-lg hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {isLoading ? (<div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />) : (<>INGRESAR AL SISTEMA <Icons.ArrowRight /></>)}
                </button>
            </form>
        </div>
        <div className="mt-8 text-center">
            <p className="text-stone-500 text-xs">&copy; {new Date().getFullYear()} Contreburger. Desarrollado por <span className="text-amber-500 font-bold">Erick Dev</span></p>
        </div>
      </div>
    </div>
  );
}

// --- 4. COMPONENTE ADMIN PANEL (DISEÑO SIDEBAR + FIRESTORE) ---
function AdminPage({ setView }) {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [marqueeText, setMarqueeText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // UI Sidebar
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Modal & Edición
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const unsubProd = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubSettings = onSnapshot(doc(db, "settings", "main_settings"), (d) => {
        if(d.exists()) setMarqueeText(d.data().marqueeText);
    });
    return () => { unsubProd(); unsubSettings(); };
  }, []);

  // --- FUNCIONES CRUD ---
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setFileToUpload(null);
    setIsProductModalOpen(true);
  };

  const handleCreateProduct = () => {
    setCurrentProduct({ name: '', price: '', category: 'burgers', description: '', image: '' });
    setFileToUpload(null);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Eliminar este producto permanentemente?')) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        let imageUrl = currentProduct.image;
        if (fileToUpload) {
            const fileRef = ref(storage, `products/${Date.now()}_${fileToUpload.name}`);
            await uploadBytes(fileRef, fileToUpload);
            imageUrl = await getDownloadURL(fileRef);
        }

        const productData = { 
            ...currentProduct, 
            price: Number(currentProduct.price),
            image: imageUrl 
        };

        if (currentProduct.id) {
            await updateDoc(doc(db, "products", currentProduct.id), productData);
        } else {
            await addDoc(collection(db, "products"), productData);
        }
        setIsProductModalOpen(false);
    } catch (error) {
        alert("Error al guardar: " + error.message);
    } finally {
        setIsSaving(false);
    }
  };

  const handleSaveBanner = async () => {
    await setDoc(doc(db, "settings", "main_settings"), { marqueeText }, { merge: true });
    alert("¡Cinta actualizada!");
  };

  const handleLogout = async () => {
    if (window.confirm("¿Deseas cerrar sesión?")) {
        await signOut(auth);
        setView('home'); // Redirigir al inicio o login
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
        setFileToUpload(e.target.files[0]);
        setCurrentProduct({ ...currentProduct, image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  // --- UI HELPERS ---
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button onClick={(e) => { e.stopPropagation(); setActiveTab(id); setIsMobileSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium whitespace-nowrap overflow-hidden z-20 relative ${activeTab === id ? 'bg-amber-600 text-white shadow-lg' : 'text-stone-400 hover:bg-stone-800 hover:text-white'}`}>
      <div className="min-w-[20px]"><Icon /></div>
      <span className={`transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 md:hidden group-hover:block'}`}>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-stone-50 font-sans text-stone-900 overflow-hidden relative">
      <aside onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className={`fixed md:relative inset-y-0 left-0 z-30 bg-stone-900 flex flex-col p-3 shadow-xl transition-all duration-300 ease-in-out cursor-pointer group/sidebar ${isMobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'} ${isSidebarExpanded ? 'md:w-64' : 'md:w-20'}`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '30px 30px' }} />
        <div className="relative z-10 flex flex-col h-full">
            <div className="mb-8 px-2 mt-4 flex items-center justify-between md:justify-center">
                <div className={`overflow-hidden transition-all duration-300 ${isSidebarExpanded ? 'w-full opacity-100' : 'w-0 opacity-0 md:w-auto md:opacity-100'}`}>
                    {isSidebarExpanded || isMobileSidebarOpen ? (
                        <div><h1 className="text-xl font-extrabold text-white tracking-tight whitespace-nowrap">CONTRE<span className="text-amber-500">ADMIN</span></h1><p className="text-stone-500 text-[10px]">v1.0 Firebase</p></div>
                    ) : (<div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center font-bold text-stone-900 shadow-lg shadow-amber-500/20">C</div>)}
                </div>
                <button onClick={(e) => { e.stopPropagation(); setIsMobileSidebarOpen(false); }} className="md:hidden text-stone-400 hover:text-white"><Icons.X /></button>
            </div>
            <nav className="space-y-2 flex-grow">
                <SidebarItem id="products" label="Productos" icon={Icons.Burger} />
                <SidebarItem id="categories" label="Categorías" icon={Icons.List} />
                <SidebarItem id="banner" label="Cinta / Banner" icon={Icons.Megaphone} />
            </nav>
            <div className="mt-auto pt-4 border-t border-stone-800 relative z-20">
                <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300`}>
                    <div className="min-w-[20px]"><Icons.Logout /></div>
                    <span className={`transition-opacity duration-300 whitespace-nowrap ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>Cerrar Sesión</span>
                </button>
            </div>
        </div>
      </aside>

      {isMobileSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsMobileSidebarOpen(false)} />}

      <main className="flex-1 overflow-y-auto relative w-full">
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsMobileSidebarOpen(true)} className="md:hidden text-stone-600 hover:text-stone-900"><Icons.Menu /></button>
                <h2 className="text-lg md:text-xl font-bold text-stone-800 capitalize truncate">{activeTab === 'products' ? 'Productos' : activeTab === 'categories' ? 'Categorías' : 'Banner'}</h2>
            </div>
            <div className="flex items-center gap-3">
                <div className="hidden md:block text-right"><p className="text-sm font-bold text-stone-900">Erick Dev</p><p className="text-xs text-stone-500">Administrador</p></div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold border border-amber-200">E</div>
            </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
            {activeTab === 'products' && (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm text-sm" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}/>
                            <div className="absolute left-3 top-3.5 text-stone-400"><Icons.Search /></div>
                        </div>
                        <button onClick={handleCreateProduct} className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm"><Icons.AdminPlus /> Nuevo</button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                        <table className="w-full text-left hidden md:table">
                            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider">
                                <tr><th className="px-6 py-4 font-bold">Producto</th><th className="px-6 py-4 font-bold">Categoría</th><th className="px-6 py-4 font-bold">Precio</th><th className="px-6 py-4 font-bold text-right">Acciones</th></tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {currentProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-stone-50 transition-colors group">
                                        <td className="px-6 py-4"><div className="flex items-center gap-4"><img src={product.image || "https://via.placeholder.com/150"} className="w-12 h-12 rounded-lg object-cover shadow-sm bg-stone-100" /><div><p className="font-bold text-stone-900">{product.name}</p><p className="text-xs text-stone-500 truncate max-w-[200px]">{product.description}</p></div></div></td>
                                        <td className="px-6 py-4"><span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold border border-stone-200">{CATEGORIES.find(c => c.id === product.category)?.label || product.category}</span></td>
                                        <td className="px-6 py-4 font-medium text-stone-900">${product.price?.toLocaleString('es-AR')}</td>
                                        <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEditProduct(product)} className="p-2 bg-stone-50 hover:bg-amber-100 text-stone-500 hover:text-amber-700 rounded-lg transition-colors"><Icons.Edit /></button><button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-stone-50 hover:bg-red-100 text-stone-500 hover:text-red-600 rounded-lg transition-colors"><Icons.Trash /></button></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="md:hidden divide-y divide-stone-100">
                             {currentProducts.map(product => (
                                <div key={product.id} className="p-4 flex gap-4 items-start">
                                    <img src={product.image || "https://via.placeholder.com/150"} className="w-20 h-20 rounded-xl object-cover shadow-sm bg-stone-100 flex-shrink-0" />
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-stone-900">{product.name}</h3><span className="font-bold text-amber-600">${product.price?.toLocaleString('es-AR')}</span></div>
                                        <p className="text-xs text-stone-500 line-clamp-2 mb-2">{product.description}</p>
                                        <div className="flex justify-between items-center mt-2"><span className="text-[10px] bg-stone-100 px-2 py-1 rounded text-stone-500 uppercase font-bold">{CATEGORIES.find(c => c.id === product.category)?.label}</span><div className="flex gap-2"><button onClick={() => handleEditProduct(product)} className="p-2 bg-stone-100 text-stone-600 rounded-lg"><Icons.Edit /></button><button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-50 text-red-500 rounded-lg"><Icons.Trash /></button></div></div>
                                    </div>
                                </div>
                             ))}
                        </div>
                        {currentProducts.length === 0 && <div className="p-12 text-center text-stone-400">No hay productos.</div>}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-stone-200">
                            <button onClick={prevPage} disabled={currentPage === 1} className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-stone-600 bg-stone-100 rounded-lg disabled:opacity-50 hover:bg-amber-100 transition-colors"><Icons.ChevronLeft /> Anterior</button>
                            <span className="text-sm font-medium text-stone-500">Página <span className="text-stone-900 font-bold">{currentPage}</span> de {totalPages}</span>
                            <button onClick={nextPage} disabled={currentPage === totalPages} className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-stone-600 bg-stone-100 rounded-lg disabled:opacity-50 hover:bg-amber-100 transition-colors">Siguiente <Icons.ChevronRight /></button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CATEGORIES.map(cat => (
                        <div key={cat.id} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex flex-col gap-4">
                            <div className="relative h-40 rounded-xl overflow-hidden group"><img src={cat.image} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-white font-bold text-sm">Próximamente editable</span></div></div>
                            <h3 className="font-bold text-lg">{cat.label}</h3>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'banner' && (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
                        <div className="bg-stone-900 p-6 text-white"><h3 className="text-xl font-bold flex items-center gap-2"><Icons.Megaphone /> Editar Cinta</h3></div>
                        <div className="p-6 md:p-8">
                            <label className="block font-bold text-stone-700 mb-2">Texto del Anuncio</label>
                            <textarea rows="4" className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium text-stone-800" value={marqueeText} onChange={(e) => setMarqueeText(e.target.value)} />
                            <div className="mt-6 bg-amber-50 p-4 rounded-xl border border-amber-100"><p className="text-xs font-bold text-amber-800 uppercase mb-2">Previsualización:</p><div className="overflow-hidden whitespace-nowrap bg-black py-2 px-4 rounded text-white text-xs font-bold">{marqueeText}</div></div>
                            <button onClick={handleSaveBanner} className="w-full mt-6 bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg flex justify-center items-center gap-2"><Icons.Check /> Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* MODAL PRODUCTO */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in my-auto">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                    <h2 className="text-xl font-bold text-stone-900">{currentProduct.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                    <button onClick={() => setIsProductModalOpen(false)} className="text-stone-400 hover:text-stone-900"><Icons.X /></button>
                </div>
                <form onSubmit={handleSaveProduct} className="p-6 md:p-8 overflow-y-auto space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-bold text-stone-700 mb-2">Imagen</label>
                            <div className="aspect-square rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center overflow-hidden relative group hover:border-amber-500 transition-colors">
                                {currentProduct.image ? <img src={currentProduct.image} className="w-full h-full object-cover" /> : <div className="text-stone-400 text-center p-4"><Icons.Upload /><span className="text-xs block mt-2">Subir Foto</span></div>}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"><span className="text-white text-xs font-bold">Cambiar</span></div>
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 space-y-4">
                            <div><label className="block text-sm font-bold text-stone-700 mb-1">Nombre</label><input required type="text" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none" value={currentProduct.name} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-bold text-stone-700 mb-1">Precio ($)</label><input required type="number" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none" value={currentProduct.price} onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})} /></div>
                                <div><label className="block text-sm font-bold text-stone-700 mb-1">Categoría</label><select className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none" value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
                            </div>
                            <div><label className="block text-sm font-bold text-stone-700 mb-1">Descripción</label><textarea rows="3" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none" value={currentProduct.description} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} /></div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-stone-100 flex gap-4">
                        <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 py-3 font-bold text-stone-500 hover:bg-stone-100 rounded-xl transition-colors">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-lg flex items-center justify-center gap-2">{isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Guardar'}</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}

// --- COMPONENTE PRODUCTO CARD ---
function ProductCard({ product, isMobile, addToCart }) {
  const isOutOfStock = product.outOfStock === true;
  const isComingSoon = product.comingSoon === true;
  const isUnavailable = isOutOfStock || isComingSoon;
  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 flex flex-col h-full transition-all duration-300 ${isUnavailable ? '' : 'hover:-translate-y-2 hover:shadow-xl group'}`}>
      <div className={`overflow-hidden relative ${isMobile ? 'h-64 aspect-square' : 'h-48'}`}>
        <img src={product.image} alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700
            ${isUnavailable ? 'brightness-75' : 'group-hover:scale-110'}
            ${isOutOfStock ? 'grayscale' : ''}`} />
        {!isUnavailable && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-stone-900 text-xs font-bold px-2 py-1 rounded-md shadow-sm">${product.price.toLocaleString('es-AR')}</div>
        )}
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
          <button onClick={() => addToCart(product)} className="w-full bg-stone-100 text-stone-900 font-bold py-2 rounded-lg hover:bg-stone-900 hover:text-white transition-colors text-sm active:scale-95 border border-stone-200 hover:border-stone-900">AGREGAR +</button>
        )}
      </div>
    </div>
  );
}

// --- 5. COMPONENTE TIENDA (EL DISEÑO VISUAL PRO) ---
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubProd = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
    });
    const unsubCats = onSnapshot(collection(db, "categories"), (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubSett = onSnapshot(doc(db, "settings", "main_settings"), (d) => {
       if(d.exists()) setMarqueeText(d.data().marqueeText);
       else setMarqueeText("🕰 Jueves a Domingos | 19:00 a 23:00 hrs • Envíos a todo Moreno");
    });
    return () => { unsubProd(); unsubCats(); unsubSett(); };
  }, []);

  const [checkoutData, setCheckoutData] = useState({
    type: 'delivery', paymentMethod: '', cashAmount: '', name: '', address: '', number: '', crossStreets: ''
  });

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

  const handleCheckout = () => {
    const { type, paymentMethod, cashAmount, name, address, number, crossStreets } = checkoutData;
    let message = `*HOLA CONTREBURGER! 🍔 QUIERO HACER UN PEDIDO*\n\n*MI PEDIDO:*\n`;
    cart.forEach(item => { message += `▪ ${item.quantity}x ${item.name} ($${item.price * item.quantity})\n`; });
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
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
      `}</style>
      <div className="font-sans text-stone-900 bg-stone-50 min-h-screen">
        
        {/* SECCIÓN 1: HERO (100vh) */}
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

        {/* SECCIÓN 2: CATEGORÍAS */}
        <section className="relative min-h-screen bg-stone-900 flex flex-col justify-center py-12 px-4 md:px-8 overflow-hidden relative">
          <div className="absolute inset-0 z-0 overflow-hidden">
               <div className="absolute left-0 right-0 pointer-events-none" style={{ top: '-50%', height: '200%', backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '30px 30px', transform: `translateY(${scrollY * 0.15}px)`, opacity: 0.7 }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full h-full flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 uppercase tracking-tight">¿Qué te provoca <span className="text-amber-500">hoy?</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {categories.map((cat) => {
                const isOutOfStock = cat.outOfStock === true;
                const isComingSoon = cat.comingSoon === true;
                const isUnavailable = isOutOfStock || isComingSoon;
                return (
                  <button key={cat.id} onClick={() => !isUnavailable && handleCategorySelect(cat.id)}
                    className={`group relative h-36 sm:h-44 md:h-52 rounded-2xl overflow-hidden border shadow-xl transition-all duration-300 focus:outline-none
                      ${isUnavailable ? 'border-stone-700 cursor-default' : 'border-stone-700 hover:scale-[1.03] hover:border-amber-500 hover:z-10 focus:ring-2 focus:ring-amber-500/50'}`}>
                    <img src={cat.image} alt={cat.label}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 opacity-60
                        ${isUnavailable ? 'grayscale brightness-50' : 'group-hover:scale-110 group-hover:opacity-80'}`} />
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

        {/* SECCIÓN 3: GRID DE PRODUCTOS */}
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
                      <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-3 rounded-full bg-white border border-stone-200 shadow hover:bg-stone-50 disabled:opacity-30"><Icons.ArrowLeft /></button>
                      <span className="font-bold text-stone-600">Página {currentPage} / {totalPages}</span>
                      <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-3 rounded-full bg-white border border-stone-200 shadow hover:bg-stone-50 disabled:opacity-30"><Icons.ArrowRight /></button>
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

        {/* SECCIÓN 4: FOOTER */}
        <footer className="relative h-screen bg-stone-900 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/pedido-digital-online.firebasestorage.app/o/footer%20contreburger%201.png?alt=media&token=5823de6d-6e79-4a5d-88bf-293f4467eef8')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 }} />
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex-grow flex flex-col justify-center">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter drop-shadow-lg">SÍGUENOS EN <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">REDES SOCIALES</span></h2>
              <p className="text-stone-300 text-xl mb-12 max-w-2xl mx-auto drop-shadow-md font-medium">Participa en nuestros sorteos, mira el detrás de escena de nuestras cocinas y comparte tu experiencia Contreburger.</p>
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                  <a href="https://www.instagram.com/contreburger" className="flex items-center gap-3 px-8 py-4 bg-white text-stone-900 rounded-full font-bold text-lg hover:bg-amber-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl w-full md:w-auto justify-center"><Icons.Instagram /> @contreburger</a>
                  <a href="#" className="flex items-center gap-3 px-8 py-4 bg-black text-white border border-stone-800 rounded-full font-bold text-lg hover:bg-stone-800 transition-all transform hover:-translate-y-1 shadow-xl w-full md:w-auto justify-center"><Icons.TikTok /> @contreburger</a>
              </div>
          </div>
          <div className="relative z-20 w-full bg-black/80 backdrop-blur-md py-4 text-center border-t border-stone-800">
              {/* --- TRUCO: CLICK EN EL TEXTO DE COPYRIGHT PARA IR AL ADMIN --- */}
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
                  <div key={item.id} className="flex items-center justify-between border-b border-stone-100 pb-4 last:border-0">
                    <div className="flex items-center gap-4">
                      <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt={item.name} />
                      <div><h4 className="font-bold text-stone-900">{item.name}</h4><p className="text-sm text-amber-700 font-bold">${(item.price * item.quantity).toLocaleString('es-AR')}</p></div>
                    </div>
                    <QuantityControl quantity={item.quantity} size="sm" onIncrease={() => updateQuantity(item.id, 1)} onDecrease={() => updateQuantity(item.id, -1)} />
                  </div>
                ))}
                {cart.length === 0 && <p className="text-center text-stone-500 py-8">El carrito está vacío :(</p>}
              </div>
              {cart.length > 0 && (
                <div className="p-6 bg-stone-100 border-t border-stone-200">
                  <div className="flex justify-between items-center mb-6"><span className="text-stone-500 font-medium">Total Estimado</span><span className="text-3xl font-extrabold text-stone-900">${cartTotal.toLocaleString('es-AR')}</span></div>
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
                  <section>
                      <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wide mb-3">1. Tipo de Entrega</h3>
                      <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => setCheckoutData({...checkoutData, type: 'delivery'})} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${checkoutData.type === 'delivery' ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-stone-200 text-stone-400 hover:border-stone-300'}`}><Icons.Bike /><span className="font-bold">Delivery</span></button>
                          <button onClick={() => setCheckoutData({...checkoutData, type: 'pickup'})} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${checkoutData.type === 'pickup' ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-stone-200 text-stone-400 hover:border-stone-300'}`}><Icons.Store /><span className="font-bold">Retiro</span></button>
                      </div>
                  </section>
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
                  <section>
                      <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wide mb-3">3. Forma de Pago</h3>
                      <div className="space-y-3">
                          <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${checkoutData.paymentMethod === 'mercadopago' ? 'border-amber-600 bg-amber-50' : 'border-stone-200'}`}>
                              <input type="radio" name="payment" className="accent-amber-600 w-5 h-5" onChange={() => setCheckoutData({...checkoutData, paymentMethod: 'mercadopago'})} />
                              <span className="font-bold text-stone-800">MercadoPago</span>
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

// --- 6. COMPONENTE RAÍZ (ROUTER DE ESTADO) ---
export default function App() {
  const [view, setView] = useState('home'); // 'home', 'login', 'admin'
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Si intenta ir a admin y no está logueado, mostrar login
  if (view === 'admin' && !user) return <LoginPage onLoginSuccess={() => setView('admin')} />;
  
  // Si está en login y ya tiene usuario, mandar a admin
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