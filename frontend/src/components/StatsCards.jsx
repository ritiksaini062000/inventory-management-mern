import React from 'react';
import { Package, DollarSign, AlertTriangle, XCircle } from 'lucide-react';

export default function StatsCards({ stats, loading }) {
  const cards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts ?? 0,
      subtext: `${stats?.totalStockUnits ?? 0} total units in stock`,
      icon: Package,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
    },
    {
      title: 'Inventory Valuation',
      value: stats?.totalInventoryValue ? `$${Number(stats.totalInventoryValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
      subtext: 'Calculated at current unit pricing',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      title: 'Low Stock Alerts',
      value: stats?.lowStockCount ?? 0,
      subtext: 'Items below minimum threshold',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
    {
      title: 'Out of Stock',
      value: stats?.outOfStockCount ?? 0,
      subtext: 'Immediate restock required',
      icon: XCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-5 bg-white rounded-xl border ${card.borderColor} shadow-xs hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.title}</p>
                {loading ? (
                  <div className="h-7 w-24 bg-slate-200 animate-pulse rounded mt-2"></div>
                ) : (
                  <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{card.value}</p>
                )}
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}

