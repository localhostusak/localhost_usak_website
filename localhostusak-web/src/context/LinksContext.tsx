import React, { createContext, useContext, useState, useEffect } from 'react';
import { CommunityLinks, DEFAULT_COMMUNITY_LINKS } from '../constants/links';
import { fetchCommunityLinks } from '../services/api';

interface LinksContextType {
  links: CommunityLinks;
  updateLinks: (newLinks: Partial<CommunityLinks>) => Promise<{ success: boolean; message?: string }>;
  resetToDefaults: () => Promise<void>;
  isLoading: boolean;
}

const LinksContext = createContext<LinksContextType | undefined>(undefined);

export const LinksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [links, setLinks] = useState<CommunityLinks>(DEFAULT_COMMUNITY_LINKS);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch dynamic links from backend on mount
  useEffect(() => {
    let isMounted = true;

    fetchCommunityLinks()
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          const merged = { ...DEFAULT_COMMUNITY_LINKS, ...data };
          setLinks(merged);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateLinks = async (newLinks: Partial<CommunityLinks>): Promise<{ success: boolean; message?: string }> => {
    const merged = { ...links, ...newLinks };
    setLinks(merged);

    return {
      success: true,
      message: 'Bağlantılar yalnızca bu oturum için güncellendi. Kalıcı değişiklikler Payload CMS üzerinden yapılmalıdır.',
    };
  };

  const resetToDefaults = async (): Promise<void> => {
    await updateLinks(DEFAULT_COMMUNITY_LINKS);
  };

  return (
    <LinksContext.Provider value={{ links, updateLinks, resetToDefaults, isLoading }}>
      {children}
    </LinksContext.Provider>
  );
};

export const useLinks = (): LinksContextType => {
  const context = useContext(LinksContext);
  if (!context) {
    // Return default links safely if used outside provider
    return {
      links: DEFAULT_COMMUNITY_LINKS,
      updateLinks: async () => ({ success: false, message: 'LinksProvider missing' }),
      resetToDefaults: async () => {},
      isLoading: false,
    };
  }
  return context;
};
