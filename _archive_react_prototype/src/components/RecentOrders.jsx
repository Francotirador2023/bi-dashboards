import React from 'react';

const RecentOrders = ({ transactions }) => {
    return (
        <div className="glass-panel p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Recent Orders</h3>
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-400">
                            <th className="pb-3 px-4">Customer</th>
                            <th className="pb-3 px-4">Product</th>
                            <th className="pb-3 px-4">Amount</th>
                            <th className="pb-3 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="font-medium text-white">{tx.customer}</div>
                                    <div className="text-xs text-gray-500">{tx.date.toLocaleDateString()}</div>
                                </td>
                                <td className="py-4 px-4">{tx.product}</td>
                                <td className="py-4 px-4 font-medium">${tx.amount.toLocaleString()}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${tx.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                            tx.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-red-500/10 text-red-500'}`}>
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;
