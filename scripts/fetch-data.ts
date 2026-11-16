/**
 * Skrip bantu untuk menguji akses API CoinLore langsung dari Node.js
 * menggunakan TypeScript + ts-node (sesuai modul praktikum).
 *
 * Cara menjalankan:
 *   npx ts-node scripts/fetch-data.ts
 *   atau: npm run fetch-api
 */

const API_URL = 'https://api.coinlore.net/api/tickers/';

interface CoinRow {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price_usd: string;
}

interface TickersResponse {
  data: CoinRow[];
}

async function main(): Promise<void> {
  console.log(`Mengambil data dari ${API_URL} ...`);

  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as TickersResponse;
  const coins = payload.data;

  console.log(`Berhasil! Jumlah koin: ${coins.length}\n`);
  console.log('Rank | Name                 | Symbol  | Price USD');
  console.log('-----+----------------------+---------+----------------');

  for (const coin of coins.slice(0, 10)) {
    const rank = String(coin.rank).padStart(4, ' ');
    const name = coin.name.padEnd(20, ' ');
    const symbol = coin.symbol.padEnd(7, ' ');
    console.log(`${rank} | ${name} | ${symbol} | ${coin.price_usd}`);
  }
}

main().catch((err: unknown) => {
  console.error('Gagal mengambil data:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
