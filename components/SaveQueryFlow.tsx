import React, { useState, useMemo } from 'react';
import { SQLFile } from '../types';

interface SaveQueryFlowProps {
  files: SQLFile[];
  onCancel: () => void;
  onSave: (data: { saveType: 'new' | 'existing'; fileName: string; fileId?: string; description: string; tag: string; }) => void;
  contextualTag?: string;
}

const Tag: React.FC<{ tag?: string }> = ({ tag }) => {
    if (!tag) return null;
    const colorClasses: { [key: string]: string } = {
        Optimized: "bg-status-success-light text-status-success-dark",
        Simulated: "bg-status-info-light text-status-info-dark",
        Analyzed: "bg-status-warning-light text-status-warning-dark",
    };
    const tagClass = colorClasses[tag] || "bg-gray-100 text-gray-800";
    return <span className={`px-2.5 py-1 text-sm rounded-full font-semibold ${tagClass}`}>{tag}</span>;
}

const SaveQueryFlow: React.FC<SaveQueryFlowProps> = ({ files, onCancel, onSave, contextualTag = 'General' }) => {
    const [saveType, setSaveType] = useState<'existing' | 'new'>(files.length > 0 ? 'existing' : 'new');
    const [selectedFileId, setSelectedFileId] = useState<string>(files.length > 0 ? files[0].id : '');
    const [newFileName, setNewFileName] = useState('');
    const [description, setDescription] = useState('');

    const nextVersionNumber = useMemo(() => {
        if (saveType === 'new') return 1;
        const selectedFile = files.find(f => f.id === selectedFileId);
        if (!selectedFile || selectedFile.versions.length === 0) return 1;
        const maxVersion = selectedFile.versions.reduce((max, v) => Math.max(max, v.version), 0);
        return maxVersion + 1;
    }, [saveType, selectedFileId, files]);

    const isSaveDisabled = (saveType === 'new' && !newFileName.trim()) || (saveType === 'existing' && !selectedFileId);

    const handleSubmit = () => {
        if (isSaveDisabled) return;
        
        if (saveType === 'new') {
            onSave({
                saveType: 'new',
                fileName: newFileName,
                description,
                tag: contextualTag
            });
        } else {
            const selectedFile = files.find(f => f.id === selectedFileId);
            if (!selectedFile) return;
            onSave({
                saveType: 'existing',
                fileName: selectedFile.name,
                fileId: selectedFileId,
                description,
                tag: contextualTag
            });
        }
    };

    return (
        <div className="flex flex-col h-full min-h-0 bg-white overflow-hidden">
            {/* Scrollable Content Area */}
            <div className="p-8 space-y-6 flex-grow overflow-y-auto no-scrollbar">
                {/* Save Type Radio */}
                <fieldset>
                    <div className="flex gap-6">
                        <div className="flex items-center">
                            <input id="save-existing" name="save-type" type="radio" value="existing" checked={saveType === 'existing'} onChange={() => setSaveType('existing')} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" disabled={files.length === 0} />
                            <label htmlFor="save-existing" className={`ml-2 block text-sm font-medium ${files.length === 0 ? 'text-text-muted' : 'text-text-primary'}`}>Save to existing file</label>
                        </div>
                        <div className="flex items-center">
                            <input id="save-new" name="save-type" type="radio" value="new" checked={saveType === 'new'} onChange={() => setSaveType('new')} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
                            <label htmlFor="save-new" className="ml-2 block text-sm font-medium text-text-primary">Save as new file</label>
                        </div>
                    </div>
                </fieldset>

                {/* Dynamic Input */}
                {saveType === 'existing' ? (
                    <div>
                        <label htmlFor="file-select" className="block text-sm font-medium text-text-secondary mb-1">Select file</label>
                        <select
                            id="file-select"
                            value={selectedFileId}
                            onChange={(e) => setSelectedFileId(e.target.value)}
                            className="w-full border border-border-color rounded-full px-4 py-2.5 text-sm focus:ring-primary focus:border-primary bg-input-bg"
                        >
                            {files.map(file => <option key={file.id} value={file.id}>{file.name}</option>)}
                        </select>
                    </div>
                ) : (
                    <div>
                        <label htmlFor="new-file-name" className="block text-sm font-medium text-text-secondary mb-1">New file name</label>
                        <input
                            type="text"
                            id="new-file-name"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            className="w-full border border-border-color rounded-full px-4 py-2.5 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary"
                            placeholder="e.g., monthly_spend_report.sql"
                        />
                    </div>
                )}
                
                {/* Version Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Version</label>
                        <div className="px-4 py-2.5 bg-background rounded-full text-sm font-semibold text-text-primary">
                            v{nextVersionNumber}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Tag</label>
                        <div className="py-1.5">
                            <Tag tag={contextualTag} />
                        </div>
                    </div>
                </div>

                {/* Version Message */}
                <div>
                     <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Version Message</label>
                     <textarea
                        id="description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-border-color rounded-2xl px-4 py-2.5 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary"
                        placeholder="Describe the changes in this version (e.g., 'Optimized version for monthly spend query')..."
                     />
                </div>
            </div>

            {/* Pinned Footer */}
            <div className="p-6 bg-background flex justify-end items-center gap-3 flex-shrink-0 border-t border-border-color">
                <button onClick={onCancel} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50">Cancel</button>
                <button 
                    onClick={handleSubmit} 
                    disabled={isSaveDisabled}
                    className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Save Query Version
                </button>
            </div>
        </div>
    );
};

export default SaveQueryFlow;