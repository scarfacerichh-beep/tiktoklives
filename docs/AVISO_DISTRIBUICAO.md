# Alerta de antivírus — distribuição suspensa

Em 09/11/2026 o usuário reportou bloqueio no navegador, com a mensagem **“Não foi possível baixar — Vírus detectado”**, ao baixar o ZIP 4.3. O nome da ameaça e o arquivo interno apontado pelo antivírus ainda não foram informados.

## Medidas tomadas

- Os quatro ZIPs com inicializador compilado foram retirados da versão atual da pasta downloads do GitHub. O histórico Git permanece como evidência; isso não significa remoção completa de cópias históricas ou de arquivos já baixados.
- O README passou a alertar sobre a suspensão. Não é recomendado restaurar/permitir o arquivo bloqueado ou desativar proteções.
- As edições em código-fonte 4.3.1 e 4.4 contêm código e recursos do jogo, sem inicializador `.exe`, runtime embutido, `.dll` ou `.pyd`. Não é o ZIP bloqueado renomeado ou protegido por senha. Os scripts `.bat` são legíveis e usam exclusivamente o Python instalado separadamente pelo usuário; recusam uma pasta que ainda contenha o inicializador antigo.

## O que foi conferido e o que não foi

O código do inicializador foi revisado: ele localiza a pasta, inicia o Python local com servidor.py e aguarda o processo. As importações do PE foram inspecionadas. Os 35 arquivos do runtime foram comparados com o arquivo oficial do Python.org anteriormente baixado: binários correspondem; o arquivo `python312._pth` foi alterado para acrescentar a pasta do jogo ao caminho de importação.

Essa revisão é limitada. Não houve varredura Microsoft Defender, nenhum antivírus de assinatura está disponível neste ambiente, e o executável não foi executado em Windows aqui. Não é possível confirmar falso positivo, atribuir a causa ao inicializador ou declarar o ZIP anterior seguro. Os testes funcionais e a comparação SHA-256 não demonstram ausência de malware.

A inspeção estática do código do jogo identificou as conexões locais previstas (servidor HTTP em 127.0.0.1 e WebSocket TikFinity em localhost). Isso também não equivale a certificação de segurança.

### Identificadores preservados para investigação

- ZIP 4.3: `0af237fd0af7f3d029ad09c1c805e3b4b17c348340a52b2a574a9166bf7fc7c4`
- Inicializador 4.3: `8481f1345160652a20b403f6f15bcf1077b702c960765235544b4eac77bd78c2`

O usuário foi orientado a consultar Segurança do Windows → Proteção contra vírus e ameaças → Histórico de proteção, para informar o nome exato da detecção. Não foram enviados arquivos para serviços externos de análise.

## Edição em código-fonte

Requer Python 3.11+ instalado separadamente a partir de https://www.python.org/downloads/windows/ . Não baixa um instalador automaticamente, não pede exceções no antivírus e não altera políticas de segurança.

Extraia em pasta nova e use `INICIAR_INTERALIVES_QI.bat`, ou revise os scripts e execute `py -3 servidor.py --open`. Essa edição ainda precisa ser verificada pelo antivírus do usuário; ausência de binários compilados não é garantia universal de segurança. Se houver novo alerta, mantenha o bloqueio e informe o nome da ameaça.

O jogo, cores, mensagens, ranking e voz são mantidos. Somente o método de inicialização e distribuição mudou. O `.bat` e a instalação do Python não foram executados em Windows neste ambiente Linux.
