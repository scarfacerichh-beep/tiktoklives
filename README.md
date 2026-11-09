> **Download Windows:** abra Releases → v4.0.0 e baixe `INTERALIVES_QI_STUDIO_FINAL.zip`. Extraia tudo e execute `INTERALIVES_QI_STUDIO.exe`. O código deste repositório não inclui o runtime; ele está no ZIP da release.

# INTERALIVES QI ARENA STUDIO 4.0.0

Jogo local para TikTok LIVE: perguntas, memória, ranking por conta e poderes coletivos opcionais. QI é uma marca de desafio recreativo, sem avaliação clínica e sem prêmios financeiros. Participação e ranking gratuitos.

## Windows: extrair e abrir

1. Extraia **todo** o ZIP para uma pasta gravável, como Documentos\INTERALIVES.
2. Abra `INTERALIVES_QI_STUDIO.exe` ou `INICIAR_INTERALIVES_QI.bat`.
3. O painel abre no navegador: `http://127.0.0.1:8788/`.
4. Clique **Abrir tela da LIVE**: `http://127.0.0.1:8788/?live=1`.
5. Deixe a janela do servidor e um painel abertos durante a transmissão. Fechar o painel interrompe a entrada TikFinity; o motor continua no servidor.

Inclui Python 3.12.10 portátil oficial, para **Windows 10/11 x64**, sem instalação, pip ou chaves de API. O executável é um inicializador nativo de 64 bits: não mova o EXE sozinho. Não foi assinado digitalmente. O pacote foi compilado e inspecionado em Linux; execução nativa no Windows ainda precisa de homologação. Consulte `docs/RELATORIO_FINAL.md` antes da primeira transmissão.

Se a porta estiver ocupada, o programa explica o erro e mantém a janela aberta. Feche a instância anterior ou execute `INTERALIVES_QI_STUDIO.exe 8789`. Também aceita a variável de ambiente `INTERALIVES_PORT`. Não use duas instâncias na mesma pasta: compartilham o arquivo de sessão.

No Linux/macOS: `python3 servidor.py --open` (Python 3.11+), sem dependências de produção. Porta alternativa: `python3 servidor.py --port 8789`.

## Fluxo do operador

- **Iniciar** inicia uma sessão ou retoma a pausa; **Pausar** congela pergunta, memória ou revelação.
- **Pular rodada** avança; **Parar** cancela a sequência; **Reiniciar sessão** apaga rodada e ranking.
- Duração e nível aplicam-se às próximas perguntas. O intervalo controla o tempo de explicação da resposta; há mais 2 segundos de transição.
- Automático desligado: após a explicação, aguarda a próxima rodada manual.
- Nível inicial filtra perguntas fáceis; as questões avançam em dificuldade até o fim do ciclo. Sem repetição de ID antes de esgotar o banco elegível. Alterar nível durante uma sessão reinicia a composição do ciclo; para um ciclo completo, mantenha o nível escolhido.
- Uma primeira resposta válida por ID em cada rodada. `A`, `b`, `C!`, `D.` são aceitos. Mensagens longas e respostas múltiplas são descartadas.
- Cada acerto vale 100 a 150 pontos. O bônus usa o tempo original restante: presentes não ampliam o bônus. Erros não descontam pontos.
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

Limites: 20.000 votos por rodada, 10.000 contas no ranking, 4.096 IDs recentes/cooldowns e 60 linhas de log. O adaptador usa fila limitada e lotes; eventos atrasados de outra rodada são descartados. Para manter os alertas discretos, siga/compartilhe/curta têm cooldown por conta; a cada 100 curtidas elegíveis surge um agradecimento.

## Apresentadora MP4 opcional

No painel, selecione um MP4 autorizado de até 250 MB. Ele é salvo **somente no servidor local**, em `media/presenter.mp4`, e compartilhado com o visor. Escolha abertura, intervalos ou ambos; mute por padrão. A janela fica na margem superior, com transição de opacidade, e desaparece durante a pergunta. O seletor de intervalo controla seu tempo de exibição. Clique em remover para desativar. Para apagar o arquivo do disco, feche o programa e exclua a pasta `media`.

Vídeo não simula agradecimentos personalizados. Nenhum vídeo de pessoa real ou TTS está incluído. Áudio depende da permissão de reprodução automática do navegador/OBS; para evitar interferências, deixe o vídeo mudo. Os efeitos sonoros do jogo são opcionais e saem pelo painel: capture esse áudio separadamente se quiser transmiti-lo.

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
python3 servidor.py --port 8790
# em outro terminal
python3 mock_tikfinity.py
# em outro terminal: indique o executável do navegador local
CHROMIUM=/usr/bin/chromium npm run test:e2e
CHROMIUM=/usr/bin/chromium node tests/media-and-phases.cjs
```

No Windows PowerShell: `$env:CHROMIUM='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'`, `$env:PYTHON="$PWD\runtime\python.exe"`, depois `npm run test:e2e`. Ajuste o caminho conforme a instalação. No Linux o teste usa `/usr/bin/chromium` por padrão. O teste de mídia usa o clipe sintético incluído em `evidence/test-video.mp4`.

Evidências em `evidence/`. A homologação em Windows, OBS/TikTok Studio e LIVE real continua necessária; não foi substituída por simulação.

## Código e licenças

`engine.py`: estados, relógio, votos e persistência. `questions.py`: 122 questões em cinco categorias. `servidor.py`: HTTP/SSE e inicialização. `static/app.js`: apresentação e painel. `static/tikfinity.js`: adaptador WebSocket. `mock_tikfinity.py`: simulador. `launcher.c`: inicializador Windows.

Python oficial embutido: licença em `runtime/LICENSE.txt`. Inter: SIL Open Font License em `static/fonts/LICENSE.txt`. Ferramentas de compilação e desenvolvimento não são necessárias para rodar. O projeto foi recebido por ZIP; nenhuma alteração foi publicada em repositório GitHub remoto.
