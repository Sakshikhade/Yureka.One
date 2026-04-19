import React from 'react';
import { useSupabase } from '../SupabaseProvider';
import { SkeletonTable } from '../SkeletonLoaders';

export const AdminLogsTab: React.FC = () => {
  const { logs, isLoading } = useSupabase();

  if (isLoading && logs.length === 0) {
    return <SkeletonTable />;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h3 className="text-xl font-serif font-bold mb-1">System Activity Log</h3>
        <p className="text-black/40 text-xs">A transparent record of all changes made to the platform.</p>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-20rem)] custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="bg-black/5 text-[10px] uppercase font-bold tracking-widest text-black/40">
              <th className="px-6 py-4 bg-slate-50">Time</th>
              <th className="px-6 py-4 bg-slate-50">Member</th>
              <th className="px-6 py-4 bg-slate-50">Action</th>
              <th className="px-6 py-4 bg-slate-50">Target Type</th>
              <th className="px-6 py-4 bg-slate-50">Record Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-black/[0.01] transition-colors">
                <td className="px-6 py-4 text-xs text-black/40">
                  {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                </td>
                <td className="px-6 py-4 font-bold text-sm">{log.user_email || 'System'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${log.action === 'INSERT' ? 'bg-green-100 text-green-600' : log.action === 'UPDATE' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-black/60 capitalize">{log.table_name}</td>
                <td className="px-6 py-4 font-bold text-sm">{log.record_name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
