
/**
 * Utility functions for storage metric calculations and formatting.
 */

/**
 * Formats a size in GB to a human-readable string (GB or TB).
 */
export const formatStorageSize = (gb: number): string => {
    if (gb === null || gb === undefined) return '—';
    if (gb >= 1024) {
        return (gb / 1024).toFixed(1).replace(/\.0$/, '') + ' TB';
    }
    return gb.toFixed(1).replace(/\.0$/, '') + ' GB';
};

/**
 * Calculates aggregate storage metrics from a list of table objects.
 */
export interface StorageTable {
    activeSizeGB?: number;
    timeTravelSizeGB?: number;
    failSafeSizeGB?: number;
    totalSizeGB?: number;
    [key: string]: any;
}

export const calculateStorageMetrics = (tables: StorageTable[], databases: any[] = [], unusedTables: any[] = []) => {
    const metrics = tables.reduce((acc, table) => {
        acc.activeSizeGB += table.activeSizeGB || 0;
        acc.timeTravelSizeGB += table.timeTravelSizeGB || 0;
        acc.failSafeSizeGB += table.failSafeSizeGB || 0;
        acc.totalSizeGB += table.totalSizeGB || 0;
        acc.tableCount += 1;
        
        if (table.schemaName) {
            acc.schemas.add(table.schemaName);
        }
        
        return acc;
    }, { 
        activeSizeGB: 0, 
        timeTravelSizeGB: 0, 
        failSafeSizeGB: 0, 
        totalSizeGB: 0, 
        tableCount: 0,
        schemas: new Set<string>()
    });

    const unusedMetrics = unusedTables.reduce((acc, table) => {
        acc.unusedSizeGB += table.sizeGB || 0;
        acc.unusedTableCount += 1;
        return acc;
    }, { unusedSizeGB: 0, unusedTableCount: 0 });

    return {
        ...metrics,
        ...unusedMetrics,
        schemaCount: metrics.schemas.size,
        databaseCount: databases.length,
    };
};
