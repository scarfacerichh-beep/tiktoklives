# 4.1.0 — 09/11/2026

- Primeira curtida gera agradecimento por nome, sem esperar 100 curtidas.
- Voz pt-BR local opcional: curtidas, seguidores, compartilhamentos, votos e comentários livres.
- Confirmação da letra com frases variadas, sem antecipar correção; narração opcional e convite quando o chat está parado.
- Fila limitada, validade curta, cooldowns, seleção de voz/volume/velocidade, botão de teste e concessão para uma única aba de áudio.
- Ranking por acertos, pontos como desempate e migração sem inventar acertos antigos.
- Baús cosméticos gratuitos a cada 5 acertos, revelados no intervalo, com aura, estrela, selo ou confetes.
- Persistência JSON em UTF-8 para nomes com emojis no Windows.
- Testes adicionais de voz simulada, moderação, ranking, conquistas, retomada e ausência de voz instalada.

# 4.0.0 — 09/11/2026

- Preservada identidade INTERALIVES, opções em quatro cores, cronômetro, placar e presentes opcionais.
- Estado e prazos transferidos para servidor local autoritativo. Painel e visor sincronizados por SSE, com snapshot inicial e reconexão; motor independe de animação da aba.
- Ranking por ID de conta, primeira resposta única por rodada, bônus de rapidez sem vantagem de presentes.
- Adaptador TikFinity separado, reconexão exponencial, concessão para um painel, lotes limitados e descarte de eventos atrasados de outra rodada.
- Mapeamento por ID, combos finais deduplicados, caps de tempo/dica, cooldowns e fila visual limitada.
- Banco de 122 perguntas: precedência, parênteses, porcentagens, quadrados, progressões, raciocínio verbal, relógios, semanas, memória e curiosidades. Soluções calculadas e revelação explicada.
- Palco 1080 × 1920, Inter local, escala proporcional, CTA legível, tipografia ajustada ao texto, áreas sem sobreposição e movimento reduzido.
- Pausa, retomada, parada, reset, nível, intervalo, persistência opcional e moderação.
- MP4 local autorizado compartilhado com o visor; timing por fase, mute e transição suave, sem cobrir perguntas.
- Inicializador Windows nativo x64 e Python portátil, com diagnóstico de porta ocupada.
- Testes unitários, E2E Chromium, simulador WebSocket, capturas e ensaios de estabilidade. Limitações e resultados no relatório final.
