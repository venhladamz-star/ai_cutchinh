import React, { useState } from 'react';
import { generateDelivery } from '../services/ai';
import { Bike, Search, Star, Loader2, Clock } from 'lucide-react';

export function Delivery() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [shops, setShops] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    const data = await generateDelivery(query);
    setShops(data);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Search Bar */}
      <div className="md:col-span-12 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 p-8 opacity-5">
          <Bike className="w-48 h-48 text-emerald-600" />
        </div>
        <div className="z-10 w-full max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-slate-800">Đặt món giao tận nơi</h2>
          <p className="text-sm text-slate-500 mb-6 uppercase tracking-widest font-bold">Tìm kiếm nhanh qua AI</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center shadow-inner">
              <Search className="text-slate-400 mr-2" size={18} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Tìm món muốn đặt (vd: Cơm tấm, trà sữa...)"
                className="bg-transparent border-none outline-none w-full text-slate-700 placeholder-slate-400"
              />
            </div>
            <button onClick={handleSearch} disabled={loading} className="h-14 sm:w-32 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shrink-0">
              {loading ? <Loader2 className="animate-spin" size={18}/> : 'Tìm kiếm'}
            </button>
          </div>
        </div>
      </div>

      {(shops.length > 0 || loading) && (
        <div className="md:col-span-12 space-y-4 mt-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800"><Star className="text-emerald-500" fill="currentColor" size={20}/> Kết quả tìm kiếm bằng AI</h2>
          {loading ? (
             <div className="flex flex-col items-center justify-center p-12 bg-emerald-50 border border-emerald-100 rounded-3xl">
                <Loader2 className="animate-spin text-emerald-600 mb-4" size={32}/>
                <p className="text-xs uppercase tracking-widest font-bold text-emerald-700 animate-pulse">Đang quét các quán xung quanh...</p>
             </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {shops.map((s, i) => (
                <div key={i} className="flex gap-4 p-5 bg-white border border-slate-200 rounded-3xl hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-3xl font-bold group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0">
                    {s.name.charAt(0)}
                  </div>
                  <div className="flex-col flex flex-1 min-w-0 justify-center">
                    <h3 className="font-bold text-slate-800 truncate text-lg">{s.name}</h3>
                    <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest font-bold text-slate-500 mt-2">
                      <span className="flex items-center text-amber-500"><Star size={12} className="mr-1 fill-current"/> {s.rating || '4.5'}</span>
                      <span className="flex items-center"><Clock size={12} className="mr-1 text-slate-400"/> {s.time || '15p'}</span>
                      <span className="flex items-center text-emerald-600"><Bike size={12} className="mr-1"/> {s.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
