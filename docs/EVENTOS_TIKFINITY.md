# Eventos TikFinity — contrato e testes

Referência oficial consultada em 09/11/2026: https://tikfinity.zerody.one/tiktok/obsoverlays (seção Event API). O Desktop, no mesmo PC, expõe `ws://localhost:21213/`, com envelope `{ "event": "chat", "data": {} }`. A documentação remete ao TikTok-Live-Connector para o conteúdo dos eventos: https://github.com/zerodytrash/TikTok-Live-Connector . Os exemplos abaixo são **fixtures sintéticas**, não capturas de uma LIVE real.

```json
{"event":"chat","data":{"userId":"123","uniqueId":"ana","nickname":"Ana 🧠","comment":"B","msgId":"chat-001"}}
{"event":"gift","data":{"userId":"123","nickname":"Ana","giftId":5655,"giftType":1,"repeatCount":3,"repeatEnd":false,"groupId":"combo-001","msgId":"gift-partial"}}
{"event":"gift","data":{"userId":"123","nickname":"Ana","giftId":5655,"giftType":1,"repeatCount":5,"repeatEnd":true,"groupId":"combo-001","msgId":"gift-final"}}
{"event":"follow","data":{"userId":"123","nickname":"Ana"}}
{"event":"like","data":{"userId":"123","nickname":"Ana","likeCount":100}}
{"event":"share","data":{"userId":"123","nickname":"Ana"}}
```

- Identidade: `userId`, senão `uniqueId`, senão `nickname`. Sem identidade, descarta. Se o produtor omitir IDs estáveis e usar somente apelidos, não é possível distinguir contas com apelidos iguais.
- Nickname é texto, nunca HTML. O adaptador transmite apenas campos necessários, truncados; servidor valida estado, prazo, identidade, formato e moderação.
- `chat`: primeira letra única, opcional ponto/exclamação. Primeira resposta por conta vence, mesmo incorreta. Mensagem repetida é deduplicada.
- `gift`: ID convertido para string. Nome do presente não determina poder. Tipo 1 aguarda `repeatEnd`; grupo/combo deduplica uma sequência inteira. Sem grupo: `msgId`, `messageId` ou `transactionId`; sem identificadores, cooldown de 2 segundos. Combos geram uma aplicação, não `repeatCount` aplicações.
- Efeito de tempo só em fase de resposta ativa, +3 por aplicação, teto +9. Dica uma vez. Não libera dica durante a memorização.
- Seguidores/compartilhamentos: cooldown de 15 segundos por conta/tipo. Curtidas são agregadas após esse cooldown; o número não representa o total oficial de likes da LIVE.
- A fila visual e o log são limitados. O adaptador aplica backpressure por lotes e associa os eventos à rodada em que os recebeu. Limites de capacidade estão no README.

## Simulador

`python3 mock_tikfinity.py` ou `INICIAR_SIMULADOR.bat`; selecione **Simulador local** no painel. A porta 21214 evita conflito com TikFinity real.

Envie um exemplo para todos os clientes conectados:

```sh
curl -X POST http://127.0.0.1:21214/emit -H 'Content-Type: application/json' --data '{"event":"chat","data":{"userId":"123","nickname":"Ana","comment":"B","msgId":"teste-001"}}'
curl -X POST http://127.0.0.1:21214/disconnect --data '{}'
```

Para combos, envie parcial, final e a mesma final outra vez. Confira que só uma aplicação ocorre. Troque o ID configurado e confirme que um nome "Rosa" com ID diferente não adiciona tempo.

## Validação real obrigatória no PC de transmissão

1. Abra TikFinity Desktop e conecte sua LIVE; selecione modo real no painel.
2. Confira socket aberto, depois receba um comentário real e confira eventos recebidos.
3. Faça duas contas responderem; uma segunda resposta da mesma conta não deve aumentar o contador.
4. Copie os IDs reais de presentes do log, salve e teste os tetos. Verifique a nomenclatura dos campos de combo da sua versão usando as ferramentas de desenvolvedor; não publique dados pessoais.
5. Desconecte/reconecte o Desktop, abra o visor durante a rodada e confira o tempo.
6. Teste uma hora no OBS/Studio monitorando memória, FPS, áudio e overlays. Esse teste real não foi realizado neste ambiente Linux.
