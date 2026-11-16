/**
 * Model data untuk satu cryptocurrency (coin) dari API CoinLore.
 * Hanya atribut yang dibutuhkan tugas yang dideklarasikan:
 * rank, name, symbol, dan price_usd.
 */
export interface CryptoCoin {
  /** ID unik koin pada API CoinLore (mis. "90" untuk Bitcoin) */
  id: string;
  /** Peringkat kapitalisasi pasar (1 = terbesar) */
  rank: number;
  /** Nama lengkap koin (mis. "Bitcoin") */
  name: string;
  /** Simbol/ticker koin (mis. "BTC") */
  symbol: string;
  /** Harga dalam USD sebagai string dari API (mis. "74974.75") */
  price_usd: string;
}

/** Bentuk mentah (raw) respons JSON dari https://api.coinlore.net/api/tickers/ */
export interface TickersResponse {
  data: Array<{
    id: string;
    rank: number;
    name: string;
    symbol: string;
    price_usd: string;
  }>;
}
