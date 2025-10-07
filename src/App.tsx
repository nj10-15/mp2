import { Link } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './App.css';

export default function App() {
  return (
    <div className="container">
      <header className="appHeader">
  <h1 className="appTitle">🎨 ArtVision: Explore the Art Institute Gallery</h1>
  <nav>
    <Link to="/search">Search</Link>
    <Link to="/gallery">Gallery</Link>
  </nav>
</header>
      <main>
        <AppRoutes />
      </main>
    </div>
  );
}
