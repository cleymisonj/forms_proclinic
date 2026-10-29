# Grupo VIP — quiz em formato de conversa do WhatsApp

Página única (`index.html`) que qualifica o lead numa conversa estilo WhatsApp e, no fim, libera o convite do grupo.

Roteiro: nome → WhatsApp (com máscara e validação de DDD) → e-mail → especialidade → momento do consultório → faturamento (só pra quem já tem consultório) → maior desafio → pronto pra investir? → convite do grupo.

Os dados são enviados duas vezes: na etapa `contato` (logo após o e-mail, pra não perder quem abandona) e na etapa `completo`. UTMs da URL vão junto.

## 1. Configurar a página

No topo do `<script>` do `index.html`, edite o `CONFIG`:

| Campo | O que é |
|---|---|
| `ENDPOINT` | URL `/exec` do Apps Script (passo 2). Vazio = só loga no console |
| `GRUPO` | Link de convite do grupo do WhatsApp |
| `NOME_GRUPO`, `ANFITRIAO`, `MARCA`, `SIGLA` | Textos da página |
| `AVATAR` | Foto de perfil (ex.: `assets/avatar.png`). Sem imagem, aparecem as iniciais |
| `PIXEL_ID` | ID do Meta Pixel. Eventos: `PageView`, `StartQuiz`, `Lead`, `CompleteRegistration`, `ClickEntrarGrupo` |

O avatar fica melhor com uma foto **sem fundo** (PNG/WebP transparente), recortada do peito pra cima.

## 2. Receber os leads (Google Planilhas)

1. Crie uma Planilha Google → **Extensões → Apps Script**.
2. Cole o conteúdo de `apps-script.gs` e salve.
3. **Implantar → Nova implantação → App da Web**: executar como *Eu*, acesso *Qualquer pessoa*.
4. Copie a URL que termina em `/exec` e cole em `CONFIG.ENDPOINT`.

Para mandar também pro CRM (GoHighLevel, n8n, Make…), preencha `WEBHOOK` no `apps-script.gs` e reimplante.

## 3. Publicar

É um arquivo estático: suba `index.html` (+ pasta `assets/`) em qualquer hospedagem — WordPress (página em branco/HTML), Netlify, Vercel, GitHub Pages, Hostinger etc.
