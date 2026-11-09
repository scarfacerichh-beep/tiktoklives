# TAREFA CODEX — FINALIZAR INTERALIVES QI ARENA STUDIO

**Pedido do usuário:** "Passe esse jogo para o Codex terminar o desenvolvimento dele". O software já existe: não crie outro produto aleatório nem abandone a estética do projeto. Faça uma revisão profissional completa, preservando e evoluindo a V3.

## Prioridade P0 — estabilidade e interação real
1. Audite `index.html` e `servidor.py`: encontre bugs e gargalos, corrija estados de partida (idle, preview, start, pergunta, revelação, intervalo), cronômetro sincronizado, timer correto ao trocar de aba e ao reconectar. A tela de LIVE não pode depender de polling a cada 170ms para permanecer correta; prefira eventos, snapshots pontuais e sincronização robusta. Evite disparos duplicados e corridas de estado.
2. Separe claramente modo `PAINEL` vs `LIVE` vs `TESTE`. Endpoints e inicialização confiáveis com link simples. Operador inicia/pausa/retoma/reset, configura duração, velocidade, níveis, audio, moderação e modo automatico. Visor não recebe controles administrativos.
3. Integração TikFinity Desktop por WebSocket local `ws://localhost:21213/` com reconexão exponencial, status visível, sanitização, evento `chat`, `gift`, `follow`, `like`, `share` e logs úteis. Suportar nomenclaturas reais de presentes via ID configurável, sem assumir tradução de nomes. Deduplicar presentes repetidos/combo pelo formato de evento observado. Desacoplar adapter do jogo. Mock local para testar sem live.
4. Pontuação correta: cada conta/ID vota uma vez por rodada (ou regra claramente documentada), normalização A/B/C/D, feedback coletivo, bônus de rapidez consistente; ranking top 3 / top 10 e persistência segura conforme escolha do usuário. Corrigir apelidos longos, emojis, acentos, spam e usuários repetidos.
5. Proteções contra spam: fila de agradecimentos, cooldown por usuário/evento, limitar eventos em avalanche sem perder resultado da rodada.

## Prioridade P1 — interface premium de LIVE
6. Layout **nativo 1080 × 1920** (não upscale de preview 540×960) e painel desktop independente. Imagem nítida, margens para cabeçalho e overlays de chat/presentes do TikTok, fontes legíveis no celular. Estética profissional com Inter (fallback local adequado), hierarquia visual impecável; evite fundo vazio gigantesco, fonte pesada comprimida, textos minúsculos, excesso de cards e blocos competindo com a pergunta.
7. Explicação de COMO JOGAR sem poluição: sequência de 3 passos `LEIA → COMENTE A/B/C/D → ACERTE E PONTUE`, um CTA dominante, regras dos poderes opcionais visíveis apenas no espaço certo e ranking; tudo compreensível em 2 segundos. Na tela: marca, convite, progresso/dificuldade, questão, opções, contador, CTA, tempo, ranking, efeitos presentes.
8. Animação refinada e fluida: transições, entrada de perguntas, revelação correta, ranking mexendo de posição, contador de tempo, confete moderado, respostas recebidas em tempo real, alerts com nickname de quem presenteou/seguiu, som discreto opcional. Respete `prefers-reduced-motion`. Não use animações que distraiam ou cubram a pergunta durante a contagem.
9. Layout e renderização real: Playwright screenshots em 1080x1920 e 540x960, sem overflow, sem faixas pretas, sem elementos ocultos em telas capturadas. Testar OBS Browser Source e captura de Brave/TikTok Live Studio (instruções de resolução/FPS).

## Prioridade P2 — engajamento e conteúdos
10. Banco de pelo menos 120 questões verificadas de matemática, lógica, padrões, memória e curiosidades, com dificuldade crescente, resposta unívoca, 4 alternativas distintas, dica correta, solução curta; não repetir na mesma sessão antes de esgotar ciclo. "QI" deve ser descrito como desafio recreativo.
11. Sistema de poderes de presentes opcionais: Rosa +3s (max +9 por rodada), TikTok 1 dica coletiva/rodada, especial efeitos cosméticos; IDs mapeáveis no painel, cap e cooldown, sem vantagens pagas que excluam o público. Seguidores/curtidas com agradecimento elegante; compartilhamento com mensagem rápida, sem pedir pagamento.
12. Quando o chat estiver parado, exibir CTA e um desafio divertido rápido sem interromper rodada; retenção orgânica (novato entende o jogo a qualquer momento). Misturar modos de pergunta e intersticiais curtos.
13. Modo apresentadora virtual opcional: suporte a MP4 fornecido pelo usuário (abertura, resposta, intervalo), com controles de timing, mute/crossfade, mantendo perguntas visíveis e sem depender de gerar vídeo novo. Os vídeos devem ser de uso autorizado. Não simular agradecimentos personalizados com vídeo pré-gravado; usar TTS pt-BR local opcional com anti-spam caso incluído.

## P3 — engenharia e release
14. Refatoração em arquivos separados se necessário, `README.md`, `AGENTS.md`, mapeamento de eventos, automação de teste e script de início Windows robusto. Não quebrar launch via `.bat`. O usuário vai extrair ZIP e clicar para abrir.
15. Suite de testes end-to-end com Playwright ou equivalente: comentários A/B/C/D; múltiplos usuários; placar; presentes; reset; desconexão WS; reconexão; aba visor aberta depois do painel; período sem espectadores; memoria visual. Testes devem rodar em ambiente sem TikTok real, usando simulador local.
16. Entregar release versionado (`INTERALIVES_QI_STUDIO_FINAL.zip`) mais visualizações de tela e documento claro: o que está realmente pronto e o que precisa do TikFinity na LIVE real.

## Fluxo esperado do Codex
- Primeiro reproduza e registre bugs relevantes.
- Implemente P0, P1, P2 e testes; corrija até passar.
- Faça screenshots do jogo e compare com referência visual existente. Ajuste hierarquia e safe zones até ficar profissional.
- Finalize com lista de mudanças, comandos para executar, instruções OBS/TikTok e limitações verificadas.
- Não pare em "posso fazer" ou em meros planos: produza código, testes e pacote final.
