import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { BlogForm } from './BlogForm';
import { CardForm } from './CardForm';
import { ReviewForm } from './ReviewForm';
import { TeamForm } from './TeamForm';

interface AdminModalsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  activeTab: string;
  editingItem: any;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  onDeleteConfirm: () => void;
  onSave: (e: React.FormEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  forms: {
    blog: any;
    card: any;
    review: any;
    team: any;
  };
  setForms: {
    setBlog: (form: any) => void;
    setCard: (form: any) => void;
    setReview: (form: any) => void;
    setTeam: (form: any) => void;
  };
  helpers: {
    banks: string[];
    categories: string[];
    generateSlug: (name: string, bank: string) => string;
    uploading: boolean;
    saving: boolean;
    error: string | null;
  };
}

export const AdminModals: React.FC<AdminModalsProps> = ({
  isModalOpen,
  setIsModalOpen,
  activeTab,
  editingItem,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  onDeleteConfirm,
  onSave,
  onFileUpload,
  forms,
  setForms,
  helpers
}) => {
  return (
    <>
  return (
    <>
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-[#111] w-full max-w-md rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-10 text-center border border-white/10">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
              <Trash2 size={40} />
            </div>
            <h3 className="text-3xl font-serif font-black mb-3 text-white uppercase tracking-tight">Confirm Purge</h3>
            <p className="text-white/40 mb-8 text-sm font-bold uppercase tracking-widest leading-relaxed">This operation is irreversible. All associated data will be permanently decommissioned.</p>
            
            {helpers.error && (
              <div className="mb-8 p-4 bg-red-500/10 text-red-500 rounded-2xl flex items-center gap-3 text-[11px] font-black uppercase tracking-wider border border-red-500/20">
                <X size={14} className="shrink-0" />
                <span className="text-left">{helpers.error}</span>
              </div>
            )}

            <div className="flex gap-4">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-8 py-4 rounded-2xl font-black border border-white/10 hover:bg-white/5 transition-all text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white"
              >
                Abort
              </button>
              <button 
                onClick={onDeleteConfirm}
                className="flex-1 px-8 py-4 rounded-2xl font-black bg-red-600 text-white hover:bg-red-500 transition-all shadow-lg text-[11px] uppercase tracking-[0.2em]"
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#111] w-full max-w-2xl rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.9)] overflow-hidden max-h-[90vh] flex flex-col border border-white/10">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#1a1a1a]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#34d399]/10 rounded-xl flex items-center justify-center text-[#34d399] border border-[#34d399]/20">
                   <div className="w-2.5 h-2.5 bg-[#34d399] rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-black text-white uppercase tracking-tight">
                    {editingItem ? 'Modify' : 'Initialize'} {activeTab === 'blogs' ? 'Entity' : activeTab === 'cards' ? 'Product' : activeTab === 'reviews' ? 'Node' : 'Identity'}
                  </h2>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Status: Configuration Active</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 text-white/20 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar bg-[#111]">
              {helpers.error && (
                <div className="mb-8 p-5 bg-red-500/10 text-red-500 rounded-[1.5rem] flex items-center gap-4 text-[11px] font-black uppercase tracking-wider border border-red-500/20">
                  <div className="p-1.5 bg-red-500 text-white rounded-lg">
                    <X size={14} />
                  </div>
                  {helpers.error}
                </div>
              )}

              <div className="admin-forms-dark">
                {activeTab === 'blogs' && forms.blog && (
                  <BlogForm 
                    form={forms.blog || {}} 
                    setForm={setForms.setBlog} 
                    onSubmit={onSave}
                    onFileUpload={onFileUpload}
                    uploading={helpers.uploading}
                    saving={helpers.saving}
                    error={helpers.error}
                  />
                )}

                {activeTab === 'cards' && forms.card && (
                  <CardForm 
                    form={forms.card || {}} 
                    setForm={setForms.setCard} 
                    onSubmit={onSave}
                    onFileUpload={onFileUpload}
                    uploading={helpers.uploading}
                    saving={helpers.saving}
                    error={helpers.error}
                    banks={helpers.banks || []}
                    categories={helpers.categories || []}
                    generateSlug={helpers.generateSlug}
                  />
                )}

                {activeTab === 'reviews' && forms.review && (
                  <ReviewForm 
                    form={forms.review || {}} 
                    setForm={setForms.setReview} 
                    onSubmit={onSave}
                    onFileUpload={onFileUpload}
                    uploading={helpers.uploading}
                    saving={helpers.saving}
                    error={helpers.error}
                  />
                )}

                {activeTab === 'settings' && forms.team && (
                  <TeamForm 
                    form={forms.team || {}} 
                    setForm={setForms.setTeam} 
                    onSubmit={onSave}
                    uploading={helpers.uploading}
                    saving={helpers.saving}
                    error={helpers.error}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
    </>
  );
};
