# Critérios objetivos de aceite — Codex

## Execução Windows
- [ ] `.bat` inicia servidor na porta configurada, dá URL clara, não fecha silenciosamente, detecta porta ocupada ou explica erro.
- [ ] `/` abre painel; `/?live=1` abre visor, sem controles do operador.
- [ ] Sem assinaturas de serviços externos nem tokens exigidos para demo.

## Visual 9:16
- [ ] Capturas reais em 1080 × 1920, 540 × 960 e 360 × 640; sem corte, fonte legível e CTA forte.
- [ ] Três passos para jogar perceptíveis: veja pergunta, comente opção, pontue.
- [ ] Assinatura visual INTERALIVES consistente e animações suaves; `prefers-reduced-motion` respeitado.
- [ ] Áreas com pergunta, 4 opções, cronômetro, ranking e poderes não se sobrepõem.

## Mecânica
- [ ] Iniciar, pausar, retomar, parar e reiniciar sob diferentes estados, sem temporizadores fantasmas.
- [ ] Um usuário não pontua duas vezes na mesma rodada.
- [ ] Ranking atualiza corretamente e suporta apelidos/emojis.
- [ ] Dicas não revelam acidentalmente respostas; alternativas corretas verificadas.
- [ ] Sem pagamentos: todos podem responder; presentes têm teto e efeito divulgado.
- [ ] Simulador local reproduz chat, likes, follows, shares, gift, desconexões e combos.
- [ ] Não há injeção de HTML/XSS via nome de usuário ou comentários.
- [ ] Visor sincroniza quando abre durante uma rodada ou reconecta.
- [ ] Funciona por 60 minutos em teste automático/mock sem travar ou consumir memória indefinidamente.

## TikFinity
- [ ] Conectar a `ws://localhost:21213/` e registrar status sem confundir "socket aberto" com "LIVE com eventos".
- [ ] Gift IDs configuráveis/testáveis, sem confundir nomes de presente com IDs; deduplicação de combos.
- [ ] Documentação indica que verificação real da live depende do PC do usuário.

## Entrega
- [ ] Arquivos prontos para extrair/executar, README atualizado, screenshots e histórico de mudanças.
- [ ] E2E rodando e resultados informados, além da lista exata de itens não validados.
