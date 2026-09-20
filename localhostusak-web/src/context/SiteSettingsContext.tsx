import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchSiteSettings, SiteSettingsData } from '../services/api';

interface SiteSettingsContextType {
  settings: SiteSettingsData;
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({ settings: {}, isLoading: true });

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettingsData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchSiteSettings()
      .then((data) => {
        if (active && data) setSettings(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  return <SiteSettingsContext.Provider value={{ settings, isLoading }}>{children}</SiteSettingsContext.Provider>;
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
