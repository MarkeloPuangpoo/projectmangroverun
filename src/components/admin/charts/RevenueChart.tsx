'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';

interface RevenueDataPoint {
    date: string;
    dailyRevenue: number;
    cumulativeRevenue: number;
    count: number;
}

interface RevenueChartProps {
    registrations: Array<{
        created_at: string;
        race_category: string;
        status: string;
    }>;
    priceMap: Record<string, number>;
}

export default function RevenueChart({ registrations, priceMap }: RevenueChartProps) {
    const chartData = useMemo(() => {
        // Group by date
        const byDate: Record<string, { revenue: number; count: number }> = {};

        registrations
            .filter(r => r.status !== 'rejected')
            .forEach(reg => {
                const date = new Date(reg.created_at).toLocaleDateString('th-TH', {
                    day: '2-digit',
                    month: 'short'
                });
                if (!byDate[date]) {
                    byDate[date] = { revenue: 0, count: 0 };
                }
                byDate[date].revenue += priceMap[reg.race_category] || 500;
                byDate[date].count += 1;
            });

        // Convert to array and sort by date
        const sorted = Object.entries(byDate)
            .map(([date, data]) => ({
                date,
                dailyRevenue: data.revenue,
                count: data.count,
                cumulativeRevenue: 0
            }));

        // Calculate cumulative
        let cumulative = 0;
        sorted.forEach(item => {
            cumulative += item.dailyRevenue;
            item.cumulativeRevenue = cumulative;
        });

        return sorted;
    }, [registrations, priceMap]);

    const totalRevenue = chartData.length > 0
        ? chartData[chartData.length - 1].cumulativeRevenue
        : 0;

    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">📈 Revenue Timeline</h3>
                    <p className="text-sm text-slate-400 mt-1">Cumulative registration revenue</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-indigo-600">
                        ฿{totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Total Revenue</div>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            tickLine={false}
                            axisLine={{ stroke: '#e2e8f0' }}
                        />
                        <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload as RevenueDataPoint;
                                    return (
                                        <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
                                            <div className="font-bold mb-1">{label}</div>
                                            <div className="text-emerald-300">
                                                Daily: ฿{data.dailyRevenue.toLocaleString()}
                                            </div>
                                            <div className="text-indigo-300">
                                                Cumulative: ฿{data.cumulativeRevenue.toLocaleString()}
                                            </div>
                                            <div className="text-slate-400 text-xs mt-1">
                                                {data.count} registrations
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="cumulativeRevenue"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
