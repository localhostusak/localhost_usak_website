import React, { useState, useEffect, useMemo } from 'react';
import { PageHero } from '../components/layout/PageHero';
import { FilterBar, FilterOption } from '../components/shared/FilterBar';
import { CareerCard } from '../components/careers/CareerCard';
import { CareerResources } from '../components/careers/CareerResources';
import { CareerCTA } from '../components/careers/CareerCTA';
import { EmptyState } from '../components/shared/EmptyState';
import { CareerItem } from '../types/career';
import { useLinks } from '../context/LinksContext';

import { fetchCareers, fetchCareersPageSettings, CareersPageSettingsData } from '../services/api';
import { usePageMeta } from '../hooks/usePageMeta';
import { useCmsCollection } from '../hooks/useCmsCollection';

export const CareersPage: React.FC = () => {
  const { links } = useLinks();
  const { items: careers, isLoading, error, retry } = useCmsCollection<CareerItem>(fetchCareers);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [settings, setSettings] = useState<CareersPageSettingsData | null>(null);

  // SEO Meta
  usePageMeta({
    title: settings?.meta?.title || 'Kariyer & İlanlar — localhostusak',
    description:
      settings?.meta?.description ||
      "Uşak ve uzaktan çalışma olanakları; teknoloji, yazılım, staj ve freelance kariyer fırsatları panosu.",
  });

  useEffect(() => {
    fetchCareersPageSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {
        // Fallback to static defaults
      });
  }, []);

  const primaryOptions: FilterOption[] = [
    { id: 'all', label: 'Tüm İlanlar', icon: '⚡' },
    { id: 'job', label: 'İş İlanı', icon: '💼' },
    { id: 'internship', label: 'Staj', icon: '🎓' },
    { id: 'freelance', label: 'Freelance', icon: '🌍' },
    { id: 'mentorship', label: 'Mentorluk', icon: '🤝' },
  ];

  const secondaryOptions: FilterOption[] = [
    { id: 'all', label: 'Tüm Çalışma Şekilleri' },
    { id: 'remote', label: 'Remote', icon: '🌐' },
    { id: 'hybrid', label: 'Hibrit', icon: '🏢' },
    { id: 'onsite', label: 'Ofis', icon: '📍' },
  ];

  const filteredCareers = useMemo(() => {
    return careers.filter((c) => {
      const matchType = selectedType === 'all' || c.type === selectedType;
      const matchMode = selectedWorkMode === 'all' || c.workMode === selectedWorkMode;
      const matchSearch =
        searchQuery.trim() === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchType && matchMode && matchSearch;
    });
  }, [careers, selectedType, selectedWorkMode, searchQuery]);

  return (
    <main>
      <PageHero
        tag={settings?.hero?.tag || "// KARİYER & FIRSAT PANOSU"}
        title={settings?.hero?.title || "Uşak'tan Globale,"}
        highlightText={settings?.hero?.highlightText || "Doğru Fırsatı Yakala"}
        description={settings?.hero?.description || "Topluluk üyelerinin paylaştığı iş ilanları, staj fırsatları, freelance projeler ve ücretsiz mentorluk eşleşmeleri."}
        whatsappUrl={settings?.whatsappCta?.overrideUrl || links.whatsappCareers}
        whatsappLabel={settings?.whatsappCta?.buttonText || "WhatsApp Kariyer Grubuna Katıl"}
      />

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Filter Bar */}
        <FilterBar
          primaryLabel="Tür"
          primaryOptions={primaryOptions}
          selectedPrimary={selectedType}
          onSelectPrimary={setSelectedType}
          secondaryLabel="Çalışma Şekli"
          secondaryOptions={secondaryOptions}
          selectedSecondary={selectedWorkMode}
          onSelectSecondary={setSelectedWorkMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Teknoloji, pozisyon veya şirket ara..."
        />

        {/* List Title */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            Aktif Fırsatlar <span style={{ color: 'var(--accent-primary)' }}>({filteredCareers.length})</span>
          </h2>
        </div>

        {isLoading ? (
          <EmptyState icon="⏳" title="İlanlar Yükleniyor" description="Güncel fırsatlar getiriliyor." />
        ) : error ? (
          <EmptyState icon="⚠️" title="İlanlara Ulaşılamadı" description="İçerik şu anda yüklenemiyor. Biraz sonra tekrar deneyebilirsin." actionText="Tekrar Dene" onAction={retry} />
        ) : filteredCareers.length === 0 ? (
          <EmptyState
            icon="💼"
            title={careers.length === 0 ? 'Henüz Aktif İlan Yok' : 'İlan Bulunamadı'}
            description={careers.length === 0 ? 'Yeni kariyer fırsatları eklendiğinde burada görünecek.' : 'Seçtiğin kriterlere uygun açık kariyer ilanı bulunmuyor. Filtreleri temizleyerek tüm ilanları listeleyebilirsin.'}
            actionText={careers.length === 0 ? undefined : 'Filtreleri Sıfırla'}
            onAction={careers.length === 0 ? undefined : () => {
              setSelectedType('all');
              setSelectedWorkMode('all');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="career-list">
            {filteredCareers.map((item) => (
              <CareerCard key={item.id} career={item} />
            ))}
          </div>
        )}

        {/* Career Resources Grid */}
        <CareerResources items={settings?.careerResources} />

        {/* Career CTA */}
        <CareerCTA />
      </div>
    </main>
  );
};
