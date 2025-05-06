import { colors, spacing } from "../../theme";
import { getTheme } from "../../theme/mode";
import { applyBaseStyles } from "../../utils/baseStyles";

interface ButtonOptions {
  text: string;
  onClick: (event: Event) => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg';
}

export class Button {
  private element: HTMLButtonElement;

  constructor(options: ButtonOptions) {
    this.element = document.createElement('button');
    this.element.textContent = options.text;
    this.element.type = options.type || 'button';

    applyBaseStyles({
      element: this.element,
      type: 'interactive',
      size: options.size || 'md',
      rounded: false,
      bordered: true,
    });

    this.applyVariantStyles(options.variant || 'primary');
    this.applySizeStyles(options.size || 'md');

    this.element.disabled = options.disabled || false;

    if (options.onClick) {
      this.element.addEventListener('click', options.onClick);
    }
  }

  private applyVariantStyles(variant: string): void {
    const theme = getTheme();
    const isDark = theme === 'dark';
    const textColor = isDark ? colors.foreground : colors.background;

    switch (variant) {
      case 'primary':
        this.element.style.backgroundColor = colors.primary;
        break;
      case 'secondary':
        this.element.style.backgroundColor = colors.secondary;
        break;
      case 'success':
        this.element.style.backgroundColor = colors.success;
        break;
      case 'warning':
        this.element.style.backgroundColor = colors.warning;
        break;
      case 'error':
        this.element.style.backgroundColor = colors.error;
        break;
      default:
        this.element.style.backgroundColor = colors.primary;
    }

    this.element.style.color = textColor;

    // Hover effect
    this.element.addEventListener('mouseenter', () => {
      this.element.style.opacity = '0.9';
    });
    this.element.addEventListener('mouseleave', () => {
      this.element.style.opacity = '1';
    });
  }

  private applySizeStyles(size: string): void {
    switch (size) {
      case 'sm':
        this.element.style.padding = `${spacing.xs} ${spacing.sm}`;
        this.element.style.fontSize = '0.875rem';
        break;
      case 'md':
        this.element.style.padding = `${spacing.sm} ${spacing.md}`;
        this.element.style.fontSize = '1rem';
        break;
      case 'lg':
        this.element.style.padding = `${spacing.md} ${spacing.lg}`;
        this.element.style.fontSize = '1.125rem';
        break;
      default:
        this.element.style.padding = `${spacing.sm} ${spacing.md}`;
        this.element.style.fontSize = '1rem';
        break;
    }
  }

  render(): HTMLElement {
    return this.element;
  }

  setText(text: string): void {
    this.element.textContent = text;
  }

  setDisabled(disabled: boolean): void {
    this.element.disabled = disabled;
    this.element.style.opacity = disabled ? '0.7' : '1';
    this.element.style.cursor = disabled ? 'not-allowed' : 'pointer';
  }

  destroy(): void {
    this.element.remove();
  }
}
