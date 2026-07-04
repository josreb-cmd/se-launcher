// sw.js — interruptor de emergência
// Objetivo: desativar e desregistar Service Workers antigos instalados
// antes da migração para GitHub, e limpar toda a cache antiga guardada
// no browser dos utilizadores. Depois de isto propagar, este ficheiro
// pode ser removido do repositório (ou substituído por um SW normal).

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Apaga todas as caches guardadas por versões anteriores do SW
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      // Desregista este próprio Service Worker
      await self.registration.unregister();

      // Força todas as páginas abertas a recarregar com a versão real do servidor
      const clientsList = await self.clients.matchAll({ type: 'window' });
      clientsList.forEach((client) => client.navigate(client.url));
    })()
  );
});
