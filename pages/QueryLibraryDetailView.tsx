

import React from 'react';
import { SQLFile, SQLVersion, Account } from '../types';
import { IconChevronLeft, IconAdjustments, IconKey, IconLayers, IconBeaker, IconClipboardList } from '../constants';
import CodeDiffViewer from '../components/CodeDiffViewer';

// --- Re-used components/data from Analyzer and Optimizer for consistency ---

const Tag: React.FC<{ tag?: string }> = ({ tag }) => {
    if (!tag) return null;

    const colorClasses: { [key: string]: string } = {
        Optimized: "bg-status-success-light text-status-success-dark",
        Simulated: "bg-status-info-light text-status-info-dark",
        Analyzed: "bg-status-warning-light text-status-warning-dark",
        Default: "bg-gray-100 text-gray-800"
    };
    
    const tagClass = colorClasses[tag] || colorClasses.Default;

    return <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${tagClass}`}>{tag}</span>;
}

interface AnalysisResult {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

const mockAnalysisResults: AnalysisResult[] = [
    { id: 'rec1', title: 'Filter Pushdown Opportunity', description: "The filter `region = 'North America'` is applied in the final SELECT. Pushing this filter into the `regional_analysis` CTE would significantly reduce data processed by subsequent joins.", icon: IconAdjustments },
    { id: 'rec2', title: 'Clustering Key Recommendation', description: 'Query plan shows a full table scan on `orders`. Clustering the `orders` table by `order_date` would improve performance of date-range filters and the `daily_sales` CTE.', icon: IconKey },
    { id: 'rec3', title: 'CTE Optimization', description: 'The `customer_lifetime_value` CTE processes entire tables. Consider creating a materialized view or an aggregated summary table for this foundational business metric.', icon: IconLayers },
    { id: 'rec4', title: 'Expensive Function Usage', description: "`COUNT(DISTINCT ...)` in `daily_sales` is computationally expensive. If an approximation is acceptable, consider using `APPROX_COUNT_DISTINCT` for faster results.", icon: IconBeaker },
];

const mockOptimizationChanges = [
    { title: 'Pushed Down Filters', description: 'Moved `region` and `sales_month` filters from the final `SELECT` into the `regional_analysis` CTE. This reduces the amount of data processed in the initial scan and join operations.' },
    { title: 'Removed Unused CTE', description: 'The `daily_sales` CTE was calculated but never used in the final query. Removing it prevents unnecessary computation and resource usage.' },
    { title: 'Simplified Group By', description: 'The `GROUP BY` clause was updated to only include necessary columns, which can sometimes allow the query planner to choose a more efficient aggregation strategy.' },
];

const AnalysisResultCard: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const Icon = result.icon;
    return (
        <div className="bg-surface p-4 rounded-xl flex items-start gap-4 border border-border-color">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
                <h4 className="font-semibold text-text-primary">{result.title}</h4>
                <p className="text-sm text-text-secondary mt-1">{result.description}</p>
            </div>
        </div>
    );
};

const ChangeSummaryCard: React.FC<{ change: { title: string, description: string } }> = ({ change }) => (
    <div className="flex items-start gap-3 p-3 bg-surface-nested rounded-lg">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
            <IconClipboardList className="w-3 h-3 text-primary" />
        </div>
        <div>
            <h4 className="font-semibold text-sm text-text-primary">{change.title}</h4>
            <p className="text-sm text-text-secondary">{change.description}</p>
        </div>
    </div>
);


// --- Main Component ---

interface QueryLibraryDetailViewProps {
    file: SQLFile;
    version: SQLVersion;
    sqlFiles: SQLFile[];
    onBack: () => void;
}

const QueryLibraryDetailView: React.FC<QueryLibraryDetailViewProps> = ({ file, version, sqlFiles, onBack }) => {
    
    const fileNum = file.id.replace('file-', '');
    const versionNum = version.id.replace('v', '').replace('-', '');
    const queryId = `QL-${fileNum}${versionNum}`;
    
    const previousVersion = React.useMemo(() => {
        // If version is v2, previous is v1. If we passed two versions to compare, they are handled differently.
        // For simplicity in this demo, if version.version > 1, we find version - 1.
        // If we are in "Compare" mode (which is just Detail view with specific versions), we assume `version` is the "New" one.
        if (version.version <= 1) return null;
        const currentFile = sqlFiles.find(f => f.id === file.id);
        if (!currentFile) return null;
        return currentFile.versions.find(v => v.version === version.version - 1) || null;
    }, [file, version, sqlFiles]);
    
    // Logic: if 'version' passed here is actually part of a pair (handled by App.tsx), we might treat this differently.
    // However, App.tsx logic is: if compareVersions, pass v2 as `version`.
    // The DiffViewer below uses `previousVersion` which is computed above.
    // This works for "Optimized" tag logic naturally.
    // For manual compare, we ideally need to know the 'base' version explicitly.
    // But for this MVP, assuming v(N) vs v(N-1) is okay if not explicit comparison.
    // Actually, if App passes `compareVersions`, we should respect that.
    // To support explicit comparison, we would need another prop `baseVersion`.
    // Let's rely on standard Detail View logic for now as requested.

    const renderContent = () => {
        if (version.tag === 'Optimized' && previousVersion) {
            return (
                 <div className="space-y-6">
                    <div className="bg-surface rounded-2xl border border-border-color p-4">
                       <CodeDiffViewer 
                            oldCode={previousVersion?.sql || '-- No previous version found --'} 
                            newCode={version.sql || '-- No SQL available --'}
                            originalTitle={`Original (v${previousVersion.version})`}
                            originalTooltip="The query in its initial form before optimization"
                            optimizedTitle={`Optimized (v${version.version})`}
                            optimizedTooltip="The optimized version of the query with improved performance and reduced cost"
                        />
                    </div>
                    <div className="bg-surface rounded-2xl border border-border-color p-4">
                        <h3 className="text-base font-semibold text-text-strong mb-4">Summary of Changes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {mockOptimizationChanges.map(change => <ChangeSummaryCard key={change.title} change={change} />)}
                        </div>
                    </div>
                </div>
            );
        }
        
        // Default Analysis / View
        return (
             <div className="space-y-6">
                 <div className="bg-surface rounded-2xl border border-border-color">
                    <h3 className="text-base font-semibold text-text-strong p-4 border-b border-border-color">Executed Query</h3>
                    <div className="p-4">
                       <pre className="bg-input-bg p-4 rounded-xl border border-border-color text-sm text-text-primary overflow-auto max-h-[40vh]">
                            <code>{version.sql || '-- No SQL available --'}</code>
                        </pre>
                    </div>
                </div>
                {version.tag === 'Analyzed' && (
                    <div className="bg-surface rounded-2xl border border-border-color p-4">
                        <h3 className="text-base font-semibold text-text-strong mb-4">Analysis Results</h3>
                        <div className="space-y-3">
                           {mockAnalysisResults.map(result => <AnalysisResultCard key={result.id} result={result} />)}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className="h-full overflow-y-auto">
             <div className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-button-secondary-bg text-primary hover:bg-button-secondary-bg-hover transition-colors flex-shrink-0"
                        aria-label="Back to Query Library"
                    >
                        <IconChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-text-primary">{queryId}</h1>
                </div>

                <div className="bg-surface p-6 rounded-2xl">
                    <h3 className="text-base font-semibold text-text-strong mb-4">Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <div className="text-text-secondary">Query ID</div>
                            <div className="font-semibold text-text-primary">{queryId}</div>
                        </div>
                        <div>
                            <div className="text-text-secondary">Tag</div>
                            <div className="font-semibold text-text-primary mt-1"><Tag tag={version.tag} /></div>
                        </div>
                        <div>
                            <div className="text-text-secondary">Execution Date</div>
                            <div className="font-semibold text-text-primary">{new Date(version.date).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <div className="text-text-secondary">User</div>
                            <div className="font-semibold text-text-primary">{version.user}</div>
                        </div>
                    </div>
                </div>
                
                {renderContent()}
            </div>
        </div>
    );
};

export default QueryLibraryDetailView;
