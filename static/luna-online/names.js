// Fila de fala limitada. Somente frases da Luna; nunca lê comentários livres.
export function spokenName(value){return String(value||'visitante').normalize('NFKC').replace(/https?:\S+/gi,'').replace(/[^\p{L}\p{N} '\-]/gu,' ').replace(/\s+/g,' ').trim().slice(0,32)||'visitante';}
