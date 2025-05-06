
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  export function kebabCase(str: string): string {
    return str.replace(/\s+/g, '-').toLowerCase();
  }
  