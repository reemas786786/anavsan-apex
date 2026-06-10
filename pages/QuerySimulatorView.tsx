
import React, { useState, useEffect } from 'react';
import { QueryListItem } from '../types';
import { IconChevronLeft, IconSave, IconClipboardCopy, IconRefresh, IconExclamationTriangle, IconWand, IconChevronDown } from '../constants';

const queryWithPlaceholder = `
-- Optimized by Anavsan AI
WITH regional_analysis AS (
    SELECT
      c.region,
      DATE_TRUNC('month', o.order_date) AS sales_month,
      SUM(oi.quantity * p.price) AS monthly_regional_revenue
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    WHERE c.region = 'North America' AND o.order_date >= '2023-01-01'
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    GROUP BY 1, 2
)
SELECT 
    ra.region,
    ra.sales_month,
    ra.monthly_regional_revenue
FROM regional_analysis ra
-- Please replace [Column 1] with an actual column name.
WHERE [Column 1] IS NOT NULL
ORDER BY
  ra.sales_month DESC
LIMIT 500;
`;

const warehouseOptions = ['X-Small', 'Small', 'Medium', 'Large', 'X-Large'];
const dataUnitOptions = ['MB', 'GB', 'TB'];
const warehouseMultipliers: { [key: string]: number } = {
    'X-Small': 1, 'Small': 2, 'Medium': 4, 'Large': 8, 'X-Large': 16
};
const unitToGB: { [key: string]: number } = { 'MB': 0.001, 'GB': 1, 'TB': 1000 };

const ResultCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-surface-nested p-4 rounded-xl border border-border-light text-center">
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="text-xl font-bold text-text-primary mt-1">{value}</p>
    </div>
);

const QuerySimulatorView: React.FC<{
    query: QueryListItem | null;
    onBack: () => void;
    onSaveClick: (tag: string) => void;
}> = ({ query, onBack, onSaveClick }) => {
    const originalQuery = query ? queryWithPlaceholder : '';
    
    // State for parameters
    const [warehouseSize, setWarehouseSize] = useState('X-Small');
    const [dataSize, setDataSize] = useState<string>('10');
    const [dataUnit, setDataUnit] = useState('GB');

    // State for query and results
    const [editedQuery, setEditedQuery] = useState(originalQuery);
    const [simulationResult, setSimulationResult] = useState<{ cost: string; time: string; credits: string } | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    
    const isDirty = editedQuery !== originalQuery;
    const hasPlaceholders = editedQuery.includes('[') && editedQuery.includes(']');

    useEffect(() => {
        setEditedQuery(query ? queryWithPlaceholder : '');
        setSimulationResult(null);
    }, [query]);

    const handleRunSimulation = () => {
        setIsSimulating(true);
        setSimulationResult(null);

        const numericDataSize = parseFloat(dataSize) || 0;
        const warehouseMultiplier = warehouseMultipliers[warehouseSize];
        const dataSizeInGB = numericDataSize * unitToGB[dataUnit];

        // Heuristic calculation
        const credits = (dataSizeInGB * 0.005) * warehouseMultiplier;
        const time = Math.max(0.5, (dataSizeInGB * 2) / warehouseMultiplier);
        const cost = credits * 2.5;

        setTimeout(() => {
            setSimulationResult({
                cost: `$${cost.toFixed(2)}`,
                time: `${time.toFixed(1)} sec`,
                credits: `${credits.toFixed(4)} credits`
            });
            setIsSimulating(false);
        }, 1500);
    };
    
    const handleReset = () => {
        setEditedQuery(originalQuery);
    };

    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
            <main className="flex-grow flex flex-col lg:flex-row gap-4 overflow-hidden">
                {/* Left Column: Parameters */}
                <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col bg-surface p-4 rounded-xl border border-border-color space-y-6">
                    <h3 className="text-base font-semibold text-text-strong">Simulation Parameters</h3>
                    <div>
                        <label htmlFor="warehouse-size" className="block text-sm font-medium text-text-secondary mb-1">Warehouse Size</label>
                        <select id="warehouse-size" value={warehouseSize} onChange={e => setWarehouseSize(e.target.value)} className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg">
                            {warehouseOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="data-size" className="block text-sm font-medium text-text-secondary mb-1">Approx. scan volume</label>
                        <div className="flex">
                            <input type="number" id="data-size" value={dataSize} onChange={e => setDataSize(e.target.value)} className="w-full border border-border-color rounded-l-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg" placeholder="e.g., 100" />
                            <select value={dataUnit} onChange={e => setDataUnit(e.target.value)} className="border-t border-b border-r border-border-color rounded-r-full bg-input-bg text-sm focus:ring-primary focus:border-primary">
                                {dataUnitOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-auto pt-6">
                        <button onClick={handleRunSimulation} disabled={!dataSize || isSimulating} className="w-full text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2.5 rounded-full shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed">
                            {isSimulating ? 'Simulating...' : 'Run Simulation'}
                        </button>
                    </div>
                </div>

                {/* Right Column: Query & Results */}
                <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col gap-4">
                    <div className="flex-grow bg-surface p-4 rounded-xl border border-border-color flex flex-col">
                        <h3 className="text-base font-semibold text-text-strong mb-2">Query to be Simulated</h3>
                         <textarea
                            value={editedQuery}
                            onChange={(e) => setEditedQuery(e.target.value)}
                            className="w-full flex-grow bg-input-bg font-mono text-sm p-4 rounded-lg border border-border-color focus:ring-primary focus:border-primary resize-none"
                            aria-label="Query to be Simulated"
                            placeholder="Paste your query here to start."
                        />
                        {hasPlaceholders && (
                            <div className="mt-2 p-3 bg-status-warning-light text-status-warning-dark text-sm rounded-lg flex items-start gap-2">
                                <IconExclamationTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <span><b>Manual Input Required:</b> this query includes placeholder fields (e.g., `[Column 1]`). Please replace them before running the simulation.</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 pt-4 mt-auto">
                            <button onClick={() => onSaveClick('Simulated')} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color bg-surface hover:bg-surface-hover text-text-primary">Save</button>
                            <button className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color bg-surface hover:bg-surface-hover text-text-primary">Copy</button>
                            {isDirty && <button onClick={handleReset} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color bg-surface hover:bg-surface-hover text-text-primary">Reset</button>}
                        </div>
                    </div>
                    <div className="flex-shrink-0 bg-surface p-4 rounded-xl border border-border-color">
                        <h3 className="text-base font-semibold text-text-strong mb-2">Simulation Result</h3>
                        {isSimulating ? (
                             <div className="h-24 flex items-center justify-center text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : simulationResult ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <ResultCard title="Estimated Cost" value={simulationResult.cost} />
                                    <ResultCard title="Execution Time" value={simulationResult.time} />
                                    <ResultCard title="Credits Used" value={simulationResult.credits} />
                                </div>
                                <p className="text-xs text-text-muted mt-3 text-center">Results are approximate and based on AI-predicted cost and performance models.</p>
                            </>
                        ) : (
                            <div className="h-24 flex items-center justify-center text-center">
                                <p className="text-sm text-text-secondary">Run a simulation to see estimated results.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuerySimulatorView;
