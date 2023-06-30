import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "YourSymbol:": "YourSymbol:",
      "YourDebuff:": "YourDebuff:",
      IdeaElemental2: "Idea Elemental II",
    },
  },
  ja: {
    translation: {
      "YourSymbol:": "あなたのシンボル:",
      "YourDebuff:": "あなたのデバフ:",
      IdeaElemental2: "アイデアエレメンタル 2回目",
    },
  },
};

const lang = navigator.language;

i18n.use(initReactI18next).init({
  resources,
  lng: lang.toLocaleLowerCase().includes("ja") ? "ja" : "en",
  fallbackLng: "en",
});

export default i18n;
