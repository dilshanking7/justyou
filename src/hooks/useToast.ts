import { useToastStore } from '../lib/toastStore';

export function useToast() {
  const { addToast, removeToast, clearToasts } = useToastStore();

  return {
    toast: addToast,
    success: (title: string, description?: string) => addToast(title, description, 'success'),
    error: (title: string, description?: string) => addToast(title, description, 'error'),
    info: (title: string, description?: string) => addToast(title, description, 'info'),
    warning: (title: string, description?: string) => addToast(title, description, 'warning'),
    removeToast,
    clearToasts,
  };
}
