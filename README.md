# 🛍️ AgileShop — Catálogo de Produtos

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-embarcado-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Vitest](https://img.shields.io/badge/Testes-+70%25_cobertura-6E9F18?style=flat-square&logo=vitest&logoColor=white)]()

Aplicação web fullstack de gerenciamento de catálogo de produtos para uma loja virtual. Conta com CRUD completo, carrinho de compras, filtros avançados com slider de preço, dashboard analítico com gráficos, página de detalhe de produto com similares, layout adaptativo (sidebar/colunas), dark mode e cobertura de testes superior a 70%.

---

## 📋 Índice

- Tecnologias
- Funcionalidades
- Como Executar
- Estrutura de Pastas
- Endpoints da API
- Testes
- Decisões Técnicas

---

## 🚀 Tecnologias

### Backend

| Tecnologia | Versão | Motivo |
|---|---|---|
| .NET | 10.0 | Requisito do desafio. Alta performance, ecossistema maduro |
| Entity Framework Core | 8.x | ORM Code First com Migrations — evolução controlada do schema |
| SQLite | — | Banco embarcado, zero configuração, roda em qualquer OS |
| Data Annotations | — | Validações declarativas direto nas entidades |
| xUnit | — | Framework de testes unitários padrão do ecossistema .NET |

### Frontend

| Tecnologia | Versão | Motivo |
|---|---|---|
| React | 18+ | Requisito do desafio. Biblioteca consolidada no mercado |
| Vite | 5.x | Bundler ultrarrápido, HMR instantâneo |
| TypeScript | 5.x | Tipagem estática, menos bugs em runtime, melhor DX |
| TailwindCSS | 3.x | Alta produtividade; classes seguem o guia visual fornecido |
| React Hook Form + Zod | — | Validação performática com schema tipado como source of truth |
| Axios | — | Cliente HTTP com interceptors para tratamento global de erros |
| Context API | — | Gerenciamento de estado leve e adequado à complexidade do projeto |
| Recharts | — | Biblioteca de gráficos para o dashboard analítico |
| Vitest + Testing Library | — | Testes unitários e de componentes no frontend |

---

## ✅ Funcionalidades

### Catálogo de Produtos

- Grid responsivo com skeleton loading (1 coluna mobile → 2 tablet → 3-4 desktop)
- Busca por nome com **autocomplete e highlight** do termo digitado na Navbar
- Filtro por categoria, disponibilidade e ordenação
- **Filtro de preço com slider duplo interativo** (arrastar handles min/max) + presets rápidos (Até R$500, R$500–R$3k, etc.)
- Layout adaptativo: em desktop os filtros ficam em uma **sidebar fixa lateral**; em mobile/tablet os filtros aparecem em **linha acima do grid**
- Paginação com navegação Anterior / Próxima

### Cards de Produto

- Exibição de imagem, nome, preço formatado, categoria e status de estoque
- Indicador visual de estoque baixo (⚠️ 1–9 unidades)
- Badge "Indisponível" para produtos com `ativo = false` ou `estoque = 0`
- Cards com `opacity: 0.6` para produtos inativos
- Hover com elevação suave (shadow + translate) em todos os cards
- Clique no card navega para a **página de detalhe do produto**

### Página de Detalhe do Produto

- Layout estilo Amazon: imagem à esquerda, informações à direita
- Exibe nome, preço, descrição, categoria, estoque, status e data de cadastro
- Badges de status (Ativo/Inativo, Em estoque/Estoque baixo/Indisponível)
- Botões de editar, excluir e **Adicionar ao Carrinho** (desabilitado se indisponível)
- Seção de **Produtos Similares** (mesma categoria, até 4 cards)
- Fallback visual com ícone para produtos sem imagem

### Carrinho de Compras

- Drawer deslizante pela direita com overlay e blur no fundo
- Adicionar produto ao carrinho pelo card ou pela página de detalhe
- Controles de quantidade (+/−) com respeito ao limite de estoque do produto
- Aviso inline quando o limite de estoque é atingido
- Remoção de item individual e botão "Limpar" todo o carrinho
- Totalizador de itens e preço em tempo real
- Badge com contador de itens no ícone da Navbar (exibe "99+" para valores altos)
- Fecha ao clicar no overlay ou pressionar `Escape`

### Formulário de Produto (Criar/Editar)

- Modal centralizado com validação via **React Hook Form + Zod**
- Campos: nome, descrição, preço, estoque, categoria (select com 10 opções + "Outros" com input livre)
- Validações: nome obrigatório (máx 100), preço > R$0,01, estoque ≥ 0, categoria obrigatória
- **Preview da imagem em tempo real** com debounce de 500ms ao digitar a URL
- Fallback visual com ícone `ImageOff` para URLs inválidas
- Botão "Salvar" com cor e sombra dinâmicas: verde com glow quando o formulário é válido, acinzentado quando inválido ou salvando
- Toggle ativo/inativo disponível somente na edição
- Botão "Novo Produto" com animação spring no clique e rotação do ícone `+`

### Exclusão de Produto

- Modal de confirmação exibindo o nome do produto
- Ação irreversível com mensagem clara ao usuário

### Dashboard Analítico

- Cards de métricas: total de produtos, valor total em estoque, produtos com estoque baixo e indisponíveis
- **Gráfico de barras** (Recharts) com produtos por categoria, tooltip customizado e cores distintas por barra
- Tabela de **Atenção ao Estoque**: produtos críticos ordenados por estoque crescente com badges de status
- Listas dos **3 produtos mais caros** e **3 mais baratos**
- Estado vazio com CTA para ir ao catálogo quando não há produtos cadastrados

### Interface e UX

- **Logo responsiva**: ícone compacto em mobile, logo horizontal completa (versão clara/escura) em desktop
- **Dark mode** com alternância via botão na Navbar
- Hover em todos os elementos interativos (cards, botões, links, inputs, selects)
- Toast de sucesso animado (entrada com spring, saída com fade) para criação e edição
- Estados de loading (skeleton grid), erro (mensagem + botão retry) e lista vazia (ícone + mensagem)
- Scroll bloqueado no `body` enquanto o drawer do carrinho está aberto

---

## ⚙️ Como Executar

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)

### Backend

```bash
cd Backend/AgileShop
dotnet restore
dotnet ef database update
dotnet run
```

API disponível em: `http://localhost:5266`
Swagger: `http://localhost:5266/swagger`

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

App disponível em: `http://localhost:5173`

> **Atenção:** inicie o backend antes do frontend para que as chamadas à API funcionem corretamente.

---

## 📁 Estrutura de Pastas

```
AgileShop/
├── Backend/
│   ├── AgileShop/
│   │   ├── Controllers/        # Endpoints REST (ProdutosController)
│   │   ├── Models/             # Entidade Produto
│   │   ├── DTOs/               # Contratos de entrada/saída da API
│   │   ├── Data/               # AppDbContext
│   │   ├── Migrations/         # Histórico de migrations do EF Core
│   │   └── Program.cs
│   └── AgileShop.Tests/        # Testes unitários do backend (xUnit)
│
└── Frontend/
    └── src/
        ├── components/
        │   ├── ProductCard.tsx         # Card com hover, badges e ações
        │   ├── ProductGrid.tsx         # Grid com skeleton, erro e estado vazio
        │   ├── ProductFilters.tsx      # Filtros em linha (mobile/tablet)
        │   ├── ProductSidebar.tsx      # Sidebar de filtros (desktop)
        │   ├── PriceRangeFilter.tsx    # Slider duplo de faixa de preço
        │   ├── ProductForm.tsx         # Modal criar/editar com preview de imagem
        │   ├── ConfirmModal.tsx        # Modal de confirmação de exclusão
        │   ├── CartDrawer.tsx          # Drawer do carrinho de compras
        │   ├── NavBar.tsx              # Navbar com busca, autocomplete e carrinho
        │   └── SuccessToast.tsx        # Toast animado de sucesso
        ├── context/
        │   ├── ProductContext.tsx      # Estado global de produtos + filtragem client-side
        │   └── CartContext.tsx         # Estado global do carrinho
        ├── pages/
        │   ├── ProductsPage.tsx        # Página principal do catálogo
        │   ├── ProductDetailPage.tsx   # Página de detalhe + similares
        │   └── DashboardPage.tsx       # Dashboard analítico com gráficos
        ├── services/
        │   └── productService.ts       # Chamadas à API + buildParams
        ├── helpers/
        │   └── request.ts              # Wrapper do fetch com tratamento de ApiError
        ├── hooks/
        │   └── useTheme.ts             # Hook de dark mode
        ├── types/
        │   └── product.ts              # Tipos Product, ProductQuery, DTOs
        └── tests/                      # Testes unitários para as funcionalidades mais importantes do sistema
            ├── CartContext.test.tsx    # Carrinho: adicionar, remover, limpar, totais e limites de estoque
            ├── ProductCard.test.tsx    # formatPrice (milhar, centavos) e StockLabel (estados de estoque)
            ├── productService.test.ts  # buildParams: montagem e sanitização da query string
            ├── request.test.ts         # Wrapper fetch: respostas ok, erros tipados e ApiError
            └── setup.ts
```

---

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/produtos` | Listar produtos (aceita filtros via query string) |
| `GET` | `/api/produtos/{id}` | Buscar produto por ID |
| `POST` | `/api/produtos` | Criar novo produto |
| `PUT` | `/api/produtos/{id}` | Atualizar produto existente |
| `DELETE` | `/api/produtos/{id}` | Deletar produto |
| `GET` | `/api/produtos/categorias` | Listar categorias disponíveis |

**Exemplo com filtros:**
```
GET /api/produtos?name=notebook&category=Eletrônicos&pageNumber=1&pageSize=8
```

> A filtragem por disponibilidade e faixa de preço é aplicada no frontend via `ProductContext`, aproveitando o payload completo já carregado em memória.

---

## 🧪 Testes

Cobertura total superior a **70%**, com testes unitários no backend e no frontend.

### Backend (xUnit)

```bash
cd Backend/AgileShop.Tests
dotnet test
```

Cobre controllers e camada de serviço, verificando casos de sucesso, validações e erros esperados nos endpoints.

### Frontend (Vitest + Testing Library)

```bash
cd Frontend
npm run test
```

| Arquivo de teste | O que cobre |
|---|---|
| `CartContext.test.tsx` | Adicionar item, incrementar quantidade, limite de estoque, remover, `clearCart`, `totalItems`, `totalPrice`, `updateQuantity` com clamp |
| `ProductCard.test.tsx` | `formatPrice` (separadores, centavos, milhões), `StockLabel` (em estoque, estoque baixo, sem estoque, inativo) |
| `productService.test.ts` | Montagem de query string: parâmetros `undefined`, strings vazias, numéricos, valor `0` como válido |
| `request.test.ts` | Respostas ok, erro com `message`, erro com `title`, erro genérico com status, `ApiError` tipado, método e body passados corretamente |

---

## 🧠 Decisões Técnicas

### Por que Vite + React e não Next.js?

Next.js é ótimo para sites que precisam de SEO, páginas estáticas ou carregamento no servidor. Esse projeto é um painel administrativo, não precisa de nada disso. O Vite sobe na hora, tem hot reload instantâneo e não carrega nenhuma complexidade desnecessária. Uso Next.js em outros projetos quando faz sentido, mas escolher a ferramenta certa para o contexto importa mais do que usar a mais sofisticada disponível.

### Por que SQLite e não SQL Server LocalDB?

SQLite é um arquivo `.db` que fica dentro do próprio projeto. Não precisa instalar nada, não precisa configurar nada, qualquer pessoa que clonar o repositório consegue rodar imediatamente. O LocalDB é Windows-only e exige configuração extra, o que cria atrito desnecessário.

### Por que Context API e não Redux?

O estado da aplicação é relativamente simples: uma lista de produtos e um carrinho. Redux resolve bem problemas de escala, mas traz um boilerplate considerável para um projeto desse tamanho. A Context API com `useMemo` e `useCallback` resolve tudo isso com menos código e mais clareza. O `ProductContext` centraliza toda a filtragem em memória via `applyFilters`, evitando chamadas repetidas à API a cada interação de filtro.

### Por que React Hook Form + Zod?

React Hook Form trabalha com campos não-controlados, o que evita re-renders a cada tecla digitada. O Zod define o schema de validação uma única vez, e esse mesmo schema gera os tipos TypeScript via `z.infer`, sem duplicação, sem inconsistência entre validação e tipagem.

### Por que o fetch é centralizado no `request.ts`?

Toda chamada à API passa pelo mesmo wrapper. Isso garante que o header `Content-Type`, o tratamento de erros e o `ApiError` tipado (com `status` + `message`) sejam consistentes em toda a aplicação. Qualquer mudança global nesse comportamento acontece em um único lugar.

### Filtragem client-side vs. server-side

Todos os produtos são carregados uma única vez na memória. Filtrar, ordenar e paginar localmente torna a experiência instantânea, sem spinner a cada mudança de filtro. Para catálogos com muitos produtos essa abordagem não escala, mas a estrutura do `ProductQuery` já está preparada para mover a filtragem para o backend sem grandes refatorações.

### Layout adaptativo: sidebar vs. filtros em linha

Em telas grandes (`lg:`) os filtros ficam numa sidebar lateral permanente com todas as opções visíveis. Em mobile e tablet os mesmos filtros aparecem compactados em linha acima do grid, usando selects em vez de botões. O estado é compartilhado pelo `ProductContext`, então os dois layouts se comportam de forma idêntica.

### Separação de responsabilidades

- **Controllers** recebem a requisição e delegam para a lógica de negócio
- **DTOs** definem o contrato da API separado da entidade do banco
- **`request.ts`** centraliza o fetch com tratamento de erros tipado
- **`buildParams`** isola a montagem da query string, o que facilita testá-la de forma isolada
- **Custom hooks** (`useCart`, `useProducts`, `useTheme`) encapsulam estado e efeitos colaterais, mantendo os componentes focados apenas em renderização

### Principais desafios

- **Slider duplo de preço:** sincronizar os handles min/max com os presets rápidos sem conflito de estado. Resolvido com `localMin`/`localMax` desacoplados do `query`, que só são commitados no evento `mouseup`
- **Autocomplete compartilhado:** garantir que a busca na Navbar e o filtro de nome do grid usem o mesmo `query.name` via contexto, sem que um sobrescreva o outro
- **Preview de imagem:** evitar requisições a cada caractere digitado implementando um debounce de 500ms antes de tentar carregar a URL

---

## 🚀 Se eu tivesse mais tempo

### Autenticação e controle de acesso

Implementaria login com JWT — o token seria armazenado via `httpOnly cookie` e enviado automaticamente em cada requisição. No backend, as rotas de criação, edição e exclusão seriam protegidas por `[Authorize]`. No frontend, haveria um sistema de roles: usuários comuns visualizam o catálogo e compram; administradores acessam o dashboard e gerenciam produtos.

### Fluxo de compra completo

O carrinho já está implementado, mas o botão "Finalizar pedido" não leva a lugar nenhum ainda. Completaria esse fluxo com uma tela de checkout (endereço + forma de pagamento), geração de um QR Code para pagamento via Pix usando a API do Banco Central, e uma página de confirmação do pedido com o status em tempo real.

### Cálculo de frete

Integraria com a API dos Correios (ou Melhor Envio como alternativa) para calcular o frete com base no CEP do usuário. O usuário informaria o CEP na página do carrinho e receberia as opções disponíveis (PAC, SEDEX, etc.) com prazo e valor antes de finalizar a compra.

### Parcelamento e juros no cartão

Adicionaria na tela de checkout um seletor de parcelas. O cálculo seguiria a fórmula de juros compostos padrão do mercado, exibindo o valor de cada parcela e o total com juros, semelhante ao que lojas como Magazine Luiza e Americanas fazem.

### Camada de serviço no backend

Hoje os controllers têm lógica de negócio direto neles. Criaria uma interface `IProductService` com sua implementação `ProductService` para separar essas responsabilidades, controllers apenas recebem e respondem, a lógica fica no serviço. Isso facilita testes e futuras extensões.

### Testes E2E com Playwright

Cobriria os fluxos principais de ponta a ponta: criar um produto, adicioná-lo ao carrinho, finalizar o pedido. Testes unitários garantem que as peças funcionam; testes E2E garantem que o fluxo completo funciona junto.

---

## 👨‍💻 Autor

Desenvolvido por **[Derick Bessa](https://github.com/DerickBessa)**
[LinkedIn](https://linkedin.com/in/derickbessa) · [Portfólio](https://derickbessa.github.io)
