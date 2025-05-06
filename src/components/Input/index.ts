import { colors, fonts, spacing } from "../../theme";
import { getTheme } from "../../theme/mode";

interface InputOptions {
    type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
    value?: string;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    required?: boolean;
    autocomplete?:AutoFill;
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

export class Input {
    private container: HTMLElement;
    private inputElement: HTMLInputElement;
    private labelElement: HTMLLabelElement | null = null;
    private errorElement: HTMLElement | null = null;
    private helperElement: HTMLElement | null = null;
    private prefixElement: HTMLElement | null = null;
    private suffixElement: HTMLElement | null = null;
    private options: InputOptions;

    constructor(options: InputOptions = {}) {
        this.options = {
            type: 'text',
            size: 'md',
            ...options
        }

        this.container = document.createElement('div');
        this.inputElement = document.createElement('input');


        this.setupContainer();
        this.setupInputElement();
        this.setupLabel();
        this.setupIcons();
        this.setupHelperText();
        this.setupErrorState();
    }
    private setupContainer(): void {
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.gap = spacing.xs;
        this.container.style.width = '100%';
    }

    private setupInputElement(): void {
        const theme = getTheme();

        this.inputElement.type = this.options.type || 'text';
        this.inputElement.value = this.options.value || '';
        if (this.options.placeholder) {
            this.inputElement.placeholder = this.options.placeholder;
        }
        this.inputElement.disabled = this.options.disabled || false;
        this.inputElement.required = this.options.required || false;
        if (this.options.autocomplete) {
            this.inputElement.autocomplete = this.options.autocomplete;
        }

        this.inputElement.style.fontFamily = fonts.body;
        this.inputElement.style.color = theme === 'dark' ? colors.background : colors.foreground;
        this.inputElement.style.backgroundColor = theme === 'dark' ? colors.foreground : colors.background;
        this.inputElement.style.border = `1px solid ${theme === 'dark' ? colors.background : colors.foreground}`;
        this.inputElement.style.outline = 'none';
        this.inputElement.style.transition = 'all 0.2s ease';
        this.inputElement.style.boxSizing = 'border-box';
        this.inputElement.style.width = '100%';

        switch (this.options.size) {
            case 'sm':
                this.inputElement.style.padding = `${spacing.xs} ${spacing.sm}`;
                this.inputElement.style.fontSize = '0.875rem';
                this.inputElement.style.borderRadius = this.options.rounded ? '12px' : '4px';
                break;
            case 'lg':
                this.inputElement.style.padding = `${spacing.md} ${spacing.lg}`;
                this.inputElement.style.fontSize = '1.125rem';
                this.inputElement.style.borderRadius = this.options.rounded ? '20px' : '6px';
                break;
            default:
                this.inputElement.style.padding = `${spacing.sm} ${spacing.md}`;
                this.inputElement.style.fontSize = '1rem';
                this.inputElement.style.borderRadius = this.options.rounded ? '16px' : '4px';
        }

        this.inputElement.addEventListener('focus', (e) => {
            this.inputElement.style.borderColor = colors.primary;
            this.inputElement.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
            if (this.options.onFocus) this.options.onFocus(e);
        });

        this.inputElement.addEventListener('blur', (e) => {
            this.inputElement.style.borderColor = theme === 'dark' ? colors.background : colors.foreground;
            this.inputElement.style.boxShadow = 'none';
            if (this.options.onBlur) this.options.onBlur(e);
        });

        this.inputElement.addEventListener('input', (e) => {
            if (this.options.onChange) {
                this.options.onChange(this.inputElement.value, e);
            }
        });

        this.inputElement.addEventListener('keydown', (e) => {
            if (this.options.onKeyDown) {
                this.options.onKeyDown(e);
            }
        });

        this.container.appendChild(this.inputElement);
    }


    private setupLabel(): void {
        if (!this.options.label) return;

        this.labelElement = document.createElement('label');
        this.labelElement.textContent = this.options.label;
        this.labelElement.style.fontFamily = fonts.body;
        this.labelElement.style.fontSize = '0.875rem';
        this.labelElement.style.color = getTheme() === 'dark' ? colors.background : colors.foreground;
        this.labelElement.style.marginBottom = spacing.xs;

        if (this.options.required) {
            const requiredSpan = document.createElement('span');
            requiredSpan.textContent = ' *';
            requiredSpan.style.color = colors.error;
            this.labelElement.appendChild(requiredSpan);
        }

        this.container.insertBefore(this.labelElement, this.container.firstChild);
    }



    private setupIcons(): void {
        if (this.options.prefixIcon || this.options.suffixIcon) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.position = 'relative';
            wrapper.style.width = '100%';

            this.container.removeChild(this.inputElement);
            wrapper.appendChild(this.inputElement);

            if (this.options.prefixIcon) {
                this.prefixElement = document.createElement('span');
                this.prefixElement.textContent = this.options.prefixIcon;
                this.prefixElement.style.position = 'absolute';
                this.prefixElement.style.left = spacing.sm;
                this.prefixElement.style.pointerEvents = 'none';
                wrapper.insertBefore(this.prefixElement, this.inputElement);
                this.inputElement.style.paddingLeft = `calc(${this.inputElement.style.paddingLeft} + 24px)`;
            }

            if (this.options.suffixIcon) {
                this.suffixElement = document.createElement('span');
                this.suffixElement.textContent = this.options.suffixIcon;
                this.suffixElement.style.position = 'absolute';
                this.suffixElement.style.right = spacing.sm;
                this.suffixElement.style.pointerEvents = 'none';
                wrapper.appendChild(this.suffixElement);
                this.inputElement.style.paddingRight = `calc(${this.inputElement.style.paddingRight} + 24px)`;
            }

            this.container.appendChild(wrapper);
        }
    }

    private setupHelperText(): void {
        if (!this.options.helperText) return;

        this.helperElement = document.createElement('p');
        this.helperElement.textContent = this.options.helperText;
        this.helperElement.style.fontFamily = fonts.body;
        this.helperElement.style.fontSize = '0.75rem';
        this.helperElement.style.color = getTheme() === 'dark' ? `${colors.background}80` : `${colors.foreground}80`;
        this.helperElement.style.margin = '0';
        this.helperElement.style.marginTop = spacing.xs;

        this.container.appendChild(this.helperElement);
    }

    private setupErrorState(): void {
        if (!this.options.error) return;

        this.errorElement = document.createElement('p');
        this.errorElement.textContent = this.options.error;
        this.errorElement.style.fontFamily = fonts.body;
        this.errorElement.style.fontSize = '0.75rem';
        this.errorElement.style.color = colors.error;
        this.errorElement.style.margin = '0';
        this.errorElement.style.marginTop = spacing.xs;

        this.inputElement.style.borderColor = colors.error;

        this.container.appendChild(this.errorElement);
    }

    public getValue(): string {
        return this.inputElement.value;
    }

    public setValue(value: string): void {
        this.inputElement.value = value;
    }

    public setError(error: string | null): void {
        if (this.errorElement) {
            this.container.removeChild(this.errorElement);
            this.errorElement = null;
        }

        if (error) {
            this.errorElement = document.createElement('p');
            this.errorElement.textContent = error;
            this.errorElement.style.fontFamily = fonts.body;
            this.errorElement.style.fontSize = '0.75rem';
            this.errorElement.style.color = colors.error;
            this.errorElement.style.margin = '0';
            this.errorElement.style.marginTop = spacing.xs;

            this.inputElement.style.borderColor = colors.error;

            this.container.appendChild(this.errorElement);
        } else {
            const theme = getTheme();
            this.inputElement.style.borderColor = theme === 'dark' ? colors.background : colors.foreground;
        }
    }

    public focus(): void {
        this.inputElement.focus();
    }

    public blur(): void {
        this.inputElement.blur();
    }

    render(): HTMLElement {
        return this.container
    }

    destroy(): void {
        this.inputElement.remove();
        this.container.remove();
    }
}