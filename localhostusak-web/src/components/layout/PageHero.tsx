import React from 'react';

interface PageHeroProps {
  tag?: string;
  title: string;
  highlightText?: string;
  description: string;
  secondaryAction?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  tag,
  title,
  highlightText,
  description,
  secondaryAction,
}) => {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        {tag && <span className="page-hero-tag">{tag}</span>}

        <h1 className="page-hero-title">
          {title}{' '}
          {highlightText && <span className="gradient-text">{highlightText}</span>}
        </h1>

        <p className="page-hero-desc">{description}</p>

        {secondaryAction && (
          <div className="page-hero-actions">
            {secondaryAction}
          </div>
        )}
      </div>
    </section>
  );
};
