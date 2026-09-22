import React from 'react';
import { Calendar, MapPin, Users, Download } from 'lucide-react';
import { EventItem, EventType } from '../../types/event';
import { WhatsAppIcon } from '../shared';
import { downloadICS } from '../../utils/calendarExport';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';

interface EventCardProps {
  event: EventItem;
  eventType?: EventType;
}

export const EventCard: React.FC<EventCardProps> = ({ event, eventType }) => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const isUpcoming = event.status === 'upcoming' && new Date(event.dateStart).getTime() >= Date.now();
  const isCancelled = event.status === 'cancelled';
  const startDate = new Date(event.dateStart);

  const formattedDate = startDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    downloadICS({
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: startDate,
    });
  };

  return (
    <article className="card event-card circuit-border">
      <div>
        <div className="event-card-header">
          <span
            className="event-card-type-tag"
            style={{
              backgroundColor: eventType ? `${eventType.colorModern}22` : 'rgba(255, 102, 0, 0.15)',
              color: eventType ? eventType.colorModern : 'var(--accent-primary)',
              border: `1px solid ${eventType ? eventType.colorModern : 'var(--accent-primary)'}`,
            }}
          >
            {eventType?.label || event.typeId}
          </span>

          <span className={`badge ${isUpcoming ? 'badge-live' : 'badge-orange'}`}>
            {isCancelled ? 'İPTAL EDİLDİ' : isUpcoming ? 'YAKLAŞAN' : 'TAMAMLANDI'}
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.65rem' }}>
          {event.title}
        </h3>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            marginBottom: '1rem',
          }}
        >
          {event.description}
        </p>

        <div className="event-card-meta">
          <div className="event-card-meta-item">
            <span style={{ display: 'inline-flex', alignItems: 'center' }}><Calendar size={14} /></span>
            <span>{formattedDate}</span>
          </div>

          <div className="event-card-meta-item">
            <span style={{ display: 'inline-flex', alignItems: 'center' }}><MapPin size={14} /></span>
            <span>{event.location}</span>
            {event.mapUrl && (
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--accent-secondary)',
                  fontSize: '0.8rem',
                  textDecoration: 'underline',
                  marginLeft: '0.25rem',
                }}
              >
                (Harita)
              </a>
            )}
          </div>

          <div className="event-card-meta-item">
            <span style={{ display: 'inline-flex', alignItems: 'center' }}><Users size={14} /></span>
            <span>
              {event.attendees} Katılımcı {event.capacity ? `/ ${event.capacity} Kontenjan` : ''}
            </span>
          </div>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="agenda-tags" style={{ marginTop: '0.75rem' }}>
            {event.tags.map((tag, idx) => (
              <span key={idx} className="agenda-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="event-card-footer">
        {isUpcoming ? (
          <>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCalendar}
              title="Takvime Ekle (.ICS)"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>Takvime Ekle</span>
              <Download size={14} />
            </button>
            {(event.whatsappLink || links.whatsappCoworking) && <a
              href={event.whatsappLink || links.whatsappCoworking}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              onClick={(e) => {
                e.preventDefault();
                openWhatsAppWithRules(event.whatsappLink || links.whatsappCoworking, 'Coworking Masası');
              }}
            >
              <WhatsAppIcon size={14} />
              <span>Masada Yer Ayır</span>
            </a>}
          </>
        ) : (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isCancelled ? 'Etkinlik iptal edildi' : 'Etkinlik tamamlandı'}
          </span>
        )}
      </div>
    </article>
  );
};
