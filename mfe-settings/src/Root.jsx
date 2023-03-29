import React from "react";
import i18next from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

i18next
  .use(initReactI18next)
  .use({
    type : "backend",
    read(language, namespace, callback) {
      import(`./locales/${language}/${namespace}.json`)
        .then((resources) => {
          callback(null, resources);
        })
        .catch((error) => {
          callback(error, null);
        });
    }
  })
  .init({
    lng : "fr",
    fallbackLng : "fr-FR",

    react : {
      useSuspense: false,
    },

    interpolation : {
      escapeValue : false
    }
  });

function Root() {
  const { t } = useTranslation("root");

  return (
    <section>
      <h1>{t("userSettings")}</h1>
      {t("name")}: {global.root.context.userName}
    </section>
  );
}

export default Root;
