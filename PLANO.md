# Planejamento e continuidade

## Objetivo

Criar **Tower Defense - Datas Comemorativas**, um jogo local para navegador inspirado nos
tower defenses tradicionais. A campanha tem os temas Dia das Bruxas,
Natal, Páscoa, Dia do Meio Ambiente, Carnaval e Festa Junina; os temas podem ser escolhidos livremente a qualquer momento (não são sequenciais).

## Decisões registradas

- **Tecnologia:** HTML, CSS e JavaScript sem framework ou dependências externas.
- **Execução:** local, em navegador; não há publicação ou serviço remoto previsto.
- **Persistência:** `localStorage` para guardar temas concluídos e o último tema no navegador
  atual. O estado de uma partida em andamento não é restaurado após fechar ou
  atualizar a página.
- **Regras:** valores iniciais provisórios para validar a dinâmica; podem ser
  ajustados após a demonstração.
- **Escopo incremental:** implementar e apresentar uma fase jogável por vez.
  Avançar para o tema seguinte somente após validação da etapa atual.

## Etapas

1. **Base, Dia das Bruxas e apresentação visual — entregue para validação:**
   interface local, preparação da defesa, 5 turnos (era 20), compras entre turnos,
   vitória/derrota, desbloqueio do Natal, trilha procedural opcional com controle
   liga/desliga, casas e personagens com relevo/sombras, movimento animado dos
   invasores e efeitos de projétil, impacto e destruição (respeitando redução de
   movimento). Rodada de refinamento: efeitos sonoros com botão próprio, música
   generativa variada (`audio.js`), casas quadradas de tamanho fixo, tabuleiro
   inclinado em 3D e painel de invasores com prévia da próxima onda e percentual
   de progresso. Natal e Páscoa ainda são apenas itens do seletor.
   - **Rodada de conteúdo e combate:** 7 defesas, 7 invasores com composição
     determinística por turno, invasores atacam defesas enquanto andam (sem
     parar), vida visível, reparo pago entre turnos, recompra livre de defesa
     destruída, decoração e ambiente no mapa.
   - **Rodada de variabilidade:** `servidor.sh` para rede local; 9 defesas com
     elementos/efeitos (queimar, atordoar, desarmar, veneno, lentidão, gelo,
     crítico, cura); invasores com fraquezas e imunidades (`mods`/`immune` em
     `ENEMIES`); bônus clicáveis durante turnos (`BONUS_*` no `game.js`);
     controle de volume (padrão 80%, salvo em `localStorage` na chave
     `tower-defense-feriados-volume-v1`). Equilíbrio ainda não ajustado em
     partida completa.
   - **Ajustes de ritmo:** 5 turnos por fase, passo do jogo 625 ms (-20%); advanceWave agora tem try/catch, checkWaveEnd e finishWave blindados (correção do turno que não concluía)
     (`TICK_MS`), bônus mais raros (5%/passo, máx. 2, duram 12 passos),
     menos decoração (28%) e botão "Reiniciar jogo" sempre visível.
   - **Rota e fim de turno:** `generatePath()` sorteia uma nova rota a cada
     abertura/reinício (validada em 3000 gerações: sem sobreposição ou
     encostos); banner + fanfarra ao concluir cada turno (`showWaveBanner`). Decisões do usuário: ataque sem
     parar; barra de vida + reparo pago; recompra livre.
2. **Validação da primeira fase — aguardando retorno:** ajustar regras,
   interface, efeitos visuais e erros encontrados antes de iniciar outro tema.
3. **Natal e Páscoa — implementados, aguardando validação:** temas selecionáveis a
   qualquer momento. Arquitetura: `TOWER_BASE`/`ENEMY_BASE` (mecânica comum) +
   `THEME_DEFS` em `game.js` (nomes, emojis, cores, mods/imunidades dos invasores,
   bônus, decoração, marcos); `applyTheme()` aplica o tema (tabelas `TOWERS`/`ENEMIES`,
   céu, `body[data-theme]` para o CSS e `GameAudio.setTheme()` para a música:
   perfis em `audio.js` — Halloween menor/senoidal, Natal maior/sinos, Páscoa
   lídio/pizzicato). Efeitos sonoros de tiro/voz seguem o arquétipo.
   Aviso ao iniciar turno com defesas danificadas/destruídas (`requestWave`).
   Animações de bob desaceleradas. Save v2 (migra o v1).
10. **Rodada 10 — mecânicas:** vender defesa, velocidade 1×/2×/3×, prévia de alcance,
   habilidades ativas, dificuldades, estrelas por tema, inimigos voadores (`air`),
   conquistas e salvamento da partida
   (`GAME_SAVE_KEY`). Equilíbrio ainda não validado em partidas completas.

11. **Rodada 11 — temas Carnaval e Festa Junina:** entradas em `THEME_DEFS`, céus em `buildSky`, perfis em `audio.js`, estilos `body[data-theme=...]`. Páscoa e Meio Ambiente foram diferenciados por cor. Mecânicas exclusivas por tema (ex.: chuva reduzindo fogo) ficam como ideia futura.
12. **Rodada 12 — splash e layout:** toast substituído por splash (`queueSplash`/`flushSplash`) com nova defesa, pesquisa e conquistas ao fim do turno; tabuleiro 12×8; `@media (max-height:520px) and (orientation:landscape)` com dock baixa; save guarda `cols`/`rows`.

Ao retomar o trabalho em outra máquina ou sessão, leia este arquivo e o
`README.md` na raiz do projeto. Preserve as decisões registradas e atualize o
estado desta sequência ao concluir ou alterar uma etapa.
13. **Rodada 13:** removida a segunda rota (`PATH_B`); clicar numa casa livre abre menu de construção (`openBuildMenu`).
14. **Rodada 14:** pedras podem ser explodidas (40 moedas, som `explosion`); versão v1.0 no rodapé; botão de compartilhar resultado/ranking na tela de vitória.

## Regras provisórias da primeira fase

- 10 turnos (ondas; 20 → 5 → 10 a pedido do usuário; `waveSize = 8 + nível`, `levelOf = (onda-1)*2+1`, moedas iniciais 550, recompensa 17+0,6*nível); o jogador compra e posiciona defesas na preparação inicial
  e entre ondas, mas não durante uma onda.
- 400 moedas iniciais (eram 220, depois 300). Defesas podem ser compradas e posicionadas também durante os turnos.
- 15 vidas; cada inimigo que atravessa o caminho remove uma vida.
- Defesas (preço / dano / alcance / vida): Lanterna 70/24/2,7/60; Gato mágico
  115/44/3,2/80; Morcego 90/14/3,6/45; Bruxa 150/30 (60% em área)/3/70;
  Caldeirão 100/9 (retarda)/2,4/95; Caçador 130/58/4,4/55; Lápide 45/0/–/240.
- Invasores por turno: `5 + ceil(nível*0,7)`; vida `(30 + nível*8) × fator`;
  dano às defesas × `(1 + nível*0,03)`. Tipos entram nos turnos 1, 2, 3, 5, 9 e
  12 **em "nível"**; `nível = (turno-1)*3+1` (`levelOf`), usado em quantidade, vida, dano e recompensa. Ogro (chefe) no turno 3 e dois no turno 5. Definições em
  `ENEMIES` e `TOWERS` no `game.js`.
- Inimigos ficam progressivamente mais resistentes; eliminar inimigos concede
  moedas.
- Completar a quinta onda vence a fase; perder todas as vidas encerra a
  tentativa. A fase pode ser reiniciada.

4. **Rodada 10 turnos:** 10 turnos por mapa, ondas maiores, tela de parabéns (`showCongrats`) e fundo da página por tema (`body[data-theme]`). Aguardando validação.

5. **Rodada identidade/pausa/derrota:** logo e rodapé Helena Games, pausa (`setPaused`, `GameAudio.setPaused`), tela de derrota (`showDefeat`). Aguardando validação.

6. **Rodada tabuleiro/loja/pesquisa/tema Meio Ambiente — aguardando validação:**
   - Título "Tower Defense - Datas Comemorativas".
   - Tabuleiro 12×8 (`COLUMNS`/`ROWS`), rota com 3–5 curvas (A 18–36 casas, B 14–28, união ≤44); `placeRocks()` sorteia `ROCK_COUNT` pedras ao lado do caminho (`rockSet`), que bloqueiam construção.
   - Loja movida para barra fixa (`.shop-dock`) abaixo do mapa, com os botões de turno/pausa/reparo/reiniciar.
   - Liberação gradual: `START_TOWERS = 2` e `UNLOCK_ORDER`; nova defesa por turno concluído, anunciada em `concludeWave`.
   - Reparo individual: clicar na defesa abre o inspetor (`renderInspector`/`repairTower`); só entre turnos.
   - Pesquisa: `game.research` (níveis aplicados) e `game.pendingResearch` (pagas, aplicadas em `beginWave` via `applyResearch`); decisão do usuário: "próxima fase" = turno seguinte no mesmo mapa. Níveis até `RESEARCH_MAX_LEVEL = 3`, bônus em `RESEARCH_BONUS`.
   - Tema `ambiente` em `THEME_DEFS`, CSS `body[data-theme="ambiente"]` e perfil musical em `audio.js`.
7. **Rodada tutorial/cancelar:** modal de tutorial automático na 1ª visita + botão no cabeçalho, botão/tecla Esc para cancelar seleção de defesa, fundo do selo "Jogo local". Aguardando validação.
8. **Rodada áudio/otimização:** agendador musical resistente a travamentos (`LOOKAHEAD`, Worker em `startScheduler`) e `build.sh` para gerar `dist/` minificado. Aguardando validação em celular.
9. **Rodada layout mobile:** loja fixa e compacta no rodapé, tabuleiro menor (bloco `@media (max-width: 850px)` ao fim de `styles.css`). Aguardando validação em celular.
10. **Rodada animações de combate e status:**
    - Recuo e pulso de disparo nas defesas ao atacar (`recoil` + brilho no topo).
    - Investida (*lunge*) de ataque dos invasores ao atacar defesas.
    - Reação de dano no invasor (*flinch / damage flash*) ao ser atingido.
    - Onda de choque expansiva (*shockwave ring*) para dano em área (*splash*), acertos críticos e meteoro.
    - Pulso de cura / reparo esmeralda ao reparar defesas ou usar cura.
    - Brilho de evolução estelar ao pesquisar e aprimorar nível das defesas.
    - Tremor de alerta e brilho pulsar para defesas em estado crítico (< 40% vida).
    - Animações vivas de status: chamas oscilantes (`burn`), pulsação ácida (`poison`), lentidão gélida (`slow`), tremor de desarme (`disarm`) e brilho do cubo de gelo (`freeze`).
    - Animações de habilidades especiais: chuva de meteoros cruzando o céu, vinheta de nevasca no congelamento geral e aura esmeralda na cura geral.
11. **Rodada correções pedras, voadores e splash:**
    - Limpeza de enfeites ao explodir pedra: casas onde pedras foram destruídas passam a integrar `blastedRocks` e nunca recebem decorações abaixo.
    - Rota direta dos voadores até a saída: inimigos voadores seguem trajetória aérea direta da porta de entrada (`PATH[0]`) até a porta de saída do mapa (`PATH.at(-1)`), marcada também com `🚪`.
    - Fila sequencial de splash screens: múltiplos anúncios de fim de turno (nova defesa, pesquisa e conquistas) são apresentados sequencialmente em telas paginadas com botão "Próximo (X/Y) ➔" e rolagem protegida.
