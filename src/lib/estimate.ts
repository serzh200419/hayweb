import {business,discounted} from '../config';
export function estimate(languages:boolean,blog:boolean,promotion:boolean){const value=business.pricing.website+(languages?business.pricing.languages:0)+(blog?business.pricing.blog:0);return promotion?discounted(value):value;}
