import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';

interface PageHeroProps {
  tag?: string;
  title: string;
  highlightText?: string;
  description: string;
  whatsappUrl?: string;
  whatsappLabel?: string;
  secondaryAction?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  tag,
  title,
  highlightText,
  description,
  whatsappUrl,
  whatsappLabel = "WhatsApp'a Katıl",
  secondaryAction,
}) => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const effectiveUrl = whatsappUrl || links.whatsappGeneral;

  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        {tag && <span className="page-hero-tag">{tag}</span>}

        <h1 className="page-hero-title">
          {title}{' '}
          {highlightText && <span className="gradient-text">{highlightText}</span>}
        </h1>

        <p className="page-hero-desc">{description}</p>

        <div className="page-hero-actions">
          {effectiveUrl && (
            <a
              href={effectiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-whatsapp"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
              onClick={(e) => {
                e.preventDefault();
                openWhatsAppWithRules(effectiveUrl, whatsappLabel);
              }}
            >
              <MessageCircle size={20} />
              <span>{whatsappLabel}</span>
            </a>
          )}
          {secondaryAction}
        </div>
      </div>
    </section>
  );
};
