/**
 * Shim tipe untuk file .vue agar bisa diperiksa oleh tsc (bukan vue-tsc).
 * Dibutuhkan skrip `npm run typecheck` yang menjalankan tsc murni.
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<object, object, unknown>;
  export default component;
}
