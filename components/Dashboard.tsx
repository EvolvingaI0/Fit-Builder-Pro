
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FitnessPlanView from './FitnessPlanView';
import DietPlanView from './DietPlanView';
import FoodScanner from './FoodScanner';
import Tools from './Tools';
import Settings from './Settings';
import Home from './Home';
import Logo from './common/Logo';
import { UserIcon, HomeIcon, FireIcon, BookOpenIcon, CameraIcon, WrenchScrewdriverIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import WhatsAppChatbot from './common/WhatsAppChatbot';


type View = 'home' | 'fitness' | 'diet' | 'scanner' | 'tools' | 'settings';

type NavLinkProps = {
    item: {id: View, label: string, icon: React.ElementType};
    active: boolean;
    onClick: () => void;
};

function NavLink({ item, active, onClick }: NavLinkProps) {
    const Icon = item.icon;
    return (
        <button onClick={onClick} className={`flex items-center space-x-4 p-3 my-1 w-full rounded-lg transition-all duration-200 ${active ? 'bg-primary text-primary-content shadow-md shadow-primary/30' : 'text-text-secondary hover:text-text-primary hover:bg-primary/10'}`}>
            <Icon className="h-6 w-6" />
            <span className="font-semibold">{item.label}</span>
        </button>
    )
};

type SidebarContentProps = {
    activeView: View;
    setActiveView: (view: View) => void;
};

function SidebarContent({ activeView, setActiveView }: SidebarContentProps) {
    const { currentUser, logout } = useAuth();

    const navItems = [
        { id: 'home', label: 'Início', icon: HomeIcon },
        { id: 'fitness', label: 'Plano de Treino', icon: FireIcon },
        { id: 'diet', label: 'Plano de Dieta', icon: BookOpenIcon },
        { id: 'scanner', label: 'Scanner de Alimentos', icon: CameraIcon },
        { id: 'tools', label: 'Ferramentas', icon: WrenchScrewdriverIcon },
    ];
    return (
         <>
            <div className="flex items-center space-x-3 mb-10 px-2 pt-2">
                <Logo className="w-12 h-12 text-primary" />
                <h1 className="text-2xl font-bold text-text-primary">FitBuilder</h1>
            </div>
            <nav className="flex-1">
            {navItems.map(item => (
                <NavLink key={item.id} item={item as {id: View, label: string, icon: React.ElementType}} active={activeView === item.id} onClick={() => setActiveView(item.id as View)} />
            ))}
            </nav>
            <div>
                 <div className="border-t border-border mt-4 pt-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-background">
                         <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-secondary-content">
                            <UserIcon className="w-6 h-6"/>
                        </div>
                        <div>
                            <p className="font-bold text-text-primary">{currentUser?.profile?.name}</p>
                            <p className="text-xs text-text-secondary">{currentUser?.email}</p>
                        </div>
                    </div>
                 </div>
                <div className="border-t border-border mt-4 pt-4">
                    <NavLink item={{ id: 'settings', label: 'Configurações', icon: Cog6ToothIcon }} active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
                    <button onClick={logout} className="flex items-center space-x-4 p-3 my-1 w-full rounded-lg text-text-secondary hover:bg-red-50 hover:text-red-600 transition-colors">
                        <ArrowLeftOnRectangleIcon className="h-6 w-6"/>
                        <span className="font-semibold">Sair</span>
                    </button>
                </div>
            </div>
        </>
    )
}

function Dashboard() {
  const [activeView, setActiveView] = useState<View>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarClosing, setIsSidebarClosing] = useState(false);

  const handleSetView = (view: View) => {
    setActiveView(view);
    if (window.innerWidth < 1024) { // lg breakpoint in tailwind
        handleCloseSidebar();
    }
  }
  
  const handleCloseSidebar = () => {
    setIsSidebarClosing(true);
    setTimeout(() => {
        setIsSidebarOpen(false);
        setIsSidebarClosing(false);
    }, 300); // must match animation duration
  }

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <Home setActiveView={handleSetView} />;
      case 'fitness':
        return <FitnessPlanView />;
      case 'diet':
        return <DietPlanView />;
      case 'scanner':
        return <FoodScanner />;
      case 'tools':
        return <Tools />;
      case 'settings':
        return <Settings />;
      default:
        return <Home setActiveView={handleSetView}/>;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar */}
      {isSidebarOpen && (
          <>
            <div 
                className={`fixed inset-0 bg-black/40 z-40 lg:hidden ${isSidebarClosing ? 'animate-backdropOut' : 'animate-backdropIn'}`}
                onClick={handleCloseSidebar}
                aria-hidden="true"
            ></div>
            <aside 
                className={`fixed top-0 left-0 h-full w-64 bg-surface flex flex-col p-4 z-50 lg:hidden ${isSidebarClosing ? 'animate-slideOut' : 'animate-slideIn'}`}
            >
                <SidebarContent activeView={activeView} setActiveView={handleSetView} />
            </aside>
          </>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-surface hidden lg:flex flex-col p-4 border-r border-border shadow-sm">
        <SidebarContent activeView={activeView} setActiveView={handleSetView} />
      </aside>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex justify-between items-center p-4 bg-surface border-b border-border">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-text-primary">
                <Bars3Icon className="w-6 h-6"/>
            </button>
            <Logo className="w-9 h-9 text-primary"/>
            <div className="w-6"/>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto animate-fadeIn">
            {renderView()}
        </main>
      </div>
      <WhatsAppChatbot />
    </div>
  );
};

export default Dashboard;
