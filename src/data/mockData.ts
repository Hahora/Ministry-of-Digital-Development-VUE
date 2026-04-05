export interface Topic {
  id: number
  title: string
  summary: string
  category: Category
  region: string
  municipality: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  mentionsCount: number
  mentionsDelta: number
  sourcesCount: number
  sentiment: number
  trend: 'rising' | 'stable' | 'falling'
  createdAt: string
  updatedAt: string
  sources: Source[]
  facts: string[]
  whyInTop: string
  trendData: number[]
}

export interface Source {
  id: number
  name: string
  type: 'vk' | 'telegram'
  url: string
  publishedAt: string
}

export type Category = 'zhkh' | 'transport' | 'health' | 'education' | 'ecology' | 'economy' | 'safety' | 'social'

export const categoryLabels: Record<Category, string> = {
  zhkh: 'ЖКХ',
  transport: 'Дороги и транспорт',
  health: 'Здравоохранение',
  education: 'Образование',
  ecology: 'Экология и ЧС',
  economy: 'Экономика',
  safety: 'Безопасность',
  social: 'Социальная сфера',
}

export const categoryColors: Record<Category, string> = {
  zhkh: '#f59e0b',
  transport: '#6366f1',
  health: '#ef4444',
  education: '#22c55e',
  ecology: '#10b981',
  economy: '#3b82f6',
  safety: '#e11d48',
  social: '#8b5cf6',
}

export const categoryIconNames: Record<Category, string> = {
  zhkh: 'Home',
  transport: 'Car',
  health: 'Heart',
  education: 'GraduationCap',
  ecology: 'TreePine',
  economy: 'Briefcase',
  safety: 'Shield',
  social: 'Users',
}

export const severityLabels: Record<string, string> = {
  critical: 'Критический',
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
}

export const severityColors: Record<string, string> = {
  critical: '#dc2626',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#22c55e',
}

export const topics: Topic[] = [
  {
    id: 1,
    title: 'Срыв вывоза ТКО в Кировском и Промышленном районах',
    summary: 'С 28 марта зафиксированы массовые жалобы жителей Кировского и Промышленного районов на несвоевременный вывоз твёрдых коммунальных отходов. Контейнерные площадки переполнены, отмечается антисанитарная обстановка. Региональный оператор ссылается на поломку техники.',
    category: 'zhkh',
    region: 'Кировский район',
    municipality: 'г. Самара',
    severity: 'critical',
    mentionsCount: 1847,
    mentionsDelta: 34,
    sourcesCount: 23,
    sentiment: -0.78,
    trend: 'rising',
    createdAt: '2026-03-28T08:00:00',
    updatedAt: '2026-04-04T07:30:00',
    sources: [
      { id: 1,  name: 'ВК — Ростов Онлайн',         type: 'vk',       url: 'https://vk.com/rostov_online',     publishedAt: '2026-03-28T10:00:00' },
      { id: 2,  name: 'ТГ — Ростов сейчас',          type: 'telegram', url: 'https://t.me/rostov_now',          publishedAt: '2026-03-28T11:20:00' },
      { id: 3,  name: 'ТГ — ЖКХ Ростов',             type: 'telegram', url: 'https://t.me/gkh_rostov',          publishedAt: '2026-03-29T09:00:00' },
      { id: 4,  name: 'ВК — Кировский район',        type: 'vk',       url: 'https://vk.com/kirovsky_rostov',   publishedAt: '2026-03-29T12:00:00' },
      { id: 5,  name: 'ТГ — Новости Ростова',        type: 'telegram', url: 'https://t.me/rostov_news',         publishedAt: '2026-03-29T15:30:00' },
      { id: 6,  name: 'ВК — Ростов говорит',         type: 'vk',       url: 'https://vk.com/rostov_govorit',    publishedAt: '2026-03-30T08:10:00' },
      { id: 7,  name: 'ТГ — МЧС Ростовская обл.',   type: 'telegram', url: 'https://t.me/mchs_rostov_region',  publishedAt: '2026-03-30T10:00:00' },
      { id: 8,  name: 'ВК — Родители Ростова',       type: 'vk',       url: 'https://vk.com/roditeli_rostov',   publishedAt: '2026-03-30T13:00:00' },
      { id: 9,  name: 'ТГ — Дороги Ростова',         type: 'telegram', url: 'https://t.me/dorogi_rostov',       publishedAt: '2026-03-31T07:00:00' },
      { id: 10, name: 'ВК — Работа в Ростове',       type: 'vk',       url: 'https://vk.com/rabota_rostov',     publishedAt: '2026-04-01T09:30:00' },
    ],
    facts: [
      'Жалобы поступают с 28 марта из 14 адресов Кировского района и 9 адресов Промышленного района.',
      'Региональный оператор «ЭкоСтройРесурс» подтвердил выход из строя 4 мусоровозов.',
      'Роспотребнадзор начал проверку 1 апреля.',
      'По данным портала обращений, число жалоб на вывоз ТКО выросло в 6 раз за неделю.',
    ],
    whyInTop: 'Резкий рост обращений (×6 за неделю), охват двух крупных районов, потенциальная санитарная угроза, высокая медийная активность.',
    trendData: [120, 180, 340, 580, 920, 1400, 1847],
  },
  {
    id: 2,
    title: 'Аварии на теплосетях: отключение отопления в Советском районе',
    summary: 'В результате прорыва магистральной трубы на ул. Ново-Садовой 31 марта без отопления остались 12 многоквартирных домов (около 3 200 жителей). Ремонтные работы ведутся, предварительный срок восстановления — 2-3 дня.',
    category: 'zhkh',
    region: 'Советский район',
    municipality: 'г. Самара',
    severity: 'critical',
    mentionsCount: 1523,
    mentionsDelta: 18,
    sourcesCount: 19,
    sentiment: -0.82,
    trend: 'stable',
    createdAt: '2026-03-31T06:15:00',
    updatedAt: '2026-04-04T06:00:00',
    sources: [
      { id: 4, name: 'ТГ — Новости Самары', type: 'telegram', url: '#', publishedAt: '2026-03-31T08:00:00' },
      { id: 5, name: 'ВК — Самара Онлайн', type: 'vk', url: '#', publishedAt: '2026-03-31T07:30:00' },
    ],
    facts: [
      'Прорыв магистральной трубы диаметром 500мм на ул. Ново-Садовой, д. 200.',
      '12 многоквартирных домов отключены от теплоснабжения.',
      'Около 3 200 жителей затронуты аварией.',
      'МУП «Самараводоканал» организовал подвоз горячей воды.',
    ],
    whyInTop: 'Критическая инфраструктурная авария, большое число пострадавших, температура воздуха ниже нормы для сезона.',
    trendData: [0, 0, 50, 800, 1200, 1450, 1523],
  },
  {
    id: 3,
    title: 'Очереди и нехватка врачей в поликлиниках Тольятти',
    summary: 'Жители Тольятти массово жалуются на невозможность записаться к узким специалистам в городских поликлиниках. Среднее время ожидания записи к кардиологу — 3 недели, к эндокринологу — 4 недели. Отмечается нехватка 47 врачей-специалистов.',
    category: 'health',
    region: 'Автозаводский район',
    municipality: 'г. Тольятти',
    severity: 'high',
    mentionsCount: 1102,
    mentionsDelta: 12,
    sourcesCount: 15,
    sentiment: -0.65,
    trend: 'rising',
    createdAt: '2026-03-15T10:00:00',
    updatedAt: '2026-04-03T18:00:00',
    sources: [
      { id: 6, name: 'ВК — Тольятти говорит', type: 'vk', url: '#', publishedAt: '2026-03-20T14:00:00' },
      { id: 7, name: 'ТГ — Тольятти сегодня', type: 'telegram', url: '#', publishedAt: '2026-03-18T09:00:00' },
    ],
    facts: [
      'По данным Минздрава региона, дефицит составляет 47 врачей узких специальностей.',
      'Среднее время ожидания записи к кардиологу — 21 день.',
      'В поликлинике №3 закрыт кабинет офтальмолога с февраля.',
      'Запущена программа привлечения медкадров с подъёмными выплатами.',
    ],
    whyInTop: 'Систематическая проблема, затрагивающая здоровье населения второго по величине города региона. Устойчивый рост обсуждений.',
    trendData: [200, 350, 480, 620, 780, 950, 1102],
  },
  {
    id: 4,
    title: 'Ямы и аварийное состояние дорог после зимы',
    summary: 'После окончания зимнего сезона зафиксировано резкое ухудшение состояния дорожного покрытия на ключевых магистралях: Московское шоссе, ул. Авроры, ул. Стара-Загора. Зафиксировано 23 ДТП за неделю, связанных с дефектами дороги.',
    category: 'transport',
    region: 'Октябрьский район',
    municipality: 'г. Самара',
    severity: 'high',
    mentionsCount: 987,
    mentionsDelta: 8,
    sourcesCount: 31,
    sentiment: -0.58,
    trend: 'stable',
    createdAt: '2026-03-20T12:00:00',
    updatedAt: '2026-04-04T05:00:00',
    sources: [
      { id: 8, name: 'ВК — Автомобилисты Самары', type: 'vk', url: '#', publishedAt: '2026-03-22T16:00:00' },
      { id: 9, name: 'ТГ — Дороги Самары', type: 'telegram', url: '#', publishedAt: '2026-03-21T08:30:00' },
    ],
    facts: [
      '23 ДТП за последнюю неделю марта связаны с дефектами дорожного покрытия.',
      'Наиболее проблемные участки: Московское шоссе (км 3-7), ул. Авроры (д. 100-150).',
      'Администрация анонсировала начало ямочного ремонта с 5 апреля.',
      'Выделено 180 млн руб. на весенний ремонт дорог.',
    ],
    whyInTop: 'Большое число ДТП, угроза безопасности, высокая активность в соцсетях, затронуты ключевые транспортные артерии.',
    trendData: [300, 450, 600, 750, 850, 940, 987],
  },
  {
    id: 5,
    title: 'Задымление и запах гари в Новокуйбышевске',
    summary: 'Жители Новокуйбышевска сообщают о сильном запахе гари и задымлении, предположительно связанном с выбросами НПЗ. МЧС проводит замеры качества воздуха. Роспотребнадзор зафиксировал превышение ПДК по сероводороду в 2.3 раза.',
    category: 'ecology',
    region: 'Новокуйбышевск',
    municipality: 'г. Новокуйбышевск',
    severity: 'high',
    mentionsCount: 876,
    mentionsDelta: 45,
    sourcesCount: 12,
    sentiment: -0.71,
    trend: 'rising',
    createdAt: '2026-04-02T05:00:00',
    updatedAt: '2026-04-04T08:00:00',
    sources: [
      { id: 10, name: 'ТГ — МЧС Самарская область', type: 'telegram', url: '#', publishedAt: '2026-04-02T07:00:00' },
      { id: 11, name: 'ВК — Новокуйбышевск ТСЖ', type: 'vk', url: '#', publishedAt: '2026-04-02T06:30:00' },
    ],
    facts: [
      'Превышение ПДК по сероводороду в 2.3 раза (данные Роспотребнадзора).',
      'Замеры проводятся в 5 точках города.',
      'НПЗ «Новокуйбышевский НПЗ» отрицает связь с выбросами.',
      'Прокуратура начала проверку.',
    ],
    whyInTop: 'Угроза здоровью населения, быстрый рост обсуждений (+45% за сутки), начаты прокурорские проверки.',
    trendData: [0, 0, 0, 150, 420, 680, 876],
  },
  {
    id: 6,
    title: 'Задержка зарплаты на заводе «СамараАвтоДеталь»',
    summary: 'Работники завода «СамараАвтоДеталь» (1 200 сотрудников) сообщают о задержке заработной платы за март. Профсоюз направил обращение в трудовую инспекцию. Руководство обещает погасить задолженность до 10 апреля.',
    category: 'economy',
    region: 'Промышленный район',
    municipality: 'г. Самара',
    severity: 'high',
    mentionsCount: 743,
    mentionsDelta: 22,
    sourcesCount: 9,
    sentiment: -0.69,
    trend: 'rising',
    createdAt: '2026-04-01T09:00:00',
    updatedAt: '2026-04-04T07:00:00',
    sources: [
      { id: 12, name: 'ВК — Работа в Самаре', type: 'vk', url: '#', publishedAt: '2026-04-02T11:00:00' },
      { id: 13, name: 'ТГ — Самара работа', type: 'telegram', url: '#', publishedAt: '2026-04-01T15:00:00' },
    ],
    facts: [
      'Задержка зарплаты за март для 1 200 сотрудников.',
      'Общая сумма задолженности — около 45 млн руб.',
      'Профсоюз подал заявление в ГИТ 2 апреля.',
      'Руководство завода назвало причиной задержку оплаты от крупного контрагента.',
    ],
    whyInTop: 'Градообразующее предприятие, большое число затронутых работников, риск социальной напряжённости.',
    trendData: [0, 0, 100, 280, 450, 600, 743],
  },
  {
    id: 7,
    title: 'Закрытие школы №47 на ремонт без альтернативы',
    summary: 'Школа №47 в Ленинском районе закрыта на капитальный ремонт с 1 апреля. Родители 540 учеников жалуются на отсутствие приемлемой альтернативы: ближайшая школа находится в 4 км. Организован подвоз, но автобусов недостаточно.',
    category: 'education',
    region: 'Ленинский район',
    municipality: 'г. Самара',
    severity: 'medium',
    mentionsCount: 534,
    mentionsDelta: 15,
    sourcesCount: 8,
    sentiment: -0.52,
    trend: 'rising',
    createdAt: '2026-03-30T14:00:00',
    updatedAt: '2026-04-03T20:00:00',
    sources: [
      { id: 14, name: 'ВК — Родители Самары', type: 'vk', url: '#', publishedAt: '2026-03-30T16:00:00' },
      { id: 15, name: 'ТГ — Образование Самара', type: 'telegram', url: '#', publishedAt: '2026-03-31T08:00:00' },
    ],
    facts: [
      'Школа №47 закрыта на капремонт с 1 апреля, срок — до сентября.',
      '540 учеников переведены в школу №62 (расстояние 4 км).',
      'Выделено 2 школьных автобуса, родители считают это недостаточным.',
      'Петиция родителей набрала 380 подписей.',
    ],
    whyInTop: 'Социально значимая проблема, активная организация родителей, медийный резонанс, потенциальный протестный потенциал.',
    trendData: [50, 100, 180, 280, 370, 450, 534],
  },
  {
    id: 8,
    title: 'Сбои общественного транспорта: отмена маршрутов',
    summary: 'С 1 апреля отменены 5 автобусных маршрутов в Железнодорожном районе из-за нехватки водителей и неисправности подвижного состава. Жители жалуются на увеличение времени ожидания до 40-60 минут.',
    category: 'transport',
    region: 'Железнодорожный район',
    municipality: 'г. Самара',
    severity: 'medium',
    mentionsCount: 421,
    mentionsDelta: 10,
    sourcesCount: 11,
    sentiment: -0.48,
    trend: 'stable',
    createdAt: '2026-04-01T07:00:00',
    updatedAt: '2026-04-03T19:00:00',
    sources: [
      { id: 16, name: 'ТГ — Транспорт Самары', type: 'telegram', url: '#', publishedAt: '2026-04-01T09:00:00' },
      { id: 19, name: 'ВК — Самара транспорт', type: 'vk', url: '#', publishedAt: '2026-04-01T10:00:00' },
    ],
    facts: [
      'Отменены маршруты №26, 34, 51, 67, 89.',
      'Причина — нехватка 28 водителей и 15 неисправных автобусов.',
      'Время ожидания на оставшихся маршрутах увеличилось до 40-60 мин.',
      'Администрация обещает восстановить маршруты к 15 апреля.',
    ],
    whyInTop: 'Затрагивает транспортную доступность крупного района, устойчивый поток жалоб, системная проблема.',
    trendData: [80, 120, 200, 280, 340, 390, 421],
  },
  {
    id: 9,
    title: 'Некачественные услуги УК в новостройках Тольятти',
    summary: 'Жители новых ЖК в Тольятти жалуются на бездействие управляющих компаний: протечки кровли, неработающие лифты, отсутствие уборки подъездов. Наиболее проблемные — ЖК «Новый берег» и ЖК «Солнечный».',
    category: 'zhkh',
    region: 'Комсомольский район',
    municipality: 'г. Тольятти',
    severity: 'medium',
    mentionsCount: 389,
    mentionsDelta: 5,
    sourcesCount: 7,
    sentiment: -0.45,
    trend: 'stable',
    createdAt: '2026-03-10T11:00:00',
    updatedAt: '2026-04-03T15:00:00',
    sources: [
      { id: 17, name: 'ТГ — ЖК Новый берег', type: 'telegram', url: '#', publishedAt: '2026-03-12T10:00:00' },
      { id: 20, name: 'ВК — Тольятти ЖКХ', type: 'vk', url: '#', publishedAt: '2026-03-13T09:00:00' },
    ],
    facts: [
      'В ЖК «Новый берег» — 18 обращений по протечкам кровли за март.',
      'В ЖК «Солнечный» — 3 лифта не работают более 2 недель.',
      'Жилинспекция вынесла 2 предписания УК «КомфортСервис».',
      'Жители рассматривают смену управляющей компании.',
    ],
    whyInTop: 'Хроническая проблема с тенденцией к обострению, затрагивает тысячи жителей новостроек.',
    trendData: [150, 200, 240, 280, 320, 360, 389],
  },
  {
    id: 10,
    title: 'Перебои с электричеством в сельских районах',
    summary: 'В Кинельском и Богатовском районах участились перебои с электроснабжением. За последние 2 недели зафиксировано 8 аварийных отключений. Причина — износ сетей и последствия ледяного дождя.',
    category: 'zhkh',
    region: 'Кинельский район',
    municipality: 'г. Кинель',
    severity: 'medium',
    mentionsCount: 312,
    mentionsDelta: 3,
    sourcesCount: 6,
    sentiment: -0.42,
    trend: 'falling',
    createdAt: '2026-03-22T09:00:00',
    updatedAt: '2026-04-03T12:00:00',
    sources: [
      { id: 18, name: 'ВК — Кинель онлайн', type: 'vk', url: '#', publishedAt: '2026-03-23T10:00:00' },
      { id: 21, name: 'ТГ — Кинельский район', type: 'telegram', url: '#', publishedAt: '2026-03-24T08:00:00' },
    ],
    facts: [
      '8 аварийных отключений за 2 недели.',
      'Наиболее пострадавшие — сёла Бузулук, Алексеевка, Георгиевка.',
      'Износ электросетей — 78% (данные «Самарские сети»).',
      'Подготовлена заявка на федеральное софинансирование модернизации.',
    ],
    whyInTop: 'Инфраструктурная проблема, затрагивающая сельское население, системный характер, необходимость капитальных вложений.',
    trendData: [180, 240, 290, 320, 330, 320, 312],
  },
]

export const sourceStats = [
  { name: 'ВКонтакте', count: 432, type: 'vk' as const, color: '#0077FF' },
  { name: 'Telegram', count: 312, type: 'telegram' as const, color: '#26A5E4' },
]

export const dailyMentions = [
  { date: '29 мар', count: 420 },
  { date: '30 мар', count: 580 },
  { date: '31 мар', count: 1240 },
  { date: '1 апр', count: 1680 },
  { date: '2 апр', count: 2100 },
  { date: '3 апр', count: 1890 },
  { date: '4 апр', count: 2340 },
]

export const categoryStats: { category: Category; count: number }[] = [
  { category: 'zhkh', count: 2548 },
  { category: 'transport', count: 1408 },
  { category: 'health', count: 1102 },
  { category: 'ecology', count: 876 },
  { category: 'economy', count: 743 },
  { category: 'education', count: 534 },
  { category: 'safety', count: 210 },
  { category: 'social', count: 156 },
]

export const regionStats = [
  { name: 'г. Самара', count: 4512, topCategory: 'zhkh' as Category },
  { name: 'г. Тольятти', count: 1491, topCategory: 'health' as Category },
  { name: 'г. Новокуйбышевск', count: 876, topCategory: 'ecology' as Category },
  { name: 'г. Кинель', count: 312, topCategory: 'zhkh' as Category },
  { name: 'г. Сызрань', count: 245, topCategory: 'transport' as Category },
  { name: 'г. Чапаевск', count: 189, topCategory: 'ecology' as Category },
]

export const botDetectionStats = {
  totalAnalyzed: 14230,
  botsDetected: 342,
  spamClusters: 8,
  filteredMentions: 1205,
}

export interface Report {
  id: number
  title: string
  type: 'full' | 'top10' | 'category' | 'region'
  typeLabel: string
  status: 'ready' | 'generating' | 'failed'
  date: string
  from: string
  to: string
  categories: Category[]
  region: string
  mentionsTotal: number
  topicsCount: number
  sourcesCount: number
}

export const reports: Report[] = [
  {
    id: 1,
    title: 'Еженедельная сводка 24-31 марта',
    type: 'full',
    typeLabel: 'Полная сводка',
    status: 'ready',
    date: '31.03.2026',
    from: '2026-03-24',
    to: '2026-03-31',
    categories: ['zhkh', 'transport', 'health', 'ecology', 'economy', 'education', 'safety', 'social'],
    region: 'all',
    mentionsTotal: 6840,
    topicsCount: 9,
    sourcesCount: 15,
  },
  {
    id: 2,
    title: 'Топ-10 проблемных тем марта',
    type: 'top10',
    typeLabel: 'Топ-10',
    status: 'ready',
    date: '01.04.2026',
    from: '2026-03-01',
    to: '2026-03-31',
    categories: ['zhkh', 'transport', 'health', 'ecology'],
    region: 'all',
    mentionsTotal: 18420,
    topicsCount: 10,
    sourcesCount: 15,
  },
  {
    id: 3,
    title: 'Отчёт по ЖКХ за Q1 2026',
    type: 'category',
    typeLabel: 'По категориям',
    status: 'ready',
    date: '01.04.2026',
    from: '2026-01-01',
    to: '2026-03-31',
    categories: ['zhkh'],
    region: 'all',
    mentionsTotal: 9210,
    topicsCount: 4,
    sourcesCount: 12,
  },
  {
    id: 4,
    title: 'Региональная аналитика Тольятти',
    type: 'region',
    typeLabel: 'По регионам',
    status: 'ready',
    date: '02.04.2026',
    from: '2026-03-01',
    to: '2026-04-02',
    categories: ['zhkh', 'transport', 'health', 'ecology'],
    region: 'tolyatti',
    mentionsTotal: 3240,
    topicsCount: 3,
    sourcesCount: 8,
  },
]

export const factCheckStats = {
  totalChecked: 487,
  confirmed: 312,
  contradictory: 89,
  unverified: 86,
}
