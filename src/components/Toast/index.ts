import { toast, type Toast as ToastData } from '../../hooks/useToast';
import { colors, spacing, fonts } from '../../theme';

export class Toast {
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.style.position = 'fixed';
    this.container.style.top = spacing.md;
    this.container.style.right = spacing.md;
    this.container.style.zIndex = '9999';
    this.container.style.display = 'flex';
    this.container.style.flexDirection = 'column';
    this.container.style.gap = spacing.sm;
    document.body.appendChild(this.container);

    toast.subscribe(this.showToast.bind(this));
  }

  private showToast(toastData: ToastData) {
    const toastEl = document.createElement('div');
    toastEl.textContent = toastData.message;
    toastEl.setAttribute('data-id', toastData.id);

    toastEl.style.backgroundColor = this.getBackgroundColor(toastData.type);
    toastEl.style.color = colors.background;
    toastEl.style.padding = spacing.sm;
    toastEl.style.borderRadius = '6px';
    toastEl.style.fontFamily = fonts.body;
    toastEl.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    toastEl.style.opacity = '1';
    toastEl.style.transition = 'opacity 0.3s ease';

    this.container.appendChild(toastEl);

    setTimeout(() => {
      toastEl.style.opacity = '0';
      setTimeout(() => {
        this.container.removeChild(toastEl);
      }, 300);
    }, toastData.duration || 3000);
  }

  private getBackgroundColor(type: ToastData['type']): string {
    switch (type) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'info':
      default:
        return colors.secondary;
    }
  }
}
