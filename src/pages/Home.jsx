import React from 'react';
import Slider from '../components/Slider';
import LatestNews from '../components/LatestNews';
import LatestVideos from '../components/LatestVideos';
import TeamBoxes from '../components/TeamBoxes';
import ShopSection from '../components/ShopSection';
import PlayerSection from '../components/PlayerSection';

const Home = () => {
  return (
    <div className="relative mt-4">
      <div id="slider">
        <Slider />
      </div>
      <div id="latest-news">
        <LatestNews />
      </div>
      <div id="latest-videos">
        <LatestVideos />
      </div>
      <div id="team-boxes">
        <TeamBoxes />
      </div>
      <div id="shop-section">
        <ShopSection />
      </div>
      <div id="player-section">
        <PlayerSection />
      </div>
    </div>
  );
};

export default Home;
