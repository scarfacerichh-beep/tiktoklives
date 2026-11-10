# Validação 4.4 — arena viva e voz suave

## Implementado

Mascote CSS com flutuação, piscadas e reação a atividade recebida; nome do visitante e iniciais na alternativa; mensagens de agradecimento a comentários, votos, curtidas e seguidores, mesmo sem áudio. Feed limitado a 12 eventos, retenção de 12 segundos, sem fabricar público. Votos repetidos não criam nova reação. Conteúdo de nomes é inserido via textContent. Modos reduzido/desligado e pausa interrompem o movimento contínuo. Paletas, ticker, baús cosméticos e regras existentes preservados.

Voz local com padrão mais lento (0,94) e volume 0,75. Voz natural online opcional Francisca/Antônio, com edge-tts 7.3.1, sem chave/assinatura. Autorização por aba, checkbox inicialmente desmarcado, concessão exclusiva renovada antes de cada fala, cancelamento ao silenciar e ao mudar de fase/rodada. Não envia comentários livres: envia só frases prontas e apelidos. Cache de áudio limitado a 16 entradas/3 MB, expiração de 120 segundos, somente em memória. TLS verificado; timeout e indisponibilidade explícitos, sem trocar silenciosamente para voz local. Instalação opcional separada pelo PyPI.

Versão V4.4 no visor, conferência de versão do backend/JS/CSS no painel e endereço atual copiável. Porta alternativa quando a anterior estiver ocupada, sem encerrar outros programas; mesma instalação/versão aberta é reutilizada. O OBS precisa usar o endereço atual mostrado no painel.

## Evidências

- **51 testes Python aprovados**, incluindo feed visual, voto único com voz desligada, limites de cache, ausência da dependência, concorrência, autorização HTTP e reutilização de instância/erro de porta.
- **20 testes JavaScript aprovados**, incluindo narração local, fila, deduplicação, cancelamento, erro online sem fallback e mensagens por fase.
- **20 verificações E2E**: comentários/pontuação por ID, combos, presentes por ID, WebSocket simulado/desconexão/reconexão, pausa, recuperação do visor, 122 perguntas sem overflow/repetição, reset e origem externa rejeitada.
- **15 verificações de engajamento**: curtida/seguir/voto/comentário por nome, exclusividade entre abas, baú por 5 acertos e ranking nas 3 resoluções. API de fala local simulada: não equivale a ouvir SAPI em Windows.
- **17 verificações de movimento** e **19 verificações de ticker**: votos, rodada, ranking, revelação, limites, preferências, paletas, coerência na memória/pausa e sem erros JS.
- Novo E2E 4.4: mascote, voto nominal, curtida, seguidor, comentário livre, desativar reações, versão correspondente, consentimento inicialmente desmarcado, solicitação de áudio somente após ativar e cancelamento ao retirar consentimento. Endpoint de áudio interceptado com MP3 genérico real, para não enviar dados de espectadores no teste.
- Mídia/fases: MP4 de teste, exclusividade do adaptador, revelação/pausa, memória e upload inválido aprovados.
- **Capturas reais em 1080×1920, 540×960 e 360×640**, sem overflow horizontal ou mascote cobrindo o card. Prévia MP4 gravada da aplicação com eventos simulados, sinal TESTE visível.
- **180 frames sem gravação** no Chromium Linux, média 16,67 ms/frame (~60 FPS), máximo 16,8 ms. Gravar vídeo pode reduzir essa taxa. Não é benchmark do PC Windows do usuário.
- Síntese real pelo módulo NaturalVoice: Francisca, taxa 0,92, 38.880 bytes, 6,48 segundos de áudio, preparação 0,94 segundo nesta execução. Frase genérica, sem dados de visitantes. Disponível em VOZ_NATURAL_AMOSTRA.mp3. Geração de arquivo verificada; qualidade subjetiva deve ser ouvida pelo usuário.
- Porta ocupada por outro serviço: servidor escolheu outra porta e mostrou URL correta. Mesma instalação aberta: inicializador reutilizou a instância.
- Simulação acelerada de **3.600 segundos/64.800 eventos/125 rodadas**, memória de pico ~2,72 MB por tracemalloc. Não substitui teste de uma hora real com TikTok.

## Limites

Não há Windows, Microsoft Defender ou sessão TikTok real disponíveis neste ambiente. Duplo clique dos BATs, instalação de dependências em Windows, áudio audível no PC, captura OBS/Studio e eventos da conta real precisam ser conferidos no PC do usuário. O serviço online utilizado por edge-tts é opcional e pode mudar/ficar indisponível. Não é uma integração com SLA oficial Azure.

Esta distribuição é código-fonte para Windows com Python 3.11+ instalado separadamente, sem EXE/DLL/PYD nem runtime embutido. Não houve scan antivírus nem certificação de segurança. O alerta do pacote nativo 4.3 permanece sem causa confirmada; não restaure o arquivo bloqueado nem desative proteções.

## Reproduzir

Python: `python -m unittest discover -s tests -v`.

Browser: `npm ci`, iniciar `python mock_tikfinity.py` e `python servidor.py --port 8790`. Em terminais separados, executar sequencialmente `npm run test:e2e`, `npm run test:engagement`, `npm run test:motion`, `npm run test:ticker`, `npm run test:party` e `node tests/media-and-phases.cjs`. Os testes modificam a sessão e são para uso fora da LIVE. Defina ARENA_URL para outra porta. No Windows, defina CHROMIUM com o caminho do Edge e PYTHON como python; os novos scripts também aceitam CHROMIUM.
