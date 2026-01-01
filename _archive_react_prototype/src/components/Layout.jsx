import React, { useState } from 'react';
import { LayoutDashboard, BarChart3, Settings, HelpCircle, Menu, X } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, currentView, onNavigate }) => {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'settings', icon: Settings, label: 'Settings' },
        { id: 'support', icon: HelpCircle, label: 'Support' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-30 h-screen w-64 bg-dark-card border-r border-white/5 transition-transform duration-300 lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-8 h-8 rounded bg-primary-600 flex items-center justify-center font-bold text-white">
                            BI
                        </div>
                        <h1 className="text-xl font-bold text-white">AnalyticsPro</h1>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                    ${currentView === item.id ? 'bg-primary-600/10 text-primary-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                `}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500" />
                            <div>
                                <p className="text-sm font-medium text-white">Jony R.</p>
                                <p className="text-xs text-gray-400">Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

const Layout = ({ children, currentView, onNavigate }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-dark-bg">
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(false)}
                currentView={currentView}
                onNavigate={onNavigate}
            />

            <div className="lg:pl-64">
                <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-dark-bg/80 backdrop-blur border-b border-white/5 z-10 px-4 flex items-center lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-gray-400 hover:text-white"
                    >
                        <Menu />
                    </button>
                    <span className="ml-4 font-bold text-white">Dashboard</span>
                </header>

                <main className="p-4 pt-20 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
