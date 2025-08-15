import React from 'react';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import Tile from '../src/components/tiles/Tile';

const tileData = [
  { title: 'ZED', subtitle: 'Tile 1', icon: null },
  { title: 'ZYNC', subtitle: 'Tile 2', icon: null },
  { title: 'ZETA', subtitle: 'Tile 3', icon: null },
  { title: 'ZWAP!', subtitle: 'Tile 4', icon: null },
  { title: 'ZULU', subtitle: 'Tile 5', icon: null },
  { title: 'Config', subtitle: 'Tile 6', icon: null },
];

const Home: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main className="flex-1 flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl py-12 px-4">
        {tileData.map((tile, idx) => (
          <Tile key={tile.title} title={tile.title} subtitle={tile.subtitle} />
        ))}
      </div>
      <div className="w-full max-w-3xl mt-8 flex flex-col items-center">
        <img src="/assets/Zebulon_UI_TileNameUpdate.png" alt="Zebulon UI Mockup" className="rounded-xl shadow-lg w-full h-auto mb-4" />
        <img src="/assets/Zebulon_UI.jpg" alt="Zebulon UI Reference" className="rounded-xl shadow w-full h-auto" />
      </div>
    </main>
    <Footer />
  </div>
);

export default Home;
