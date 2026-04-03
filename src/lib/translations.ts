export type Language = "en" | "bg" | "ua";

export type LanguageOption = {
  code: Language | string;
  label: string;
  nativeLabel: string;
  flag: string;
  available: boolean;
};

export const languages: LanguageOption[] = [
  { code: "bg", label: "Bulgarian", nativeLabel: "Български", flag: "BG", available: true },
  { code: "ru", label: "Russian", nativeLabel: "Русский", flag: "RU", available: false },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", flag: "SA", available: false },
  { code: "fa", label: "Farsi", nativeLabel: "فارسی", flag: "IR", available: false },
  { code: "ua", label: "Ukrainian", nativeLabel: "Українська", flag: "UA", available: true },
  { code: "en", label: "English", nativeLabel: "English", flag: "GB", available: true },
  { code: "ku", label: "Kurdish", nativeLabel: "کوردی", flag: "IQ", available: false },
];

type Translations = Record<Language, Record<string, string>>;

export const translations: Translations = {
  en: {
    appTitle: "Compass Centre – Virtual Support Station",
    chooseLanguage: "Choose your language to continue.",
    comingSoon: "Coming soon",
    welcomeMessage:
      "Welcome to the Digital Centre for Protection and Inclusion 'Compass'. Here you can find information on all areas of life in Bulgaria.\nClick on the pictures on the wall to explore the topics where we can help, or press the chat icon below to start a conversation.",
    servicesTitle: "Compass Centre Services",
    servicesTip: "Tip: You can ask the chatbot about any of the subjects above.",
    backToCategories: "Back to categories",
    askChatbot: "Ask the chatbot about any of these topics",
    chatbotName: "Support Assistant",
    chatbotSubtitle: "Compass Centre Chatbot",
    typePlaceholder: "Type here...",
    explore: "Explore",
    chatNotReady: "The chatbot is currently being set up. Please check back soon for full support.",
    newChat: "New chat",
    startListening: "Speak",
    listening: "Listening… speak now",
    recording: "Recording… tap mic to stop",
    stopRecording: "Stop",
    transcribing: "Transcribing…",
    chatEmptyGreeting:
      "Hello! I'm here to guide you through everything you need to settle in Bulgaria — from practical steps to useful advice.",
    chatChooseLanguage: "Please choose your language to continue:",

    authTitle: "Welcome to Compass Centre",
    authSubtitle: "Sign in or create an account to continue.",
    loginTab: "Sign In",
    registerTab: "Create Account",
    nameLabel: "Your name",
    namePlaceholder: "e.g. Maria",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 6 characters",
    loginButton: "Sign In",
    registerButton: "Create Account",
    errorEmailExists: "An account with this email already exists.",
    errorInvalidCredentials: "Incorrect email or password.",
    errorServerError: "Something went wrong. Please try again.",
    errorFieldsRequired: "Please fill in all fields.",
    errorPasswordShort: "Password must be at least 6 characters.",
    logoutButton: "Sign out",
    adminPanel: "Admin Panel",
    profile: "Profile",
    myAccount: "My Account",
  },

  bg: {
    appTitle: "Компас – Дигитален Център за Закрила и Включване",
    chooseLanguage: "Изберете вашия език, за да продължите.",
    comingSoon: "Очаквайте скоро",
    welcomeMessage:
      "Добре дошли в дигиталния център за закрила и включване \u201EКомпас\u201C. Тук можете да получите информация за всички сфери на живота Ви в България.\nКликнете на снимките на стената, за да разгледате темите, по които може да сме полезни, или директно натиснете иконата за чат по-долу, за да започнете разговор.",
    servicesTitle: "Услуги на Компас Център",
    servicesTip: "Съвет: Можете да попитате чатбота за всяка от темите по-горе.",
    backToCategories: "Обратно към категориите",
    askChatbot: "Попитайте чатбота за тези теми",
    chatbotName: "Асистент за подкрепа",
    chatbotSubtitle: "Чатбот на Компас Център",
    typePlaceholder: "Напишете тук...",
    explore: "Разгледай",
    chatNotReady: "Чатботът се настройва в момента. Моля, проверете отново скоро.",
    newChat: "Нов разговор",
    startListening: "Говорете",
    listening: "Слушам… говорете",
    recording: "Записвам… натиснете микрофона за спиране",
    stopRecording: "Спри",
    transcribing: "Разпознавам…",
    chatEmptyGreeting:
      "Здравейте! Тук съм, за да ви помогна с всичко необходимо за живота в България — от практически стъпки до полезни съвети.",
    chatChooseLanguage: "Моля, изберете език, за да продължим:",

    authTitle: "Добре дошли в Компас Център",
    authSubtitle: "Влезте или създайте акаунт, за да продължите.",
    loginTab: "Вход",
    registerTab: "Регистрация",
    nameLabel: "Вашето име",
    namePlaceholder: "напр. Мария",
    emailLabel: "Имейл",
    emailPlaceholder: "вашият@имейл.com",
    passwordLabel: "Парола",
    passwordPlaceholder: "Поне 6 символа",
    loginButton: "Вход",
    registerButton: "Създай акаунт",
    errorEmailExists: "Вече съществува акаунт с този имейл.",
    errorInvalidCredentials: "Грешен имейл или парола.",
    errorServerError: "Нещо се обърка. Моля, опитайте отново.",
    errorFieldsRequired: "Моля, попълнете всички полета.",
    errorPasswordShort: "Паролата трябва да е поне 6 символа.",
    logoutButton: "Изход",
    adminPanel: "Админ панел",
    profile: "Профил",
    myAccount: "Моят акаунт",
  },

  ua: {
    appTitle: "Компас – Цифровий Центр Захисту та Включення",
    chooseLanguage: "Оберіть мову, щоб продовжити.",
    comingSoon: "Незабаром",
    welcomeMessage:
      "Ласкаво просимо до цифрового центру захисту та включення «Компас». Тут ви можете отримати інформацію про всі сфери життя в Болгарії.\nНатисніть на картини на стіні, щоб дослідити теми, або натисніть іконку чату нижче, щоб розпочати розмову.",
    servicesTitle: "Послуги Центру Компас",
    servicesTip: "Порада: Ви можете запитати чат-бота про будь-яку з тем вище.",
    backToCategories: "Повернутися до категорій",
    askChatbot: "Запитайте чат-бота про ці теми",
    chatbotName: "Асистент підтримки",
    chatbotSubtitle: "Чат-бот Центру Компас",
    typePlaceholder: "Напишіть тут...",
    explore: "Дослідити",
    chatNotReady: "Чат-бот наразі налаштовується. Будь ласка, перевірте пізніше.",
    newChat: "Нова розмова",
    startListening: "Говоріть",
    listening: "Слухаю… говоріть",
    recording: "Записую… натисніть мікрофон для зупинки",
    stopRecording: "Стоп",
    transcribing: "Розпізнаю…",
    chatEmptyGreeting:
      "Вітаю! Я тут, щоб допомогти вам з усім необхідним для життя в Болгарії — від практичних кроків до корисних порад.",
    chatChooseLanguage: "Будь ласка, оберіть мову, щоб продовжити:",

    authTitle: "Ласкаво просимо до Центру Компас",
    authSubtitle: "Увійдіть або створіть акаунт, щоб продовжити.",
    loginTab: "Увійти",
    registerTab: "Створити акаунт",
    nameLabel: "Ваше ім'я",
    namePlaceholder: "напр. Марія",
    emailLabel: "Електронна пошта",
    emailPlaceholder: "ваша@пошта.com",
    passwordLabel: "Пароль",
    passwordPlaceholder: "Мінімум 6 символів",
    loginButton: "Увійти",
    registerButton: "Створити акаунт",
    errorEmailExists: "Акаунт з цією поштою вже існує.",
    errorInvalidCredentials: "Невірна пошта або пароль.",
    errorServerError: "Щось пішло не так. Спробуйте ще раз.",
    errorFieldsRequired: "Будь ласка, заповніть усі поля.",
    errorPasswordShort: "Пароль має бути мінімум 6 символів.",
    logoutButton: "Вийти",
    adminPanel: "Адмін панель",
    profile: "Профіль",
    myAccount: "Мій акаунт",
  },
};

export function t(lang: Language, key: string): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
