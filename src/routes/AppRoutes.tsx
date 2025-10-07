/**
 App routes – all views are part of a single-page app (SPA).
 Each view has its own route; Detail has a stable /art/:id route as required.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import ListView from '../pages/ListView';
import GalleryView from '../pages/GalleryView';
import DetailView from '../pages/DetailView';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/search" replace />} />
      <Route path="/search" element={<ListView />} />
      <Route path="/gallery" element={<GalleryView />} />
      <Route path="/art/:id" element={<DetailView />} />
      <Route path="*" element={<Navigate to="/search" replace />} />
    </Routes>
  );
}
