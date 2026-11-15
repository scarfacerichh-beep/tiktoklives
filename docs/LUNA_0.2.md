# Luna 0.2 — voz, reações e eventos

Acesso: https://luna-cartas-interalives.velvetydogwood32.chatgpt.site

## Ouvir a Luna

1. Recarregue a página; confira **0.2** no estúdio.
2. Em **Voz da Luna**, selecione uma voz pt-BR e clique **Ativar e testar voz**. Perfil inicial: velocidade 0,92, tom 1,02 e volume 0,8. A disponibilidade e a qualidade dependem das vozes oferecidas pelo navegador/Windows.
3. Se a voz estiver marcada **online**, autorize o envio das falas e apelidos ao fornecedor antes de ativar. Essa autorização começa desmarcada e não é salva. Não há fallback remoto silencioso.
4. O botão **Ouvir amostra natural da Luna** reproduz uma abertura real pré-gerada com Francisca. É uma amostra genérica, de 11,832 segundos; não usa o nome do visitante. As falas personalizadas usam a voz selecionada no navegador, podendo ter qualidade diferente.
5. Capture o áudio do navegador do estúdio no LIVE Studio/OBS. Somente o estúdio fala; o visor acompanha as legendas sem duplicar áudio. A exclusividade entre estúdios usa Web Locks quando disponíveis; em navegadores sem esse recurso, mantenha só um estúdio com áudio.

## Testar as interações

Deixe **Testes e demonstração**, informe um nome e use **Entrou na LIVE**, **Curtida**, **Seguidor** e **Presente**. A Luna agradece por nome, com texto e efeitos. Use **Demonstrar sequência** para ver uma sequência guiada. As cartas 1/2/3 recebem narração quando a opção estiver habilitada. Os comentários livres só recebem uma resposta pronta; seu conteúdo não é lido.

## Conectar à LIVE

- Abra TikFinity Desktop **no mesmo computador** e conecte-o à sua LIVE.
- No estúdio, selecione **TikFinity real**, mantenha `ws://localhost:21213/` e clique **Conectar TikFinity**.
- Se o navegador pedir permissão de rede local, autorize o acesso ao TikFinity desse PC. Caso a conexão seja bloqueada, o painel informa a falha; não desative proteções do navegador/antivírus.
- **Socket aberto** significa somente conexão ao endpoint. **Eventos recebidos** só aparece após um evento individual aceito; confira tipo, nome e contagem no painel.
- Os botões e a demonstração ficam desabilitados no modo real. Há uma opção separada de **Simulador WebSocket**, marcada como TESTE.
- Abra o visor **no mesmo navegador** do estúdio. No Studio, use **Captura de janela** desse visor e capture também o áudio do estúdio. Uma fonte Link de outro navegador/processo não compartilha o canal de sincronização desta versão.

## Entradas: limite da fonte

O adaptador aceita `member`, `join` e `enter` quando trazem identidade e apelido. A API pública do TikFinity lista `chat`, `gift`, `share`, `follow`, `like`, `roomUser` e `subscribe`; a presença de `member` não é garantida nessa lista. O conector upstream possui `member` separado de `roomUser`. Por isso, o agradecimento nominal de entrada funciona **se a conexão repassar o evento individual**. Uma atualização agregada de contagem não identifica quem entrou e não é transformada artificialmente em uma pessoa.

Referências: [API TikFinity](https://tikfinity.zerody.one/tiktok/dapi), [eventos do conector upstream](https://github.com/zerodytrash/TikTok-Live-Connector#events).

## Proteções e movimento

- Uma fala por vez, até cinco pendentes; prazo de 12 segundos para falas não iniciadas; seguidores/presentes com prioridade. Em avalanche, algumas interações não serão narradas individualmente.
- Curtida: intervalo de 30 segundos por conta. Entrada e seguidor: cinco minutos por conta. IDs estáveis e msgId/combo impedem reenvios; filas e mapas são limitados.
- Trocar a origem descarta falas pendentes da origem anterior, para não narrar nomes de demonstração durante o modo real.
- O reset descarta leituras antigas; silenciar cancela voz/fila. Há aviso de bloqueio/ausência de voz, sem simular reprodução.
- Reações diferentes para entrada, seguidor, curtida e presente; moldura luminosa, ondas de voz e legenda durante o áudio. Preferência de movimento reduzido e pausa respeitadas. Não há sincronização labial nem novo vídeo facial da personagem.

## Verificação

**32 testes automatizados aprovados**: nomes, intervalos por ID, duplicatas, combos, comentários sem leitura livre, limites, prioridades, expiração, silenciar, reset, vozes ausentes, autorização/revogação online, parse, reconexão e comunicação por frames WebSocket reais com um servidor de simulação local. A API de fala foi simulada nos testes; isso não demonstra áudio audível em Windows. A amostra MP3 foi gerada de verdade com frase genérica, sem dados de espectadores.

HTML auditado para IDs únicos, existência de controles e arquivos referenciados; JavaScript passou na verificação de sintaxe. Nesta atualização não foi possível repetir QA visual no navegador: o recurso de preview/browser requerido pelo ambiente Sites não está disponível. O teste anterior em três resoluções se refere à versão 0.1; a camada nova de voz e o painel ampliado ainda precisam de conferência visual no PC do usuário. Windows, vozes instaladas, permissão de rede local e uma sessão TikTok real não foram validados aqui.

Reproduzir: `node --test tests/luna/*.test.mjs` na raiz do projeto. O teste de WebSocket requer Python 3.11+ e usa um processo simulado isolado, não sua LIVE.
