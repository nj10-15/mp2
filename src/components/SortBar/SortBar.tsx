import css from '../SortBar/SortBar.module.css';

type Opt = { value: string; label: string };
type Props = {
  sort: string;
  order: 'asc' | 'desc';
  options: Opt[];
  onChange: (sort: string, order: 'asc' | 'desc') => void;
};
export default function SortBar({ sort, order, options, onChange }: Props) {
  return (
    <div className={css.row}>
      <label>
        Sort by:{' '}
        <select value={sort} onChange={(e) => onChange(e.target.value, order)}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <button onClick={() => onChange(sort, order === 'asc' ? 'desc' : 'asc')}>
        {order === 'asc' ? 'Asc ↑' : 'Desc ↓'}
      </button>
    </div>
  );
}
