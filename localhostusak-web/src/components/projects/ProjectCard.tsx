import React, { useState } from 'react';
import { ExternalLink, Heart, Users } from 'lucide-react';
import { ProjectItem, ProjectType } from '../../types/project';
import { WhatsAppIcon } from '../shared';
import { soundFX } from '../../utils/audioFx';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';

interface ProjectCardProps {
  project: ProjectItem;
  onLike?: (id: number) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onLike }) => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const [likes, setLikes] = useState(project.likes);
  const [hasLiked, setHasLiked] = useState(false);

  const getTypeBadge = (type: ProjectType) => {
    switch (type) {
      case 'showcase':
        return { label: 'Vitrin', color: '#FF6600' };
      case 'seeking_team':
        return { label: 'Ekip Arıyor', color: '#00E5FF' };
      case 'opensource':
        return { label: 'Açık Kaynak', color: '#10B981' };
      default:
        return { label: 'Proje', color: '#FF6600' };
    }
  };

  const badgeInfo = getTypeBadge(project.type);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      soundFX.playBlip();
      if (onLike) onLike(project.id);
    }
  };

  return (
    <article className="card project-card circuit-border">
      <div>
        <div className="project-header">
          <span
            className="event-card-type-tag"
            style={{
              backgroundColor: `${badgeInfo.color}22`,
              color: badgeInfo.color,
              border: `1px solid ${badgeInfo.color}`,
              fontSize: '0.75rem',
            }}
          >
            {badgeInfo.label}
          </span>

          <button
            type="button"
            className={`project-like-btn ${hasLiked ? 'liked' : ''}`}
            onClick={handleLike}
            title="Projeyi Beğen"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Heart size={14} style={{ fill: hasLiked ? '#FF453A' : 'none', color: hasLiked ? '#FF453A' : 'currentColor' }} />
            <span>{likes}</span>
          </button>
        </div>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          {project.name}
        </h3>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--accent-secondary)',
            marginBottom: '0.85rem',
          }}
        >
          Geliştirici: {project.owner}
        </div>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            marginBottom: '1rem',
          }}
        >
          {project.description}
        </p>

        {/* Roles Needed if Seeking Team */}
        {project.type === 'seeking_team' && project.rolesNeeded && project.rolesNeeded.length > 0 && (
          <div className="project-roles-needed">
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-secondary)',
                marginBottom: '0.35rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Users size={14} />
              <span>ARANAN EKİP ROLLERİ:</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {project.rolesNeeded.map((role, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.8rem',
                    background: 'var(--bg-secondary)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Tags */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="agenda-tags" style={{ marginBottom: '1.25rem' }}>
            {project.technologies.map((t, idx) => (
              <span key={idx} className="agenda-tag">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.65rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: 'auto',
          flexWrap: 'wrap',
        }}
      >
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          >
            <span>Canlı Demo</span>
            <ExternalLink size={14} />
          </a>
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          >
            <span>GitHub</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </a>
        )}

        {!project.demoUrl && !project.githubUrl && links.whatsappProjects && (
          <a
            href={links.whatsappProjects}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm"
            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}
            onClick={(e) => {
              e.preventDefault();
              openWhatsAppWithRules(links.whatsappProjects, 'Projeler Grubu');
            }}
          >
            <WhatsAppIcon size={14} />
            <span>Ekiple İletişime Geç</span>
          </a>
        )}
      </div>
    </article>
  );
};
