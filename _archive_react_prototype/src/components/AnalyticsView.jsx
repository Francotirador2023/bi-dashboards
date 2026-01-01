import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { aggregateCategories } from '../data/generator';

const AnalyticsView = ({ transactions }) => {
    const categoryDistribution = useMemo(() => aggregateCategories(transactions), [transactions]);

    // Sort transactions by date and take top performers (simplified logic for demo: group by product)
    const topProducts = useMemo(() => {
        const products = {};
        transactions.forEach(t => {
            if (t.status === 'Cancelled') return;
            if (!products[t.product]) products[t.product] = 0;
            products[t.product] += t.amount;
        });

        return Object.keys(products)
            .map(key => ({ name: key, revenue: products[key] }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    }, [transactions]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Performance Bar Chart */}
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Top Product Revenue</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} width={130} />
                                <Tooltip
                                    cursor={{ fill: '#334155', opacity: 0.2 }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    formatter={(val) => `$${val.toLocaleString()}`}
                                />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution Pie Chart */}
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Sales by Category</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {categoryDistribution.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs text-gray-300">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
