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

function parseCSV(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return [];

  return lines.slice(1).map(line => {
    // detectamos delimitador correcto
    const sep = line.includes(';') ? ';' : ',';
    const cols = line.split(sep).map(c => c.trim()).filter(Boolean);

    // normalmente viene algo como ["1", "GONZALO LEMME", "19.600", "0"]
    const pos = parseInt(cols[0]);
    const nombre = cols[1] || '';
    const puntos = parseFloat((cols[2] || '0').replace(/\./g, '').replace(',', '.'));

    return {
      pos: isNaN(pos) ? undefined : pos,
      nombre,
      apellido: '',
      puntos: isNaN(puntos) ? 0 : puntos
    };
  }).filter(r => r.nombre);
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
