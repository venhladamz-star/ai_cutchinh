import React from 'react';
import { Home, Sparkles, Snowflake, ShoppingCart, Calendar, Bike, User } from 'lucide-react';

const TABS = [
  { id: 'home', icon: Home, label: 'Trang chủ' },
  { id: 'suggest', icon: Sparkles, label: 'Gợi ý' },
  { id: 'fridge', icon: Snowflake, label: 'Tủ lạnh' },
  { id: 'shopping', icon: ShoppingCart, label: 'Mua sắm' },
  { id: 'mealplan', icon: Calendar, label: 'Thực đơn' },
  { id: 'delivery', icon: Bike, label: 'Đặt ăn' },
  { id: 'profile', icon: User, label: 'Hồ sơ' },
];

export function Navigation({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-200 z-10 pt-16">
        <div className="flex flex-col gap-1 p-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${activeTab === tab.id ? 'bg-slate-100 text-emerald-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-[72px] bg-white border-t border-slate-200 z-50 flex items-center justify-around pb-safe px-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activeTab === tab.id ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-900 font-medium'}`}
          >
            <tab.icon size={20} className={activeTab === tab.id ? 'text-emerald-600' : ''} />
            <span className="text-[10px] tracking-wide">{tab.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
