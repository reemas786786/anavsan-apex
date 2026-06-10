
import React from 'react';
import { Warehouse } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import InfoTooltip from '../components/InfoTooltip';

// --- Reusable chart components (copied for consistency) ---

const AccessibleBar = (props: any) => {
    const { x, y, width, height, fill, payload, onBarClick, ariaLabelGenerator } = props;
    if (!payload || width <= 0) return null;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onBarClick(payload);
        }
    };

    return (
        <g
            tabIndex={0}
            onClick={() => onBarClick(payload)}
            onKeyDown={handleKeyDown}
            aria-label={ariaLabelGenerator(payload)}
            role="button"
            style={{ cursor: 'pointer', outline: 'none' }}
            onFocus={(e) => {
                const rect = e.currentTarget.querySelector('rect');
                if(rect) rect.style.fill = '#5A28BE'; // primary-hover color
            }}
            onBlur={(e) => {
                const rect = e.currentTarget.querySelector('rect');
                if(rect) rect.style.fill = fill;
            }}
        >
            <rect x={x} y={y} width={width} height={height} fill={fill} />
        </g>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        return (
            <div className="bg-surface p-2 rounded-lg shadow-lg border border-border-color">
                <p className="text-sm font-semibold text-text-strong mb-1">{label}</p>
                <div className="text-sm text-primary flex items-baseline">
                    <span className="font-semibold text-text-secondary mr-2">Credits:</span>
                    <>
                        <span className="font-semibold text-text-primary">{value.toLocaleString()}</span>
                        <span className="text-xs font-medium text-text-secondary ml-1">credits</span>
                    </>
                </div>
            </div>
        );
    }
    return null;
};


// --- Main Component ---
interface WarehouseOverviewProps {
    warehouses: Warehouse[];
    onSelectWarehouse: (warehouse: Warehouse) => void;
}

const WarehouseOverview: React.FC<WarehouseOverviewProps> = ({ warehouses, onSelectWarehouse }) => {
    // --- Data Calculation ---
    const totalCredits = warehouses.reduce((sum, wh) => sum + wh.credits, 0);
    const activeWarehouses = warehouses.filter(wh => wh.status === 'Active' || wh.status === 'Running').length;
    const suspendedWarehouses = warehouses.filter(wh => wh.status === 'Suspended').length;
    const topWarehouses = [...warehouses].sort((a, b) => b.credits - a.credits).slice(0, 10);

    return (
        <div className="px-6 pt-4 pb-12 space-y-3">
            <div className="mb-4">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Overview</h1>
                <p className="text-sm text-text-secondary font-medium mt-1">A summary of warehouse activity and performance across your account.</p>
            </div>

            <div className="columns-1 md:columns-2 gap-4">
                {/* Column 1: Consolidated Widget */}
                <div className="bg-surface p-4 rounded-3xl break-inside-avoid mb-4 shadow-sm border border-border-light">
                    <div className="flex items-center mb-4">
                        <h3 className="text-sm font-bold text-text-strong uppercase tracking-wider">Warehouse summary</h3>
                        <InfoTooltip text="A high-level summary of warehouse metrics including total credits used, and counts of active and suspended warehouses." position="bottom" />
                    </div>
                    <div className="space-y-4">
                        {/* Row 1: Total Credits */}
                        <div className="bg-surface-nested p-4 rounded-xl border border-border-light">
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Total Credits Used</p>
                            <p className="text-2xl font-black text-text-primary mt-1">{totalCredits.toLocaleString()} cr</p>
                        </div>
                        {/* Row 2: Active & Suspended */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-surface-nested p-4 rounded-xl border border-border-light">
                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Active</p>
                                <p className="text-xl font-black text-text-primary mt-1">{activeWarehouses}</p>
                            </div>
                            <div className="bg-surface-nested p-4 rounded-xl border border-border-light">
                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Suspended</p>
                                <p className="text-xl font-black text-text-primary mt-1">{suspendedWarehouses}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Top Consuming Warehouses Chart */}
                <div className="bg-surface p-4 rounded-3xl break-inside-avoid mb-4 shadow-sm border border-border-light">
                     <h3 className="text-sm font-bold text-text-strong uppercase tracking-wider mb-4">Top credit consuming warehouses</h3>
                     <div style={{ height: 360 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                layout="vertical" 
                                data={topWarehouses} 
                                margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                            >
                                <XAxis 
                                    type="number" 
                                    stroke="#5A5A72" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={{ stroke: '#E5E5E0' }} 
                                    label={{ value: 'Credits', position: 'insideBottom', dy: 15, style: { fill: '#5A5A72', fontSize: 10, fontWeight: 700 } }} 
                                />
                                <YAxis 
                                    type="category" 
                                    dataKey="name" 
                                    stroke="#5A5A72" 
                                    tickLine={false} 
                                    axisLine={false} 
                                    interval={0} 
                                    width={100} 
                                    tick={{ fill: '#5A5A72', fontSize: 10, fontWeight: 700, width: 90 }} 
                                    tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
                                />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(105, 50, 213, 0.1)' }} 
                                    content={<CustomTooltip />} 
                                />
                                <Bar 
                                    dataKey="credits" 
                                    fill="#6932D5" 
                                    barSize={12} 
                                    radius={[0, 4, 4, 0]}
                                    shape={<AccessibleBar onBarClick={onSelectWarehouse} ariaLabelGenerator={(p: any) => `View details for warehouse: ${p.name}`} />} 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WarehouseOverview;
