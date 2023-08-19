// Variáveis globais
const charsContainer = document.querySelector('.chars-container');
const loadMoreButton = document.getElementById('load-more');
const nameFilter = document.getElementById('name');
let currentPage = 1;

// Função para carregar personagens
async function loadCharacters(page) {
  const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
  const data = await response.json();
  return data.results;
}

// Função para renderizar personagens na página
function renderCharacters(characters) {
  charsContainer.innerHTML = '';
  characters.forEach(character => {
    const charElement = document.createElement('div');
    charElement.classList.add('character');
    charElement.innerHTML = `
      <img src="${character.image}" alt="${character.name}" />
      <h3>${character.name}</h3>
      <p>Species: ${character.species}</p>
      <p>Gender: ${character.gender}</p>
      <p>Status: ${character.status}</p>
    `;
    charsContainer.appendChild(charElement);
  });
}

// Função para carregar mais personagens
async function loadMore() {
  currentPage++;
  const characters = await loadCharacters(currentPage);
  renderCharacters(characters);
}

// Função para pesquisar personagens por nome
async function searchCharactersByName(name) {
  const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${name}`);
  const data = await response.json();
  return data.results;
}

// Event listener para o botão de carregar mais
loadMoreButton.addEventListener('click', loadMore);

// Event listener para a caixa de pesquisa de nome
nameFilter.addEventListener('input', async event => {
  const searchName = event.target.value.trim();
  if (searchName === '') {
    const characters = await loadCharacters(currentPage);
    renderCharacters(characters);
  } else {
    const characters = await searchCharactersByName(searchName);
    renderCharacters(characters);
  }
});

// Carregar os primeiros personagens
loadCharacters(currentPage)
  .then(characters => {
    renderCharacters(characters);
  })
  .catch(error => {
    console.error('Erro ao carregar personagens:', error);
  });
