import { spacing, fonts, colors } from '../../theme';

export interface SearchOptions {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export class SearchBar {
  private container: HTMLElement;
  private options: SearchOptions;

  constructor(containerId: string, options: SearchOptions) {
    const container = document.getElementById(containerId);
    if (!container) throw new Error(`Search container "${containerId}" not found.`);
    this.container = container;
    this.options = options;
    this.render();
  }

  private render() {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = this.options.placeholder || 'Search...';
    input.style.padding = spacing.sm;
    input.style.border = `1px solid ${colors.foreground}`;
    input.style.borderRadius = '4px';
    input.style.width = '100%';
    input.style.fontFamily = fonts.body;

    input.addEventListener('input', () => {
      const value = input.value;
      this.options.onSearch?.(value);
    });

    this.container.appendChild(input);
  }
}
