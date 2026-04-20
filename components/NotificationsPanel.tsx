"use client"

import { useEffect, useRef } from 'react';
import { useRequests } from '@/hooks/UseRequests';
import { RequestCard } from './RequestCard';
import { request } from '@/types/request';

type FilterDirection = 'all' | 'received' | 'sent';
type FilterStatus = 'all' | request['status'];

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

const DIR_OPTIONS: { label: string; value: FilterDirection }[] = [
  { label: 'All', value: 'all' },
  { label: 'Received', value: 'received' },
  { label: 'Sent', value: 'sent' },
];

const STATUS_OPTIONS: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Completed', value: 'completed' },
  { label: 'Rejected', value: 'rejected' },
];

export function NotificationsPanel({ isOpen, onClose, userId }: NotificationsPanelProps) {
  const {
    requests,
    loading,
    error,
    filterDirection,
    filterStatus,
    setFilterDirection,
    setFilterStatus,
    actions,
    reload,
  } = useRequests(userId);

  const panelRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

   return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Sliding panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Service requests"
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full z-50 bg-white border-l border-gray-200 shadow-xl flex flex-col transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="px-5 pt-5 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-gray-900">Service Requests</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Direction filter */}
          <div className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Direction</p>
            <div className="flex gap-1.5 flex-wrap">
              {DIR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterDirection(opt.value)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-all ${filterDirection === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div className="pb-4 border-b border-gray-100">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Status</p>
            <div className="flex gap-1.5 flex-wrap">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterStatus(opt.value)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-all ${filterStatus === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {loading && (
            <div className="flex flex-col gap-2 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-10">
              <p className="text-sm text-red-500 mb-3">{error}</p>
              <button onClick={reload} className="text-[13px] text-blue-600 underline underline-offset-2">Try again</button>
            </div>
          )}

          {!loading && !error && requests.length === 0 && (
            <div className="text-center py-14 text-gray-400">
              <p className="text-[13px]">No requests match your filters</p>
            </div>
          )}

          {!loading && !error && requests.length > 0 && (
            <div className="flex flex-col gap-2">
              {requests.map((item) => {
                const direction = item.requester_id === userId ? 'sent' : 'received';
                return (
                  <RequestCard
                    key={item.request_id}
                    item={item}
                    direction={direction}
                    onAccept={actions.accept}
                    onReject={actions.reject}
                    onComplete={actions.complete}
                    onCancel={actions.cancel}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
