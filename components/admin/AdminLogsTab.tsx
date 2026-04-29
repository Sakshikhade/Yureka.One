import React from 'react';
import { useSupabase } from '../SupabaseProvider';
import { SkeletonTable } from '../SkeletonLoaders';

export const AdminLogsTab: React.FC = () => {
  const { logs, isLoading } = useSupabase();

  if (isLoading && logs.length === 0) {
    return <SkeletonTable />;
  }

  return (
    <div className="p-4 md:p-10">
      <div className="mb-10">
        <h3 className="text-2xl font-serif font-black text-white mb-1 uppercase tracking-tight">Audit Trail</h3>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">A transparent record of all environmental modifications.</p>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-20rem)] custom-scrollbar rounded-[2rem] border border-white/5 bg-[#1a1a1a]/30">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="bg-[#1a1a1a] text-[10px] uppercase font-black tracking-widest text-white/40 border-b border-white/5">
              <th className="px-8 py-5">Timestamp</th>
              <th className="px-8 py-5">Node Identity</th>
              <th className="px-8 py-5">Modification</th>
              <th className="px-8 py-5">Sector</th>
              <th className="px-8 py-5">Entity Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6 text-[11px] text-white/30 font-mono tracking-tighter">
                  {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                </td>
                <td className="px-8 py-6 font-bold text-sm text-white">{log.user_email?.split('@')[0] || 'System'}</td>
                <td className="px-8 py-6">
                  <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                    log.action === 'INSERT' 
                      ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/20' 
                      : log.action === 'UPDATE' 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-white/40 capitalize font-bold">{log.table_name}</td>
                <td className="px-8 py-6 font-bold text-sm text-white/80">{log.record_name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
