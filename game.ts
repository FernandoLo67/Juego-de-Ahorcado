class HangmanGame {
  private readonly words = [
    "typescript", "javascript", "programacion", "computadora",
    "algoritmo", "variable", "funcion", "interfaz", "compilador",
    "desarrollo", "framework", "biblioteca", "servidor", "cliente",
    "protocolo", "depuracion", "herencia", "polimorfismo", "recursion",
  ];

  private readonly maxErrors = 6;
  private readonly parts = ["head", "body", "left-arm", "right-arm", "left-leg", "right-leg"];
  private readonly qwerty = [
    ["q","w","e","r","t","y","u","i","o","p"],
    ["a","s","d","f","g","h","j","k","l"],
    ["z","x","c","v","b","n","m"],
  ];

  private word = "";
  private guessed = new Set<string>();
  private errors = 0;
  private gameOver = false;

  constructor() {
    (document.getElementById("restart-btn") as HTMLButtonElement)
      .addEventListener("click", () => this.init());

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (/^[a-zA-Z]$/.test(e.key)) this.guess(e.key.toLowerCase());
    });

    this.buildKeyboard();
    this.init();
  }

  private init(): void {
    this.word = this.words[Math.floor(Math.random() * this.words.length)];
    this.guessed = new Set();
    this.errors = 0;
    this.gameOver = false;

    this.resetKeyboard();
    this.renderWord();
    this.renderHearts();
    this.updateHangman();
    this.hideModal();

    (document.getElementById("wrong-display") as HTMLElement).textContent = "—";
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
    (document.getElementById("word-display") as HTMLElement).innerHTML = this.word
      .split("")
      .map(l =>
        `<span class="letter${this.guessed.has(l) ? " revealed" : ""}">${this.guessed.has(l) ? l : ""}</span>`
      )
      .join("");
  }

  private renderHearts(): void {
    (document.getElementById("hearts") as HTMLElement).innerHTML = Array.from(
      { length: this.maxErrors },
      (_, i) => `
        <svg class="heart ${i < this.maxErrors - this.errors ? "active" : "lost"}" viewBox="0 0 24 24">
          <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191
            1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447
            2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
        </svg>`
    ).join("");
  }

  private updateHangman(): void {
    this.parts.forEach((part, i) => {
      document.getElementById(part)!.classList.toggle("visible", i < this.errors);
    });
  }

  private guess(letter: string): void {
    if (this.gameOver || this.guessed.has(letter)) return;

    this.guessed.add(letter);
    const btn = document.getElementById(`key-${letter}`) as HTMLButtonElement;

    if (this.word.includes(letter)) {
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
      this.errors++;
      this.updateHangman();
      this.renderHearts();
      const wrong = [...this.guessed].filter(l => !this.word.includes(l));
      (document.getElementById("wrong-display") as HTMLElement).textContent =
        wrong.length ? wrong.map(l => l.toUpperCase()).join("  ") : "—";
    }

    btn.disabled = true;
    this.renderWord();
    this.checkEnd();
  }

  private checkEnd(): void {
    const won = this.word.split("").every(l => this.guessed.has(l));
    const lost = this.errors >= this.maxErrors;
    if (!won && !lost) return;

    this.gameOver = true;

    if (lost) {
      this.word.split("").forEach(l => this.guessed.add(l));
      this.renderWord();
    }

    this.showModal(won);
  }

  private showModal(won: boolean): void {
    (document.getElementById("modal-title") as HTMLElement).textContent = won ? "¡Ganaste!" : "¡Perdiste!";
    (document.getElementById("modal-title") as HTMLElement).className = won ? "win" : "lose";
    (document.getElementById("modal-subtitle") as HTMLElement).textContent =
      won ? "Adivinaste la palabra:" : "La palabra era:";
    (document.getElementById("modal-word") as HTMLElement).textContent = this.word.toUpperCase();
    document.getElementById("modal")!.classList.add("active");
  }

  private hideModal(): void {
    document.getElementById("modal")!.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", () => new HangmanGame());
