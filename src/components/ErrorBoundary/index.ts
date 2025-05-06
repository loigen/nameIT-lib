import { colors } from '../../theme/tokens';
import { getTheme } from '../../theme/mode';

interface ErrorBoundaryOptions {
  fallback?: (error: Error) => HTMLElement;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
}

export class ErrorBoundary {
  private container: HTMLElement;
  private currentChild: HTMLElement | null = null;
  private options: ErrorBoundaryOptions;

  constructor(options: ErrorBoundaryOptions = {}) {
    this.container = document.createElement('div');
    this.options = options;
  }

  render(child: HTMLElement): HTMLElement {
    try {
      this.container.innerHTML = '';
      
      if (this.currentChild) {
        this.container.removeChild(this.currentChild);
      }
      
      this.container.appendChild(child);
      this.currentChild = child;
      
      return this.container;
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  private handleError(error: Error): HTMLElement {
    if (this.options.onError) {
      const errorInfo = {
        componentStack: this.getComponentStack(error)
      };
      this.options.onError(error, errorInfo);
    }

    this.container.innerHTML = '';

    if (this.options.fallback) {
      this.container.appendChild(this.options.fallback(error));
    } else {
      this.container.appendChild(this.createDefaultFallback(error));
    }

    return this.container;
  }

  private createDefaultFallback(error: Error): HTMLElement {
    const theme = getTheme();
    const fallbackContainer = document.createElement('div');
    
    // Apply theme styles
    fallbackContainer.style.padding = '1rem';
    fallbackContainer.style.borderRadius = '4px';
    fallbackContainer.style.backgroundColor = theme === 'dark' 
      ? `${colors.error}20` 
      : `${colors.error}10`;
    fallbackContainer.style.border = `1px solid ${colors.error}`;
    fallbackContainer.style.color = theme === 'dark' 
      ? colors.background 
      : colors.foreground;

    const title = document.createElement('h3');
    title.textContent = 'Something went wrong';
    title.style.marginTop = '0';
    title.style.color = colors.error;
    fallbackContainer.appendChild(title);

    const message = document.createElement('p');
    message.textContent = error.message;
    message.style.marginBottom = '0.5rem';
    fallbackContainer.appendChild(message);

    
    if (process.env.NODE_ENV === 'development') {
      const stack = document.createElement('details');
      stack.style.marginTop = '1rem';
      
      const summary = document.createElement('summary');
      summary.textContent = 'Error details';
      summary.style.cursor = 'pointer';
      stack.appendChild(summary);
      
      const pre = document.createElement('pre');
      pre.style.whiteSpace = 'pre-wrap';
      pre.style.fontFamily = 'monospace';
      pre.textContent = error.stack || 'No stack trace available';
      stack.appendChild(pre);
      
      fallbackContainer.appendChild(stack);
    }

    const button = document.createElement('button');
    button.textContent = 'Try again';
    button.style.marginTop = '1rem';
    button.style.padding = '0.5rem 1rem';
    button.style.backgroundColor = colors.error;
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', () => {
      if (this.currentChild) {
        this.render(this.currentChild);
      }
    });
    fallbackContainer.appendChild(button);

    return fallbackContainer;
  }

  private getComponentStack(error: Error): string {
    return error.stack || 'Component stack not available';
  }

  destroy(): void {
    this.container.innerHTML = '';
    this.currentChild = null;
  }
}