# INTERALIVES QI ARENA STUDIO 4.2 — Arena neon

Atualização de 09/11/2026, solicitada para dar mais cor e movimento ao jogo existente. Estrutura e mecânica foram preservadas, incluindo voz local, TikFinity, ranking por acertos e conquistas cosméticas.

## Mudanças verificadas

- Paleta por alternativa e categoria, mantendo texto branco de alto contraste e a identidade azul/ciano.
- Faixas de luz de movimento lento, sem grandes desfoques animados; brilho de fundo usa gradientes.
- Entrada das perguntas e alternativas; pulsos em respostas recebidas e no contador, com limite de frequência.
- Mudanças de posição no ranking acompanham o ID estável da conta. Apelidos iguais não compartilham identidade.
- Resposta correta recebe cor e marca visual na revelação. Confete aparece no espaço inferior; pergunta e opções ficam livres.
- Cronômetro circular sincronizado com o prazo do servidor. Reação nos últimos 5 segundos sem piscadas de tela inteira.
- Baú ilustrado somente quando há conquista visual; partículas limitadas a 30, removidas após 2 segundos.
- Modos vibrante, suave e desligado. Preferência do sistema por movimento reduzido prevalece; pausa congela movimento ambiente.
- Snapshots repetidos não reiniciam os efeitos de votos. Nenhum voto ou espectador é inventado para produzir movimento.

## Testes

- **40 testes Python aprovados**: regressão da mecânica/voz/conquistas, persistência do modo visual e identidade de participantes no ranking.
- **10 testes JavaScript da fila de voz aprovados**, preservando os controles da versão 4.1.
- **20 verificações E2E de regressão aprovadas**, incluindo as 122 questões no renderizador.
- **15 verificações de engajamento aprovadas**, com voz simulada, TikFinity por WebSocket mock e baú conquistado.
- **6 verificações de mídia/estados aprovadas**, incluindo MP4, memória, revelação e movimento reduzido.
- **17 verificações de movimento aprovadas**: evento real dispara pulso, snapshot repetido não repete, rodada entra, líder muda de posição, modos sincronizam, sistema reduz movimento, pausa congela, baú exige conquista e partículas permanecem limitadas.
- Capturas reais em **1080 × 1920**, **540 × 960** e **360 × 640**, sem corte de pergunta/alternativas nem colisão de dica com a seção de poderes.
- Gravação da aplicação em execução com dados **SIMULADOS**, claramente identificados no visor. Não é ilustração nem vídeo de TikTok LIVE real.
- Ensaio da engine: **60 minutos virtuais**, **64.800 eventos**, **125 rodadas**, com filas e mapas limitados. Não equivale a uma hora real de navegador/OBS.

## Desempenho e limites da medição

O primeiro perfil com movimento de grandes elementos desfocados ficou perto de 20 FPS no Chromium Linux, sem gravação. Os desfoques foram substituídos por gradientes estáticos e faixas menores que se movem por transformações; a passagem de luz deixou de animar posição de layout.

Após otimização, uma amostra de 90 quadros em 1080 × 1920, sem gravador, apresentou intervalo médio próximo de 16,6 ms, aproximadamente 60 FPS neste ambiente. O registro com gravador tem custo adicional e é informado separadamente em `evidence/motion-summary.json`. A amostra é curta e não representa certificação de desempenho em Windows, OBS ou TikTok Studio. Use 30 FPS na captura e modo suave/desligado se necessário.

## Itens ainda dependentes do PC do usuário

Execução nativa do novo pacote Windows, voz pt-BR audível, áudio capturado pelo Studio/OBS, sessão TikFinity LIVE real, sobreposição dos controles da conta TikTok e uma hora real contínua não foram homologados neste Linux. O inicializador Windows foi compilado para x64 e inspecionado; o servidor do ZIP extraído foi verificado em Linux.

O relatório da versão 4.1 descreve a voz local e a captura do áudio do painel. Não foi incluída voz em nuvem ou API paga. Baús continuam sendo efeitos visuais gratuitos, sem presentes TikTok ou valor real.

## Atualização

Feche a versão antiga e extraia o ZIP 4.2 em uma pasta nova. Abra `INTERALIVES_QI_STUDIO.exe`; para conservar ranking/configurações, copie `session.json` da pasta anterior com os dois servidores fechados. Abra o painel pelo Edge, ative/teste a voz se desejar e inicie rodadas. Experimente Vibrantes/Suaves/Desligadas no painel; a fonte do visor continua `/?live=1`, em 1080 × 1920.

Resultados brutos e capturas estão em `evidence/`; a prévia está em `docs/ARENA_4.2_PREVIA.mp4`. Relatórios anteriores foram mantidos como histórico.
