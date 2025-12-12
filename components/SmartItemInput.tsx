import React, { useState } from 'react';
import { Sparkles, Plus, Loader2 } from 'lucide-react';
import { parseItemsFromText } from '../services/geminiService';
import { ParsedItem } from '../types';

interface SmartItemInputProps {
  onAddItems: (items: ParsedItem[]) => void;
}

const SmartItemInput: React.FC<SmartItemInputProps> = ({ onAddItems }) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSmartAdd = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    const items = await parseItemsFromText(input);
    setIsAnalyzing(false);
    
    if (items.length > 0) {
      onAddItems(items);
      setInput('');
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 mb-4">
      <div className="flex items-center gap-2 mb-2 text-indigo-700 font-medium text-sm">
        <Sparkles className="w-4 h-4" />
        <span>Smart Add with Gemini</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., 2 cokes and a packet of lays"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleSmartAdd()}
        />
        <button
          onClick={handleSmartAdd}
          disabled={isAnalyzing || !input.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Type what you want naturally, and AI will estimate the price and add it.
      </p>
    </div>
  );
};

export default SmartItemInput;