import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { User, Users, Plus, X, Heart, ShieldAlert, Target } from 'lucide-react';

export function Profile() {
  const {
    familyMembers, setFamilyMembers,
    allergies, setAllergies,
    preferences, setPreferences,
    goals, setGoals
  } = useApp();

  const [famName, setFamName] = useState('');
  const [famPref, setFamPref] = useState('Bình thường');

  const addFamily = () => {
    if (!famName.trim()) return;
    setFamilyMembers([...familyMembers, { name: famName, pref: famPref }]);
    setFamName('');
  };

  const removeFamily = (idx: number) => {
    const list = [...familyMembers];
    list.splice(idx, 1);
    setFamilyMembers(list);
  };

  const toggleArr = (item: string, arr: string[], setArr: any) => {
    if (arr.includes(item)) setArr(arr.filter(i => i !== item));
    else setArr([...arr, item]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Family */}
      <div className="md:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800"><Users className="text-emerald-500"/> Thành viên gia đình</h2>
        
        <div className="flex-grow space-y-3 mb-6">
          {familyMembers.length === 0 ? (
             <p className="text-slate-500 text-sm italic">Chưa có thành viên nào.</p>
          ) : (
            familyMembers.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">{m.name.charAt(0)}</div>
                  <div>
                    <div className="font-bold text-slate-800">{m.name}</div>
                    <div className="text-xs text-slate-500 uppercase font-medium tracking-wide">{m.pref}</div>
                  </div>
                </div>
                <button onClick={() => removeFamily(i)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"><X size={18}/></button>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          <input
            type="text"
            value={famName}
            onChange={e => setFamName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addFamily()}
            placeholder="Tên (vd: Bé Bi)"
            className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <select value={famPref} onChange={e => setFamPref(e.target.value)} className="sm:w-40 bg-slate-100 border-none rounded-2xl px-4 py-4 text-sm focus:outline-none">
            <option>Bình thường</option>
            <option>Ăn dặm</option>
            <option>Ăn nhạt</option>
            <option>Ăn chay</option>
            <option>Kiêng ngọt</option>
          </select>
          <button onClick={addFamily} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2">
            <Plus size={18}/> Thêm
          </button>
        </div>
      </div>

      {/* Goals */}
      <div className="md:col-span-4 bg-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6"><Target className="text-emerald-400"/> Mục tiêu của bạn</h2>
          <div className="grid grid-cols-2 gap-3 flex-grow">
            {[
              { id: 'Giảm cân', icon: '⚖️', desc: 'Ít calo, nhiều rau' },
              { id: 'Tăng cơ', icon: '💪', desc: 'Giàu protein' },
              { id: 'Tiết kiệm', icon: '💰', desc: 'Nguyên liệu rẻ' },
              { id: 'Nhanh gọn', icon: '⚡', desc: 'Dưới 15 phút' },
            ].map(g => (
              <button 
                key={g.id}
                onClick={() => toggleArr(g.id, goals, setGoals)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-center h-24 ${goals.includes(g.id) ? 'bg-emerald-600 border-transparent shadow-lg text-white' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'}`}
              >
                <div className="font-bold text-sm mb-1 text-white">{g.icon} {g.id}</div>
                <div className="text-[10px] opacity-70 leading-snug">{g.desc}</div>
              </button>
            ))}
          </div>
      </div>

      <div className="md:col-span-12 bg-orange-100 p-6 md:p-8 rounded-3xl border border-orange-200 shadow-sm flex flex-col md:flex-row gap-6">
          {/* Allergies */}
          <div className="flex-1">
            <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4 text-orange-900"><ShieldAlert size={14} className="text-orange-500"/> Dị ứng / Kiêng khem</h2>
            <div className="flex flex-wrap gap-2">
              {['Hải sản', 'Lạc/Đậu phộng', 'Gluten', 'Sữa', 'Trứng', 'Đậu nành'].map(a => (
                <button 
                  key={a}
                  onClick={() => toggleArr(a, allergies, setAllergies)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide border transition-all ${allergies.includes(a) ? 'bg-red-50 text-red-700 border-red-200 shadow-sm' : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block w-px bg-orange-200"></div>

          {/* Preferences */}
          <div className="flex-1">
            <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4 text-orange-900"><Heart size={14} className="text-emerald-600"/> Sở thích</h2>
            <div className="flex flex-wrap gap-2">
              {['Cay', 'Chua', 'Ăn chay', 'Không hành', 'Không rau mùi', 'Keto'].map(p => (
                <button 
                  key={p}
                  onClick={() => toggleArr(p, preferences, setPreferences)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide border transition-all ${preferences.includes(p) ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
      </div>
      
    </div>
  );
}
