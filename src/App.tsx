import React, { useState } from 'react';
import { AppProvider } from './store/AppContext';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Suggest } from './pages/Suggest';
import { Fridge } from './pages/Fridge';
import { Shopping } from './pages/Shopping';
import { MealPlan } from './pages/MealPlan';
import { Delivery } from './pages/Delivery';
import { Profile } from './pages/Profile';
import { ChefHat } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 flex flex-col">
      {/* Header (Mobile) */}
      <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-center h-16">
        <div className="font-extrabold text-xl tracking-tight flex items-center gap-2 text-slate-800">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
            <ChefHat className="text-white" size={18} />
          </div>
          CookMaster <span className="text-emerald-600 italic font-normal ml-0.5">Pro</span>
        </div>
      </header>

      {/* Header (Desktop) */}
      <header className="hidden md:flex fixed top-0 w-64 h-16 bg-white border-r border-b border-slate-200 z-50 items-center px-6">
        <div className="font-extrabold text-xl tracking-tight flex items-center gap-2 text-slate-800">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
            <ChefHat className="text-white" size={18} />
          </div>
          CookMaster <span className="text-emerald-600 italic font-normal ml-0.5">Pro</span>
        </div>
      </header>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="md:ml-64 p-4 md:p-6 md:pt-22 pb-24 md:pb-6 max-w-6xl mx-auto scroller flex-grow w-full">
        <div className={activeTab === 'home' ? 'block' : 'hidden'}><Home openTab={setActiveTab} /></div>
        <div className={activeTab === 'suggest' ? 'block' : 'hidden'}><Suggest /></div>
        <div className={activeTab === 'fridge' ? 'block' : 'hidden'}><Fridge /></div>
        <div className={activeTab === 'shopping' ? 'block' : 'hidden'}><Shopping /></div>
        <div className={activeTab === 'mealplan' ? 'block' : 'hidden'}><MealPlan /></div>
        <div className={activeTab === 'delivery' ? 'block' : 'hidden'}><Delivery /></div>
        <div className={activeTab === 'profile' ? 'block' : 'hidden'}><Profile /></div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
