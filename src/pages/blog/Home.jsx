import React from 'react';
import { HomeProvider } from '../../context/HomeContext.jsx';
import LatestNews from '../../components/blog/LatestNews.jsx';
import LatestVideos from '../../components/blog/LatestVideos.jsx';
import TeamBoxes from '../../components/blog/TeamBoxes.jsx';
import PlayerSection from '../../components/blog/PlayerSection.jsx';
import SpinLoader from '../../pages/UI/SpinLoader.jsx';
import SomethingWentWrong from '../../pages/UI/SomethingWentWrong.jsx';
import { useHome } from '../../context/HomeContext.jsx';
import Slider from '../../components/blog/Slider.jsx'
import ShopSection from '../../components/blog/ShopSection.jsx'


const HomeContent = () => {
  const { isLoading, isError } = useHome();

  if (isError) {
    return <SomethingWentWrong />;
  }

  if (isLoading) {
    return <SpinLoader />;
  }

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

export default function Home() {
  return (
    <HomeProvider>
      <HomeContent />
    </HomeProvider>
  );
}

