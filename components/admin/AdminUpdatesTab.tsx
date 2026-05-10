import React, { useState } from 'react';
import { useSupabase } from '../SupabaseProvider';
import { updateCardContributionStatus, addCard, deleteCardContribution, updateCard, deleteCard } from '../../services/supabaseService';
import { 
  PlusCircle, AlertTriangle, Trash2, 
  Check, X, ChevronDown, ChevronUp, Loader2,
  Clock, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { CardContribution } from '../../types';

const AdminUpdatesTab: React.FC = () => {
  const { cardContributions } = useSupabase();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingContributions = cardContributions.filter(c => c.status === 'pending');
  const resolvedContributions = cardContributions.filter(c => c.status !== 'pending');

  const handleApproveAdd = async (contribution: CardContribution) => {
    if (!window.confirm(`Are you sure you want to add "${contribution.card_name}" to the live database?`)) return;
    setProcessingId(contribution.id || null);
    try {
      // Merge with required defaults to prevent DB errors
      const fullCardData = {
        type: 'Rewards',
        color: 'from-blue-600 to-indigo-700',
        benefits: [],
        categories: [],
        ...contribution.payload,
        status: 'published'
      };
      
      await addCard(fullCardData);
      await updateCardContributionStatus(contribution.id!, 'approved');
    } catch (err: any) {
      console.error('Failed to approve:', err);
      alert(`Failed to approve the card addition: ${err.message || 'Unknown error'}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveUpdate = async (contribution: CardContribution) => {
    if (!window.confirm(`Are you sure you want to push updates to "${contribution.card_name}" live?`)) return;
    setProcessingId(contribution.id || null);
    try {
      const payload = { ...contribution.payload };
      const cardId = payload.id;
      delete payload.id; // remove id before update
      delete payload.inaccuracyDetails; // remove notes
      
      await updateCard(cardId, payload);
      await updateCardContributionStatus(contribution.id!, 'resolved');
    } catch (err: any) {
      console.error('Failed to update:', err);
      alert(`Failed to update the card: ${err.message || 'Unknown error'}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveRemove = async (contribution: CardContribution) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${contribution.card_name}" from the database?`)) return;
    setProcessingId(contribution.id || null);
    try {
      await deleteCard(contribution.payload.id);
      await updateCardContributionStatus(contribution.id!, 'resolved');
    } catch (err: any) {
      console.error('Failed to remove:', err);
      alert(`Failed to remove the card: ${err.message || 'Unknown error'}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('Reject and delete this contribution?')) return;
    setProcessingId(id);
    try {
      await deleteCardContribution(id);
    } catch (err) {
      console.error('Failed to reject:', err);
      alert('Failed to reject contribution.');
    } finally {
      setProcessingId(null);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'add': return <PlusCircle size={18} className="text-clay" />;
      case 'update': return <AlertTriangle size={18} className="text-yellow-500" />;
      case 'remove': return <Trash2 size={18} className="text-red-500" />;
      default: return <ShieldAlert size={18} className="text-white/40" />;
    }
  };

  const renderContributionCard = (c: CardContribution) => {
    const isExpanded = expandedId === c.id;
    const isProcessing = processingId === c.id;

    return (
      <div key={c.id} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-xl mb-4 transition-all">
        <div 
          onClick={() => setExpandedId(isExpanded ? null : c.id!)}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
              {getIcon(c.type)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-white text-sm">{c.card_name}</h3>
                {c.status === 'pending' ? (
                  <span className="px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-500 text-[9px] uppercase tracking-widest font-black border border-yellow-500/20 flex items-center gap-1">
                    <Clock size={10} /> Pending
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-clay/10 text-clay text-[9px] uppercase tracking-widest font-black border border-clay/20 flex items-center gap-1">
                    <CheckCircle2 size={10} /> {c.status}
                  </span>
                )}
              </div>
              <div className="text-xs text-white/40 mt-1 flex gap-3">
                <span>By: {c.email || 'Anonymous'}</span>
                <span>•</span>
                <span>{new Date(c.created_at!).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {isExpanded && (
          <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
            <div className="mb-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Submission Details</h4>
              {c.type === 'add' || c.type === 'update' ? (
                <div className="bg-white/5 rounded-xl p-4 overflow-x-auto border border-white/5">
                  {c.type === 'update' && c.payload.inaccuracyDetails && (
                    <div className="mb-4 pb-4 border-b border-white/10 text-sm text-white/80 leading-relaxed italic">
                      Notes: "{c.payload.inaccuracyDetails}"
                    </div>
                  )}
                  <pre className="text-xs text-clay font-mono whitespace-pre-wrap">
                    {JSON.stringify(c.payload, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-sm text-white/80 leading-relaxed italic">
                  Reason for Removal: "{c.payload.removalReason}"
                  <br/>
                  Target ID: {c.payload.id}
                </div>
              )}
            </div>

            {c.status === 'pending' && (
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                {c.type === 'add' && (
                  <button 
                    onClick={() => handleApproveAdd(c)}
                    disabled={isProcessing}
                    className="bg-clay text-cream px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-clay/20 disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Approve & Publish
                  </button>
                )}
                {c.type === 'update' && (
                  <button 
                    onClick={() => handleApproveUpdate(c)}
                    disabled={isProcessing}
                    className="bg-clay text-cream px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-clay/20 disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Approve Update
                  </button>
                )}
                {c.type === 'remove' && (
                  <button 
                    onClick={() => handleApproveRemove(c)}
                    disabled={isProcessing}
                    className="bg-red-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Approve Removal
                  </button>
                )}
                
                <button 
                  onClick={() => handleReject(c.id!)}
                  disabled={isProcessing}
                  className="bg-white/5 text-white border border-white/10 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50 ml-auto"
                >
                  {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />} Reject
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-black text-white uppercase tracking-tight">Community Intel</h2>
          <p className="text-sm text-white/40 mt-1">Review and approve user-submitted card additions, updates, and removals.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-center shadow-lg">
            <span className="block text-2xl font-black text-white">{pendingContributions.length}</span>
            <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Pending</span>
          </div>
          <div className="px-5 py-2.5 bg-clay/10 border border-clay/20 rounded-xl text-center shadow-lg">
            <span className="block text-2xl font-black text-clay">{resolvedContributions.length}</span>
            <span className="text-[9px] uppercase tracking-widest text-clay font-bold">Resolved</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/60">Action Required</h3>
          </div>
          {pendingContributions.length === 0 ? (
            <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center bg-white/[0.02]">
              <CheckCircle2 size={32} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Inbox Zero</p>
            </div>
          ) : (
            pendingContributions.map(renderContributionCard)
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-clay" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/60">Resolved Intel</h3>
          </div>
          {resolvedContributions.length === 0 ? (
            <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center bg-white/[0.02]">
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest">No history yet</p>
            </div>
          ) : (
            resolvedContributions.map(renderContributionCard)
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUpdatesTab;
