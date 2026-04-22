"use client"

import React, { useState } from 'react';
import { request } from '@/types/request';
import { deleteNotification, RequestWithService } from '@/lib/requestsAPI';
import {CancelCheckModal } from './CancelCheckModal'


interface RequestCardProps {
  item: RequestWithService;
  direction: 'sent' | 'received';
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onHide: (id: string) => void;
}

const STATUS_STYLES: Record<request['status'], string> = {
  pending:   'bg-amber-50 text-amber-800 border border-amber-200',
  accepted:  'bg-green-50 text-green-800 border border-green-200',
  completed: 'bg-teal-50 text-teal-800 border border-teal-200',
  rejected:  'bg-red-50 text-red-800 border border-red-200',
  cancelled : 'bg-gray-50 text-gray-800 border border-gray-200',
};

const STATUS_LABELS: Record<request['status'], string> = {
  pending:   'Pending',
  accepted:  'Accepted',
  completed: 'Completed',
  rejected:  'Rejected',
  cancelled : 'Cancelled',
};

function getInitials(firstname: string, lastname: string) {
  return `${firstname?.[0] ?? ''}${lastname?.[0] ?? ''}`.toUpperCase();
}

export function RequestCard({ item, direction, onAccept, onReject, onComplete, onCancel, onHide }: RequestCardProps) {
  const[cancelModal, showCancelModal] = useState(false);
  const counterparty = direction === 'received' ? item.requester : item.provider;
  const firstname = counterparty?.firstname ?? '';
  const lastname = counterparty?.lastname ?? '';
  const fullName = `${firstname} ${lastname}`.trim() || 'Unknown';
  const photo = counterparty?.profilePicture;
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-150 ${direction === 'received' && item.status === 'pending' ? 'border-l-[3px] border-l-blue-500' : ''}`}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          {photo ? (
            <img src={photo} alt={fullName} className="w-8 h-8 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[11px] font-semibold shrink-0">
              {getInitials(firstname, lastname)}
            </div>
          )}
          <span className="text-[13px] font-semibold text-gray-900">{fullName}</span>
        </div>
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${direction === 'received' ? 'bg-blue-50 text-blue-800' : 'bg-green-50 text-green-800'}`}>
          {direction === 'received' ? 'Received' : 'Sent'}
        </span>
      </div>

      {/* Service title */}
      <p className="text-[13px] font-medium text-gray-800 mb-1 leading-snug">{item.services?.name ?? 'Service'}</p>

      {/* Message preview */}
      {item.message && (
        <p className="text-[12px] text-gray-400 mb-3 leading-snug line-clamp-2">{item.message}</p>
      )}

      {/* Status + budget */}
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[item.status]}`}>
          {STATUS_LABELS[item.status]}
        </span>
        {item.budget && (
          <span className="text-[13px] font-semibold text-gray-900">${item.budget}</span>
        )}
      </div>

      {/* Actions */}
      {direction === 'received' && item.status === 'pending' && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => onAccept(item.request_id )} className="flex-1 py-1.5 text-[12px] font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Accept
          </button>
          <button onClick={() => onReject(item.request_id )} className="flex-1 py-1.5 text-[12px] font-semibold rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors">
            Reject
          </button>
        </div>
      )}

      {direction === 'sent' && item.status === 'pending' && (
        <div className="mt-3">
          <button onClick={() => showCancelModal(true)} className="w-full py-1.5 text-[12px] font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel request
          </button>
        </div>
      )}

      {direction === 'sent' && item.status === 'completed' && (
        <div className="mt-auto flex justify-end">
          <button 
          className = "text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 bg-red-50 text-red-800 border-radius rounded-full border border-red-200 hover:bg-red-200 transition-colors"
          onClick={() => 
            onHide(item.request_id)
            }>
            delete
          </button>
        </div>
      )}

      {direction === 'received' && item.status === 'completed' && (
        <div className="mt-auto flex justify-end">
          <button 
          className = "text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 bg-red-50 text-red-800 border-radius rounded-full border border-red-200 hover:bg-red-200 transition-colors"
          onClick={() => 
            onHide(item.request_id)
            }>
            delete
          </button>
        </div>
      )}

      {item.status === 'accepted' && (
        <div className="flex gap-2 mt-3">
          {direction === 'received' && (
            <button onClick={() => onComplete(item.request_id )} className="flex-1 py-1.5 text-[12px] font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Mark complete
            </button>
          )}
        </div>
      )}
      {cancelModal && (
        <CancelCheckModal
        onConfirm={() => onCancel(item.request_id)}/>
      )}
    </div>
  );
}
