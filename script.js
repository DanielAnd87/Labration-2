
let favorites = [];
let isEditing = false;
let seleceted_for_edit = '';
let added_characters = [];
let favorite_id_count = 0;

function is_favorite(id) {
  for (i = 0; i < favorites.length; i++) {
    if (favorites[i].id === id) {
      return true;
    }
  }
  return false;
}
function remove_favorite(id) {
  for (i = 0; i < favorites.length; i++) {
    if (favorites[i].id === id) {
      console.log(favorites[i].name + " was removed from favorites.");
      favorites.splice(i, 1);
      break;
    }
  }
}
function add_result_to_list(name, home_url) {
  
  let url_secured = secureUrl(home_url);

  fetch(url_secured)
    .then(response => response.json())
    .then(home_json => {
      added_characters.push({ name: name, homeworld: home_json.name, id: 'fav' + favorite_id_count });
      favorite_id_count++;
    }).catch(err => {
      console.log(err);
    });
}
function add_to_result(name, home_url, id, result_container, favorites_container) {
  console.log(name);
  let text_container = document.createElement('div');
  text_container.classList.toggle('text-container')
  let result_box = document.createElement('div');
  result_box.classList.toggle('reslut-div');
  let result_element = document.createElement('h4');
  result_element.classList.toggle('reslut-text');
  let favorite_btn = document.createElement('button');
  //favorite_btn.innerText = 'favorite'
  favorite_btn.classList.toggle('result-favorite');
  favorite_btn.classList.toggle('fa-star');
  favorite_btn.classList.toggle('far');
  result_box.id = id + "result";

  
  result_element.innerText = name;
  let result_homeworld = document.createElement('p');
  result_homeworld.innerText = "Homeworld: " + home_url;
  text_container.append(result_element);
  text_container.append(result_homeworld);
  result_box.append(text_container);
  result_box.append(favorite_btn);
  result_container.append(result_box);
  favorite_btn.addEventListener('click', () => {
    if (!is_favorite(id)){
      add_a_favorite(name, home_url, id, favorites_container);
      favorite_btn.style.backgroundColor = "#FFE81F";
    }
    else {
     // remove_favorite(id);
      document.querySelector(`#${id} #favorite-remover`).click();
      favorite_btn.style.backgroundColor = "aliceblue";
    }
  });

}
function add_a_favorite(name, homeworld, fav_id) {
  if (!is_favorite(fav_id)) {
    document.getElementById('no-favorites').style.display = 'none';
    // Add an element with the name of the character at favorites-div
    let favorite_name = document.createElement('h4');
    let favorite_box = document.createElement('div');
    let text_box = document.createElement('div');
    text_box.classList.toggle('text-container');
    favorite_box.classList.toggle('reslut-div');
    let favorite_remover = document.createElement('button');
    let favorite_editer = document.createElement('button');
    favorite_remover.type = 'button';
    // Finding homeworld.
    favorite_remover.id = 'favorite-remover';
    favorite_remover.classList.toggle('far');
    favorite_remover.classList.toggle('fa-trash-alt');
    favorite_editer.classList.toggle('far');
    favorite_editer.classList.toggle('fa-edit');

    favorite_editer.id = 'favorite-editer';
    favorite_name.innerText = name;
    
    text_box.append(favorite_name);
    let favorit_homeworld = document.createElement('p');
    favorit_homeworld.classList.toggle('homeworld-text');
    favorite_name.classList.toggle('name-text')
    favorit_homeworld.innerText = "Homeworld: " + homeworld;
    text_box.append(favorit_homeworld);
    favorite_box.append(text_box);
    favorite_box.append(favorite_remover);
    favorite_box.append(favorite_editer);
    let favorites_container = document.getElementById('favorites-results');
    favorites_container.appendChild(favorite_box);
    favorite_box.id = fav_id;
    favorites.push({ name: name, homeworld: homeworld, id: fav_id });
    favorite_editer.addEventListener('click', () => {
      if (!isEditing){
        isEditing = true;
        text_box.style.display = "none";
        favorite_editer.style.display = "none";
        favorite_remover.style.display = "none";
        let edit_box = document.getElementById('add-container');
        edit_box.style.display = "inline-block";
        let planet_input = document.getElementById('planets-list');
        planet_input.value = homeworld;
        let new_name_input = document.getElementById('new-character-name');
        new_name_input.value = name;
        favorite_box.appendChild(edit_box);
        seleceted_for_edit = fav_id;
      }
    });
    favorite_remover.addEventListener('click', () => {
      let edit_box = document.getElementById('add-container');
      const storage_container = document.getElementById('storage');
      storage_container.appendChild(edit_box);
      remove_favorite(fav_id);
      document.getElementById(fav_id).outerHTML = "";
    });
  }
}
function search_from_fetched(result_container, favorites_container, search_string) {
  result_container.innerHTML = "";
  for (i = 0; i < added_characters.length; i++) {
    const current_character = added_characters[i];
    const matches_result = current_character.name.toLowerCase().includes(search_string.toLowerCase());
    if (matches_result) {
      add_to_result(current_character.name, current_character.homeworld, current_character.id, result_container, favorites_container);
    }
  }
}
function secureUrl(url) {
  url_secured = url;
  url_secured = url_secured.slice(0,4) + 's' + url_secured.slice(4);
  return url_secured;
}

function fetch_characters(url) {
  fetch(url)
    .then(response => response.json())
    .then(json => {
      for (i = 0; i < json.results.length; i++) {
        const name = json.results[i].name;
        const home_url = json.results[i].homeworld;
        add_result_to_list(name, home_url);
      }
      if (json.next != null){
        let url_secured = secureUrl(json.next);
        fetch_characters(url_secured);
      }
    }).catch(err => {
      console.log('error!')
      console.log(err);
    })
}

const callback = event => {
  let browse_btn = document.getElementById('show-browse-btn');
  let favorite_btn = document.getElementById('show-favorite-btn');
  browse_btn.addEventListener('click', () => {
    let browse_layout = document.getElementById('browse-container');
    let favorite_layout = document.getElementById('favorites-container');
    browse_btn.style.background = '#FFE81F';
    browse_btn.style.color = '#3C3C3C';
    favorite_btn.style.background = '#2E2E2E';
    favorite_btn.style.color = '#FBFBFB';

    browse_layout.style.display = 'block';
    favorite_layout.style.display = 'none';

    browse_layout.style.opacity = '100%';
    favorite_layout.style.opacity = '0%';
    browse_layout.style.transition = "opacity 2s";
  });
  favorite_btn.addEventListener('click', () => {
    let browse_layout = document.getElementById('browse-container');
    let favorite_layout = document.getElementById('favorites-container');
    favorite_btn.style.background = '#FFE81F';
    favorite_btn.style.color = '#3C3C3C';
    browse_btn.style.background = '#2E2E2E';
    browse_btn.style.color = '#FBFBFB';
    browse_layout.style.display = 'none';
    favorite_layout.style.display = 'block';

    browse_layout.style.opacity = '0%';
    favorite_layout.style.opacity = '100%';
  });
  document.getElementById('add-character-button').addEventListener('click', () => {
    // Add a favorite
    let new_id = 'fav' + favorite_id_count;
    const no_name = 'Unknown';
    add_a_favorite(no_name, no_name, new_id);
    favorite_id_count++;
    // Push favorite object to added-characters
    added_characters.push({name: no_name, homeworld: no_name, id: new_id});
    // Start the edit-functionality to the new favorite.
    document.querySelector(`#${new_id} .fa-edit`).click();
  });
  let search_field = document.getElementById('search-field');
  let result_container = document.getElementById('reslut-container');
  let favorites_container = document.getElementById('favorites-container');
  const people_url = `https://swapi.dev/api/people/`;
  fetch_characters(people_url);
  function search_people() {
    search_from_fetched(result_container, favorites_container, document.getElementById('search-field').value);
    for (i = 0; i < favorites.length; i++) {
      const fav = favorites[i];
      const current_fav = document.querySelector(`#${fav.id}result button`);
      if (current_fav != null){
        current_fav.style.backgroundColor = "#FFE81F";
      }
    }
  }
  const planet_url = `https://swapi.dev/api/planets/`;
  fetch(planet_url)
    .then(response => response.json())
    .then(json => {
      //result_container.innerHTML = "";
      let planet_list = document.getElementById('planets');

      for (i = 0; i < json.results.length; i++) {
        console.log(json.results[i].name);
        let planet_txt = document.createElement('option');
        planet_txt.value = json.results[i].name;
        planet_list.append(planet_txt);
      }

    }).catch(err => {
      console.log('error!')
      console.log(err);
    });
  const edit_done_btn = document.getElementById('add-button');
  edit_done_btn.addEventListener('click', () => {
    isEditing = false;
    let planet_input = document.getElementById('planets-list');
    let new_name_input = document.getElementById('new-character-name');
    const choosen_planet = planet_input.value;
    const choosen_name = new_name_input.value;
    const text_box = document.querySelector(`#${seleceted_for_edit} div`);
    const favorite_remover = document.querySelector(`#${seleceted_for_edit} #favorite-remover`);
    const favorite_editer = document.querySelector(`#${seleceted_for_edit} #favorite-editer`);
    const edit_box = document.getElementById('add-container');
    const storage_container = document.getElementById('storage');
    storage_container.appendChild(edit_box);
    edit_box.style.display = 'none';
    
    text_box.style.display = "inline-block";
    favorite_remover.style.display = "inline-block";
      favorite_editer.style.display = "inline-block";
    // Edit the data
    for (i = 0; i < added_characters.length; i++) {
      if (added_characters[i].id === seleceted_for_edit) {
        let name_element = document.querySelector(`#${added_characters[i].id} .homeworld-text`);
        let homeworld_element = document.querySelector(`#${added_characters[i].id} .name-text`);
        
        let name_element_fav = document.querySelector(`#${added_characters[i].id}result .text-container h4`);
        let homeworld_element_fav = document.querySelector(`#${added_characters[i].id}result .text-container p`);
        if (name_element_fav != null) {
          if (choosen_name.length != 0){
            added_characters[i].name = choosen_name;
            name_element_fav.innerText = choosen_name;
            homeworld_element.innerText = choosen_name;
          }
          if (choosen_planet.length != 0){
            added_characters[i].homeworld = choosen_planet;
            homeworld_element_fav.innerText = choosen_planet;
            name_element.innerText = choosen_planet;
          }
        }
      }
    }
   // add_a_favorite(choosen_name, choosen_planet);
  })
  // Adding keylisterners for searching.
  search_field.addEventListener('keypress', (event) => {
    search_people();
  });
  search_field.addEventListener('keydown', (event) => {
    if (event.key === "Backspace") {
      search_people();
    }
  });
}
window.addEventListener('load', callback);