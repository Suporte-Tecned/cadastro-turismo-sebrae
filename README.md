# Cadastro de Alunos — Cursos de Turismo Sebrae/SE

Formulário gratuito de cadastro de alunos para os cursos de turismo do Sebrae/Sergipe, com banco de dados no **Google Sheets**. Publicado via **GitHub Pages**.

**Site:** https://suporte-tecned.github.io/cadastro-turismo-sebrae/

---

## Funcionalidades

- **Cadastro de alunos** com os campos: Nome, Sobrenome, E-mail, CPF, Cidade, Cursos escolhidos, Responsável pelo cadastro e Data do atendimento.
- **Lista de alunos cadastrados** (aba "Alunos cadastrados") com nome, cidade, CPF, cursos e responsável — puxando direto da planilha.
- **Edição de cadastro** por aluno, sem opção de exclusão.
- **Validação de formulário** — CPF com 11 dígitos (máscara `000.000.000-00`), e-mail válido e ao menos um curso selecionado.
- **Spinner de carregamento** ao buscar os dados dos alunos.
- **Layout responsivo** — no desktop os campos ficam lado a lado em duas colunas; no mobile empilham em uma coluna só, com rolagem da página.

## Tecnologias

- HTML + CSS + JavaScript puro (sem dependências além do Remix Icon via CDN)
- **Google Apps Script** (`Code.gs`) como backend gratuito, gravando cada envio como linha numa Planilha Google
- **GitHub Pages** para hospedagem gratuita

## Estrutura do repositório

```
.
├── index.html        # Página do formulário + lista de alunos + modal de edição
├── css/
│   └── style.css     # Estilos (desktop + responsivo)
├── js/
│   └── app.js        # Lógica do formulário, lista e edição
├── LICENSE
└── README.md
```

## Backend (Google Sheets + Apps Script)

O `Code.gs` é o backend. Ele **não fica neste repositório** — é colado manualmente no Google Apps Script da planilha, pois contém a configuração do ambiente (URL do app da Web). As instruções completas de configuração estão no arquivo `instrucoes.md` (mantido apenas localmente).

### Resumo da configuração

1. Criar uma planilha no Google Sheets.
2. **Extensões → Apps Script** → colar o conteúdo de `Code.gs`.
3. **Implantar → Nova implantação** → tipo **App da Web**, executar como "Eu", acesso "Qualquer pessoa".
4. Autorizar o script e copiar a **URL do app da Web**.
5. Conferir se `SCRIPT_URL` no `js/app.js` bate com a URL gerada.

> Importante: após alterar o `Code.gs`, é preciso publicar uma **nova versão** da implantação (Implantar → Gerenciar implantações → editar → Nova versão → Implantar), senão o app continua com o código anterior.

### Colunas da planilha

A aba **Cadastro** é criada automaticamente com estas colunas:

| ID | Carimbo de data/hora | Nome | Sobrenome | E-mail | CPF | Cidade | Cursos escolhidos | Responsável | Data do atendimento | Atualizado em |
|----|----------------------|------|-----------|--------|-----|--------|-------------------|-------------|---------------------|---------------|

A coluna **CPF** é configurada como texto para preservar zeros à esquerda.

## Como rodar localmente

Basta abrir o `index.html` no navegador (ou usar o Live Server do VS Code). O formulário depende apenas da aplicação do Apps Script no ar para salvar/listar.

## Deploy

Qualquer alteração nos arquivos do site é publicada automaticamente ao dar push na branch `main` (GitHub Pages configurado para servir da raiz do repositório).

## Licença

Veja o arquivo [LICENSE](LICENSE).

---

_Desenvolvido pelo time de Suporte Técnico — TECNED, para o Sebrae/Sergipe._