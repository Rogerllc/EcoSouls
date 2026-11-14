# Eco Souls

Eco Souls é um jogo educativo sobre **coleta seletiva de lixo**, feito para rodar no navegador do computador.

> Projeto de desenvolvimento de um jogo, realizado na disciplina de **Projeto e Design de Interfaces**.

## Objetivo do jogo

O jogador precisa limpar quatro ambientes naturais (Rio, Praia, Cidade e Floresta) levando cada item de lixo até a lixeira correta antes que o ambiente o leve embora.

O jogo tem dois objetivos:

- **Objetivo do jogador:** resolver os 10 itens de cada missão, ganhar estrelas e medalhas e liberar as próximas fases.
- **Objetivo educativo:** ensinar a reconhecer o material de cada objeto (papel, plástico, vidro ou orgânico), saber em qual lixeira ele deve ser descartado e entender que pilhas e baterias precisam de um ponto de coleta especial.

## Como jogar

1. Toque em **Jogar** e escolha uma missão. Só o Rio começa liberado.
2. Veja o lixo aparecer na cena. Cada ambiente tem o seu obstáculo.
3. Leve cada item até a lixeira certa: **arraste e solte** o item, ou **clique no item** e depois na lixeira.
4. Cada acerto vale **25 pontos** e cada erro tira **10**.
5. Ao resolver os 10 itens, você ganha de 1 a 3 estrelas (9 ou 10 acertos = 3 estrelas; 7 ou 8 = 2; menos que isso = 1). Com 2 estrelas ou mais você conquista a medalha da fase e libera a próxima.

### Lixeiras

| Lixeira | Itens de exemplo |
| --- | --- |
| Papel (azul) | Jornal, caixa de papelão |
| Plástico (vermelha) | Garrafa PET, sacola plástica |
| Vidro (verde) | Garrafa de vidro, pote de vidro |
| Orgânico (marrom) | Casca de banana |
| Ponto de coleta (laranja) | Pilhas e baterias |

### Fases e obstáculos

| Fase | Obstáculo |
| --- | --- |
| 1. Rio | A correnteza leva o lixo para a direita. |
| 2. Praia | As ondas avançam sobre a areia e levam o lixo de volta ao mar. |
| 3. Cidade | O vento empurra o lixo para os lados, e o que sai da tela se perde. |
| 4. Floresta | O lixo cai das árvores e se perde se chegar ao chão. |

Em todas as fases, a velocidade do obstáculo aumenta a cada item resolvido.

### Controles

- **Mouse:** arrastar e soltar, ou clicar no item e na lixeira.
- **Esc:** pausa e continua a missão.
- **Botões da missão:** Pausar, Pedir dica (destaca a lixeira certa) e Sair.

## Recursos

- Quatro missões com obstáculos diferentes e dificuldade crescente.
- Pontos, estrelas, medalhas e troféus para cada fase.
- Perfil do jogador com nome, pontos totais, pontos por missão e troféus.
- Personalização: 6 avatares combinados com 7 acessórios.
- Progresso salvo automaticamente no navegador (`localStorage`).
- Tela de ajuda ("Como jogar") e tela de créditos ("Saiba mais").

## Como executar

Não há instalação nem dependências. Baixe o repositório e abra o arquivo `index.html` em um navegador moderno (Chrome, Edge, Firefox ou Safari).

Para que as fontes apareçam como no projeto, mantenha o arquivo `fontes.css` e os arquivos de fonte na mesma pasta. Sem eles, o jogo usa fontes de reserva do sistema.

## Estrutura do projeto

```
.
├── index.html   # estrutura das telas
├── style.css    # visual do jogo
├── fontes.css   # fontes do jogo (Modak e Fredoka)
├── game.js      # regras, missões, progresso e interações
└── README.md
```

## Tecnologias

- HTML, CSS e JavaScript puros, sem frameworks nem bibliotecas.
- SVG para cenários, itens de lixo, avatares, medalhas e troféus.
- Protótipo de interface feito no Figma.

## Criadores

Projeto desenvolvido pelos discentes:

- Gustavo Morais
- Kauan Nascimento
- Roger Leite

Projeto de desenvolvimento de um jogo da disciplina de Projeto e Design de Interfaces.

