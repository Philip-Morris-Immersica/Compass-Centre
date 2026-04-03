import type { Language } from "./translations";

export type ServiceId = "protection" | "education" | "labor" | "health" | "housing" | "social";

export type Localized = Record<Language, string>;

export type SubCategory = {
  title: Localized;
  questions: Localized[];
};

export type ServiceDef = {
  id: ServiceId;
  title: Localized;
  description: Localized;
  subcategories: SubCategory[];
};

export const services: ServiceDef[] = [
  {
    id: "protection",
    title: {
      bg: "Международна и временна закрила",
      en: "International & Temporary Protection",
      ua: "Міжнародний та тимчасовий захист",
    },
    description: {
      bg: "Тази секция цели да отговори на всички въпроси, свързани с процедурите в сферата на убежището: международна и временна закрила. Ако не намирате въпроса си, пишете направо в чата.",
      en: "This section aims to answer all questions related to asylum procedures: international and temporary protection. If you can't find your question, write directly in the chat.",
      ua: "Цей розділ має на меті відповісти на всі питання, пов'язані з процедурами притулку: міжнародний та тимчасовий захист. Якщо ви не знаходите свого питання, пишіть безпосередньо в чат.",
    },
    subcategories: [
      {
        title: {
          bg: "Международна закрила",
          en: "International Protection",
          ua: "Міжнародний захист",
        },
        questions: [
          {
            bg: "Как и къде да подам молба за международна закрила?",
            en: "How and where can I apply for international protection?",
            ua: "Як і де подати заяву на міжнародний захист?",
          },
          {
            bg: "Колко продължава процедурата и какви са правата ми?",
            en: "How long does the procedure take and what are my rights?",
            ua: "Скільки триває процедура і які мої права?",
          },
          {
            bg: "Как да обжалвам отказ на молбата ми?",
            en: "How can I appeal a rejection of my application?",
            ua: "Як оскаржити відмову у моїй заяві?",
          },
          {
            bg: "Има ли организации, които предоставят безплатна правна помощ?",
            en: "Are there organizations that provide free legal assistance?",
            ua: "Чи є організації, які надають безкоштовну правову допомогу?",
          },
          {
            bg: "Каква е разликата между статут на бежанец и хуманитарен статут?",
            en: "What is the difference between refugee status and humanitarian status?",
            ua: "Яка різниця між статусом біженця та гуманітарним статусом?",
          },
          {
            bg: "Мога ли да пътувам в чужбина?",
            en: "Can I travel abroad?",
            ua: "Чи можу я подорожувати за кордон?",
          },
          {
            bg: "Мога ли и как да се събера със семейството си?",
            en: "Can I reunite with my family and how?",
            ua: "Чи можу я возз'єднатися зі своєю сім'єю і як?",
          },
          {
            bg: "Заплашен ли съм от задържане в затворен център?",
            en: "Am I at risk of being detained in a closed center?",
            ua: "Чи загрожує мені затримання у закритому центрі?",
          },
          {
            bg: "Как да си изкарам лични документи, след като получа статут?",
            en: "How do I obtain personal documents after receiving status?",
            ua: "Як отримати особисті документи після отримання статусу?",
          },
          {
            bg: "Как да намеря адрес, на който да се регистрирам?",
            en: "How can I find an address to register at?",
            ua: "Як знайти адресу для реєстрації?",
          },
          {
            bg: "Как да се регистрирам на служебен адрес?",
            en: "How do I register at an official address?",
            ua: "Як зареєструватися за службовою адресою?",
          },
          {
            bg: "Как да си изкарам свидетелство за съдимост?",
            en: "How do I obtain a criminal record certificate?",
            ua: "Як отримати довідку про несудимість?",
          },
          {
            bg: "Как да си изкарам шофьорска книжка?",
            en: "How do I get a driver's license?",
            ua: "Як отримати водійське посвідчення?",
          },
          {
            bg: "Как да сключа брак в България?",
            en: "How do I get married in Bulgaria?",
            ua: "Як одружитися в Болгарії?",
          },
          {
            bg: "Как да регистрирам новородено дете в България?",
            en: "How do I register a newborn child in Bulgaria?",
            ua: "Як зареєструвати новонароджену дитину в Болгарії?",
          },
        ],
      },
      {
        title: {
          bg: "Временна закрила",
          en: "Temporary Protection",
          ua: "Тимчасовий захист",
        },
        questions: [
          {
            bg: "Как и къде да си изкарам регистрационна карта за временна закрила?",
            en: "How and where can I get a registration card for temporary protection?",
            ua: "Як і де отримати реєстраційну картку тимчасового захисту?",
          },
          {
            bg: "Как да подновя регистрационната си карта?",
            en: "How do I renew my registration card?",
            ua: "Як поновити реєстраційну картку?",
          },
          {
            bg: "Как да се откажа от временна закрила?",
            en: "How do I renounce temporary protection?",
            ua: "Як відмовитися від тимчасового захисту?",
          },
          {
            bg: "Мога ли да пътувам в чужбина?",
            en: "Can I travel abroad?",
            ua: "Чи можу я подорожувати за кордон?",
          },
          {
            bg: "Мога ли да кандидатствам за международна закрила?",
            en: "Can I apply for international protection?",
            ua: "Чи можу я подати заяву на міжнародний захист?",
          },
          {
            bg: "Мога ли да получа друг вид пребиваване, с което да остана дългосрочно в България?",
            en: "Can I obtain another type of residence to stay long-term in Bulgaria?",
            ua: "Чи можу я отримати інший вид перебування для довгострокового проживання в Болгарії?",
          },
        ],
      },
    ],
  },
  {
    id: "education",
    title: {
      bg: "Образование",
      en: "Education",
      ua: "Освіта",
    },
    description: {
      bg: "Тази секция цели да отговори на всички въпроси, свързани с достъпа до отделните етапи на образование в България и обучението по български език. Ако не намирате въпроса си, пишете направо в чата.",
      en: "This section aims to answer all questions related to access to different stages of education in Bulgaria and Bulgarian language training. If you can't find your question, write directly in the chat.",
      ua: "Цей розділ має на меті відповісти на всі питання щодо доступу до різних етапів освіти в Болгарії та вивчення болгарської мови. Якщо ви не знаходите свого питання, пишіть безпосередньо в чат.",
    },
    subcategories: [
      {
        title: {
          bg: "Образование",
          en: "Education",
          ua: "Освіта",
        },
        questions: [
          {
            bg: "Как е организирано образованието в България? (етапи, оценяване, принципи)",
            en: "How is education organized in Bulgaria? (stages, grading, principles)",
            ua: "Як організована освіта в Болгарії? (етапи, оцінювання, принципи)",
          },
          {
            bg: "Как да запиша децата си в детска градина или училище?",
            en: "How do I enroll my children in kindergarten or school?",
            ua: "Як записати дітей до дитячого садка чи школи?",
          },
          {
            bg: "На каква подкрепа имат право децата ми в училище?",
            en: "What support are my children entitled to in school?",
            ua: "На яку підтримку мають право мої діти в школі?",
          },
          {
            bg: "Мога ли и при какви условия да се обучавам в университет?",
            en: "Can I study at a university and under what conditions?",
            ua: "Чи можу я навчатися в університеті і за яких умов?",
          },
          {
            bg: "Как да призная дипломата си за средно или за висше образование?",
            en: "How do I get my secondary or higher education diploma recognized?",
            ua: "Як визнати диплом про середню чи вищу освіту?",
          },
          {
            bg: "Мога ли да уча в училище, ако вече съм пълнолетен?",
            en: "Can I attend school if I am already an adult?",
            ua: "Чи можу я навчатися в школі, якщо я вже повнолітній?",
          },
          {
            bg: "Кои организации могат да ми помогнат?",
            en: "Which organizations can help me?",
            ua: "Які організації можуть мені допомогти?",
          },
        ],
      },
      {
        title: {
          bg: "Български език",
          en: "Bulgarian Language",
          ua: "Болгарська мова",
        },
        questions: [
          {
            bg: "Каква подкрепа съществува по български език за деца?",
            en: "What Bulgarian language support is available for children?",
            ua: "Яка підтримка з болгарської мови існує для дітей?",
          },
          {
            bg: "Каква подкрепа съществува за възрастни?",
            en: "What support is available for adults?",
            ua: "Яка підтримка існує для дорослих?",
          },
          {
            bg: "Какви свободни ресурси са налични?",
            en: "What free resources are available?",
            ua: "Які безкоштовні ресурси доступні?",
          },
          {
            bg: "Как да сертифицирам знанията си по български език?",
            en: "How can I certify my Bulgarian language knowledge?",
            ua: "Як сертифікувати знання болгарської мови?",
          },
        ],
      },
    ],
  },
  {
    id: "labor",
    title: {
      bg: "Пазар на труда",
      en: "Labor Market",
      ua: "Ринок праці",
    },
    description: {
      bg: "Тази секция цели да отговори на всички въпроси, свързани с достъпа до заетост, финансови услуги и управлението на бизнес в България. Ако не намирате въпроса си, пишете направо в чата.",
      en: "This section aims to answer all questions related to access to employment, financial services, and running a business in Bulgaria. If you can't find your question, write directly in the chat.",
      ua: "Цей розділ має на меті відповісти на всі питання щодо доступу до зайнятості, фінансових послуг та ведення бізнесу в Болгарії. Якщо ви не знаходите свого питання, пишіть безпосередньо в чат.",
    },
    subcategories: [
      {
        title: {
          bg: "Заетост",
          en: "Employment",
          ua: "Зайнятість",
        },
        questions: [
          {
            bg: "Как е организиран пазарът на труда в България?",
            en: "How is the labor market organized in Bulgaria?",
            ua: "Як організований ринок праці в Болгарії?",
          },
          {
            bg: "Мога ли да работя и кога?",
            en: "Can I work and when?",
            ua: "Чи можу я працювати і коли?",
          },
          {
            bg: "Трябва ли да сключвам договор и защо?",
            en: "Do I need to sign a contract and why?",
            ua: "Чи потрібно підписувати договір і чому?",
          },
          {
            bg: "Какви са правата и задълженията ми като работник?",
            en: "What are my rights and obligations as a worker?",
            ua: "Які мої права та обов'язки як працівника?",
          },
          {
            bg: "Какви реалистични възможности за работа съществуват в България?",
            en: "What realistic job opportunities exist in Bulgaria?",
            ua: "Які реалістичні можливості для роботи існують у Болгарії?",
          },
          {
            bg: "Как да намеря работа?",
            en: "How do I find a job?",
            ua: "Як знайти роботу?",
          },
          {
            bg: "Мога ли да получавам обезщетение за безработица?",
            en: "Can I receive unemployment benefits?",
            ua: "Чи можу я отримувати допомогу по безробіттю?",
          },
          {
            bg: "Кои организации могат да ми помогнат?",
            en: "Which organizations can help me?",
            ua: "Які організації можуть мені допомогти?",
          },
        ],
      },
      {
        title: {
          bg: "Достъп до финансови услуги",
          en: "Access to Financial Services",
          ua: "Доступ до фінансових послуг",
        },
        questions: [
          {
            bg: "Имам ли право на банкова сметка?",
            en: "Am I entitled to a bank account?",
            ua: "Чи маю я право на банківський рахунок?",
          },
          {
            bg: "Как да си отворя банкова сметка?",
            en: "How do I open a bank account?",
            ua: "Як відкрити банківський рахунок?",
          },
          {
            bg: "Какво да направя, ако ми отказват да отворя банкова сметка?",
            en: "What should I do if they refuse to open a bank account for me?",
            ua: "Що робити, якщо мені відмовляють у відкритті рахунку?",
          },
          {
            bg: "Мога ли да взема кредит?",
            en: "Can I take out a loan?",
            ua: "Чи можу я взяти кредит?",
          },
          {
            bg: "Кои организации могат да ми помогнат?",
            en: "Which organizations can help me?",
            ua: "Які організації можуть мені допомогти?",
          },
        ],
      },
      {
        title: {
          bg: "Собствен бизнес и предприемачество",
          en: "Own Business & Entrepreneurship",
          ua: "Власний бізнес та підприємництво",
        },
        questions: [
          {
            bg: "Имам ли право да отворя фирма?",
            en: "Am I entitled to open a company?",
            ua: "Чи маю я право відкрити фірму?",
          },
          {
            bg: "Как се основава нова фирма в България?",
            en: "How do I start a new company in Bulgaria?",
            ua: "Як заснувати нову фірму в Болгарії?",
          },
          {
            bg: "Какви са задълженията ми към държавата като собственик на фирма?",
            en: "What are my obligations to the state as a company owner?",
            ua: "Які мої зобов'язання перед державою як власника фірми?",
          },
          {
            bg: "Мога ли да получа кредит за стартиране на бизнес?",
            en: "Can I get a loan to start a business?",
            ua: "Чи можу я отримати кредит для відкриття бізнесу?",
          },
          {
            bg: "Кои организации могат да ми помогнат?",
            en: "Which organizations can help me?",
            ua: "Які організації можуть мені допомогти?",
          },
        ],
      },
    ],
  },
  {
    id: "health",
    title: {
      bg: "Здраве",
      en: "Health",
      ua: "Здоров'я",
    },
    description: {
      bg: "В тази секция ще намерите информация по системата на здравно осигуряване, медицинското лечение и освидетелстването на увреждания. Ако не намирате въпроса си, пишете направо в чата.",
      en: "In this section you will find information on the health insurance system, medical treatment, and disability assessment. If you can't find your question, write directly in the chat.",
      ua: "У цьому розділі ви знайдете інформацію про систему медичного страхування, лікування та оцінку інвалідності. Якщо ви не знаходите свого питання, пишіть безпосередньо в чат.",
    },
    subcategories: [
      {
        title: {
          bg: "Здравно осигуряване и лечение",
          en: "Health Insurance & Treatment",
          ua: "Медичне страхування та лікування",
        },
        questions: [
          {
            bg: "Как е организирано здравеопазването в България?",
            en: "How is healthcare organized in Bulgaria?",
            ua: "Як організовано охорону здоров'я в Болгарії?",
          },
          {
            bg: "Какви права имам спрямо статута ми?",
            en: "What rights do I have according to my status?",
            ua: "Які права я маю відповідно до мого статусу?",
          },
          {
            bg: "Трябва ли и защо да плащам здравни осигуровки?",
            en: "Do I need to pay health insurance and why?",
            ua: "Чи потрібно платити медичне страхування і чому?",
          },
          {
            bg: "Как да си намеря общопрактикуващ лекар?",
            en: "How do I find a general practitioner?",
            ua: "Як знайти сімейного лікаря?",
          },
          {
            bg: "Имам ли право на безплатни лекарства?",
            en: "Am I entitled to free medication?",
            ua: "Чи маю я право на безкоштовні ліки?",
          },
          {
            bg: "Какви услуги при зъболекар мога да ползвам?",
            en: "What dental services can I use?",
            ua: "Якими стоматологічними послугами я можу скористатися?",
          },
          {
            bg: "Как да запазя час при специалист?",
            en: "How do I book an appointment with a specialist?",
            ua: "Як записатися на прийом до спеціаліста?",
          },
        ],
      },
      {
        title: {
          bg: "Удостоверяване на увреждане",
          en: "Disability Assessment",
          ua: "Підтвердження інвалідності",
        },
        questions: [
          {
            bg: "Как да удостоверя степен на увреждане (решение на ТЕЛК)?",
            en: "How do I certify my degree of disability (TELK decision)?",
            ua: "Як підтвердити ступінь інвалідності (рішення ТЕЛК)?",
          },
          {
            bg: "Какво означават различните проценти?",
            en: "What do the different percentages mean?",
            ua: "Що означають різні відсотки?",
          },
          {
            bg: "Как мога да обжалвам решението?",
            en: "How can I appeal the decision?",
            ua: "Як я можу оскаржити рішення?",
          },
          {
            bg: "Какви права имат хронично болните пациенти?",
            en: "What rights do chronically ill patients have?",
            ua: "Які права мають хронічно хворі пацієнти?",
          },
          {
            bg: "Кои организации могат да ми помогнат?",
            en: "Which organizations can help me?",
            ua: "Які організації можуть мені допомогти?",
          },
        ],
      },
    ],
  },
  {
    id: "housing",
    title: {
      bg: "Жилище",
      en: "Housing",
      ua: "Житло",
    },
    description: {
      bg: "В тази секция ще намерите информация за жилищното настаняване в България — в частен имот или с подкрепата на държавата. Ако не намирате въпроса си, пишете направо в чата.",
      en: "In this section you will find information about housing in Bulgaria — in private property or with state support. If you can't find your question, write directly in the chat.",
      ua: "У цьому розділі ви знайдете інформацію про житло в Болгарії — приватне чи за підтримки держави. Якщо ви не знаходите свого питання, пишіть безпосередньо в чат.",
    },
    subcategories: [
      {
        title: {
          bg: "Жилища под наем",
          en: "Rental Housing",
          ua: "Орендне житло",
        },
        questions: [
          {
            bg: "Как да си намеря жилище под наем?",
            en: "How do I find rental housing?",
            ua: "Як знайти житло в оренду?",
          },
          {
            bg: "Какво е важно, когато подписвам договор за наем?",
            en: "What is important when signing a rental contract?",
            ua: "Що важливо при підписанні договору оренди?",
          },
          {
            bg: "Какви други разходи за апартамента трябва да имам предвид?",
            en: "What other apartment expenses should I keep in mind?",
            ua: "Які інші витрати на квартиру слід мати на увазі?",
          },
        ],
      },
      {
        title: {
          bg: "Безплатно жилищно настаняване",
          en: "Free Housing Accommodation",
          ua: "Безкоштовне житлове розміщення",
        },
        questions: [
          {
            bg: "Мога ли да ползвам безплатно жилищно настаняване от държавата?",
            en: "Can I use free state-provided housing?",
            ua: "Чи можу я скористатися безкоштовним державним житлом?",
          },
          {
            bg: "Как мога да кандидатствам за Програмата за хуманитарна подкрепа и интеграция на разселени лица от Украйна?",
            en: "How can I apply for the Humanitarian Support and Integration Program for displaced persons from Ukraine?",
            ua: "Як подати заявку на Програму гуманітарної підтримки та інтеграції переміщених осіб з України?",
          },
          {
            bg: "Какво да направя, ако остана на улицата?",
            en: "What should I do if I end up on the street?",
            ua: "Що робити, якщо я опинюся на вулиці?",
          },
          {
            bg: "Кои организации могат да ми помогнат?",
            en: "Which organizations can help me?",
            ua: "Які організації можуть мені допомогти?",
          },
        ],
      },
    ],
  },
  {
    id: "social",
    title: {
      bg: "Социално подпомагане",
      en: "Social Support",
      ua: "Соціальна підтримка",
    },
    description: {
      bg: "В тази секция ще намерите информация за всички видове социални помощи в България: за лица с финансови затруднения, семейни помощи, за лица с увреждания, за възрастни, както и информация за социални услуги, включително такива за жертви на насилие и трафик. Ако не намирате въпроса си, пишете направо в чата.",
      en: "In this section you will find information about all types of social assistance in Bulgaria: for people with financial difficulties, family benefits, for people with disabilities, for the elderly, as well as information about social services, including those for victims of violence and trafficking. If you can't find your question, write directly in the chat.",
      ua: "У цьому розділі ви знайдете інформацію про всі види соціальної допомоги в Болгарії: для осіб з фінансовими труднощами, сімейну допомогу, для осіб з інвалідністю, для літніх людей, а також інформацію про соціальні послуги, включаючи для жертв насильства та торгівлі людьми. Якщо ви не знаходите свого питання, пишіть безпосередньо в чат.",
    },
    subcategories: [
      {
        title: {
          bg: "Социални помощи",
          en: "Social Benefits",
          ua: "Соціальна допомога",
        },
        questions: [
          {
            bg: "Какви социални помощи и социални услуги съществуват в България?",
            en: "What social benefits and social services exist in Bulgaria?",
            ua: "Які соціальні допомоги та соціальні послуги існують у Болгарії?",
          },
          {
            bg: "На какви социални помощи имам право?",
            en: "What social benefits am I entitled to?",
            ua: "На яку соціальну допомогу я маю право?",
          },
          {
            bg: "Как да подам документи за социални помощи?",
            en: "How do I apply for social benefits?",
            ua: "Як подати документи на соціальну допомогу?",
          },
          {
            bg: "Какво да направя, ако ми бъдат отказани семейни помощи за деца?",
            en: "What should I do if family benefits for children are refused?",
            ua: "Що робити, якщо мені відмовили у сімейній допомозі на дітей?",
          },
          {
            bg: "Каква подкрепа се предвижда за лица с увреждания в България?",
            en: "What support is provided for people with disabilities in Bulgaria?",
            ua: "Яка підтримка передбачена для осіб з інвалідністю в Болгарії?",
          },
          {
            bg: "Каква подкрепа се предвижда за най-възрастните?",
            en: "What support is provided for the elderly?",
            ua: "Яка підтримка передбачена для літніх людей?",
          },
          {
            bg: "Как да получа помощ в социална услуга в България?",
            en: "How do I receive help through a social service in Bulgaria?",
            ua: "Як отримати допомогу через соціальну службу в Болгарії?",
          },
          {
            bg: "Кои организации могат да ми помогнат?",
            en: "Which organizations can help me?",
            ua: "Які організації можуть мені допомогти?",
          },
        ],
      },
      {
        title: {
          bg: "Подкрепа при насилие или трафик",
          en: "Support for Violence or Trafficking Victims",
          ua: "Підтримка при насильстві або торгівлі людьми",
        },
        questions: [
          {
            bg: "Каква подкрепа съществува в България за жертви на насилие?",
            en: "What support exists in Bulgaria for victims of violence?",
            ua: "Яка підтримка існує в Болгарії для жертв насильства?",
          },
          {
            bg: "Какво да направя, ако съм в непосредствена опасност?",
            en: "What should I do if I am in immediate danger?",
            ua: "Що робити, якщо я в безпосередній небезпеці?",
          },
          {
            bg: "Каква подкрепа съществува, ако съм жертва на насилие у дома?",
            en: "What support is available if I am a victim of domestic violence?",
            ua: "Яка підтримка існує, якщо я жертва домашнього насильства?",
          },
          {
            bg: "Какво ще се случи с децата ми в случай на насилие у дома?",
            en: "What will happen to my children in case of domestic violence?",
            ua: "Що станеться з моїми дітьми у випадку домашнього насильства?",
          },
          {
            bg: "Какво да направя, ако съм в опасност или жертва на трафик?",
            en: "What should I do if I am in danger or a victim of trafficking?",
            ua: "Що робити, якщо я в небезпеці або жертва торгівлі людьми?",
          },
          {
            bg: "Каква подкрепа съществува за жертви на трафик?",
            en: "What support exists for victims of trafficking?",
            ua: "Яка підтримка існує для жертв торгівлі людьми?",
          },
          {
            bg: "Кои организации могат да ми помогнат?",
            en: "Which organizations can help me?",
            ua: "Які організації можуть мені допомогти?",
          },
        ],
      },
    ],
  },
];
