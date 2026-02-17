# RG Serviços em Fachadas

Landing page institucional para a empresa **RG Serviços em Fachadas**, especializada em limpeza de fachadas, limpeza de vidros em altura e manutenção predial externa com atuação em todo o Brasil.

## Stack

| Camada     | Tecnologia                                                             |
| ---------- | ---------------------------------------------------------------------- |
| Markup     | HTML5 semântico                                                        |
| Estilos    | CSS3 puro — Design Tokens + BEM (`style.css`)                          |
| Scripts    | JavaScript vanilla (`script.js`, `defer`)                              |
| Ícones     | [Bootstrap Icons 1.11.3](https://icons.getbootstrap.com/) via CDN      |
| Tipografia | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts      |
| Formulário | Redirecionamento para WhatsApp com mensagem formatada                  |
| Dark Mode  | Dual-selector: `prefers-color-scheme` (CSS) + `data-theme` (JS toggle) |

## Como rodar localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/SEU_USUARIO/rg-servicos-fachadas.git
   cd rg-servicos-fachadas
   ```

2. Sirva os arquivos com qualquer servidor HTTP estático. Exemplos:

   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (npx)
   npx serve .

   # VS Code
   # Instale a extensão "Live Server" e clique em "Go Live"
   ```

3. Acesse `http://localhost:8000` no navegador.

> **Nota:** Também é possível abrir o `index.html` diretamente no navegador (`file://`), pois o projeto não utiliza módulos ES nem dependências locais.

## Estrutura do projeto

```
├── index.html          # Página única (single-page)
├── style.css           # Todos os estilos (tokens, reset, componentes, responsivo)
├── script.js           # Toda a lógica (scroll, menu, tema, lightbox, formulário)
├── assets/
│   └── images/         # Imagens do projeto
├── .gitignore
├── LICENSE             # MIT
└── README.md
```

## Funcionalidades

- **Dark Mode** — detecta preferência do sistema e permite alternância manual (persistida em `localStorage`)
- **Menu mobile** — drawer lateral com suporte a Escape, clique fora, focus trap e scroll lock
- **Lightbox** — galeria de imagens com navegação por setas e teclado, focus trap (a11y)
- **Formulário de orçamento** — validação client-side, máscara de telefone brasileiro, envio via WhatsApp
- **Scroll header** — sombra progressiva ao rolar a página
- **Ano dinâmico** — rodapé atualizado automaticamente

## Pontos de atenção de segurança

| Item                     | Detalhe                                                                                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sanitização**          | Todos os dados do formulário passam por `sanitize()` (remoção de caracteres de controle) e `encodeURIComponent()` antes de montar a URL do WhatsApp. |
| **Referrer Policy**      | `strict-origin-when-cross-origin` configurado via `<meta>`.                                                                                          |
| **Links externos**       | Todos utilizam `rel="noopener noreferrer"` e `target="_blank"`.                                                                                      |
| **Redução de movimento** | `prefers-reduced-motion: reduce` desativa animações e transições automaticamente.                                                                    |
| **Acessibilidade**       | `:focus-visible` global, skip-link, ARIA labels, focus trap no lightbox e menu mobile, `aria-live` nos feedbacks.                                    |

## Licença

[MIT](LICENSE)
