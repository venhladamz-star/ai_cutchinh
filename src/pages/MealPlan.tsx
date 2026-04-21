import React, { useState } from 'react';
import { generateMealPlan } from '../services/ai';
import { Calendar, Loader2, RefreshCw } from 'lucide-react';

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
const MEALS = ['Sáng', 'Trưa', 'Tối'];

export function MealPlan() {
  const [mealPlan, setMealPlan] = useState<Record<string, string[]>>({
    "Thứ 2": ["Bún bò", "Cơm tấm", "Phở lợn"],
    "Thứ 3": ["Xôi xéo", "Bánh mì nghêu", "Gà chiên"],
    "Thứ 4": ["Hủ tiếu", "Lẩu Thái", "Bún chả"],
    "Thứ 5": ["Cơm chiên", "Salad", "Steak"],
    "Thứ 6": ["Bánh cuốn", "Cơm sườn", "Mì Ý"],
    "Thứ 7": ["Phở bò", "Lẩu nấm", "Bánh xèo"],
    "Chủ nhật": ["Dimsum", "Cơm niêu", "Hải sản"]
  });
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    setLoading(true);
    const data = await generateMealPlan();
    setMealPlan(data);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Overview/Controls */}
      <div className="md:col-span-12 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-0">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
           <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center"><Calendar size={20}/></div>
           Thực đơn tuần này
        </h2>
        <button 
          onClick={handleGen} 
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
        >
          {loading ? <Loader2 className="animate-spin" size={18}/> : <RefreshCw size={18}/>}
          {loading ? 'Đang lên đơn...' : 'Tạo mới bằng AI'}
        </button>
      </div>

      <div className="md:col-span-12 grid grid-cols-1 lg:grid-cols-7 gap-4">
          {DAYS.map((d, index) => {
            const meals = mealPlan[d] || [];
            // Make current day stand out slightly if needed, or just all same
            const isToday = index === 0; // Simple mock for today

            return (
              <div key={d} className={`flex flex-col p-5 rounded-3xl border transition-colors h-full ${isToday ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                <div className={`font-bold text-lg mb-4 pb-3 border-b ${isToday ? 'text-orange-700 border-orange-200' : 'text-slate-700 border-slate-200'}`}>{d}</div>
                <div className="flex flex-col gap-3 flex-grow">
                  {MEALS.map((m, i) => (
                    <div key={m} className={`bg-white px-3 py-3 rounded-2xl border shadow-sm text-sm flex flex-col gap-1 ${isToday ? 'border-orange-100' : 'border-slate-100'}`}>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? 'text-orange-400' : 'text-slate-400'}`}>{m}</span>
                      <span className="font-bold text-slate-800 leading-snug">{meals[i] || '---'}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>

    </div>
  );
}
