import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag, Search, Filter, SlidersHorizontal, ChevronRight, User, LogOut, History, Package, Check, MessageCircle } from 'lucide-react';
import { PRODUCTS, Product } from './data';

interface Purchase {
  date: string;
  items: Product[];
  total: number;
}

interface UserAccount {
  name: string;
  email: string;
  history: Purchase[];
}

export default function App() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(200);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Auth & Account State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Cart for simulation
  const [cart, setCart] = useState<Product[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  // Notification timer
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load user from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('aura_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string || email.split('@')[0];

    const user: UserAccount = {
      name,
      email,
      history: []
    };
    
    setCurrentUser(user);
    localStorage.setItem('aura_user', JSON.stringify(user));
    setShowAuthModal(false);
    setNotification({ message: `Bienvenido, ${name}`, type: 'success' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aura_user');
    setCart([]);
    setNotification({ message: 'Sesión cerrada', type: 'info' });
  };

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
    setNotification({ message: 'Artículo añadido a la bolsa', type: 'success' });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const savePurchase = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (cart.length === 0) return;

    const newPurchase: Purchase = {
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price, 0)
    };

    const updatedUser = {
      ...currentUser,
      history: [newPurchase, ...currentUser.history]
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('aura_user', JSON.stringify(updatedUser));
    setCart([]);
    setShowCartModal(false);
    setNotification({ message: 'Compra guardada exitosamente', type: 'success' });
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const sizeMatch = !selectedSize || product.size === selectedSize;
      const priceMatch = product.price <= priceRange;
      return categoryMatch && sizeMatch && priceMatch;
    });
  }, [selectedCategories, selectedSize, priceRange]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedSize('');
    setPriceRange(200);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-zinc-100 rounded-full transition-colors"
                id="menu-toggle"
              >
                <Menu size={20} />
              </button>
              <h1 className="font-display text-2xl font-semibold tracking-tighter uppercase">AURA</h1>
            </div>
            
            <div className="hidden lg:flex items-center gap-12 text-sm font-medium tracking-tight">
              <a href="#" className="hover:text-zinc-500 transition-colors">NOVEDADES</a>
              <a href="#" className="hover:text-zinc-500 transition-colors">MUJER</a>
              <a href="#" className="hover:text-zinc-500 transition-colors">HOMBRE</a>
            </div>

            <div className="flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowHistoryModal(true)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-zinc-500 transition-colors"
                  >
                    <History size={16} /> Mis Compras
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-black"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-zinc-500 transition-colors mr-2"
                >
                  <User size={16} /> Acceder
                </button>
              )}
              
              <button 
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors relative"
                onClick={() => setShowCartModal(true)}
              >
                <ShoppingBag size={20} className="text-zinc-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white p-8 shadow-2xl rounded-sm"
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full"
              >
                <X size={20} />
              </button>
              <h2 className="font-display text-2xl font-semibold uppercase tracking-tighter mb-2">
                {authMode === 'login' ? 'Bienvenido' : 'Crear Cuenta'}
              </h2>
              <p className="text-zinc-500 text-sm mb-8">
                {authMode === 'login' ? 'Accede a tu cuenta para guardar tus compras.' : 'Únete a AURA y guarda tus artículos favoritos.'}
              </p>
              
              <form onSubmit={handleAuth} className="space-y-6">
                {authMode === 'register' && (
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block mb-2">Nombre</label>
                    <input name="name" type="text" required className="w-full border-b border-zinc-200 py-2 focus:border-black outline-none transition-colors" placeholder="Tu nombre" />
                  </div>
                )}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block mb-2">Email</label>
                  <input name="email" type="email" required className="w-full border-b border-zinc-200 py-2 focus:border-black outline-none transition-colors" placeholder="ejemplo@correo.com" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block mb-2">Contraseña</label>
                  <input type="password" required className="w-full border-b border-zinc-200 py-2 focus:border-black outline-none transition-colors" placeholder="••••••••" />
                </div>
                <button type="submit" className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">
                  {authMode === 'login' ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
                </button>
              </form>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-xs text-zinc-400 hover:text-black underline underline-offset-4"
                >
                  {authMode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Accede'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white max-h-[80vh] overflow-hidden flex flex-col rounded-sm shadow-2xl"
            >
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
                <h2 className="font-display text-2xl font-semibold uppercase tracking-tighter">Historial de Compras</h2>
                <button 
                  onClick={() => setShowHistoryModal(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto">
                {currentUser?.history.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto text-zinc-200 mb-4" size={48} />
                    <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">No hay compras aún</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {currentUser?.history.map((purchase, idx) => (
                      <div key={idx} className="border border-zinc-100 p-6 rounded-sm">
                        <div className="flex justify-between items-end mb-6">
                          <div>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Pedido el {purchase.date}</p>
                            <h3 className="text-sm font-bold uppercase tracking-tighter">Pedido #{1000 + idx}</h3>
                          </div>
                          <span className="text-sm font-mono font-bold">${purchase.total.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                          {purchase.items.map((item, i) => (
                            <div key={i} className="flex-shrink-0 w-16 aspect-[3/4] bg-zinc-50 overflow-hidden rounded-sm border border-zinc-100 group">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-zinc-50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <Check size={12} className="text-green-600" /> ENTREGADO
                          </div>
                          <button className="text-zinc-400 hover:text-black underline underline-offset-4">Detalles</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCartModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCartModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <h2 className="font-display text-xl font-semibold uppercase tracking-tighter">Bolsa de Compra ({cart.length})</h2>
                <button 
                  onClick={() => setShowCartModal(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingBag size={48} className="text-zinc-100 mb-4" />
                    <p className="text-zinc-400 text-sm uppercase tracking-widest font-bold">Tu bolsa está vacía</p>
                    <button 
                      onClick={() => setShowCartModal(false)}
                      className="mt-6 text-xs font-bold underline underline-offset-4"
                    >
                      Seguir comprando
                    </button>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="w-20 aspect-[3/4] bg-zinc-50 overflow-hidden border border-zinc-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-sm font-medium uppercase tracking-tight">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(idx)}
                            className="text-zinc-300 hover:text-black transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-2">{item.category} · {item.size}</p>
                        <span className="text-sm font-mono font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="p-6 border-t border-zinc-100 space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total estimado</span>
                    <span className="text-xl font-mono font-bold">${cart.reduce((s, i) => s + i.price, 0).toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={savePurchase}
                    className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                  >
                    FINALIZAR Y GUARDAR COMPRA
                  </button>
                  <p className="text-[10px] text-zinc-400 text-center uppercase tracking-widest leading-relaxed px-4">
                    Al finalizar, esta compra se añadirá a tu historial personal de AURA.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
          >
            {notification.type === 'success' ? <Check size={16} className="text-green-400" /> : <div className="w-2 h-2 bg-zinc-400 rounded-full" />}
            <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar / Filters (Desktop) */}
          <aside className="hidden lg:block w-64 space-y-10">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-medium flex items-center gap-2">
                  <SlidersHorizontal size={18} /> FILTROS
                </h2>
                <button 
                  onClick={resetFilters}
                  className="text-xs text-zinc-400 hover:text-black underline underline-offset-4"
                >
                  Limpiar
                </button>
              </div>

              {/* Categorías */}
              <div className="space-y-4 mb-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Categoría</h3>
                {['Camisetas', 'Pantalones', 'Chaquetas'].map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                      <div className="w-4 h-4 border border-zinc-300 rounded-sm peer-checked:bg-black peer-checked:border-black transition-all" />
                      <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm font-medium group-hover:text-zinc-500 transition-colors uppercase tracking-tight">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>

              {/* Tallas */}
              <div className="space-y-4 mb-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Talla</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <label key={size} className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="size" 
                        className="sr-only peer"
                        checked={selectedSize === size}
                        onChange={() => setSelectedSize(size)}
                      />
                      <div className="h-10 border border-zinc-200 flex items-center justify-center text-sm font-medium peer-checked:bg-black peer-checked:text-white peer-checked:border-black transition-all hover:border-zinc-400 uppercase">
                        {size}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rango de Precio */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Precio Máximo</h3>
                  <span className="text-sm font-mono font-medium">${priceRange}</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="200" 
                  step="5"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-end mb-8 border-b border-zinc-100 pb-4">
              <p className="text-xs text-zinc-400 font-medium font-mono uppercase">
                Mostrando {filteredProducts.length} artículos
              </p>
              <div className="flex gap-4">
                <button className="text-xs font-bold border-b border-black pb-1">POPULARES</button>
                <button className="text-xs font-bold text-zinc-400 hover:text-black transition-colors pb-1">MÁS RECIENTES</button>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      key={product.id}
                      className="group cursor-pointer"
                      id={`product-${product.id}`}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 mb-4">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-[0.23, 1, 0.32, 1] group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          className="absolute bottom-4 left-4 right-4 bg-white py-3 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-black hover:text-white"
                        >
                          Añadir a la bolsa
                        </button>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium text-zinc-900 group-hover:text-zinc-500 transition-colors uppercase tracking-tight">
                            {product.name}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">{product.category} · {product.size}</p>
                        </div>
                        <span className="text-sm font-mono font-medium">${product.price.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                  <Filter className="text-zinc-300" size={32} />
                </div>
                <h3 className="text-xl font-display font-medium mb-2">No se encontraron productos</h3>
                <p className="text-zinc-500 text-sm mb-8">Intenta ajustar los filtros para encontrar lo que buscas.</p>
                <button 
                  onClick={resetFilters}
                  className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                >
                  Restablecer filtros
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-display text-xl font-semibold uppercase tracking-tighter">FILTRAR</h2>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Categorías</h3>
                  {['Camisetas', 'Pantalones', 'Chaquetas'].map(cat => (
                    <label key={cat} className="flex items-center gap-4 cursor-pointer" onClick={() => toggleCategory(cat)}>
                      <div className={`w-5 h-5 border rounded-sm flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-black border-black text-white' : 'border-zinc-300'}`}>
                        {selectedCategories.includes(cat) && <ChevronRight size={14} />}
                      </div>
                      <span className="text-sm font-medium uppercase tracking-tight">{cat}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Tallas</h3>
                  <div className="flex flex-wrap gap-3">
                    {['S', 'M', 'L', 'XL'].map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-12 w-12 border flex items-center justify-center text-sm font-medium transition-all ${selectedSize === size ? 'bg-black text-white border-black' : 'border-zinc-200'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Precio Máximo</h3>
                    <span className="text-sm font-mono font-medium">${priceRange}</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="200" 
                    step="5"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>

                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest mt-12"
                >
                  VER {filteredProducts.length} RESULTADOS
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <footer className="bg-zinc-50 border-t border-zinc-100 py-24 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <h2 className="font-display text-3xl font-semibold tracking-tighter uppercase mb-6">AURA</h2>
              <p className="text-zinc-500 text-sm max-w-md leading-relaxed">
                Diseño atemporal para el individuo moderno. Nuestra colección se centra en materiales de alta calidad y cortes minimalistas que trascienden las tendencias.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Ayuda</h3>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-black transition-colors">Envíos y Devoluciones</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Guía de Tallas</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Social</h3>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-black transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Pinterest</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-24 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">© 2026 AURA MINIMALIST. TODOS LOS DERECHOS RESERVADOS.</p>
            <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
              <a href="#" className="hover:text-black transition-colors">PRIVACY</a>
              <a href="#" className="hover:text-black transition-colors">TERMS</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/1234567890?text=Hola!%20Me%20interesa%20obtener%20más%20información%20sobre%20vuestros%20productos.${cart.length > 0 ? `%20Ahora%20mismo%20tengo%20${cart.length}%20artículos%20en%20cl%20carrito.` : ''}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center group"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:mr-3 transition-all duration-500 whitespace-nowrap font-bold text-sm">
          ¿Necesitas ayuda?
        </span>
        <MessageCircle size={24} className="text-white" />
      </a>
    </div>
  );
}
