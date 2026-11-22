/* Product Quest · lógica do jogo (JavaScript puro, sem dependências) */
/* ===== FORMULÁRIO DE FEEDBACK =====
   Cole aqui o link do Google Forms (Enviar → ícone de link → Copiar).
   Enquanto estiver vazio, o botão não aparece na tela final. */
const FEEDBACK_URL = 'https://forms.gle/6FN1grZecxYeM5N56';

const $ = s => document.querySelector(s);
const S = { pos: [270, 172], outfit: 'f', fb: null, l1ok: false, coins: 40, avatar: 1, skin: 2, hair: 1, name: 'Jogador', spec: 'Product Builder', accepted: false, done: false,
  q: null, journey: [], plan: [], color: 0, gap: 30, prev: 'world' };

function fit() {
  const k = Math.min(innerWidth / 980, innerHeight / 560);
  $('#stage').style.transform = `scale(${k})`;
}
addEventListener('resize', fit); fit();

function toast(t) { const e = $('#toast'); e.textContent = t; e.classList.add('on'); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove('on'), 2200); }

/* ---------- mundo isométrico ilustrado ---------- */
function faces(cx, cy, w, h, top, left, right) {
  const t = `${cx},${cy-h} ${cx+w},${cy-h+w/2} ${cx},${cy-h+w} ${cx-w},${cy-h+w/2}`;
  const l = `${cx-w},${cy-h+w/2} ${cx},${cy-h+w} ${cx},${cy+w} ${cx-w},${cy+w/2}`;
  const r = `${cx+w},${cy-h+w/2} ${cx},${cy-h+w} ${cx},${cy+w} ${cx+w},${cy+w/2}`;
  return `<polygon points="${l}" fill="${left}" stroke="#2a2a3a" stroke-width="1.3"/><polygon points="${r}" fill="${right}" stroke="#2a2a3a" stroke-width="1.3"/><polygon points="${t}" fill="${top}" stroke="#2a2a3a" stroke-width="1.3"/>`;
}
function bigAvatar(hgt, vb = '0 0 120 220') {
  return `<svg viewBox="${vb}" style="height:${hgt}px">${(() => { const sk = ['#f3dccb','#e2b994','#c48c62','#8f5e3e','#5e3d29','#7fb88a'][S.skin], hc = '#2e211b', ln = '#141a2e';
   const hair = [`<path d="M45 22 Q46 8 60 8 Q76 8 76 24 Q70 16 58 17 Q50 18 45 22Z" fill="${hc}"/>`,
     `<path d="M44 26 Q42 7 60 7 Q78 7 76 26 L79 62 Q73 58 72 32 Q66 18 60 18 Q52 18 48 32 Q47 58 41 62Z" fill="${hc}"/>`,
     `<ellipse cx="60" cy="6" rx="8" ry="6" fill="${hc}"/><path d="M45 24 Q46 10 60 10 Q74 10 75 24 Q68 16 60 16 Q52 16 45 24Z" fill="${hc}"/>`,
     `<path d="M46 20 Q50 10 60 10 Q70 10 74 20 Q68 15 60 15.5 Q52 15 46 20Z" fill="${hc}"/><path d="M45 22 L45 28 M75 22 L75 28" stroke="${hc}" stroke-width="2"/>`][S.hair];
   const f = S.outfit === 'f';
   return `<ellipse cx="60" cy="212" rx="26" ry="4" fill="rgba(0,0,0,.35)"/>
   <rect x="55" y="38" width="10" height="12" fill="${sk}" stroke="${ln}" stroke-width="1.5"/>
   ${f ? `<rect x="49" y="150" width="9" height="56" rx="3" fill="${sk}" stroke="${ln}" stroke-width="1.5"/><rect x="62" y="150" width="9" height="56" rx="3" fill="${sk}" stroke="${ln}" stroke-width="1.5"/>
          <path d="M47 196 h12 v12 h-14 Q45 200 47 196Z M61 196 h12 Q75 200 75 208 h-14Z" fill="#1b1b2b"/>
          <path d="M40 104 L80 104 L86 156 L34 156Z" fill="#3b2f6b" stroke="${ln}" stroke-width="1.8"/>`
        : `<path d="M44 108 L58 108 L58 204 L46 204Z" fill="#2a3352" stroke="${ln}" stroke-width="1.8"/><path d="M62 108 L76 108 L74 204 L62 204Z" fill="#2a3352" stroke="${ln}" stroke-width="1.8"/>
          <path d="M44 200 h14 v10 h-17 Q41 202 44 200Z M62 200 h14 Q79 202 79 210 h-17Z" fill="#1b1b2b"/><rect x="43" y="104" width="34" height="6" fill="#141a2e"/>`}
   ${S.cape ? `<path d="M36 50 Q60 40 84 50 L98 196 Q60 206 22 196Z" fill="#6b4a33" stroke="${ln}" stroke-width="1.8"/><path d="M40 30 Q38 4 60 2 Q82 4 80 30 Q86 44 76 50 L44 50 Q34 44 40 30Z" fill="#5a3d29" stroke="${ln}" stroke-width="1.6"/>` : ''}
   <path d="M38 52 Q60 44 82 52 L80 ${f?110:112} L40 ${f?110:112}Z" fill="${f ? '#8B7CFF' : '#2EC4F1'}" stroke="${ln}" stroke-width="1.8"/>
   <path d="M52 50 L60 64 L68 50" fill="none" stroke="${ln}" stroke-width="1.4"/><path d="M60 64 L60 108" stroke="${ln}" stroke-width="1" opacity=".5"/>
   <rect x="66" y="70" width="11" height="7" rx="1" fill="#FFB347" stroke="${ln}" stroke-width="1"/>
   <path d="M40 54 Q30 88 32 128" stroke="${ln}" stroke-width="11" stroke-linecap="round" fill="none"/><path d="M40 54 Q30 88 32 128" stroke="${f ? '#8B7CFF' : '#2EC4F1'}" stroke-width="8" stroke-linecap="round" fill="none"/>
   <path d="M80 54 Q90 88 88 128" stroke="${ln}" stroke-width="11" stroke-linecap="round" fill="none"/><path d="M80 54 Q90 88 88 128" stroke="${f ? '#8B7CFF' : '#2EC4F1'}" stroke-width="8" stroke-linecap="round" fill="none"/>
   <ellipse cx="32" cy="133" rx="4.5" ry="6" fill="${sk}" stroke="${ln}" stroke-width="1.4"/><ellipse cx="88" cy="133" rx="4.5" ry="6" fill="${sk}" stroke="${ln}" stroke-width="1.4"/>
   ${S.cape ? `<path d="M38 52 L52 54 L46 150 L30 190 Q26 120 38 52Z" fill="#7a5640" stroke="${ln}" stroke-width="1.5"/><path d="M82 52 L68 54 L74 150 L90 190 Q94 120 82 52Z" fill="#7a5640" stroke="${ln}" stroke-width="1.5"/><path d="M40 108 h40" stroke="#3a2a20" stroke-width="3"/>` : ''}
   <path d="M60 8 Q74 8 75 24 Q76 36 70 42 Q65 46 60 46 Q55 46 50 42 Q44 36 45 24 Q46 8 60 8Z" fill="${sk}" stroke="${ln}" stroke-width="1.6"/>
   <ellipse cx="45" cy="27" rx="2.2" ry="3.6" fill="${sk}" stroke="${ln}" stroke-width="1.2"/><ellipse cx="75" cy="27" rx="2.2" ry="3.6" fill="${sk}" stroke="${ln}" stroke-width="1.2"/>
   ${S.cape ? `<path d="M40 30 Q40 6 60 4 Q80 6 80 30" fill="none" stroke="#5a3d29" stroke-width="5" stroke-linecap="round"/>` : ''}${hair}
   <path d="M50 22.5 L56 22 M64 22 L70 22.5" stroke="${hc}" stroke-width="1.6" stroke-linecap="round"/>
   <path d="M50.5 26.5 Q53 25 55.5 26.5 Q53 28 50.5 26.5Z" fill="#fff" stroke="${ln}" stroke-width=".8"/><circle cx="53" cy="26.6" r="1" fill="${ln}"/>
   <path d="M64.5 26.5 Q67 25 69.5 26.5 Q67 28 64.5 26.5Z" fill="#fff" stroke="${ln}" stroke-width=".8"/><circle cx="67" cy="26.6" r="1" fill="${ln}"/>
   <path d="M60 28 L59 34 L61 34" fill="none" stroke="${ln}" stroke-width=".9" opacity=".7"/><path d="M56 38.5 Q60 40 64 38.5" fill="none" stroke="#6b3a2e" stroke-width="1.3" stroke-linecap="round"/>`; })()}</svg>`;
}
function recArt(k) {
  const sky = `<defs><radialGradient id="rs${k}" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#2a2340"/><stop offset="1" stop-color="#0b0a14"/></radialGradient></defs><rect x="-50" y="-50" width="700" height="500" fill="url(#rs${k})"/>`;
  if (k === 'of') return `<svg viewBox="305 45 160 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">${sky}<ellipse cx="384" cy="150" rx="90" ry="30" fill="#D9B98E"/>${oficina()}</svg>`;
  if (k === 'sim') return `<svg viewBox="60 110 110 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">${sky}<ellipse cx="112" cy="238" rx="60" ry="18" fill="#D9B98E"/>${hubTower()}<text x="140" y="140" font-size="9" fill="#E8C99A" font-weight="700">?  ✓  ?</text></svg>`;
  return `<svg viewBox="0 0 120 90" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">${sky}<rect x="22" y="12" width="76" height="66" rx="6" fill="rgba(8,6,5,.8)" stroke="#E8C99A" stroke-width="1.2"/>
    <text x="30" y="26" font-size="7" fill="#E8C99A" font-weight="700">FLEXBOX</text><rect x="30" y="34" width="60" height="22" rx="2" fill="none" stroke="#c9b9a3" stroke-dasharray="2 2"/>
    <rect x="36" y="39" width="12" height="12" fill="#E07A3E"/><rect x="54" y="39" width="12" height="12" fill="#E8D3B0"/><rect x="72" y="39" width="12" height="12" fill="#C9A27A"/>
    <text x="30" y="68" font-size="5.5" fill="#c9b9a3" font-family="monospace">display: flex;</text></svg>`;
}
function holoArt(k) {
  const t = (x, y, s, c = '#2a1a10', w = 400, a = 'middle') => `<text x="${x}" y="${y}" font-size="${s}" fill="${c}" font-weight="${w}" text-anchor="${a}" font-family="Space Grotesk, sans-serif">`;
  if (k === 'Case real: GE Healthcare') return `<svg viewBox="0 0 320 120" width="100%">
    <rect x="6" y="8" width="140" height="96" rx="8" fill="#fff" stroke="#d6cbb8"/>${t(76,24,9,'#7a6a5a',700)}ANTES</text>
    <rect x="34" y="34" width="84" height="52" rx="6" fill="#dcdcdc" stroke="#999"/><circle cx="76" cy="60" r="16" fill="#fff" stroke="#999"/>${t(76,98,8.5,'#c0392b',700)}“um tijolo com um buraco”</text>
    <text x="150" y="64" font-size="20" fill="#7a4a2e">→</text>
    <rect x="172" y="8" width="142" height="96" rx="8" fill="#cfe8f7" stroke="#d6cbb8"/>${t(243,24,9,'#7a6a5a',700)}DEPOIS</text>
    <path d="M190 74 Q243 92 298 74 L290 86 Q243 100 198 86Z" fill="#a9744f" stroke="#5e3a24"/><rect x="214" y="40" width="58" height="36" rx="6" fill="#efe6d8" stroke="#5e3a24"/><circle cx="243" cy="58" r="12" fill="#fff" stroke="#5e3a24"/>
    <line x1="292" y1="30" x2="292" y2="74" stroke="#5e3a24" stroke-width="2"/><path d="M292 32 L306 38 L292 44Z" fill="#b5452b"/>${t(243,98,8.5,'#1f7a46',700)}uma aventura de navio pirata</text></svg>`;
  if (k === 'Contraste (WCAG)') return `<svg viewBox="0 0 320 130" width="100%">
    <rect x="10" y="10" width="140" height="74" rx="6" fill="#fff" stroke="#d6cbb8"/>${t(80,26,9,'#7a6a5a',700)}RUIM · 1,6:1</text><rect x="30" y="36" width="100" height="26" rx="5" fill="#d5d5d5"/>${t(80,53,11,'#eee',700)}Pagar</text>${t(80,78,9,'#c0392b',700)}✗ quase invisível</text>
    <rect x="170" y="10" width="140" height="74" rx="6" fill="#fff" stroke="#d6cbb8"/>${t(240,26,9,'#7a6a5a',700)}BOM · 12,6:1</text><rect x="190" y="36" width="100" height="26" rx="5" fill="#333"/>${t(240,53,11,'#fff',700)}Pagar</text>${t(240,78,9,'#1f7a46',700)}✓ fácil de ler</text>
    <defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="#d9534f"/><stop offset=".2" stop-color="#f0ad4e"/><stop offset=".25" stop-color="#5cb85c"/><stop offset="1" stop-color="#1f7a46"/></linearGradient></defs>
    <rect x="10" y="98" width="300" height="10" rx="5" fill="url(#cg)"/><line x1="78" y1="94" x2="78" y2="112" stroke="#2a1a10" stroke-width="2"/>${t(10,124,9,'#2a1a10',400,'start')}1:1</text>${t(78,124,9,'#2a1a10',700)}4,5:1 (mínimo)</text>${t(310,124,9,'#2a1a10',400,'end')}21:1</text></svg>`;
  if (k === 'Leis de Gestalt') { const dot = (x, y, c = '#7a4a2e', r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
    return `<svg viewBox="0 0 320 130" width="100%">
    <rect x="4" y="4" width="74" height="100" rx="6" fill="#fff" stroke="#d6cbb8"/>${[0,1].map(i=>[0,1].map(j=>dot(18+j*13,30+i*13)).join('')).join('')}${[0,1].map(i=>[0,1].map(j=>dot(52+j*13,30+i*13)).join('')).join('')}${t(41,82,9,'#2a1a10',700)}Proximidade</text>${t(41,95,7.5,'#7a6a5a')}perto = grupo</text>
    <rect x="84" y="4" width="74" height="100" rx="6" fill="#fff" stroke="#d6cbb8"/>${[0,1,2].map(i=>[0,1,2].map(j=>dot(100+i*20,26+j*16, j%2 ? '#E07A3E' : '#7a4a2e')).join('')).join('')}${t(121,82,9,'#2a1a10',700)}Semelhança</text>${t(121,95,7.5,'#7a6a5a')}igual = grupo</text>
    <rect x="164" y="4" width="74" height="100" rx="6" fill="#fff" stroke="#d6cbb8"/>${[0,1,2,3,4,5,6].map(i=>dot(174+i*9,62-Math.sin(i/6*Math.PI)*28,'#7a4a2e',3.5)).join('')}${t(201,82,9,'#2a1a10',700)}Continuidade</text>${t(201,95,7.5,'#7a6a5a')}o olho segue a linha</text>
    <rect x="244" y="4" width="72" height="100" rx="6" fill="#fff" stroke="#d6cbb8"/><path d="M280 22 A22 22 0 1 1 262 38" fill="none" stroke="#7a4a2e" stroke-width="5" stroke-dasharray="20 7"/>${t(280,82,9,'#2a1a10',700)}Fechamento</text>${t(280,95,7.5,'#7a6a5a')}a mente completa</text>
    ${t(160,124,9,'#2a1a10')}Use essas leis para agrupar menu, prato e botão na tela.</text></svg>`; }
  if (k === 'Box model (CSS)') return `<svg viewBox="0 0 320 130" width="100%">
    <rect x="8" y="6" width="190" height="118" rx="4" fill="#FFE3C2" stroke="#E07A3E" stroke-dasharray="4 3"/>${t(14,18,8.5,'#b5452b',700,'start')}margin</text>
    <rect x="26" y="24" width="154" height="82" rx="3" fill="#333"/>${t(32,35,8.5,'#E8D3B0',700,'start')}border</text>
    <rect x="32" y="40" width="142" height="60" fill="#D9F0E8"/>${t(38,51,8.5,'#2a6b5e',700,'start')}padding</text>
    <rect x="58" y="56" width="90" height="28" fill="#fff" stroke="#2a6b5e"/>${t(103,74,10,'#2a1a10',700)}conteúdo</text>
    <rect x="210" y="22" width="102" height="60" rx="4" fill="#fff" stroke="#d6cbb8"/>${t(261,36,8,'#7a6a5a',700)}display: flex</text><rect x="218" y="44" width="86" height="28" fill="none" stroke="#7a6a5a" stroke-dasharray="3 2"/><rect x="250" y="50" width="22" height="16" fill="#333"/>
    ${t(261,96,8,'#2a1a10')}justify-content:</text>${t(261,108,8,'#2a1a10',700)}center → centraliza</text></svg>`;
  return `<svg viewBox="0 0 320 130" width="100%"><defs><marker id="ar" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#7a4a2e"/></marker></defs>
    ${[['Escolher prato',6],['Revisar pedido',86],['Pagar',166],['Retirar',246]].map(([l,x]) => `<rect x="${x}" y="22" width="68" height="28" rx="6" fill="#fff" stroke="#7a4a2e" stroke-width="1.5"/>${t(x+34,40,8.5,'#2a1a10',700)}${l}</text>`).join('')}
    ${[74,154,234].map(x => `<line x1="${x}" y1="36" x2="${x+11}" y2="36" stroke="#7a4a2e" stroke-width="1.6" marker-end="url(#ar)"/>`).join('')}
    <circle cx="20" cy="36" r="0"/>${t(160,14,8,'#1f7a46',700)}✓ caminho ideal: 4 passos</text>
    <rect x="86" y="74" width="68" height="28" rx="6" fill="#fff" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="4 3"/>${t(120,92,8.5,'#c0392b',700)}Criar cadastro</text>
    <path d="M60 50 Q70 88 84 88" fill="none" stroke="#c0392b" stroke-width="1.4" stroke-dasharray="3 2" marker-end="url(#ar)"/><path d="M156 88 Q200 88 230 110" fill="none" stroke="#c0392b" stroke-width="1.4" stroke-dasharray="3 2"/>
    ${t(250,116,9,'#c0392b',700)}✗ desistência</text>${t(120,116,7.5,'#7a6a5a')}passo extra = mais abandono</text></svg>`;
}
function caseScene(after) {
  const ln = '#2a1a10';
  const tavi = after
    ? `<g transform="translate(78 54)"><rect x="-9" y="10" width="18" height="34" rx="5" fill="#6b4a8a" stroke="${ln}"/><ellipse cx="0" cy="0" rx="10" ry="12" fill="#D9734E" stroke="${ln}"/><path d="M-6 -8 Q-12 -16 -12 -22 M6 -8 Q12 -16 12 -22" stroke="#c4603d" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="-3.5" cy="-1" r="1.3" fill="${ln}"/><circle cx="3.5" cy="-1" r="1.3" fill="${ln}"/><path d="M-4 5 Q0 9 4 5" stroke="${ln}" stroke-width="1.4" fill="none"/><path d="M9 18 L20 12" stroke="#6b4a8a" stroke-width="5" stroke-linecap="round"/></g>
       <g transform="translate(40 92)"><rect x="-14" y="0" width="28" height="6" rx="2" fill="#a9744f" stroke="${ln}"/><ellipse cx="0" cy="-2" rx="9" ry="4" fill="#E07A3E" stroke="${ln}"/><path d="M-3 -8 q2 -4 0 -7 M3 -8 q2 -4 0 -7" stroke="#fff" stroke-width="1" fill="none" opacity=".8"/></g>
       <text x="78" y="22" font-size="14" text-anchor="middle">😋</text>`
    : `<g transform="translate(78 54)"><rect x="-9" y="10" width="18" height="34" rx="5" fill="#6b4a8a" stroke="${ln}"/><ellipse cx="0" cy="0" rx="10" ry="12" fill="#D9734E" stroke="${ln}"/><path d="M-6 -8 Q-12 -16 -12 -22 M6 -8 Q12 -16 12 -22" stroke="#c4603d" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-6 -4 l5 2 M6 -4 l-5 2" stroke="${ln}" stroke-width="1.3"/><circle cx="-3.5" cy="0" r="1.2" fill="${ln}"/><circle cx="3.5" cy="0" r="1.2" fill="${ln}"/><path d="M-4 7 Q0 4 4 7" stroke="${ln}" stroke-width="1.4" fill="none"/><path d="M-9 18 L-16 6" stroke="#6b4a8a" stroke-width="5" stroke-linecap="round"/></g>
       <text x="58" y="30" font-size="15" font-weight="900" fill="#FF6EC7">?</text><text x="96" y="22" font-size="12" font-weight="900" fill="#FF6EC7">?</text><text x="104" y="40" font-size="10" font-weight="900" fill="#FF6EC7">!</text>`;
  const screen = after
    ? `<rect x="134" y="26" width="44" height="56" rx="2" fill="#f4f6fb"/><rect x="138" y="30" width="36" height="16" fill="#E07A3E" opacity=".75"/><text x="156" y="41" font-size="6" text-anchor="middle" fill="#fff" font-weight="700">PRATOS</text><rect x="138" y="50" width="36" height="5" fill="#c7cde0"/><rect x="138" y="58" width="36" height="5" fill="#c7cde0"/><rect x="144" y="68" width="24" height="9" rx="2" fill="#333"/><text x="156" y="75" font-size="5.5" text-anchor="middle" fill="#fff" font-weight="700">Pagar</text>`
    : `<rect x="134" y="26" width="44" height="56" rx="2" fill="#f4f6fb"/><text x="156" y="36" font-size="5.5" text-anchor="middle" fill="#7a6a5a" font-weight="700">CADASTRE-SE</text>${[42,50,58].map(y => `<rect x="138" y="${y}" width="36" height="5" fill="#fff" stroke="#c7cde0" stroke-width=".6"/>`).join('')}<rect x="144" y="68" width="24" height="9" rx="2" fill="#dcdcdc"/><text x="156" y="75" font-size="5.5" text-anchor="middle" fill="#f4f4f4">Pagar</text>`;
  return `<svg viewBox="0 0 200 110" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <rect width="200" height="110" fill="#5e2f19"/><rect width="200" height="78" fill="#7a3f22"/>${[20,60,100,140,180].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="78" stroke="#5e2f19" stroke-width="1.5"/>`).join('')}
    <rect x="12" y="8" width="56" height="13" rx="2" fill="#1a0f0a" stroke="#FF3FA4"/><text x="40" y="17.5" font-size="7.5" font-weight="900" text-anchor="middle" fill="#FF6EC7">CANTINA</text>
    <rect x="0" y="78" width="200" height="32" fill="#D9B98E"/>${[0,1,2,3,4,5].map(i => `<line x1="${i*40}" y1="78" x2="${i*40-20}" y2="110" stroke="#c4ab84"/>`).join('')}
    <circle cx="${after ? 156 : 156}" cy="54" r="${after ? 44 : 0}" fill="#FFE3A8" opacity=".18"/>
    <rect x="128" y="18" width="56" height="70" rx="4" fill="#2B3A67" stroke="#E8C99A" stroke-width="1.5"/>${screen}<rect x="150" y="88" width="12" height="14" fill="#2B3A67" stroke="#E8C99A"/><rect x="140" y="100" width="32" height="5" rx="1" fill="#1a2446"/>
    ${tavi}
    <rect x="${after ? 4 : 4}" y="92" width="${after ? 62 : 52}" height="14" rx="3" fill="${after ? 'rgba(31,122,70,.9)' : 'rgba(192,57,43,.9)'}"/><text x="${after ? 35 : 30}" y="102" font-size="7.5" text-anchor="middle" fill="#fff" font-weight="700">${after ? '✓ pedido feito' : '✗ desistiu'}</text></svg>`;
}
function badgeIcon(sz = 64) {
  return `<svg viewBox="0 0 64 64" width="${sz}" height="${sz}"><path d="M20 2 L28 22 L22 24 Z M44 2 L36 22 L42 24 Z" fill="#b5452b" stroke="#2a1a10" stroke-width="1"/><path d="M24 2 L30 20 M40 2 L34 20" stroke="#E8D3B0" stroke-width="2"/>
   <polygon points="32,16 50,26 50,46 32,56 14,46 14,26" fill="#C9A27A" stroke="#2a1a10" stroke-width="1.6"/><polygon points="32,20 46,28 46,44 32,52 18,44 18,28" fill="#E8D3B0" stroke="#8a5a3a" stroke-width="1"/>
   <path d="M21 32 h3 l3 9 h10 l3 -7 h-14" fill="none" stroke="#2a1a10" stroke-width="1.6" stroke-linejoin="round"/><circle cx="29" cy="44" r="1.4" fill="#2a1a10"/><circle cx="36" cy="44" r="1.4" fill="#2a1a10"/>
   <circle cx="38" cy="33" r="5.5" fill="rgba(46,196,241,.35)" stroke="#2a1a10" stroke-width="1.8"/><line x1="42" y1="37" x2="46" y2="41" stroke="#2a1a10" stroke-width="2.4" stroke-linecap="round"/></svg>`;
}
function beforeAfter() {
  return `<div class="ba"><div><div class="tag" style="color:#FF5C7A">Antes</div><div class="mini"><div class="st">☰ Menu</div><div class="st" style="border-color:#FF5C7A">⚠ Criar cadastro obrigatório</div><div class="st">Total: 42 créditos</div>
    <div style="background:#cccccc;color:#eee;border-radius:4px;text-align:center;padding:4px;width:60%">Pagar</div></div><div class="ws" style="font-size:10.5px;margin:3px 0 0;line-height:1.25">Cadastro antes de pagar e botão quase invisível</div></div>
   <div style="text-align:center;font-size:22px;color:#E8C99A">→</div>
   <div><div class="tag" style="color:#3DDC84">Depois</div><div class="mini"><div class="st">☰ Menu</div><div class="st">🍜 Prato escolhido</div><div class="st">Revisar · Total: 42 créditos</div>
    <div style="display:flex;justify-content:center"><div style="background:#333;color:#fff;border-radius:4px;text-align:center;padding:5px;width:70%;font-weight:700">Pagar</div></div></div><div class="ws" style="font-size:10.5px;margin:3px 0 0;line-height:1.25">Sem cadastro, botão com contraste e centralizado</div></div></div>`;
}
function portrait(who) {
  if (who === 'nara') return `<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="pbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2a6b"/><stop offset="1" stop-color="#151030"/></linearGradient></defs>
   <rect width="100" height="100" fill="url(#pbg)"/><path d="M8 100 Q12 74 34 70 L66 70 Q88 74 92 100Z" fill="#2B3A67" stroke="#0b0f20" stroke-width="1.5"/><path d="M40 70 L50 84 L60 70" fill="#1b2440" stroke="#0b0f20" stroke-width="1.2"/>
   <rect x="64" y="80" width="14" height="6" rx="1" fill="#FFB347"/><rect x="43" y="56" width="14" height="16" fill="#4FB3A9" stroke="#0b0f20" stroke-width="1.2"/>
   <path d="M28 20 Q22 6 14 4 Q24 14 26 28Z M72 20 Q78 6 86 4 Q76 14 74 28Z" fill="#3f978e" stroke="#0b0f20" stroke-width="1.2"/>
   <path d="M50 12 Q30 12 28 34 Q28 52 50 62 Q72 52 72 34 Q70 12 50 12Z" fill="#4FB3A9" stroke="#0b0f20" stroke-width="1.6"/>
   <path d="M30 26 Q50 2 70 26 Q66 14 50 13 Q34 14 30 26Z" fill="#5b2a86" stroke="#0b0f20" stroke-width="1.2"/><circle cx="50" cy="9" r="6" fill="#5b2a86" stroke="#0b0f20" stroke-width="1.2"/>
   <path d="M35 33 Q40 30 45 33 Q40 37 35 33Z" fill="#FFD36B" stroke="#0b0f20" stroke-width="1.2"/><circle cx="40" cy="33.5" r="1.6" fill="#0b0f20"/>
   <path d="M55 33 Q60 30 65 33 Q60 37 55 33Z" fill="#FFD36B" stroke="#0b0f20" stroke-width="1.2"/><circle cx="60" cy="33.5" r="1.6" fill="#0b0f20"/>
   <path d="M34 28 L46 30 M54 30 L66 28" stroke="#0b0f20" stroke-width="2" stroke-linecap="round"/>
   <path d="M50 36 L49 44 L51.5 44" fill="none" stroke="#2c6b64" stroke-width="1.2"/><path d="M44 51 Q50 49 56 51" fill="none" stroke="#3b1f4a" stroke-width="2" stroke-linecap="round"/>
   <path d="M33 42 Q37 46 38 41 M67 42 Q63 46 62 41" fill="none" stroke="#3f978e" stroke-width="1"/><circle cx="28" cy="40" r="3" fill="none" stroke="#FFB347" stroke-width="1.4"/><circle cx="72" cy="40" r="3" fill="none" stroke="#FFB347" stroke-width="1.4"/></svg>`;
  return `<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="tbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f3a5a"/><stop offset="1" stop-color="#0b1426"/></linearGradient></defs>
   <rect width="100" height="100" fill="url(#tbg)"/><path d="M6 100 Q10 70 34 66 Q50 76 66 66 Q90 70 94 100Z" fill="#6b4a8a" stroke="#0b0f20" stroke-width="1.5"/><path d="M26 70 Q50 58 74 70 Q66 80 50 80 Q34 80 26 70Z" fill="#FF9F45" stroke="#0b0f20" stroke-width="1.2"/>
   <path d="M30 18 Q18 10 16 0 M70 18 Q82 10 84 0" stroke="#c4603d" stroke-width="5" stroke-linecap="round" fill="none"/>
   <path d="M50 14 Q26 14 26 38 Q26 58 50 64 Q74 58 74 38 Q74 14 50 14Z" fill="#D9734E" stroke="#0b0f20" stroke-width="1.6"/>
   <path d="M34 34 Q40 31 46 34" fill="none" stroke="#0b0f20" stroke-width="1.4"/><path d="M54 34 Q60 31 66 34" fill="none" stroke="#0b0f20" stroke-width="1.4"/>
   <path d="M35 37 Q40 35 45 37 Q40 40 35 37Z" fill="#fff" stroke="#0b0f20" stroke-width="1"/><circle cx="40" cy="37.3" r="1.5" fill="#0b0f20"/>
   <path d="M55 37 Q60 35 65 37 Q60 40 55 37Z" fill="#fff" stroke="#0b0f20" stroke-width="1"/><circle cx="60" cy="37.3" r="1.5" fill="#0b0f20"/>
   <path d="M33 29 L45 31 M55 31 L67 29" stroke="#5a2a18" stroke-width="2.2" stroke-linecap="round"/><circle cx="50" cy="25" r="3" fill="#f0e06a" stroke="#0b0f20" stroke-width="1"/><circle cx="50" cy="25" r="1.2" fill="#0b0f20"/>
   <path d="M47 42 Q50 47 53 42" fill="none" stroke="#8a3d22" stroke-width="1.3"/><path d="M43 53 Q50 50 57 53" fill="none" stroke="#3b1a10" stroke-width="2" stroke-linecap="round"/>
   ${[[38,50],[41,52],[59,52],[62,50],[45,56],[55,56]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="#7a3a22"/>`).join('')}</svg>`;
}
function label(x, y, t) { return `<g><rect x="${x - t.length*3.1 - 6}" y="${y - 9}" width="${t.length*6.2 + 12}" height="14" rx="7" fill="#fff" stroke="#2a2a3a" stroke-width="1"/><text x="${x}" y="${y + 1.5}" font-size="9" font-weight="700" text-anchor="middle" fill="#1b1b2b">${t}</text></g>`; }
function alien(x, y, c = '#4FB3A9') { return `<g><ellipse cx="${x}" cy="${y+15}" rx="5" ry="1.8" fill="rgba(0,0,0,.3)"/><path d="M${x-4} ${y-2} L${x+4} ${y-2} L${x+5} ${y+14} L${x-5} ${y+14}Z" fill="#3a3163" stroke="#141a2e" stroke-width=".7"/><rect x="${x-1}" y="${y-5}" width="2" height="3" fill="${c}"/><ellipse cx="${x}" cy="${y-9}" rx="3.4" ry="4.6" fill="${c}" stroke="#141a2e" stroke-width=".7"/><path d="M${x-2.4} ${y-9.5} l1.6 .4 M${x+2.4} ${y-9.5} l-1.6 .4" stroke="#141a2e" stroke-width="1"/><path d="M${x-3} ${y-12} Q${x-6} ${y-17} ${x-5} ${y-19} M${x+3} ${y-12} Q${x+6} ${y-17} ${x+5} ${y-19}" stroke="${c}" stroke-width="1.1" fill="none"/></g>`; }
function cantina(lit) {
  const cx = 165, cy = 118, w = 40, h = 34;
  let g = `<ellipse cx="${cx}" cy="${cy+w+4}" rx="54" ry="16" fill="rgba(0,0,0,.12)"/>` + faces(cx, cy, w, h, '#9a5a36', '#7a3f22', '#5e2f19');
  g += `<ellipse cx="${cx}" cy="${cy-h+w/2+2}" rx="30" ry="17" fill="#b87333" stroke="#2a1a10" stroke-width="1.3"/><ellipse cx="${cx-8}" cy="${cy-h+w/2-4}" rx="10" ry="5" fill="#e0a070"/>`;
  g += `<line x1="${cx}" y1="${cy-h+w/2-14}" x2="${cx}" y2="${cy-h+w/2-26}" stroke="#2a2a3a" stroke-width="1.5"/><circle cx="${cx}" cy="${cy-h+w/2-27}" r="2.5" fill="#FF4D6D"/>`;
  g += `<g transform="translate(128 114) skewY(26.57)"><rect x="0" y="0" width="34" height="9" rx="2" fill="#1a0f0a" stroke="#FF3FA4" stroke-width="1"/><text x="17" y="7" font-size="6.5" font-weight="900" text-anchor="middle" fill="#FF6EC7">CANTINA</text></g>`;
  g += `<g transform="translate(142 134) skewY(26.57)"><path d="M0 22 V8 Q7 -2 14 8 V22Z" fill="#1b1430" stroke="#2a2a3a" stroke-width="1"/></g>`;
  const wc = lit ? '#FFD36B' : '#c9a24a';
  g += `<g transform="translate(176 124) skewY(-26.57)"><circle cx="5" cy="6" r="4" fill="${wc}" stroke="#2a2a3a"/><circle cx="17" cy="6" r="4" fill="${wc}" stroke="#2a2a3a"/><circle cx="29" cy="6" r="4" fill="${wc}" stroke="#2a2a3a"/></g>`;
  g += `<g stroke="#2a1a10" stroke-width=".8">${[0,1,2,3].map(i => `<circle cx="${cx-w+6+i*9}" cy="${cy-h+w/2+8+i*4.5}" r=".9" fill="#d9a070"/>`).join('')}</g><path d="M${cx-w} ${cy+w/2-4} L${cx} ${cy+w-4}" stroke="#3a1f10" stroke-width="2" opacity=".6"/>`;
  g += `<text x="${cx+28}" y="${cy-h+4}" font-size="11" fill="#FF6EC7">♪</text><text x="${cx+36}" y="${cy-h-4}" font-size="9" fill="#FF6EC7">♫</text>`;
  g += alien(122, 150) + (lit ? alien(110, 158, '#FFB347') + alien(134, 162, '#2EC4F1') + alien(98, 150, '#FF8FB1') : '');
  return g + label(cx, cy + w + 22, 'Cantina Estelar');
}
function oficina() {
  const cx = 378, cy = 104, w = 36, h = 24;
  let g = `<ellipse cx="${cx+6}" cy="${cy+w+2}" rx="72" ry="26" fill="#EBD3A6" stroke="#d6b77f" stroke-width="1"/>`;
  g += `<ellipse cx="${cx+46}" cy="${cy+w-6}" rx="10" ry="4" fill="#d9bc85"/><ellipse cx="${cx-48}" cy="${cy+w+6}" rx="8" ry="3" fill="#d9bc85"/>`;
  g += faces(cx, cy, w, h, '#E6C590', '#D9B27C', '#C49A63');
  g += `<ellipse cx="${cx}" cy="${cy-h+w/2+1}" rx="24" ry="14" fill="#EED3A3" stroke="#2a2a3a" stroke-width="1.3"/><ellipse cx="${cx-7}" cy="${cy-h+w/2-3}" rx="8" ry="4" fill="#f7e6c4"/>`;
  g += `<path d="M${cx+10} ${cy-h+w/2-10} q8 -10 16 0" fill="#ddd" stroke="#2a2a3a" stroke-width="1.2"/><line x1="${cx+18}" y1="${cy-h+w/2-5}" x2="${cx+18}" y2="${cy-h+w/2-12}" stroke="#2a2a3a" stroke-width="1.2"/>`;
  g += `<polygon points="${cx+8},${cy+3} ${cx+28},${cy-7} ${cx+28},${cy+13} ${cx+8},${cy+23}" fill="#5a4630" stroke="#2a2a3a" stroke-width="1"/>`;
  g += `<g transform="translate(${cx-28} ${cy-2}) skewY(26.57)"><circle cx="8" cy="8" r="6" fill="none" stroke="#7a5a2f" stroke-width="2.4" stroke-dasharray="2.5 1.6"/><circle cx="8" cy="8" r="2" fill="#7a5a2f"/></g>`;
  const dx = cx + 50, dy = cy + 24;
  g += `<ellipse cx="${dx}" cy="${dy+17}" rx="8" ry="2.5" fill="rgba(0,0,0,.2)"/><rect x="${dx-4}" y="${dy+11}" width="3" height="5" fill="#555"/><rect x="${dx+1}" y="${dy+11}" width="3" height="5" fill="#555"/>
  <rect x="${dx-7}" y="${dy}" width="14" height="12" rx="3" fill="#FF9F45" stroke="#2a2a3a"/><rect x="${dx-6}" y="${dy-9}" width="12" height="9" rx="2" fill="#3DDC84" stroke="#2a2a3a"/>
  <circle cx="${dx-2.5}" cy="${dy-4.5}" r="1.5" fill="#0E1630"/><circle cx="${dx+2.5}" cy="${dy-4.5}" r="1.5" fill="#0E1630"/><line x1="${dx}" y1="${dy-9}" x2="${dx}" y2="${dy-14}" stroke="#2a2a3a"/><circle cx="${dx}" cy="${dy-15}" r="1.5" fill="#FFD36B"/>
  <line x1="${dx-7}" y1="${dy+4}" x2="${dx-11}" y2="${dy+9}" stroke="#2a2a3a" stroke-width="1.5"/><line x1="${dx+7}" y1="${dy+4}" x2="${dx+11}" y2="${dy+9}" stroke="#2a2a3a" stroke-width="1.5"/>`;
  return g + label(cx, cy + w + 24, 'Oficina de Droides');
}
function mercado() {
  const cx = 318, cy = 206, w = 34, h = 16;
  let g = `<ellipse cx="${cx}" cy="${cy+w+3}" rx="46" ry="13" fill="rgba(0,0,0,.12)"/>` + faces(cx, cy, w, h, '#c9a27a', '#a9744f', '#8a5a3a');
  for (let i = 0; i < 4; i++) { const x = cx - 26 + i * 13, y = cy - h + 4 + (i < 2 ? 0 : 0);
    g += `<polygon points="${x},${y-18 + Math.abs(i-1.5)*4} ${x+13},${y-18 + Math.abs(i-1.5)*4} ${x+13},${y-6 + Math.abs(i-1.5)*4} ${x},${y-6 + Math.abs(i-1.5)*4}" fill="${i%2?'#efe0c4':'#b5452b'}" stroke="#2a2a3a" stroke-width=".8"/>`; }
  g += `<line x1="${cx-26}" y1="${cy-h+4-12}" x2="${cx-26}" y2="${cy}" stroke="#2a2a3a" stroke-width="1.2"/><line x1="${cx+26}" y1="${cy-h+4-12}" x2="${cx+26}" y2="${cy}" stroke="#2a2a3a" stroke-width="1.2"/>`;
  g += faces(cx - 30, cy + 26, 6, 6, '#C08A50', '#a8743f', '#8f6233') + faces(cx - 18, cy + 32, 5, 5, '#C08A50', '#a8743f', '#8f6233');
  g += `<circle cx="${cx-6}" cy="${cy-h+10}" r="3" fill="#FF4D6D"/><circle cx="${cx}" cy="${cy-h+8}" r="3" fill="#3DDC84"/><circle cx="${cx+6}" cy="${cy-h+10}" r="3" fill="#FFB347"/>`;
  return g + label(cx, cy + w + 20, 'Mercado Orbital');
}
function hubTower() {
  const cx = 112, cy = 214, w = 22, h = 52;
  let g = `<ellipse cx="${cx}" cy="${cy+w+3}" rx="32" ry="10" fill="rgba(0,0,0,.12)"/>` + faces(cx, cy, w, h, '#4a3a2e', '#3a2c22', '#2a1f18');
  g += `<g transform="translate(${cx-20} ${cy-h-2}) skewY(26.57)"><rect width="16" height="4" y="6" fill="#2EC4F1" opacity=".8"/><rect width="16" height="4" y="14" fill="#2EC4F1" opacity=".5"/><rect width="16" height="4" y="22" fill="#2EC4F1" opacity=".8"/></g>`;
  g += `<polygon points="${cx-14},${cy-h-24} ${cx+14},${cy-h-24} ${cx+10},${cy-h-6} ${cx-10},${cy-h-6}" fill="rgba(46,196,241,.35)" stroke="#2EC4F1" stroke-width="1.2"/><text x="${cx}" y="${cy-h-12}" font-size="8" font-weight="900" text-anchor="middle" fill="#0E1630">HUB</text>`;
  return g + label(cx, cy + w + 18, 'Hub · simulados');
}
function player(x, y, scale = 1) {
  const sk = ['#f3dccb','#e2b994','#c48c62','#8f5e3e','#5e3d29','#7fb88a'][S.skin], c = S.outfit === 'f' ? '#8B7CFF' : '#2EC4F1', ln = '#141a2e';
  const legs = S.outfit === 'f'
    ? `<path d="M-6 -12 L6 -12 L8 -2 L-8 -2Z" fill="#3b2f6b" stroke="${ln}" stroke-width=".7"/><rect x="-4" y="-2" width="2.6" height="7" fill="${sk}"/><rect x="1.4" y="-2" width="2.6" height="7" fill="${sk}"/>`
    : `<rect x="-5" y="-12" width="4.4" height="17" fill="#2a3352" stroke="${ln}" stroke-width=".6"/><rect x=".6" y="-12" width="4.4" height="17" fill="#2a3352" stroke="${ln}" stroke-width=".6"/>`;
  const nm = (S.name || 'Jogador').slice(0, 16);
  return `<g id="me" transform="translate(${x} ${y}) scale(${scale})"><ellipse cx="0" cy="5" rx="8" ry="2.6" fill="rgba(0,0,0,.35)"/>${S.cape ? `<path d="M-7 -28 Q0 -31 7 -28 L10 4 Q0 7 -10 4Z" fill="#6b4a33" stroke="#141a2e" stroke-width=".7"/><path d="M-5.5 -33 Q-5 -43 0 -43 Q5 -43 5.5 -33 Q6 -28 4 -28 L-4 -28 Q-6 -28 -5.5 -33Z" fill="#5a3d29" stroke="#141a2e" stroke-width=".7"/>` : ''}${legs}
    <rect x="-5" y="4" width="4.5" height="2.4" rx="1" fill="#111"/><rect x=".5" y="4" width="4.5" height="2.4" rx="1" fill="#111"/>
    <path d="M-6.5 -27 Q0 -29 6.5 -27 L6 -11 L-6 -11Z" fill="${c}" stroke="${ln}" stroke-width=".8"/><rect x="-1.6" y="-31" width="3.2" height="4" fill="${sk}"/>
    <ellipse cx="0" cy="-35" rx="4.3" ry="5" fill="${sk}" stroke="${ln}" stroke-width=".8"/><path d="M-4.4 -36 Q-4 -41.5 0 -41.5 Q4.4 -41.5 4.4 -36 Q2 -38.5 0 -38.6 Q-2 -38.5 -4.4 -36Z" fill="#2e211b"/>${S.hair===1?'<path d="M-4.4 -36 L-5 -27 L-3 -30Z M4.4 -36 L5 -27 L3 -30Z" fill="#2e211b"/>':''}
    <g transform="translate(0 -52)"><rect x="${-nm.length*2.6-6}" y="-7" width="${nm.length*5.2+12}" height="12" rx="3" fill="rgba(8,6,5,.85)" stroke="#E8C99A" stroke-width=".8"/><text x="0" y="1.6" font-size="7.5" font-weight="700" text-anchor="middle" fill="#f1e6d6" font-family="Space Grotesk, sans-serif">${nm}</text></g></g>`;
}
const DOORS = { cantina: [138, 166], oficina: [414, 150], mercado: [348, 244], hub: [205, 264] };
function world({ mark = 'red', lit = false, people = false } = {}) {
  let g = `<defs><radialGradient id="sky" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#26346b"/><stop offset="1" stop-color="#0E1630"/></radialGradient></defs>
  <rect x="-200" y="-200" width="948" height="700" fill="url(#sky)"/>`;
  [[30,20],[90,60],[480,30],[520,90],[440,250],[60,260],[250,15],[350,40],[20,140],[530,200]].forEach(([x,y],i) => g += `<circle cx="${x}" cy="${y}" r="${i%3?1:1.6}" fill="#fff" opacity=".8"/>`);
  g += `<circle cx="490" cy="48" r="18" fill="#FF9F45" opacity=".9"/><ellipse cx="490" cy="48" rx="30" ry="6" fill="none" stroke="#FFD36B" stroke-width="2" opacity=".8"/>`;
  g += `<polygon points="274,44 520,167 274,290 28,167" fill="#D9B98E" stroke="#8a5a3a" stroke-width="2"/><polygon points="28,167 274,290 274,298 28,175" fill="#9a6440"/><polygon points="520,167 274,290 274,298 520,175" fill="#7a4a2e"/><ellipse cx="380" cy="230" rx="40" ry="10" fill="#cfa877" opacity=".7"/><ellipse cx="110" cy="190" rx="30" ry="8" fill="#cfa877" opacity=".7"/><ellipse cx="300" cy="90" rx="34" ry="8" fill="#e6c9a0" opacity=".6"/>`;
  for (let i = 1; i < 8; i++) {
    g += `<line x1="${28 + i*30.75}" y1="${167 - i*15.4}" x2="${274 + i*30.75}" y2="${290 - i*15.4}" stroke="#c9a476" opacity=".7"/>`;
    g += `<line x1="${520 - i*30.75}" y1="${167 - i*15.4}" x2="${274 - i*30.75}" y2="${290 - i*15.4}" stroke="#c9a476" opacity=".7"/>`;
  }
  g += `<path d="M138 166 L270 172 L414 150 M270 172 L348 244 M270 172 L205 264" stroke="#8a6a50" stroke-width="10" stroke-linecap="round" fill="none" opacity=".55"/>`;
  g += `<g class="clk" data-b="oficina" transform="translate(12 -4)">${oficina()}</g><g class="clk" data-b="cantina" transform="translate(-15 -6)">${cantina(lit)}</g><g class="clk" data-b="hub" transform="translate(118 24)">${hubTower()}</g><g class="clk" data-b="mercado" transform="translate(52 -2)">${mercado()}</g>`;
  if (mark === 'red') g += `<g class="clk" data-b="cantina"><g><animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="1.1s" repeatCount="indefinite"/><circle cx="150" cy="56" r="11" fill="#FF4D6D" stroke="#fff" stroke-width="2.5"/><text x="150" y="61.5" font-size="15" font-weight="900" text-anchor="middle" fill="#fff">!</text></g></g>`;
  if (mark === 'green') g += `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="1.4s" repeatCount="indefinite"/><polygon points="150,42 161,56 150,70 139,56" fill="#3DDC84" stroke="#fff" stroke-width="2"/></g>`;
  g += player(S.pos[0], S.pos[1]);
  return `<svg class="world" id="wsvg" viewBox="0 0 548 300" preserveAspectRatio="xMidYMid slice">${g}</svg>`;
}
/* ---------- estúdio v14: casa isométrica com loja ---------- */
const SHOP = [
  { k: 'cabeceira', e: '🗄', n: 'Mesa de cabeceira', p: 10, room: 'Quarto' },
  { k: 'luminaria', e: '💡', n: 'Luminária', p: 12, room: 'Quarto', dep: 'cabeceira' },
  { k: 'poster', e: '🖼', n: 'Quadro', p: 8, room: 'Quarto' },
  { k: 'escrivaninha', e: '🪵', n: 'Escrivaninha', p: 25, room: 'Escritório' },
  { k: 'monitor', e: '🖥', n: 'Monitor e teclado', p: 30, room: 'Escritório', dep: 'escrivaninha' },
  { k: 'cadeira', e: '🪑', n: 'Cadeira', p: 15, room: 'Escritório' },
  { k: 'estante', e: '📚', n: 'Estante de livros', p: 20, room: 'Escritório' },
  { k: 'relogio', e: '🕰', n: 'Relógio de parede', p: 6, room: 'Escritório' },
  { k: 'planta', e: '🪴', n: 'Planta', p: 10, room: 'Escritório' },
  { k: 'tapete', e: '🟫', n: 'Tapete', p: 10, room: 'Sala' },
  { k: 'mesinha', e: '☕', n: 'Mesa de centro', p: 12, room: 'Sala' },
  { k: 'sofa', e: '🛋', n: 'Sofá', p: 35, room: 'Sala' },
  { k: 'droide', e: '🤖', n: 'Droide de estimação', p: 40, room: 'Sala' },
  { k: 'bancada', e: '🚰', n: 'Bancada com pia', p: 20, room: 'Cozinha' },
  { k: 'cafeteira', e: '☕', n: 'Cafeteira', p: 8, room: 'Cozinha', dep: 'bancada' },
  { k: 'geladeira', e: '🧊', n: 'Geladeira', p: 25, room: 'Cozinha' },
];
const ROOMS = ['Quarto', 'Escritório', 'Sala', 'Cozinha'];
const ISO = (u, v, z = 0) => [274 + 202 * (u - v), 152 + 101 * (u + v) - z];
const IP = (u, v, z = 0) => ISO(u, v, z).map(n => +n.toFixed(1)).join(',');
const SL = '#3a2a20';
const ipoly = (pts, fill, sw = 1) => `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${SL}" stroke-width="${sw}" stroke-linejoin="round"/>`;
function ibox(u, v, du, dv, h, c, z0 = 0) { // c = [topo, face +v (esquerda), face +u (direita)]
  return ipoly([IP(u,v+dv,z0), IP(u+du,v+dv,z0), IP(u+du,v+dv,z0+h), IP(u,v+dv,z0+h)], c[1])
       + ipoly([IP(u+du,v,z0), IP(u+du,v+dv,z0), IP(u+du,v+dv,z0+h), IP(u+du,v,z0+h)], c[2])
       + ipoly([IP(u,v,z0+h), IP(u+du,v,z0+h), IP(u+du,v+dv,z0+h), IP(u,v+dv,z0+h)], c[0]);
}
const ishadow = (u, v, du, dv) => `<polygon points="${[IP(u-.004,v-.004), IP(u+du+.022,v-.004), IP(u+du+.022,v+dv+.022), IP(u-.004,v+dv+.022)].join(' ')}" fill="rgba(40,20,10,.2)"/>`;
const iline = (a, b, c = SL, w = 1) => `<line x1="${ISO(...a)[0]}" y1="${ISO(...a)[1]}" x2="${ISO(...b)[0]}" y2="${ISO(...b)[1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const rwall = (u1, ztop, inner) => `<g transform="translate(${ISO(u1, 0, ztop).join(' ')}) skewY(26.57)">${inner}</g>`;
const lwall = (v2, ztop, inner) => `<g transform="translate(${ISO(0, v2, ztop).join(' ')}) skewY(-26.57)">${inner}</g>`;
const WOOD = ['#b88456', '#8a5a36', '#6e4528'], DARK = ['#3a2e2a', '#241c19', '#2e2420'], WHITE = ['#fbf8f2', '#e2dccf', '#ece6da'];
const ITEMS = {
  poster: { at: [0, .73, 76], d: () => lwall(.82, 96, `<rect width="36" height="40" fill="#fffaf2" stroke="${SL}" stroke-width="1.2"/><rect x="3" y="3" width="30" height="34" fill="#E07A3E"/><circle cx="18" cy="16" r="7" fill="#FFD36B"/><path d="M3 28 Q18 20 33 28 V37 H3Z" fill="#8a5a3a"/>`) },
  relogio: { at: [.23, 0, 89], d: () => rwall(.2, 100, `<circle cx="6" cy="10" r="8" fill="#fffaf2" stroke="${SL}" stroke-width="1.5"/><line x1="6" y1="10" x2="6" y2="5" stroke="${SL}" stroke-width="1.2"/><line x1="6" y1="10" x2="9" y2="11" stroke="${SL}" stroke-width="1.2"/>`) },
  escrivaninha: { at: [.22, .06, 40], d: o => (o ? ishadow(.1, 0, .24, .12) : '') + ibox(.1, 0, .015, .12, 26, WOOD) + ibox(.27, 0, .07, .115, 26, WOOD)
    + iline([.27, .115, 9], [.34, .115, 9]) + iline([.27, .115, 18], [.34, .115, 18]) + ibox(.1, 0, .24, .12, 4, ['#c9935f', '#8a5a36', '#7a4f30'], 26) },
  monitor: { at: [.2, .03, 66], d: () => ibox(.19, .015, .02, .02, 8, DARK, 30) + ibox(.14, .02, .12, .012, 24, ['#222', '#5fd39a', '#1a1410'], 37)
    + ibox(.15, .07, .09, .03, 1.5, ['#e8e8e8', '#aaa', '#999'], 30) + ibox(.26, .08, .015, .02, 1.5, ['#e8e8e8', '#aaa', '#999'], 30) },
  cadeira: { at: [.21, .19, 46], d: o => (o ? ishadow(.17, .15, .08, .08) : '') + ibox(.2, .18, .02, .02, 14, DARK) + ibox(.17, .15, .08, .08, 4, ['#5a4a72', '#2e2440', '#3a2e50'], 14) + ibox(.17, .215, .08, .015, 24, ['#5a4a72', '#2e2440', '#3a2e50'], 18) },
  planta: { at: [.395, .045, 48], d: o => (o ? ishadow(.37, .02, .05, .05) : '') + ibox(.37, .02, .05, .05, 12, ['#5a3a24', '#a34e2c', '#8a3f22'])
    + (() => { const [x, y] = ISO(.395, .045, 12); return [[-8, -14, -30], [8, -16, 25], [0, -24, 0], [-4, -30, -12], [6, -28, 14]].map(([dx, dy, r]) => `<ellipse cx="${x+dx}" cy="${y+dy}" rx="5" ry="11" transform="rotate(${r} ${x+dx} ${y+dy})" fill="#5f8f4e" stroke="${SL}" stroke-width=".8"/>`).join(''); })() },
  bancada: { at: [.53, .065, 42], d: o => (o ? ishadow(.44, 0, .18, .13) + rwall(.44, 55, `<rect width="36" height="22" fill="#dfe9e6" stroke="${SL}" stroke-width=".8"/>${[7, 14].map(y => `<line x1="0" y1="${y}" x2="36" y2="${y}" stroke="#b7c9c4" stroke-width=".7"/>`).join('')}${[9, 18, 27].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="22" stroke="#b7c9c4" stroke-width=".7"/>`).join('')}`) : '')
    + ibox(.44, 0, .18, .13, 30, ['#e8e2d6', '#9c7a5a', '#7d5f44']) + iline([.5, .13, 4], [.5, .13, 26]) + iline([.56, .13, 4], [.56, .13, 26]) + iline([.48, .13, 22], [.48, .13, 16], '#E8C99A', 1.6) + iline([.52, .13, 22], [.52, .13, 16], '#E8C99A', 1.6)
    + ibox(.44, 0, .18, .13, 3, ['#ece8e0', '#cfc8ba', '#bdb6a8'], 30) + ipoly([IP(.53, .03, 33.2), IP(.59, .03, 33.2), IP(.59, .09, 33.2), IP(.53, .09, 33.2)], '#aebbc2', .8) + iline([.56, .012, 33], [.56, .012, 42], '#888', 2) + iline([.56, .012, 42], [.56, .04, 42], '#888', 2) },
  cafeteira: { at: [.48, .04, 56], d: () => ibox(.46, .02, .04, .04, 13, ['#333', '#222', '#2a2a2a'], 33) + `<circle cx="${ISO(.47, .06, 41)[0]}" cy="${ISO(.47, .06, 41)[1]}" r="1.6" fill="#FF5C7A"/>` + ibox(.465, .045, .02, .02, 4, ['#f4efe6', '#d6cbb8', '#e2d6c2'], 33) },
  geladeira: { at: [.68, .06, 76], d: o => (o ? ishadow(.63, 0, .1, .12) : '') + ibox(.63, 0, .1, .12, 66, ['#f4f4f4', '#d9dde2', '#c4c9cf']) + iline([.63, .12, 44], [.73, .12, 44]) + iline([.645, .12, 48], [.645, .12, 60], '#888', 1.8) + iline([.645, .12, 30], [.645, .12, 40], '#888', 1.8) },
  estante: { at: [.04, .34, 84], d: o => { let b = (o ? ishadow(0, .26, .08, .16) : '') + ibox(0, .26, .08, .16, 74, ['#a9744f', '#7a4a2e', '#8f5f3c']) + ipoly([IP(.081, .27, 3), IP(.081, .41, 3), IP(.081, .41, 71), IP(.081, .27, 71)], '#5e3a24', .6);
      const cols = ['#b5452b', '#2EC4F1', '#E8C99A', '#3DDC84', '#8B7CFF', '#E07A3E', '#f1e6d6'];
      [4, 27, 50].forEach((z, si) => { let v = .274, i = si * 3; while (v < .398) { const w = .011 + ((i * 7) % 3) * .004, h = 13 + ((i * 5) % 4) * 2;
        b += `<polygon points="${[IP(.082, v, z), IP(.082, v + w, z), IP(.082, v + w, z + h), IP(.082, v, z + h)].join(' ')}" fill="${cols[i % 7]}" stroke="${SL}" stroke-width=".5"/>`; v += w + .003; i++; } });
      return b + [3, 26, 49, 72].map(z => iline([.081, .27, z], [.081, .41, z], '#a9744f', 2)).join(''); } },
  cabeceira: { at: [.04, .51, 34], d: o => (o ? ishadow(0, .47, .08, .08) : '') + ibox(0, .47, .08, .08, 22, WOOD) + iline([.08, .475, 12], [.08, .545, 12]) + `<circle cx="${ISO(.08, .51, 16)[0]}" cy="${ISO(.08, .51, 16)[1]}" r="1.3" fill="#E8C99A"/>` },
  luminaria: { at: [.04, .51, 58], d: o => { const [x, y] = ISO(.04, .51, 37); return (o ? `<circle cx="${x}" cy="${y}" r="38" fill="url(#glow)"/>` : '') + ibox(.03, .5, .02, .02, 3, DARK, 22) + iline([.04, .51, 25], [.04, .51, 37], SL, 1.6) + `<polygon points="${x-7},${y} ${x+7},${y} ${x+5},${y-11} ${x-5},${y-11}" fill="#FFD36B" stroke="${SL}"/>`; } },
  tapete: { at: [.64, .64, 2], d: () => ipoly([IP(.36, .36), IP(.66, .36), IP(.66, .66), IP(.36, .66)], '#b5452b', .8) + ipoly([IP(.38, .38), IP(.64, .38), IP(.64, .64), IP(.38, .64)], '#E8D3B0', .6) + ipoly([IP(.42, .42), IP(.6, .42), IP(.6, .6), IP(.42, .6)], '#c9643f', .6) + ipoly([IP(.51, .44), IP(.58, .51), IP(.51, .58), IP(.44, .51)], '#E8D3B0', .5) },
  mesinha: { at: [.51, .51, 26], d: o => (o ? ishadow(.45, .45, .12, .12) : '') + ibox(.46, .46, .1, .1, 12, WOOD) + ibox(.45, .45, .12, .12, 3, ['#c9935f', '#8a5a36', '#7a4f30'], 12)
    + ibox(.48, .48, .025, .025, 6, ['#fffaf2', '#E07A3E', '#d06a30'], 15) + ibox(.52, .5, .04, .05, 3, ['#2EC4F1', '#1f8fb3', '#2aa6cf'], 15) },
  sofa: { at: [.57, .8, 36], d: o => { const F = ['#3f8a8f', '#1f4f54', '#27606a'], F2 = ['#4fa0a5', '#2a6a70', '#327a80'];
      return (o ? ishadow(.44, .74, .26, .12) : '') + ibox(.44, .74, .26, .12, 10, F) + ibox(.44, .74, .025, .12, 19, F) + ibox(.465, .742, .105, .09, 5, F2, 10) + ibox(.575, .742, .1, .09, 5, F2, 10)
        + ibox(.48, .8, .04, .025, 9, ['#E8C99A', '#c9a27a', '#d6b48c'], 15) + ibox(.675, .74, .025, .12, 19, F) + ibox(.44, .83, .26, .03, 28, F); } },
  droide: { at: [.78, .54, 34], d: o => `<g>${o ? '<animateTransform attributeName="transform" type="translate" values="0 0;0 -2.5;0 0" dur="1.6s" repeatCount="indefinite"/>' : ''}${o ? `<ellipse cx="${ISO(.78, .54)[0]}" cy="${ISO(.78, .54)[1] + 2}" rx="11" ry="4" fill="rgba(40,20,10,.2)"/>` : ''}`
      + ibox(.762, .522, .036, .036, 11, ['#FFB36B', '#d97a2a', '#e88a35'], 3) + ibox(.766, .526, .028, .028, 9, ['#5fe39a', '#2aa866', '#33bb74'], 14)
      + `<circle cx="${ISO(.772, .554, 19)[0]}" cy="${ISO(.772, .554, 19)[1]}" r="1.4" fill="#0E1630"/><circle cx="${ISO(.786, .554, 19)[0]}" cy="${ISO(.786, .554, 19)[1]}" r="1.4" fill="#0E1630"/>`
      + iline([.78, .54, 23], [.78, .54, 30]) + `<circle cx="${ISO(.78, .54, 31)[0]}" cy="${ISO(.78, .54, 31)[1]}" r="2" fill="#FFD36B"/></g>` },
};
function slot(k) {
  const it = SHOP.find(x => x.k === k), I = ITEMS[k];
  if (S[k]) return I.d(true);
  if (it.dep && !S[it.dep]) return '';
  const ghost = I.d(false).replace(/fill="[^"]*"/g, 'fill="rgba(255,250,240,.07)"').replace(/stroke="[^"]*"/g, 'stroke="rgba(110,74,50,.6)"').replace(/<(polygon|rect|ellipse|circle) /g, '<$1 stroke-dasharray="3 2" ');
  const [x, y] = ISO(...I.at);
  return `<g class="clk ghost" data-a="buy:${k}"><title>${it.n} · ${it.p} créditos</title>${ghost}<circle cx="${x}" cy="${y}" r="7.5" fill="#E8D3B0" stroke="#2a1a10" stroke-width="1.2"/><text x="${x}" y="${y + 3.6}" font-size="11" font-weight="700" text-anchor="middle" fill="#2a1a10">+</text></g>`;
}
function studioSvg() {
  let g = `<defs><radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFE3A8" stop-opacity=".6"/><stop offset="1" stop-color="#FFE3A8" stop-opacity="0"/></radialGradient>
    <linearGradient id="wl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f2e9"/><stop offset="1" stop-color="#ebe3d5"/></linearGradient>
    <linearGradient id="wr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ece4d6"/><stop offset="1" stop-color="#ddd2c0"/></linearGradient>
    <linearGradient id="earth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e4630"/><stop offset="1" stop-color="#3a2216"/></linearGradient></defs>
  <rect x="-300" y="-200" width="1200" height="800" fill="url(#earth)"/>
  ${[[20, 60, 4], [520, 90, 6], [500, 330, 3], [40, 330, 5], [90, 20, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#5a3826"/>`).join('')}
  <path d="M60 140 L274 30 L488 140 L488 262 L274 368 L60 262Z" fill="#2a170e" opacity=".55"/>`;
  // paredes
  g += ipoly([IP(0, 0, 112), IP(0, 1, 112), IP(0, 1, 0), IP(0, 0, 0)], 'url(#wl)', 1.4) + ipoly([IP(0, 0, 112), IP(1, 0, 112), IP(1, 0, 0), IP(0, 0, 0)], 'url(#wr)', 1.4);
  g += ipoly([IP(0, 0, 6), IP(0, 1, 6), IP(0, 1, 0), IP(0, 0, 0)], '#c9b79a', .8) + ipoly([IP(0, 0, 6), IP(1, 0, 6), IP(1, 0, 0), IP(0, 0, 0)], '#bba98c', .8);
  g += `<path d="M${IP(0, 1, 112).replace(',', ' ')} L${IP(0, 0, 112).replace(',', ' ')} L${IP(1, 0, 112).replace(',', ' ')}" fill="none" stroke="#fffaf2" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
  // piso de madeira
  g += ipoly([IP(0, 0), IP(1, 0), IP(1, 1), IP(0, 1)], '#c9a57a', 1.4);
  for (let i = 1; i < 20; i++) { const v = i * .05; g += iline([0, v], [1, v], '#b48f63', .7);
    for (let j = 0; j < 4; j++) { const u = ((i * 37 + j * 29) % 100) / 100; g += iline([u, v - .05], [u, v], '#b48f63', .7); } }
  g += ipoly([IP(0, 0), IP(1, 0), IP(1, .05), IP(0, .05)], 'rgba(60,30,10,.08)', 0) + ipoly([IP(0, 0), IP(.05, 0), IP(.05, 1), IP(0, 1)], 'rgba(60,30,10,.08)', 0);
  // janela com vista do cânion + luz no chão
  g += rwall(.46, 98, `<rect width="30" height="38" fill="#0E1630" stroke="#fffaf2" stroke-width="3"/><circle cx="21" cy="11" r="5" fill="#FF9F45"/><circle cx="7" cy="8" r=".8" fill="#fff"/><circle cx="14" cy="5" r=".8" fill="#fff"/><path d="M0 30 Q10 22 18 27 T30 25 V38 H0Z" fill="#D9B98E"/><line x1="15" y1="0" x2="15" y2="38" stroke="#fffaf2" stroke-width="1.5"/><line x1="0" y1="19" x2="30" y2="19" stroke="#fffaf2" stroke-width="1.5"/>`)
    + ipoly([IP(.46, .14), IP(.61, .14), IP(.66, .34), IP(.5, .34)], 'rgba(255,214,150,.13)', 0);
  // porta em arco com degraus
  g += lwall(.2, 66, `<path d="M0 66 V22 Q13 2 26 22 V66Z" fill="#2a1a10" stroke="${SL}" stroke-width="1.2"/><path d="M3 66 V24 Q13 8 23 24 V66Z" fill="url(#glow)"/>${[0, 1, 2, 3].map(i => `<rect x="${5 + i * 2}" y="${58 - i * 9}" width="${16 - i * 4}" height="5" fill="#D8C3A0" stroke="${SL}" stroke-width=".6"/>`).join('')}`)
    + `<text x="${ISO(0, .16, 76)[0]}" y="${ISO(0, .16, 76)[1]}" font-size="7.5" font-weight="700" fill="#7a5a40" transform="rotate(-26.57 ${ISO(0, .16, 76).join(' ')})">saída ↑</text>`;
  // banheiro
  g += ipoly([IP(.765, 0), IP(1, 0), IP(1, .3), IP(.765, .3)], '#d4e3e5', .8);
  for (let i = 1; i < 6; i++) g += iline([.765, i * .05], [1, i * .05], '#b8cdd0', .6) + iline([.765 + i * .047, 0], [.765 + i * .047, .3], '#b8cdd0', .6);
  g += rwall(.87, 82, `<rect width="26" height="82" fill="#cfe5e0" stroke="${SL}" stroke-width=".8"/>${[16, 32, 48, 64].map(y => `<line x1="0" y1="${y}" x2="26" y2="${y}" stroke="#a9c9c2" stroke-width=".6"/>`).join('')}<line x1="13" y1="6" x2="13" y2="14" stroke="#888" stroke-width="2"/><ellipse cx="13" cy="15" rx="5" ry="2" fill="#aaa"/>`);
  g += ibox(.755, 0, .012, .3, 72, ['#fffaf2', '#e6ddcc', '#f3ede2']);
  g += ibox(.8, 0, .05, .025, 24, WHITE) + ibox(.796, .025, .058, .065, 13, WHITE) + ipoly([IP(.806, .035, 13.2), IP(.845, .035, 13.2), IP(.845, .08, 13.2), IP(.806, .08, 13.2)], '#dfe7ea', .6);
  g += ipoly([IP(.8, .15), IP(.86, .15), IP(.86, .21), IP(.8, .21)], '#2EC4F1', .6);
  g += ibox(.87, .16, .13, .004, 76, ['rgba(220,240,245,.5)', 'rgba(200,230,240,.35)', 'rgba(200,230,240,.35)']);
  g += `<text x="${ISO(.9, .26)[0]}" y="${ISO(.9, .26)[1]}" font-size="8" font-weight="700" text-anchor="middle" fill="#4a6a70">Banheiro</text>`;
  // parede: relógio e quadro
  g += slot('relogio') + slot('poster');
  // fundo → frente
  g += slot('tapete') + slot('escrivaninha') + slot('monitor') + slot('planta') + slot('bancada') + slot('cafeteira') + slot('geladeira')
    + slot('estante') + slot('cabeceira') + slot('luminaria') + slot('cadeira');
  // cama (já vem com a casa)
  g += ishadow(0, .6, .36, .27) + ibox(.02, .6, .34, .27, 10, WOOD) + ibox(.02, .605, .335, .26, 7, WHITE, 10)
    + ibox(.03, .63, .07, .09, 5, ['#fffaf2', '#e2dccf', '#ece6da'], 17) + ibox(.03, .75, .07, .09, 5, ['#fffaf2', '#e2dccf', '#ece6da'], 17)
    + ibox(.15, .6, .21, .27, 9, ['#7b5a9a', '#4f3570', '#5d3f7c'], 10) + ibox(0, .6, .02, .27, 36, WOOD);
  g += slot('mesinha') + slot('sofa') + slot('droide');
  return `<svg class="world" viewBox="40 0 470 380" preserveAspectRatio="xMidYMid meet">${g}</svg>`;
}
function shopPanel() {
  const owned = SHOP.filter(i => S[i.k]).length;
  return `<div class="shop"><div class="shop-h"><b>🛒 Loja do estúdio</b><span>🪙 ${S.coins}</span></div>
  <div class="ws" style="font-size:11.5px;margin:2px 0 6px">Clique num item ou no <b>+</b> da casa. ${owned} de ${SHOP.length} itens instalados.</div>
  <div class="bar" style="margin:0 0 8px"><b style="width:${owned / SHOP.length * 100}%"></b></div>
  <div class="scrolly" style="flex:1;min-height:0;overflow-y:auto">${ROOMS.map(r => `<div class="shop-r">${r}</div>` + SHOP.filter(i => i.room === r).map(i => {
    const own = S[i.k], lock = i.dep && !S[i.dep], poor = !own && !lock && S.coins < i.p;
    return `<div class="srow ${own ? 'own' : lock ? 'lock' : poor ? 'poor' : ''}" data-a="buy:${i.k}"><span>${i.e} ${i.n}${lock ? `<small>precisa: ${SHOP.find(x => x.k === i.dep).n.toLowerCase()}</small>` : ''}</span><b>${own ? '✓' : lock ? '🔒' : i.p + ' 🪙'}</b></div>`; }).join('')).join('')}</div></div>`;
}
/* ---------- v14: glossário do Holopad ---------- */
const GLOSS = [
  ['UX', 'UX (User Experience)', 'Experiência do usuário: como a pessoa se sente e se sai ao usar um produto, do começo ao fim.'],
  ['UX', 'Pesquisa com usuários', 'Conversar, observar ou levantar dados de pessoas reais para entender o problema antes de desenhar a solução.'],
  ['UX', 'Pesquisa desk', 'Pesquisa feita com dados que já existem, como reclamações, avaliações e artigos, sem entrevistar ninguém.'],
  ['UX', 'Entrevista', 'Conversa guiada com um usuário para entender a experiência real dele.'],
  ['UX', 'Escuta empática', 'Ouvir sem julgar, prestando atenção ao que a pessoa sente e precisa.'],
  ['UX', 'Pergunta aberta', 'Pede uma história ou explicação (“como foi…?”), e não só sim ou não. É a melhor para entrevistas.'],
  ['UX', 'Pergunta fechada', 'Tem resposta curta, como sim/não ou uma nota. Serve para medir, mas não explica o porquê.'],
  ['UX', 'Pergunta indutora', 'Já entrega a opinião (“você concorda que é confuso?”) e empurra a pessoa para uma resposta.'],
  ['UX', 'Pergunta hipotética', 'Pergunta sobre o futuro (“você usaria…?”). O que a pessoa diz que faria nem sempre é o que faz.'],
  ['UX', 'Jornada do usuário', 'Os passos que a pessoa percorre para alcançar um objetivo, com o que pensa e sente em cada um.'],
  ['UX', 'Fluxo de usuário', 'O caminho de telas e ações para completar uma tarefa. Menos passos desnecessários, menos desistência.'],
  ['UX', 'Blueprint de serviço', 'Mapa que mostra lado a lado as ações do cliente e as respostas do sistema ou da equipe.'],
  ['UX', 'Linha de interação', 'No blueprint, a linha que separa o que o cliente faz do que o sistema responde.'],
  ['UX', 'Taxa de abandono', 'Quantas pessoas começam uma tarefa, como um pedido, e desistem antes de terminar.'],
  ['UX', 'Carga cognitiva', 'O esforço mental que a tela exige. Muitas opções e textos longos aumentam a carga.'],
  ['UX', 'Heurísticas de Nielsen', '10 princípios para avaliar interfaces, como “visibilidade do status do sistema” e “prevenção de erros”.'],
  ['UX', 'Leis de UX', 'Princípios de psicologia aplicados ao design, como as leis de Hick, Fitts e Jakob. Veja o card “Leis de UX”.'],
  ['UX', 'Dark pattern', 'Truque de design que engana a pessoa, como esconder o botão de recusar uma oferta.'],
  ['UX', 'Upsell', 'Oferecer um produto a mais ou mais caro, como um combo ou uma sobremesa, durante a compra.'],
  ['UX', 'Acessibilidade', 'Fazer o produto funcionar para todas as pessoas, incluindo quem tem deficiência visual, motora ou auditiva.'],
  ['UX', 'Case (estudo de caso)', 'A história de um projeto, do problema à solução, usada em portfólios.'],
  ['UI', 'UI (User Interface)', 'Interface do usuário: a parte visual com que a pessoa interage, como telas, botões, cores e textos.'],
  ['UI', 'Wireframe', 'O esqueleto da tela em blocos simples, sem cores nem imagens finais. Serve para decidir a estrutura.'],
  ['UI', 'Mockup', 'Imagem realista de como a tela final vai ficar, muitas vezes dentro de um celular ou computador.'],
  ['UI', 'Protótipo', 'Versão de teste em que dá para clicar. Serve para validar ideias antes de construir de verdade.'],
  ['UI', 'CTA (call to action)', 'Chamada para ação: o botão principal da tela, como “Pagar” ou “Comprar”.'],
  ['UI', 'Hierarquia visual', 'A ordem em que o olho lê a tela, criada com tamanho, cor, posição e espaçamento.'],
  ['UI', 'Contraste', 'A diferença de cor e brilho entre o texto e o fundo. Pouco contraste deixa o texto difícil de ler.'],
  ['UI', 'WCAG', 'Diretrizes internacionais de acessibilidade na web. Pedem contraste mínimo de 4,5:1 para textos.'],
  ['UI', 'Espaçamento', 'O espaço vazio entre os elementos. Agrupa o que é relacionado e deixa a tela respirar.'],
  ['UI', 'Gestalt', 'Princípios de como o cérebro agrupa o que vê, como proximidade e semelhança. Veja o card “Leis de Gestalt”.'],
  ['UI', 'Inspetor', 'Painel de ferramentas de design, como no Figma, onde se ajustam a cor, o tamanho e o espaçamento de um elemento.'],
  ['Front-end', 'Front-end', 'A parte do site ou app que roda na tela da pessoa, feita com HTML, CSS e JavaScript.'],
  ['Front-end', 'HTML', 'Linguagem que define a estrutura e o conteúdo da página, como títulos, textos e botões.'],
  ['Front-end', 'CSS', 'Linguagem que define o visual: cores, tamanhos, posições e espaçamentos.'],
  ['Front-end', 'JavaScript', 'Linguagem que dá comportamento à página: cliques, animações e cálculos.'],
  ['Front-end', 'Box model', 'Todo elemento é uma caixa com conteúdo, padding (espaço interno), borda e margem (espaço externo).'],
  ['Front-end', 'Flexbox (display: flex)', 'Forma do CSS de alinhar elementos em linha ou em coluna.'],
  ['Front-end', 'justify-content', 'Propriedade do flexbox que distribui os elementos: center centraliza e space-between espalha.'],
  ['Front-end', 'Preview', 'Pré-visualização: mostra o resultado do código antes de publicar.'],
  ['Front-end', 'Testes', 'Verificações automáticas que confirmam se o código faz o que deveria.'],
  ['Front-end', 'Bug', 'Erro no código que faz o produto se comportar de um jeito inesperado. No jogo, é a “areia nos circuitos”.'],
  ['Front-end', 'Deploy', 'Publicar a nova versão do código para as pessoas usarem.'],
  ['Jogo', 'Product Builder', 'Quem une UX, UI e Front-end: entende o problema, desenha a solução e coloca no ar.'],
  ['Jogo', 'Totem de autoatendimento', 'Tela onde o cliente faz o pedido e paga sozinho, sem atendente.'],
  ['Jogo', 'Checkout', 'A etapa final de uma compra: revisar o pedido e pagar.'],
  ['Jogo', 'Totemização', 'Quando o autoatendimento substitui todo o atendimento humano e o cliente fica sem escolha.'],
  ['Jogo', 'Holopad', 'O seu caderno de conceitos: cards para revisar a qualquer momento, sem perder o progresso.'],
  ['Jogo', 'XP', 'Pontos de experiência que medem o seu progresso no jogo.'],
  ['Jogo', 'Badge', 'Selo de conquista ganho ao concluir uma missão.'],
  ['Jogo', 'Céu limpo', 'Expressão do jogo para “tudo certo, missão cumprida”.'],
].sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'));
const GL_CATS = ['Todos', 'UX', 'UI', 'Front-end', 'Jogo'];
const nrm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function glossPanel() {
  const cat = S.glcat || 'Todos';
  return `<h3>Glossário</h3><div class="ws" style="font-size:13px">Todos os termos técnicos e jargões usados no jogo, em linguagem simples.</div>
  <input id="glq" class="box" style="width:100%;font:inherit;font-size:14px;margin:6px 0" placeholder="🔍 Buscar termo (ex.: CTA, deploy, wireframe)" value="${(S.glq || '').replace(/"/g, '&quot;')}" autocomplete="off">
  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">${GL_CATS.map(c => `<div class="pill ${c === cat ? 'sel' : ''}" data-a="glcat:${c}" style="font-size:12.5px;padding:3px 10px">${c}</div>`).join('')}</div>
  <div id="gllist">${GLOSS.filter(g => cat === 'Todos' || g[0] === cat).map(([c, t, d]) => `<div class="gl-item" data-s="${nrm(t + ' ' + d)}"><div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><b style="font-size:14.5px;color:#fff">${t}</b><span class="gl-tag">${c}</span></div><div style="font-size:13.5px;line-height:1.45;color:#e2d3bf">${d}</div></div>`).join('')}
  <div id="glnone" class="ws" style="display:none;text-align:center;margin-top:16px">Nenhum termo encontrado. Tente outra palavra.</div></div>`;
}
function filterGloss() {
  const q = nrm(S.glq || ''); let n = 0;
  document.querySelectorAll('.gl-item').forEach(el => { const ok = !q || el.dataset.s.includes(q); el.style.display = ok ? '' : 'none'; n += ok; });
  const none = $('#glnone'); if (none) none.style.display = n ? 'none' : 'block';
}
const HOLO_FOR = { learn1: 'Glossário|pergunta', learn2: 'Fluxo de usuário', research: 'Leis de UX', plan: 'Glossário|hierarquia', practice: 'Contraste (WCAG)' };

function hud() {
  const xp = S.done ? 360 : 120, cr = S.coins, lvl = S.done ? 2 : 1;
  return `<div class="hud clk" data-a="profile" style="left:14px;top:14px;width:208px;font-size:12.5px"><b>${S.name}</b><div style="font-size:11.5px;color:#c9b9a3;white-space:nowrap">Nível ${lvl} · Junior Builder</div>
  <div class="bar"><b style="width:${S.done ? 55 : 35}%"></b></div>${xp} XP · 🪙 ${cr} créditos</div>
  <div class="hud" style="right:14px;top:14px;display:flex;gap:12px"><span class="clk holo-btn ${S.holoSeen ? '' : 'pulse'}" data-a="holo" title="Cards de conceito, leis de UX e glossário">◱ Holopad<small>conceitos</small></span><span class="clk" data-a="cam">⟲</span><span class="clk" data-a="cam">⊕</span><span class="clk" data-a="cam">⊖</span></div>`;
}
const GE_PHOTO = 'assets/img/ge-adventure-series.jpg'; // foto: GE Healthcare (ver créditos no README)
const RS = [
  { cat: 'Navegação e interface', f: 'Cardápio extenso e confuso: muitas categorias e telas, e o cliente demora para achar um item simples.',
    o: ['Mostrar todos os pratos em uma única tela longa', 'Poucas categorias claras, busca e os mais pedidos em destaque', 'Criar mais categorias e subcategorias'], c: 1,
    why: 'Menos escolhas por tela e atalhos para o que é mais pedido reduzem a carga cognitiva (Lei de Hick).' },
  { cat: 'Navegação e interface', f: 'Upsell agressivo: combos, bebidas e sobremesas oferecidos a cada clique.',
    o: ['Oferecer adicionais uma única vez, no resumo, com “Não, obrigado” bem visível', 'Esconder o botão de pular a oferta', 'Mostrar uma oferta nova em cada tela'], c: 0,
    why: 'Uma oferta no momento certo vende sem irritar. Esconder a saída é um dark pattern.' },
  { cat: 'Navegação e interface', f: 'Difícil personalizar o pedido: tirar ingredientes, trocar acompanhamento ou escrever uma observação.',
    o: ['Pedir para o cliente falar com um atendente', 'Botão “Personalizar” em cada prato, com opções e campo de observação', 'Não permitir mudanças no pedido'], c: 1,
    why: 'Controle e liberdade do usuário: a personalização precisa estar onde a pessoa escolhe o prato.' },
  { cat: 'Navegação e interface', f: 'Medo de errar e pagar errado: item duplicado, item errado ou não conseguir voltar.',
    o: ['Resumo editável antes de pagar e botão “Voltar” sempre visível', 'Pagar direto, sem resumo, para ser mais rápido', 'Só permitir corrigir no caixa'], c: 0,
    why: 'Prevenção de erros e controle do usuário: conferir e corrigir antes de confirmar dá segurança.' },
  { cat: 'Falhas técnicas', f: 'Tela que trava no meio do pedido e obriga a começar do zero.',
    o: ['Reiniciar o totem automaticamente sem avisar', 'Salvar o pedido em andamento e mostrar o status do carregamento', 'Pedir para o cliente tocar mais forte na tela'], c: 1,
    why: 'Visibilidade do status do sistema: a pessoa precisa saber o que está acontecendo e não perder o que já fez.' },
  { cat: 'Falhas técnicas', f: 'Pagamento falha: cartão por aproximação não lê, QR Code do Pix não carrega ou não sai a senha.',
    o: ['Mostrar “Erro 503” e cancelar o pedido', 'Explicar o erro em linguagem simples e oferecer outra forma de pagar sem perder o pedido', 'Voltar para a tela inicial'], c: 1,
    why: 'Ajude a reconhecer e recuperar erros: mensagem clara e uma saída, sem jogar o pedido fora.' },
  { cat: 'Falhas técnicas', f: 'Totem com erro e nenhum funcionário por perto para ajudar.',
    o: ['Botão “Chamar atendente” sempre visível, que avisa a equipe', 'Um cartaz com o telefone do suporte', 'Desligar o totem quando der erro'], c: 0,
    why: 'Ajuda e suporte no momento do problema evitam que o cliente desista e vá para a fila do caixa.' },
  { cat: 'Fatores humanos e acessibilidade', f: 'Pressão da fila: pessoas esperando atrás geram ansiedade e pressa.',
    o: ['Colocar um cronômetro na tela', 'Fluxo curto e opção de começar o pedido pelo celular com QR Code', 'Remover a tela de resumo para acelerar'], c: 1,
    why: 'Reduzir etapas e permitir adiantar o pedido diminui a ansiedade, sem tirar a chance de revisar.' },
  { cat: 'Fatores humanos e acessibilidade', f: 'Barreiras para idosos, pessoas com baixa visão ou deficiência motora: tela alta, letras pequenas.',
    o: ['Modo acessível: botões ao alcance, letras maiores, alto contraste e áudio', 'Deixar como está, porque a maioria usa sem problemas', 'Diminuir o texto para caber mais itens'], c: 0,
    why: 'Acessibilidade (WCAG) e alcance físico: o totem precisa funcionar para todas as pessoas.' },
  { cat: 'Fatores humanos e acessibilidade', f: 'Ausência de alternativa humana (“totemização”): a pessoa se sente obrigada a fazer o trabalho do atendente.',
    o: ['Remover todos os caixas', 'Manter um caminho de atendimento humano e deixar isso claro no totem', 'Cobrar taxa de quem quer atendimento'], c: 1,
    why: 'O autoatendimento deve ser uma opção a mais, não a única. Dar escolha respeita o usuário.' },
];
function fbar(btns) {
  const f = S.fb;
  const help = f && !f.ok && HOLO_FOR[cur] ? `<div class="btn o" data-a="hcard:${HOLO_FOR[cur]}" title="Revisar o conceito no Holopad">◱ Ver no Holopad</div>` : '';
  return `<div class="fbar ${f ? (f.ok ? 'ok' : 'err') : ''}"><div class="msg">${f ? f.msg : 'Quando terminar, clique em <b>Verificar</b>. Dúvida em algum termo? Abra o <b>◱ Holopad</b>.'}</div><div class="fbtns">${help}${btns}</div></div>`;
}
function stepbar(a) {
  return `<div class="steps">${['Learn · UX','Research · UX','Plan · UI','Practice · UI','DIY · Front'].map((t,i) => `<span class="${i===a?'on':i<a?'ok':''}">${t}</span>`).join('')}</div>`;
}
function bench(title, step, body) {
  return world() + `<div class="dim"></div><div class="glass"><div class="ttl"><b>${title}</b>${step!==null?stepbar(step):''}
  <span><span style="margin-right:14px">🪙 ${S.coins}</span><span class="clk holo-btn ${S.holoSeen ? '' : 'pulse'}" data-a="holo" style="margin-right:12px" title="Cards de conceito, leis de UX e glossário">◱ Holopad<small>dúvidas?</small></span><span class="x" data-a="close">✕</span></span></div>${body}</div>`;
}

/* ---------- v13: Leis de UX e análise do AWS Skill Builder (Holopad) ---------- */
const LAWS = [
  { k: 'Von Restorff', t: 'Efeito Von Restorff', tag: 'Chama atenção', who: 'Hedwig von Restorff · 1933',
    idea: 'O que é diferente se destaca e é lembrado.',
    use: ['Destaque só a ação principal (cor, tamanho, forma)', 'Se tudo se destaca, nada se destaca', 'Não dependa só da cor: some forma, texto ou ícone (acessibilidade)'],
    pq: 'Na etapa Practice, o CTA “Pagar” vira o único elemento escuro e preenchido do totem. É ele que o olho encontra primeiro.',
    ex: 'No AWS Skill Builder, “Create free account” é o único botão laranja do cabeçalho.' },
  { k: 'Hick', t: 'Lei de Hick', tag: 'Tempo para decidir', who: 'Hick & Hyman · 1952',
    idea: 'Quanto mais opções, mais lenta a decisão.',
    use: ['Reduza e agrupe as escolhas', 'Quebre tarefas longas em etapas', 'Destaque uma opção recomendada'],
    pq: 'A escolha de trilha tem só 4 opções, com o Product Builder recomendado. Na Research, a solução do cardápio confuso é ter poucas categorias e os mais pedidos em destaque.',
    ex: 'O Skill Builder mostra 3 caminhos na página inicial em vez de mais de 1.000 cursos.' },
  { k: 'Miller', t: 'Lei de Miller', tag: 'Memória', who: 'George A. Miller · 1956 · “o número 7 ± 2”',
    idea: 'A memória de curto prazo guarda poucos itens. Agrupar ajuda.',
    use: ['Divida informações em blocos (chunking)', 'Mostre processos em poucas etapas numeradas', 'Hoje se fala em cerca de 4 blocos: menos é melhor'],
    pq: 'A missão é dividida em 5 etapas numeradas na barra do topo (Learn, Research, Plan, Practice, DIY), e o blueprint tem só 4 passos.',
    ex: 'No Skill Builder, a certificação aparece em 4 passos. Um telefone fica mais fácil como (48) 99999-0000.' },
  { k: 'Fitts', t: 'Lei de Fitts', tag: 'Esforço para clicar', who: 'Paul Fitts · 1954 · painéis de avião',
    idea: 'Alvo grande e perto é clicado mais rápido.',
    use: ['Deixe botões importantes grandes e fáceis de alcançar', 'Faça a área de clique maior que o texto', 'Afaste ações perigosas das principais'],
    pq: 'Todos os botões têm pelo menos 48 px de altura e os cards de trilha são clicáveis por inteiro, não só no título.',
    ex: 'No Skill Builder, o card inteiro é clicável, não só o botão.' },
  { k: 'Jakob', t: 'Lei de Jakob', tag: 'Familiaridade', who: 'Jakob Nielsen · 2000 · Nielsen Norman Group',
    idea: 'As pessoas querem que o seu produto funcione como os que elas já usam.',
    use: ['Siga padrões conhecidos de navegação', 'Inove no conteúdo, não no básico', 'Faça mudanças grandes aos poucos'],
    pq: 'Perfil no canto superior esquerdo, Holopad no direito e andar com as setas ou W A S D, como em outros jogos.',
    ex: 'O cabeçalho do Skill Builder segue o padrão da Amazon e do Google: logo à esquerda, busca no centro e conta à direita.' },
  { k: 'Gestalt', t: 'Gestalt', tag: 'Percepção visual', who: 'Wertheimer, Köhler e Koffka · Alemanha · 1912–1923',
    idea: 'O cérebro agrupa o que vê em formas completas.',
    use: ['Perto = mesmo grupo (proximidade)', 'Mesma borda ou fundo = um grupo (região comum)', 'Mesmo estilo = mesma função (similaridade)'],
    pq: 'No blueprint, cada raia (cliente e totem) é uma região comum, e os cartões têm o mesmo estilo porque têm a mesma função. Veja o card “Leis de Gestalt” para os 8 princípios.',
    ex: 'No Skill Builder, cada oferta fica em um card com borda.' },
];
const LT = (x, y, s, c = '#2a1a10', w = 400, a = 'middle', f = 'Space Grotesk, sans-serif') => `<text x="${x}" y="${y}" font-size="${s}" fill="${c}" font-weight="${w}" text-anchor="${a}" font-family="${f}">`;
function lawArt(k) {
  const card = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#fff" stroke="#d6cbb8"/>`;
  if (k === 'Von Restorff') return `<svg viewBox="0 0 320 108" width="100%">${card(4,6,312,96)}
    ${[0,1,2,3,4].map(i => i === 3
      ? `<rect x="${16+i*60}" y="28" width="52" height="26" rx="13" fill="#E07A3E" stroke="#b5452b"/>${LT(42+i*60,45,9,'#fff',700)}Comprar</text>`
      : `<rect x="${16+i*60}" y="28" width="52" height="26" rx="13" fill="#eee5d6" stroke="#d6cbb8"/>${LT(42+i*60,45,9,'#9a8a7a')}Link</text>`).join('')}
    <path d="M222 20 l-6 -8 M226 18 l0 -10 M230 20 l6 -8" stroke="#E07A3E" stroke-width="1.6" stroke-linecap="round"/>
    ${LT(160,76,9.5,'#2a1a10',700)}Só um elemento diferente: o olho vai direto nele</text>${LT(160,92,8.5,'#7a6a5a')}se tudo se destaca, nada se destaca</text></svg>`;
  if (k === 'Hick') return `<svg viewBox="0 0 320 108" width="100%">${card(4,6,150,96)}${card(166,6,150,96)}
    ${[0,1].map(i => [0,1,2,3].map(j => `<rect x="${22+j*30}" y="${20+i*28}" width="22" height="22" rx="3" fill="#eee5d6" stroke="#b9a98f"/>`).join('')).join('')}
    ${[0,1,2].map(j => `<rect x="${186+j*38}" y="30" width="30" height="30" rx="4" fill="${j===1?'#E07A3E':'#eee5d6'}" stroke="#b9a98f"/>`).join('')}
    ${LT(79,90,9.5,'#c0392b',700)}8 opções = lento 😵</text>${LT(241,90,9.5,'#1f7a46',700)}3 opções = rápido ⚡</text></svg>`;
  if (k === 'Miller') return `<svg viewBox="0 0 320 120" width="100%">${card(4,6,150,60)}${card(166,6,150,60)}
    ${LT(79,32,13,'#2a1a10',700,'middle','JetBrains Mono, monospace')}48999990000</text>${LT(79,52,8.5,'#c0392b',700)}✗ difícil de guardar</text>
    ${LT(241,32,13,'#2a1a10',700,'middle','JetBrains Mono, monospace')}(48) 99999-0000</text>${LT(241,52,8.5,'#1f7a46',700)}✓ em blocos 🧠</text>
    ${[0,1,2,3,4,5,6].map(i => `<circle cx="${70+i*30}" cy="86" r="10" fill="${i<4?'#7a4a2e':'#c9b9a3'}"/>${LT(70+i*30,89.5,9,'#fff',700)}${i+1}</text>`).join('')}
    ${LT(160,112,8.5,'#7a6a5a')}cerca de 7 ± 2 itens cabem na memória curta (hoje se fala em ~4)</text></svg>`;
  if (k === 'Fitts') return `<svg viewBox="0 0 320 108" width="100%">${card(4,6,312,96)}
    <rect x="276" y="16" width="22" height="12" rx="3" fill="#c9b9a3"/>${LT(298,42,8,'#c0392b',700,'end')}longe e pequeno</text>
    <path d="M124 64 Q200 20 272 22" fill="none" stroke="#c0392b" stroke-width="1.2" stroke-dasharray="3 3"/>
    <rect x="20" y="56" width="112" height="32" rx="8" fill="#2a1a10"/>${LT(76,76,10,'#fff',700)}Botão grande</text>
    <path d="M116 70 l0 14 l3.5 -3.5 l3.5 7 l2.5 -1.2 l-3.5 -7 l5 0 z" fill="#fff" stroke="#2a1a10" stroke-width="1"/>
    ${LT(226,80,9.5,'#1f7a46',700)}perto e grande = clique rápido 👍</text></svg>`;
  if (k === 'Jakob') return `<svg viewBox="0 0 320 104" width="100%">${card(4,6,312,92)}
    <rect x="16" y="20" width="288" height="28" rx="5" fill="#2a1a10"/><rect x="26" y="28" width="30" height="12" rx="2" fill="#E8D3B0"/>
    <rect x="110" y="27" width="100" height="14" rx="7" fill="#f4efe6"/>${LT(124,37,8,'#7a6a5a',400,'start')}🔍 buscar</text>
    ${LT(250,37,8,'#f1e6d6',400)}Entrar</text><circle cx="288" cy="34" r="7" fill="#E8D3B0"/>
    ${LT(41,62,8,'#7a6a5a')}logo</text>${LT(160,62,8,'#7a6a5a')}busca no centro</text>${LT(276,62,8,'#7a6a5a')}conta</text>
    ${LT(160,86,9.5,'#2a1a10',700)}“Já sei usar!” O mesmo padrão de quase todo site 😎</text></svg>`;
  const dot = (x, y, c = '#7a4a2e') => `<circle cx="${x}" cy="${y}" r="5" fill="${c}"/>`;
  return `<svg viewBox="0 0 320 108" width="100%">${card(4,6,100,96)}${card(110,6,100,96)}${card(216,6,100,96)}
    ${[0,1].map(i => [0,1].map(j => dot(22+j*13, 30+i*13) + dot(68+j*13, 30+i*13)).join('')).join('')}${LT(54,82,9,'#2a1a10',700)}Proximidade</text>${LT(54,94,7.5,'#7a6a5a')}perto = grupo</text>
    <rect x="124" y="20" width="34" height="38" rx="5" fill="#f4e2cc" stroke="#E07A3E"/>${dot(134,30)}${dot(148,30)}${dot(134,46)}${dot(148,46)}${dot(176,30)}${dot(190,30)}${dot(176,46)}${dot(190,46)}${LT(160,82,9,'#2a1a10',700)}Região comum</text>${LT(160,94,7.5,'#7a6a5a')}mesma borda = grupo</text>
    ${[0,1,2].map(i => [0,1,2].map(j => dot(236+i*20, 24+j*15, j % 2 ? '#E07A3E' : '#7a4a2e')).join('')).join('')}${LT(266,82,9,'#2a1a10',700)}Similaridade</text>${LT(266,94,7.5,'#7a6a5a')}igual = grupo</text></svg>`;
}
function lawsPanel() {
  const k = S.law || 'Von Restorff', L = LAWS.find(l => l.k === k);
  return `<h3>Leis de UX</h3><div class="ws" style="font-size:13px">Seis atalhos do cérebro e como usá-los nas telas. Escolha uma lei e role para ler como usá-la.</div>
  <div style="display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 12px">${LAWS.map(l => `<div class="pill ${l.k===k?'sel':''}" data-a="law:${l.k}" style="font-size:12.5px;padding:4px 10px">${l.k}</div>`).join('')}</div>
  <div class="kicker">${L.tag} · ${L.who}</div><div style="font-size:18px;font-weight:700;margin:2px 0 8px">${L.t}</div>
  <div class="fig" style="margin-bottom:10px">${lawArt(k)}</div>
  <div style="font-size:15px;margin-bottom:8px"><b>A ideia:</b> ${L.idea}</div>
  <div style="font-size:14px;color:#E8C99A;font-weight:700">Como usar</div>
  <ul style="padding-left:18px;margin:2px 0 10px;font-size:14px;line-height:1.55">${L.use.map(u => `<li>${u}</li>`).join('')}</ul>
  <div class="box g" style="font-size:13.5px;line-height:1.45"><b>🎮 No Product Quest:</b> ${L.pq}</div>
  <div class="box g" style="font-size:13.5px;line-height:1.45;margin-bottom:0"><b>🔎 Exemplo real:</b> ${L.ex} <span class="clk" data-a="card:Análise: AWS Skill Builder" style="color:#E8C99A;text-decoration:underline">Ver a análise completa</span></div>`;
}
const AWS = [
  { p: 'Lei de Jakob', t: 'Um cabeçalho que já parece familiar', where: 'Cabeçalho no padrão de grandes sites', eff: 'Ninguém precisa aprender a navegação',
    see: 'Logo no canto superior esquerdo, que leva à página inicial. Busca no centro do topo. Idioma, suporte, “Sign in” e criar conta no canto direito.',
    why: 'É o mesmo padrão da Amazon, do Google e da maioria dos sites. A pessoa não precisa aprender onde ficam as coisas: já sabe por onde começar e economiza esforço logo no primeiro acesso.',
    l3: 'No meu projeto', t3: 'No Product Quest, o perfil fica no canto superior esquerdo e o Holopad no direito, como em outros jogos.' },
  { p: 'Von Restorff', t: 'O único botão laranja da página', where: 'Único botão laranja: “Create free account”', eff: 'Direciona para a ação principal',
    see: 'No cabeçalho escuro, todos os itens são texto branco. Só o botão “Create free account” é laranja e preenchido.',
    why: 'A cor diferente puxa o olhar direto para a ação mais importante para o negócio: criar uma conta. “Sign in”, logo ao lado, fica discreto porque é uma ação secundária.',
    l3: 'Cuidado', t3: 'O destaque só funciona se for raro. Se vários botões fossem laranja, nenhum se destacaria.' },
  { p: 'Lei de Hick', t: 'Só três caminhos para começar', where: '3 caminhos em vez de 1.000+ cursos', eff: 'Decisão rápida no primeiro acesso',
    see: 'A plataforma tem mais de 1.000 cursos, mas a página inicial mostra só 3 portas de entrada, escritas pelo objetivo da pessoa: “Estou começando”, “Quero crescer na carreira” e “Estudo com meu time”.',
    why: 'Em vez de escolher entre centenas de cursos, a pessoa escolhe entre 3 frases em que se reconhece. A decisão fica rápida e o catálogo completo aparece depois, já filtrado.',
    l3: 'No meu projeto', t3: 'Mesma ideia na escolha de trilha do Product Quest: só 4 opções, com uma recomendada.' },
  { p: 'Região comum', t: 'Cards que agrupam o que é do mesmo assunto', where: 'Ofertas separadas em cards', eff: 'Entende os produtos sem ler tudo',
    see: 'Cada oferta (cursos, Cloud Quest e microcredenciais) fica em um card branco com borda e sombra. Ilustração, categoria, título, descrição e botão ficam juntos e separados dos outros cards por espaço.',
    why: 'Sem ler nada, o olho entende que são 3 produtos diferentes e que cada botão pertence ao texto acima dele. Isso evita clicar no botão errado.',
    l3: 'Similaridade também aparece', t3: 'Os 3 cards têm a mesma estrutura e o mesmo estilo de botão: quem lê o primeiro já entende os outros.' },
  { p: 'Lei de Miller', t: 'Uma jornada longa quebrada em 4 passos', where: 'Certificação em 4 passos numerados', eff: 'Processo longo parece possível',
    see: 'Tirar uma certificação AWS é um processo longo, mas a página resume tudo em 4 passos numerados e ligados por setas: conhecer a prova, revisar o conteúdo, praticar e avaliar se está pronto.',
    why: '4 etapas cabem com folga na memória. Os números e as setas mostram a ordem e dão sensação de progresso. O último passo, com fundo preenchido, também usa o efeito Von Restorff para mostrar o objetivo final.',
    l3: 'No meu projeto', t3: 'A missão do Product Quest segue a mesma lógica: 5 etapas numeradas (Learn, Research, Plan, Practice, DIY).' },
  { p: 'Lei de Fitts', t: 'Alvos grandes: o card inteiro é clicável', where: 'Card inteiro clicável', eff: 'Clique mais fácil e rápido',
    see: 'Nos 3 caminhos da página inicial, não é só o botão que funciona: o card inteiro é clicável e o cursor vira a mãozinha em qualquer ponto dele. O botão dentro do card ocupa quase toda a largura.',
    why: 'A área de clique fica muito maior que a de um link de texto, então a pessoa acerta com menos precisão e menos tempo, principalmente em telas pequenas ou com touchpad.',
    l3: 'Observação', t3: 'Notei esse comportamento navegando: o código da página marca os cards como clicáveis (cursor pointer).' },
];
function awsArt(sel) {
  const R = [[2,1,316,25],[267,4,50,18],[6,39,308,42],[6,89,308,54],[8,149,304,32],[8,39,102,42]];
  const M = [[60,13],[262,4],[6,39],[6,89],[8,149],[100,72]];
  let g = `<rect x="0" y="0" width="320" height="196" rx="6" fill="#fff"/>
  <rect x="0" y="0" width="320" height="26" rx="6" fill="#232f3e"/><rect x="0" y="16" width="320" height="10" fill="#232f3e"/>
  <rect x="10" y="8" width="30" height="10" rx="2" fill="#e8ecf2"/><rect x="104" y="7" width="104" height="12" rx="6" fill="#fff"/>${LT(114,15.5,6,'#888',400,'start')}buscar cursos</text>
  ${LT(222,15.5,6,'#fff')}Idioma</text>${LT(243,15.5,6,'#fff')}Entrar</text><rect x="270" y="7" width="44" height="12" rx="3" fill="#FF9900"/>${LT(292,15.5,6,'#111',700)}Criar conta</text>
  <rect x="0" y="26" width="320" height="58" fill="#f4efe6"/>${LT(160,36,7,'#2a1a10',700)}Por onde você quer começar?</text>`;
  ['Estou começando','Crescer na carreira','Estudo com meu time'].forEach((t, i) => { const x = 10 + i * 102;
    g += `<rect x="${x}" y="42" width="96" height="36" rx="4" fill="#fff" stroke="#d6cbb8"/>${LT(x+48,56,6.5,'#2a1a10',700)}${t}</text><rect x="${x+8}" y="64" width="80" height="9" rx="2" fill="#2a1a10"/>${LT(x+48,70.5,5.5,'#fff',700)}Começar</text>`; });
  ['Cursos','Cloud Quest','Microcredenciais'].forEach((t, i) => { const x = 10 + i * 102;
    g += `<rect x="${x+1}" y="93" width="96" height="48" rx="4" fill="#e6dccd"/><rect x="${x}" y="92" width="96" height="48" rx="4" fill="#fff" stroke="#d6cbb8"/><rect x="${x+6}" y="97" width="84" height="16" rx="2" fill="#efe3cf"/>
      ${LT(x+6,122,6.5,'#2a1a10',700,'start')}${t}</text><rect x="${x+6}" y="126" width="70" height="3" rx="1.5" fill="#ddd2c0"/><rect x="${x+6}" y="132" width="34" height="6" rx="2" fill="#7a4a2e"/>`; });
  ['Conhecer','Revisar','Praticar','Avaliar'].forEach((t, i) => { const x = 14 + i * 76, last = i === 3;
    g += `<rect x="${x}" y="153" width="62" height="24" rx="4" fill="${last?'#2a1a10':'#fff'}" stroke="#7a4a2e"/>${LT(x+31,168,7,last?'#fff':'#2a1a10',700)}${i+1} ${t}</text>` + (last ? '' : `<path d="M${x+64} 165 h9 m-3 -3 l3 3 l-3 3" fill="none" stroke="#7a4a2e" stroke-width="1.2"/>`); });
  g += `${LT(160,191,6.5,'#9a8a7a')}esquema simplificado da página inicial · skillbuilder.aws</text>`;
  const [x, y, w, h] = R[sel];
  g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="rgba(224,122,62,.14)" stroke="#E07A3E" stroke-width="2" stroke-dasharray="5 3"/>`;
  if (sel === 5) g += `<path d="M84 60 l0 14 l3.5 -3.5 l3.5 7 l2.5 -1.2 l-3.5 -7 l5 0 z" fill="#fff" stroke="#111" stroke-width="1"/>`;
  g += M.map(([mx, my], i) => `<g class="clk" data-a="aws:${i}"><circle cx="${mx}" cy="${my}" r="${i===sel?7:5.5}" fill="${i===sel?'#E07A3E':'#7a6a5a'}" stroke="#fff" stroke-width="1.5"/>${LT(mx,my+2.6,i===sel?8:7,'#fff',700)}${i+1}</text></g>`).join('');
  return `<svg viewBox="-8 -8 336 210" width="100%">${g}</svg>`;
}
function awsPanel() {
  const i = S.aws || 0, A = AWS[i];
  return `<h3>Análise: AWS Skill Builder</h3><div class="ws" style="font-size:13px">Seis princípios de UX na página inicial da plataforma de estudos da AWS, a inspiração do Product Quest. Clique em um número ou em um princípio.</div>
  <div class="fig" style="margin:8px 0"><div style="max-width:440px;margin:0 auto">${awsArt(i)}</div></div><div class="ws" style="font-size:11.5px;text-align:center;color:#E8C99A">↓ role para ler a análise</div>
  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">${AWS.map((a, j) => `<div class="pill ${j===i?'sel':''}" data-a="aws:${j}" style="font-size:12.5px;padding:4px 10px">${j+1} · ${a.p}</div>`).join('')}</div>
  <div class="kicker">Princípio ${i+1} · ${A.p}</div><div style="font-size:18px;font-weight:700;margin:2px 0 8px">${A.t}</div>
  ${[['O que vejo', A.see], ['Por que funciona', A.why], [A.l3, A.t3]].map(([h, b]) => `<div style="font-size:14px;line-height:1.5;margin-bottom:8px"><b style="color:#E8C99A">${h}</b><br>${b}</div>`).join('')}
  <div style="font-size:14px;color:#E8C99A;font-weight:700;margin-top:12px">Resumo da análise</div>
  <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:4px"><tr style="color:#c9b9a3;text-align:left"><th style="padding:4px 6px">Princípio</th><th style="padding:4px 6px">Onde aparece</th><th style="padding:4px 6px">Efeito para o usuário</th></tr>
  ${AWS.map((a, j) => `<tr class="clk" data-a="aws:${j}" style="border-top:1px solid #4a3a2e;${j===i?'background:rgba(122,74,42,.45)':''}"><td style="padding:5px 6px;font-weight:700">${a.p}</td><td style="padding:5px 6px">${a.where}</td><td style="padding:5px 6px;color:#c9b9a3">${a.eff}</td></tr>`).join('')}</table>
  <div class="box g" style="margin:10px 0 0;font-size:13.5px;line-height:1.45"><b>⚠ Um ponto a melhorar:</b> a página abriu em inglês por padrão, e a troca de idioma fica num menu pequeno no topo. Para iniciantes brasileiros, isso aumenta o esforço logo no primeiro acesso. Por isso, toda a interface do Product Quest é em português.</div>
  <div class="ws" style="font-size:11px;margin-top:8px">Análise de Manuela Crespo · Módulo 10 · site analisado: skillbuilder.aws (acesso em 21/11/2026)</div>`;
}

/* ---------- telas ---------- */
const V = {
start: () => world({ mark: null }) + `<div class="dim"></div><div class="glass" style="left:200px;right:200px;top:80px;bottom:80px;text-align:center;justify-content:center;align-items:center;position:absolute">
  <div style="font-size:40px;font-weight:800;letter-spacing:1px;white-space:nowrap">PRODUCT QUEST</div><div class="ws" style="margin:8px 0 26px;font-size:16px">Aprenda UX, UI e Front-end salvando a Estação Orbital</div><div style="position:absolute;bottom:10px;right:16px;font-size:11px;color:#66708f">versão de teste 14</div>
  <div class="btn big" data-a="go:avatar" style="margin-bottom:14px">Iniciar missão</div><div class="btn o big" data-a="cont">Continuar jogo</div></div>`,

avatar: () => world({ mark: null }) + `<div class="dim"></div><div class="glass"><div class="ttl"><b>Crie seu personagem</b><span></span></div>
  <div class="cols"><div style="flex:.9;text-align:center" class="box">
   ${bigAvatar(250)}
   <div class="ws">⟲ girar · ⊕ zoom</div></div>
  <div style="flex:1.3"><div class="steps" style="margin-bottom:8px"><span class="on">Corpo</span><span class="clk" data-a="tab">Cabelo</span><span class="clk" data-a="tabroupa">Roupa</span><span class="clk" data-a="tabacc">Acessórios</span></div>
   <div class="ws">Tom de pele</div><div class="row" style="margin-bottom:8px">${['#f3dccb','#e2b994','#c48c62','#8f5e3e','#5e3d29','#7fb88a'].map((c,i) => `<div class="pill ${S.skin===i?'sel':''}" data-a="skin:${i}"><span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${c};vertical-align:middle;border:1px solid #141a2e"></span></div>`).join('')}</div>
   <div class="ws">Estilo de roupa</div><div class="row" style="margin-bottom:8px"><div class="pill ${S.outfit==='f'?'sel':''}" data-a="outfit:f">👗 Feminina</div><div class="pill ${S.outfit==='m'?'sel':''}" data-a="outfit:m">👔 Masculina</div></div>
   <div class="ws">Acessório</div><div class="row" style="margin-bottom:8px"><div class="pill ${!S.cape?'sel':''}" data-a="cape:0">Nenhum</div><div class="pill ${S.cape?'sel':''}" data-a="cape:1">🧥 Manto com capuz</div></div>
   <div class="ws">Estilo de cabelo</div><div style="display:flex;gap:10px;margin-bottom:12px">${['Curto','Longo','Coque','Raspado'].map((t,i) => `<div class="av clk" data-a="hair:${i}" style="width:72px;height:40px;display:flex;align-items:center;justify-content:center;font-size:13px;${S.hair===i?'border:2px solid #2EC4F1;background:#22306b':''}">${t}</div>`).join('')}</div>
   <div class="ws">Nome no crachá (aparece no mapa)</div><input id="nm" class="box" style="width:100%;font:inherit;font-size:15px" value="${S.name==='Jogador'?'':S.name}" placeholder="Como quer ser chamado(a)?">
   <div class="row" style="margin-top:8px"><div class="btn o" data-a="rand">🎲 Sortear visual</div><div class="btn" data-a="avatarOk">Salvar personagem</div></div></div></div></div>`,

spec: () => world({ mark: null }) + `<div class="dim"></div><div class="glass"><div class="ttl"><b>Qual trilha você quer seguir?</b><span></span></div>
  <div class="row" style="flex:1">${[['UX Researcher','Pesquisa com usuários, jornadas e fluxos','Só UX'],['UI Designer','Layout, cor, tipografia e componentes','Só UI'],['Front-end Dev','HTML, CSS e JavaScript','Só Front-end']].map(([t,d,k]) =>
   `<div class="box clk ${S.spec===t?'sel':''}" data-a="spec:${t}" style="display:flex;flex-direction:column"><b style="font-size:16px">${t}</b><div class="ws" style="margin:2px 0 0">${k}</div><div class="img" style="flex:1;margin:8px 0"></div>${d}</div>`).join('')}
   <div class="box clk ${S.spec==='Product Builder'?'sel':''}" data-a="spec:Product Builder" style="display:flex;flex-direction:column;border-color:#E8C99A"><b style="font-size:16px">Product Builder ✦</b><div class="ws" style="margin:2px 0 0;color:#E8C99A"><b>Trilha completa: as 3 áreas juntas</b></div>
   <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:5px;margin:8px 0"><div class="pill">UX · pesquisa</div><div style="text-align:center;font-weight:800">+</div><div class="pill">UI · visual</div><div style="text-align:center;font-weight:800">+</div><div class="pill">Front-end · código</div></div>
   Do problema ao deploy</div></div>
  <div class="ws">✦ <b>Product Builder</b> = UX + UI + Front-end na mesma trilha. Recomendado para quem está migrando de carreira.<br>Dá para trocar depois.</div><div class="btn big" data-a="go:world">Confirmar trilha</div></div>`,

world: () => world({ mark: S.done ? 'green' : 'red', lit: S.done, people: S.done }) + hud() + (S.holoSeen || S.coachOff ? '' : `<div class="coach"><b>◱ Novo por aqui?</b><br>No <b>Holopad</b> você encontra as leis de UX, um glossário com todos os termos técnicos e exemplos reais. Abra sempre que tiver dúvida: o jogo não perde o seu progresso.<div class="row"><div class="btn o" data-a="coachOff">Agora não</div><div class="btn" data-a="holo">Abrir Holopad</div></div></div>`) +
  `<div class="hud" style="left:50%;transform:translateX(-50%);top:14px;text-align:center;font-size:13.5px;white-space:nowrap;padding:11px 16px;border-color:#E8C99A">🎯 ${S.done ? 'Céu limpo! Abra seu perfil (canto superior esquerdo) para ver o próximo passo' : S.accepted ? 'Volte à Cantina Estelar para continuar a missão' : 'Vá até a Cantina Estelar e fale com a Nara, a gestora'}<div style="font-size:11px;color:#9aa6c6">Clique no prédio ou ande com as setas do teclado ou W A S D</div></div>`,

dialog: () => world() + hud() + `<div class="dlg"><div class="av" style="width:96px;height:96px;overflow:hidden;border-radius:8px;border-color:#8B7CFF">${portrait('nara')}</div><div style="flex:1"><b style="font-size:16px">Nara · gestora da Cantina Estelar</b> 😠
  <div style="font-size:15px;margin:6px 0 10px">“Viajante, que bom que você chegou! Os clientes começam o pedido no totem e desistem antes de pagar. A Cantina está às moscas… espaciais.”</div>
  <span class="chip" data-a="go:briefing">▶ Vou investigar</span><span class="chip" data-a="totem">O que é o totem?</span><span class="chip" data-a="go:world">Agora não</span></div></div>` + (S.modal === 'totem' ? `<div class="modal"><div class="card">
  <div style="display:flex;justify-content:space-between;align-items:center"><div class="kicker">Nara explica</div><span class="x clk" data-a="closeModal" style="font-size:20px;color:#c9b9a3">✕</span></div>
  <h3 style="font-size:22px;margin:4px 0 12px">O que é o totem?</h3>
  <div style="display:flex;gap:18px;align-items:center"><svg viewBox="0 0 80 130" style="width:110px;flex:none"><rect x="14" y="4" width="52" height="84" rx="6" fill="#2B3A67" stroke="#8fd3ff" stroke-width="1.5"/><rect x="20" y="12" width="40" height="58" rx="2" fill="#f4f6fb"/><rect x="24" y="16" width="32" height="6" fill="#c7cde0"/><rect x="24" y="26" width="32" height="18" fill="#dfe4f2"/><rect x="24" y="48" width="32" height="5" fill="#c7cde0"/><rect x="24" y="58" width="32" height="7" rx="2" fill="#d9dce6"/><rect x="34" y="88" width="12" height="30" fill="#2B3A67" stroke="#8fd3ff" stroke-width="1.5"/><rect x="22" y="118" width="36" height="8" rx="2" fill="#1a2446" stroke="#8fd3ff" stroke-width="1.5"/></svg>
  <div style="font-size:15px;line-height:1.5;color:#c9d2ea">“É a tela de autoatendimento na entrada da Cantina, viajante. Os clientes escolhem os pratos e pagam sozinhos, sem falar com ninguém.<br><br>O problema: muita gente começa o pedido e <b style="color:#fff">desiste antes de pagar</b>. Preciso que você descubra por quê.”</div></div>
  <div style="text-align:right;margin-top:14px"><div class="btn" data-a="closeModal">Entendi</div></div></div></div>` : ''),

briefing: () => world() + `<div class="dim"></div><div class="glass" style="left:110px;right:110px;top:60px;bottom:60px"><div class="ttl"><b>Missão: o pedido que nunca chega</b><span class="x" data-a="go:world">✕</span></div>
  <div class="ws">Descubra por que os clientes abandonam o pedido e conserte o totem da Cantina, da pesquisa ao deploy.</div>
  <div class="row" style="margin-bottom:10px">${[['1. Learn · UX','Entrevista e blueprint','~3 min'],['2. Research · UX','Frustrações reais com totens','~3 min'],['3. Plan · UI','Wireframe do totem','~2 min'],['4. Practice · UI','Cor, contraste e espaçamento','~2 min'],['5. DIY · Front','HTML, CSS e deploy','~3 min']].map(([a,b,c]) => `<div class="box"><b>${a}</b><br>${b}<br>${c}</div>`).join('')}</div>
  <div class="ws">Recompensa: +240 XP · 🪙 60 créditos · badge “Detetive do Checkout”</div>
  <div class="row" style="margin-top:auto"><div class="btn o" data-a="go:world">Voltar</div><div class="btn" data-a="accept">Aceitar missão</div></div></div>`,

learn1: () => { const qs = ["Pode me contar, passo a passo, como foi a última vez que você tentou fazer um pedido no totem?", "Você concorda que o totem é confuso e precisa ser melhorado?", "Se a gente criasse um botão de pedido rápido, você usaria?", "De 1 a 5, quanto você gosta da Cantina?"];
  return bench('Cantina Estelar', 0, `<div class="goal">🎯 <b>O que fazer:</b> leia o desabafo do Tavi e escolha a pergunta que ajuda ele a <b>contar a experiência real</b>, sem induzir a resposta nem sugerir soluções. Depois, clique em <b>Verificar</b>.</div>
  <div class="cols" style="min-height:0;max-height:300px;overflow:hidden;margin-bottom:8px"><div style="flex:1.15;display:flex;gap:12px;min-height:0">
   <div style="flex:none;text-align:center"><div class="av" style="width:120px;height:120px;overflow:hidden;border-color:#FF9F45;border-radius:10px">${portrait('tavi')}</div><div style="font-size:13px;margin-top:4px"><b>Tavi</b></div><div class="ws" style="font-size:11px">viajante de Kepler</div></div>
   <div class="chat" id="chat" style="flex:1;overflow-y:auto;min-height:0;padding-right:6px;scroll-behavior:smooth"><div class="ws" style="font-size:11px;text-align:center;margin:0">— conversa · role para ver tudo —</div>
    <div class="bub"><small>TAVI</small>Sinceramente? Pedir aqui é <b>muito difícil</b>. Eu chego com fome e só queria ver a comida…</div>
    <div class="bub"><small>TAVI</small>…mas o totem pede um monte de coisa antes. No fim, eu desisto e vou comer em outro planeta.</div>
    ${S.q !== null && S.q !== undefined ? `<div class="bub me"><small>VOCÊ</small>${qs[S.q]}</div>` : ''}
    ${S.l1ok ? `<div class="bub"><small>TAVI</small>Claro. Abri o totem e ele pediu cadastro: nome, e-mail, senha… Só depois mostrou os pratos. Quando escolhi, procurei o botão de pagar e ele era cinza no cinza. Quase precisei de uma lupa. Desisti ali mesmo.</div>` : ''}
   </div></div>
  <div style="flex:1;overflow-y:auto;min-height:0" class="scrolly">${S.l1ok
    ? `<div class="box"><b>📒 Descobertas</b><div class="ws" style="margin-top:6px">• Cadastro obrigatório antes de ver os pratos<br>• Botão de pagar com contraste muito baixo<br>• O cliente quer ver a comida primeiro</div></div>
       <div class="box g" style="font-size:13px"><b>Escuta empática</b><br>Sentimento: frustrado (e com fome)<br>Necessidade: ver os pratos e pagar rápido</div>`
    : `<div class="ws"><b>Qual é a melhor pergunta agora?</b></div>${qs.map((t,i) => `<div class="opt ${S.q===i?'sel':''}" data-a="q:${i}" style="font-size:13.5px;padding:7px 10px;display:flex;align-items:flex-start"><span class="rad ${S.q===i?'on':''}"></span>“${t}”</div>`).join('')}<div class="ws" style="font-size:12.5px;margin-top:4px">🤖 <b>Bip:</b> boas perguntas são abertas e neutras. Nada de colocar palavras na boca do cliente!</div>`}</div></div>
  ${fbar(S.l1ok ? '<div class="btn" data-a="go:learn2">Continuar →</div>' : '<div class="btn" data-a="v1">Verificar</div>')}`); },

learn2: () => { const all = ['Pagar','Criar cadastro','Retirar pedido','Escolher prato','Revisar pedido'];
  const sys = { 'Escolher prato': 'Mostra cardápio com fotos', 'Revisar pedido': 'Mostra itens e total', 'Pagar': 'Processa pagamento', 'Retirar pedido': 'Chama a senha no painel', 'Criar cadastro': 'Pede nome, e-mail, senha' };
  const cell = i => S.journey[i] ? `<div class="cell f"><span class="n">${i+1}</span>${S.journey[i]}</div>` : `<div class="cell"><span class="n">${i+1}</span><span style="opacity:.6">?</span></div>`;
  return bench('Cantina Estelar', 0, `<div class="goal">🎯 <b>O que fazer:</b> monte o <b>blueprint</b> (o mapa das ações do cliente e das respostas do sistema) do pedido ideal. Clique nos cartões na ordem das ações do cliente. <b>Atenção:</b> um cartão não deve entrar.</div>
  <div class="ws" style="margin-bottom:4px"><b>Cartões disponíveis</b> · lembre: o Tavi desistiu quando o totem pediu cadastro antes de pagar</div>
  <div>${all.map(c => `<span class="card-chip ${S.journey.includes(c)?'used':''}" data-a="${S.journey.includes(c)?'':'j:'+c}">▤ ${c}</span>`).join('')}</div>
  <div class="bp"><div style="font-size:11px;letter-spacing:2px;color:#a9c7ef;margin-bottom:8px">BLUEPRINT · PEDIDO NO TOTEM DA CANTINA</div>
   <div class="lane"><div class="lh">Etapa</div>${['Início','Escolha','Pagamento','Final'].map(t => `<div class="lh" style="justify-content:center">${t}</div>`).join('')}</div>
   <div class="lane"><div class="lh">👤 Ações do cliente</div>${[0,1,2,3].map(cell).join('')}</div>
   <div class="vis"><span>LINHA DE INTERAÇÃO</span></div>
   <div class="lane"><div class="lh">📟 Totem (tela)</div>${[0,1,2,3].map(i => `<div class="cell sys">${S.journey[i] ? sys[S.journey[i]] : '—'}</div>`).join('')}</div>
   ${S.journey.length > 4 ? `<div style="font-size:11.5px;color:#FFB347">⚠ Você colocou 5 cartões: o blueprint ideal tem 4.</div>` : ''}</div>
  ${fbar(S.l2ok ? '<div class="btn" data-a="go:research">Continuar →</div>' : '<div class="btn o" data-a="jundo">↶ Desfazer</div><div class="btn o" data-a="hint">💡 Dica (−1 🪙)</div><div class="btn" data-a="jval">Verificar</div>')}`); },

research: () => { const k = S.rs || 0, it = RS[k], done = (S.rsDone || []);
  if (S.rsAll) return bench('Cantina Estelar', 1, `<div class="goal">🎯 <b>Céu limpo!</b> Você ligou cada frustração a uma melhoria de UX. Este é o seu mapa de pesquisa:</div>
   <div class="scrolly" style="flex:1;min-height:0;overflow-y:auto;margin-bottom:8px"><table style="width:100%;border-collapse:collapse;font-size:12.5px">
   <tr style="color:#E8C99A;text-align:left"><th style="padding:4px 6px;width:22%">Categoria</th><th style="padding:4px 6px;width:38%">Frustração</th><th style="padding:4px 6px">Melhoria de UX</th></tr>
   ${RS.map(r => `<tr style="border-top:1px solid #4a3a2e"><td style="padding:5px 6px;color:#c9b9a3">${r.cat}</td><td style="padding:5px 6px">${r.f}</td><td style="padding:5px 6px;color:#fff">${r.o[r.c]}</td></tr>`).join('')}</table></div>
   ${fbar('<div class="btn o" data-a="rback">↶ Voltar</div><div class="btn o" data-a="case">📚 Ver case real (GE)</div><div class="btn" data-a="go:plan">Continuar →</div>')}`);
  return bench('Cantina Estelar', 1, `<div class="goal">🎯 <b>O que fazer:</b> a Nara juntou reclamações reais de clientes de totens de autoatendimento (<b>pesquisa desk</b>, feita com dados que já existem). Para cada frustração, escolha a <b>melhoria de UX</b> que resolve o problema e clique em <b>Verificar</b>.</div>
  <div style="display:flex;gap:5px;margin-bottom:8px">${RS.map((r,i) => `<span style="flex:1;height:8px;border-radius:4px;background:${done.includes(i)?'#3DDC84':i===k?'#E8D3B0':'rgba(255,255,255,.15)'}"></span>`).join('')}</div>
  <div class="cols" style="min-height:0"><div style="flex:1"><div class="ws" style="margin-bottom:4px"><b>Frustração ${k+1} de ${RS.length}</b> · ${it.cat}</div>
   <div class="box" style="font-size:15px;line-height:1.45;border-color:#FF5C7A;background:rgba(255,92,122,.08)">😤 ${it.f}</div>
   <div class="ws" style="font-size:12.5px;margin-top:6px">📚 Quer ver como a empatia muda uma experiência de verdade? <span class="clk" data-a="case" style="color:#E8C99A;text-decoration:underline">Abrir o case real da GE no Holopad</span></div>
   <div class="ws" style="font-size:12.5px;margin-top:4px">📐 Na dúvida, revise as <span class="clk" data-a="laws" style="color:#E8C99A;text-decoration:underline">Leis de UX no Holopad</span> (Hick, Fitts, Jakob…).</div></div>
  <div style="flex:1.2"><div class="ws"><b>Qual melhoria de UX resolve isso?</b></div>${it.o.map((t,i) => `<div class="opt ${S.rsq===i?'sel':''}" data-a="rq:${i}" style="font-size:13.5px;padding:7px 10px;display:flex;align-items:flex-start"><span class="rad ${S.rsq===i?'on':''}"></span>${t}</div>`).join('')}</div></div>
  ${fbar('<div class="btn o" data-a="rback">↶ Voltar</div>' + (done.includes(k) ? `<div class="btn" data-a="rnext">${k === RS.length - 1 ? 'Ver mapa de pesquisa' : 'Próxima frustração →'}</div>` : '<div class="btn" data-a="rval">Verificar</div>'))}`); },

plan: () => { const blocks = [['cta','▭ CTA “Pagar” (call to action: botão de ação principal)'],['menu','☰ Menu de categorias'],['resumo','▤ Resumo do pedido'],['img','▢ Imagem do prato']];
  const comp = { menu: `<div style="display:flex;gap:4px;padding:6px;background:#e9edf5;border-radius:4px">${['Pratos','Bebidas','Doces'].map((t,i) => `<span style="font-size:10px;padding:2px 6px;border-radius:10px;background:${i?'#fff':'#2a1a10'};color:${i?'#333':'#fff'}">${t}</span>`).join('')}</div>`,
    img: `<div style="height:70px;border-radius:4px;background:linear-gradient(135deg,#E07A3E,#b5452b);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700">🍜 Sopa de Kepler</div>`,
    resumo: `<div style="font-size:10.5px;padding:6px;border:1px solid #d5dae6;border-radius:4px;color:#333;display:flex;justify-content:space-between"><span>1× Sopa de Kepler</span><b>42 🪙</b></div>`,
    cta: `<div style="padding:8px;border-radius:4px;background:#333;color:#fff;text-align:center;font-size:12px;font-weight:700">Pagar</div>` };
  return bench('Cantina Estelar', 2, `<div class="goal">🎯 <b>O que fazer:</b> monte o <b>wireframe</b> (o esqueleto da tela) do totem. Clique nos blocos na ordem em que devem aparecer, <b>de cima para baixo</b>. O totem à direita mostra o resultado.</div>
  <div class="cols"><div style="flex:1"><div class="ws"><b>Blocos</b></div>
  ${blocks.map(([k,t]) => `<div class="opt" data-a="${S.plan.includes(k)?'':'p:'+k}" style="${S.plan.includes(k)?'opacity:.35;cursor:default':''}">${t}</div>`).join('')}
  <div class="ws" style="margin-top:6px">Ordem atual: ${S.plan.length ? S.plan.map((k,i) => `${i+1}. ${blocks.find(b => b[0]===k)[1].slice(2)}`).join(' · ') : '—'}</div></div>
  <div style="flex:1;display:flex;flex-direction:column;align-items:center">
   <div style="width:210px;background:#2B3A67;border:2px solid #E8C99A;border-radius:14px 14px 6px 6px;padding:10px 10px 14px;box-shadow:0 10px 30px rgba(0,0,0,.4)">
    <div style="display:flex;justify-content:space-between;font-size:9px;color:#E8C99A;margin-bottom:6px;letter-spacing:1px"><span>CANTINA ESTELAR</span><span>●</span></div>
    <div style="background:#f4f6fb;border-radius:6px;height:200px;padding:7px;display:flex;flex-direction:column;gap:6px;overflow:hidden">
     ${[0,1,2,3].map(i => S.plan[i] ? comp[S.plan[i]] : `<div style="border:1.5px dashed #b9c0d4;border-radius:4px;min-height:28px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#9aa2b8">bloco ${i+1}</div>`).join('')}
    </div></div>
   <div style="width:34px;height:22px;background:#2B3A67;border:2px solid #E8C99A;border-top:none"></div><div style="width:110px;height:10px;background:#1a2446;border:2px solid #E8C99A;border-radius:3px"></div></div></div>
  ${fbar(S.planok ? '<div class="btn" data-a="go:practice">Continuar →</div>' : '<div class="btn o" data-a="pundo">↶ Desfazer</div><div class="btn" data-a="pval">Verificar</div>')}`); },

practice: () => { const cols = ['#cccccc','#999999','#333333'], names = ['Cinza claro','Cinza médio','Escuro'], ratio = ['1,6','2,8','12,6'];
  const ok = S.color === 2, gapOk = S.gap >= 50;
  return bench('Cantina Estelar', 3, `<div class="goal">🎯 <b>O que fazer:</b> o CTA “Pagar” está quase invisível e espremido. No <b>Inspetor</b>, <b>① escolha uma cor com contraste de 4,5:1 ou mais</b> e <b>② aumente o espaçamento para 50 px ou mais</b>. O totem mostra o resultado na hora.</div>
  <div class="cols"><div style="flex:1.2" class="screen"><div class="ws"><b>📟 Tela do totem</b> (pré-visualização)</div><div class="mini" id="pimg" style="height:80px;margin-bottom:${S.gap/4+4}px;display:flex;align-items:center;justify-content:center;color:#8a93b0">🍜 Imagem do prato</div>
  <div class="mini" id="pres" style="min-height:0;font-size:13px;margin-bottom:${S.gap/4+4}px">Total: 42 créditos · retirada no balcão</div>
  <div style="display:flex;align-items:center;gap:10px"><div class="btn" style="flex:1;cursor:default;background:${cols[S.color]};border-color:${cols[S.color]};color:${S.color===0?'#eee':'#fff'}">Pagar</div><span style="font-size:13px;color:#2563eb;font-weight:600">← este botão</span></div></div>
  <div style="flex:1"><div class="ws"><b>Inspetor</b></div>
  <div class="ws">① Cor do botão</div><div class="row">${cols.map((c,i) => `<div class="pill ${S.color===i?'sel':''}" data-a="col:${i}"><span style="color:${c}">■</span> ${names[i]}</div>`).join('')}</div>
  <div class="ws" style="margin-top:6px">Contraste: <b>${ratio[S.color]}:1</b> (mínimo 4,5:1) ${ok?'✓':'✗'}</div><div class="meter"><b style="width:${[15,28,100][S.color]}%;background:${ok?'#3DDC84':'#FF4D6D'}"></b></div>
  <div class="ws">② Espaçamento entre os blocos: <b id="gv">${S.gap} px</b> (mínimo 50 px)</div><input type="range" min="10" max="80" value="${S.gap}" id="gap" style="width:100%">
  <div class="box g" style="margin-top:6px" id="chk">${ok?'✓':'✗'} Contraste do botão ≥ 4,5:1<br>${gapOk?'✓':'✗'} Espaçamento ≥ 50 px</div></div></div>
  ${fbar(S.prok ? '<div class="btn" data-a="go:diy">Continuar →</div>' : '<div class="btn" data-a="prval">Verificar</div>')}`); },

diy: () => bench('Cantina Estelar', 4, `<div class="cols"><div style="flex:1.15"><div class="goal" style="margin-bottom:8px">🎯 <b>O que fazer:</b> centralize o CTA no totem completando o CSS. Depois, rode os testes e faça o <b>deploy</b> (publicar a correção).</div><div class="code">
  <span class="lk">🔒 &lt;div class="totem"&gt;</span><br><span class="lk">🔒 &nbsp;&nbsp;&lt;button&gt;Pagar&lt;/button&gt;</span><br><span class="lk">🔒 &lt;/div&gt;</span><br><br>
  .totem {<br>&nbsp;&nbsp;display: <input id="c1" value="${S.c1||''}" placeholder="?" autocomplete="off" spellcheck="false">;<br>&nbsp;&nbsp;justify-content: <input id="c2" value="${S.c2||''}" placeholder="?" autocomplete="off" spellcheck="false">;<br>}</div>
  ${S.ans ? `<div class="hintbox">🤖 <b>Bip:</b> <b>resposta</b> → display: <b>flex</b>; justify-content: <b>center</b>;</div>` : `<div class="hintbox clk" data-a="answer">🤖 <b>Bip:</b> travou? <b>Ver a resposta</b> (−1 🪙)</div>`}
  <div class="ws" style="margin-top:8px">Ou consulte de graça o card <span class="clk" data-a="hcard:Box model (CSS)" style="color:#E8C99A;text-decoration:underline">Box model no Holopad</span>.</div></div>
  <div style="flex:1"><div class="box"><div class="ws">Preview ao vivo</div><div id="pv" style="display:${S.c1==='flex'?'flex':'block'};justify-content:${S.c2||'normal'};border:2px dashed #aaa;border-radius:8px;padding:12px"><span class="btn" style="cursor:default">Pagar</span></div></div>
  <div class="box" id="tests">${S.tested?testsHtml():'Complete o CSS e clique em ▶ Rodar testes.'}</div>
  <div class="row" style="align-items:center"><div class="btn o" data-a="run">▶ Rodar testes</div><div class="btn ${S.pass?'':'dis'}" data-a="${S.pass?'deploy':'nodeploy'}">🚀 Fazer deploy</div></div></div></div>`),

victory: () => world({ mark: 'green', lit: true, people: true }) + hud() + `<div class="glass" style="left:auto;right:18px;top:62px;bottom:14px;width:470px;padding:14px 18px;overflow-y:auto">
  <div class="kicker">Missão concluída · céu limpo</div><h3 style="font-size:22px;margin:2px 0 4px">O pedido que nunca chega</h3>
  <div class="ws" style="margin-bottom:8px;font-size:13px">Nara: “Os clientes voltaram, viajante! Obrigada, ${S.name}. Pode pedir o que quiser: é por conta da casa.”</div>
  ${beforeAfter()}
  <div class="row" style="margin:10px 0;gap:8px"><div class="box" style="text-align:center;margin:0;padding:6px;display:flex;align-items:center;justify-content:center"><b>+240 XP</b></div><div class="box" style="text-align:center;margin:0;padding:6px;display:flex;align-items:center;justify-content:center"><b>+60 🪙</b></div><div class="box" style="margin:0;padding:4px 6px;display:flex;align-items:center;gap:6px;flex:1.4">${badgeIcon(28)}<span class="ws" style="font-size:11px;margin:0;line-height:1.2">Detetive do Checkout</span></div></div>
  <div class="row" style="margin-top:auto;flex:none"><div class="btn o" data-a="go:world">Voltar ao mapa</div><div class="btn" data-a="go:report">Ver relatório</div></div></div>`,

report: () => world({ mark: 'green', lit: true }) + `<div class="dim"></div><div class="glass"><div class="ttl"><b>Relatório · O pedido que nunca chega</b><span class="x" data-a="go:world">✕</span></div>
  <div class="cols"><div style="flex:.8"><div class="ws"><b>Notas por etapa</b></div><div class="box">Learn · UX · 90%</div><div class="box">Research · UX · ${S.rsErr ? Math.max(50, 100 - S.rsErr*10) : 100}%</div><div class="box">Plan · UI · 100%</div><div class="box sel">Practice · UI · 70% · 1 erro</div><div class="box">DIY · Front · 100%</div>
  <div class="box g" style="font-size:13px"><b>O que deu errado?</b> O CTA começou com contraste 1,6:1. O mínimo do WCAG é 4,5:1: clientes com baixa visão não conseguiam ler “Pagar”.</div></div>
  <div style="flex:1.3"><div class="ws"><b>O que você mudou no totem</b></div>${beforeAfter()}
  <div class="row" style="margin-top:12px"><div class="btn o" data-a="redo">Refazer etapa</div><div class="btn o" data-a="holo">Ver card no Holopad</div><div class="btn" data-a="go:profile">Ver meu perfil</div></div></div></div></div>`,

profile: () => tabs('Progresso', `<div class="cols"><div style="flex:1"><div style="display:flex;gap:12px;align-items:center;margin-bottom:8px"><div class="av" style="width:74px;height:74px;overflow:hidden;border-radius:50%;border:2px solid #E8C99A;display:flex;justify-content:center">${bigAvatar(74, '30 2 60 60')}</div>
  <div><div style="font-size:20px;font-weight:700">${S.name || 'Jogador'}</div><div class="ws" style="margin:0">${S.spec}</div></div></div><h3 style="font-size:16px">Nível ${S.done?2:1} · Junior Builder</h3><div class="bar"><b style="width:${S.done?55:35}%"></b></div>
  <div class="box">🔥 4 dias seguidos</div><div class="box">Estação: ${S.done?1:0} de 3 missões</div>${S.done?`<div class="box" style="display:flex;align-items:center;gap:10px">${badgeIcon(40)}<div><b>Detetive do Checkout</b><div class="ws" style="margin:0;font-size:12px">badge da missão da Cantina</div></div></div>`:''}</div>
  <div style="flex:1.2"><div class="ws"><b>Prontidão para a certificação · ${S.spec}</b></div>
  <div class="ws">UX · 85% ✓</div><div class="bar"><b style="width:85%"></b></div><div class="ws">UI · 70%</div><div class="bar"><b style="width:70%"></b></div>
  <div class="ws">Front-end · 48% ⚠</div><div class="bar"><b style="width:48%"></b></div><div class="ws">Meta para certificação: 80% em cada área</div>
  <div class="btn" data-a="go:next" style="width:100%;margin-top:6px">Ver próximo passo</div></div></div>`),

portfolio: () => tabs('Portfólio', `<div class="cols"><div style="flex:1"><div class="ws">Badges</div><div style="display:flex;gap:10px">${S.done ? `<div class="av" style="width:72px;height:72px;display:flex;align-items:center;justify-content:center;border-color:#E8C99A">${badgeIcon(62)}</div>` : ''}${[0,1].map(() => `<div class="av" style="width:72px;height:72px;opacity:.35;display:flex;align-items:center;justify-content:center;font-size:22px">🔒</div>`).join('')}</div>
  <div class="ws" style="margin-top:8px">${S.done?'<b>Detetive do Checkout</b><br>Encontrou e corrigiu o motivo do abandono de pedidos na Cantina.':'Conclua missões para ganhar badges.'}</div></div>
  <div style="flex:1.3" class="box"><b>${S.done?'Case: Totem da Cantina':'Nenhum case ainda'}</b><div class="ws">Problema → pesquisa → wireframe → código</div>${S.done ? `<div class="row"><div><div class="ws" style="font-size:11px;letter-spacing:1.5px;color:#FF5C7A;margin:4px 0">ANTES</div><div style="height:118px;border-radius:8px;overflow:hidden;border:1px solid #6b4a33">${caseScene(false)}</div></div>
   <div><div class="ws" style="font-size:11px;letter-spacing:1.5px;color:#3DDC84;margin:4px 0">DEPOIS</div><div style="height:118px;border-radius:8px;overflow:hidden;border:1px solid #6b4a33">${caseScene(true)}</div></div></div>
   <div class="ws" style="font-size:12px;margin-top:6px">Antes, o Tavi travava no cadastro e não achava o botão. Depois, vê os pratos direto e paga com um botão visível.</div>` : `<div class="row"><div class="img" style="height:110px"></div><div class="img" style="height:110px"></div></div>`}
  <div class="btn o" data-a="share" style="width:100%;margin-top:10px">Compartilhar link</div></div></div>`),

studio: () => `<div style="position:absolute;inset:0;background:#3a2216"></div><div style="position:absolute;left:0;top:0;bottom:0;right:256px">${studioSvg()}</div>` + hud() + `<div class="hud clk" data-a="go:profile" style="left:14px;top:100px">← Voltar ao perfil</div>
  <div class="hud" style="left:276px;top:14px"><b>Meu estúdio</b> · casa no subsolo do deserto</div>` + shopPanel(),

next: () => world({ mark: S.done?'green':'red', lit: S.done }) + `<div class="dim"></div><div class="glass" style="top:34px;bottom:26px"><div class="ttl"><b>Recomendado para você</b><span class="x" data-a="go:profile">✕</span></div>
  <div class="row" style="flex:1">${[['🔧 Oficina de Droides','Foco em Front-end · ~45 min','of'],['🏛 Simulado no Hub','UI · 10 questões · 15 min','sim'],['◱ Card rápido','Flexbox · 3 min','card']].map(([a,b,k],i) =>
   `<div class="box clk ${i===0?'sel':''}" data-a="rec:${k}" style="display:flex;flex-direction:column"><b>${a}</b>${b}<div style="flex:1;margin-top:8px;border-radius:8px;overflow:hidden;border:1px solid #6b4a33;min-height:120px">${recArt(k)}</div></div>`).join('')}</div>
  <div class="ws">Recomendado porque Front-end é a sua área com menor prontidão (48%).</div>
  <div class="btn big" data-a="rec:of">Ir para a Oficina</div></div>`,

end: () => world({ mark: 'green', lit: true, people: true }) + `<div class="dim"></div><div class="glass" style="left:140px;right:140px;top:50px;bottom:50px;text-align:center;align-items:center;justify-content:center">
  <div class="kicker">Fim da demonstração</div>
  <div style="font-size:28px;font-weight:800;margin:6px 0 10px">Céu limpo, ${S.name}! 🎉</div>
  <div class="ws" style="font-size:16px;max-width:520px">Você salvou a Cantina Estelar. A Oficina de Droides e o Mercado Orbital chegam nas próximas versões.</div>
  <div class="row" style="width:100%;max-width:560px;margin:14px 0"><div class="box"><b>Nível 2</b><br>360 XP</div><div class="box"><b>🪙 ${S.coins}</b><br>créditos</div><div class="box"><b>🏅 1 badge</b><br>Detetive do Checkout</div></div>
  <div class="ws" style="font-size:16px">O teste terminou. Obrigada por jogar! 🙂</div>
  ${FEEDBACK_URL ? `<div class="ws" style="font-size:14px;margin:14px 0 8px">Sua opinião ajuda a melhorar o Product Quest. Leva uns 3 minutos.</div>
  <a class="btn big" href="${FEEDBACK_URL}" target="_blank" rel="noopener" style="text-decoration:none">💬 Contar o que achei</a>` : ''}</div>`,

  holo: () => { const cards = {
   'Glossário': '',
   'Leis de UX': '',
   'Leis de Gestalt': '<p>O cérebro agrupa o que vê em formas completas. Os principais princípios e onde aparecem na interface:</p><ul style="padding-left:18px;margin-top:6px;line-height:1.55"><li><b>Proximidade:</b> o que está perto parece do mesmo grupo. Ex.: rótulo colado no seu campo de formulário.</li><li><b>Similaridade:</b> mesma cor, forma ou estilo = mesmo tipo. Ex.: todos os botões de ação iguais.</li><li><b>Região comum:</b> dentro da mesma borda ou fundo = um grupo. Ex.: cards de produtos.</li><li><b>Conexão uniforme:</b> elementos ligados por linhas parecem relacionados. Ex.: passos numerados com setas.</li><li><b>Fechamento:</b> a mente completa formas incompletas. Ex.: ícones feitos com poucos traços.</li><li><b>Continuidade:</b> o olhar segue linhas e alinhamentos. Ex.: carrossel cortado na borda convida a rolar.</li><li><b>Figura e fundo:</b> separamos o primeiro plano do fundo. Ex.: modal sobre o fundo escurecido.</li><li><b>O todo é diferente da soma das partes:</b> a tela é lida como um conjunto, não peça por peça.</li></ul>',
   'Contraste (WCAG)': 'Texto precisa ter contraste de pelo menos 4,5:1 com o fundo para ser lido por todos, inclusive por pessoas com baixa visão. Botões escuros com texto claro (ou o contrário) costumam passar.',
   'Fluxo de usuário': 'É o caminho que a pessoa percorre para completar uma tarefa. Quanto menos passos desnecessários, menor a chance de desistência.',
   'Box model (CSS)': 'Todo elemento é uma caixa: conteúdo, padding, borda e margem. Para alinhar caixas lado a lado ou centralizar, use display: flex e justify-content.',
   'Case real: GE Healthcare': '<p>Inicialmente, Dietz desenvolveu uma máquina que aterrorizava os pequenos. Em nenhum momento, ele havia pensado na experiência dos usuários, nem em seus sentimentos. Foi então que o chefe de design fez uma imersão em creches para entender o comportamento das crianças e realizou entrevistas com pedagogos, pediatras e guias de visitas infantis a museus.</p><p style="margin-top:10px">As respostas o levaram a uma solução simples, porém inovadora que atendesse as necessidades desse público. Resultado: o scanner “Adventure Series” tinha uma ambientação colorida com elementos do universo infantil, deixando as crianças menos ansiosas ao realizar a ressonância magnética, além de se manterem imóveis durante o exame.</p><p style="margin-top:10px"><b>Lição: empatia muda a experiência mesmo sem mudar a tecnologia.</b></p>',
   'Análise: AWS Skill Builder': '' };
  const k = S.card || null;
  const body = !k ? '<div class="ws" style="margin-top:80px;text-align:center">Escolha um card para revisar o conceito.</div>'
    : k === 'Glossário' ? glossPanel()
    : k === 'Leis de UX' ? lawsPanel()
    : k.startsWith('Análise') ? awsPanel()
    : `<h3>${k}</h3>${k.startsWith('Case') ? `<figure style="margin:0 0 10px"><img src="${GE_PHOTO}" alt="Tomógrafo da GE decorado como navio pirata" style="width:100%;max-height:170px;object-fit:cover;border-radius:8px;display:block"><figcaption class="ws" style="font-size:11px;margin-top:4px">Tomógrafo “Pirate Adventure” do GE Healthcare Adventure Series. Foto: GE Healthcare. <span style="color:#E8C99A">↓ role para ler</span></figcaption></figure>` : `<div class="fig" style="margin-bottom:8px">${holoArt(k)}</div>`}<div class="ws" style="font-size:14.5px;${k.startsWith('Case') ? 'text-align:justify;' : ''}hyphens:none;-webkit-hyphens:none;word-break:normal;overflow-wrap:normal">${cards[k]}</div>`;
  return (S.prev==='studio'?studioSvg():world({ mark: S.done?'green':'red', lit: S.done })) + `<div class="dim"></div><div class="glass"><div class="ttl"><b>◱ Holopad · Cards de conceito</b><span class="x" data-a="holoClose">✕</span></div>
  <div class="cols"><div style="flex:.8;overflow-y:auto;min-height:0" class="scrolly">${Object.keys(cards).map(c => `<div class="box clk ${k===c?'sel':''}" data-a="card:${c}" style="padding:7px 12px">${c === 'Glossário' || c === 'Leis de UX' || c.startsWith('Análise') ? '<span style="color:#E8C99A">✦</span> ' : ''}${c}</div>`).join('')}</div>
  <div style="flex:1.6;display:flex;flex-direction:column;min-height:0" class="box"><div class="scrolly" id="holobody" style="flex:1;min-height:0;overflow-y:auto">${body}</div>
  <div class="btn o" data-a="holoClose" style="width:100%;margin-top:8px">Voltar ao jogo</div></div></div></div>`; },
};

function tabs(on, body) {
  return world({ mark: S.done?'green':'red', lit: S.done }) + `<div class="dim"></div><div class="glass"><div class="ttl"><b>Meu perfil</b>
  <div class="steps">${[['Progresso','profile'],['Portfólio','portfolio'],['Estúdio','studio']].map(([t,k]) => `<span class="clk ${t===on?'on':''}" data-a="go:${k}">${t}</span>`).join('')}</div><span class="x" data-a="go:world">✕</span></div>${body}</div>`;
}
function testsHtml() {
  const a = S.c1 === 'flex', b = S.c2 === 'center';
  if (a && b) return `✓ O totem usa flexbox<br>✓ CTA centralizado<br>✓ Contraste ok (etapa anterior)<br><b>Testes rodados. Céu limpo! ✓ Pode fazer o deploy 🚀</b>`;
  const m1 = a ? '✓ O totem usa flexbox' : `✗ display: “${S.c1||'vazio'}” não ativa o flexbox`;
  const m2 = b ? '✓ CTA centralizado' : `✗ justify-content: “${S.c2||'vazio'}” não centraliza (valores válidos: flex-start, center, space-between…)`;
  return `<b>Tem areia nos circuitos do seu CSS:</b><br>${m1}<br>${m2}`;
}
const norm = v => v.trim().toLowerCase().replace(/;$/, '').trim();
let cur = 'start';
function go(v) {
  if (v === 'holo') { if (cur !== 'holo') S.prev = cur; }
  if (v !== cur && v !== 'holo' && cur !== 'holo') S.fb = null;
  if (v !== cur) S.modal = null;
  if (v === 'holo') S.holoSeen = true;
  cur = v; $('#scr').innerHTML = V[v](); bind();
}
function bind() {
  const ch = document.getElementById('chat'); if (ch) ch.scrollTop = ch.scrollHeight;
  const gq = $('#glq'); if (gq) { gq.oninput = e => { S.glq = e.target.value; filterGloss(); }; filterGloss(); }
  const nm = $('#nm'); if (nm) nm.oninput = e => S.name = e.target.value || 'Jogador';
  const gp = $('#gap'); if (gp) { gp.oninput = e => { S.gap = +e.target.value; $('#gv').textContent = S.gap + ' px'; const m = (S.gap/4+4) + 'px'; $('#pimg').style.marginBottom = m; $('#pres').style.marginBottom = m;
      $('#chk').innerHTML = `${S.color===2?'✓':'✗'} Contraste do botão ≥ 4,5:1<br>${S.gap>=50?'✓':'✗'} Espaçamento ≥ 50 px`; }; gp.onchange = () => { S.fb = null; go('practice'); }; }
  ['c1','c2'].forEach(id => { const el = $('#' + id); if (el) el.oninput = e => { S[id] = norm(e.target.value); S.tested = false; S.pass = false;
    const t = $('#tests'); if (t) t.textContent = 'Complete o CSS e clique em ▶ Rodar testes.';
    const d = document.querySelector('[data-a="deploy"],[data-a="nodeploy"]'); if (d) { d.classList.add('dis'); d.dataset.a = 'nodeploy'; }
    const pv = $('#pv'); pv.style.display = S.c1 === 'flex' ? 'flex' : 'block'; pv.style.justifyContent = S.c2 || 'normal'; }; });
}
let walking = false;
function arrive(b) {
  if (b === 'cantina') { if (S.done) toast('A Cantina está lotada de clientes. Céu limpo por aqui!'); else if (S.accepted) go('learn1'); else go('dialog'); }
  else toast('Esse lugar abre depois da missão da Cantina Estelar.');
}
function walkTo(t, done) {
  const me = document.getElementById('me'); if (!me) return done && done();
  const [x0, y0] = S.pos, [x1, y1] = t, d = Math.hypot(x1 - x0, y1 - y0), dur = Math.max(350, d * 9);
  walking = true; const t0 = performance.now();
  (function step(now) {
    const k = Math.min(1, (now - t0) / dur), e = k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2) / 2;
    const x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e - Math.abs(Math.sin(k * d / 6)) * 2;
    me.setAttribute('transform', `translate(${x} ${y})`);
    if (k < 1) requestAnimationFrame(step); else { S.pos = [x1, y1]; walking = false; done && done(); }
  })(t0);
}
addEventListener('keydown', e => {
  if (cur !== 'world' || walking || document.activeElement.tagName === 'INPUT') return;
  const m = { ArrowUp: [0,-6], w: [0,-6], W: [0,-6], ArrowDown: [0,6], s: [0,6], S: [0,6], ArrowLeft: [-8,0], a: [-8,0], A: [-8,0], ArrowRight: [8,0], d: [8,0], D: [8,0] }[e.key];
  if (!m) return; e.preventDefault();
  const nx = Math.min(500, Math.max(50, S.pos[0] + m[0])), ny = Math.min(275, Math.max(70, S.pos[1] + m[1]));
  S.pos = [nx, ny]; const me = document.getElementById('me'); if (me) me.setAttribute('transform', `translate(${nx} ${ny})`);
  for (const [b, p] of Object.entries(DOORS)) if (Math.hypot(p[0] - nx, p[1] - ny) < 16) { arrive(b); break; }
});
function setFb(t) { const f = $('#fb'); if (f) f.textContent = t; }

$('#stage').addEventListener('click', e => {
  const el = e.target.closest('[data-a],[data-b]'); if (!el) return;
  if (el.dataset.b) { const b = el.dataset.b;
    if (cur !== 'world' || walking) return;
    walkTo(DOORS[b], () => arrive(b));
    return; }
  const [a, arg] = el.dataset.a.split(/:(.*)/s);
  switch (a) {
    case 'go': go(arg); break;
    case 'cont': toast('Ainda não tem jogo salvo. Clique em “Iniciar missão”.'); break;
    case 'skin': S.skin = +arg; go('avatar'); break;
    case 'hair': S.hair = +arg; go('avatar'); break;
    case 'tab': toast('Neste protótipo, todas as opções ficam na aba Corpo.'); break;
    case 'tabroupa': toast('Escolha o estilo de roupa logo abaixo do tom de pele.'); break;
    case 'outfit': S.outfit = arg; go('avatar'); break;
    case 'cape': S.cape = arg === '1'; go('avatar'); break;
    case 'tabacc': toast('Escolha o manto em “Acessório”, logo abaixo.'); break;
    case 'rand': S.skin = Math.floor(Math.random()*5); S.hair = Math.floor(Math.random()*4); go('avatar'); break;
    case 'avatarOk': go('spec'); break;
    case 'spec': S.spec = arg; go('spec'); break;
    case 'profile': go('profile'); break;
    case 'holo': go('holo'); break;
    case 'holoClose': S.card = null; go(S.prev || 'world'); break;
    case 'hcard': { const [c, q] = arg.split('|'); S.card = c; if (c === 'Glossário') { S.glq = q || ''; S.glcat = 'Todos'; } go('holo'); break; }
    case 'glcat': S.glcat = arg; go('holo'); break;
    case 'coachOff': S.coachOff = true; go('world'); break;
    case 'card': S.card = arg; go('holo'); { const hb = $('#holobody'); if (hb) hb.scrollTop = 0; } break;
    case 'law': S.law = arg; go('holo'); break;
    case 'aws': S.aws = +arg; go('holo'); break;
    case 'laws': S.card = 'Leis de UX'; S.law = 'Hick'; go('holo'); break;
    case 'cam': toast('Controles de câmera: girar e zoom.'); break;
    case 'close': go('world'); break;
    case 'totem': S.modal = 'totem'; go('dialog'); break;
    case 'closeModal': S.modal = null; go(cur); break;
    case 'accept': S.accepted = true; go('learn1'); break;
    case 'q': if (S.l1ok) break; S.q = +arg; S.fb = null; go('learn1'); break;
    case 'v1': if (S.q === null || S.q === undefined) S.fb = { ok: false, msg: 'Escolha uma pergunta antes de verificar.' };
      else if (S.q === 0) { S.l1ok = true; S.fb = { ok: true, msg: '✓ <b>Céu limpo!</b> Pergunta aberta e neutra, sobre uma experiência real. Assim o Tavi conta o que de fato aconteceu. +40 XP' }; }
      else if (S.q === 1) S.fb = { ok: false, msg: '✗ <b>Ainda não.</b> Essa é uma <b>pergunta indutora</b>: ela já entrega a opinião (“é confuso”) e o Tavi só vai concordar. Tente uma pergunta neutra.' };
      else if (S.q === 2) S.fb = { ok: false, msg: '✗ <b>Ainda não.</b> Essa pergunta é <b>hipotética</b> e já sugere uma solução. Primeiro entendemos o problema: o que alguém diz que faria nem sempre é o que faz.' };
      else S.fb = { ok: false, msg: '✗ <b>Ainda não.</b> Essa é uma <b>pergunta fechada</b>: a nota não explica por que ele desiste do pedido. Busque entender a experiência.' };
      go('learn1'); break;
    case 'j': if (S.l2ok) break; S.journey.push(arg); S.fb = null; go('learn2'); break;
    case 'jundo': S.journey.pop(); S.fb = null; go('learn2'); break;
    case 'jclear': S.journey = []; go('learn2'); break;
    case 'hint': if (S.coins < 1) { toast('Sem créditos para dicas. Complete missões para ganhar mais.'); break; } S.coins--; S.fb = { ok: false, msg: '💡 <b>Resposta:</b> Escolher prato → Revisar pedido → Pagar → Retirar pedido (sem “Criar cadastro”).' }; go('learn2'); toast('−1 🪙 pela dica'); break;
    case 'jval': { const ok = ['Escolher prato','Revisar pedido','Pagar','Retirar pedido'];
      if (!S.journey.length) S.fb = { ok: false, msg: 'Clique nos cartões para montar o blueprint.' };
      else if (S.journey.includes('Criar cadastro')) S.fb = { ok: false, msg: '✗ <b>Quase.</b> O cadastro antes de pagar foi o que fez o Tavi desistir. Clique em ↶ Desfazer e tente sem ele.' };
      else if (S.journey.join() === ok.join()) { S.l2ok = true; S.fb = { ok: true, msg: '✓ <b>Céu limpo!</b> Fluxo ideal: sem cadastro obrigatório e com revisão antes de pagar. +40 XP' }; }
      else if (S.journey.length < 4) S.fb = { ok: false, msg: '✗ <b>Ainda não.</b> Faltam passos: o fluxo ideal tem 4 cartões.' };
      else S.fb = { ok: false, msg: '✗ <b>Ainda não.</b> A ordem não está certa. Pense no caminho do pedido: o que o cliente faz primeiro e o que faz por último?' };
      go('learn2'); break; }
    case 'rq': if ((S.rsDone||[]).includes(S.rs||0)) break; S.rsq = +arg; S.fb = null; go('research'); break;
    case 'rval': { const k = S.rs || 0, it = RS[k];
      if (S.rsq === undefined || S.rsq === null) S.fb = { ok: false, msg: 'Escolha uma melhoria antes de verificar.' };
      else if (S.rsq === it.c) { S.rsDone = [...(S.rsDone||[]), k]; S.fb = { ok: true, msg: `✓ <b>Céu limpo!</b> ${it.why}` }; }
      else { S.rsErr = (S.rsErr||0) + 1; S.fb = { ok: false, msg: '✗ <b>Ainda não.</b> Essa opção mantém (ou piora) a frustração. Pense no que deixaria o cliente mais seguro e no controle.' }; }
      go('research'); break; }
    case 'rback': S.fb = null; S.rsq = null;
      if (S.rsAll) { S.rsAll = false; S.rs = RS.length - 1; go('research'); }
      else if ((S.rs||0) > 0) { S.rs--; go('research'); }
      else go('learn2');
      break;
    case 'rnext': { const k = S.rs || 0; S.rsq = null; S.fb = null; if (k >= RS.length - 1) { S.rsAll = true; S.fb = { ok: true, msg: '✓ <b>Pesquisa concluída!</b> 10 frustrações mapeadas em melhorias de UX. +40 XP' }; } else S.rs = k + 1; go('research'); break; }
    case 'case': S.card = 'Case real: GE Healthcare'; go('holo'); break;
    case 'p': if (S.planok) break; S.plan.push(arg); S.fb = null; go('plan'); break;
    case 'pundo': S.plan.pop(); S.fb = null; go('plan'); break;
    case 'pclear': S.plan = []; go('plan'); break;
    case 'pval': { if (S.plan.length < 4) S.fb = { ok: false, msg: 'Coloque os 4 blocos na tela do totem antes de verificar.' };
      else if (S.plan[3] !== 'cta') S.fb = { ok: false, msg: '✗ <b>Ainda não.</b> O CTA “Pagar” fecha a tela: ele vem depois do resumo do pedido.' };
      else if (S.plan[2] !== 'resumo') S.fb = { ok: false, msg: '✗ <b>Ainda não.</b> O resumo do pedido vem logo antes do CTA, para o cliente conferir antes de pagar.' };
      else if (S.plan[0] !== 'menu') S.fb = { ok: false, msg: '✗ <b>Ainda não.</b> O menu de categorias fica no topo: é o primeiro passo da navegação.' };
      else { S.planok = true; S.fb = { ok: true, msg: '✓ <b>Céu limpo!</b> Menu no topo, imagem, resumo e o CTA no fim: hierarquia clara. +40 XP' }; }
      go('plan'); break; }
    case 'col': S.color = +arg; S.fb = null; go('practice'); break;
    case 'prval': { const a = S.color === 2, b = S.gap >= 50;
      if (a && b) { S.prok = true; S.fb = { ok: true, msg: '✓ <b>Céu limpo!</b> Agora o CTA passa no contraste do WCAG e tem espaço para respirar. +40 XP' }; }
      else S.fb = { ok: false, msg: `✗ <b>Ainda não.</b> Falta ${!a ? 'escolher a cor <b>Escuro</b> (contraste ≥ 4,5:1)' : ''}${!a && !b ? ' e ' : ''}${!b ? 'aumentar o espaçamento para <b>50 px ou mais</b>' : ''}.` };
      go('practice'); break; }
    case 'nodeploy': toast('Ainda tem areia nos circuitos. Rode os testes e corrija antes do deploy.'); break;
    case 'answer': if (S.coins < 1) { toast('Sem créditos para dicas. Complete missões para ganhar mais.'); break; } S.coins--; S.ans = true; go('diy'); toast('−1 🪙 pela resposta'); break;
    case 'run': S.tested = true; S.pass = S.c1 === 'flex' && S.c2 === 'center'; go('diy'); break;
    case 'deploy': S.done = true; S.coins += 60; go('victory'); break;
    case 'redo': toast('Neste protótipo, a etapa já foi refeita. 😉'); break;
    case 'share': toast('Link do portfólio copiado.'); break;
    case 'buy': { const it = SHOP.find(x => x.k === arg); if (!it) break;
      if (S[arg]) { toast('Esse item já está no seu estúdio.'); break; }
      if (it.dep && !S[it.dep]) { toast(`Antes, compre: ${SHOP.find(x => x.k === it.dep).n.toLowerCase()}. O item precisa de onde ficar.`); break; }
      if (S.coins < it.p) { toast('Créditos insuficientes. Complete missões para ganhar mais.'); break; }
      S[arg] = true; S.coins -= it.p; go('studio'); toast(`${it.e} ${it.n} instalado no estúdio!`); break; }
    case 'rec': if (arg === 'card') { S.card = 'Box model (CSS)'; go('holo'); } else go('end'); break;
  }
});

/* menu da moderadora */
const presets = {
  t1: () => { Object.assign(S, { rs: 0, rsq: null, rsDone: [], rsAll: false, rsErr: 0, cape: false, pos: [270,172], outfit: 'f', l1ok: false, l2ok: false, planok: false, prok: false, fb: null, ans: false, accepted: false, done: false, q: null, journey: [], plan: [], color: 0, gap: 30, c1: '', c2: '', tested: false, pass: false, coins: 40, name: 'Jogador', holoSeen: false, coachOff: false, glq: '', glcat: 'Todos' }); SHOP.forEach(i => S[i.k] = false); go('start'); },
  t2: () => { Object.assign(S, { rs: 0, rsq: null, rsDone: [], rsAll: false, rsErr: 0, pos: DOORS.cantina, l1ok: false, l2ok: false, planok: false, prok: false, fb: null, accepted: true, done: false, q: null, journey: [], plan: [] }); go('learn1'); },
  t2b: () => { Object.assign(S, { pos: DOORS.cantina, l1ok: true, l2ok: true, accepted: true, done: false, rs: 0, rsq: null, rsDone: [], rsAll: false, rsErr: 0, fb: null }); go('research'); },
  t3: () => { Object.assign(S, { rsAll: true, rsDone: [0,1,2,3,4,5,6,7,8,9], rsErr: 0, pos: DOORS.cantina, l1ok: true, l2ok: true, planok: false, prok: false, fb: null, ans: false, accepted: true, done: false, q: 0, journey: [], plan: [], color: 0, gap: 30, c1: '', c2: '', tested: false, pass: false }); go('plan'); },
  t4: () => { Object.assign(S, { pos: DOORS.cantina, accepted: true, done: true }); if (S.coins < 60) S.coins = 100; go('world'); },
  end: () => { S.done = true; go('end'); },
  t5: () => { Object.assign(S, { pos: DOORS.cantina, prok: false, fb: null, accepted: true, done: false, color: 0, gap: 30 }); go('practice'); },
};
document.querySelectorAll('#facmenu button').forEach(b => b.onclick = () => { presets[b.dataset.go](); $('#facmenu').classList.remove('on'); });
$('#facbtn').onclick = () => $('#facmenu').classList.toggle('on');
addEventListener('keydown', e => { if ((e.key === 'm' || e.key === 'M') && !['INPUT'].includes(document.activeElement.tagName)) $('#facmenu').classList.toggle('on'); });

go('start');
