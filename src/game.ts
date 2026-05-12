import { randomWord, Category, CATEGORIES, Difficulty } from "./words.js";
import { updateHangman } from "./hangman-svg.js";

interface GameState {
  word: string;
  category: Category | "";
  guessed: Set<string>;
  errors: number;
  gameOver: boolean;
}

interface Stats {
  played: number;
  won: number;
}

class HangmanGame {
  private readonly qwerty = [
    ["q","w","e","r","t","y","u","i","o","p"],
    ["a","s","d","f","g","h","j","k","l"],
    ["z","x","c","v","b","n","m"],
  ];

  private state: GameState = this.freshState();
  private streak = Number(localStorage.getItem("streak") ?? 0);
  private stats: Stats = JSON.parse(localStorage.getItem("stats") ?? '{"played":0,"won":0}');
  private selectedCategory: Category | null = null;
  private difficulty: Difficulty = "Normal";

  private get maxErrors(): number {
    return this.difficulty === "Difícil" ? 5 : 6;
  }

  constructor() {
    (document.getElementById("restart-btn") as HTMLButtonElement)
      .addEventListener("click", () => this.init());

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (/^[a-zA-Z]$/.test(e.key)) this.guess(e.key.toLowerCase());
    });

    this.buildCategoryPicker();
    this.buildDifficultyPicker();
    this.buildKeyboard();
    this.init();
  }

  private freshState(): GameState {
    const { word, category } = randomWord(this.selectedCategory ?? undefined, this.difficulty);
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
    (document.getElementById("category-display") as HTMLElement).textContent =
      this.difficulty === "Difícil" ? "???" : this.state.category;
  }

  private renderStreak(): void {
    const el = document.getElementById("streak-display") as HTMLElement;
    el.textContent = this.streak > 0 ? `Racha: ${this.streak}` : "";
  }

  private buildCategoryPicker(): void {
    const container = document.getElementById("category-picker")!;

    const allBtn = document.createElement("button");
    allBtn.className = "cat-btn active";
    allBtn.textContent = "Aleatoria";
    allBtn.addEventListener("click", () => this.selectCategory(null, allBtn));
    container.appendChild(allBtn);

    CATEGORIES.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "cat-btn";
      btn.textContent = cat;
      btn.addEventListener("click", () => this.selectCategory(cat, btn));
      container.appendChild(btn);
    });
  }

  private selectCategory(cat: Category | null, btn: HTMLButtonElement): void {
    this.selectedCategory = cat;
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    this.init();
  }

  private buildDifficultyPicker(): void {
    const container = document.getElementById("difficulty-picker")!;
    const levels: Array<{ label: string; value: Difficulty; cls: string }> = [
      { label: "Fácil",   value: "Fácil",   cls: "active-easy" },
      { label: "Normal",  value: "Normal",  cls: "active-normal" },
      { label: "Difícil", value: "Difícil", cls: "active-hard" },
    ];

    levels.forEach(({ label, value, cls }) => {
      const btn = document.createElement("button");
      btn.className = `diff-btn${value === this.difficulty ? ` ${cls}` : ""}`;
      btn.dataset.cls = cls;
      btn.textContent = label;
      btn.addEventListener("click", () => this.selectDifficulty(value, btn));
      container.appendChild(btn);
    });
  }

  private selectDifficulty(diff: Difficulty, btn: HTMLButtonElement): void {
    this.difficulty = diff;
    document.querySelectorAll(".diff-btn").forEach(b => {
      b.classList.remove("active-easy", "active-normal", "active-hard");
    });
    btn.classList.add(btn.dataset.cls!);
    this.init();
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

    this.stats.played++;
    if (won) {
      this.streak++;
      this.stats.won++;
      localStorage.setItem("streak", String(this.streak));
    } else {
      this.streak = 0;
      localStorage.setItem("streak", "0");
      word.split("").forEach(l => guessed.add(l));
      this.renderWord();
    }
    localStorage.setItem("stats", JSON.stringify(this.stats));

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
    const pct = this.stats.played > 0
      ? Math.round((this.stats.won / this.stats.played) * 100)
      : 0;
    (document.getElementById("modal-stats") as HTMLElement).textContent =
      `Jugadas: ${this.stats.played}  •  Ganadas: ${this.stats.won}  •  Acierto: ${pct}%`;
    document.getElementById("modal")!.classList.add("active");
  }

  private hideModal(): void {
    document.getElementById("modal")!.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", () => new HangmanGame());
