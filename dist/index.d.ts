interface ButtonOptions {
    text: string;
    onClick: (event: Event) => void;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    size?: 'sm' | 'md' | 'lg';
}
declare class Button {
    private element;
    constructor(options: ButtonOptions);
    private applyVariantStyles;
    private applySizeStyles;
    render(): HTMLElement;
    setText(text: string): void;
    setDisabled(disabled: boolean): void;
    destroy(): void;
}

interface DropdownOptions {
    triggerText: string;
    items: {
        text: string;
        action: () => void;
    }[];
    align?: 'left' | 'right';
    size?: 'sm' | 'md' | 'lg';
}
declare class Dropdown {
    private options;
    private container;
    private trigger;
    private menu;
    private isOpen;
    constructor(options: DropdownOptions);
    private toggle;
    private open;
    private close;
    render(): HTMLElement;
    destroy(): void;
}

interface ErrorBoundaryOptions {
    fallback?: (error: Error) => HTMLElement;
    onError?: (error: Error, errorInfo: {
        componentStack: string;
    }) => void;
}
declare class ErrorBoundary {
    private container;
    private currentChild;
    private options;
    constructor(options?: ErrorBoundaryOptions);
    render(child: HTMLElement): HTMLElement;
    private handleError;
    private createDefaultFallback;
    private getComponentStack;
    destroy(): void;
}

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
declare class Image {
    private container;
    private imgElement;
    private options;
    private observer?;
    constructor(options: ImageOptions);
    private setupContainer;
    private setupImageElement;
    private setupLoadingStrategy;
    private setupLazyLoading;
    private loadImageImmediately;
    private loadImage;
    private showErrorState;
    render(): HTMLElement;
    update(newOptions: Partial<ImageOptions>): void;
    destroy(): void;
}

interface InputOptions {
    type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
    value?: string;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    required?: boolean;
    autocomplete?: AutoFill;
    size?: 'sm' | 'md' | 'lg';
    rounded?: boolean;
    bordered?: boolean;
    error?: string;
    helperText?: string;
    prefixIcon?: string;
    suffixIcon?: string;
    onChange?: (value: string, event: Event) => void;
    onFocus?: (event: Event) => void;
    onBlur?: (event: Event) => void;
    onKeyDown?: (event: Event) => void;
}
declare class Input {
    private container;
    private inputElement;
    private labelElement;
    private errorElement;
    private helperElement;
    private prefixElement;
    private suffixElement;
    private options;
    constructor(options?: InputOptions);
    private setupContainer;
    private setupInputElement;
    private setupLabel;
    private setupIcons;
    private setupHelperText;
    private setupErrorState;
    getValue(): string;
    setValue(value: string): void;
    setError(error: string | null): void;
    focus(): void;
    blur(): void;
    render(): HTMLElement;
    destroy(): void;
}

type LoaderType = 'spinner' | 'dots' | 'bar' | 'progress';
type LoaderSize = 'sm' | 'md' | 'lg';
interface LoaderOptions {
    type?: LoaderType;
    size?: LoaderSize;
    color?: string;
    message?: string;
    progress?: number;
}
declare class Loader {
    private container;
    private loaderElement;
    private messageElement;
    private options;
    constructor(options?: LoaderOptions);
    private setupContainer;
    private createLoader;
    private createSpinnerLoader;
    private createBarLoader;
    private createProgressLoader;
    private createDotsLoader;
    private setupMessage;
    private addKeyframes;
    private getSizeValue;
    private getFontSize;
    setProgress(progress: number): void;
    setMessage(message: string): void;
    setType(type: LoaderType): void;
    render(): HTMLElement;
    destroy(): void;
}

interface NavLink {
    label: string;
    href: string;
}
declare class Navigation {
    private container;
    private isOpen;
    private navLinks;
    constructor(containerId: string);
    render(links: NavLink[]): void;
    private toggleMenu;
}

interface SearchOptions {
    placeholder?: string;
    onSearch?: (query: string) => void;
}
declare class SearchBar {
    private container;
    private options;
    constructor(containerId: string, options: SearchOptions);
    private render;
}

interface TableProps {
    columns: string[];
    data: Record<string, string>[];
    emptyMessage?: string;
}
declare class Table {
    private container;
    constructor(containerId: string);
    render(props: TableProps): void;
}

declare class Toast {
    private container;
    constructor();
    private showToast;
    private getBackgroundColor;
}

type ValidationRule<T> = {
    field: keyof T;
    validate: (value: T[keyof T]) => boolean;
    message: string;
};
declare function validateForm<T extends Record<string, any>>(data: T, rules: ValidationRule<T>[]): {
    valid: boolean;
    errors: Partial<Record<keyof T, string>>;
};

declare function lazyLoadImage(imgElement: HTMLImageElement, rootMargin?: string): void;

declare const colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    foreground: string;
};
declare const spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
};
declare const fonts: {
    body: string;
    heading: string;
};
declare const breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
};

declare function setTheme(mode: "light" | "dark"): void;
declare function getTheme(): "light" | "dark";

declare function clamp(value: number, min: number, max: number): number;
declare function roundTo(value: number, decimals?: number): number;

interface BaseStylesOptions {
    element: HTMLElement;
    type?: 'text' | 'heading' | 'container' | 'interactive';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    rounded?: boolean;
    shadow?: boolean;
    bordered?: boolean;
}
declare function applyBaseStyles(options: BaseStylesOptions): void;

export { BaseStylesOptions, Button, Dropdown, ErrorBoundary, Image, Input, Loader, NavLink, Navigation, SearchBar, SearchOptions, Table, TableProps, Toast, applyBaseStyles, breakpoints, clamp, colors, fonts, getTheme, lazyLoadImage, roundTo, setTheme, spacing, validateForm };
