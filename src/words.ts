export type Category = "Programación" | "Animales" | "Países" | "Deportes";

const wordsByCategory: Record<Category, string[]> = {
  "Programación": [
    "typescript", "javascript", "programacion", "computadora", "algoritmo",
    "variable", "funcion", "interfaz", "compilador", "desarrollo", "framework",
    "biblioteca", "servidor", "cliente", "protocolo", "depuracion", "herencia",
    "polimorfismo", "recursion",
  ],
  "Animales": [
    "elefante", "cocodrilo", "mariposa", "serpiente", "delfin", "pinguino",
    "gorila", "camello", "tortuga", "canguro", "leopardo", "rinoceronte",
  ],
  "Países": [
    "argentina", "colombia", "venezuela", "portugal", "australia", "indonesia",
    "mozambique", "kazajstan", "eslovaquia", "cambodia",
  ],
  "Deportes": [
    "futbol", "baloncesto", "tenis", "natacion", "ciclismo", "atletismo",
    "voleibol", "balonmano", "esgrima", "badminton",
  ],
};

export function randomWord(): { word: string; category: Category } {
  const categories = Object.keys(wordsByCategory) as Category[];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const words = wordsByCategory[category];
  return { word: words[Math.floor(Math.random() * words.length)], category };
}
