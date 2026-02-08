import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- ICONOS ---
const Icons = {
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.03 1.28-.09"/><line x1="2" x2="22" y1="2" y2="22"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  ShieldCheck: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // Hook para navegar

  // Simulación de Login Local
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simula tiempo de red
    setTimeout(() => {
      // Credenciales quemadas para prueba local
      if (email === 'admin' && password === 'admin') {
        // GUARDAMOS EL TOKEN FALSO
        localStorage.setItem('contre_auth', 'true');
        // NAVEGAMOS AL ADMIN
        navigate('/admin');
      } else {
        setError('Usuario o contraseña incorrectos');
        setIsLoading(false);
      }
    }, 1500);
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
                <Icons.ShieldCheck className="text-stone-900 w-8 h-8" />
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
                        <input type="text" placeholder="admin" className="w-full bg-stone-900/50 border border-stone-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-stone-600" value={email} onChange={(e) => setEmail(e.target.value)}/>
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