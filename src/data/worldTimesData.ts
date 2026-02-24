export interface CountryDetail {
    id: string;
    cities: string[];
    citiesAr: string[];
    governance: string;
    governanceAr: string;
    ruler: string;
    rulerAr: string;
    muslimPopulation: string;
    muslimPopulationAr: string;
    muslimSafetyPercentage: number;
    location: string;
    locationAr: string;
    features: string[];
    featuresAr: string[];
}

import { COUNTRY_DETAILS_REFACTORED } from './countries';

export const COUNTRY_DETAILS: Record<string, CountryDetail> = COUNTRY_DETAILS_REFACTORED;
