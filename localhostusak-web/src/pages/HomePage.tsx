import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { Manifesto } from '../components/home/Manifesto';
import { ValuesBento } from '../components/home/ValuesBento';
import { PersonaCards } from '../components/home/PersonaCards';
import { EventSpotlight } from '../components/home/EventSpotlight';
import { FlowSteps } from '../components/home/FlowSteps';
import { SponsorsSection } from '../components/home/SponsorsSection';
import { StatsSection } from '../components/home/StatsSection';
import { BigCTA } from '../components/home/BigCTA';
import { useGeneralSettings } from '../context/GeneralSettingsContext';
import seoPages from '../seo/pages.json';
import { usePageMeta } from '../hooks/usePageMeta';

export const HomePage: React.FC = () => {
  const { settings } = useGeneralSettings();

  usePageMeta({
    title: settings?.meta?.siteTitle || seoPages["/"].title,
    description: settings?.meta?.defaultDescription || seoPages["/"].description,
  });

  return (
    <main>
      {/* 1. Karşılama */}
      <HeroSection />
      {/* 2. Misyon Vizyon */}
      <Manifesto />
      <section className="container" style={{ paddingBlock: '3rem', lineHeight: 1.8 }}>
        <h2>Uşak'ta yazılım, mühendislik ve birlikte üretim</h2>
        <p>Uşak teknoloji topluluğu localhostusak; yazılımcıları, mühendisleri, tasarımcıları ve öğrencileri aynı masada buluşturur. Deneyimini paylaşmak, yeni beceriler öğrenmek veya bir projeye ekip arkadaşı bulmak için aramıza katılabilirsin.</p>
        <p><Link to="/etkinlikler">Uşak coworking ve teknoloji buluşmalarını</Link> takip et, <Link to="/projeler">açık kaynak yazılım projelerini</Link> keşfet veya <Link to="/kariyer">iş ilanları, staj ve kariyer paylaşımlarına</Link> göz at. Yeni içerikler topluluk tarafından eklendikçe bu sayfalarda görünür.</p>
        <p lang="en"><Link to="/en">Meet the Usak technology and software developer community →</Link></p>
      </section>
      {/* 3. Değerlerimiz */}
      <ValuesBento />
      {/* 4. Kimler Katılabilir */}
      <PersonaCards />
      {/* 5. Buluşma Takvimi */}
      <EventSpotlight />
      {/* 6. Buluşma Formatı */}
      <FlowSteps />
      {/* 7. Sponsorlarımız */}
      <SponsorsSection />
      {/* 8. Scoreboard */}
      <StatsSection />
      {/* 9. Hemen aramıza katıl */}
      <BigCTA />
    </main>
  );
};
