"use client"
 
import { useCallback, useEffect, useState } from 'react';
import { request } from '@/types/request';
import { fetchUserRequests, updateRequestStatus, deleteRequest, RequestWithService } from '@/lib/requestsAPI';
 
type FilterDirection = 'all' | 'received' | 'sent';
type FilterStatus = 'all' | request['status'];
 
export function useRequests(userId: string | null) {
  const [requests, setRequests] = useState<RequestWithService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterDirection, setFilterDirection] = useState<FilterDirection>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
 
  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserRequests(userId);
      setRequests(data);
      console.log('requests:', data);
      console.log('userId:', userId);
    } catch (e) {
  setError((e as Error).message);
} finally {
      setLoading(false);
    }
  }, [userId]);
 
  useEffect(() => {
    load();
  }, [load]);
 
  const filtered = requests.filter((r) => {
    const direction = r.requester_id === userId ? 'sent' : 'received';
    if (filterDirection !== 'all' && direction !== filterDirection) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });
 
  const unreadCount = requests.filter(
    (r) => r.provider_id === userId && r.status === 'pending'
  ).length;
 

  const accept = useCallback(async (id: string) => {
    setRequests((prev) => prev.map((r) => r.request_id  === id ? { ...r, status: 'accepted' } : r));
    await updateRequestStatus(id, 'accepted');
  }, []);
 
  const reject = useCallback(async (id: string) => {
    setRequests((prev) => prev.map((r) => r.request_id  === id ? { ...r, status: 'rejected' } : r));
    await updateRequestStatus(id, 'rejected');
  }, []);
 
  const complete = useCallback(async (id: string) => {
    setRequests((prev) => prev.map((r) => r.request_id  === id ? { ...r, status: 'completed' } : r));
    await updateRequestStatus(id, 'completed');
  }, []);
 
  const cancel = useCallback(async (id: string) => {
    setRequests((prev) => prev.filter((r) => r.request_id  !== id));
    await deleteRequest(id);
  }, []);
 
  return {
    requests: filtered,
    unreadCount,
    loading,
    error,
    filterDirection,
    filterStatus,
    setFilterDirection,
    setFilterStatus,
    actions: { accept, reject, complete, cancel },
    reload: load,
  };
}