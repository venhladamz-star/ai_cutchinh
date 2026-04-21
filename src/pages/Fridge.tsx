import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { smartSuggest, buildPrompt, Recipe } from '../services/ai';
import { RecipeCard } from '../components/RecipeCard';
import { Snowflake, Plus, X, Loader2 } from 'lucide-react';

export function Fridge() {
  const { fridgeItems, setFridgeItems } = useApp();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const handleAdd = () => {
    if (!name.trim()) return;
    setFridgeItems([...fridgeItems, { id: Date.now(), name, date }]);
    setName('');
    setDate('');
  };

  const remove = (id: number) => setFridgeItems(fridgeItems.filter(i => i.id !== id));

  const handleSuggest = async () => {
    if (fridgeItems.length === 0) return alert('Tủ lạnh trống!');
    setLoadingMsg('Khởi tạo AI...');
    try {
      const inputs = fridgeItems.map(i => i.name);
      const p = buildPrompt({ fridgeItems: inputs, count: 4, extra: 'Ưu tiên nguyên liệu sắp hết hạn' });
      const res = await smartSuggest({ prompt: p, query: inputs.join(', '), inputIngredients: inputs, onLayerChange: setLoadingMsg });
      setRecipes(res);
    } catch(e) {
      console.error(e);
    }
    setLoadingMsg('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Left side: Fridge Manager */}
      <div className="md:col-span-5 bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2"><Snowflake className="text-emerald-400"/> Tủ Lạnh Thông Minh</h3>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full uppercase tracking-wider font-bold">{fridgeItems.length} Món</span>
        </div>
        
        <div className="space-y-4 flex-grow mb-6 overflow-y-auto scroller pr-2">
          {fridgeItems.length === 0 ? (
            <p className="text-slate-500 text-sm italic">Tủ lạnh đang trống...</p>
          ) : (
            fridgeItems.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                   {item.date && <span className="text-[10px] text-slate-500 italic uppercase">HSD: {item.date}</span>}
                   <button onClick={() => remove(item.id)} className="text-slate-600 hover:text-red-400 transition-colors"><X size={16}/></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-auto flex flex-col gap-3">
           <div className="flex bg-white/5 border border-white/10 rounded-2xl p-2 items-center">
              <input 
                type="text" 
                placeholder="Thêm nguyên liệu..." 
                className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500 px-3 text-sm" 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                onKeyDown={e=>e.key==='Enter'&&handleAdd()} 
              />
              <input 
                type="date" 
                className="bg-white/10 border-none outline-none text-white text-xs rounded-xl px-2 py-2 mr-2 w-[100px]" 
                value={date} 
                onChange={e=>setDate(e.target.value)} 
              />
              <button onClick={handleAdd} className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-colors text-xs uppercase tracking-wider shrink-0">Thêm</button>
           </div>
           
           {fridgeItems.length > 0 && (
             <button 
              onClick={handleSuggest} 
              disabled={!!loadingMsg}
              className="w-full py-4 bg-white hover:bg-slate-200 text-slate-900 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-70 mt-2"
             >
               {loadingMsg ? 'Đang tạo thực đơn...' : '🍳 Gợi ý món từ đồ trong tủ'}
             </button>
           )}
        </div>
      </div>

      {/* Right side: Results */}
      <div className="md:col-span-7 bg-transparent flex flex-col">
          {loadingMsg && (
            <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 rounded-3xl shadow-sm border border-emerald-200 text-emerald-700 h-full min-h-[300px]">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="font-bold tracking-widest uppercase text-xs animate-pulse">{loadingMsg}</p>
            </div>
          )}

          {recipes.length === 0 && !loadingMsg && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center h-full min-h-[300px]">
               <div className="text-center opacity-30">
                  <Snowflake size={64} className="mx-auto mb-4 text-emerald-500"/>
                  <p className="text-slate-800 font-bold uppercase tracking-widest">Chưa có gợi ý</p>
               </div>
            </div>
          )}

          {recipes.length > 0 && !loadingMsg && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 mb-2">Kết quả từ tủ lạnh</h2>
              <div className="grid grid-cols-1 gap-4">
                {recipes.map((r, i) => <RecipeCard key={i} recipe={r} />)}
              </div>
            </div>
          )}
      </div>
      
    </div>
  );
}
