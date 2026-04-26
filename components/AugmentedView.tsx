"use client"

import React, { useState, useEffect } from 'react';
import { request } from '@/types/request';
import { deleteNotification, RequestWithService } from '@/lib/requestsAPI';
import {CancelCheckModal } from './CancelCheckModal'
import { getProfileByID } from '@/lib/services';
import UseProfile from '@/hooks/UseProfile';
import { createPortal } from 'react-dom';
import { FaPhoneAlt, FaMoneyBillAlt, FaBusinessTime } from "react-icons/fa";

interface AugmentedViewProps {
  item: RequestWithService;
  direction: 'sent' | 'received';
  onAccept: (id: string, send_message?: string) => void;
  onReject: (id: string,  send_message?: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onHide: (id: string) => void;
  onClosePanel: () => void;
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

export function AugmentedView({ item, direction, onAccept, onReject, onComplete, onCancel, onHide, onClosePanel }: AugmentedViewProps) {
  const[cancelModal, showCancelModal] = useState(false);
  const counterparty = direction === 'received' ? item.requester : item.provider;
  const firstname = counterparty?.firstname ?? '';
  const lastname = counterparty?.lastname ?? '';
  const fullName = `${firstname} ${lastname}`.trim() || 'Unknown';
  const photo = counterparty?.profilePicture;
  const[isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClosePanel = () => {
    onClosePanel();
  }
  const {providerProfile} = UseProfile(item.provider_id);;

  if (!mounted) return null;

  return (
    <> 
    {isOpen && createPortal(
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={handleClosePanel} 
        />

        {/* Centered modal */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[480px] max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-xl p-4">
    
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
            <span className={`text-[10px] font-semibold flex ml-auto px-2.5 py-1 rounded-full shrink-0 ${direction === 'received' ? 'bg-blue-50 text-blue-800' : 'bg-green-50 text-green-800'}`}>
              {direction === 'received' ? 'Received' : 'Sent'}
            </span>
            <div className = "flex item-right font-semibold text-gray-300">
              <button onClick={handleClosePanel}>
              ×
              </button>
            </div>
          </div>

          {/* Service title */}
          <p className="text-[13px] font-medium text-gray-600 mb-1 leading-snug">{item.services?.name ?? 'Service'}</p>

          {/* Message preview */}
          {item.message && (
            <p className="text-sm text-gray-900 mb-3 mt-2">{item.message}</p>
          )}

          {/* preview */}
          {direction == 'received' && (
          <div className = "flex items-center gap-2 mt-3 mb-2">
          {item.communication_method && (
            <p className="text-sm text-gray-900 leading-snug flex items-center gap-1"> <FaPhoneAlt /> {item.communication_method}</p>
          )}
          {item.budget && (
            <p className="text-sm text-gray-900 leading-snug"> ${item.budget}</p>
          )}
          {item.duration_requested && (
            <p className="text-sm text-gray-900 leading-snug flex items-center gap-1"> <FaBusinessTime /> {item.duration_requested}</p>
          )}
          </div>
          )}
          {direction === 'sent' && item.status === 'accepted' && (
            <span className="text-sm font-semibold text-gray-900">
            {item.send_message}
            </span>
          )}
          {/* Contact info if accepted */}
          {(item.status == 'accepted'|| item.status == 'completed') && providerProfile != null && direction == 'sent' && <div>
            <h1 className="text-[13px] mt-3 font-medium leading-snug font-bold" >Contact on</h1>
            <p className="text-[12px] text-gray-400 mb-5 leading-snug line-clamp-2" style={{color: "#007BFF", textDecoration: (item.communication_method == "email" ? "underline": "")}}>{item.communication_method == "email" ? providerProfile.email : providerProfile.phoneNumber}</p>
          </div>}

          {direction === 'received' && item.status === 'pending' && (
            <span>
            <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 border border-gray-300 rounded-md p-1 resize-none text-sm w-full h-10"
            placeholder="send a message before accepting..."
          />
            </span>
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
            <div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => onAccept(item.request_id, message)} className="flex-1 py-1.5 text-[12px] font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Accept
              </button>
              <button onClick={() => onReject(item.request_id, message)} className="flex-1 py-1.5 text-[12px] font-semibold rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors">
                Reject
              </button>
            </div>
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
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 bg-red-50 text-red-800 border border-red-200 hover:bg-red-200 transition-colors"
              onClick={() => onHide(item.request_id)}>
                delete
              </button>
            </div>
          )}

          {direction === 'received' && item.status === 'completed' && (
            <div className="mt-auto flex justify-end">
              <button 
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 bg-red-50 text-red-800 border border-red-200 hover:bg-red-200 transition-colors"
              onClick={() => onHide(item.request_id)}>
                delete
              </button>
            </div>
          )}

          {item.status === 'accepted' && (
            <div className="flex gap-2 mt-3">
              {direction === 'received' && (
                <button onClick={() => onComplete(item.request_id)} className="flex-1 py-1.5 text-[12px] font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Mark complete
                </button>
              )}
            </div>
          )}
          {cancelModal && (
            <CancelCheckModal
            onConfirm={() => onCancel(item.request_id)}
            onClosePanel={() => showCancelModal(false)}/>
          )}
        </div>
      </>,
      document.body
    )}
    </>
  );
}
