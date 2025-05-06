import { colors, spacing, fonts } from '../../theme';

export interface NavLink {
  label: string;
  href: string;
}

export class Navigation {
  private container: HTMLElement;
  private isOpen = false;
  private navLinks: NavLink[] = [];

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) throw new Error(`Navigation container "${containerId}" not found.`);
    this.container = container;
  }

  render(links: NavLink[]) {
    this.navLinks = links;
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.style.backgroundColor = colors.primary;
    wrapper.style.color = colors.background;
    wrapper.style.fontFamily = fonts.body;

    const topBar = document.createElement('div');
    topBar.className = 'flex items-center justify-between';
    topBar.style.padding = spacing.md;

    const brand = document.createElement('span');
    brand.textContent = 'MyApp';
    brand.style.fontFamily = fonts.heading;
    brand.style.fontSize = '1.25rem';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'md:hidden';
    toggleBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
                              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M4 6h16M4 12h16M4 18h16"></path>
                          </svg>`;
    toggleBtn.onclick = () => this.toggleMenu();
    topBar.appendChild(brand);
    topBar.appendChild(toggleBtn);

    const linkContainer = document.createElement('div');
    linkContainer.id = 'nav-links';
    linkContainer.className = 'hidden md:flex md:space-x-4';
    linkContainer.style.padding = spacing.md;

    if (links.length === 0) {
      const empty = document.createElement('span');
      empty.textContent = 'No navigation items available';
      empty.style.color = colors.warning;
      linkContainer.appendChild(empty);
    } else {
      links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.label;
        a.style.padding = spacing.sm;
        a.style.borderRadius = '4px';
        a.style.cursor = 'pointer';
        a.className = 'hover:underline';
        linkContainer.appendChild(a);
      });
    }

    wrapper.appendChild(topBar);
    wrapper.appendChild(linkContainer);
    this.container.appendChild(wrapper);
  }

  private toggleMenu() {
    this.isOpen = !this.isOpen;
    const linksEl = document.getElementById('nav-links');
    if (linksEl) {
      linksEl.className = `${this.isOpen ? 'flex' : 'hidden'} flex-col md:flex md:flex-row md:space-x-4`;
    }
  }
}
