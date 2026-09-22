import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { WhatsAppIcon } from '../shared';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const HeroSection: React.FC = () => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const { settings } = useSiteSettings();
  const hero = settings.hero;

  return (
    <section className="section hero-section" id="hero">

      {/* Glowing Ambient Background Orbs */}
      <div className="hero-glow-orb" aria-hidden="true" />
      <div className="hero-glow-orb-secondary" aria-hidden="true" />

      <div className="container hero-content">
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          {/* Location Pill */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="location-pill">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} style={{ color: 'var(--accent-primary)' }} /> U Ş A K
              </span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                {hero?.cityCoordinates || '38.6823° N, 29.4082° E'}
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
              fontWeight: 900,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
            }}
          >
            {hero?.title || "Uşak'ta Teknoloji"} <br />
            <span className="gradient-text">{hero?.titleHighlight || 'Etrafında Buluş'}</span>
          </h1>

          {/* Section Tag Subtitle */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(227, 93, 20, 0.1)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(227, 93, 20, 0.25)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                padding: '0.4rem 1rem',
              }}
            >
              {hero?.subtitle || 'CONNECT • BUILD • COLLABORATE • GROW'}
            </span>
          </div>

          {/* Hero Description Quote */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.7,
            }}
          >
            {hero?.description ||
              "Kahveni al, laptopunu getir, masada yerini al. Uşak'ın yerel teknoloji ekosistemini birlikte büyütüyoruz."}
          </p>

          {/* Primary Hero Actions */}
          <div
            className="hero-actions"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.25rem',
              marginBottom: '3.5rem',
            }}
          >
            {links.whatsappGeneral && <a
              href={links.whatsappGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-whatsapp"
              id="hero-btn-whatsapp"
              onClick={(e) => {
                e.preventDefault();
                openWhatsAppWithRules(links.whatsappGeneral, 'Genel Topluluk Grubu');
              }}
            >
              <WhatsAppIcon size={20} />
              <span>WhatsApp Topluluğuna Katıl</span>
            </a>}

            <Link to="/etkinlikler" className="btn btn-lg btn-primary" id="hero-btn-events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>Sıradaki Buluşma</span>
              <Calendar size={18} />
            </Link>

            {links.instagram && <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-secondary"
              id="hero-btn-instagram"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#E1306C' }}>
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>@localhostusak</span>
            </a>}
          </div>

          {/* Reference Community Motto Pill Preview */}
          <div>
            <div
              className="card"
              style={{
                padding: '1.15rem 1.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                maxWidth: '620px',
                border: '1px solid var(--border-medium)',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(227, 93, 20, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)',
                  flexShrink: 0,
                  fontSize: '1.1rem',
                }}
              >
                ✦
              </div>
              <div style={{ textAlign: 'left', fontSize: '0.9rem' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--accent-primary)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '0.2rem',
                  }}
                >
                  TOPLULUK VİZYONU
                </div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.4 }}>
                  "Resmiyetten uzak, samimi bir masa. Good Code, Better People."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
