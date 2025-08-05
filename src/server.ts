import app from './app.js';
import config from './config/index.js';

app.listen(config.app.port, () => {
  console.log(`🚀 Servidor rodando na porta ${config.app.port}`);
});
