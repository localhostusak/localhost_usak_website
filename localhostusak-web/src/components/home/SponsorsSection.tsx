import React from 'react';
import { ArrowRight, Users, AlertTriangle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SponsorItem } from '../../types/sponsor';
import { fetchSponsors } from '../../services/api';
import { useCmsCollection } from '../../hooks/useCmsCollection';
import { EmptyState } from '../shared/EmptyState';

export const SponsorsSection: React.FC = () => {
  const { items: sponsors, isLoading, error, retry } = useCmsCollection<SponsorItem>(fetchSponsors);

  // Duplicate sponsors for seamless marquee looping
  const marqueeItems = React.useMemo(() => {
    if (!sponsors || sponsors.length === 0) return [];
    if (sponsors.length < 6) {
      return [...sponsors, ...sponsors, ...sponsors, ...sponsors];
    }
    return [...sponsors, ...sponsors];
  }, [sponsors]);

  return (
    <section className="section sponsors-section" id="sponsors" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-tag">DESTEKÇİLERİMİZ & SPONSORLAR</span>
          <h2 className="section-title">Topluluğumuza Güç Katanlar</h2>
          <p className="section-desc">
            Uşak teknoloji, yazılım ve mühendislik ekosisteminin büyümesine katkı sağlayan,
            etkinliklerimizi ve projelerimizi destekleyen değerli paydaşlarımız.
          </p>
        </div>

        {isLoading ? (
          <EmptyState
            icon={<Loader2 size={40} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--text-muted)' }} />}
            title="Destekçiler Yükleniyor"
            description="Güncel destekçiler getiriliyor."
          />
        ) : error ? (
          <EmptyState
            icon={<AlertTriangle size={40} style={{ color: 'var(--accent-primary)' }} />}
            title="Destekçilere Ulaşılamadı"
            description="Destekçi bilgileri şu anda yüklenemiyor."
            actionText="Tekrar Dene"
            onAction={retry}
          />
        ) : sponsors.length > 0 ? (
          <div>
            {/* Infinite Horizontal Logo Marquee */}
            <div className="marquee-wrapper" aria-label="Sponsorlar Kayan Şerit">
              <div className="marquee-track">
                {marqueeItems.map((sponsor, idx) => (
                  <a
                    key={`${sponsor.id}-${idx}`}
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="marquee-item"
                    title={`${sponsor.name} web sitesini ziyaret et`}
                  >
                    {sponsor.logoUrl ? (
                      <img
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        className="marquee-logo"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.style.display = 'inline-block';
                        }}
                      />
                    ) : null}
                    <span
                      className="marquee-name"
                      style={{ display: sponsor.logoUrl ? 'none' : 'inline-block' }}
                    >
                      {sponsor.name}
                    </span>
                    {sponsor.tier === 'gold' && (
                      <span className="tier-badge tier-gold-badge" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                        Gold
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Link to Dedicated /sponsorlar page */}
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link
                to="/sponsorlar"
                className="btn btn-secondary"
                id="btn-all-sponsors"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
              >
                <span>Tüm Sponsorlarımız & Sponsorluk Paketleri</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="sponsors-empty-box card" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
            <div className="sponsors-empty-icon" style={{ marginBottom: '1rem' }}>
              <Users size={36} style={{ color: 'var(--accent-primary)', margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Topluluğumuza İlk Sponsor Siz Olun
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Uşak'taki teknoloji üreticilerine ve genç mühendislere destek olmak için bizimle iletişime geçin.
            </p>
            <Link to="/sponsorlar" className="btn btn-primary btn-sm">
              <span>Sponsorluk Detayları</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
