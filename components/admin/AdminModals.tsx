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
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-cream w-full max-w-md rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">Confirm Delete</h3>
            <p className="text-black/60 mb-6 text-sm">Are you sure you want to delete this item? This action cannot be undone.</p>
            
            {helpers.error && (
              <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-xl flex items-center gap-3 text-xs font-bold border border-red-100">
                <X size={14} className="shrink-0" />
                <span className="text-left">{helpers.error}</span>
              </div>
            )}

            <div className="flex gap-4">

              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl font-bold border border-black/10 hover:bg-black/5 transition-colors text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={onDeleteConfirm}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-red-500 text-cream hover:bg-red-600 transition-colors shadow-lg text-xs uppercase tracking-widest"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-cream w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-black/5 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal/10 rounded-lg flex items-center justify-center text-teal">
                   <div className="w-2 h-2 bg-teal rounded-full animate-pulse" />
                </div>
                <h2 className="text-xl font-serif font-bold">
                  {editingItem ? 'Edit' : 'Add New'} {activeTab === 'blogs' ? 'Blog' : activeTab === 'cards' ? 'Card' : activeTab === 'reviews' ? 'Review' : 'Team Member'}
                </h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 text-black/20 hover:text-black hover:bg-black/5 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar bg-cream">
              {helpers.error && (
                <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-xl flex items-center gap-3 text-xs font-bold border border-red-100">
                  <div className="p-1 bg-red-500 text-cream rounded-full">
                    <X size={12} />
                  </div>
                  {helpers.error}
                </div>
              )}

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
      )}
    </>
  );
};
