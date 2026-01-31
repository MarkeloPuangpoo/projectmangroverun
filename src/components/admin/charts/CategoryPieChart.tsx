'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface CategoryData {
    name: string;
    value: number;
    color: string;
}

interface CategoryPieChartProps {
    data: CategoryData[];
    total: number;
}

export default function CategoryPieChart({ data, total }: CategoryPieChartProps) {
    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-6">📊 Runners by Category</h3>

            <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={4}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    const percent = ((data.value / total) * 100).toFixed(1);
                                    return (
                                        <div className="bg-slate-800 text-white px-4 py-2 rounded-xl shadow-lg text-sm">
                                            <div className="font-bold">{data.name}</div>
                                            <div>{data.value} runners ({percent}%)</div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <div className="text-3xl font-black text-slate-800">{total}</div>
                        <div className="text-xs text-slate-400 font-medium uppercase">Total</div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mt-6">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-slate-600 font-medium truncate">
                            {item.name}
                        </span>
                        <span className="text-sm font-bold text-slate-800 ml-auto">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
