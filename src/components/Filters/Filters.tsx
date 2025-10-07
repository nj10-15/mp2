import css from './Filters.module.css';

type Props = {
  departments: string[];
  selected: string[];
  onToggle: (dept: string) => void;
  onClear: () => void;
};

export default function Filters({ departments, selected, onToggle, onClear }: Props) {
  return (
    <div className={css.wrap}>
      <div className={css.header}>
        <h3>Filter by Department</h3>
        <button onClick={onClear}>Clear</button>
      </div>
      <div className={css.grid}>
        {departments.map(d => (
          <label key={d} className={css.item}>
            <input
              type="checkbox"
              checked={selected.includes(d)}
              onChange={() => onToggle(d)}
            />
            <span>{d}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
