
import React from 'react';

interface CardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
  description?: string;
  trend?: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, color, description, trend }) => {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} bg-opacity-10 text-current`}>
          <i className={`fas ${icon} text-base`}></i>
        </div>
        <div className="bg-gray-100 p-1.5 rounded-md cursor-help">
           <i className="fas fa-info-circle text-[10px] text-gray-400"></i>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</h3>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
          {trend && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md mb-1 flex items-center gap-1 ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
               <i className={`fas ${trend.includes('+') ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
               {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
