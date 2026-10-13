'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDocumentInfo, useForm, useFormFields } from '@payloadcms/ui'
import './styles.scss'

interface EventTypeDoc {
  id: number | string
  label: string
  icon?: string
  format?: string
  slug?: string
}

interface TagItem {
  tag: string
  id?: string
}

interface EventDoc {
  id: number | string
  title: string
  type: number | string | EventTypeDoc
  format?: string | null
  modality?: 'in-person' | 'online' | 'hybrid' | null
  status?: string | null
  dateStart: string
  dateEnd?: string | null
  location?: string | null
  mapUrl?: string | null
  whatsappLink?: string | null
  imageUrl?: string | null
  description?: string | null
  tags?: TagItem[] | null
  createdAt?: string
}

interface FormSnapshot {
  title?: any
  format?: any
  modality?: any
  status?: any
  dateStart?: any
  dateEnd?: any
  location?: any
  mapUrl?: any
  whatsappLink?: any
  imageUrl?: any
  description?: any
  tags?: any[]
}

export const EventTemplateAssistant: React.FC = () => {
  const { id } = useDocumentInfo()
  const isEditingExisting = Boolean(id)

  const { dispatchFields, getField, getFields, setModified } = useForm()

  const rawTypeValue = useFormFields(([fields]) => fields.type?.value)
  const currentTypeId =
    typeof rawTypeValue === 'object' && rawTypeValue !== null
      ? (rawTypeValue as any).id
      : rawTypeValue

  const [loading, setLoading] = useState(false)
  const [eventTypeInfo, setEventTypeInfo] = useState<EventTypeDoc | null>(null)
  const [pastEvents, setPastEvents] = useState<EventDoc[]>([])
  const [selectedPastEventId, setSelectedPastEventId] = useState<string | number | ''>('')
  const [appliedEventTitle, setAppliedEventTitle] = useState<string | null>(null)
  const [undoSnapshot, setUndoSnapshot] = useState<FormSnapshot | null>(null)
  const [autoFillEnabled, setAutoFillEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('localhostusak_autofill_enabled')
      return saved !== 'false'
    }
    return true
  })

  // Prevent repeated automatic prefill on the same type
  const lastPrefilledTypeIdRef = useRef<string | number | null>(null)

  const toggleAutoFill = () => {
    setAutoFillEnabled((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('localhostusak_autofill_enabled', String(next))
      }
      return next
    })
  }

  // Fetch past events and event type info whenever currentTypeId changes
  useEffect(() => {
    if (!currentTypeId) {
      setEventTypeInfo(null)
      setPastEvents([])
      setSelectedPastEventId('')
      return
    }

    let isMounted = true
    setLoading(true)

    const fetchData = async () => {
      try {
        const [typeRes, eventsRes] = await Promise.all([
          fetch(`/api/event-types/${currentTypeId}?depth=0`),
          fetch(
            `/api/events?where[type][equals]=${encodeURIComponent(
              String(currentTypeId)
            )}&sort=-createdAt&limit=5&depth=1`
          ),
        ])

        if (!isMounted) return

        let typeData: EventTypeDoc | null = null
        if (typeRes.ok) {
          typeData = await typeRes.json()
          setEventTypeInfo(typeData)
        }

        if (eventsRes.ok) {
          const eventsJson = await eventsRes.json()
          const docs: EventDoc[] = eventsJson.docs || []
          // Filter out the current event if editing
          const filtered = isEditingExisting && id ? docs.filter((d) => String(d.id) !== String(id)) : docs
          setPastEvents(filtered)

          if (filtered.length > 0) {
            setSelectedPastEventId(filtered[0].id)

            // Trigger auto-fill if enabled and creating a new event and haven't prefilled for this type yet
            if (
              !isEditingExisting &&
              autoFillEnabled &&
              lastPrefilledTypeIdRef.current !== currentTypeId
            ) {
              lastPrefilledTypeIdRef.current = currentTypeId
              // Allow React state to settle, then fill
              setTimeout(() => {
                applyTemplate(filtered[0], typeData)
              }, 50)
            }
          } else {
            setSelectedPastEventId('')
          }
        }
      } catch (err) {
        console.error('Error fetching template event data:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void fetchData()

    return () => {
      isMounted = false
    }
  }, [currentTypeId, id, isEditingExisting, autoFillEnabled])

  // Smart calculation for hours and dates
  const calculateDates = useCallback(
    (sourceStartStr?: string, sourceEndStr?: string | null) => {
      if (!sourceStartStr) return { dateStart: undefined, dateEnd: undefined }

      const prevStart = new Date(sourceStartStr)
      const prevEnd = sourceEndStr ? new Date(sourceEndStr) : null

      const currentStartVal = getField('dateStart')?.value
      let targetDate = currentStartVal ? new Date(currentStartVal as string) : null

      if (!targetDate || isNaN(targetDate.getTime())) {
        // Calculate next upcoming Saturday (or 7 days ahead)
        const now = new Date()
        targetDate = new Date(now)
        const dayOfWeek = now.getDay()
        const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7
        targetDate.setDate(now.getDate() + daysUntilSaturday)
      }

      // Apply hours & minutes from the source event
      const newStartDate = new Date(targetDate)
      newStartDate.setHours(prevStart.getHours(), prevStart.getMinutes(), 0, 0)

      let newEndDate: Date | null = null
      if (prevEnd && !isNaN(prevEnd.getTime())) {
        newEndDate = new Date(targetDate)
        newEndDate.setHours(prevEnd.getHours(), prevEnd.getMinutes(), 0, 0)
      }

      return {
        dateStart: newStartDate.toISOString(),
        dateEnd: newEndDate ? newEndDate.toISOString() : undefined,
      }
    },
    [getField]
  )

  // Smart calculation for incremented title (e.g. #3 -> #4)
  const calculateSuggestedTitle = (sourceTitle: string) => {
    if (!sourceTitle) return ''
    const match = sourceTitle.match(/^(.+?#)(\d+)(.*)$/)
    if (match) {
      const prefix = match[1]
      const num = parseInt(match[2], 10)
      return `${prefix}${num + 1}: `
    }
    return `${sourceTitle} (Kopya)`
  }

  // Format hours display (e.g. "16:00 - 17:30")
  const formatTimeRange = (startStr?: string, endStr?: string | null) => {
    if (!startStr) return null
    try {
      const s = new Date(startStr)
      const startH = String(s.getHours()).padStart(2, '0')
      const startM = String(s.getMinutes()).padStart(2, '0')
      let res = `${startH}:${startM}`
      if (endStr) {
        const e = new Date(endStr)
        const endH = String(e.getHours()).padStart(2, '0')
        const endM = String(e.getMinutes()).padStart(2, '0')
        res += ` - ${endH}:${endM}`
      }
      return res
    } catch {
      return null
    }
  }

  // Apply template to Payload form state
  const applyTemplate = useCallback(
    (eventToApply: EventDoc, typeOverride?: EventTypeDoc | null) => {
      if (!eventToApply) return

      // Take a snapshot for Undo capability
      const snapshot: FormSnapshot = {
        title: getField('title')?.value,
        format: getField('format')?.value,
        modality: getField('modality')?.value,
        status: getField('status')?.value,
        dateStart: getField('dateStart')?.value,
        dateEnd: getField('dateEnd')?.value,
        location: getField('location')?.value,
        mapUrl: getField('mapUrl')?.value,
        whatsappLink: getField('whatsappLink')?.value,
        imageUrl: getField('imageUrl')?.value,
        description: getField('description')?.value,
      }
      setUndoSnapshot(snapshot)

      // 1. Title
      const suggestedTitle = calculateSuggestedTitle(eventToApply.title)
      dispatchFields({
        type: 'UPDATE',
        path: 'title',
        value: suggestedTitle,
      })

      // 2. Format: use event's format, or fallback to type's default format
      const effectiveType = typeOverride || eventTypeInfo
      const effectiveFormat = eventToApply.format || effectiveType?.format || ''
      if (effectiveFormat) {
        dispatchFields({
          type: 'UPDATE',
          path: 'format',
          value: effectiveFormat,
        })
      }

      // 3. Modality
      const effectiveModality = eventToApply.modality || 'in-person'
      dispatchFields({
        type: 'UPDATE',
        path: 'modality',
        value: effectiveModality,
      })

      // 4. Status: default to upcoming for new events
      dispatchFields({
        type: 'UPDATE',
        path: 'status',
        value: 'upcoming',
      })

      // 5. Dates & Hours
      const { dateStart, dateEnd } = calculateDates(
        eventToApply.dateStart,
        eventToApply.dateEnd
      )
      if (dateStart) {
        dispatchFields({
          type: 'UPDATE',
          path: 'dateStart',
          value: dateStart,
        })
      }
      if (dateEnd) {
        dispatchFields({
          type: 'UPDATE',
          path: 'dateEnd',
          value: dateEnd,
        })
      }

      // 6. Location & Map
      if (eventToApply.location) {
        dispatchFields({
          type: 'UPDATE',
          path: 'location',
          value: eventToApply.location,
        })
      }
      if (eventToApply.mapUrl) {
        dispatchFields({
          type: 'UPDATE',
          path: 'mapUrl',
          value: eventToApply.mapUrl,
        })
      }

      // 7. WhatsApp & Image
      if (eventToApply.whatsappLink) {
        dispatchFields({
          type: 'UPDATE',
          path: 'whatsappLink',
          value: eventToApply.whatsappLink,
        })
      }
      if (eventToApply.imageUrl) {
        dispatchFields({
          type: 'UPDATE',
          path: 'imageUrl',
          value: eventToApply.imageUrl,
        })
      }

      // 8. Description
      if (eventToApply.description) {
        dispatchFields({
          type: 'UPDATE',
          path: 'description',
          value: eventToApply.description,
        })
      }

      // 9. Tags
      if (Array.isArray(eventToApply.tags) && eventToApply.tags.length > 0) {
        const fieldsState = getFields()
        const existingTagsCount = fieldsState['tags']?.rows?.length || 0

        // Clear existing tag rows
        for (let i = existingTagsCount - 1; i >= 0; i--) {
          dispatchFields({
            type: 'REMOVE_ROW',
            path: 'tags',
            rowIndex: i,
          })
        }

        // Add new tag rows
        eventToApply.tags.forEach((t, idx) => {
          if (t && t.tag) {
            dispatchFields({
              type: 'ADD_ROW',
              path: 'tags',
              rowIndex: idx,
              subFieldState: {
                [`tags.${idx}.tag`]: {
                  value: t.tag,
                  initialValue: t.tag,
                  valid: true,
                },
              },
            })
          }
        })
      }

      setModified(true)
      setAppliedEventTitle(eventToApply.title)
    },
    [
      calculateDates,
      dispatchFields,
      eventTypeInfo,
      getField,
      getFields,
      setModified,
    ]
  )

  // Undo / Revert back to snapshot
  const undoTemplate = () => {
    if (!undoSnapshot) return

    Object.entries(undoSnapshot).forEach(([key, val]) => {
      if (val !== undefined && key !== 'tags') {
        dispatchFields({
          type: 'UPDATE',
          path: key,
          value: val,
        })
      }
    })

    setModified(true)
    setAppliedEventTitle(null)
    setUndoSnapshot(null)
  }

  // Handle dropdown selection of other past events
  const handleSelectPastEvent = (eventId: string | number) => {
    setSelectedPastEventId(eventId)
    const target = pastEvents.find((e) => String(e.id) === String(eventId))
    if (target) {
      applyTemplate(target)
    }
  }

  // 1. If no event type is selected yet
  if (!currentTypeId) {
    return (
      <div className="event-template-assistant event-template-assistant--empty">
        <span className="assistant-icon">💡</span>
        <span>
          <strong>Şablon Asistanı:</strong> Aşağıdan bir <em>Etkinlik Türü</em>{' '}
          (Cowork, Workshop, Talk vb.) seçtiğinizde, son etkinliğin mekan, saat, format ve diğer bilgileri otomatik olarak getirilir.
        </span>
      </div>
    )
  }

  const selectedEvent =
    pastEvents.find((e) => String(e.id) === String(selectedPastEventId)) ||
    pastEvents[0] ||
    null

  const timeRange = selectedEvent
    ? formatTimeRange(selectedEvent.dateStart, selectedEvent.dateEnd)
    : null

  return (
    <div className="event-template-assistant event-template-assistant--active">
      <div className="event-template-assistant__header">
        <div className="title-group">
          <span className="brand-badge">⚡ Şablon Asistanı</span>
          <span className="type-label">
            {eventTypeInfo?.icon || '📅'} {eventTypeInfo?.label || 'Etkinlik'}
          </span>
        </div>

        <div className="header-controls">
          {!isEditingExisting && (
            <label
              className="auto-toggle"
              title="Tür seçildiğinde son etkinlik bilgilerini otomatik olarak forma aktarır"
            >
              <input
                type="checkbox"
                checked={autoFillEnabled}
                onChange={toggleAutoFill}
              />
              <span>Otomatik Doldur</span>
            </label>
          )}
        </div>
      </div>

      <div className="event-template-assistant__body">
        {loading ? (
          <div className="event-template-assistant__alert event-template-assistant__alert--info">
            ⏳ Bu türe ait geçmiş etkinlikler taranıyor...
          </div>
        ) : pastEvents.length === 0 ? (
          <div className="event-template-assistant__alert event-template-assistant__alert--info">
            ℹ️ Bu etkinlik türüne ait henüz geçmiş kayıt bulunmuyor. Bilgileri sıfırdan oluşturabilirsiniz.
          </div>
        ) : (
          <>
            <div className="event-template-assistant__summary">
              <div className="doc-title-row">
                <span>Son Etkinlik: &quot;{selectedEvent?.title}&quot;</span>
                <span className="source-tag">#{selectedEvent?.id}</span>
              </div>

              <div className="meta-badges">
                {timeRange && (
                  <span className="meta-badge meta-badge--time" title="Etkinlik Saat Aralığı">
                    🕒 {timeRange}
                  </span>
                )}
                {selectedEvent?.location && (
                  <span className="meta-badge meta-badge--location" title="Mekan">
                    📍 {selectedEvent.location}
                  </span>
                )}
                {selectedEvent?.modality && (
                  <span className="meta-badge meta-badge--modality" title="Katılım Türü">
                    🌐 {selectedEvent.modality}
                  </span>
                )}
                {(selectedEvent?.format || eventTypeInfo?.format) && (
                  <span className="meta-badge meta-badge--format" title="Etkinlik Formatı">
                    ☕ {selectedEvent?.format || eventTypeInfo?.format}
                  </span>
                )}
              </div>
            </div>

            {appliedEventTitle && (
              <div className="event-template-assistant__alert event-template-assistant__alert--success">
                ✅ <strong>&quot;{appliedEventTitle}&quot;</strong> şablon bilgileri aktarıldı! Mekan, saatler, format, etiketler ve açıklamalar dolduruldu. Sadece tarihi ve yeni başlığı düzenlemeniz yeterlidir.
              </div>
            )}

            <div className="event-template-assistant__actions">
              <button
                type="button"
                className="btn-apply"
                onClick={() => selectedEvent && applyTemplate(selectedEvent)}
                title="Bu etkinliğin tüm bilgilerini forma doldur"
              >
                ⚡ {appliedEventTitle ? 'Yeniden Aktar' : 'Şablonu Forma Aktar'}
              </button>

              {undoSnapshot && (
                <button
                  type="button"
                  className="btn-undo"
                  onClick={undoTemplate}
                  title="Formdaki değişiklikleri geri al"
                >
                  ↩️ Geri Al
                </button>
              )}

              {pastEvents.length > 1 && (
                <div className="history-select-wrap">
                  <label htmlFor="past-event-select">Başka Şablon:</label>
                  <select
                    id="past-event-select"
                    value={String(selectedPastEventId)}
                    onChange={(e) => handleSelectPastEvent(e.target.value)}
                  >
                    {pastEvents.map((pe) => (
                      <option key={pe.id} value={String(pe.id)}>
                        {pe.title} ({pe.location || 'Mekan yok'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
