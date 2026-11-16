<template>
  <ion-page>
    <!-- Header putih berisi tombol Refresh di tengah -->
    <ion-header :translucent="true" class="app-header">
      <ion-toolbar>
        <div class="header-inner">
          <ion-button
            class="refresh-btn"
            :disabled="loading"
            :aria-busy="loading.toString()"
            @click="loadCoins"
          >
            {{ loading ? 'Memuat…' : 'Refresh' }}
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="app-content">
      <!-- Garis tipis saat data sedang diperbarui -->
      <ion-progress-bar v-if="loading && coins.length > 0" type="indeterminate" class="top-progress" />

      <!-- 1. Saat memuat pertama kali -->
      <div v-if="loading && coins.length === 0" class="state-box" data-testid="loading">
        <ion-spinner name="crescent" color="primary" />
        <p>Memuat data cryptocurrency…</p>
      </div>

      <!-- 2. Saat terjadi error jaringan -->
      <div v-else-if="error" class="state-box error" data-testid="error">
        <ion-icon :icon="alertCircleOutline" class="error-icon" />
        <p>{{ error }}</p>
        <ion-button class="retry-btn" @click="loadCoins">Coba Lagi</ion-button>
      </div>

      <!-- 3. Data berhasil dimuat: tabel rank / name+symbol / USD+harga -->
      <div v-else class="coin-table" data-testid="coin-table">
        <div v-for="coin in coins" :key="coin.id" class="coin-row" data-testid="coin-row">
          <div class="cell cell-rank">
            <span class="label">Rank</span>
            <span class="value">{{ coin.rank }}</span>
          </div>
          <div class="cell cell-name">
            <span class="label">{{ coin.name }}</span>
            <span class="value">{{ coin.symbol }}</span>
          </div>
          <div class="cell cell-price">
            <span class="label">USD</span>
            <span class="value">{{ coin.price_usd }}</span>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonProgressBar, IonSpinner, IonToolbar } from '@ionic/vue';
import { alertCircleOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';

import { fetchCoins } from '../services/cryptoService';
import type { CryptoCoin } from '../types/crypto';

/** Daftar koin hasil API CoinLore */
const coins = ref<CryptoCoin[]>([]);
/** True saat request sedang berjalan */
const loading = ref(false);
/** Pesan error bila request gagal */
const error = ref<string | null>(null);

/** Ambil data dari API; dipanggil saat halaman dibuka dan saat tombol Refresh ditekan */
async function loadCoins(): Promise<void> {
  if (loading.value) return;
  loading.value = true;
  error.value = null;
  try {
    coins.value = await fetchCoins();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Terjadi kesalahan tidak diketahui';
  } finally {
    loading.value = false;
  }
}

onMounted(loadCoins);
</script>

<style scoped>
/* ---------- Header ---------- */
.app-header {
  --background: #ffffff;
  border-bottom: 1px solid #ddd;
}

ion-toolbar {
  --background: #ffffff;
  --color: #000000;
}

.header-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
}

/* Tombol Refresh biru sesuai contoh tampilan */
.refresh-btn {
  --background: #0057d8;
  --background-hover: #0047b3;
  --background-activated: #003d99;
  --border-radius: 8px;
  --box-shadow: none;
  height: 48px;
  padding: 0 28px;
  font-size: 17px;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0;
}

.top-progress {
  position: sticky;
  top: 0;
  z-index: 2;
}

/* ---------- Status memuat / error ---------- */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 64px 24px;
  text-align: center;
  color: #555;
  font-size: 15px;
}

.state-box.error {
  color: #b00020;
}

.error-icon {
  font-size: 42px;
}

.retry-btn {
  --background: #0057d8;
  --border-radius: 8px;
  text-transform: none;
  font-weight: 700;
}

/* ---------- Tabel data koin ---------- */
.coin-table {
  border-top: 1px solid #ddc375;
}

.coin-row {
  display: grid;
  grid-template-columns: 26% 34% 40%;
  align-items: center;
  background: #fff2cc;
  border-bottom: 1px solid #ddc375;
  padding: 14px 6px;
}

.cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding: 0 8px;
}

.label {
  font-size: 14px;
  font-weight: 700;
  color: #111111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.value {
  font-size: 30px;
  font-weight: 700;
  color: #000000;
  line-height: 1.15;
}

.cell-price .value {
  font-size: 26px;
}
</style>
