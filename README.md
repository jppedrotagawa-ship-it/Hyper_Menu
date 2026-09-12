# Hyper Menu — GitHub UI

Estrutura preparada para hospedar os arquivos visuais do Hyper Menu.

## Arquivos

- `config.json` — configuração dos grupos/servidores.
- `ui/index.html` — interface.
- `ui/style.css` — estilo.
- `ui/app.js` — comunicação da interface com callbacks NUI.

## Importante

O Lua enviado junto já usa `SendNUIMessage` e `RegisterNUICallback`.
Hospedar HTML/CSS/JS no GitHub não cria automaticamente uma NUI dentro do
FiveM. O ambiente que executa o Lua precisa fornecer a ponte de browser/NUI,
ou o menu precisa ser convertido para um resource NUI tradicional.

A configuração do GitHub pode ser consumida pelo Lua via `config.json`.
Não coloque tokens do GitHub nem webhooks do Discord em arquivos públicos.
