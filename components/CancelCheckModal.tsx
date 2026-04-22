import { useState } from 'react';
import { createPortal } from 'react-dom';

interface CancelCheckModalProps {
  onConfirm: () => void;
}
export function CancelCheckModal({onConfirm}: CancelCheckModalProps) {
 const [isOpen, setIsOpen] = useState(true);
  const handleConfirm = () => {
    onConfirm();
  };
  return (
    <>
    {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl p-6 w-[400px] shadow-xl">
            <h2 className = "text-base font-semibold">Cancel this request?</h2>
            <p className="mt-2 text-gray-500 text-sm ">Are you sure you want to cancel this request? This action cannot be undone.</p>
            <div className = "flex gap-2 mt-3">
            
            <button onClick={handleConfirm} className="flex-1 py-1.5 w-full font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
            Confirm
          </button>
          <button onClick={() => setIsOpen(false)} className="flex-1 py-1.5  w-full font-semibold rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors">
            Cancel
          </button>
          </div>
          </div>
        </>,
        document.body
    )}
    </>
  );
}