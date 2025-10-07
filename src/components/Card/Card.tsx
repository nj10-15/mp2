import { Link } from 'react-router-dom';
import css from './Card.module.css';

type Props = {
  imageUrl: string;
  title: string;
  subtitle?: string | null;
  to: string;
};
export default function Card({ imageUrl, title, subtitle, to }: Props) {
  return (
    <Link className={css.card} to={to}>
      <div className={css.imgWrap}>
        {imageUrl ? <img src={imageUrl} alt={title} /> : <div className={css.placeholder}>No image</div>}
      </div>
      <div className={css.meta}>
        <h3 className={css.title}>{title}</h3>
        {subtitle && <p className={css.subtitle}>{subtitle}</p>}
      </div>
    </Link>
  );
}
