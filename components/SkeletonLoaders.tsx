import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Shimmer = () => (
  <motion.div 
    initial={{ x: '-100%' }}
    animate={{ x: '100%' }}
    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" 
  />
);

export const SkeletonCard = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-black/5 rounded-3xl overflow-hidden relative p-6 h-[400px] flex flex-col shadow-sm"
  >
    <div className="w-full h-48 bg-slate-100 rounded-2xl mb-6 relative overflow-hidden">
      <Shimmer />
    </div>
    <div className="h-8 bg-slate-100 rounded-lg w-3/4 mb-4 relative overflow-hidden">
      <Shimmer />
    </div>
    <div className="h-4 bg-slate-100 rounded-lg w-1/2 mb-8 relative overflow-hidden">
      <Shimmer />
    </div>
    <div className="mt-auto flex justify-between items-center">
      <div className="h-10 bg-slate-100 rounded-xl w-32 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="h-10 bg-slate-100 rounded-full w-10 relative overflow-hidden">
        <Shimmer />
      </div>
    </div>
  </motion.div>
);

export const SkeletonBlog = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="border border-black/5 rounded-3xl overflow-hidden p-6 relative bg-white shadow-sm"
  >
    <div className="aspect-video bg-slate-100 rounded-2xl mb-6 relative overflow-hidden">
      <Shimmer />
    </div>
    <div className="h-6 bg-slate-100 rounded-lg w-1/4 mb-4 relative overflow-hidden">
      <Shimmer />
    </div>
    <div className="h-10 bg-slate-100 rounded-lg w-full mb-4 relative overflow-hidden">
      <Shimmer />
    </div>
    <div className="h-4 bg-slate-100 rounded-lg w-2/3 relative overflow-hidden">
      <Shimmer />
    </div>
  </motion.div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="w-full space-y-4 p-4">
    <div className="h-12 bg-slate-100 rounded-xl w-full relative overflow-hidden">
      <Shimmer />
    </div>
    {[...Array(rows)].map((_, i) => (
      <motion.div 
        key={i} 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05 }}
        className="h-16 bg-white border border-black/5 rounded-xl w-full flex items-center px-6 gap-4 relative overflow-hidden shadow-sm"
      >
        <div className="h-8 w-8 bg-slate-100 rounded-lg shrink-0" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="h-4 bg-slate-100 rounded w-1/6" />
        <div className="h-4 bg-slate-100 rounded w-1/4 ml-auto" />
        <Shimmer />
      </motion.div>
    ))}
  </div>
);

export const SkeletonHero = () => (
    <div className="max-w-[1440px] mx-auto px-6 py-20 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="h-4 bg-slate-100 rounded w-32 mb-8 relative overflow-hidden"
        ><Shimmer /></motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="h-32 bg-slate-100 rounded-3xl w-2/3 mb-10 relative overflow-hidden"
        ><Shimmer /></motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="h-6 bg-slate-100 rounded w-1/2 mb-12 relative overflow-hidden"
        ><Shimmer /></motion.div>
        <div className="flex gap-4">
            <div className="h-14 bg-slate-100 rounded-full w-48 relative overflow-hidden"><Shimmer /></div>
            <div className="h-14 bg-slate-100 rounded-full w-48 relative overflow-hidden"><Shimmer /></div>
        </div>
    </div>
);
