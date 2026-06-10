import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SQLFile, SQLVersion } from '../types';
import { 
    IconArrowUp, 
    IconArrowDown, 
    IconDotsVertical, 
    IconDelete, 
    IconView, 
    IconBeaker, 
    IconWand, 
    IconAIAgent,
    IconChevronLeft,
    IconSearch
} from '../constants';

// --- SUB-COMPONENTS ---

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

const SortIcon: React.FC<{
    sortConfig: { key: string; direction: 'ascending' | 'descending' } | null;
    columnKey: string;
}> = ({ sortConfig, columnKey }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
        return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp /></span>;
    }
    return sortConfig.direction === 'ascending' 
        ? <IconArrowUp className="w-4 h-4 ml-1" /> 
        : <IconArrowDown className="w-4 h-4 ml-1" />;
};


// --- LIST VIEWS ---

const FileListView: React.FC<{ 
    files: SQLFile[], 
    onSelectFile: (file: SQLFile) => void,
    onDeleteFile: (fileId: string) => void 
}> = ({ files, onSelectFile, onDeleteFile }) => {
    
    const getLatestVersion = (file: SQLFile) => {
        if (!file.versions || file.versions.length === 0) return null;
        return [...file.versions].sort((a, b) => b.version - a.version)[0];
    };

    return (
        <div className="bg-surface rounded-xl flex flex-col flex-grow min-h-0">
             <div className="overflow-y-auto flex-grow min-h-0">
                <table className="w-full text-sm">
                    <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-semibold text-left">File Name</th>
                            <th scope="col" className="px-6 py-4 font-semibold text-left">Total Versions</th>
                            <th scope="col" className="px-6 py-4 font-semibold text-left">Latest Message</th>
                            <th scope="col" className="px-6 py-4 font-semibold text-left">Created Date</th>
                            <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-text-secondary">
                        {files.map(file => {
                            const latestVersion = getLatestVersion(file);
                            return (
                                <tr key={file.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested cursor-pointer" onClick={() => onSelectFile(file)}>
                                    <td className="px-6 py-3 font-medium text-link whitespace-nowrap">{file.name}</td>
                                    <td className="px-6 py-3 text-center">{file.versions.length}</td>
                                    <td className="px-6 py-3 italic truncate max-w-sm" title={latestVersion?.description}>{latestVersion?.description || 'N/A'}</td>
                                    <td className="px-6 py-3">{file.createdDate}</td>
                                    <td className="px-6 py-3 text-right">
                                        <button onClick={(e) => { e.stopPropagation(); onDeleteFile(file.id); }} className="p-2 text-text-secondary hover:text-status-error rounded-full hover:bg-status-error/10 transition-colors">
                                            <IconDelete className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const VersionListView: React.FC<{ 
    file: SQLFile, 
    onBack: () => void,
    onDeleteVersion: (versionId: string) => void
}> = ({ file, onBack, onDeleteVersion }) => {
    const [selectedVersions, setSelectedVersions] = useState<Set<string>>(new Set());
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const summaryPills = useMemo(() => {
        const tags = { Analyzed: 0, Optimized: 0, Simulated: 0 };
        file.versions.forEach(v => {
            if (v.tag && tags.hasOwnProperty(v.tag)) {
                tags[v.tag as keyof typeof tags]++;
            }
        });
        return [
            { label: 'Total Versions', value: file.versions.length },
            { label: 'Analyzed', value: tags.Analyzed },
            { label: 'Optimized', value: tags.Optimized },
            { label: 'Simulated', value: tags.Simulated },
        ];
    }, [file.versions]);

    const handleVersionSelect = (versionId: string) => {
        const newSelection = new Set(selectedVersions);
        if (newSelection.has(versionId)) {
            newSelection.delete(versionId);
        } else if (newSelection.size < 2) {
            newSelection.add(versionId);
        }
        setSelectedVersions(newSelection);
    };

    return (
        <div className="space-y-4">
             <div className="flex items-center gap-4">
                <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-link hover:underline">
                    <IconChevronLeft className="h-4 w-4" /> All Files
                </button>
                <h2 className="text-xl font-bold text-text-primary">{file.name}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {summaryPills.map(pill => (
                    <div key={pill.label} className="px-4 py-2 rounded-full text-sm font-medium bg-surface border border-border-color">
                        {pill.label}: <span className="font-bold text-text-strong">{pill.value}</span>
                    </div>
                ))}
            </div>

            <div className="bg-surface rounded-xl flex flex-col flex-grow min-h-0">
                <div className="p-4 flex justify-end items-center flex-shrink-0">
                    <button 
                        disabled={selectedVersions.size !== 2} 
                        className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-full shadow-sm hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Compare Versions
                    </button>
                </div>
                <div className="overflow-y-auto flex-grow min-h-0">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-left w-12"></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Version</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Message</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Tag</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Date Saved</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                         <tbody className="text-text-secondary">
                            {file.versions.map(v => (
                                <tr key={v.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested">
                                    <td className="px-6 py-3">
                                        <input type="checkbox" checked={selectedVersions.has(v.id)} onChange={() => handleVersionSelect(v.id)} className="h-4 w-4 rounded text-primary border-gray-300 focus:ring-primary" />
                                    </td>
                                    <td className="px-6 py-3 font-semibold text-text-primary">v{v.version}</td>
                                    <td className="px-6 py-3 italic">{v.description}</td>
                                    <td className="px-6 py-3"><Tag tag={v.tag} /></td>
                                    <td className="px-6 py-3">{v.date}</td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="relative inline-block text-left" ref={openMenuId === v.id ? menuRef : null}>
                                            <button onClick={() => setOpenMenuId(v.id)} className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors">
                                                <IconDotsVertical className="h-5 w-5" />
                                            </button>
                                            {openMenuId === v.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg bg-surface shadow-lg z-20 border border-border-color">
                                                     <div className="py-1" role="menu">
                                                        <button className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconView className="h-4 w-4"/> Query Preview</button>
                                                        <button className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconSearch className="h-4 w-4"/> Open in Analyzer</button>
                                                        <button className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconWand className="h-4 w-4"/> Open in Optimizer</button>
                                                        <button className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconBeaker className="h-4 w-4"/> Open in Simulator</button>
                                                        <div className="my-1 border-t border-border-color"></div>
                                                        <button onClick={() => onDeleteVersion(v.id)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-status-error hover:bg-status-error/10" role="menuitem"><IconDelete className="h-4 w-4"/> Delete</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

interface QueryVersionsProps {
    sqlFiles: SQLFile[];
}

const QueryVersionsView: React.FC<QueryVersionsProps> = ({ sqlFiles: initialSqlFiles }) => {
    const [sqlFiles, setSqlFiles] = useState<SQLFile[]>(initialSqlFiles);
    const [selectedFile, setSelectedFile] = useState<SQLFile | null>(null);

    const handleDeleteFile = (fileId: string) => {
        // Mock deletion
        setSqlFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const handleDeleteVersion = (versionId: string) => {
        if (!selectedFile) return;
        
        const newFile: SQLFile = {
            ...selectedFile,
            versions: selectedFile.versions.filter(v => v.id !== versionId)
        };
        
        setSqlFiles(prev => prev.map(f => f.id === newFile.id ? newFile : f));
        setSelectedFile(newFile);
    };

    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
            {selectedFile ? (
                <VersionListView 
                    file={selectedFile} 
                    onBack={() => setSelectedFile(null)}
                    onDeleteVersion={handleDeleteVersion}
                />
            ) : (
                <>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Query Versions</h1>
                        <p className="mt-1 text-text-secondary">Track and compare different saved versions of your SQL queries.</p>
                    </div>
                    <FileListView 
                        files={sqlFiles} 
                        onSelectFile={setSelectedFile}
                        onDeleteFile={handleDeleteFile}
                    />
                </>
            )}
        </div>
    );
};

export default QueryVersionsView;