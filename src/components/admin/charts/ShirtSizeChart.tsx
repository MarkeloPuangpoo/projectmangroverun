'use client';

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from 'recharts';

interface ShirtSizeData {
    size: string;
    count: number;
}

interface ShirtSizeChartProps {
    data: ShirtSizeData[];
    total: number;
}

const SIZE_COLORS: Record<string, string> = {
    'S': '#f472b6',
    'M': '#a78bfa',
    'L': '#60a5fa',
    'XL': '#34d399',
    '2XL': '#fbbf24',
    '3XL': '#f97316',
};

export default function ShirtSizeChart({ data, total }: ShirtSizeChartProps) {
    // Sort sizes in order
    const sizeOrder = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
    const sortedData = [...data].sort((a, b) =>
        sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size)
    );

    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">👕 Shirt Size Summary</h3>
                    <p className="text-sm text-slate-400 mt-1">Total shirts to order</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl">
                    <span className="text-sm text-slate-500 font-medium">Total:</span>
                    <span className="text-2xl font-black text-slate-800">{total}</span>
                </div>
            </div>

            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="size"
                            tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                            tickLine={false}
                            axisLine={{ stroke: '#e2e8f0' }}
                        />
                        <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    const percent = ((data.count / total) * 100).toFixed(1);
                                    return (
                                        <div className="bg-slate-800 text-white px-4 py-2 rounded-xl shadow-lg text-sm">
                                            <div className="font-bold">Size {data.size}</div>
                                            <div>{data.count} shirts ({percent}%)</div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="count"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={60}
                        >
                            {sortedData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={SIZE_COLORS[entry.size] || '#94a3b8'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend Row */}
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
                {sortedData.map((item) => (
                    <div key={item.size} className="flex items-center gap-2 text-sm">
                        <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: SIZE_COLORS[item.size] || '#94a3b8' }}
                        />
                        <span className="text-slate-500 font-medium">{item.size}:</span>
                        <span className="font-bold text-slate-700">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
