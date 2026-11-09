# Relatório de entrega — INTERALIVES QI ARENA STUDIO 4.0.0

Data: 09/11/2026. Origem: `INTERALIVES_QI_CODEX_PRONTO.zip`. Os documentos do ZIP foram tratados como requisitos do projeto, subordinados ao pedido do usuário. Nenhuma instrução de publicação remota foi inferida. A busca no GitHub por INTERALIVES não identificou repositório acessível para este projeto; a entrega é local, sem commit/push remoto.

## Resultado

Implementação funcional, testes automatizados e pacote Windows portátil produzidos. **Não é uma homologação em TikTok LIVE real ou Windows nativo.** Abaixo estão os limites exatos da validação.

## Falhas encontradas

| Evidência | Estado original | Correção |
|---|---|---|
| Reproduzido no navegador, saída `{players:1,votes:2}` | Duas contas com mesmo apelido tinham ranking fundido | Pontuação por ID e nickname apenas para apresentação |
| Banco original inspecionado e executado | 20 perguntas | 122 questões em cinco categorias, com soluções e ciclos sem repetição |
| Inspeção de `setupSynchronization` | Snapshot de DOM a cada 170 ms por BroadcastChannel; dependência do perfil do navegador | Estado no servidor e SSE entre navegadores/OBS |
| Inspeção do motor original | Transições dependiam de requestAnimationFrame do painel | Relógio monotônico no servidor e prazos autoritativos |
| Inspeção do adaptador original | Regex de nomes ativava poderes mesmo com ID diferente | Apenas IDs configurados; estado de conexão separado de eventos |
| Primeiro E2E visual da nova versão | Texto de uma pergunta de curiosidades transbordava | Ajuste tipográfico e encaixe automático; banco inteiro revalidado |
| Teste adicional de avalanche | Curtidas pequenas podiam acumular cooldowns antes da limpeza | Limpeza antes do retorno e teste com 5.000 contas |

`evidence/antes.png` é captura real da aplicação original. `docs/REFERENCIA_UX_ANTES.png` foi inspecionada para preservar a identidade azul/ciano, cartas de alternativas e cronômetro. As capturas finais são do aplicativo executado, não ilustrações.

## Testes realizados

- **18 testes unitários aprovados**: IDs, primeiro voto, prazos, pausa/retomada/parada, reset, combos, caps, dicas, correspondência por ID, memória, banco completo, cálculos matemáticos independentes, persistência/corrupção, moderação, duração por rodada, eventos atrasados e memória limitada.
- **20 verificações E2E aprovadas em Chromium no Linux**, com servidor HTTP e WebSocket de simulação reais: chat, ranking, apelido malicioso como texto, presentes, combo, dica, sociais, pausa, reconexão, visor aberto depois e recarregado, reset, origem externa rejeitada e ausência de erros JavaScript.
- **6 verificações adicionais de mídia/estados**: MP4 de teste no visor, mute/abertura, exclusão entre adaptadores, revelação/pausa, memória, movimento reduzido e rejeição de arquivo inválido. Algumas verificações agrupam mais de uma asserção.
- **122 questões percorridas no renderizador** sem repetição de ID no ciclo, sem transbordamento de pergunta/alternativas. Matéria-prima factual: fatos gerais estáveis; questões matemáticas validadas por cálculo independente em testes. Dicas e soluções incluídas, sem alegação psicométrica.
- **Capturas reais** 1080 × 1920, 540 × 960 e 360 × 640, sem overflow horizontal, sem faixas laterais e sem colisão pergunta/alternativas. Verificação adicional de revelação e memória.
- **60 minutos virtuais de jogo**, 64.800 eventos e 125 rodadas em teste acelerado. A memória rastreada pelo `tracemalloc` ficou perto de 1,4 MB no final e pico perto de 1,6 MB nesse ensaio; isso mede as alocações Python rastreadas, não a memória total do sistema ou navegador.
- **120 segundos reais** de smoke test, 480 eventos e 6 rodadas, sem travar. **Uma hora real contínua ainda não foi executada.** Há script reproduzível para executá-la no PC de transmissão.
- Porta ocupada verificada: erro claro e retorno de falha, sem abrir outro servidor.
- Inicializador Windows compilado para PE32+ x86-64 e inspecionado. Runtime Python oficial e licenças incluídos. **O EXE não foi executado em Windows nem Wine neste ambiente.**

Os resultados brutos estão em `evidence/unit-tests.txt`, `evidence/e2e.txt`, `evidence/media-tests.txt`, `evidence/soak-real.txt`, `evidence/porta-ocupada.txt` e arquivos JSON correspondentes. O pacote de produção não depende de Node ou Playwright.

## Cobertura dos critérios de aceite

| Área | Implementado e verificado aqui | Validação restante |
|---|---|---|
| Inicialização | Servidor local, erro de porta, URLs, runtime e inicializador Windows produzidos | Duplo clique e abertura de navegador em Windows nativo |
| Visual | Palco nativo, três resoluções, instruções, opções, ranking, poderes, Inter local e movimento reduzido | OBS, Brave/Edge e Studio reais; overlays da conta do usuário |
| Mecânica | Estados, primeira resposta, ID, ranking, memória, caps e moderação | Sessão de público real |
| Sincronização | SSE e snapshot inicial, recarga e relógio no servidor | Perda de rede/hibernação específica do PC Windows |
| TikFinity | Adaptador real implementado; protocolo documentado; mock WebSocket e reconexão testados | Desktop e LIVE reais, IDs e formato efetivo dos combos |
| Estabilidade | Filas/mapas limitados, 60 min virtuais e 120 s reais | 60 min reais de execução contínua com navegador/OBS |
| Apresentadora | MP4 local de teste, compartilhamento, fase, mute e fade | Vídeos autorizados do usuário e áudio na transmissão |
| Entrega | Código, executável PE, runtime, testes, docs e capturas | Homologação final no PC de produção |

## Limites conhecidos e escolhas explícitas

- O inicializador requer a pasta completa. Não é um EXE único autocontido. Windows ARM/32 bits não estão incluídos.
- Um painel fica responsável pelo WebSocket. O servidor continua o jogo se o painel fechar, mas eventos novos dependem de outro painel aberto que assuma a concessão.
- A retomada após reinício do servidor preserva somente ranking/configurações quando escolhido; não restaura pergunta em andamento.
- O ranking de longo prazo tem teto de 10.000 contas por sessão; votos têm teto de 20.000 por rodada. Agradecimentos visuais podem ser agrupados/descartados sob avalanche, com limites descritos no README.
- Combo sem identificadores suficientes usa cooldown conservador: precisa ser conferido com a versão real do TikFinity.
- Botões do painel, testes HTTP e simulador são marcados como TESTE; não comprovam uma conexão TikTok real.
- TTS não foi incluído. MP4 não promete falas personalizadas. Nenhum material de pessoa real foi gerado.
- O banco usa famílias de desafios parametrizados, além de curiosidades: diversidade de números não equivale a 122 mecânicas diferentes.

## Roteiro de homologação

1. Extraia o ZIP em Windows 10/11 x64. Abra o EXE; confira painel e visor. Abra uma segunda instância para verificar diagnóstico da porta.
2. Execute `TESTAR_WINDOWS.bat`. Depois inicie o jogo e execute `TESTAR_60_MINUTOS.bat` fora da transmissão. Guarde o relatório.
3. Configure fonte OBS 1080 × 1920, 30 FPS, e teste captura/áudio. Ajuste overlays próprios do TikTok sem cobrir a pergunta.
4. Conecte TikFinity real, faça comentários e presentes de teste; confira IDs, combos, +9s máximo, dica única, seguidores, likes e shares. Não use dinheiro/prêmios como promessa.
5. Teste queda/reconexão do Desktop, troca de abas e abertura tardia do visor. Só então considere a LIVE homologada.
