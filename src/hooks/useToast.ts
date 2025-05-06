export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

type ToastListener = (toast: Toast) => void;

class ToastManager {
  private listeners = new Set<ToastListener>();

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  show(toast: Omit<Toast, "id">) {
    const toastWithId: Toast = { ...toast, id: crypto.randomUUID() };
    this.listeners.forEach(listener => listener(toastWithId));
  }
}

export const toast = new ToastManager();
