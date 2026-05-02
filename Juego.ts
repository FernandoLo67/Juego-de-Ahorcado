import * as readline from "readline";

const WORDS = [
  "typescript",
  "javascript",
  "programacion",
  "computadora",
  "algoritmo",
  "variable",
  "funcion",
  "interfaz",
  "compilador",
  "desarrollo",
  "framework",
  "biblioteca",
  "servidor",
  "cliente",
  "protocolo",
];

const HANGMAN_STAGES = [
  `
  +---+
  |   |
      |
      |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`,
];

const MAX_ERRORS = HANGMAN_STAGES.length - 1;

function getRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function buildDisplayWord(word: string, guessed: Set<string>): string {
  return word
    .split("")
    .map((letter) => (guessed.has(letter) ? letter : "_"))
    .join(" ");
}

function printState(
  word: string,
  guessed: Set<string>,
  wrongLetters: string[],
  errors: number
): void {
  console.clear();
  console.log(HANGMAN_STAGES[errors]);
  console.log("\nPalabra:", buildDisplayWord(word, guessed));
  console.log("\nLetras incorrectas:", wrongLetters.join(", ") || "ninguna");
  console.log(`Intentos restantes: ${MAX_ERRORS - errors}`);
}

async function playGame(rl: readline.Interface): Promise<void> {
  const word = getRandomWord();
  const guessed = new Set<string>();
  const wrongLetters: string[] = [];
  let errors = 0;

  const ask = (): Promise<string> =>
    new Promise((resolve) => rl.question("\nIngresa una letra: ", resolve));

  while (errors < MAX_ERRORS) {
    printState(word, guessed, wrongLetters, errors);

    const allRevealed = word.split("").every((l) => guessed.has(l));
    if (allRevealed) break;

    const input = (await ask()).toLowerCase().trim();

    if (!input || input.length !== 1 || !/[a-z]/.test(input)) {
      console.log("Ingresa una sola letra valida.");
      continue;
    }

    if (guessed.has(input) || wrongLetters.includes(input)) {
      console.log("Ya usaste esa letra.");
      continue;
    }

    if (word.includes(input)) {
      guessed.add(input);
    } else {
      wrongLetters.push(input);
      errors++;
    }
  }

  printState(word, guessed, wrongLetters, errors);

  const won = word.split("").every((l) => guessed.has(l));
  if (won) {
    console.log("\n¡Felicidades! Adivinaste la palabra:", word);
  } else {
    console.log("\n¡Perdiste! La palabra era:", word);
  }
}

async function main(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askReplay = (): Promise<string> =>
    new Promise((resolve) =>
      rl.question("\n¿Jugar de nuevo? (s/n): ", resolve)
    );

  console.log("=== JUEGO DEL AHORCADO ===");

  let playing = true;
  while (playing) {
    await playGame(rl);
    const answer = (await askReplay()).toLowerCase().trim();
    playing = answer === "s";
  }

  console.log("\n¡Hasta luego!");
  rl.close();
}

main();
