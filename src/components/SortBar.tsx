import { ArrowUpDown } from 'lucide-react';
import { SortOption } from '../types';

interface SortBarProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  resultCount: number;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: '默认排序' },
  { value: 'sales', label: '销量优先' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'rating', label: '评分最高' },
];

export function SortBar({ sortOption, onSortChange, resultCount }: SortBarProps) {
  return (
    <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm">
      <div className="text-sm text-gray-600">
        找到 <span className="text-blue-600">{resultCount}</span> 件商品
      </div>
      
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-gray-400" />
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
