const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

// Configuração do servidor Express
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Rota para lidar com o download do vídeo
app.post('/YTDweb/download', async (req, res) => {
  try {
    const videoUrl = req.body.videoUrl;
    if (!ytdl.validateURL(videoUrl)) {
      return res.send('URL inválida do YouTube.');
    }

    const info = await ytdl.getInfo(videoUrl);
    if (!info || !info.videoDetails || !info.videoDetails.title) {
      return res.send('Erro ao obter informações do vídeo.');
    }

    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
    ytdl(videoUrl, { format: 'mp4' }).pipe(res);
  } catch (error) {
    console.error('Erro ao baixar o vídeo:', error);
    res.send('Ocorreu um erro ao baixar o vídeo.');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
