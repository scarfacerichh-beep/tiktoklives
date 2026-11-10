# 4.4 — arena viva e voz suave

- Mascote, reações visuais nominais e cores nas alternativas.
- Voz natural opcional Francisca/Antônio com autorização por aba; voz local mais lenta.
- Versão visível, verificação dos arquivos e porta alternativa para evitar servidor antigo.
- Código-fonte sem EXE; instalação opcional de edge-tts separada.
- 51 testes Python, 20 JS e suites de navegador. Veja RELATORIO_4.4.md.

# 4.3.1 — distribuição em código-fonte

- Suspensos os ZIPs com inicializador compilado após bloqueio por antivírus reportado pelo usuário; causa ainda não determinada.
- Edição sem executável nativo/runtime embutido, usando Python instalado pelo site oficial.
- Scripts de inicialização legíveis que recusam misturar a edição com o executável antigo.
- Aviso de distribuição distingue testes funcionais de validação antivírus.

# 4.3.0 — 09/11/2026

- Faixa superior de mensagens com rolagem contínua: comentar, curtir, seguir e convidar amigos.
- Textos adequados para espera, pergunta, memória, urgência, revelação e pausa.
- Marca de simulação fixa; snapshots e votos não reiniciam a faixa.
- Quatro paletas mais coloridas, com modo Festa que varia por rodada.
- Velocidade configurável, opção estática e respeito a movimento reduzido.
- Corrigida a recepção de eventos sociais entre rodadas, preservando proteção de votos e poderes atrasados.
- Testes de texto, persistência, rolagem real, fases, clones limitados, três resoluções e regressões do jogo.

# 4.2.0 — 09/11/2026

- Nova paleta neon, com alternativas violetas, ciano, rosa e douradas, e acentos por categoria.
- Fundo com faixas lentas, sem grandes filtros de desfoque animados.
- Entrada de perguntas e alternativas, reação a votos reais, troca de posições no ranking e revelação da resposta correta.
- Cronômetro circular, reação discreta nos últimos 5 segundos e CTA com passagem de luz.
- Baú cosmético ilustrado e confetes limitados, no espaço inferior do visor.
- Controle de movimento vibrante/suave/desligado, pausa e preferência de movimento reduzido.
- Identidade estável por conta nas animações do ranking, incluindo apelidos iguais.
- Testes de movimento, três resoluções, gravação real da aplicação e medição local de desempenho.

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
