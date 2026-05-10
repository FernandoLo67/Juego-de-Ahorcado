import { randomWord, Category } from "./words.js";
import { updateHangman } from "./hangman-svg.js";

interface GameState {
  word: string;
  category: Category | "";
  guessed: Set<string>;
  errors: number;
  gameOver: boolean;
}

class HangmanGame {
  private readonly maxErrors = 6;
  private readonly qwerty = [
    ["q","w","e","r","t","y","u","i","o","p"],
    ["a","s","d","f","g","h","j","k","l"],
    ["z","x","c","v","b","n","m"],
  ];

  private state: GameState = this.freshState();
  private streak = 0;

  constructor() {
    (document.getElementById("restart-btn") as HTMLButtonElement)
      .addEventListener("click", () => this.init());

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (/^[a-zA-Z]$/.test(e.key)) this.guess(e.key.toLowerCase());
    });

    this.buildKeyboard();
    this.init();
  }

  private freshState(): GameState {
    const { word, category } = randomWord();
    return { word, category, guessed: new Set(), errors: 0, gameOver: false };
  }

  private init(): void {
    this.state = this.freshState();

    this.resetKeyboard();
    this.renderWord();
    this.renderHearts();
    updateHangman(0);
    this.hideModal();
    this.renderStreak();

    (document.getElementById("wrong-display") as HTMLElement).textContent = "—";
    (document.getElementById("category-display") as HTMLElement).textContent = this.state.category;
  }

  private renderStreak(): void {
    const el = document.getElementById("streak-display") as HTMLElement;
    el.textContent = this.streak > 0 ? `Racha: ${this.streak}` : "";
  }

  private buildKeyboard(): void {
    const container = document.getElementById("keyboard")!;
    this.qwerty.forEach(row => {
      const rowEl = document.createElement("div");
      rowEl.className = "key-row";
      row.forEach(letter => {
        const btn = document.createElement("button");
        btn.id = `key-${letter}`;
        btn.className = "key-btn";
        btn.textContent = letter.toUpperCase();
        btn.addEventListener("click", () => this.guess(letter));
        rowEl.appendChild(btn);
      });
      container.appendChild(rowEl);
    });
  }

  private resetKeyboard(): void {
    this.qwerty.flat().forEach(letter => {
      const btn = document.getElementById(`key-${letter}`) as HTMLButtonElement;
      btn.className = "key-btn";
      btn.disabled = false;
    });
  }

  private renderWord(): void {
    const { word, guessed } = this.state;
    (document.getElementById("word-display") as HTMLElement).innerHTML = word
      .split("")
      .map(l =>
        `<span class="letter${guessed.has(l) ? " revealed" : ""}">${guessed.has(l) ? l : ""}</span>`
      )
      .join("");
  }

  private renderHearts(): void {
    (document.getElementById("hearts") as HTMLElement).innerHTML = Array.from(
      { length: this.maxErrors },
      (_, i) => `
        <svg class="heart ${i < this.maxErrors - this.state.errors ? "active" : "lost"}" viewBox="0 0 24 24">
          <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191
            1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447
            2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
        </svg>`
    ).join("");
  }

  private guess(letter: string): void {
    const { gameOver, guessed, word } = this.state;
    if (gameOver || guessed.has(letter)) return;

    guessed.add(letter);
    const btn = document.getElementById(`key-${letter}`) as HTMLButtonElement;

    if (word.includes(letter)) {
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
      this.state.errors++;
      updateHangman(this.state.errors);
      this.renderHearts();
      const wrong = [...guessed].filter(l => !word.includes(l));
      (document.getElementById("wrong-display") as HTMLElement).textContent =
        wrong.length ? wrong.map(l => l.toUpperCase()).join("  ") : "—";
    }

    btn.disabled = true;
    this.renderWord();
    this.checkEnd();
  }

  private checkEnd(): void {
    const { word, guessed, errors } = this.state;
    const won = word.split("").every(l => guessed.has(l));
    const lost = errors >= this.maxErrors;
    if (!won && !lost) return;

    this.state.gameOver = true;

    if (won) {
      this.streak++;
    } else {
      this.streak = 0;
      word.split("").forEach(l => guessed.add(l));
      this.renderWord();
    }

    this.showModal(won);
  }

  private showModal(won: boolean): void {
    (document.getElementById("modal-title") as HTMLElement).textContent = won ? "¡Ganaste!" : "¡Perdiste!";
    (document.getElementById("modal-title") as HTMLElement).className = won ? "win" : "lose";
    (document.getElementById("modal-subtitle") as HTMLElement).textContent =
      won ? "Adivinaste la palabra:" : "La palabra era:";
    (document.getElementById("modal-word") as HTMLElement).textContent = this.state.word.toUpperCase();
    (document.getElementById("modal-streak") as HTMLElement).textContent =
      won && this.streak > 1 ? `¡${this.streak} seguidas!` : "";
    document.getElementById("modal")!.classList.add("active");
  }

  private hideModal(): void {
    document.getElementById("modal")!.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", () => new HangmanGame());
