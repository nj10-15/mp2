/**
 Gallery View
 - Visual grid of images
 - Filter by one or many Departments (client-side)
 - NOTE: I intentionally pull a broader sample here (browse endpoint)
   so department filters are more interesting. Search view is query-driven.
*/
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { listArtworks, iiifImage } from '../api/aic';
import Card from '../components/Card/Card';
import Filters from '../components/Filters/Filters';
import { Artwork } from '../types/aic';

async function fetchMany(pages: number, perPage: number) {
  const results: Artwork[] = [];
  for (let p = 1; p <= pages; p++) {
    try {
      const res = await listArtworks(p, perPage);
      results.push(...res.data);
    } catch {
      // ignore this page if it fails; still show what we have
    }
  }
  // keep gallery image-driven
  return results.filter(a => !!a.image_id);
}

export default function GalleryView() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const selected = sp.getAll('dept'); // multi-value

  const [items, setItems] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // pull a broader sample so the departments list is representative
        const data = await fetchMany(3, 100); // 300 artworks
        setItems(data);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const departments = useMemo(() => {
    const uniq = new Set(items.map(i => i.department_title).filter(Boolean) as string[]);
    return Array.from(uniq).sort();
  }, [items]);

  const filtered = useMemo(() => {
    if (!selected.length) return items;
    return items.filter(i => i.department_title && selected.includes(i.department_title));
  }, [items, selected]);

  const toggleDept = (dept: string) => {
    const next = new URLSearchParams(search);
    const current = new Set(next.getAll('dept'));
    current.has(dept) ? current.delete(dept) : current.add(dept);
    next.delete('dept');
    Array.from(current).forEach(d => next.append('dept', d));
    navigate({ pathname: '/gallery', search: next.toString() });
  };

  const clear = () => navigate({ pathname: '/gallery', search: '' });

  // exact context (what user sees after filters) – for Detail prev/next
  const contextIds = filtered.map(a => String(a.id)).join(',');

  return (
    <div>
      <div className="section">
        <Filters
          departments={departments}
          selected={selected}
          onToggle={toggleDept}
          onClear={clear}
        />
      </div>

      {loading ? <p>Loading…</p> : (
        <div className="grid">
          {filtered.map(a => (
            <Card
              key={a.id}
              title={a.title}
              subtitle={a.department_title ?? undefined}
              imageUrl={iiifImage(a.image_id, 500)}
              to={`/art/${a.id}?${new URLSearchParams({
                from: 'gallery',
                depts: selected.join(','),
                ids: contextIds,         // <<< pass the exact list you're viewing
              }).toString()}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
