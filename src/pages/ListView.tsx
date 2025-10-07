/**
 List View (Search)
 - Debounced search-as-you-type
 - Client-side sort (Title / Artist) + Asc/Desc
 - Keeps URL in sync for shareability
*/
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchArtworks, iiifImage } from '../api/aic';
import { useDebounce } from '../utils/useDebounce';
import SearchBar from '../components/SearchBar/SearchBar';
import SortBar from '../components/SortBar/SortBar';
import Card from '../components/Card/Card';
import { Artwork } from '../types/aic';

export default function ListView() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);

  const q0 = sp.get('q') ?? '';
  const sort0 = sp.get('sort') ?? 'title';
  const order0 = (sp.get('order') as 'asc' | 'desc') ?? 'asc';
  const page0 = Number(sp.get('page') ?? 1);

  const [q, setQ] = useState(q0);
  const qDebounced = useDebounce(q, 350);

  const [items, setItems] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);

  // keep URL in sync with user input + sort
  useEffect(() => {
    const s = new URLSearchParams({
      q: qDebounced,
      sort: sort0,
      order: order0,
      page: String(page0),
    });
    navigate({ pathname: '/search', search: s.toString() }, { replace: true });
  }, [qDebounced, sort0, order0, page0, navigate]);

  // fetch when q changes (default seed makes initial page not empty)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await searchArtworks({ q: qDebounced || 'painting', page: page0, limit: 99 });
        // only keep items that have images so gallery/detail behavior matches
        setItems(res.data.filter(a => !!a.image_id));
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [qDebounced, page0]);

  const sorted = useMemo(() => {
    const arr = [...items];
    const key = sort0 as keyof Artwork;
    arr.sort((a, b) => {
      const A = (a?.[key] ?? '').toString().toLowerCase();
      const B = (b?.[key] ?? '').toString().toLowerCase();
      return order0 === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
    });
    return arr;
  }, [items, sort0, order0]);

  // exact context (the list the user is seeing) – used by Detail prev/next
  const contextIds = sorted.map(a => String(a.id)).join(',');

  return (
    <div>
      <div className="section">
        <SearchBar value={q} onChange={setQ} placeholder="Search artworks or artists…" />
        <SortBar
          sort={sort0}
          order={order0}
          options={[
            { value: 'title', label: 'Title' },
            { value: 'artist_title', label: 'Artist' },
          ]}
          onChange={(sort, order) => {
            const s = new URLSearchParams({ q: qDebounced, sort, order, page: '1' });
            navigate({ pathname: '/search', search: s.toString() });
          }}
        />
      </div>

      {loading ? <p>Loading…</p> : (
        <div className="grid">
          {sorted.map(a => (
            <Card
              key={a.id}
              title={a.title}
              subtitle={a.artist_title}
              imageUrl={iiifImage(a.image_id, 400)}
              to={`/art/${a.id}?${new URLSearchParams({
                from: 'search',
                q: qDebounced,
                sort: sort0,
                order: order0,
                ids: contextIds,         // <<< pass the exact list you're viewing
              }).toString()}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
