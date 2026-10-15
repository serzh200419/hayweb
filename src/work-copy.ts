import type {Locale} from './config';
export const workIds=['bellavita','525iguys','corner-collision'] as const;
export type WorkId=typeof workIds[number];
interface ProjectCopy{industry:string;description:string;alt:string}
interface WorkCopy{title:string;intro:string;visit:string;newTab:string;projects:Record<WorkId,ProjectCopy>}
// Contribution descriptions were not supplied. These describe website purpose only.
export const workCopy:Record<Locale,WorkCopy>={
 en:{title:'Our Work',intro:'Explore websites we’ve worked on for businesses in different industries.',visit:'Visit website',newTab:'opens in a new tab',projects:{
  bellavita:{industry:'Flower shop',description:'A flower shop website introducing bouquets and floral arrangements.',alt:'Bellavita Flowers website with an Armenian headline and pink lilies.'},
  '525iguys':{industry:'Car rental',description:'A car rental website presenting the business and its vehicles.',alt:'525iGuys website showing two cars on a black background.'},
  'corner-collision':{industry:'Collision repair',description:'A collision repair website introducing the center and its services.',alt:'Corner Collision Center website with orange headings and a workshop background.'},
 }},
 hy:{title:'Մեր աշխատանքները',intro:'Ծանոթացեք տարբեր ոլորտների բիզնեսների կայքերին, որոնց վրա մենք աշխատել ենք։',visit:'Դիտել կայքը',newTab:'բացվում է նոր ներդիրում',projects:{
  bellavita:{industry:'Ծաղկի խանութ',description:'Ծաղկի խանութի կայք՝ ծաղկեփնջերն ու ծաղկային կոմպոզիցիաները ներկայացնելու համար։',alt:'Bellavita Flowers-ի կայքը՝ հայերեն վերնագրով և վարդագույն շուշաններով։'},
  '525iguys':{industry:'Ավտոմեքենաների վարձույթ',description:'Ավտոմեքենաների վարձույթի կայք՝ բիզնեսն ու մեքենաները ներկայացնելու համար։',alt:'525iGuys-ի կայքը՝ սև ֆոնի վրա ցուցադրված երկու ավտոմեքենաներով։'},
  'corner-collision':{industry:'Թափքի վերանորոգում',description:'Ավտոմեքենաների թափքի վերանորոգման կենտրոնի կայք՝ կենտրոնն ու ծառայությունները ներկայացնելու համար։',alt:'Corner Collision Center-ի կայքը՝ նարնջագույն վերնագրերով և արհեստանոցի ֆոնով։'},
 }},
 ru:{title:'Наши работы',intro:'Посмотрите сайты компаний из разных отраслей, над которыми мы работали.',visit:'Перейти на сайт',newTab:'откроется в новой вкладке',projects:{
  bellavita:{industry:'Цветочный магазин',description:'Сайт цветочного магазина, представляющий букеты и цветочные композиции.',alt:'Сайт Bellavita Flowers с заголовком на армянском и розовыми лилиями.'},
  '525iguys':{industry:'Аренда автомобилей',description:'Сайт аренды автомобилей с информацией о компании и её машинах.',alt:'Сайт 525iGuys с двумя автомобилями на чёрном фоне.'},
  'corner-collision':{industry:'Кузовной ремонт',description:'Сайт центра кузовного ремонта с информацией о центре и его услугах.',alt:'Сайт Corner Collision Center с оранжевыми заголовками и мастерской на фоне.'},
 }},
};
