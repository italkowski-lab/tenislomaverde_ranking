// script para manejar la tabla de ranking y la importación CSV
const samplePlayers = [
  {pos: 1, nombre: 'Juan', apellido: 'Perez', puntos: 1200},
  {pos: 2, nombre: 'María', apellido: 'Gomez', puntos: 1150},
  {pos: 3, nombre: 'Carlos', apellido: 'Lopez', puntos: 980},
];

function renderTable(players){
  const tbody = document.querySelector('#rankingTable tbody');
  tbody.innerHTML = '';
  players.sort((a,b)=> (a.pos ?? Number.MAX_SAFE_INTEGER) - (b.pos ?? Number.MAX_SAFE_INTEGER));
  players.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="col-pos">${p.pos ?? ''}</td>
      <td class="col-jugador">${escapeHtml(p.nombre)} ${escapeHtml(p.apellido)}</td>
      <td class="col-puntos">${p.puntos ?? ''}</td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(text){
  if(text === undefined || text === null) return '';
  return String(text).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

// handlers
document.getElementById('addSampleData').addEventListener('click', ()=> renderTable(samplePlayers.slice()));
document.getElementById('clearTable').addEventListener('click', ()=> renderTable([]));

document.getElementById('csvFileInput').addEventListener('change', handleFile, false);

function handleFile(evt){
  const file = evt.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result;
    const players = parseCSV(text);
    // if positions not provided, assign by points desc
    if(players.every(p=> !p.pos)){
      players.sort((a,b)=> (b.puntos||0) - (a.puntos||0));
      players.forEach((p,i)=> p.pos = i+1);
    }
    renderTable(players);
  };
  reader.readAsText(file, 'UTF-8');
}

function parseCSV(text){
  // simple CSV parser: espera encabezado con columnas nombre,apellido,posicion,puntos (puede variar)
  const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(l=>l.length>0);
  if(lines.length===0) return [];
  const header = lines[0].split(',').map(h=>h.trim().toLowerCase());
  const idx = {
    nombre: header.indexOf('nombre'),
    apellido: header.indexOf('apellido'),
    posicion: header.indexOf('posicion'),
    puntos: header.indexOf('puntos'),
    position_alt: header.indexOf('pos') // alternativa
  };
  const rows = lines.slice(1).map(line=>{
    const cols = line.split(',').map(c=>c.trim());
    return {
      nombre: idx.nombre>=0 ? cols[idx.nombre] : (cols[0]||''),
      apellido: idx.apellido>=0 ? cols[idx.apellido] : (cols[1]||''),
      pos: (idx.posicion>=0 ? parseInt(cols[idx.posicion]) : (idx.position_alt>=0 ? parseInt(cols[idx.position_alt]) : undefined)) || undefined,
      puntos: idx.puntos>=0 ? parseInt(cols[idx.puntos]) : (cols[2] ? parseInt(cols[2]) : undefined)
    };
  }).filter(r=> r.nombre || r.apellido);
  return rows;
}

// sample CSV download
document.getElementById('downloadSample').addEventListener('click', ()=>{
  const csv = 'nombre,apellido,posicion,puntos\nJuan,Perez,1,1200\nMaría,Gomez,2,1150\nCarlos,Lopez,3,980\n';
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'players_sample.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// al cargar, mostramos tabla vacía
renderTable([]);
