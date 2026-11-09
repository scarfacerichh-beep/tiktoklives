# Diagnóstico inicial para investigação (não são falhas comprovadas)

- Código V3 concentrado em `index.html` (~60 KB); conferir separação de responsabilidades e acessibilidade.
- `BroadcastChannel('interalives-qi-studio-v2')` envia snapshots de 170 em 170 ms; revisar robustez e custo, inclusive quando o visor é aberto depois.
- Eventos TikFinity são recebidos do WebSocket local; confirmar payloads de presentes e comportamento `repeatEnd` com exemplos reais.
- Presentes por nome ou ID: melhorar mapeamento e tornar o comportamento observável/configurável.
- Testes reais com TikFinity no computador do usuário, áudio em Live Studio, taxa de quadros e conteúdo de vídeo não foram feitos neste ambiente.
- Verificar validade de questões (inclusive `hints`) e rodadas de memória sob perda de foco do navegador.

O objetivo é corrigir com testes, sem pressupor que estes tópicos já estão quebrados.
