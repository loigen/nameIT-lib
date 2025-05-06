import { colors, spacing } from "../../theme";
import { applyBaseStyles } from "../../utils/baseStyles";

interface DropdownOptions {
    triggerText: string;
    items: { text: string; action: () => void }[];
    align?: 'left' | 'right';
    size?: 'sm' | 'md' | 'lg'
}

export class Dropdown {
    private container: HTMLDivElement;
    private trigger: HTMLButtonElement;
    private menu: HTMLDivElement;
    private isOpen = false;

    constructor(private options: DropdownOptions) {
        this.container = document.createElement('div');
        applyBaseStyles({
            element: this.container,
            type: 'container',
            size: options.size || 'md'
        });

        this.container.style.position = 'relative';
        this.container.style.display = 'inline-block';

        this.trigger = document.createElement('button');
        this.trigger.textContent = options.triggerText;

        applyBaseStyles({
            element: this.container,
            type: 'interactive',
            size: this.options.size || 'md',
            rounded: false,
            bordered: false
        })
        this.trigger.style.padding = `${spacing.sm} ${spacing.md}`
        this.trigger.addEventListener('click', this.toggle.bind(this));

        this.menu = document.createElement('div');
        applyBaseStyles({
            element: this.menu,
            type: 'container',
            size: options.size || 'md',
            shadow: true,
            bordered: true
        })
        this.menu.style.position = 'absolute';
        this.menu.style[options.align || 'left'] = '0';
        this.menu.style.top = '100%';
        this.menu.style.marginTop = spacing.xs;
        this.menu.style.minWidth = '160px';
        this.menu.style.zIndex = '1000';
        this.menu.style.display = 'none';
        
        options.items.forEach(item => {
            const menuItem = document.createElement('button');
            menuItem.textContent = item.text;
            applyBaseStyles({
              element: menuItem,
              type: 'interactive',
              size: options.size || 'md'
            });
            menuItem.style.display = 'block';
            menuItem.style.width = '100%';
            menuItem.style.textAlign = 'left';
            menuItem.style.border = 'none';
            menuItem.style.borderRadius = '0';
            
            menuItem.addEventListener('mouseenter', () => {
              menuItem.style.backgroundColor = 'rgba(0,0,0,0.1)';
            });
            
            menuItem.addEventListener('mouseleave', () => {
              menuItem.style.backgroundColor = 'transparent';
            });
      
            menuItem.addEventListener('click', () => {
              item.action();
              this.close();
            });
            this.menu.appendChild(menuItem);
        })
        this.container.appendChild(this.trigger);
        this.container.appendChild(this.menu);
    }
    
    private toggle(): void {
        this.isOpen ? this.close() : this.open();
    }
    private open(): void {
        this.isOpen = true;
        this.menu.style.display = 'block';
    }

    private close(): void {
        this.isOpen = false;
        this.menu.style.display = 'none';
    }

    render(): HTMLElement {
        return this.container;
    }

    destroy(): void {
        this.trigger.removeEventListener('click', this.toggle);
        this.container.remove();
    }
}
