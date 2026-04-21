import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { smartSuggest, buildPrompt } from '../services/ai';
import { RecipeCard } from '../components/RecipeCard';
import { Loader2, Mic, Plus, X, Search, Clock, Target } from 'lucide-react';

export function Suggest() {
  const { 
    ingredients, setIngredients,
    selectedDevices, setSelectedDevices,
    selectedEmotions, setSelectedEmotions,
    suggestRecipes, setSuggestRecipes
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [mealFilter, setMealFilter] = useState('');

  const addIngredient = () => {
    if (!inputVal.trim()) return;
    const newItems = inputVal.split(',').map(x => x.trim()).filter(Boolean);
    const set = new Set([...ingredients, ...newItems]);
    setIngredients(Array.from(set));
    setInputVal('');
  };

  const removeIng = (ing: string) => setIngredients(ingredients.filter(i => i !== ing));

  const toggleDevice = (dev: string) => {
    if (selectedDevices.includes(dev)) setSelectedDevices(selectedDevices.filter(d => d !== dev));
    else setSelectedDevices([...selectedDevices, dev]);
  };

  const toggleEmotion = (emo: string) => {
    if (selectedEmotions.includes(emo)) setSelectedEmotions(selectedEmotions.filter(e => e !== emo));
    else setSelectedEmotions([...selectedEmotions, emo]);
  };

  const handleSuggest = async () => {
    setLoadingMsg('Khởi tạo AI...');
    try {
      const p = buildPrompt({
        ingredients,
        timeFilter,
        mealFilter,
        moods: selectedEmotions,
        devices: selectedDevices,
        count: 4
      });
      const query = ingredients.join(' ') || 'món ăn dễ làm';
      const recipes = await smartSuggest({ prompt: p, query, inputIngredients: ingredients, onLayerChange: setLoadingMsg });
      setSuggestRecipes(recipes);
    } catch(e) {
      console.error(e);
    }
    setLoadingMsg('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Nguyên liệu -> col-span-8 */}
      <div className="md:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden h-full">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
          <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex justify-center items-center"><Mic size={16}/></div>
          Nguyên liệu có sẵn
        </h2>

        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 mt-2">
            {ingredients.map(ing => (
              <span key={ing} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-sm font-bold tracking-wide flex items-center gap-1.5 border border-emerald-200 shadow-sm">
                {ing} <button onClick={() => removeIng(ing)} className="opacity-60 hover:opacity-100"><X size={14}/></button>
              </span>
            ))}
          </div>
        )}

        <div className="text-xs text-slate-500 mb-6 flex flex-wrap items-center gap-2 font-medium">
          <span className="uppercase tracking-widest font-bold text-slate-400">💡 Gợi ý nhanh:</span>
          {[['trứng','cà chua'], ['thịt bò','hành tây'], ['mì gói','trứng']].map((pair, idx) => (
             <button key={idx} onClick={() => setIngredients(Array.from(new Set([...ingredients, ...pair])))} className="text-emerald-600 hover:text-emerald-700 hover:underline">
               {pair.join(' + ')}
             </button>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-auto relative z-10 w-full">
          <div className="flex-grow bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-center shadow-inner">
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addIngredient()}
              placeholder="VD: trứng, thịt, rau..."
              className="bg-transparent border-none outline-none w-full text-slate-700 placeholder-slate-400"
            />
          </div>
          <button onClick={addIngredient} className="h-14 sm:w-28 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-colors shrink-0 flex items-center justify-center gap-1">
            <Plus size={18}/> Thêm
          </button>
        </div>
      </div>

      {/* Filters -> col-span-4 bg-emerald-900 */}
      <div className="md:col-span-4 bg-emerald-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col justify-center">
        <h2 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-6 flex items-center gap-2"><Search size={16}/> Bộ lọc tìm kiếm</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Thời gian nấu</label>
            <select value={timeFilter} onChange={e => setTimeFilter(e.target.value)} className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400">
              <option value="" className="text-slate-900">Tất cả</option>
              <option value="Dưới 15 phút" className="text-slate-900">Dưới 15 phút (Nhanh)</option>
              <option value="Dưới 30 phút" className="text-slate-900">Dưới 30 phút</option>
              <option value="Dưới 60 phút" className="text-slate-900">Dưới 60 phút</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Loại bữa</label>
            <select value={mealFilter} onChange={e => setMealFilter(e.target.value)} className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400">
              <option value="" className="text-slate-900">Tất cả</option>
              <option value="Bữa sáng" className="text-slate-900">Bữa sáng</option>
              <option value="Bữa trưa" className="text-slate-900">Bữa trưa</option>
              <option value="Bữa tối" className="text-slate-900">Bữa tối</option>
              <option value="Ăn vặt" className="text-slate-900">Ăn vặt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Thiết bị & Hòan Cảnh -> md:col-span-12 */}
      <div className="md:col-span-12 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800"><Target className="text-orange-500" size={20}/> Thiết bị & Hoàn cảnh</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3 block">Đồ bếp có sẵn</p>
            <div className="flex flex-wrap gap-2">
              {['Nồi chiên không dầu', 'Lò vi sóng', 'Lò nướng', 'Bếp từ'].map(dev => (
                <button key={dev} onClick={() => toggleDevice(dev)} className={`px-4 py-2 text-xs font-bold tracking-wide rounded-xl transition-all ${selectedDevices.includes(dev) ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {dev}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3 block">Tình huống</p>
            <div className="flex flex-wrap gap-2">
              {['Trời mưa', 'Đãi khách', 'Giảm cân', 'Tăng cơ', 'Ăn nhanh'].map(emo => (
                <button key={emo} onClick={() => toggleEmotion(emo)} className={`px-4 py-2 text-xs font-bold tracking-wide rounded-xl transition-all ${selectedEmotions.includes(emo) ? 'bg-orange-100 border border-orange-200 text-orange-700 shadow-sm' : 'bg-slate-100 border border-transparent text-slate-600 hover:bg-slate-200'}`}>
                  {emo}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleSuggest} 
        disabled={!!loadingMsg}
        className="md:col-span-12 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-5 rounded-3xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
      >
        {loadingMsg ? <><Loader2 className="animate-spin" /> Đang thiết kế công thức...</> : '✨ Gợi ý món ăn ngay'}
      </button>

      {loadingMsg && (
        <div className="md:col-span-12 text-center py-8 opacity-80 animate-pulse text-emerald-700 font-bold tracking-wide bg-emerald-50 rounded-3xl border border-emerald-100">
          {loadingMsg}
        </div>
      )}

      {suggestRecipes.length > 0 && !loadingMsg && (
        <div className="md:col-span-12 space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Kết quả gợi ý</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {suggestRecipes.map((r, i) => <RecipeCard key={i} recipe={r} />)}
          </div>
        </div>
      )}

    </div>
  );
}
