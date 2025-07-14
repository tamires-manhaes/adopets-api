## Sobre o Projeto

Este projeto é uma API desenvolvida para gerenciar processos de adoção de pets. Ele fornece endpoints para cadastro, consulta e gerenciamento de animais, adotantes e processos de adoção.

## Funcionalidades

- **Autenticação JWT**: Login, recuperação e redefinição de senha.
- **Gerenciamento de Usuários**: Cadastro, listagem e busca por ID.
- **Permissões Granulares**: Controle de acesso por loja e papel do usuário (`SUPERADMIN`, `ADMIN`, `EMPLOYEE`).
- **Gestão de Lojas e Redes**: Estrutura para múltiplas lojas e redes/franquias.
- **Clientes e Animais**: Cadastro de clientes e seus animais.
- **Consultas Veterinárias**: Registro de consultas por veterinário.
- **Produtos e Vendas**: Controle de estoque, vendas e produtos por loja.

## Tecnologias Utilizadas

- **Node.js**
- **Express** / **Fastify**
- **Prisma ORM**
- **TypeScript**
- **Zod** (validação de dados)
- **Nodemailer** (envio de e-mails)
- **Docker** (banco de dados local)
- **JWT** (autenticação)

## Como Executar

1. Clone o repositório:

```bash
git clone https://github.com/tamires-manhaes/adopets-api.git
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente no arquivo `.env`.
4. Inicie a aplicação:

```bash
npm run dev
```

## Estrutura do Projeto

```
adopets-api/
  ├── prisma/ # Migrations e schema do banco de dados
  ├── src/
  │ ├── lib/ # Integração com Prisma e envio de e-mails
  │ ├── middlewares/ # Middlewares de autenticação
  │ ├── routes/ # Rotas organizadas por domínio
  │ ├── utils/ # Funções utilitárias
  │ ├── env.ts # Validação de variáveis de ambiente
  │ ├── server.ts # Inicialização do servidor Fastify
  │ └── error-handler.ts # Manipulação global de erros
  ├── .env # Variáveis de ambiente
  ├── docker-compose.yml # Serviço PostgreSQL para desenvolvimento
  ├── package.json # Dependências e scripts
  └── README.md
```

## Como rodar localmente

1. **Clone o repositório e instale as dependências:**

```sh
npm install
```

2. **Configure o banco de dados:**

- Edite o arquivo .env com as credenciais do PostgreSQL.
- Suba o banco com Docker:

```sh
docker-compose up -d
```

3. **Execute as migrations do Prisma:**

```sh
npm run prisma:migrate
```

4. **Inicie o servidor em modo desenvolvimento:**

```sh
  npm run dev
```

5. **Acesse a documentação da API:**

```sh
  http://localhost:3333/docs
```

## Variáveis de Ambiente

Veja o arquivo .env para exemplos de configuração:

- `DATABASE_URL` — URL de conexão com o [PostgreSQL](https://www.postgresql.org/)
- `PORT` — Porta do servidor (padrão: `3333`)
- `JWT_SECRET` — Segredo para geração dos tokens JWT
- `EMAIL_USER` e `EMAIL_PASS` — Credenciais SMTP para envio de e-mails
- `NODE_ENV` — Ambiente (`development` ou `production`)
- `JWT_SECRET` — Segredo para geração dos tokens JWT
- `EMAIL_USER` e `EMAIL_PASS` — Credenciais SMTP para envio de e-mails
- `NODE_ENV` — Ambiente (development ou production)

## Scripts úteis

`npm run dev` — Inicia o servidor com hot reload

`npm run prisma:migrate` — Executa as migrations do banco

`npm run prisma:studio` — Abre o Prisma Studio para inspeção do banco

## Tecnologias

- [Documentação da API](http://localhost:3333/docs)
- [Repositório no GitHub](https://github.com/seu-usuario/adopets-api)
- [Prisma ORM](https://www.prisma.io/)
- [Fastify](https://www.fastify.io/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Contribuição

Contribuições são bem-vindas! Abra uma issue ou envie um pull request.

## Licença

Este projeto está licenciado sob a licença MIT.
