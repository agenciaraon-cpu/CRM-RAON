import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirmar Exclusão",
  message
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all scale-100">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-red-50/50 dark:bg-red-500/10">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
            <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-slate-700 dark:text-slate-300 font-medium text-base leading-relaxed">
            {message}
          </p>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors shadow-sm"
          >
            Não
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md shadow-red-600/20 flex items-center gap-1.5"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}
