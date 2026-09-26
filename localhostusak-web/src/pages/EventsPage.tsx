import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { FilterBar, FilterOption } from '../components/shared/FilterBar';
import { EventSpotlightCard } from '../components/events/EventSpotlightCard';
import { EventCard } from '../components/events/EventCard';
import { EventStats } from '../components/events/EventStats';
import { EmptyState } from '../components/shared/EmptyState';
import { EventItem, EventType } from '../types/event';
import { useLinks } from '../context/LinksContext';

import { fetchEvents, fetchEventTypes, fetchEventsPageSettings, EventsPageSettingsData } from '../services/api';
import seoPages from '../seo/pages.json';
import { usePageMeta } from '../hooks/usePageMeta';
import { useCmsCollection } from '../hooks/useCmsCollection';

export const EventsPage: React.FC = () => {
  const { links } = useLinks();
  const { items: events, isLoading, error, retry } = useCmsCollection<EventItem>(fetchEvents);
  const { items: eventTypes } = useCmsCollection<EventType>(fetchEventTypes);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [settings, setSettings] = useState<EventsPageSettingsData | null>(null);

  // SEO Meta
  usePageMeta({
    title: settings?.meta?.title || seoPages["/etkinlikler"].title,
    description: settings?.meta?.description || seoPages["/etkinlikler"].description,
  });

  useEffect(() => {
    fetchEventsPageSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {
        // Fallback to static defaults
      });
  }, []);

  const typeMap = useMemo(() => {
    const map = new Map<string, EventType>();
    eventTypes.forEach((t) => map.set(t.id, t));
    return map;
  }, [eventTypes]);

  // Primary options
  const primaryOptions: FilterOption[] = [
    { id: 'all', label: 'Tüm Tipler' },
    ...eventTypes.map((t) => ({
      id: t.id,
      label: t.label,
    })),
  ];

  // Secondary options
  const secondaryOptions: FilterOption[] = [
    { id: 'all', label: 'Tüm Durumlar' },
    { id: 'upcoming', label: 'Yaklaşan' },
    { id: 'completed', label: 'Geçmiş' },
    { id: 'cancelled', label: 'İptal Edildi' },
  ];

  // Filter logic
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchType = selectedType === 'all' || e.typeId === selectedType;
      const matchStatus = selectedStatus === 'all' || e.status === selectedStatus;
      const matchSearch =
        searchQuery.trim() === '' ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchType && matchStatus && matchSearch;
    });
  }, [events, selectedType, selectedStatus, searchQuery]);

  // Spotlight event: En yakın yaklaşan etkinlik (tarihe göre sıralı)
  const spotlightEvent = useMemo(() => {
    const upcoming = events
      .filter((e) => e.status === 'upcoming' && new Date(e.dateStart).getTime() >= Date.now())
      .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
    return upcoming[0];
  }, [events]);

  const totalAttendees = useMemo(() => {
    return events.reduce((sum, e) => sum + (e.attendees || 0), 0);
  }, [events]);

  return (
    <main>
      <PageHero
        title={settings?.hero?.title || "Uşak Teknoloji Etkinlikleri,"}
        highlightText={settings?.hero?.highlightText || "Coworking ve Buluşmalar"}
        description={settings?.hero?.description || "Kahveni al, etkinliğini seç, masada yerini al. Yazılım, tasarım, yapay zeka ve serbest çalışma Uşak'ta aynı masada."}
      />

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Filter Bar */}
        <FilterBar
          primaryLabel="Tür"
          primaryOptions={primaryOptions}
          selectedPrimary={selectedType}
          onSelectPrimary={setSelectedType}
          secondaryLabel="Durum"
          secondaryOptions={secondaryOptions}
          selectedSecondary={selectedStatus}
          onSelectSecondary={setSelectedStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Etkinlik veya mekan ara..."
        />

        {/* Spotlight Event (if in 'all' or 'upcoming' filter and available) */}
        {!isLoading && !error && selectedType === 'all' && selectedStatus !== 'completed' && selectedStatus !== 'cancelled' && searchQuery === '' && spotlightEvent && (
          <EventSpotlightCard event={spotlightEvent} eventType={typeMap.get(spotlightEvent.typeId)} />
        )}

        {/* Event List Section */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            Coworking ve Buluşmalar <span style={{ color: 'var(--accent-primary)' }}>({filteredEvents.length})</span>
          </h2>
        </div>

        {isLoading ? (
          <EmptyState
            icon={<Loader2 size={40} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--text-muted)' }} />}
            title="Etkinlikler Yükleniyor"
            description="Güncel etkinlikler getiriliyor."
          />
        ) : error ? (
          <EmptyState
            icon={<AlertTriangle size={40} style={{ color: '#FF6600' }} />}
            title="Etkinliklere Ulaşılamadı"
            description="İçerik şu anda yüklenemiyor. Biraz sonra tekrar deneyebilirsin."
            actionText="Tekrar Dene"
            onAction={retry}
          />
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            icon={<Calendar size={40} style={{ color: 'var(--text-muted)' }} />}
            title={events.length === 0 ? 'Henüz Buluşma Yok' : 'Buluşma Bulunamadı'}
            description={events.length === 0 ? 'Yeni buluşmalar duyurulduğunda burada görünecek.' : 'Seçtiğin kriterlere uygun etkinlik bulunmuyor. Filtreleri sıfırlayarak tüm etkinlikleri görebilirsin.'}
            actionText={events.length === 0 ? undefined : 'Filtreleri Sıfırla'}
            onAction={events.length === 0 ? undefined : () => {
              setSelectedType('all');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="grid-3" style={{ gap: '1.75rem' }}>
            {filteredEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} eventType={typeMap.get(ev.typeId)} />
            ))}
          </div>
        )}

        {/* Event Statistics Banner */}
        {!isLoading && !error && events.length > 0 && <EventStats totalEvents={events.length} totalAttendees={totalAttendees} />}
      </div>
    </main>
  );
};
