import React from 'react';

const MonthFilter = ({ selectedMonth, onSelectMonth }) => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    return (
        <div className="glass-panel p-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
                onClick={() => onSelectMonth(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                    ${selectedMonth === null ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
                `}
            >
                Todo el Año
            </button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            {months.map((m, idx) => (
                <button
                    key={m}
                    onClick={() => onSelectMonth(idx)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all min-w-[3rem]
                        ${selectedMonth === idx ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
                    `}
                >
                    {m}
                </button>
            ))}
        </div>
    );
};

export default MonthFilter;
