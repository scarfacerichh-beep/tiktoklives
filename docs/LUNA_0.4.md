# Luna 0.4 — configuração cloud de @interalivess

Abra https://luna-cartas-interalives.velvetydogwood32.chatgpt.site/#cloudSetup com a conta proprietária.

## Configurado

O Site foi migrado para Worker com API e cofre R2. O canal **interalivess** está definido no ambiente do servidor. Chaves são cifradas com AES-256-GCM; a chave mestra fica como segredo de runtime e não no código. GET de configuração retorna presença das chaves, nunca seu conteúdo. Writes exigem identidade ChatGPT e origem correta. O acesso privado foi preservado.

O painel inclui formulário protegido, catálogo de avatares/vozes e importação da Luna na conta LiveAvatar, mediante confirmação explícita dos créditos aplicáveis. A importação usa uma referência extraída do vídeo aprovado, ampliada para 1080×1920 para atender à entrada da API; isso não torna o vídeo de apresentação nativo 1080p. O endpoint de criação de imagem do LiveAvatar é Alpha, depende do plano/acesso e pode recusar a operação.

O fluxo técnico em tempo real foi implementado: sessão FULL do LiveAvatar, voz em português e stream LiveKit, token TikTools restrito a @interalivess e um WebSocket, entrada/curtida/seguidor/presente identificados, comandos avatar.speak_text com nomes, fila de cinco e intervalos por conta. Não usa localhost nem vozes do Windows. Durante o teste os controles da abertura são bloqueados para não sobrepor áudios.

O teste é inicialmente sandbox e tem **limite de 60 segundos no provedor**. O cadastro/treinamento do avatar e as permissões para sandbox dependem da conta. Essa é uma etapa de validação, não uma LIVE contínua já comprovada.

## Único bloqueio externo confirmado

O usuário informou que **ainda não possui contas LiveAvatar e TikTools**. Buscas de plugins específicos não encontraram integrações desses provedores. O HeyGen conectado fornece geração de vídeos e confirmou plano gratuito; não fornece automaticamente conta/API de streaming LiveAvatar nem os eventos TikTools. Não há navegador interativo disponível para executar cadastros/login em nome do usuário.

1. Criar contas em [LiveAvatar](https://app.liveavatar.com/) e [TikTools](https://tik.tools/), com verificação de email e aceite de termos pelo usuário.
2. Salvar as chaves de API **no formulário privado da Luna**, não no chat.
3. Carregar catálogo ou criar a Luna na conta pelo botão, aguardar o treinamento e escolher a voz em português.
4. Confirmar o teste e conferir os eventos com @interalivess em LIVE. Usar Liberar som se o navegador exigir um clique.

Nenhuma assinatura ou compra foi realizada. Não há credenciais reais desses dois provedores instaladas, sessão real iniciada ou consumo de créditos deles neste trabalho. A interface não declara conexão sem eventos nem inventa entradas a partir da contagem de espectadores.

## Validação

**29 testes automatizados passaram**: player, fluxo com provedores simulados, identidade/eventos de fala, tópicos/sessão, fila, duplicatas, encerramento, criptografia/adulteração, proteção de gravação, consentimento, tokens restritos, catálogo sem segredos e importação sem duplicação. Falha explícita de credencial permite correção; resultado de criação incerto não é repetido automaticamente.

HTTP em produção confirmou `/api/config` com 200, canal interalivess, `storageReady=true`, duas credenciais ausentes e integrações não configuradas. Página/JS/CSS servem MIME correto; MP4 responde 206 a Range. O build Worker e a sintaxe foram conferidos.

Não houve teste end-to-end com contas reais, medição de latência nem nova inspeção visual da página no navegador: a infraestrutura de preview exigida por Sites não está disponível. A abertura foi otimizada preservando 720×1280, velocidade 1×, 18,64 segundos, áudio AAC sem recodificação e a marca HeyGen; original imutável mantido.

## Código

Produção usa `cloud/runtime/` e `static/luna-online/` combinados pelo build. `cloud/broker.mjs` é o protótipo anterior, sem rota na versão 0.4. LiveKit 2.24.1 está fixado com licença. A declaração R2 é `"r2": "BUCKET"`. O desenho pressupõe Site privado de um proprietário; múltiplos criadores exigirão autorização e dados separados por sala.

Referências: [FULL Mode](https://docs.liveavatar.com/docs/full-mode/configuration.md), [eventos](https://docs.liveavatar.com/docs/full-mode/events.md), [imagem Alpha](https://docs.liveavatar.com/api-reference/avatar/create-image-avatar-alpha.md), [TikTools](https://tik.tools/docs).
