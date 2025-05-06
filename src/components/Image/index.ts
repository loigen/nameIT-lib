import { colors, spacing } from '../../theme/tokens';
import { getTheme } from '../../theme/mode';

interface ImageOptions {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  lazy?: boolean;
  rounded?: boolean;
  bordered?: boolean;
  placeholder?: string;
  aspectRatio?: string;
  onLoad?: () => void;
  onError?: () => void;
  debug?: boolean;
}

export class Image {
  private container: HTMLElement;
  private imgElement: HTMLImageElement;
  private options: ImageOptions;
  private observer?: IntersectionObserver;

  constructor(options: ImageOptions) {
    this.options = options;
    this.container = document.createElement('div');
    this.imgElement = document.createElement('img');
    
    this.setupContainer();
    this.setupImageElement();
    this.setupLoadingStrategy();
  }

  private setupContainer(): void {
    this.container.style.position = 'relative';
    this.container.style.display = 'inline-block';
    this.container.style.overflow = 'hidden';

    if (this.options.width) {
      this.container.style.width = typeof this.options.width === 'number' 
        ? `${this.options.width}px` 
        : this.options.width;
    }

    if (this.options.height) {
      this.container.style.height = typeof this.options.height === 'number' 
        ? `${this.options.height}px` 
        : this.options.height;
    }

    if (this.options.aspectRatio) {
      this.container.style.aspectRatio = this.options.aspectRatio;
    }

    if (this.options.rounded) {
      this.container.style.borderRadius = '50%';
    } else {
      this.container.style.borderRadius = '4px';
    }

    if (this.options.bordered) {
      const theme = getTheme();
      this.container.style.border = `1px solid ${theme === 'dark' ? colors.background : colors.foreground}`;
    }
  }

  private setupImageElement(): void {
    this.imgElement.alt = this.options.alt || '';
    this.imgElement.style.width = '100%';
    this.imgElement.style.height = '100%';
    this.imgElement.style.objectFit = 'cover';
    this.imgElement.style.transition = 'opacity 0.3s ease';
    this.imgElement.style.opacity = '0';

    if (this.options.placeholder) {
      this.imgElement.style.background = this.options.placeholder;
    }

    this.imgElement.addEventListener('load', () => {
      this.imgElement.style.opacity = '1';
      if (this.options.onLoad) this.options.onLoad();
    });

    this.imgElement.addEventListener('error', () => {
      if (this.options.debug) {
        console.error(`Image failed to load: ${this.options.src}`);
      }
      if (this.options.onError) this.options.onError();
      this.showErrorState();
    });
  }

  private setupLoadingStrategy(): void {
    if (this.options.lazy && 'IntersectionObserver' in window) {
      this.setupLazyLoading();
    } else {
      this.loadImageImmediately();
    }
  }

  private setupLazyLoading(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage();
          this.observer?.unobserve(this.container);
        }
      });
    }, {
      rootMargin: '200px'
    });

    this.observer.observe(this.container);
  }

  private loadImageImmediately(): void {
    this.loadImage();
  }

  private loadImage(): void {
    if (this.options.placeholder) {
      const placeholder = document.createElement('div');
      placeholder.style.position = 'absolute';
      placeholder.style.inset = '0';
      placeholder.style.background = this.options.placeholder;
      this.container.appendChild(placeholder);
    }

    this.imgElement.src = this.options.src;
    this.container.appendChild(this.imgElement);
  }

  private showErrorState(): void {
    const theme = getTheme();
    const errorContainer = document.createElement('div');
    errorContainer.style.position = 'absolute';
    errorContainer.style.inset = '0';
    errorContainer.style.display = 'flex';
    errorContainer.style.alignItems = 'center';
    errorContainer.style.justifyContent = 'center';
    errorContainer.style.backgroundColor = theme === 'dark' 
      ? `${colors.error}20` 
      : `${colors.error}10`;
    errorContainer.style.color = colors.error;
    errorContainer.style.fontFamily = 'sans-serif';
    errorContainer.style.fontSize = '0.875rem';
    errorContainer.textContent = 'Image failed to load';

    this.container.appendChild(errorContainer);
  }

  render(): HTMLElement {
    return this.container;
  }

  update(newOptions: Partial<ImageOptions>): void {
    this.options = { ...this.options, ...newOptions };
    this.container.innerHTML = '';
    this.imgElement = document.createElement('img');
    this.setupContainer();
    this.setupImageElement();
    this.setupLoadingStrategy();
  }

  destroy(): void {
    this.observer?.disconnect();
    this.container.remove();
  }
}