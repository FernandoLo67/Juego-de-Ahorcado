const PARTS = ["head", "body", "left-arm", "right-arm", "left-leg", "right-leg"];

export function updateHangman(errors: number): void {
  PARTS.forEach((part, i) => {
    document.getElementById(part)!.classList.toggle("visible", i < errors);
  });
}
