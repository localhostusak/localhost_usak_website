import React, { useEffect, useMemo } from 'react';
import { isDirectCmsApi } from '../../services/api';
import type { ApplicationFormSettings } from '../../types/application';
import { resolveApplicationTexts } from '../../utils/applicationForm';
import { ApplicationForm } from './ApplicationForm';

interface ApplicationSectionProps {
  settings?: ApplicationFormSettings;
}

// CV havuzu bölümü. Bayrak kapalıysa hiçbir şey çizilmez. Bayrak açık olsa bile metinlerde
// çözülemeyen {{yer tutucu}} kalırsa ya da API doğrudan CMS'e işaret etmiyorsa form gösterilmez
// ve konsola uyarı yazılır (kullanıcıya ham {{...}} metni ya da yanlış IP sınırı gösterilmesin).
export const ApplicationSection: React.FC<ApplicationSectionProps> = ({ settings }) => {
  const enabled = settings?.enabled === true;
  const direct = isDirectCmsApi();

  const resolved = useMemo(
    () => (enabled && direct && settings ? resolveApplicationTexts(settings) : null),
    [enabled, direct, settings],
  );

  useEffect(() => {
    if (!enabled) return;
    if (!direct) {
      console.warn(
        '[kariyer] CV başvuru formu gösterilmedi: VITE_API_URL mutlak bir CMS adresi değil. ' +
          'Başvuru tarayıcıdan doğrudan CMS\'e gitmelidir (frontend proxy\'si IP sınırını bozar).',
      );
    } else if (resolved && !resolved.ok) {
      console.warn(
        `[kariyer] CV başvuru formu gösterilmedi: çözülemeyen yer tutucu veya boş zorunlu metin → ${resolved.unresolved.join(', ')}. ` +
          'CMS → Kariyer Sayfası Ayarları → CV Başvuru Formu metinlerini düzeltin.',
      );
    }
  }, [enabled, direct, resolved]);

  if (!resolved || !resolved.ok) return null;
  const { texts } = resolved;

  return (
    <section id="basvuru" className="application-section" aria-labelledby="basvuru-baslik">
      <div className="section-header">
        <span className="section-tag">CV HAVUZU</span>
        <h2 id="basvuru-baslik" className="section-title">
          {texts.title}
        </h2>
        {texts.intro && <p className="section-desc">{texts.intro}</p>}
      </div>
      <ApplicationForm texts={texts} />
    </section>
  );
};
