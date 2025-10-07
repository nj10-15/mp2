/**
 Detail View
 - Shows selected artwork attributes
 - Prev/Next respect the originating list (Search or Gallery)
*/
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getArtwork, searchArtworks, listArtworks, iiifImage } from '../api/aic';
import { Artwork } from '../types/aic';

async function fetchMany(pages: number, perPage: number) {
  const results: Artwork[] = [];
  for (let p = 1; p <= pages; p++) {
    try {
      const res = await listArtworks(p, perPage);
      results.push(...res.data);
    } catch {
      // ignore page failure
    }
  }
  return results;
}

export default function DetailView() {
  const { id } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const sp = new URLSearchParams(search);
  const from = sp.get('from'); // 'search' | 'gallery'

  // if the originating view passed its exact visible IDs, use them as context
  const idsCsv = sp.get('ids') || '';
  const idsFromList = idsCsv ? idsCsv.split(',').filter(Boolean) : [];

  const [art, setArt] = useState<Artwork | null>(null);
  const [context, setContext] = useState<Artwork[]>([]);

  // load the selected artwork
  useEffect(() => {
    (async () => setArt(await getArtwork(id!)))();
  }, [id]);

  // rebuild the list context for Prev/Next
  useEffect(() => {
    (async () => {
      try {
        // 1) If we received the exact IDs from the source view, use those directly.
        if (idsFromList.length) {
          setContext(idsFromList.map(sid => ({ id: Number(sid) } as Artwork)));
          return;
        }

        // 2) Otherwise, fall back to fetching a reasonable context like before.
        if (from === 'search') {
          const q = sp.get('q') || 'painting';
          const res = await searchArtworks({ q, page: 1, limit: 48 });
          setContext(res.data);
        } else if (from === 'gallery') {
          const selectedDepts = (sp.get('depts') ?? '').split(',').filter(Boolean);
          const data = await fetchMany(3, 100);
          const filtered = selectedDepts.length
            ? data.filter(a => a.department_title && selectedDepts.includes(a.department_title))
            : data;
          setContext(filtered);
        } else {
          const res = await listArtworks(1, 48);
          setContext(res.data);
        }
      } catch {
        setContext([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, search, idsCsv]);

  const index = useMemo(
    () => context.findIndex(x => String(x.id) === String(id)),
    [context, id]
  );
  const prev = index > 0 ? context[index - 1] : null;
  const next = index >= 0 && index < context.length - 1 ? context[index + 1] : null;

  if (!art) return <p>Loading…</p>;

  return (
    <div className="section">
      <div style={{ display:'grid', gridTemplateColumns:'minmax(260px, 480px) 1fr', gap:'16px' }}>
        <div>
          <img src={iiifImage(art.image_id, 800)} alt={art.title} style={{ width:'100%', borderRadius:12 }} />
        </div>
        <div>
          <h1>{art.title}</h1>
          {art.artist_title && <p><strong>Artist:</strong> {art.artist_title}</p>}
          {art.date_display && <p><strong>Date:</strong> {art.date_display}</p>}
          {art.medium_display && <p><strong>Medium:</strong> {art.medium_display}</p>}
          {art.department_title && <p><strong>Department:</strong> {art.department_title}</p>}
          <div style={{ display:'flex', gap:8, marginTop:12 }}>
            <button disabled={!prev} onClick={() => prev && navigate(`/art/${prev.id}?${sp.toString()}`)}>← Previous</button>
            <button disabled={!next} onClick={() => next && navigate(`/art/${next.id}?${sp.toString()}`)}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
