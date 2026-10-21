import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-800/60 rounded ${className}`}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-36" />
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-[#111827] border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-40" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonLoader = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <TableSkeleton rows={4} />
    </div>
  );
};
