# INTERALIVES QI ARENA STUDIO 4.3 — Festa colorida

09/11/2026. Evolução da arena existente para acrescentar cor e convites automáticos à interação, preservando perguntas, TikFinity, voz local, acertos, baús e controles.

## Implementado

- Faixa superior contínua, com dois grupos de texto para repetir sem intervalo vazio. Convites para responder, curtir, seguir e chamar alguém para jogar.
- Textos orientados pela fase: memória pede concentração, pergunta pede letra, últimos segundos avisam do prazo, revelação orienta a conferir a solução. A pausa mostra uma mensagem estática. Na espera/preparação, a faixa continua rolando.
- Frases sobre baús são mostradas somente quando as conquistas visuais estão habilitadas. Não há promessa de dinheiro ou presente TikTok.
- Marca TESTE fixa, independente do texto rolante. Não há contadores de público inventados.
- Snapshot repetido não reinicia a faixa; mudanças de fase/rodada alteram os textos. Não há novo temporizador periódico em JavaScript: a faixa usa transformação CSS, e o relógio existente só verifica mudança de contexto.
- Paletas Rosa cósmico, Oceano neon, Pôr do sol e Elétrico; modo Festa alterna por rodada. Texto e alternativas continuam legíveis, em superfícies escuras.
- Configuração sincronizada e persistente da paleta, velocidade e ativação da faixa.
- Movimento desligado e preferência por movimento reduzido mantêm um convite estático. A duplicação visual é ocultada da leitura assistiva.
- Corrigido um caso encontrado na regressão: eventos sociais recebidos entre a troca da rodada e a atualização do painel podiam ser descartados como se fossem votos atrasados. Curtidas/seguidores/compartilhamentos não ficam presos à rodada anterior. Votos e presentes continuam protegidos contra aplicação atrasada em outra rodada; comentários livres não precisam ser vinculados ao prazo de votação.

## Testes desta versão

- **43 testes Python aprovados**, incluindo mecânica, banco, persistência/migração, voz, baús, paletas e recepção de curtida na troca de rodada.
- **18 testes JavaScript aprovados**: 10 da fila de voz e 8 da seleção contextual de mensagens/paletas.
- **19 verificações E2E da faixa aprovadas**: deslocamento real do texto, velocidade, modo estático, movimento reduzido, paletas distintas, marca TESTE fixa, fases coerentes, dois grupos constantes e três tamanhos de tela.
- Regressão: **20 verificações E2E do jogo**, **15 de engajamento**, **6 de mídia/estados** e **17 de movimento**, aprovadas em Chromium/Linux.
- As 122 questões foram percorridas no renderizador sem transbordamento. Capturas reais em **1080 × 1920**, **540 × 960** e **360 × 640**, sem colisão entre faixa/instruções ou pergunta/alternativas.
- Gravação real da aplicação, com eventos claramente marcados como **SIMULADOS**. Não é captura de uma LIVE TikTok real.
- Amostra local de **120 quadros**, em 1080 × 1920, com pergunta ativa e faixa rolando, sem gravação: intervalo médio de aproximadamente **16,5 ms**, perto de 60 FPS neste ambiente. Amostra curta; não garante desempenho equivalente em Windows/OBS/Studio.
- Ensaio da engine: **3.600 segundos virtuais**, **64.800 eventos** e **125 rodadas**, com estruturas limitadas. Isso não representa uma hora real de navegador ou transmissão.

## Limites preservados

O inicializador Windows é compilado para x64 e inspecionado em Linux. A execução nativa do novo pacote, a voz pt-BR audível, a captura de áudio pelo OBS/Studio, uma sessão TikFinity real e uma hora real contínua dependem de homologação no PC do usuário. Testes de voz automatizados usam a API de fala simulada; não comprovam que o Windows tem voz em português instalada.

A fila de voz, os cooldowns e os limites de votos/ranking/partículas continuam os da versão anterior. A faixa não lê texto livre do chat e não chama serviços pagos. Baús são efeitos visuais gratuitos, sem valor real.

## Atualização

Feche a versão antiga, extraia o ZIP 4.3 em uma pasta nova e abra `INTERALIVES_QI_STUDIO.exe`. Para manter configurações/ranking, copie `session.json` com os dois servidores fechados. No painel, escolha Paleta da arena, Mensagens de interação rolando e velocidade. Inicie rodadas para ver os textos mudarem de fase. A fonte do visor permanece `/?live=1`, em 1080 × 1920.

Ative e teste a voz pelo Edge se desejar; capture o áudio do navegador do painel ou do sistema. Os convites rolantes são visuais e não geram fala adicional.

Capturas e resultados em `evidence/`; prévia em `docs/ARENA_4.3_PREVIA.mp4`. Relatórios anteriores ficam como histórico.
