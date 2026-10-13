const cards = [...document.querySelectorAll(".card")];
const filters = document.querySelectorAll(".filter");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
let visibleCards = cards;
let current = 0;

function updateVisible() {
  visibleCards = cards.filter(card => card.style.display !== "none");
}
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.dataset.category;
    cards.forEach(card => {
      card.style.display = category === "all" || card.dataset.category === category ? "" : "none";
    });
    updateVisible();
  });
});

function openLightbox(index) {
  current = index;
  const img = visibleCards[current].querySelector("img");
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.textContent = visibleCards[current].querySelector(".caption").textContent;
  lightbox.classList.add("show");
}
cards.forEach(card => card.addEventListener("click", () => {
  updateVisible();
  openLightbox(visibleCards.indexOf(card));
}));
document.getElementById("close").onclick = () => lightbox.classList.remove("show");
document.getElementById("prev").onclick = () => {
  current = (current - 1 + visibleCards.length) % visibleCards.length;
  openLightbox(current);
};
document.getElementById("next").onclick = () => {
  current = (current + 1) % visibleCards.length;
  openLightbox(current);
};
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("show")) return;
  if (e.key === "Escape") lightbox.classList.remove("show");
  if (e.key === "ArrowLeft") document.getElementById("prev").click();
  if (e.key === "ArrowRight") document.getElementById("next").click();
});
