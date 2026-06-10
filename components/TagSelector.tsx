import React from 'react';

interface TagSelectorProps {
  tags: string[];
  selectedTag: string;
  onSelectTag: (tag: string) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ tags, selectedTag, onSelectTag }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">Tag</label>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => onSelectTag(tag)}
            className={`px-3 py-1 text-sm font-semibold rounded-full border transition-colors ${
              selectedTag === tag
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-text-secondary border-border-color hover:border-primary hover:text-primary'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;
