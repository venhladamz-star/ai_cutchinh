import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ShoppingCart, Plus, CheckCircle2, Circle, Trash2, Share } from 'lucide-react';

export function Shopping() {
  const { shoppingList, setShoppingList } = useApp();
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    setShoppingList([...shoppingList, { name, qty, done: false }]);
    setName('');
    setQty('');
  };

  const toggle = (idx: number) => {
    const list = [...shoppingList];
    list[idx].done = !list[idx].done;
    setShoppingList(list);
  };

  const remove = (idx: number) => {
    const list = [...shoppingList];
    list.splice(idx, 1);
    setShoppingList(list);
  };

  const clearDone = () => setShoppingList(shoppingList.filter(s => !s.done));

  const shareList = () => {
    const text = shoppingList.map(s => `${s.done ? '✓' : '○'} ${s.name} ${s.qty}`).join('\n');
    navigator.clipboard.writeText('📋 Danh sách mua sắm:\n' + text);
    alert('Đã copy!');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Controls -> col-span-4 */}
      <div className="md:col-span-5 bg-orange-100 p-6 md:p-8 rounded-3xl border border-orange-200 shadow-sm flex flex-col h-full">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-orange-900">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white"><ShoppingCart size={16}/></div>
          Thêm vào giỏ
        </h2>
        
        <div className="flex flex-col gap-3 mt-auto">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Tên nguyên liệu (vd: Thịt bò)"
            className="w-full bg-white border border-orange-50 rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
          <div className="flex gap-3">
             <input
               type="text"
               value={qty}
               onChange={e => setQty(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleAdd()}
               placeholder="Số lượng"
               className="flex-1 bg-white border border-orange-50 rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
             />
             <button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-xl font-bold shadow-sm transition-colors flex justify-center items-center gap-2">
               <Plus size={18}/>
             </button>
          </div>
        </div>
      </div>

      {/* List -> col-span-7 */}
      <div className="md:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col min-h-[400px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">📝 Danh sách cần mua</h2>
          <div className="flex gap-2">
            <button onClick={shareList} className="text-[11px] font-bold uppercase tracking-widest px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-full transition-colors flex items-center gap-2">
              <Share size={14}/> Chia sẻ
            </button>
            <button onClick={clearDone} className="text-[11px] font-bold uppercase tracking-widest px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-colors flex items-center gap-2">
              <Trash2 size={14}/> Xóa xong
            </button>
          </div>
        </div>

        <div className="space-y-2 flex-grow">
          {shoppingList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 h-full">
              <ShoppingCart size={48} className="mb-4 text-slate-200"/>
              <p className="font-bold tracking-widest uppercase text-xs">Danh sách rỗng</p>
            </div>
          ) : (
            shoppingList.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 lg:p-4 rounded-2xl border transition-colors ${item.done ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}>
                <button onClick={() => toggle(i)} className={`${item.done ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-400'} transition-colors shrink-0`}>
                  {item.done ? <CheckCircle2 size={24}/> : <Circle size={24}/>}
                </button>
                <div className={`flex-1 font-bold ${item.done ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                  {item.name}
                </div>
                {item.qty && <div className={`text-sm font-medium ${item.done ? 'text-slate-400' : 'text-slate-500'}`}>{item.qty}</div>}
                <button onClick={() => remove(i)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0">
                  <Trash2 size={18}/>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
