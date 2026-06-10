import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { BigScreenWidget, Account, User } from '../types';
import { IconClose } from '../constants';
import { costBreakdownData, overviewMetrics, databasesData, storageByTypeData, storageGrowthData } from '../data/dummyData';

interface BigScreenViewProps {
    widget: BigScreenWidget;
    accounts: Account[];
    users: User[];
    onClose: () => void;
    onSelectAccount: (account: Account) => void;
    onSelectUser: (user: User) => void;
    displayMode: 'cost' | 'credits';
}

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

const CustomTooltip = ({ active, payload, label, displayMode }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const name = payload[0].name;
        
        let formattedValue = '';
        let prefix = displayMode === 'cost' ? 'Spend:' : 'Credits:';

        if (name === 'Storage' || name.includes('Storage')) {
            formattedValue = `${value.toLocaleString()} GB`;
            prefix = 'Storage:';
        } else if (displayMode === 'cost') {
            formattedValue = `$${value.toLocaleString()}`;
        } else {
             formattedValue = `${value.toLocaleString()} credits`;
        }

        return (
            <div className="bg-surface p-2 rounded-lg border border-border-color shadow-sm">
                <p className="text-sm font-semibold text-text-strong mb-1">{label}</p>
                <div className="text-sm text-primary flex items-baseline">
                    <span className="font-semibold text-text-secondary mr-2">{prefix}</span>
                     <span className="font-semibold text-text-primary">{formattedValue}</span>
                </div>
            </div>
        );
    }
    return null;
};


const BigScreenView: React.FC<BigScreenViewProps> = ({ widget, accounts, users, onClose, onSelectAccount, onSelectUser, displayMode }) => {

    const handleBarClick = (data: any) => {
        const account = accounts.find(acc => acc.id === data.id);
        if (account) {
            onSelectAccount(account);
        }
    };

    const handleUserBarClick = (data: any) => {
        const user = users.find(u => u.id === data.id);
        if (user) {
            onSelectUser(user);
        }
    };

    const handleDatabaseBarClick = (data: any) => {
        // Since we don't have onSelectDatabase, this will just close the modal for now.
        // In a real scenario, this would navigate to the database detail page.
        onClose();
    }

    const renderWidget = () => {
        /* Fixed: Map displayMode to valid Account/User property for sorting/rendering */
        const sortKey = displayMode === 'cost' ? 'cost' : 'tokens';

        switch (widget.type) {
            case 'account':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            /* Fixed: Use sortKey instead of displayMode for sorting accounts */
                            data={[...accounts].sort((a, b) => b[sortKey] - a[sortKey])}
                            margin={{ top: 5, right: 30, left: 40, bottom: 30 }}
                            barCategoryGap="10%"
                        >
                            <XAxis type="number" stroke="#5A5A72" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E5E0' }} label={{ value: displayMode === 'cost' ? 'Cost ($)' : 'Credits', position: 'insideBottom', dy: 15, style: { fill: '#5A5A72', fontSize: 12, fontWeight: 500 } }} />
                            <YAxis type="category" dataKey="name" stroke="#5A5A72" tickLine={false} axisLine={false} interval={0} width={120} tick={{ fill: '#5A5A72', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: 'rgba(105, 50, 213, 0.1)' }} content={<CustomTooltip displayMode={displayMode} />} />
                            {/* Fixed: Use dynamic sortKey */}
                            <Bar dataKey={sortKey} fill="#6932D5" barSize={accounts.length <= 10 ? 12 : 20} shape={ <AccessibleBar onBarClick={handleBarClick} ariaLabelGenerator={(p: any) => `Navigate to Account Overview for ${p.name}`} /> } />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'user':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            /* Fixed: Use sortKey instead of displayMode for sorting users */
                            data={[...users].sort((a, b) => b[sortKey] - a[sortKey])}
                            margin={{ top: 5, right: 30, left: 40, bottom: 30 }}
                            barCategoryGap="10%"
                        >
                            <XAxis type="number" stroke="#5A5A72" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E5E0' }} label={{ value: displayMode === 'cost' ? 'Cost ($)' : 'Credits', position: 'insideBottom', dy: 15, style: { fill: '#5A5A72', fontSize: 12, fontWeight: 500 } }} />
                            <YAxis type="category" dataKey="name" stroke="#5A5A72" tickLine={false} axisLine={false} interval={0} width={120} tick={{ fill: '#5A5A72', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: 'rgba(105, 50, 213, 0.1)' }} content={<CustomTooltip displayMode={displayMode} />} />
                            {/* Fixed: Use dynamic sortKey */}
                            <Bar dataKey={sortKey} fill="#6932D5" barSize={users.length <= 10 ? 12 : 15} shape={ <AccessibleBar onBarClick={handleUserBarClick} ariaLabelGenerator={(p: any) => `Navigate to User Overview for ${p.name}`} /> } />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'spend_breakdown':
                 /* Fixed: Changed overviewMetrics.credits to overviewMetrics.tokens as per definition */
                 const currentSpend = displayMode === 'cost' ? overviewMetrics.cost.current : overviewMetrics.tokens.current;
                 return (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="bg-surface p-8 rounded-3xl border border-border-color shadow-lg max-w-3xl w-full">
                            <div className="flex items-center justify-center py-4">
                                <div className="grid grid-cols-2 gap-12">
                                    {costBreakdownData.map(item => {
                                        const chartData = [{ value: item.percentage }, { value: 100 - item.percentage }];
                                        /* Fixed: Changed item.credits to item.tokens as per costBreakdownData item definition */
                                        const value = displayMode === 'cost' ? item.cost : item.tokens;
                                        const label = item.name;
                                        return (
                                            <div key={item.name} className="flex flex-col items-center text-center">
                                                <div className="relative h-[150px] w-[150px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie data={chartData} dataKey="value" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270} cy="50%" cx="50%" stroke="none">
                                                                <Cell fill={item.color} />
                                                                <Cell fill="#E5E5E0" />
                                                            </Pie>
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-3xl font-bold text-text-primary">{item.percentage}%</span>
                                                    </div>
                                                </div>
                                                <div className="mt-4 text-base text-text-secondary flex items-baseline justify-center">
                                                    <span className="font-semibold text-text-strong mr-1">{label}</span> —&nbsp;
                                                    {displayMode === 'cost' ? (
                                                        `$${value.toLocaleString()}`
                                                    ) : (
                                                        <>
                                                            <span>{value.toLocaleString()}</span>
                                                            <span className="text-sm font-medium ml-1">credits</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                             <div className="text-center mt-6 pt-6 border-t border-border-light flex items-baseline justify-center">
                                <span className="text-base text-text-secondary mr-1">Current Spend:</span>
                                <span className="text-base font-semibold text-text-primary">
                                    {displayMode === 'cost' ? `$${currentSpend.toLocaleString()}` : (
                                        <>
                                            <span>{currentSpend.toLocaleString()}</span>
                                            <span className="text-sm font-medium text-text-secondary ml-1">credits</span>
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            case 'top_spend_by_db':
                 return (
                     <ResponsiveContainer width="100%" height="100%">
                         <BarChart layout="vertical" data={[...databasesData].sort((a,b) => b.cost - a.cost)} margin={{ top: 20, right: 30, left: 40, bottom: 30 }}>
                             <XAxis type="number" stroke="#5A5A72" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                             <YAxis dataKey="name" type="category" stroke="#5A5A72" fontSize={12} width={120} />
                             <Tooltip
                                 cursor={{ fill: '#F3F0FA' }}
                                 contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }}
                                 formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cost']}
                             />
                             <Bar dataKey="cost" fill="#A78BFA" radius={[0, 4, 4, 0]} barSize={20}>
                                {databasesData.map((entry) => (
                                    <Cell key={`cell-${entry.id}`} cursor="pointer" onClick={() => handleDatabaseBarClick(entry)} className="hover:fill-primary" />
                                ))}
                            </Bar>
                         </BarChart>
                     </ResponsiveContainer>
                 );
            case 'storage_by_type':
                const storageByTypeChartData = storageByTypeData.filter(item => item.type !== 'Staging');
                const totalStorageByType = storageByTypeChartData.reduce((sum, item) => sum + item.storageGB, 0);
                return (
                     <div className="w-full h-full flex items-center justify-center p-8">
                        <div className="flex gap-16 items-center">
                            <div className="relative w-64 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={storageByTypeChartData.map(item => ({...item}))} dataKey="storageGB" nameKey="type" cx="50%" cy="50%" innerRadius="65%" outerRadius="85%" fill="#8884d8" paddingAngle={5} stroke="none">
                                            {storageByTypeChartData.map((entry) => <Cell key={`cell-${entry.type}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => [`${value.toLocaleString()} GB`, 'Storage']} contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-4xl font-bold text-text-primary">{totalStorageByType.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                                    <span className="text-lg text-text-secondary">GB</span>
                                </div>
                            </div>
                             <div className="w-64 space-y-3">
                                {storageByTypeChartData.map(item => (
                                    <div key={item.type} className="flex items-center justify-between text-base">
                                        <div className="flex items-center">
                                            <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></span>
                                            <span className="text-text-secondary">{item.type}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-text-strong">{item.storageGB.toLocaleString()} GB</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'storage_growth_trend':
                 return (
                     <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={storageGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                             <XAxis dataKey="date" stroke="#9A9AB2" fontSize={12} tickLine={false} axisLine={false} />
                             <YAxis stroke="#9A9AB2" fontSize={12} unit=" GB" tickFormatter={(value) => (value / 1000).toLocaleString() + 'k'} tickLine={false} axisLine={false}/>
                             <Tooltip
                                 contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }}
                                 labelStyle={{ color: '#1E1E2D', fontWeight: 'bold' }}
                                 formatter={(value: number, name: string) => [`${value.toLocaleString()} GB`, name.replace(/ \(.*/, '')]}
                             />
                             <defs>
                                 <linearGradient id="colorActiveBS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6932D5" stopOpacity={0.7}/><stop offset="95%" stopColor="#6932D5" stopOpacity={0}/></linearGradient>
                                 <linearGradient id="colorTimeTravelBS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C4B5FD" stopOpacity={0.6}/><stop offset="95%" stopColor="#C4B5FD" stopOpacity={0}/></linearGradient>
                             </defs>
                             <Area type="monotone" dataKey="Active Storage (GB)" stroke="#6932D5" strokeWidth={2} fillOpacity={1} fill="url(#colorActiveBS)" />
                             <Area type="monotone" dataKey="Time Travel (GB)" stroke="#A78BFA" strokeWidth={2} fillOpacity={1} fill="url(#colorTimeTravelBS)" />
                         </AreaChart>
                     </ResponsiveContainer>
                 );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-background z-[100] flex flex-col p-6" role="dialog" aria-modal="true" aria-labelledby="big-screen-title">
            <header className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 id="big-screen-title" className="text-xl font-bold text-text-primary">{widget.title}</h2>
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-hover" aria-label="Close full-screen view">
                        <IconClose className="h-6 w-6 text-text-secondary" />
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-hidden bg-surface rounded-3xl border border-border-color">
                {renderWidget()}
            </main>
        </div>
    );
};

export default BigScreenView;