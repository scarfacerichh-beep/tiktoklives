## Acesso atual — página hospedada

Abra https://luna-cartas-interalives.velvetydogwood32.chatgpt.site e clique em **Demonstrar sequência**. Não é necessário baixar o HTML, ZIP, Python ou BAT. Site privado para a conta proprietária; use a mesma conta do ChatGPT, se solicitado. A publicação foi confirmada pelo serviço Sites. Esta é a cena de animação; não adiciona conexão TikFinity, voz ou sincronização labial.

O endereço raw.githubusercontent.com é distribuição de arquivos/código, não hospedagem de páginas. Ele não deve ser usado como o link principal para abrir a Luna.

---

> **Atualização de distribuição:** o ZIP Luna 0.1 foi bloqueado pelo antivírus do usuário e retirado da distribuição atual. A causa permanece desconhecida. Não restaure arquivos bloqueados nem desative proteções. O histórico Git conserva a versão antiga, sem atestar sua segurança.
>
> A alternativa atual é `downloads/LUNA_ABRIR_NO_NAVEGADOR.html`: arquivo HTML com JavaScript, CSS, imagem e fonte incorporados. Salve com extensão `.html`, abra no navegador e clique em Demonstrar sequência. Não requer Python, BAT ou instalação. Se também for bloqueado, mantenha o bloqueio e informe o nome da ameaça. Não foi realizada varredura antivírus.
>
> Teste automatizado: conteúdo do HTML carregado em Chromium sem internet; imagem, fonte, cartas, presentes, seguidor e pausa funcionaram sem solicitações HTTP nem erros JS. A política do navegador gerenciado impediu navegação direta file:// neste ambiente; a abertura por duplo clique em Windows permanece sem validação. A sincronização entre abas de arquivos locais depende do navegador; use os controles da própria tela.

# Luna — animações 0.1

Primeira cena animada baseada na personagem aprovada. A imagem original foi preservada; movimentos de câmera/escala, luz e efeitos são feitos pelo navegador. Não é vídeo de uma pessoa real respirando/falando, nem contém sincronização labial.

## Abrir no Windows

1. Extraia em uma pasta nova. Requer Python 3.11+ instalado separadamente pelo site oficial.
2. Execute **INICIAR_LUNA.bat**. O servidor abre o estúdio da Luna pelo navegador.
3. Clique em **Demonstrar sequência** ou use **Curtida, Seguidor, Presente** e as cartas 1/2/3.
4. Clique **Abrir visor 1080 × 1920**. As ações do estúdio aparecem nesse visor por BroadcastChannel, em abas do mesmo navegador/origem. Navegadores diferentes/OBS não compartilham esse canal nesta etapa.
5. **Pausar animações** interrompe o movimento contínuo. A preferência do sistema por movimento reduzido tem prioridade.

Se a versão anterior do servidor estiver aberta, feche sua janela antes de iniciar esta atualização. O lançamento reutiliza uma instância 4.4 da mesma pasta; por isso não misture arquivos com um servidor antigo em execução. Não há novo EXE nem runtime Windows neste pacote.

## O que está animado

- Movimento suave da composição da Luna, luz das velas e partículas douradas.
- Cartas flutuantes, virada em 3D e mensagem simbólica de cada carta.
- Curtida: corações; seguidor: luas/estrelas; presente: flores e brilho dourado.
- Agradecimentos visuais por nome, faixa rolante e sequência demonstrativa.
- Retorno automático das cartas, cancelamento da demonstração em ações manuais, partículas limitadas a 30 e nomes via textContent.

## Limites desta entrega

**É um estúdio de animação, ainda sem conexão do chat/TikFinity da Luna e sem voz.** Os botões usam eventos simulados e o sinal de demonstração permanece no visor. A cena não deve ser anunciada como uma anfitriã autônoma já conectada. O jogo anterior permanece no endereço principal; a Luna está em `/static/luna/index.html`.

As três mensagens são exemplos fixos, simbólicos, sem previsão garantida. Escolher cartas é gratuito; presentes geram efeitos visuais, não prometem resultados. Não há cobrança ou classificação de quem presenteou.

Não foram validados Windows nativo, OBS, TikTok LIVE real ou antivírus. O alerta do pacote nativo antigo não foi esclarecido; não restaure arquivos bloqueados nem desative proteções.

## Validação

Playwright/Chromium Linux: enquadramento e ausência de colisão entre cartas, mensagem, ticker, alerta e rodapé em 1080×1920, 540×960, 360×640; virar/recolher carta por teclado; sincronização entre estúdio e visor; curtida, seguidor e presente; nome malicioso como texto; máximo de 30 partículas; pausa; movimento reduzido; sem erros JavaScript. Capturas e MP4 foram gerados da página real. Os 51 testes Python existentes também passaram após acrescentar o parâmetro `--view luna` ao inicializador.

Reproduzir: `npm ci`; iniciar `python servidor.py --port 8811 --view luna`; executar `node tests/luna.e2e.cjs`. Para vídeo: `node tests/luna-preview.cjs`. Definir CHROMIUM para o caminho do Edge em Windows e ARENA_URL para outra porta, se necessário. A gravação usa o ffmpeg do Playwright.
