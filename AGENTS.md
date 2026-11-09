# AGENTS.md — instruções do repositório INTERALIVES QI

Você é o engenheiro responsável por finalizar o produto executável para TikTok LIVE Studio e TikFinity, em Windows. O usuário prioriza **qualidade visual real, UX vertical excepcional e retenção/participação do chat** acima de protótipos genéricos.

## Regras de execução
- Leia e rode o projeto atual antes de alterar; documente bugs reproduzidos, não presuma que tudo funciona.
- Faça implementação e testes no mesmo trabalho. Não responda apenas com roteiro, prompt ou aparência ilustrativa.
- Refatore gradualmente o HTML/CSS/JS monolítico em módulos estáveis se isso ajudar, mas mantenha `INICIAR_INTERALIVES_QI.bat` e endereços do painel/visor funcionando para o usuário sem conhecimento de programação.
- Não introduza custos fixos, APIs pagas ou chaves obrigatórias. Dependências abertas são aceitáveis se instalaçao for simples e reprodutível. Priorize execução local.
- Mostre de fato o visor em 1080x1920 em capturas de teste; desenhe cada linha para tela pequena e safe zones dos overlays do TikTok.
- Não descreva elementos como funcionando quando só estão simulados. Separe dados reais, simulação e estado "aguardando conexão".
- Nunca exigir presente para jogar/ganhar ranking. Não fingir perguntas clínicas de QI, não prometer dinheiro/prêmios por presentes, não pressionar espectadores.
- Todos os comentários, notificações e interface em português brasileiro; detalhes técnicos podem ficar em inglês.
- Teste em Chromium/Edge/Brave e Windows quando o ambiente permitir; para TikFinity sem LIVE real, crie simulador WebSocket de mensagens documentadas e teste; o usuário deve validar uma sessão real.
- Sem segredos no Git, sem HTML injection com nickname/comentário; usar textContent, sanitizar payload, limitar memória e filas.
- Se alguma funcionalidade não for possível validar no ambiente, sinalize explicitamente e deixe roteiro de teste reproduzível.

## Critério de pronto
Ver `docs/CRITERIOS_DE_ACEITE.md`. O produto deve rodar por pelo menos 1 hora de simulação sem congelar, ter testes automatizados, e estar visualmente nítido em 1080x1920 no OBS/TikTok Studio.
