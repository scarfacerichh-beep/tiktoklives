# Luna 0.3 — apresentação em vídeo publicada

## Entrega

Abertura aprovada gerada com o plugin HeyGen, usando o visual **Luna — Cartas ao Vivo**, a voz **Lucilene — Clear & Trustworthy** e o roteiro aprovado sem alterações. Vídeo H.264 com áudio AAC, **720×1280**, duração de **18,64 segundos**. A marca HeyGen foi preservada, assim como o arquivo gerado; 720p é o limite informado para o plano gratuito. Não foi contratado um upgrade para 1080p.

O arquivo foi incorporado à própria hospedagem da página, sem depender de uma URL de reprodução temporária do fornecedor. O vídeo e a voz são pré-gerados em nuvem; não há voz do Windows, SpeechSynthesis, Python, BAT ou conexão localhost na interface ativa desta versão.

## Usar

Abra https://luna-cartas-interalives.velvetydogwood32.chatgpt.site e clique **Ouvir a Luna**. A página permite pausar, reiniciar, silenciar, ajustar o volume e abrir o modo apresentação (`?live=1`). É necessário um clique para liberar áudio no navegador. O acesso privado da conta proprietária foi preservado.

As três cartas mantêm mensagens simbólicas em texto. Elas não geram novos vídeos nem gastos no HeyGen a cada clique. A apresentação é gravada e identificada como tal.

## Validação

- HeyGen confirmou conclusão da nova geração `dd02e81ad51cf9cb3b10f6e0bc108790`.
- Arquivo baixado: 7.200.664 bytes. FFprobe confirmou 720×1280, H.264/AAC e 18,64 segundos. Decodificação integral com FFmpeg terminou sem erros.
- Medição de áudio: média -19,9 dB, pico -3,3 dB. Confirma presença e nível do sinal, não uma avaliação subjetiva da voz ou conferência palavra a palavra.
- Quadros dos segundos 2, 9 e 16 foram inspecionados: expressões, posição da cabeça e gestos de mãos variam; cenário, figurino e identidade da Luna permanecem reconhecíveis. Não é movimento de câmera sobre uma fotografia.
- **10 testes automatizados** do player aprovados: reprodução, bloqueio de autoplay, erro de mídia, pausa/reinício, silêncio, volume, término, descarte e escolhas das cartas. Os eventos de mídia são simulados nesses testes; o arquivo real foi verificado separadamente.
- IDs/recursos e sintaxe JavaScript verificados. QA visual da página em navegador não pôde ser repetido porque a infraestrutura de preview exigida para Sites não está disponível neste ambiente. Não foi validada a captura em Windows/OBS/Studio nesta atualização.

## O que ainda não está em produção

**Agradecimentos com nomes e LIVE autônoma em tempo real não foram ativados.** O plugin de geração de vídeos não configura automaticamente LiveAvatar em tempo real, fonte de eventos TikTok em nuvem ou credenciais desses serviços. O painel mostra os dois itens como pendentes.

A autorização para publicar não fornece essas contas/credenciais. Nenhuma configuração de nomes é falsificada, nenhum evento local é apresentado como evento da nuvem e nenhuma API paga nova foi contratada. O módulo `cloud/broker.mjs` continua uma preparação não roteada em produção; requer configuração dos fornecedores, autenticação do painel e implementação de transporte/recepção antes de ativar a operação contínua.

## Histórico da geração

Primeira tentativa: falhou por `locale=pt-BR` não aceito no mecanismo `heygen_voice`. Após nova aprovação do usuário, foi gerada uma segunda tentativa sem o parâmetro de locale; a voz continua sendo uma voz brasileira selecionada no catálogo. Foi reutilizado o mesmo avatar, sem criar duplicatas.
