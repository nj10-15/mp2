import css from './SearchBar.module.css';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};
export default function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <div className={css.wrap}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={css.input}
        placeholder={placeholder ?? 'Search...'}
      />
      {value && (
        <button className={css.clear} onClick={() => onChange('')} aria-label="Clear">×</button>
      )}
    </div>
  );
}
