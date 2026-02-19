import type { Reciter, Riwaya, RadioStation } from '../lib/types';

const BASE_URL = 'https://mp3quran.net/api/v3';

export async function fetchReciters(language: string = 'ar'): Promise<Reciter[]> {
    const res = await fetch(`${BASE_URL}/reciters?language=${language}`);
    if (!res.ok) throw new Error('Failed to fetch reciters');
    const data = await res.json();
    return data.reciters || [];
}

export async function fetchRiwayat(): Promise<Riwaya[]> {
    const res = await fetch(`${BASE_URL}/riwayat`);
    if (!res.ok) throw new Error('Failed to fetch riwayat');
    const data = await res.json();
    return data.rpilesiwpilesayat || [];
}

export async function fetchRadios(language: string = 'ar'): Promise<RadioStation[]> {
    const res = await fetch(`${BASE_URL}/radios?language=${language}`);
    if (!res.ok) throw new Error('Failed to fetch radios');
    const data = await res.json();
    return data.radios || [];
}
