document.addEventListener("DOMContentLoaded", () => {
  const charsContainer = document.querySelector(".chars-container");
  const loadMoreButton = document.getElementById("load-more");
  const nameFilter = document.getElementById("name");
  const characterModal = new bootstrap.Modal(
    document.getElementById("characterModal")
  );

  let currentPage = 1;
  let currentCharacters = [];

  async function loadCharacters(page) {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?page=${page}`
    );
    const data = await response.json();
    return data.results;
  }

  function renderCharacters(characters) {
    characters.forEach((character) => {
      const charElement = document.createElement("div");
      charElement.classList.add("character", "col-md-4", "mb-4");
      charElement.innerHTML = `
        <div class="card">
          <img src="${character.image}" class="card-img-top" alt="${character.name}" />
          <div class="card-body">
            <h5 class="card-title">${character.name}</h5>
            <p class="card-text">Species: ${character.species}</p>
            <p class="card-text">Gender: ${character.gender}</p>
            <p class="card-text">Status: ${character.status}</p>
            <button class="btn btn-primary btn-sm detail-button" data-id="${character.id}">Ver detalhes</button>
          </div>
        </div>
      `;
      charsContainer.appendChild(charElement);
    });

    const detailButtons = document.querySelectorAll(".detail-button");
    detailButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const characterId = button.getAttribute("data-id");
        showCharacterDetails(characterId);
      });
    });
  }

  async function loadMore() {
    currentPage++;
    const characters = await loadCharacters(currentPage);
    renderCharacters(characters);
  }

  async function searchCharactersByName(name) {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${name}`
    );
    const data = await response.json();
    return data.results;
  }

  async function showCharacterDetails(characterId) {
    const character = currentCharacters.find((char) => char.id == characterId);

    const modalBody = document.getElementById("characterModalBody");
    modalBody.innerHTML = `
      <img src="${character.image}" alt="${character.name}" class="modal-img" />
      <p>Name: ${character.name}</p>
      <p>Species: ${character.species}</p>
      <p>Gender: ${character.gender}</p>
      <p>Status: ${character.status}</p>
      <!-- Add other information here -->
    `;

    characterModal.show();
  }

  loadCharacters(currentPage)
    .then((characters) => {
      currentCharacters = characters;
      renderCharacters(currentCharacters);
    })
    .catch((error) => {
      console.error("Error loading characters:", error);
    });

  loadMoreButton.addEventListener("click", loadMore);

  nameFilter.addEventListener("input", async (event) => {
    const searchName = event.target.value.trim();
    if (searchName === "") {
      loadCharacters(currentPage)
        .then((characters) => {
          currentCharacters = characters;
          renderCharacters(currentCharacters);
        })
        .catch((error) => {
          console.error("Error loading characters:", error);
        });
    } else {
      const characters = await searchCharactersByName(searchName);
      renderCharacters(characters);
    }
  });
});
