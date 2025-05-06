import { spacing, fonts, colors } from '../../theme';

export interface TableProps {
  columns: string[];
  data: Record<string, string>[];
  emptyMessage?: string;
}

export class Table {
  private container: HTMLElement;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) throw new Error(`Table container "${containerId}" not found.`);
    this.container = container;
  }

  render(props: TableProps) {
    this.container.innerHTML = '';

    if (props.data.length === 0) {
      const message = document.createElement('p');
      message.textContent = props.emptyMessage || 'No data available';
      message.style.textAlign = 'center';
      message.style.color = colors.warning;
      message.style.fontFamily = fonts.body;
      this.container.appendChild(message);
      return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontFamily = fonts.body;

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    props.columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      th.style.padding = spacing.sm;
      th.style.border = `1px solid ${colors.foreground}`;
      th.style.backgroundColor = colors.secondary;
      th.style.color = colors.background;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    props.data.forEach(row => {
      const tr = document.createElement('tr');
      props.columns.forEach(col => {
        const td = document.createElement('td');
        td.textContent = row[col] || '';
        td.style.padding = spacing.sm;
        td.style.border = `1px solid ${colors.foreground}`;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    this.container.appendChild(table);
  }
}
