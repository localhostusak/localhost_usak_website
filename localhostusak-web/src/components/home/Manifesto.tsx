import React from 'react';
import { Users, Coffee, Sparkles, Globe, ArrowRight, Calendar, Code2, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Manifesto: React.FC = () => {
  const pillars = [
    {
      icon: <Users size={22} style={{ color: 'var(--accent-primary)' }} />,
      title: 'Sıfır Hiyerarşi & Eşit Masa',
      desc: 'Unvanlar kapıda kalır. Öğrenciden kıdemli mühendise herkes aynı masada eşit söz hakkına ve samimiyete sahiptir.',
    },
    {
      icon: <Coffee size={22} style={{ color: 'var(--accent-primary)' }} />,
      title: 'Daima & Tamamen Ücretsiz',
      desc: 'Coworking buluşmaları, etkinlikler ve bilgi paylaşımları herkes için her zaman ücretsizdir; ticari kaygı güdülmez.',
    },
    {
      icon: <Sparkles size={22} style={{ color: 'var(--accent-primary)' }} />,
      title: 'Açık Kaynak & Ortak Akıl',
      desc: 'Bilgi paylaştıkça çoğalır. Birlikte açık kaynak projeler kodluyor, deneyimlerimizi ve araçlarımızı paylaşıyoruz.',
    },
    {
      icon: <Globe size={22} style={{ color: 'var(--accent-primary)' }} />,
      title: 'Yerel Dayanışma, Küresel Vizyon',
      desc: "Uşak'ta yalnız çalışan teknoloji üreticilerini bir araya getiriyor, şehrimizden küresel çapta projelere kapı aralıyoruz.",
    },
  ];

  return (
    <section className="section" id="about" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: Editorial Manifesto Card */}
          <div
            className="card"
            style={{
              padding: 'clamp(2rem, 4vw, 3rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid var(--border-medium)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top decorative badge */}
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <span
                  className="badge"
                  style={{
                    background: 'rgba(227, 93, 20, 0.1)',
                    color: 'var(--accent-primary)',
                    border: '1px solid rgba(227, 93, 20, 0.25)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.95rem',
                  }}
                >
                  ✦ BİZ KİMİZ & MANİFESTOMUZ
                </span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.25,
                  letterSpacing: '-0.025em',
                  marginBottom: '1.5rem',
                  color: 'var(--text-primary)',
                }}
              >
                Uşak'ta Yazılım, Mühendislik ve Bilişim Ekosistemini Büyütüyoruz
              </h2>

              <p
                style={{
                  fontSize: '1.075rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                  marginBottom: '1.25rem',
                }}
              >
                Büyük şehirlerdeki teknoloji enerjisi ve üretim ortamı Uşak'ta neden olmasın?{' '}
                <strong style={{ color: 'var(--text-primary)' }}>localhost[uşak]</strong>; evden veya ofisten
                tek başına çalışan yazılımcıları, tasarımcıları, mühendisleri ve teknoloji meraklılarını
                fiziksel bir masada buluşturan bağımsız bir yerel topluluktur.
              </p>

              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                  marginBottom: '1.5rem',
                }}
              >
                Burada resmi unvanlar, sıkıcı seminerler veya ticari satış sunumları yok. Kahvemizi alıyoruz,
                laptoplarımızı açıyoruz; hem kendi projelerimizi üretiyor hem de birbirimize destek olarak
                şehrimizin dijital potansiyelini açığa çıkarıyoruz.
              </p>

              {/* Topluluk Masamızda Neler Var? (SEO & Dahili Bağlantılar) */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '0.65rem',
                  }}
                >
                  Topluluk Masamızda Neler Var?
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                  <Link
                    to="/etkinlikler"
                    className="badge"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Calendar size={13} style={{ color: 'var(--accent-primary)' }} />
                    <span>Coworking & Buluşmalar</span>
                  </Link>

                  <Link
                    to="/projeler"
                    className="badge"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Code2 size={13} style={{ color: 'var(--accent-primary)' }} />
                    <span>Açık Kaynak Projeler</span>
                  </Link>

                  <Link
                    to="/kariyer"
                    className="badge"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Briefcase size={13} style={{ color: 'var(--accent-primary)' }} />
                    <span>Kariyer & İlanlar</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Highlight Quote Box */}
            <div
              style={{
                background: 'rgba(227, 93, 20, 0.06)',
                border: '1px solid rgba(227, 93, 20, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                }}
              >
                "Kahveni al, masaya otur. Birlikte daha güçlüyüz."
              </div>
              <div
                style={{
                  fontSize: '0.825rem',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Good Code, Better People • Yerel Güç, Evrensel Teknoloji
              </div>
            </div>
          </div>

          {/* Right Column: 4 Core Value Cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              justifyContent: 'space-between',
            }}
          >
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '1.4rem 1.6rem',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'flex-start',
                  border: '1px solid var(--border-subtle)',
                  transition: 'transform var(--transition-normal), border-color var(--transition-normal)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(227, 93, 20, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid rgba(227, 93, 20, 0.2)',
                  }}
                >
                  {pillar.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '0.4rem',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.925rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* CTA Banner to Next Event / Community */}
            <div
              className="card"
              style={{
                padding: '1.25rem 1.6rem',
                background: 'linear-gradient(135deg, rgba(227, 93, 20, 0.1) 0%, var(--bg-card) 100%)',
                border: '1px solid rgba(227, 93, 20, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Masada Sana da Yer Var
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Uşak'taki bir sonraki fiziksel buluşmayı incele.
                </div>
              </div>
              <Link
                to="/etkinlikler"
                className="btn btn-sm btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span>Buluşmaları Gör</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
