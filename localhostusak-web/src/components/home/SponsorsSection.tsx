import React from 'react';
import { SponsorItem } from '../../types/sponsor';
import { useLinks } from '../../context/LinksContext';

import { fetchSponsors } from '../../services/api';
import { useCmsCollection } from '../../hooks/useCmsCollection';
import { EmptyState } from '../shared/EmptyState';

export const SponsorsSection: React.FC = () => {
  const { items: sponsors, isLoading, error, retry } = useCmsCollection<SponsorItem>(fetchSponsors);
  const { links } = useLinks();

  return (
    <section className="section sponsors-section" id="sponsors">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">// DESTEKÇİLERİMİZ & SPONSORLAR</span>
          <h2 className="section-title">Topluluğumuza Güç Katanlar</h2>
          <p className="section-desc">
            Uşak teknoloji ve tasarım ekosisteminin büyümesine katkı sağlayan,
            etkinliklerimizi ve projelerimizi destekleyen değerli paydaşlarımız.
          </p>
        </div>

        {isLoading ? (
          <EmptyState icon="⏳" title="Destekçiler Yükleniyor" description="Güncel destekçiler getiriliyor." />
        ) : error ? (
          <EmptyState icon="⚠️" title="Destekçilere Ulaşılamadı" description="Destekçi bilgileri şu anda yüklenemiyor." actionText="Tekrar Dene" onAction={retry} />
        ) : sponsors.length > 0 ? (
          <div className="sponsors-grid">
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsor-card card circuit-border"
                title={`${sponsor.name} web sitesini ziyaret et`}
              >
                <div className="sponsor-card-inner">
                  <div className="sponsor-logo-container">
                    {sponsor.logoUrl && <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="sponsor-logo-img"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />}
                    <div className="sponsor-logo-fallback" style={{ display: sponsor.logoUrl ? 'none' : 'flex' }}>
                      <span>{sponsor.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="sponsor-info">
                    <h3 className="sponsor-name">{sponsor.name}</h3>
                    <div className="sponsor-link-badge">
                      <span>Web Sitesini Ziyaret Et</span>
                      <span className="sponsor-external-icon">↗</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          (
            <div className="sponsors-empty-box card circuit-border">
              <div className="sponsors-empty-icon">🤝</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Henüz Destekçi Eklenmedi
              </h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
                Destekçilerimiz eklendiğinde burada görünecek.
              </p>
              {links.instagram && <a
                href={links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <span>İletişime Geçin</span>
                <span>✨</span>
              </a>}
            </div>
          )
        )}
      </div>
    </section>
  );
};
