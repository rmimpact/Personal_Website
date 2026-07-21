(() => {
  const preferenceKey = "rm-site-language";
  const currentUrl = new URL(window.location.href);
  const currentPath = currentUrl.pathname;
  const isFrenchPage = currentPath === "/fr" || currentPath.startsWith("/fr/");

  const readPreference = () => {
    try {
      return localStorage.getItem(preferenceKey);
    } catch (error) {
      return null;
    }
  };

  const savePreference = (language) => {
    try {
      localStorage.setItem(preferenceKey, language);
    } catch (error) {
      // The language links still work when storage is unavailable.
    }
  };

  const pathForLanguage = (language) => {
    if (language === "fr") {
      if (isFrenchPage) return currentPath;
      return currentPath === "/" ? "/fr/" : `/fr${currentPath}`;
    }

    if (!isFrenchPage) return currentPath;
    const englishPath = currentPath.replace(/^\/fr(?=\/|$)/, "");
    return englishPath || "/";
  };

  const redirectToLanguage = (language) => {
    const destination = new URL(currentUrl.href);
    destination.pathname = pathForLanguage(language);
    destination.searchParams.delete("lang");
    window.location.replace(destination.href);
  };

  const requestedLanguage = currentUrl.searchParams.get("lang");
  if (requestedLanguage === "en" || requestedLanguage === "fr") {
    savePreference(requestedLanguage);
    const onRequestedLanguage = requestedLanguage === "fr" ? isFrenchPage : !isFrenchPage;
    if (!onRequestedLanguage || currentUrl.searchParams.has("lang")) {
      redirectToLanguage(requestedLanguage);
      return;
    }
  }

  const savedLanguage = readPreference();
  const preferredLanguage = navigator.languages?.[0] || navigator.language || "en";

  if (!savedLanguage && !isFrenchPage && preferredLanguage.toLowerCase().startsWith("fr")) {
    redirectToLanguage("fr");
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-language-choice]").forEach((link) => {
      const language = link.dataset.languageChoice;
      const destination = new URL(currentUrl.href);
      destination.pathname = pathForLanguage(language);
      destination.searchParams.delete("lang");
      link.href = `${destination.pathname}${destination.search}${destination.hash}`;

      link.addEventListener("click", () => {
        savePreference(language);
      });
    });
  });
})();
