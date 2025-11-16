export function createWorkerCard(worker) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.padding = "14px";
  card.style.marginBottom = "10px";

  card.innerHTML = `
    <h3>${worker.name}</h3>
    <p>Skill: ${worker.skill_category}</p>
    <p>Status: ${worker.availability}</p>
    <p>Rating: ⭐ ${worker.rating || 0}</p>
  `;

  return card;
}
