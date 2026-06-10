import React, { useState, useMemo, useEffect } from 'react';
import { IconSearch, IconShare, IconArrowUp, IconArrowDown } from '../constants';
import Pagination from './Pagination';

interface TableViewData {
    name: string;
    cost: number;
    credits: number;
    percentage: number;
}

interface TableViewProps {
    title: string;
    data: TableViewData[];
}

const TableView: React.FC<TableViewProps> = ({ title, data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof TableViewData; direction: 'ascending' | 'descending' } | null>({ key: 'cost', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const sortedAndFilteredData = useMemo(() => {
        let sortedData = [...data];

        if (sortConfig !== null) {
            sortedData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        if (searchTerm) {
            return sortedData.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return sortedData;
    }, [data, sortConfig, searchTerm]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortConfig]);

    const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);
    const paginatedData = sortedAndFilteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleItemsPerPageChange = (newSize: number) => {
        setItemsPerPage(newSize);
        setCurrentPage(1);
    };

    const requestSort = (key: keyof TableViewData) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon: React.FC<{ columnKey: keyof TableViewData }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        }
        if (sortConfig.direction === 'ascending') {
            return <IconArrowUp className="w-4 h-4 ml-1" />;
        }
        return <IconArrowDown className="w-4 h-4 ml-1" />;
    };

    const handleExportCSV = () => {
        const header = ['Name', 'Cost ($)', 'Credits', '% of Total'];
        const rows = sortedAndFilteredData.map(item => [
            `"${item.name.replace(/"/g, '""')}"`, // escape double quotes
            item.cost.toFixed(2),
            item.credits.toFixed(2),
            item.percentage.toFixed(2),
        ]);

        const csvContent = [
            header.join(','),
            ...rows.map(row => row.join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${title.replace(/\s+/g, '_')}_table_view.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                    <button 
                        onClick={handleExportCSV} 
                        className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50 flex items-center gap-2"
                        aria-label="Export data as CSV"
                    >
                        <IconShare className="h-4 w-4" />
                        Export CSV
                    </button>
                </div>
                <div className="relative mt-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IconSearch className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border-color rounded-full text-sm focus:ring-primary focus:border-primary bg-input-bg"
                        aria-label="Search table content"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                 <table className="w-full text-sm text-left text-text-secondary">
                    <thead className="bg-table-header-bg text-xs text-text-primary font-medium sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                <button onClick={() => requestSort('name')} className="group flex items-center">Name <SortIcon columnKey="name" /></button>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                 <button onClick={() => requestSort('cost')} className="group flex items-center">Cost ($) <SortIcon columnKey="cost" /></button>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                 <button onClick={() => requestSort('credits')} className="group flex items-center">Credits <SortIcon columnKey="credits" /></button>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                 <button onClick={() => requestSort('percentage')} className="group flex items-center">% of Total <SortIcon columnKey="percentage" /></button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-surface">
                        {paginatedData.map((item, index) => (
                            <tr key={`${item.name}-${index}`} className="even:bg-surface-nested hover:bg-surface-hover">
                                <td className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4">${item.cost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                <td className="px-6 py-4">{item.credits.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                <td className="px-6 py-4">{item.percentage.toFixed(2)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sortedAndFilteredData.length > 0 && (
                 <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={sortedAndFilteredData.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}
        </div>
    );
};

export default TableView;
