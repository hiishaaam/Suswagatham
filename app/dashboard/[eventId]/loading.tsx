import Skeleton from '@/components/ui/Skeleton'

export default function DashboardLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-40 min-h-screen bg-ivory">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8 pt-4">
        <Skeleton variant="circle" className="w-8 h-8 rounded mb-4" />
        <Skeleton variant="text" className="w-64 h-8 mb-4 max-w-[80%]" />
        <Skeleton variant="text" className="w-48 h-4 mb-2 max-w-[60%]" />
      </div>

      {/* Progress Bar */}
      <div className="mb-8 px-2">
        <div className="flex justify-between items-end mb-2">
          <Skeleton variant="text" className="w-16 h-3" />
          <Skeleton variant="text" className="w-12 h-4" />
        </div>
        <Skeleton variant="card" className="h-3 w-full rounded-full" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
        <Skeleton variant="card" className="col-span-2 h-28" />
        <Skeleton variant="card" className="h-24" />
        <Skeleton variant="card" className="h-24" />
        <Skeleton variant="card" className="h-24" />
        <Skeleton variant="card" className="h-24" />
        <Skeleton variant="card" className="h-24" />
        <Skeleton variant="card" className="h-24" />
      </div>

      {/* Quick Add Skeleton */}
      <Skeleton variant="card" className="h-14 mb-8" />

      {/* Guest List Loader */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <Skeleton variant="text" className="w-40 h-6" />
          <Skeleton variant="text" className="w-32 h-6 rounded-full" />
        </div>
        
        <Skeleton variant="card" className="h-12 w-full mb-6 rounded-2xl" />

        <div className="space-y-3">
          <Skeleton variant="card" className="h-24 w-full rounded-2xl" />
          <Skeleton variant="card" className="h-24 w-full rounded-2xl" />
          <Skeleton variant="card" className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
