> **DISTRIBUIÇÃO WINDOWS COM EXECUTÁVEL SUSPENSA.** Foi reportado bloqueio “Vírus detectado” no ZIP 4.3. Não restaure nem permita o arquivo bloqueado. Os ZIPs com o inicializador compilado foram retirados da distribuição atual enquanto o alerta é investigado. Integridade SHA-256 e testes funcionais não equivalem a uma análise antivírus.
>
> O código-fonte permanece disponível para revisão. A causa da detecção ainda não foi determinada.

[Edição em código-fonte, sem binários Windows compilados](https://github.com/scarfacerichh-beep/tiktoklives/raw/refs/heads/main/downloads/INTERALIVES_QI_4.3.1_CODIGO.zip) — requer Python instalado separadamente. Não houve certificação antivírus dessa edição neste ambiente.

# INTERALIVES QI ARENA STUDIO 4.3.1

Jogo local para TikTok LIVE: perguntas, memória, ranking por conta e poderes coletivos opcionais. QI é uma marca de desafio recreativo, sem avaliação clínica e sem prêmios financeiros. Participação e ranking gratuitos.

[Veja a prévia em vídeo](https://github.com/scarfacerichh-beep/tiktoklives/raw/refs/heads/main/docs/ARENA_4.3_PREVIA.mp4) · [Veja a captura Full HD](https://github.com/scarfacerichh-beep/tiktoklives/blob/main/docs/ARENA_4.3.png)

## Novidades 4.3: mensagens rolando e mais cor

A faixa superior agora rola automaticamente com convites para **comentar A/B/C/D, curtir, seguir e convidar alguém para jogar**. As frases mudam conforme a fase: concentração na memória, escolha da letra durante a pergunta, aviso nos últimos segundos, explicação na revelação e mensagem estática na pausa. Entre rodadas e na preparação, a faixa continua convidando o público. A marca **TESTE** fica fixa, fora do texto rolante, quando os dados são simulados.

No painel, use **Paleta da arena**: Festa colorida alterna por rodada; Rosa cósmico, Oceano neon, Pôr do sol e Elétrico mantêm uma escolha fixa. O texto principal continua branco, sobre superfícies escuras.

Em **Mensagens de interação rolando**, você pode desligar a faixa e manter um convite estático. A velocidade pode ser devagar, normal ou rápida. Movimento desligado e preferência do sistema por movimento reduzido também interrompem a rolagem. As mensagens não geram voz adicional nem inventam espectadores, votos ou presentes recebidos.

Na atualização, foi corrigido um caso de curtidas/seguidores recebidos na troca de rodada: esses eventos sociais não ficam presos à rodada anterior. Votos e poderes continuam com a proteção contra eventos atrasados.

## Visual neon e animações

A estrutura vertical foi preservada, com uma nova camada visual: cores mais vivas por alternativa, tema por categoria, faixas de luz no fundo, chamada para comentar, cronômetro circular, entrada de perguntas, reação aos votos, troca animada de posições e celebração na revelação. O baú conquistado ganhou uma ilustração própria, sem cobrir a pergunta.

No painel, escolha **Animações da arena → Vibrantes, Suaves ou Desligadas**. A preferência do sistema por movimento reduzido tem prioridade. **Em pausa, o movimento ambiente para também.** Para experimentar, inicie rodadas e use os botões de respostas/presentes; os efeitos acompanham eventos recebidos, sem fabricar votos ou espectadores.

A animação de votos tem limite de frequência; partículas têm teto de 30 elementos e são removidas após 2 segundos. Atualizações repetidas de sincronização não reiniciam a animação de uma resposta. Os IDs das contas mantêm a identidade no movimento do ranking, mesmo com apelidos iguais.

O fundo usa gradientes e transformações, sem grandes desfoques em movimento. Uma amostra de 90 frames no Chromium Linux, em 1080 × 1920 e sem gravador, ficou perto de 60 FPS após otimização; isso não garante a mesma taxa no Windows/OBS. Em PCs mais fracos, use o modo suave ou desligado e configure a captura em 30 FPS.

## Voz por nome e baús visuais

1. No Windows, abra o painel no **Microsoft Edge** e deixe-o aberto. Nas configurações de fala do Windows, instale uma voz local em **Português (Brasil)** caso ainda não exista.
2. Em **VOZ DA ARENA**, escolha a voz, volume e velocidade. Clique **Ativar e testar voz** e confirme que ouviu a frase de teste. É preciso clicar novamente depois de recarregar o painel.
3. No OBS ou TikTok Studio, inclua o **áudio do navegador do painel** ou a captura do áudio do sistema. A voz não sai automaticamente da fonte de navegador do visor. Evite capturar o mesmo áudio por duas fontes.
4. Selecione TikFinity real e teste uma curtida, seguir e responder D. As falas agradecem por nome e confirmam a letra sem informar se está certa antes da revelação. Comentários livres recebem boas-vindas, sem ler o texto do espectador em voz alta.

**Somente vozes locais em português são usadas.** Se não houver voz compatível, o painel informa o impedimento. O teste automatizado usa uma API de fala simulada; reprodução audível da voz instalada no seu Windows e captura no OBS/Studio ainda precisam ser verificadas no seu PC. Não há voz natural de IA em nuvem, chave, assinatura ou áudio humano pré-gravado.

A fila aceita até quatro falas aguardando. Falas têm validade de 12 segundos; confirmações de votação vencem ao mudar de rodada. Curtidas e seguidores têm cooldown; em avalanche, parte das falas é descartada para não atrasar o jogo. As contagens e os acertos continuam sendo processados. Uma concessão no servidor impede dois painéis de narrarem ao mesmo tempo, renovada antes de cada fala; feche/silencie o painel anterior ou aguarde até 25 segundos após uma interrupção. Reconexão do servidor pede reativação manual da voz.

A narração de rodadas e revelações pode ser desligada separadamente. Com chat parado, há um único convite falado na rodada, desde que ainda exista tempo. Para escutar as revelações com calma, recomendamos intervalo de **10 segundos**.

**Ranking por acertos:** mostra acertos e pontos no visor e no Top 10. Pontos antigos da versão 4.0 são mantidos quando a persistência está ligada, mas seus acertos antigos não podem ser reconstruídos: a contagem deles começa em zero nesta versão. Nenhuma vitória passada é inventada. Para uma competição nova, use Reiniciar sessão.

**Baús misteriosos visuais:** a cada 5 acertos acumulados na sessão, a pessoa recebe uma conquista gratuita — aura neon, estrela, selo ou confetes. O baú é anunciado ao revelar a resposta. O nome da conquista aparece no aviso; participantes no Top 3 também ganham o tratamento visual correspondente no cartão. Não há presentes TikTok enviados, dinheiro, prêmio físico ou valor real. A opção pode ser desligada. Sob grande volume, as filas de anúncios têm limite, mas o contador de conquistas permanece no ranking. Com a persistência ativa, acertos e conquistas recebidas são guardados.

## Windows: edição em código-fonte 4.3.1

Os pacotes com inicializador `.exe` estão suspensos após um alerta de antivírus. A causa não foi determinada. Consulte [o aviso de distribuição](docs/AVISO_DISTRIBUICAO.md). Não restaure o arquivo bloqueado nem desative proteções.

Esta edição não contém binários Windows compilados ou runtime embutido. Os scripts `.bat` são texto legível. É necessário instalar **Python 3.11 ou superior separadamente**, pelo [site oficial](https://www.python.org/downloads/windows/).

1. Instale o Python oficial, caso ainda não tenha.
2. Extraia o pacote de código em uma **pasta nova**, sem o executável antigo.
3. Abra `INICIAR_INTERALIVES_QI.bat`. Ele usa o Python instalado e não executa arquivos do pacote antigo.
4. Alternativa: abra o terminal nessa pasta e execute `py -3 servidor.py --open`.
5. Painel: `http://127.0.0.1:8788/`; visor: `http://127.0.0.1:8788/?live=1`.

Nenhum pip é necessário para jogar. Porta alternativa: `INICIAR_INTERALIVES_QI.bat --port 8789`. No Linux/macOS: `python3 servidor.py --open`.

Essa edição não teve certificação antivírus aqui. Se o antivírus alertar novamente, mantenha o bloqueio e informe o nome da detecção. O funcionamento do `.bat` e do Python instalado precisam ser conferidos no Windows do usuário.

## Fluxo do operador

- **Iniciar** inicia uma sessão ou retoma a pausa; **Pausar** congela pergunta, memória ou revelação.
- **Pular rodada** avança; **Parar** cancela a sequência; **Reiniciar sessão** apaga rodada e ranking.
- Duração e nível aplicam-se às próximas perguntas. O intervalo controla o tempo de explicação da resposta; há mais 2 segundos de transição.
- Automático desligado: após a explicação, aguarda a próxima rodada manual.
- Nível inicial filtra perguntas fáceis; as questões avançam em dificuldade até o fim do ciclo. Sem repetição de ID antes de esgotar o banco elegível. Alterar nível durante uma sessão reinicia a composição do ciclo; para um ciclo completo, mantenha o nível escolhido.
- Uma primeira resposta válida por ID em cada rodada. `A`, `b`, `C!`, `D.` são aceitos. Mensagens longas e respostas múltiplas são descartadas.
- O ranking ordena primeiro pelo número de acertos, depois pelos pontos de rapidez; nome é desempate final. Cada acerto vale 100 a 150 pontos. O bônus usa o tempo original restante: presentes não ampliam o bônus. Erros não descontam pontos.
- Contas diferentes com apelidos iguais continuam separadas. Top 3 no visor e Top 10 no painel. Nomes longos recebem reticências.
- Ranking é da sessão por padrão. Marque **Manter ranking** para guardar em `session.json`. Configurações são salvas nesse arquivo; a escrita usa substituição atômica. Rodada ativa não é restaurada após reiniciar o servidor.
- **Pausar recebimento de respostas** bloqueia votos, mantendo o relógio. IDs separados por vírgula bloqueiam participantes específicos.

## TikFinity real

A API oficial do TikFinity Desktop usa `ws://localhost:21213/` no mesmo PC. Abra o Desktop, conecte-o à sua LIVE e deixe um painel deste jogo aberto no navegador. Se o navegador pedir acesso à rede local, permita para o endereço local do jogo.

O painel distingue **desconectado**, **socket aberto / aguardando eventos** e **eventos recebidos**. Socket aberto não comprova que existe uma LIVE ativa. A faixa do visor identifica eventos simulados. Apenas uma aba recebe a concessão de conexão; após fechar essa aba, outra assume em até cerca de 14 segundos. Se precisar alternar entre simulador e real, use a aba que já está conectada.

Eventos suportados: `chat`, `gift`, `follow`, `like`, `share`. Mensagens inválidas são descartadas. Reconexão exponencial: aproximadamente 1, 2, 4, 8, 16 e 30 segundos, com pequena variação.

### Presentes

Configure os IDs numéricos vistos no log. **Não há correspondência por nome ou tradução.** IDs vazios não ativam poderes.

- Rosa configurada: +3 segundos coletivos, teto +9 por rodada.
- TikTok configurado: uma dica coletiva por rodada de resposta.
- Especial e demais presentes: agradecimento cosmético, sem pontos ou vantagens individuais.
- Combo de `giftType=1`: apenas a mensagem final com `repeatEnd=true`. Uma aplicação por combo, independentemente da quantidade. Deduplicação por grupo/combo ou mensagem/transação. Eventos sem identificador têm cooldown de 2 segundos por usuário/presente; nesse caso, eventos legítimos próximos podem ser agrupados. Confira o formato real da sua versão do Desktop.
- Fila visual: até 12 agradecimentos, 2,8 segundos por mensagem. Excesso visual é descartado; pontuação e poderes são processados independentemente dessa fila.

Limites: 20.000 votos por rodada, 10.000 contas no ranking, 4.096 IDs recentes/cooldowns e 60 linhas de log. O adaptador usa fila limitada e lotes; eventos atrasados de outra rodada são descartados. Para manter os alertas discretos, siga/compartilhe/curta têm cooldown por conta; a primeira curtida já gera agradecimento com o nome do participante.

## Apresentadora MP4 opcional

No painel, selecione um MP4 autorizado de até 250 MB. Ele é salvo **somente no servidor local**, em `media/presenter.mp4`, e compartilhado com o visor. Escolha abertura, intervalos ou ambos; mute por padrão. A janela fica na margem superior, com transição de opacidade, e desaparece durante a pergunta. O seletor de intervalo controla seu tempo de exibição. Clique em remover para desativar. Para apagar o arquivo do disco, feche o programa e exclua a pasta `media`.

Vídeo não simula agradecimentos personalizados. Nenhum vídeo de pessoa real está incluído. A voz da arena usa síntese local do navegador, sem clonagem de voz ou API paga. Áudio depende da permissão de reprodução automática do navegador/OBS; para evitar interferências, deixe o vídeo mudo. Os efeitos sonoros do jogo são opcionais e saem pelo painel: capture esse áudio separadamente se quiser transmiti-lo.

## OBS / TikTok LIVE Studio / Brave / Edge

- Fonte de navegador: `http://127.0.0.1:8788/?live=1`, **largura 1080, altura 1920, 30 FPS** (60 FPS opcional se o PC suportar).
- Fonte em resolução nativa; não amplie uma captura da prévia de 540 pixels. Deixe a fonte ativa durante a sessão.
- Para captura de janela, abra o visor em janela dedicada, esconda barras do navegador e ajuste a área útil para 9:16. Nunca capture o painel administrativo.
- Motor e estado rodam no servidor; visor pode abrir em OBS, Edge ou outro navegador, sem depender de BroadcastChannel nem de manter a aba do painel em primeiro plano.
- Margem superior de 180 pixels, rodapé livre e conteúdo principal entre x≈60 e x≈1020. Overlays e botões do TikTok variam: faça uma transmissão de teste e ajuste a posição da fonte conforme sua conta/dispositivo. As margens são uma base de composição, não uma certificação universal dos overlays do aplicativo.
- A fonte é Inter local, sem Google Fonts ou internet. `prefers-reduced-motion` remove movimentos decorativos e confete.

## Testes

Windows: `TESTAR_WINDOWS.bat` executa os testes Python sem dependências. Os testes de engine usam um relógio injetado, inclusive simulação de 60 minutos acelerada; não significam 60 minutos reais.

Para teste real de uma hora: inicie o jogo e execute `TESTAR_60_MINUTOS.bat`. **Isso reinicia a sessão**, envia respostas simuladas por HTTP e grava `teste-60-minutos.txt`. Faça fora da transmissão. Não testa a conexão TikFinity real.

Para o WebSocket simulado, abra `INICIAR_SIMULADOR.bat`, selecione **Simulador local** no painel. O simulador escuta `localhost:21214`; POST `/emit` envia o envelope JSON, POST `/disconnect` derruba os sockets. Veja `docs/EVENTOS_TIKFINITY.md`.

Testes de navegador (Node.js 20+ e Playwright, apenas para desenvolvimento):

```sh
npm ci
npx playwright install chromium
npx playwright install ffmpeg
python3 servidor.py --port 8790
# em outro terminal
python3 mock_tikfinity.py
# em outro terminal: indique o executável do navegador local
CHROMIUM=/usr/bin/chromium npm run test:e2e
CHROMIUM=/usr/bin/chromium node tests/media-and-phases.cjs
CHROMIUM=/usr/bin/chromium npm run test:engagement
CHROMIUM=/usr/bin/chromium npm run test:motion
CHROMIUM=/usr/bin/chromium npm run test:ticker
npm run test:prompts
```

No Windows PowerShell: `$env:CHROMIUM='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'`, `$env:PYTHON="python"`, depois `npm run test:e2e`. Ajuste o caminho conforme a instalação. No Linux o teste usa `/usr/bin/chromium` por padrão. O teste de mídia usa o clipe sintético incluído em `evidence/test-video.mp4`.

Evidências em `evidence/`. A homologação em Windows, OBS/TikTok Studio e LIVE real continua necessária; não foi substituída por simulação.

## Código e licenças

`engine.py`: estados, relógio, votos e persistência. `questions.py`: 122 questões em cinco categorias. `servidor.py`: HTTP/SSE e inicialização. `static/app.js`: apresentação e painel. `static/tikfinity.js`: adaptador WebSocket. `mock_tikfinity.py`: simulador. `launcher.c`: inicializador Windows.

Python oficial embutido: licença no pacote original de runtime, retirado da distribuição atual. Inter: SIL Open Font License em `static/fonts/LICENSE.txt`. Ferramentas de compilação e desenvolvimento não são necessárias para rodar. O projeto foi recebido por ZIP e está publicado em https://github.com/scarfacerichh-beep/tiktoklives . O ZIP da pasta downloads inclui o runtime Windows.
