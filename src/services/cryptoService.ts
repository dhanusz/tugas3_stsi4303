import type { CryptoCoin, TickersResponse } from '../types/crypto';

/** Alamat API online daftar cryptocurrency (sesuai tugas praktikum) */
export const API_URL = 'https://api.coinlore.net/api/tickers/';

/**
 * Mengambil data koin dari API CoinLore dan mengubahnya menjadi
 * daftar CryptoCoin yang siap ditampilkan di view.
 *
 * @param signal - opsional, untuk membatalkan request (mis. saat user
 *                 menekan Refresh berulang kali dengan cepat)
 */
export async function fetchCoins(signal?: AbortSignal): Promise<CryptoCoin[]> {
  const response = await fetch(API_URL, { signal });

  if (!response.ok) {
    throw new Error(`Gagal memuat data (HTTP ${response.status})`);
  }

  const payload = (await response.json()) as TickersResponse;

  if (!payload || !Array.isArray(payload.data)) {
    throw new Error('Format respons API tidak sesuai');
  }

  // Ambil hanya atribut yang dibutuhkan tugas
  return payload.data.map((coin) => ({
    id: coin.id,
    rank: coin.rank,
    name: coin.name,
    symbol: coin.symbol,
    price_usd: coin.price_usd,
  }));
}
