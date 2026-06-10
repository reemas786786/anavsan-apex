
import React from 'react';
import { IconChevronLeft, IconChevronRight } from '../constants';
import CompactSelectDropdown from './CompactSelectDropdown';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}) => {
    if (totalItems === 0) {
        return null;
    }

    const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const pageOptions = Array.from({ length: totalPages }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
    const itemsPerPageOptions = [10, 20, 50, 100].map(o => ({ value: String(o), label: String(o) }));

    return (
        <div className="flex justify-between items-center text-sm text-text-secondary px-4 py-2 border-t border-border-light bg-surface rounded-b-xl">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span>Items per page:</span>
                    <CompactSelectDropdown
                        options={itemsPerPageOptions}
                        value={String(itemsPerPage)}
                        onChange={(val) => onItemsPerPageChange(Number(val))}
                        ariaLabel="Items per page"
                    />
                </div>
                <div className="border-l border-border-color h-6"></div>
                <span>
                    {startItem}–{endItem} of {totalItems} items
                </span>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <CompactSelectDropdown
                        options={pageOptions}
                        value={String(currentPage)}
                        onChange={(val) => onPageChange(Number(val))}
                        ariaLabel="Go to page"
                    />
                    <span>of {totalPages} pages</span>
                </div>
                <div className="border-l border-border-color h-6"></div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                        aria-label="Previous page"
                    >
                        <IconChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                        aria-label="Next page"
                    >
                        <IconChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
