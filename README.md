# 🛍️ AgileShop | Catálogo de Produtos | Product Catalog


---

### Sobre o Projeto

Aplicação web fullstack de gerenciamento de catálogo de produtos para uma loja virtual, desenvolvida como desafio técnico para a vaga de Estágio em Desenvolvimento Full Stack na Agilean.

A aplicação permite listar, criar, editar e excluir produtos, com filtros, busca, paginação, dashboard de métricas e suporte a dark mode.

---

### 🚀 Tecnologias Utilizadas

#### Backend
| Tecnologia | Versão | Motivo da Escolha |
|---|---|---|
| .NET | 10.0 | Requisito do desafio. LTS com melhorias significativas de performance |
| Entity Framework Core | 8.x | ORM maduro, Code First com Migrations — ideal para evolução controlada do schema |
| SQLite | — | Banco embarcado, zero configuração, funciona em qualquer sistema operacional sem instalação adicional |
| Data Annotations | — | Validações declarativas diretamente nas entidades — rápidas e legíveis |

#### Frontend
| Tecnologia | Versão | Motivo da Escolha |
|---|---|---|
| React | 18+ | Requisito do desafio. Biblioteca consolidada e amplamente adotada no mercado |
| Vite | 5.x | Bundler ultrarrápido, HMR instantâneo — ideal para desenvolvimento ágil |
| TypeScript | 5.x | Tipagem estática que previne erros em tempo de compilação e melhora a manutenção |
| TailwindCSS | 3.x | Utilitário CSS com alta produtividade; as classes seguem exatamente o guia visual fornecido |
| React Hook Form + Zod | — | Validação de formulários performática com schema tipado |
| Axios | — | Cliente HTTP com interceptors, facilitando tratamento global de erros |
| Context API | — | Gerenciamento de estado leve e suficiente para a complexidade desta aplicação |
| react-hot-toast | — | Feedback visual de ações do usuário (criar, editar, excluir) |

---

### ⚙️ Como Executar

#### Pré-requisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)

#### Backend

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

A API estará disponível em: `http://localhost:5000`  
Documentação Swagger: `http://localhost:5000/swagger`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

---

### 📋 Funcionalidades Implementadas

- [x] Listagem de produtos em grid responsivo (1 / 2 / 3-4 colunas)
- [x] Busca por nome
- [x] Filtro por categoria
- [x] Filtro por disponibilidade
- [x] Ordenação por nome, preço e data
- [x] Cadastro de produto com validação completa
- [x] Preview de imagem por URL
- [x] Edição de produto via modal
- [x] Exclusão com modal de confirmação
- [x] Indicador visual de estoque baixo (< 10 unidades)
- [x] Badge "Indisponível" para produtos inativos
- [x] Toast notifications para feedback de ações
- [x] Dashboard com métricas (total, valor do estoque, estoque baixo)
- [x] Paginação na listagem
- [x] Dark mode

---

### 🧱 Estrutura de Pastas

O backend segue o padrão **MVC** nativo do .NET, com uma camada de DTOs para separar o contrato da API da entidade do banco. O frontend adota uma **arquitetura em camadas** com separação entre serviços, estado e apresentação.
```
catalogo-produtos/
├── backend/
│   ├── Controllers/        # Endpoints da API REST
│   ├── Models/             # Entidade Produto
│   ├── DTOs/               # Objetos de transferência de dados
│   ├── Data/               # AppDbContext
│   ├── Migrations/         # Histórico de migrations do EF Core
│   └── Program.cs
│
└── frontend/
    └── src/
        ├── components/     # ProductCard, ProductForm, Modal, Dashboard, etc.
        ├── pages/          # CatalogPage
        ├── hooks/          # useProdutos, useFilters
        ├── services/       # api.ts (configuração do Axios)
        ├── context/        # ProductContext
        └── types/          # produto.types.ts
```

### 🧠 Decisões Técnicas

#### Por que Vite + React e não Next.js?
Next.js resolve problemas de SSR, SSG e SEO — nenhum deles relevante para um painel administrativo interno sem necessidade de indexação. Usar Next.js aqui seria over-engineering. Optei por Vite por inicialização instantânea, HMR rápido e ausência de overhead desnecessário. Conheço Next.js e o utilizo em outros projetos (portfólio, TáNaLista), mas escolher a ferramenta certa para o contexto é mais importante do que usar a mais sofisticada disponível.

#### Por que SQLite e não SQL Server LocalDB?
SQLite é um arquivo `.db` embutido no projeto — sem instalação, sem configuração de instância, sem dependência de sistema operacional. Qualquer avaliador consegue clonar o repositório e executar a aplicação imediatamente. SQL Server LocalDB só funciona no Windows e exige configuração adicional, o que aumenta a fricção desnecessariamente num desafio técnico.

#### Por que Context API e não Redux?
Redux introduz boilerplate significativo para uma aplicação com estado relativamente simples. Context API com hooks customizados (`useProdutos`, `useFilters`) resolve o problema com menos código, mais legibilidade e sem dependências adicionais. Redux seria justificável se houvesse múltiplos domínios de estado complexos e interdependentes.

#### Por que React Hook Form + Zod?
React Hook Form é não-controlado por padrão, evitando re-renders desnecessários a cada tecla pressionada. Zod garante que o schema de validação seja a fonte única da verdade — o mesmo schema valida o formulário no front e pode ser reutilizado como contrato de tipo TypeScript.

#### Separação de Responsabilidades
- **Controllers** apenas recebem requisições e delegam para a camada de serviço
- **DTOs** separam o contrato da API da entidade do banco de dados
- **Hooks customizados** encapsulam lógica de negócio no frontend, mantendo os componentes focados em renderização
- **`api.ts`** centraliza a configuração do Axios, incluindo interceptors para tratamento global de erros

#### Principais Desafios
- Sincronizar os estados de filtro, busca e paginação de forma coesa sem duplicar chamadas à API
- Garantir que o preview de imagem por URL não quebre o layout em URLs inválidas (tratado com `onError` no `<img>`)

#### O que faria diferente com mais tempo
- Implementaria uma camada de serviço no backend (`IProductService` / `ProductService`) para desacoplar os controllers da lógica de negócio
- Adicionaria testes unitários nos endpoints com xUnit e no frontend com Vitest + Testing Library
- Consideraria React Query para cache e sincronização de estado assíncrono, substituindo o Context API manual

---

---

*Desenvolvido por [Derick Bessa](https://github.com/DerickBessa)*

### About the Project

A fullstack web application for product catalog management built as a technical challenge for a Full Stack Developer internship position at Agilean.

The application supports listing, creating, editing, and deleting products, with filters, search, pagination, a metrics dashboard, and dark mode.

---

### 🚀 Tech Stack

#### Backend
| Technology | Version | Reason |
|---|---|---|
| .NET | 8.0 | Required by the challenge. LTS with significant performance improvements |
| Entity Framework Core | 8.x | Mature ORM with Code First Migrations — ideal for controlled schema evolution |
| SQLite | — | Embedded database, zero configuration, works on any OS without additional setup |
| Data Annotations | — | Declarative validations directly on entities — fast and readable |

#### Frontend
| Technology | Version | Reason |
|---|---|---|
| React | 18+ | Required by the challenge. Established and widely adopted library |
| Vite | 5.x | Ultra-fast bundler with instant HMR — ideal for agile development |
| TypeScript | 5.x | Static typing that catches errors at compile time and improves maintainability |
| TailwindCSS | 3.x | High-productivity CSS utility; classes map directly to the provided visual guide |
| React Hook Form + Zod | — | Performant form validation with a typed schema |
| Axios | — | HTTP client with interceptors for centralized error handling |
| Context API | — | Lightweight state management appropriate for this application's complexity |
| react-hot-toast | — | Visual feedback for user actions (create, edit, delete) |

---

### ⚙️ How to Run

#### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)

#### Backend

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

API available at: `http://localhost:5000`  
Swagger docs: `http://localhost:5000/swagger`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at: `http://localhost:5173`

---

### 📋 Implemented Features

- [x] Product grid listing with responsive layout (1 / 2 / 3-4 columns)
- [x] Name search
- [x] Category filter
- [x] Availability filter
- [x] Sort by name, price, and date
- [x] Product creation with full validation
- [x] Image preview by URL
- [x] Product editing via modal
- [x] Delete with confirmation modal
- [x] Low stock visual indicator (< 10 units)
- [x] "Unavailable" badge for inactive products
- [x] Toast notifications for action feedback
- [x] Dashboard with metrics (total, stock value, low stock count)
- [x] Pagination
- [x] Dark mode

---

### 🧠 Technical Decisions

#### Why Vite + React instead of Next.js?
Next.js solves SSR, SSG, and SEO problems — none of which are relevant for an internal admin panel with no indexing requirements. Using Next.js here would be over-engineering. I chose Vite for instant startup, fast HMR, and zero unnecessary overhead. I use Next.js in other projects (portfolio, TáNaLista), but choosing the right tool for the context matters more than using the most sophisticated one available.

#### Why SQLite instead of SQL Server LocalDB?
SQLite is an embedded `.db` file bundled with the project — no installation, no instance configuration, no OS dependency. Any evaluator can clone the repo and run the app immediately. SQL Server LocalDB is Windows-only and requires additional setup, introducing unnecessary friction in a technical challenge.

#### Why Context API instead of Redux?
Redux introduces significant boilerplate for an application with relatively simple state. Context API with custom hooks (`useProdutos`, `useFilters`) solves the problem with less code, better readability, and no extra dependencies. Redux would be justified if there were multiple complex, interdependent state domains.

#### Separation of Concerns
- **Controllers** only receive requests and delegate to the service layer
- **DTOs** separate the API contract from the database entity
- **Custom hooks** encapsulate business logic on the frontend, keeping components focused on rendering
- **`api.ts`** centralizes Axios configuration, including interceptors for global error handling

---

*Developed by [Derick Bessa](https://github.com/DerickBessa)*
