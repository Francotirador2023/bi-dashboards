import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import KPICard from './components/KPICard';
import SalesChart from './components/SalesChart';
import MonthFilter from './components/MonthFilter';
import DonutChart from './components/DonutChart';
import HorizontalBar from './components/HorizontalBar';
import RecentOrders from './components/RecentOrders';
import AnalyticsView from './components/AnalyticsView';

// Import newly created Spanish helpers
import {
  generateData,
  aggregateSalesByMonth,
  aggregateSalesByDay,
  aggregateStats,
  aggregateCategories,
  getTopProducts
} from './data/generator';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(null); // null = Todo el año
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Data
  useEffect(() => {
    setTimeout(() => {
      const data = generateData();
      setAllTransactions(data);
      setLoading(false);
    }, 800);
  }, []);

  // Filter Logic: "Power BI Style" - Filter by Month Button
  const filteredData = useMemo(() => {
    if (loading) return [];
    if (selectedMonth === null) return allTransactions;

    // Filter by selected month index (0-11) of the CURRENT year in the dataset (most recent)
    // Since dataset covers last 12 months, we just check month index Match
    // Note: This simplistic filter gets ALL years' matching month if dataset > 1 year. 
    // For this generator (1 year), it works perfectly.
    return allTransactions.filter(t => t.date.getMonth() === selectedMonth);
  }, [allTransactions, selectedMonth, loading]);

  // Aggregations
  const stats = useMemo(() => aggregateStats(filteredData), [filteredData]);

  // GRANULARITY LOGIC: If looking at 1 month -> Daily. If looking at All Year -> Monthly.
  const salesChartData = useMemo(() => {
    return selectedMonth !== null
      ? aggregateSalesByDay(filteredData)
      : aggregateSalesByMonth(filteredData);
  }, [filteredData, selectedMonth]);

  const categoryData = useMemo(() => aggregateCategories(filteredData), [filteredData]);
  const topProductsData = useMemo(() => getTopProducts(filteredData), [filteredData]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {currentView === 'dashboard' ? 'Resumen Ejecutivo' : 'Analítica Avanzada'}
          </h2>
          <p className="text-gray-400 text-sm">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
        </div>

        {/* Month Filter Strip (Only on Dashboard) */}
        {currentView === 'dashboard' && (
          <div className="mt-4 md:mt-0 max-w-full overflow-hidden">
            <MonthFilter selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-[60vh] w-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            {/* --- DASHBOARD VIEW (POWER BI LAYOUT) --- */}
            {currentView === 'dashboard' && (
              <>
                {/* Row 1: KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div variants={itemVariants} className="col-span-1">
                    <KPICard title="Ingresos Totales" value={`$${stats.revenue.toLocaleString()}`} change="+12%" trend="up" icon="DollarSign" />
                  </motion.div>
                  <motion.div variants={itemVariants} className="col-span-1">
                    <KPICard title="Pedidos Totales" value={stats.orders.toLocaleString()} change="+5.4%" trend="up" icon="ShoppingCart" />
                  </motion.div>
                  <motion.div variants={itemVariants} className="col-span-1">
                    <KPICard title="Ticket Promedio" value={`$${stats.avgOrder.toFixed(0)}`} change="-2.1%" trend="down" icon="CreditCard" />
                  </motion.div>
                  <motion.div variants={itemVariants} className="col-span-1">
                    <KPICard title="Clientes Activos" value={stats.activeCustomers.toLocaleString()} change="+8.7%" trend="up" icon="Users" />
                  </motion.div>
                </div>

                {/* Row 2: Main Chart + Donut */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[350px]">
                  {/* Line Chart (2 Cols) */}
                  <motion.div variants={itemVariants} className="lg:col-span-2 h-full">
                    <SalesChart data={salesChartData} />
                  </motion.div>
                  {/* Donut Chart (1 Col) */}
                  <motion.div variants={itemVariants} className="lg:col-span-1 h-full">
                    <DonutChart data={categoryData} />
                  </motion.div>
                </div>

                {/* Row 3: High Density Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[300px]">
                  {/* Top Products */}
                  <motion.div variants={itemVariants} className="h-full">
                    <HorizontalBar title="Top Productos" data={topProductsData} dataKey="revenue" nameKey="name" />
                  </motion.div>

                  {/* Recent Orders Table */}
                  <motion.div variants={itemVariants} className="lg:col-span-2 h-full">
                    <RecentOrders transactions={filteredData.slice(0, 15)} />
                  </motion.div>
                </div>
              </>
            )}

            {/* --- ANALYTICS VIEW --- */}
            {currentView === 'analytics' && <AnalyticsView transactions={allTransactions} />}

            {/* --- SETTINGS/SUPPORT --- */}
            {(currentView === 'settings' || currentView === 'support') && (
              <div className="glass-panel p-20 text-center text-gray-500">
                <p className="text-xl">En construcción...</p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      )}
    </Layout>
  );
}

export default App;
