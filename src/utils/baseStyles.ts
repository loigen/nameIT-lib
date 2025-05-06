import { colors, spacing, fonts, breakpoints } from '../theme/tokens';
import { getTheme } from '../theme/mode';

export interface BaseStylesOptions {
  element: HTMLElement;
  type?: 'text' | 'heading' | 'container' | 'interactive';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
  shadow?: boolean;
  bordered?: boolean;
}

export function applyBaseStyles(options: BaseStylesOptions): void {
  const theme = getTheme();
  const { element, type = 'text', size = 'md', rounded = false, shadow = false, bordered = false } = options;

  // Reset styles
  element.style.margin = '0';
  element.style.padding = '0';
  element.style.boxSizing = 'border-box';

  // Typography
  switch (type) {
    case 'heading':
      element.style.fontFamily = fonts.heading;
      element.style.fontWeight = '600';
      element.style.lineHeight = '1.25';
      break;
    case 'interactive':
      element.style.fontFamily = fonts.body;
      element.style.cursor = 'pointer';
      element.style.userSelect = 'none';
      break;
    default:
      element.style.fontFamily = fonts.body;
      element.style.lineHeight = '1.5';
  }

  // Font sizing
  switch (size) {
    case 'xs':
      element.style.fontSize = '0.75rem';
      break;
    case 'sm':
      element.style.fontSize = '0.875rem';
      break;
    case 'md':
      element.style.fontSize = '1rem';
      break;
    case 'lg':
      element.style.fontSize = '1.125rem';
      break;
    case 'xl':
      element.style.fontSize = '1.25rem';
      break;
  }

  // Colors based on theme
  if (type === 'container') {
    element.style.backgroundColor = theme === 'dark' ? colors.foreground : colors.background;
    element.style.color = theme === 'dark' ? colors.background : colors.foreground;
  } else {
    element.style.color = theme === 'dark' ? colors.background : colors.foreground;
  }

  // Border styles
  if (bordered) {
    element.style.border = `1px solid ${theme === 'dark' ? colors.background : colors.foreground}`;
    element.style.borderRadius = rounded ? '50%' : '4px';
  } else if (rounded) {
    element.style.borderRadius = '50%';
  }

  // Shadow
  if (shadow) {
    element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  }

  // Interactive transitions
  if (type === 'interactive') {
    element.style.transition = 'all 0.2s ease';
  }
}
