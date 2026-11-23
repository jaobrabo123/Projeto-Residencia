// Estende o app.json. O caminho base só é aplicado quando EXPO_BASE_URL está
// definido (ex.: no deploy do GitHub Pages, onde o site fica em /nome-do-repo/).
// Em desenvolvimento local a variável não existe e nada muda.
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    ...(process.env.EXPO_BASE_URL
      ? { baseUrl: process.env.EXPO_BASE_URL }
      : {}),
  },
});
