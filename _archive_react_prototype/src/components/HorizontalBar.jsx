import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const HorizontalBar = ({ title, data, dataKey, nameKey, color = "#3b82f6" }) => {

    return (
        <div className="glass-panel p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
            <div className="flex-grow min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey={nameKey}
                            type="category"
                            stroke="#94a3b8"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            width={100}
                        />
                        <Tooltip
                            cursor={{ fill: '#ffffff', opacity: 0.05 }}
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            formatter={(val) => dataKey === 'revenue' ? `$${val.toLocaleString()}` : val}
                        />
                        <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={color} fillOpacity={1 - (index * 0.1)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HorizontalBar;
