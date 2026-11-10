> Relatório histórico de uma edição anterior. Os pacotes nativos estão suspensos após alerta de antivírus. Para iniciar a edição atual, use [COMECE_4.4.md](COMECE_4.4.md).

# INTERALIVES QI ARENA STUDIO 4.1.0 — Voz e conquistas

09/11/2026. Atualização solicitada após uso na LIVE, para agradecer por nome, responder ao chat e valorizar o ranking. O usuário escolheu expressamente recompensas visuais, não presentes reais.

## O que mudou

- Reproduzido na versão 4.0: uma curtida isolada não produzia agradecimento; era necessário acumular 100. Não existia síntese de voz.
- A primeira curtida agora recebe agradecimento nominal. Seguidores e compartilhamentos também são reconhecidos por nome.
- Uma resposta A/B/C/D aceita gera confirmação falada com nome e letra; frases como “Ana, você tem certeza que é a D?” aparecem tanto para respostas certas quanto erradas, sem anunciar a correção antes da revelação.
- Comentários livres recebem um convite para participar. O conteúdo livre não é lido em voz alta; não há modelo de IA respondendo perguntas abertas.
- Narração de início/revelação e um convite com chat parado, opcionais. O botão Ativar e testar voz libera áudio e oferece uma frase de teste explícita, sem inventar um participante.
- Voz local em português no navegador do painel, com seletor, velocidade, volume e mute. Nenhum serviço de voz pago, chave ou voz clonada. O usuário precisa instalar uma voz pt-BR no Windows e capturar o áudio do painel no OBS/Studio.
- Ranking por número de acertos; pontos de rapidez como desempate. Dados antigos preservam pontos, mas não recebem acertos inventados.
- A cada 5 acertos, um baú cosmético gratuito: aura, estrela, selo ou confetes. Anúncio na revelação, tratamento visual do cartão no Top 3 e contagem de conquistas no Top 10. Não representa presente TikTok, dinheiro ou prêmio com valor real.
- Arquivo de sessão salvo em UTF-8, com leitura de arquivos antigos em Windows-1252, para preservar nomes acentuados e emojis.

## Validação desta atualização

- **38 testes Python aprovados**, incluindo votação, estados, persistência/migração, matemática, primeira curtida, frases nominais, moderação antes da voz, ranking por acertos, baús únicos, prioridade visual e limites de filas.
- **10 testes JavaScript da fila de voz aprovados**: deduplicação de snapshots, expiração, mudança de rodada, fila limitada, ausência de voz local, mute/reativação, concessão e autorização atrasada.
- **20 verificações E2E de regressão em Chromium aprovadas**, com WebSocket simulado real, banco de 122 questões e três resoluções.
- **15 verificações E2E de engajamento aprovadas**: curtida nominal, seguir, voto, comentário, exclusividade de áudio, transferência entre abas, conquista aos 5 acertos, visualização no visor e três resoluções.
- **6 verificações de mídia/estados aprovadas**, preservando MP4, memória, revelação, movimento reduzido e rejeição de upload inválido.
- O teste de voz em JavaScript/Chromium usa uma **API de síntese simulada**, conferindo o texto enviado e o roteamento. O Chromium deste Linux tem **zero vozes locais em português**; a interface informou corretamente que não poderia reproduzir voz.
- Ensaio acelerado: **3.600 segundos virtuais**, **64.800 eventos**, **125 rodadas**. Alocações Python rastreadas próximas de 2,4 MB no final e 2,7 MB de pico; não é medida da memória total do navegador/processo.
- Smoke test HTTP de **120 segundos reais**, com eventos simulados, separado do teste de áudio. Uma hora real contínua não foi executada.
- Capturas em 1080 × 1920, 540 × 960 e 360 × 640, incluindo baú visível e ranking com acertos. O aviso não cobre pergunta nem alternativas.

## Limites e operação

A reprodução audível em Windows e a captura no OBS/TikTok Studio continuam dependendo de teste no PC do usuário. O executável Windows foi compilado e inspecionado em Linux, sem execução nativa neste ambiente. TikFinity LIVE real não foi acessado aqui. Os testes não comprovam que o PC do usuário tem voz pt-BR instalada.

Fila de voz: até quatro falas esperando, validade de 12 segundos, um narrador por vez. Concessão de áudio conferida antes de cada fala; heartbeat e limite de duração evitam eco entre abas. Se uma aba fechar inesperadamente, pode ser necessário esperar até 25 segundos antes de ativar outra. Recarregamento ou queda do servidor pede reativação explícita.

Em avalanche, agradecimentos e falas podem ser descartados/agrupados, preservando votos e acertos dentro dos limites de capacidade existentes. Curtidas e seguidores têm cooldown de 30 segundos por conta/tipo; comentários livres, 40 segundos. Confirmação de voto tem cooldown, primeira resposta única e expira na troca de rodada. Recompensas têm prioridade na fila visual, com aviso de 5,5 segundos. A fila de anúncios de baús guarda até 32 conquistas por rodada; o contador por participante não depende de haver espaço no anúncio.

## Instalar e conferir no Windows

1. Feche a versão antiga, incluindo a janela do servidor. Extraia o ZIP 4.1 em uma pasta nova. Para preservar ranking/configurações, copie `session.json` da pasta antiga, com ambos os servidores fechados. O formato antigo pode manter pontos, mas não pode recuperar a quantidade de acertos passados.
2. Abra `INTERALIVES_QI_STUDIO.exe`. Abra o painel no Edge e escolha uma voz local pt-BR. Clique **Ativar e testar voz**. Confirme que escutou.
3. Use os botões de teste com um nome: uma curtida, seguir, comentário e D. A faixa do visor mostrará TESTE; depois selecione TikFinity real e valide esses eventos na sua LIVE.
4. No OBS/Studio, capture o áudio do navegador do painel ou do sistema. Não espere voz da fonte do visor; evite duas capturas do mesmo áudio. Recomendamos intervalo de revelação de 10 segundos.
5. Confira 5 acertos para um participante, anúncio de baú visual e cartão com cosmético. Baús não enviam presentes reais.

Resultados brutos e capturas no diretório `evidence/` do ZIP. O relatório da versão 4.0 foi mantido como registro histórico em `docs/RELATORIO_FINAL.md`.
