# Luna — migração para apresentadora e painel em nuvem

## Pedido e estado real

A exigência agora é vídeo de personagem com voz, sincronização labial e movimentos faciais/corporais. Não basta transformar a fotografia por CSS. Voz e processamento não devem depender das vozes do Windows, de Python/BAT nem de TikFinity em localhost.

O Site publicado continua sendo a versão 0.2. **Não foi substituído por uma integração em nuvem incompleta.** A versão 0.2 não atende ao novo aceite de avatar animado; sua voz depende do navegador e sua ponte usa TikFinity local.

## Preparado neste trabalho

- Descoberto o plugin HeyGen, capaz de gerar vídeo falante a partir da imagem aprovada. Conexão solicitada; não confirmada. Ainda não há render de avatar, conta/API conectada ou sessão em tempo real iniciada.
- `cloud/broker.mjs`: módulo de backend para tokens de avatar LiveAvatar e de eventos TikTools. Não é frontend, não está publicado nem conectado à versão 0.2. Chaves mestras nunca são devolvidas ao navegador.
- Nenhum endpoint funciona sem a função de autorização do futuro painel. Origem de requisições, consentimento, canal permitido e limite de corpo são verificados; erros não expõem respostas/segredos do fornecedor. Flags de ativação começam desligadas.
- Avatar: criação de token LITE com avatar explicitamente configurado, sandbox como padrão e sessão inicial limitada a 60 segundos. **Isso não cria o avatar da Luna, sintetiza voz nem inicia vídeo por si só.** Ainda faltam provisionamento do avatar, transporte de áudio/LiveKit e integração completa do player.
- Eventos: token temporário de 120 segundos, um WebSocket e um canal previamente configurado. Nenhuma conexão com LIVE real foi executada.
- 10 testes passaram com provedores simulados, sem consumo externo. Eles cobrem autenticação obrigatória, configuração ausente, consentimento, origem, restrição de canal, tokens, erros e ausência de vazamento de chaves. Não demonstram funcionamento com contas reais dos provedores.

## Primeira amostra da Luna

Imagem aprovada: `static/luna/luna.png`, personagem fictícia gerada e aprovada pelo usuário. Usar a identidade dessa Luna, sem voltar à identidade da foto inicial de referência.

Formato: MP4 vertical 1080×1920, 20–30 segundos, câmera fixa. Luna deve falar de verdade no vídeo gerado, piscar naturalmente, mover sutilmente cabeça e ombros e fazer um gesto discreto de boas-vindas com uma das mãos. Preservar o rosto, figurino roxo/dourado, mesa e cartas; manter anatomia correta. Áudio pt-BR feminino, suave, acolhedor, inteligível, sem música de fundo e sem acelerar demais. Sem promessas de previsão factual ou incentivo a pagar para obter resultados.

Roteiro:

> Olá, eu sou a Luna. Que bom ter você aqui! Respire com calma e pense em uma pergunta. Agora escolha a carta um, dois ou três e escreva sua escolha no chat. Vamos descobrir uma mensagem simbólica para refletir juntos. Seja bem-vindo à nossa roda de cartas.

Aceite da amostra: arquivo com vídeo e áudio reproduzíveis; boca acompanhando o áudio; rosto e corpo com movimento gerado; identidade consistente; apresentação sem tarjas que cubram rosto/mãos/cartas. A amostra precisa ser gerada e inspecionada antes de afirmar que o avatar está pronto.

## Uso durante a LIVE

Vídeo gravado de abertura e avatar de resposta em tempo real são serviços distintos. O plugin HeyGen pode ajudar na produção dos vídeos, mas sua conexão não provisiona automaticamente LiveAvatar/API de produção nem a fonte de eventos da LIVE.

O painel pretendido deve manter módulos de jogos, salas de LIVE, voz/avatar, fila de interações e configuração de provedores no servidor. Cada sala terá sua própria configuração e fonte de eventos. A interface do navegador controla a sessão online e o visor recebe vídeo/estado pela rede, sem depender de BroadcastChannel entre abas de um PC.

Os eventos de entrada, seguir, curtir e presentes precisam chegar por uma fonte em nuvem. Somente eventos com identidade real podem gerar agradecimento nominal. A contratação/conta e credenciais desses fornecedores ainda não estão disponíveis; nenhum plano pago foi contratado ou ativado por este trabalho.

## Configuração futura, sempre como segredo do servidor

- `LIVEAVATAR_API_KEY`, `LIVEAVATAR_AVATAR_ID`, `LUNA_AVATAR_ENABLED`, `LUNA_AVATAR_SANDBOX`.
- `TIKTOOLS_API_KEY`, `LUNA_TIKTOK_USERNAME`, `LUNA_LIVE_ENABLED`.

Não colocar essas chaves no HTML, JavaScript público, Git ou chat. A função `authorize()` deve validar a sessão real do proprietário do painel antes de encaminhar requisições. Não ativar um serviço somente porque há uma chave: os limites de uso, custo e consentimento do fluxo precisam estar definidos.

## Referências consultadas

- [HeyGen Avatar IV](https://www.heygen.com/blog/announcing-the-avatar-iv-api): geração de vídeo a partir de foto e roteiro.
- [LiveAvatar](https://www.liveavatar.com/) e [criação de sessão](https://liveavatar.readme.io/reference/create_session_token_v1_sessions_token_post): avatar em tempo real, separado da produção de clipes.
- [TikTools](https://tik.tools/docs): eventos via WSS e emissão de JWT por canal.
