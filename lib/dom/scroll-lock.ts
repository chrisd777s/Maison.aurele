/**
 * Ouvre un `<dialog>` modal en bloquant le défilement de la page, par une classe
 * sur `<html>` retirée à la fermeture. (Un `:root:has(dialog[open])` ferait
 * recalculer les styles de tout le document à chaque modification du DOM.)
 */
export function showModalLocked(dialog: HTMLDialogElement) {
  dialog.showModal();
  const root = document.documentElement;
  root.classList.add("defilement-bloque");
  dialog.addEventListener("close", () => root.classList.remove("defilement-bloque"), {
    once: true,
  });
}
