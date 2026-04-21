import React from 'react';
import { useApp } from '../store/AppContext';
import { Recipe } from '../services/ai';
import { Heart, ShoppingBag, Clock, Flame, ChefHat } from 'lucide-react';

export function LayerBadge({ source }: { source?: string }) {
  if (!source) return null;
  if (source === 'beeknoee') {
    return <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 shadow-sm">💎 Beeknoee AI</div>;
  }
  if (source === 'mistral') {
    return <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 shadow-sm">🤖 Mistral AI</div>;
  }
  if (source === 'spoonacular') {
    return <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 shadow-sm">🛡️ Spoonacular</div>;
  }
  return <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg border border-slate-200 shadow-sm">📦 Offline</div>;
}

export const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const { shoppingList, setShoppingList } = useApp();

  const handleAddShop = () => {
    const newItems = recipe.ingredients.map(i => ({ name: i, qty: '', done: false }));
    setShoppingList([...shoppingList, ...newItems]);
    alert('Đã thêm nguyên liệu vào giỏ');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-shadow hover:shadow-md">
      <div className="p-5 border-b border-slate-100 flex items-start gap-4 h-full">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center text-4xl shrink-0">
            {recipe.emoji || '🍽️'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="mb-2"><LayerBadge source={recipe.source} /></div>
          <h3 className="text-lg font-bold truncate text-slate-800">{recipe.name}</h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-snug">{recipe.desc}</p>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
        <span className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-500"/> {recipe.time}</span>
        <span className="flex items-center gap-1.5 ml-2"><ChefHat size={14} className="text-emerald-500"/> {recipe.difficulty}</span>
        <span className="flex items-center gap-1.5 ml-2"><Flame size={14} className="text-orange-500"/> {recipe.calories}</span>
      </div>

      <div className="p-5 flex flex-col gap-4 flex-grow">
        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nguyên liệu</h4>
          <div className="flex flex-wrap gap-1.5">
            {recipe.ingredients.map((ing, i) => {
              const isMatch = recipe.matchedInputs?.some(m => ing.toLowerCase().includes(m) || m.includes(ing.toLowerCase()));
              return (
                <span key={i} className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${isMatch ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  {ing}
                </span>
              );
            })}
          </div>
        </div>
        
        <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cách làm</h4>
            <ol className="text-sm text-slate-600 flex flex-col gap-2">
              {recipe.steps.map((s, i) => (
                <li key={i} className="flex gap-2 isolate">
                  <span className="bg-slate-200 text-slate-700 font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-[10px] mt-0.5">{i+1}</span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
        </div>

        {recipe.tips && (
          <div className="bg-amber-50 text-amber-800 text-sm p-3 rounded-2xl border border-amber-100/50 mt-auto">
            <strong className="font-bold mr-1">💡 Mẹo:</strong> {recipe.tips}
          </div>
        )}
      </div>

      <div className="p-5 pt-0 flex gap-2">
        <button onClick={handleAddShop} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl py-3 text-sm font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors">
          <ShoppingBag size={16}/> Mua thêm
        </button>
        <button className="bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-2xl px-5 flex items-center justify-center transition-colors">
          <Heart size={16}/>
        </button>
      </div>
    </div>
  );
}
