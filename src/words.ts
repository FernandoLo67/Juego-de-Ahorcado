export type Category   = "Programación" | "Animales" | "Países" | "Deportes";
export type Difficulty = "Fácil" | "Normal" | "Difícil";

export const CATEGORIES: Category[] = ["Programación", "Animales", "Países", "Deportes"];

const wordsByCategory: Record<Category, string[]> = {
  "Programación": [
    // fácil (≤7)
    "datos", "clase", "bucle", "lista", "error", "array", "cache",
    "token", "objeto", "modulo", "script", "funcion", "cliente",
    // normal (8)
    "variable", "interfaz", "servidor", "herencia",
    // difícil (≥9)
    "typescript", "javascript", "programacion", "computadora", "algoritmo",
    "compilador", "desarrollo", "framework", "biblioteca", "protocolo",
    "depuracion", "polimorfismo", "recursion",
  ],
  "Animales": [
    // fácil (≤7)
    "delfin", "gorila", "camello", "tortuga", "canguro", "jaguar", "conejo",
    // normal (8)
    "elefante", "mariposa", "pinguino", "leopardo",
    // difícil (≥9)
    "cocodrilo", "serpiente", "rinoceronte", "hipopotamo", "chimpance", "orangutan",
  ],
  "Países": [
    // fácil (≤7)
    "peru", "cuba", "chile", "iran", "mali", "japon", "india",
    "china", "corea", "ghana", "libia", "kenya", "sudan",
    // normal (8)
    "colombia", "portugal", "cambodia",
    // difícil (≥9)
    "argentina", "venezuela", "australia", "indonesia",
    "mozambique", "kazajstan", "eslovaquia",
  ],
  "Deportes": [
    // fácil (≤7)
    "futbol", "tenis", "boxeo", "rugby", "golf", "esgrima",
    // normal (8)
    "natacion", "ciclismo", "voleibol",
    // difícil (≥9)
    "baloncesto", "atletismo", "balonmano", "badminton", "gimnasia",
  ],
};

export function randomWord(category?: Category, difficulty?: Difficulty): { word: string; category: Category } {
  const cat = category ?? CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  let words = wordsByCategory[cat];

  if (difficulty === "Fácil") {
    const filtered = words.filter(w => w.length <= 7);
    if (filtered.length > 0) words = filtered;
  } else if (difficulty === "Difícil") {
    const filtered = words.filter(w => w.length >= 9);
    if (filtered.length > 0) words = filtered;
  }

  return { word: words[Math.floor(Math.random() * words.length)], category: cat };
}
