export const business = {
  name: 'HayWeb', phone: '+374 77 162233', telephone: '+37477162233',
  whatsapp: 'https://wa.me/37477162233', telegram: 'https://t.me/serj_galstian',
  email: 'business.hayweb@gmail.com',
  websitePackage: { pageCount: 4, pages: ['home', 'services', 'about', 'contact'] },
  pricing: { website: 80000, languages: 20000, blog: 20000, commerce: 30000, page: 10000, logo: 30000 },
  maintenance: 15000,
  promotion: { discount: 0.5, freeLanguages: true, requirement: 'project-request' },
} as const;
export const locales = ['hy', 'en', 'ru'] as const;
export type Locale = typeof locales[number];
export const languageNames = { hy: 'Հայերեն', en: 'English', ru: 'Русский' };
export const discounted = (value: number) => Math.round(value * (1 - business.promotion.discount));
export const total = Object.values(business.pricing).reduce((sum, value) => sum + value, 0);
export const whatsapp = (message: string) => `${business.whatsapp}?text=${encodeURIComponent(message)}`;
