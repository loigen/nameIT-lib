import { colors } from "../../theme";
import { getTheme } from "../../theme/mode";

type LoaderType = 'spinner' | 'dots' | 'bar' | 'progress';
type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderOptions {
    type?: LoaderType;
    size?: LoaderSize;
    color?: string;
    message?: string;
    progress?: number;
}

export class Loader {
    private container: HTMLElement;
    private loaderElement: HTMLElement;
    private messageElement: HTMLElement | null = null;
    private options: LoaderOptions;

    constructor(options: LoaderOptions = {}) {
        this.options = {
            type: 'spinner',
            size: 'md',
            ...options
        };

        this.container = document.createElement('div');
        this.loaderElement = document.createElement('div');

        this.setupContainer();
        this.createLoader();
        this.setupMessage();
    }

    private setupContainer(): void {
        this.container.style.display = 'inline-flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.gap = '8px';
    }

    private createLoader(): void {
        const color = this.options.color || (getTheme() === 'dark' ? colors.background : colors.foreground);
        const size = this.getSizeValue(this.options.size);

        switch (this.options.type) {
            case 'dots':
                this.createDotsLoader(color, size);
                break;
            case 'bar':
                this.createBarLoader(color, size);
                break;
            case 'progress':
                this.createProgressLoader(color, size);
                break;
            case 'spinner':
            default:
                this.createSpinnerLoader(color, size);
                break;
        }
    }

    private createSpinnerLoader(color: string, size: number): void {
        this.loaderElement.style.width = `${size}px`;
        this.loaderElement.style.height = `${size}px`;
        this.loaderElement.style.border = `${Math.max(2, size / 10)}px solid rgba(0, 0, 0, 0.1)`;
        this.loaderElement.style.borderRadius = '50%';
        this.loaderElement.style.borderTopColor = color;
        this.loaderElement.style.animation = 'spin 1s linear infinite';

        this.addKeyframes(`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `);

        this.container.appendChild(this.loaderElement);
    }

    private createBarLoader(color: string, size: number): void {
        const barHeight = Math.max(4, size / 4);
        const barWidth = size * 2;

        this.loaderElement.style.width = `${barWidth}px`;
        this.loaderElement.style.height = `${barHeight}px`;
        this.loaderElement.style.backgroundColor = `${color}20`;
        this.loaderElement.style.borderRadius = `${barHeight / 2}px`;
        this.loaderElement.style.overflow = 'hidden';

        const progressBar = document.createElement('div');
        progressBar.style.height = '100%';
        progressBar.style.width = `${this.options.progress || 0}%`;
        progressBar.style.backgroundColor = color;
        progressBar.style.borderRadius = `${barHeight / 2}px`;
        progressBar.style.transition = 'width 0.3s ease';

        this.loaderElement.appendChild(progressBar);
        this.container.appendChild(this.loaderElement);
    }

    private createProgressLoader(color: string, size: number): void {
        this.createBarLoader(color, size);
    }

    private createDotsLoader(color: string, size: number): void {
        this.loaderElement.style.display = 'flex';
        this.loaderElement.style.gap = '4px';

        this.addKeyframes(`
            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }
        `);

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.style.width = `${size / 4}px`;
            dot.style.height = `${size / 4}px`;
            dot.style.backgroundColor = color;
            dot.style.borderRadius = '50%';
            dot.style.animation = `bounce 1.4s infinite ease-in-out both`;
            dot.style.animationDelay = `${i * 0.16}s`;
            this.loaderElement.appendChild(dot);
        }

        this.container.appendChild(this.loaderElement);
    }

    private setupMessage(): void {
        if (this.options.message) {
            this.messageElement = document.createElement('div');
            this.messageElement.textContent = this.options.message;
            this.messageElement.style.fontFamily = 'inherit';
            this.messageElement.style.fontSize = this.getFontSize(this.options.size);
            this.messageElement.style.color = getTheme() === 'dark' ? colors.background : colors.foreground;
            this.container.appendChild(this.messageElement);
        }
    }

    private addKeyframes(css: string): void {
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    private getSizeValue(size: LoaderSize = 'md'): number {
        switch (size) {
            case 'sm': return 24;
            case 'lg': return 48;
            default: return 32;
        }
    }

    private getFontSize(size: LoaderSize = 'md'): string {
        switch (size) {
            case 'sm': return '0.75rem';
            case 'lg': return '1rem';
            default: return '0.875rem';
        }
    }

    public setProgress(progress: number): void {
        if (this.options.type === 'progress' || this.options.type === 'bar') {
            const progressBar = this.loaderElement.firstChild as HTMLElement;
            if (progressBar) {
                progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
            }
        }
    }

    public setMessage(message: string): void {
        if (this.messageElement) {
            this.messageElement.textContent = message;
        } else if (message) {
            this.messageElement = document.createElement('div');
            this.messageElement.textContent = message;
            this.messageElement.style.fontFamily = 'inherit';
            this.messageElement.style.fontSize = this.getFontSize(this.options.size);
            this.messageElement.style.color = getTheme() === 'dark' ? colors.background : colors.foreground;
            this.container.appendChild(this.messageElement);
        }
    }

    public setType(type: LoaderType): void {
        if (type !== this.options.type) {
            this.options.type = type;
            this.loaderElement.remove();
            this.loaderElement = document.createElement('div');
            this.createLoader();
        }
    }

    render(): HTMLElement {
        return this.container;
    }

    destroy(): void {
        this.container.remove();
        document.querySelectorAll('style').forEach(style => {
            if (
                style.innerHTML.includes('@keyframes spin') ||
                style.innerHTML.includes('@keyframes bounce')
            ) {
                style.remove();
            }
        });
    }
}
