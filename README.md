# Tower Defense - Datas Comemorativas

Jogo de tower defense para navegador, executado localmente e sem dependências
externas. O código e a documentação deste projeto ficam nesta pasta.

## Executar

Abra `index.html` no navegador. Para executar por um servidor local, escolha
uma das opções:

```sh
python3 -m http.server 8000
```

Acesse <http://localhost:8000>.

### Versão otimizada (minificada)

```sh
./build.sh
python3 -m http.server 8000 --directory dist
```

O script gera `dist/` com `audio.js`, `game.js`, `styles.css` e `index.html`
minificados (cerca de 25% menores no total) usando `terser` e `clean-css-cli`
via `npx` (requer Node.js e internet na primeira execução). `dist/` fica fora
do git; refaça o build após alterar o código.

### Servidor na rede local

```sh
./servidor.sh        # porta 8000
./servidor.sh 9000   # outra porta
```

O script (na raiz do projeto) serve a pasta em `0.0.0.0` e imprime
os endereços `http://localhost:PORTA` e `http://IP-DA-MAQUINA:PORTA` para abrir
em outros aparelhos da mesma rede. Pode ser necessário liberar a porta no
firewall. Não há autenticação: use apenas em redes confiáveis.

## Estado atual

Os seis temas são jogáveis: **Dia das Bruxas**, **Natal**, **Páscoa**, **Dia do Meio Ambiente**, **Carnaval** e **Festa Junina**. Os temas
**não são sequenciais**: escolha qualquer um no painel "Escolha o tema" a
qualquer momento (trocar de tema durante uma partida pede confirmação e gera
nova rota). Concluir os 10 turnos de um tema o marca como "Concluído ✓" no
`localStorage` (chave `tower-defense-feriados-save-v2`; o último tema jogado
também é lembrado).

Cada tema tem defesas, invasores, bônus, decoração, céu, cores do mapa e trilha
musical próprios. A mecânica das defesas é a mesma (9 arquétipos com os mesmos
efeitos e preços); os invasores têm fraquezas/imunidades diferentes por tema.
Ao iniciar um turno com defesas danificadas ou destruídas sem recompra, o jogo
pede confirmação.

Use **Ativar música** no cabeçalho para ouvir a trilha procedural de Halloween
(`audio.js`). Ela é gerada em tempo real, com progressões, arpejos, melodia,
baixo, percussão e vento variando por seção, e fica mais intensa durante os
turnos. Começa somente após o clique, respeitando as permissões de áudio do
navegador. **Efeitos** liga/desliga os sons de ação (disparos, impacto,
destruição, posicionar defesa, erro, escape, início/fim de turno, vitória e
derrota); ficam ligados por padrão. Nenhum arquivo de áudio ou dependência
externa é usado.

O tabuleiro tem casas quadradas de tamanho fixo e visão inclinada em 3D, com
relevo, sombras e personagens "em pé". Projéteis, impactos e partículas dão
retorno visual aos ataques; os efeitos de movimento são reduzidos quando o
navegador pede isso. O painel **Invasores** mostra, na preparação, a prévia
da quantidade do próximo turno; durante o turno, total, restantes, derrotados,
escaparam, o percentual de progresso da onda e a quantidade do turno seguinte.

### Mecânicas de jogabilidade (rodada 10)

- **Vender defesa:** no inspetor, devolve 60% do preço (`SELL_RATE`).
- **Velocidade 1×/2×/3×:** botão ⏩ ao lado de "Iniciar turno" (`startLoop()` usa `TICK_MS / gameSpeed`).
- **Prévia de alcance:** passe o mouse numa defesa ou, com uma defesa da loja selecionada, numa casa livre.
- **Habilidades ativas** (durante o turno, com recarga): ☄️ Meteoro (tecla `1`, dano em todos), ❄️ Congelar (`2`), 💖 Curar (`3`).
- **Dificuldade:** Fácil (700 moedas/20 vidas), Normal (550/15), Difícil (450/10, inimigos +25% vida e dano).
- **Estrelas por tema:** ★★★ com ≥80% das vidas, ★★ com ≥40%, ★ no restante; melhor resultado salvo.
- **Inimigos voadores** (a partir do turno 5): voam em linha reta e só são atingidos por defesas com `air: true` (morcego, gato, bruxa, caçador).
- **Rota única:** a segunda rota (antiga `PATH_B`) foi removida por ser confusa; voadores seguem a linha reta `SKY`.
- **Explodir pedras:** clicar numa pedra oferece "💥 Explodir pedra" por 40 moedas (`ROCK_BLAST_COST`), com efeito sonoro `explosion`; o espaço fica livre.
- **Compartilhar:** os botões "📤 Compartilhar conquistas" (painel 🏆 Conquistas e tela de vitória) geram um cartão PNG 1080×1350 via canvas (`renderShareImage`: ranking por estrelas — Aprendiz Corajoso / Defensor Valente / Guardião Lendário —, temas, conquistas e link) e o enviam pelo compartilhamento nativo do navegador (Web Share com arquivo). Sem suporte, baixa o PNG e copia o texto. O rodapé mostra a versão (v1.0).
- **Construção direta:** clicar numa casa livre abre um menu com as defesas liberadas (`#build-menu`); a loja continua funcionando.
- **Conquistas** 🏆 (12, botão no cabeçalho) e **salvar partida** automático entre turnos (chave `tower-defense-feriados-game-v1`, apagada em vitória/derrota e restaurada ao abrir o site).

### Defesas, invasores e ataques às defesas

- **9 defesas**, cada uma com elemento e efeito próprio: Lanterna 🎃 (fogo,
  queima), Gato mágico 🐈‍⬛ (arcano, 30% de atordoar), Morcego 🦇 (físico,
  desarma), Bruxa 🧙 (arcano em área + veneno), Caldeirão 🫕 (veneno, retarda),
  Cristal gélido 🧊 (gelo, congela ou retarda), Caçador 🏹 (físico, 20% de
  crítico), Vela benta 🕯️ (cura defesas próximas) e Lápide 🪦 (escudo que atrai
  ataques).
- **7 invasores** com fraquezas, resistências e imunidades: Fantasma (resiste a
  físico, imune a veneno), Aranha (fraca a fogo), Zumbi (imune a veneno e
  atordoamento), Esqueleto (resiste a físico, imune a queimadura), Vampiro
  (fraco a fogo, imune a congelamento), Palhaço sinistro (imune a desarmar) e
  Ogro (chefe nos turnos 3 e 5; efeitos duram metade, imune a atordoar). O
  painel **Invasores** mostra a composição do turno; passe o mouse nos ícones
  para ver as fraquezas.
- **Status** visíveis sobre os invasores: ❄️ congelado e 💫 atordoado (não andam
  nem atacam), 🔇 desarmado (anda, mas não ataca), 🐌 lento, 🔥 queimando e ☠️
  envenenado (dano por tick). Avisos flutuantes: Fraco!, Resiste, Imune!,
  Crítico!.
- Os invasores **atacam as defesas mais próximas enquanto caminham**. Cada
  defesa tem barra de vida; destruída, a vaga fica livre e pode ser comprada de
  novo entre turnos. **Reparar defesas** custa 0,5 moeda por ponto de vida.
- **Bônus no mapa:** durante os turnos surgem 🍬 💰 💎 em casas livres; clique
  para ganhar moedas antes que sumam (cerca de 6 s).
- **Volume:** controle no cabeçalho (padrão 80%, bem mais alto que antes); o
  valor fica salvo no navegador. Música e efeitos continuam com botões próprios.
- **Tabuleiro:** 12 × 8 casas (reduzido na rodada 12 para facilitar o mobile), com rota de 3–5 curvas e 8 pedras.
- **Splash de novidades:** ao fim de cada turno aparece uma janela com a nova defesa liberada, a pesquisa realizada e as conquistas alcançadas.
- **Layout paisagem no celular:** cabeçalho compacto, tabuleiro sem inclinação e loja em faixa baixa (só emoji + preço).
- Jogos salvos de versões anteriores (outra geometria de tabuleiro) são descartados.
- **Pedras:** 10 pedras 🪨 sorteadas em casas vizinhas ao caminho (inclusive diagonais) a cada partida/reinício; bloqueiam a construção e não recebem bônus nem decoração.
- **Loja junto ao mapa:** a loja de defesas e os botões de turno/pausa/reparo/reiniciar ficam numa barra logo abaixo do tabuleiro, fixa (sticky) na tela enquanto se rola a página. Cada defesa mostra emoji, nome, vida, dano e preço; passe o mouse para ver a descrição.
- **Liberação gradual de defesas:** o turno 1 de cada mapa começa com apenas 2 defesas (Lanterna e Caldeirão); uma nova é liberada a cada turno concluído (ordem: Morcego, Vela benta, Gato mágico, Cristal gélido, Caçador, Lápide, Bruxa; todas disponíveis no turno 8). A nova defesa é anunciada no banner e na mensagem de fim de turno. Defesas bloqueadas aparecem com 🔒 e o turno de liberação.
- **Reparo individual:** clique em uma defesa no mapa (sem ter uma defesa da loja selecionada) para ver sua vida e o botão "Reparar" com o custo (0,5 moeda por ponto de vida); só entre turnos. O reparo geral continua disponível.
- **Pesquisa de evoluções:** painel "Pesquisa" na lateral lista as defesas já liberadas. Cada tipo tem até 3 níveis (custo = preço × 1,5 × (nível-1) para o nível desejado, ou seja, 1,5× o preço no nível 2 e 3× no nível 3); o custo é pago na hora e a evolução vale **somente a partir do início do turno seguinte**, para todas as defesas do tipo (já colocadas e futuras): +30% de dano (ou cura), +25% de vida e +0,25 de alcance por nível. Defesas evoluídas mostram ★ no mapa. A pesquisa é reiniciada junto com a partida.
- **Tutorial:** na primeira visita (flag `tower-defense-feriados-tutorial-v1` no `localStorage`) abre uma janela "Como jogar"; o botão **Tutorial** no cabeçalho a reabre a qualquer momento.
- **Música igual no desktop e no celular:** o agendador das notas usa folga de 1,2 s e um relógio em Web Worker (com fallback para `setInterval`), pois no celular o thread principal atrasava os timers e a música perdia passos e ficava mais lenta.
- **Mobile (até 850 px):** margens menores, tabuleiro menos inclinado e mais baixo, e a loja vira uma barra compacta fixa no rodapé da tela (defesas em fileira rolável, botões lado a lado), sempre à mão enquanto se toca no mapa.
- **Ícone da página:** `icon.svg` (favicon: torre, abóbora e pinheiro sobre o degradê do logo) e `icon-180.png` (ícone de atalho no iOS/Android).
- **Cancelar seleção:** com uma defesa da loja selecionada aparece o botão "Cancelar seleção"; a tecla **Esc** também cancela (e fecha o tutorial ou o painel de reparo).
- **Compras durante o turno:** defesas podem ser compradas e posicionadas a
  qualquer momento, inclusive com os invasores em campo (reparo continua só
  entre turnos). Começa-se com 550 moedas.
- **Vozes dos invasores:** cada tipo tem som próprio de entrada e de
  destruição, tocado sempre (sem sorteio nem limite de intervalo).
- **Rota aleatória:** o caminho dos invasores é gerado ao abrir o jogo e a
  cada reinício (trechos em escada, 17 a 32 casas, sempre de uma borda à outra
  e sem trechos encostando uns nos outros). A decoração também muda.
- **Fim de turno:** banner animado com faíscas ("Turno N concluído!", derrotados
  e prévia do próximo) e fanfarra sonora; a vitória da fase tem banner próprio.
- **Reiniciar jogo** (loja de defesas): volta ao começo da fase (turno 0, moedas
  e vidas iniciais), pedindo confirmação se houver partida em andamento. Os
  temas concluídos são mantidos.
- Cada fase tem **10 turnos** (9 invasores no primeiro, 28 no último; chefes nos turnos 3, 5, 8 e 10); a dificuldade sobe gradualmente (ritmo de jogo: 0,625 s por passo). Animações de "respiração" dos elementos foram desaceleradas.
- O mapa tem decoração temática (reduzida), lua, morcegos voando e névoa. Os ícones de decoração nunca repetem os dos bônus coletáveis (nem os das defesas), para não confundir.

Consulte [PLANO.md](PLANO.md) para decisões, regras provisórias e sequência de
implementação. A próxima etapa depende da validação desta entrega.

- Ao concluir os 10 turnos aparece uma tela de **parabéns** com confete e resumo. O fundo da página muda com o tema (Halloween escuro, Natal azul gelo, Páscoa pastel, Meio Ambiente verde).

- **Carnaval:** defesas de folia (Confete-canhão, Passista, Tucano folião, Rainha da bateria, Tamborim, Raspadinha, Rei Momo, Caipirinha curativa, Carro alegórico) contra Fantasma de confete, Rato folião, Ressaca, Esqueleto de fantasia, Drácula de bloco, Pierrô sombrio, Serpentina voadora e o Boneco gigante (chefe); tabuleiro violeta com caminho dourado, confete caindo e trilha de samba (dórica, rápida).
- **Festa Junina:** Fogueira, Balão junino, Pipa, Sanfoneira, Panela de canjica, Bloco de gelo, Arqueiro caipira, Quentão curativo e Fardo de palha contra Assombração do milharal, Escorpião, Boi bravo, Espantalho zumbi, Lobisomem, Quadrilheiro rebelde, Balão-fantasma e a Mula sem cabeça (chefe); chão de palha com caminho de terra vermelha e trilha de forró (mixolídia).
- **Dia do Meio Ambiente:** defesas da natureza (Energia solar, Coruja sábia, Arara, Cientista, Poço de água, Urso polar, Águia, Muda de árvore, Barreira de bambu) contra poluidores (Nuvem de fumaça, Rato do lixão, Barril tóxico, Motosserra, Caminhão poluidor, Incendiário e a Escavadeira gigante como chefe); caminho em forma de rio e trilha musical própria.
- **Pausa:** botão "⏸ Pausar jogo" (ou tecla **P**) durante um turno congela invasores, defesas e áudio; tela "Jogo pausado" com botão Continuar.
- **Derrota:** ao perder todas as vidas aparece a tela "Você perdeu!" com resumo e botão "Tentar novamente" (nova rota).
- **Rodapé:** logo "Helena Games" (`logo-helena-games.svg`: torre com abóbora, pinheiro e ovo) e crédito "Produzido por Helena Games".

## Cartão de divulgação

`divulgacao/cartao.png` (e `cartao.svg`) é um cartão de 90 × 55 mm com o endereço do jogo e um QR Code. Para
gerar de novo (ex.: se o endereço mudar), execute `./divulgacao/gerar-cartao.py` (instala o `segno` num `.venv` local sozinho; requer Chrome).

Para imprimir, `./divulgacao/gerar-pdf-a4.py` gera `divulgacao/cartoes-a4.pdf`: uma folha A4 com 10 cartões
(2 × 5, 90 × 55 mm cada) e marcas de corte nas margens. Imprima a 100% (sem "ajustar à página").
