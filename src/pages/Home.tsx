import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { smartSuggest, buildPrompt } from '../services/ai';
import { RecipeCard } from '../components/RecipeCard';
import { Smile, Sun, Briefcase, Moon, Coffee, Loader2, Sparkles } from 'lucide-react';


export function Home({ openTab }: { openTab: (t:string) => void }) {
  const { setHomeRecipes, homeRecipes } = useApp();
  const [loadingMsg, setLoadingMsg] = useState('');

  const moods = [
    { icon: '🌧️', label: 'Trời mưa' },
    { icon: '😴', label: 'Mệt mỏi' },
    { icon: '😊', label: 'Vui vẻ' },
    { icon: '😔', label: 'Buồn bã' },
    { icon: '🤤', label: 'Đói bụng' },
    { icon: '⚡', label: 'Vội vàng' },
    { icon: '🎉', label: 'Có khách' },
  ];

  const handleSuggest = async (mood: string) => {
    setLoadingMsg(`Đang tìm món phù hợp với: ${mood}...`);
    try {
      const p = buildPrompt({ moods: [mood], count: 3 });
      const recipes = await smartSuggest({ prompt: p, query: mood, onLayerChange: setLoadingMsg });
      setHomeRecipes(recipes);
    } catch(e) {
      console.error(e);
    }
    setLoadingMsg('');
  };

  const handleMealSuggest = (meal: string) => {
    openTab('suggest');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero -> col-span-8 */}
      <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col relative overflow-hidden mb-0">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles className="w-48 h-48 text-emerald-600" />
        </div>
        <div className="z-10 relative h-full flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-3 block">AI Personal Chef</span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-slate-800">Chào buổi sáng, Chef!<br/>Hôm nay ăn gì? 🤔</h1>
          <p className="text-slate-500 mb-8 max-w-lg">Sử dụng Mistral AI & Spoonacular để tìm kiếm công thức tối ưu dựa trên tủ lạnh hiện có của bạn.</p>
          <div className="flex flex-wrap gap-3 mt-auto">
            <button onClick={() => openTab('suggest')} className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-colors">✨ Tư vấn ngay</button>
            <button onClick={() => openTab('fridge')} className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-2xl font-bold shadow-sm transition-colors">🧊 Từ tủ lạnh</button>
          </div>
        </div>
      </div>

      {/* Mood -> col-span-4 bg-slate-900 */}
      <div className="md:col-span-4 bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col mb-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Smile className="text-emerald-400" />
            <span className="font-bold">Cảm xúc của bạn?</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded uppercase tracking-wider font-bold">AI Sync</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {moods.map(m => (
            <button key={m.label} onClick={() => handleSuggest(m.label)} className="px-3 py-2 bg-white/5 hover:bg-white/15 border border-white/10 text-white rounded-xl text-xs font-semibold transition-all shadow-sm">
              <span className="mr-1">{m.icon}</span> {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Meals -> col-span-12 bg-orange-100 */}
      <div className="md:col-span-12 bg-orange-100 rounded-3xl border border-orange-200 p-6 shadow-sm mb-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold"><Sun size={18}/></div>
          <h2 className="font-bold text-orange-900">Gợi ý theo bữa</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={() => handleMealSuggest('Bữa sáng')} className="p-4 bg-white hover:bg-orange-50 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center gap-2 transition-colors">
            <Sun size={24} className="text-orange-400" />
            <span className="font-semibold text-slate-700 text-sm">Bữa sáng</span>
          </button>
          <button onClick={() => handleMealSuggest('Bữa trưa')} className="p-4 bg-white hover:bg-orange-50 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center gap-2 transition-colors">
            <Briefcase size={24} className="text-blue-400" />
            <span className="font-semibold text-slate-700 text-sm">Bữa trưa</span>
          </button>
          <button onClick={() => handleMealSuggest('Bữa tối')} className="p-4 bg-white hover:bg-orange-50 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center gap-2 transition-colors">
            <Moon size={24} className="text-indigo-400" />
            <span className="font-semibold text-slate-700 text-sm">Bữa tối</span>
          </button>
          <button onClick={() => handleMealSuggest('Ăn vặt')} className="p-4 bg-white hover:bg-orange-50 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center gap-2 transition-colors">
            <Coffee size={24} className="text-amber-500" />
            <span className="font-semibold text-slate-700 text-sm">Ăn vặt</span>
          </button>
        </div>
      </div>

      {loadingMsg && (
        <div className="md:col-span-12 flex flex-col items-center justify-center p-8 bg-emerald-50 rounded-3xl shadow-sm border border-emerald-200 text-emerald-700">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p className="font-medium animate-pulse">{loadingMsg}</p>
        </div>
      )}

      {/* Results */}
      {homeRecipes.length > 0 && !loadingMsg && (
        <div className="md:col-span-12 space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800"><Sparkles className="text-emerald-500" size={20}/> Kết quả gợi ý</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {homeRecipes.map((r, i) => <RecipeCard key={i} recipe={r} />)}
          </div>
        </div>
      )}
    </div>
  );
}
