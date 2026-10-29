/**
 * Recebe os leads do index.html e grava numa Planilha Google.
 * Cada lead vira uma linha; a etapa "completo" atualiza a linha criada na etapa "contato"
 * (casando pelo WhatsApp), então quem abandona no meio fica registrado só com os dados de contato.
 *
 * Opcional: preencha WEBHOOK com a URL de um webhook (ex.: GoHighLevel, n8n, Make)
 * para repassar cada envio ao seu CRM.
 */
const ABA = 'Leads';
const WEBHOOK = '';

const COLUNAS = [
  'data', 'etapa', 'nome', 'whatsapp', 'email', 'especialidade', 'momento', 'faturamento',
  'desafio', 'prontoInvestir',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'pagina'
];

function doPost(e) {
  const dados = JSON.parse(e.postData.contents || '{}');
  if (dados.site) return ok(); // honeypot preenchido = robô

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const aba = planilha();
    dados.data = new Date();
    const linha = COLUNAS.map(c => dados[c] || '');

    const existente = acharLinha(aba, dados.whatsapp);
    if (existente) aba.getRange(existente, 1, 1, COLUNAS.length).setValues([linha]);
    else aba.appendRow(linha);
  } finally {
    lock.releaseLock();
  }

  if (WEBHOOK) {
    UrlFetchApp.fetch(WEBHOOK, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(dados),
      muteHttpExceptions: true
    });
  }
  return ok();
}

function planilha() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let aba = ss.getSheetByName(ABA);
  if (!aba) {
    aba = ss.insertSheet(ABA);
    aba.appendRow(COLUNAS);
    aba.setFrozenRows(1);
  }
  return aba;
}

function acharLinha(aba, whatsapp) {
  if (!whatsapp) return 0;
  const col = COLUNAS.indexOf('whatsapp') + 1;
  const ultima = aba.getLastRow();
  if (ultima < 2) return 0;
  const valores = aba.getRange(2, col, ultima - 1, 1).getValues();
  for (let i = valores.length - 1; i >= 0; i--) {
    if (String(valores[i][0]) === String(whatsapp)) return i + 2;
  }
  return 0;
}

function ok() {
  return ContentService.createTextOutput('ok');
}
