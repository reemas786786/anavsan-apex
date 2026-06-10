import React from 'react';
import { diffLines, Change } from 'diff';
import { IconInfo } from '../constants';
import InfoTooltip from './InfoTooltip';

interface CodeDiffViewerProps {
    oldCode: string;
    newCode: string;
    originalTitle: string;
    optimizedTitle: string;
    originalTooltip: string;
    optimizedTooltip: string;
}

const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({ oldCode, newCode, originalTitle, optimizedTitle, originalTooltip, optimizedTooltip }) => {
    
    const diff = diffLines(oldCode, newCode);

    const renderDiff = (part: Change, index: number, type: 'original' | 'optimized') => {
        const colorClass = part.added 
            ? 'bg-green-100 dark:bg-green-900/50' 
            : part.removed 
            ? 'bg-red-100 dark:bg-red-900/50' 
            : 'transparent';
        
        if (type === 'original' && part.added) return null;
        if (type === 'optimized' && part.removed) return null;

        return (
            <span key={index} className={colorClass}>
                {part.value}
            </span>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Query */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-text-strong">{originalTitle}</h4>
                    <InfoTooltip text={originalTooltip} />
                </div>
                <pre className="font-mono text-xs p-4 whitespace-pre-wrap break-all leading-relaxed bg-surface-nested rounded-lg border border-border-color max-h-[50vh] overflow-auto">
                    <code>
                        {diff.map((part, index) => renderDiff(part, index, 'original'))}
                    </code>
                </pre>
            </div>
            {/* Optimized Query */}
            <div>
                 <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-text-strong">{optimizedTitle}</h4>
                    <InfoTooltip text={optimizedTooltip} />
                </div>
                 <pre className="font-mono text-xs p-4 whitespace-pre-wrap break-all leading-relaxed bg-surface-nested rounded-lg border border-border-color max-h-[50vh] overflow-auto">
                    <code>
                        {diff.map((part, index) => renderDiff(part, index, 'optimized'))}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default CodeDiffViewer;