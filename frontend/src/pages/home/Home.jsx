import Chat_screen from "@/components/common/home-page/Chat_screen";
import EmbededSteps from "@/components/common/home-page/EmbededSteps";
import Particle_screen from "@/components/common/home-page/Particle_screen";
import Pricing from "@/components/common/home-page/Pricing";
import Trust_component from "@/components/common/home-page/Trust_component";
import TrustedCompany from "@/components/common/home-page/TrustedCompany";
import MainLayout from "@/components/layout/MainLayout";
import React from "react";

const Home = () => {
  return (
    <MainLayout>
      <Particle_screen />
      <Chat_screen />
      <TrustedCompany />
      <Trust_component />
      <EmbededSteps />
      <Pricing />
    </MainLayout>
  );
};

export default Home;
