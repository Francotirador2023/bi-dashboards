import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, CreditCard, Users } from 'lucide-react';

const iconMap = {
    DollarSign: DollarSign,
    ShoppingCart: ShoppingCart,
    CreditCard: CreditCard,
    Users: Users
};

const KPICard = ({ title, value, change, trend, icon, delay = 0 }) => {
    const Icon = iconMap[icon];
    const isPositive = trend === 'up';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="glass-panel p-6"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                    <Icon size={24} />
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {change}
                    </div>
                )}
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
        </motion.div>
    );
};

export default KPICard;
