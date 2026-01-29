'use client';

/**
 * DeleteButton - Minimal Client Component
 * Uses React 19 useTransition for optimized server action calls
 * Keeps dashboard as server component while providing smooth UX
 */

import { useTransition } from 'react';
import { deleteRoute } from '@/app/dashboard/actions';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteButtonProps {
  routeId: string;
}

export function DeleteButton({ routeId }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteRoute(routeId);
      // Error handling could be added here with toast notifications
      if (!result.success) {
        alert(result.error || 'Failed to delete route');
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
      title="Delete route"
    >
      {isPending ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  );
}
