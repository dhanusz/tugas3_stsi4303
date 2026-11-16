import { afterEach, describe, expect, test, vi } from 'vitest';

import { API_URL, fetchCoins } from '@/services/cryptoService';

/** Respons tiruan (mock) yang bentuknya sama dengan API CoinLore */
const mockResponse = {
  data: [
    { id: '90', rank: 1, name: 'Bitcoin', symbol: 'BTC', price_usd: '74974.75' },
    { id: '80', rank: 2, name: 'Ethereum', symbol: 'ETH', price_usd: '2132.90' },
  ],
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('cryptoService', () => {
  test('mengambil data dari alamat API yang benar', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    vi.stubGlobal('fetch', fetchMock);

    await fetchCoins();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(API_URL);
  });

  test('mengubah respons JSON menjadi daftar CryptoCoin', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      }),
    );

    const coins = await fetchCoins();

    expect(coins).toHaveLength(2);
    expect(coins[0]).toEqual({
      id: '90',
      rank: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      price_usd: '74974.75',
    });
    expect(coins[1].symbol).toBe('ETH');
  });

  test('melempar error saat HTTP bukan 2xx', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      }),
    );

    await expect(fetchCoins()).rejects.toThrow('HTTP 500');
  });

  test('melempar error saat format data tidak sesuai', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'bukan-array' }),
      }),
    );

    await expect(fetchCoins()).rejects.toThrow('Format respons API tidak sesuai');
  });
});
