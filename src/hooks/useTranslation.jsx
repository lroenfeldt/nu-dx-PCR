import i18n from 'i18n-js';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import translations from '../constants/translations';
import { useData } from '.';

export const TranslationContext = React.createContext({});

/**
 * Provides a translation context for the app.
 * To add new translations, add them to '../constants/translations'
 * and they'll be available to use with the `t` function.
 */
export function TranslationProvider({ children }) {
  const settings = window.api.getConfig();

  const [locale, setLocale] = useState('en');

  i18n.locale = locale;
  i18n.defaultLocale = 'en'; // Default fallback locale
  i18n.translations = translations;
  i18n.fallbacks = true;

  const t = useCallback(
    (scope, options) => {
      const translation = i18n.t(scope, { ...options, locale });

      if (translation === scope) {
        console.error(`No translation found for key: "${scope}" in locale: "${locale}"`);
        return 'No translation available'; // Default message when no translation is found
      }

      return translation;
    },
    [locale]
  );

  useEffect(() => {
    if (settings.user && settings.user.locale && settings.user.locale !== '') {
      setLocale(settings.user.locale);
    } else {
      setLocale(window.navigator.language.split('-')[0]);
    }
  }, [settings]);

  const contextValue = {
    t,
    locale,
    setLocale,
    translate: t,
  };

  return <TranslationContext.Provider value={contextValue}>{children}</TranslationContext.Provider>;
}

/**
 * Hook to get the translation context
 *
 * To use it in your components:
 * const { t } = useTranslation();
 * const myTranslation = t('my.translation.key');
 *
 * If 'my.translation.key' doesn't exist in the current locale,
 * it will fallback to the default locale.
 */
export const useTranslation = () => useContext(TranslationContext);
