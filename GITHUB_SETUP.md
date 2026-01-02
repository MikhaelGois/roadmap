# 🚀 Como Enviar para o GitHub

Este guia mostra como criar o repositório no GitHub e fazer o primeiro push.

---

## 📋 Pré-requisitos

1. **Git instalado:** [Baixar Git](https://git-scm.com/downloads)
2. **Conta no GitHub:** [Criar conta](https://github.com/signup)
3. **Git configurado:**
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu-email@example.com"
   ```

---

## 🎯 Passo a Passo

### 1. Criar Repositório no GitHub (via Web)

1. Acesse [github.com/new](https://github.com/new)
2. Preencha:
   - **Repository name:** `entrega-roteirizada`
   - **Description:** `Sistema logístico leve para pequenos comércios`
   - **Visibilidade:** Public (ou Private se preferir)
   - ⚠️ **NÃO** marque "Add README" (já temos um)
   - ⚠️ **NÃO** adicione .gitignore (já temos um)
   - ⚠️ **NÃO** escolha licença (já temos uma)
3. Clique em **Create repository**

### 2. Inicializar Git Local

No terminal, navegue até a pasta do projeto e execute:

```bash
cd "c:\Users\MBalieroDG\OneDrive - Luxottica Group S.p.A\Área de Trabalho\dev\entrega roteirizada"
```

### 3. Inicializar Repositório

```bash
# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "feat: initial commit - projeto Entrega Roteirizada"
```

### 4. Conectar ao GitHub

Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub:

```bash
# Adicionar remote
git remote add origin https://github.com/SEU-USUARIO/entrega-roteirizada.git

# Definir branch principal
git branch -M main

# Fazer push
git push -u origin main
```

**Exemplo:**
```bash
git remote add origin https://github.com/MBalieroDG/entrega-roteirizada.git
git branch -M main
git push -u origin main
```

---

## 🔐 Autenticação

### Opção 1: HTTPS (Recomendado para iniciantes)

Ao fazer `git push`, será solicitado:
- **Username:** seu-usuario-github
- **Password:** **Personal Access Token** (não é sua senha!)

**Como criar um Personal Access Token:**

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Clique em **Generate new token (classic)**
3. Nome: `Git Local Push`
4. Marque: `repo` (acesso completo aos repositórios)
5. Clique em **Generate token**
6. **COPIE O TOKEN** (você não verá de novo!)
7. Use o token como senha ao fazer `git push`

### Opção 2: SSH (Para usuários avançados)

[Guia oficial: Conectar com SSH](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh)

---

## ✅ Verificar se Funcionou

1. Acesse: `https://github.com/SEU-USUARIO/entrega-roteirizada`
2. Você deve ver todos os arquivos do projeto!

---

## 🔄 Próximos Passos

### Fazer Updates Futuros

```bash
# Ver status dos arquivos modificados
git status

# Adicionar arquivos modificados
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade X"

# Enviar para GitHub
git push
```

### Convenção de Commits (Recomendado)

Use prefixos semânticos:

- `feat:` — Nova funcionalidade
- `fix:` — Correção de bug
- `docs:` — Atualização de documentação
- `style:` — Formatação (não altera funcionalidade)
- `refactor:` — Refatoração de código
- `test:` — Adiciona ou corrige testes
- `chore:` — Tarefas de manutenção

**Exemplos:**
```bash
git commit -m "feat: adiciona filtro por motorista"
git commit -m "fix: corrige erro no upload de fotos"
git commit -m "docs: atualiza README com instruções"
```

---

## 📌 Configurar GitHub Pages (Demo Estático)

Para ativar o deploy automático do demo:

1. Vá em **Settings** → **Pages**
2. Em **Source**, selecione **GitHub Actions**
3. Faça qualquer commit e push
4. Aguarde ~5 minutos
5. Acesse: `https://SEU-USUARIO.github.io/entrega-roteirizada/`

---

## 🆘 Problemas Comuns

### ❌ Erro: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/entrega-roteirizada.git
```

### ❌ Erro: "Authentication failed"

- Verifique se está usando **Personal Access Token** (não senha)
- Token deve ter permissão `repo`

### ❌ Erro: "Permission denied (publickey)"

Se usando SSH, verifique se a chave SSH está configurada:
```bash
ssh -T git@github.com
```

### ❌ Muitos arquivos para fazer commit

Se o `git add .` estiver demorando muito:

```bash
# Ignorar node_modules se ainda não foi
echo "node_modules/" >> .gitignore
git add .gitignore
git commit -m "chore: adiciona .gitignore"

# Remover node_modules do Git se já foi adicionado
git rm -r --cached node_modules
git commit -m "chore: remove node_modules do Git"
```

---

## 📚 Recursos Úteis

- [Guia Git Básico](https://git-scm.com/book/pt-br/v2)
- [GitHub Docs](https://docs.github.com/pt)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

## 🎉 Pronto!

Seu projeto agora está no GitHub e pronto para ser compartilhado! 🚀

Não esqueça de:
- ⭐ Adicionar descrição e tags no repositório
- 📝 Atualizar os links `SEU-USUARIO` no README.md
- 🔒 Configurar secrets para deploy automático (veja DEPLOY.md)
