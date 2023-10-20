// ******************** Pokemons ********************

async function getPokemons() {
    const parent = document.getElementById("d10");
    const div = document.createElement('div');
    div.className = "loadSpinner";
    parent.appendChild(div);
    let pokemonTable = []

    let wUrl = "https://pokeapi.co/api/v2/pokemon/?limit= 100";
    while (wUrl != null) {
        const data = await fetch(wUrl);
        const parsedData = await data.json();
        let wNext = parsedData.next
        for (let i = 0; i < parsedData.results.length; i++) {
            let item = { name: parsedData.results[i].name, url: parsedData.results[i].url }
            pokemonTable.push(item)
        }
        wUrl = wNext;
    }
    pokemonTable.sort((a, b) => a.name > b.name ? 1 : -1);
    populatePokemons(pokemonTable)
}

function populatePokemons(pokemonTable) {
    const itemSearch = []
    document.getElementById("d10").innerHTML = ""
    const parent = document.getElementById("d10");

    const dataRow = document.createElement('div');
    dataRow.className = "input-row"
    let enterField = document.createElement("input");
    enterField.id = "input-data"
    enterField.type = "text";
    enterField.oninput = function () {
        let searchTerm = document.getElementById("input-data").value.toLowerCase();
        itemSearch.forEach(item => {
            if (item.name.startsWith(searchTerm)) {
                item.row.style.display = "flex";
            } else {
                item.row.style.display = "none";
            }
        })
    }
    dataRow.appendChild(enterField);
    parent.appendChild(dataRow)

    const dataContainer = document.createElement('div');
    dataContainer.className = "table-container"
    for (let i = 0; i < pokemonTable.length; i++) {
        const dataRow = document.createElement('div');
        dataRow.className = "table-row"

        let dataCell = document.createElement('div');
        dataCell.className = "table-icon-div"
        let icon = new Image();
        icon.className = "table-icon";
        let wSrc = pokemonTable[i].url.replace("https://pokeapi.co/api/v2/pokemon/", "");
        wSrc = wSrc.replace("/", ".png")
        icon.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + wSrc;
        icon.onerror = function () { this.style.display = "none"; }
        dataCell.appendChild(icon)
        dataRow.appendChild(dataCell);

        dataCell = document.createElement('div');
        dataCell.classList = "table-name"
        dataCell.textContent = pokemonTable[i].name;
        dataRow.appendChild(dataCell);
        dataRow.onclick = function () {
            showSprites(pokemonTable[i]);
        }
        dataContainer.appendChild(dataRow)
        itemSearch.push({ name: pokemonTable[i].name.toLowerCase(), row: dataRow })
    }
    parent.appendChild(dataContainer)
}

async function showSprites(pokemon) {
    document.getElementById("d20").innerHTML = ""
    document.getElementById("d30").innerHTML = ""
    document.getElementById("d40").innerHTML = ""
    const parent = document.getElementById("d20");
    const spriteContainer = document.createElement("div")
    spriteContainer.className = "sprite-container"

    let data = await fetch(pokemon.url);
    let parsedData = await data.json();

    let spriteRow = document.createElement("div")
    spriteRow.className = "sprite-row"
    let sprite = new Image();
    sprite.className = "sprite";
    sprite.src = parsedData.sprites.front_default;
    sprite.onerror = function () { this.style.display = "none"; }
    spriteRow.appendChild(sprite)

    sprite = new Image();
    sprite.className = "sprite";
    sprite.src = parsedData.sprites.back_default;
    sprite.onerror = function () { this.style.display = "none"; }
    spriteRow.appendChild(sprite)
    spriteContainer.append(spriteRow)

    spriteRow = document.createElement("div")
    spriteRow.className = "sprite-row"
    sprite = new Image();
    sprite.className = "sprite";
    sprite.src = parsedData.sprites.front_shiny;
    sprite.onerror = function () { this.style.display = "none"; }
    spriteRow.appendChild(sprite)

    sprite = new Image();
    sprite.className = "sprite";
    sprite.src = parsedData.sprites.back_shiny;
    sprite.onerror = function () { this.style.display = "none"; }
    spriteRow.appendChild(sprite)
    spriteContainer.append(spriteRow)
    parent.appendChild(spriteContainer)

    let cardContainer = document.createElement("div")
    cardContainer.className = "card-row"
    let card = new Image();
    card.className = "card";
    let cardTable = []
    let parsedCard
    const cardData = await fetch("https://api.pokemontcg.io/v2/cards?q=name:" + pokemon.name)
    if (!cardData.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        parsedCard = await cardData.json();
        for (let i = 0; i < parsedCard.data.length; i++) {
            if (parsedCard.data.length > 0 && parsedCard.data[i].images != undefined) {
                cardTable.push(parsedCard.data[i].images.small)
            }
        }
        if (cardTable.length > 0) {
            displayCard(parent, parsedCard, cardTable, 0, card, cardContainer)
        }
    }
    showDetails(parsedData, pokemon.name)
}

function displayCard(parent, parsedCard, cardTable, wIndex, card, cardContainer) {

    let cardImage = cardTable[wIndex]
    card.src = cardImage
    card.onerror = function () { this.style.display = "none"; }
    card.onclick = function () {
        showCardData(parsedCard, wIndex);
    }
    cardContainer.appendChild(card)
    const nextButton = document.createElement('button')
    nextButton.className = "card-button"
    nextButton.innerHTML = "Next card"
    nextButton.onclick = function () {
        nextButton.remove()
        if (wIndex < cardTable.length - 1) {
            wIndex += 1
        } else {
            wIndex = 0
        }
        displayCard(parent, parsedCard, cardTable, wIndex, card, cardContainer)
    }
    cardContainer.append(nextButton)
    parent.appendChild(cardContainer)
}

function showCardData(parsedCard, wIndex) {
    const style = getComputedStyle(document.body)
    const colour = style.getPropertyValue('--card')
    const cardData = parsedCard.data[wIndex]
    let wMessage = ""

    if (cardData.supertype != undefined) {
        wMessage = wMessage + "Supertype: " + cardData.supertype;
    }

    if (cardData.subtypes != undefined) {
        let item = cardData.subtypes
        wMessage = wMessage + "|Subtypes: "
        for (let i = 0; i < item.length; i++) {
            if (i > 0) {
                wMessage = wMessage + ", "
            }
            wMessage = wMessage + item[i]
        }
    }

    if (cardData.evolvesTo != undefined) {
        let item = cardData.evolvesTo
        wMessage = wMessage + "|Evolves to: "
        for (let i = 0; i < item.length; i++) {
            if (i > 0) {
                wMessage = wMessage + ", "
            }
            wMessage = wMessage + item[i]
        }
    }

    if (cardData.evolvesFrom != undefined) {
        wMessage = wMessage + "|Evolves from: " + cardData.evolvesFrom;
    }

    if (cardData.rules != undefined) {
        wMessage = wMessage + "|Rules: " + cardData.rules;
    }

    if (cardData.set != undefined) {
        wMessage = wMessage + "|Set: " + cardData.set.name;
    }


    if (cardData.artist != undefined) {
        wMessage = wMessage + "|Artist: " + cardData.artist;
    }

    if (cardData.rarity != undefined) {
        wMessage = wMessage + "|Rarity: " + cardData.rarity;
    }

    if (cardData.nationalPokedexNumbers != undefined) {
        let item = cardData.nationalPokedexNumbers
        wMessage = wMessage + "|National: "
        for (let i = 0; i < item.length; i++) {
            if (i > 0) {
                wMessage = wMessage + ", "
            }
            wMessage = wMessage + item[i]
        }
    }

    if (cardData.tcgplayer != undefined) {
        wMessage = wMessage + "|TGC Player Prices: " + cardData.tcgplayer.url.replaceAll(":", "¤")
    }

    if (cardData.cardmarket != undefined) {
        wMessage = wMessage + "|Cardmarket (Euro): " + cardData.cardmarket.url.replaceAll(":", "¤")
    }
    alert(colour + "|" + "Card:  " + toUpper(cardData.name) + "|" + wMessage)
}

function showDetails(parsedData, thisName) {
    const parent = document.getElementById("d30");
    const container = document.createElement("div")
    container.className = "details-container"

    let dataRow = document.createElement('div');
    dataRow.className = "details-row"
    let dataCell = document.createElement('div');
    dataCell.classList = "details-head"
    dataCell.innerText = "Types:  " + thisName;
    dataRow.appendChild(dataCell);
    container.appendChild(dataRow)
    let dataGrid = document.createElement('div');
    dataGrid.className = "details-grid"
    for (let i = 0; i < parsedData.types.length; i++) {
        const dataCell = document.createElement('div');
        dataCell.classList = "details-item"
        dataCell.classList.add("details-type")
        dataCell.textContent = toUpper(parsedData.types[i].type.name);
        dataCell.onclick = function () {
            getTypeData(parsedData.types[i].type.name, parsedData.types[i].type.url);
        }
        dataGrid.appendChild(dataCell);
    }
    container.appendChild(dataGrid)

    dataRow = document.createElement('div');
    dataRow.className = "details-row"
    dataCell = document.createElement('div');
    dataCell.classList = "details-head"
    dataCell.textContent = "Abilities";
    dataRow.appendChild(dataCell);
    container.appendChild(dataRow)
    dataGrid = document.createElement('div');
    dataGrid.className = "details-grid"
    for (let i = 0; i < parsedData.abilities.length; i++) {
        const dataCell = document.createElement('div');
        dataCell.classList = "details-item"
        dataCell.classList.add("details-ability")
        dataCell.textContent = toUpper(parsedData.abilities[i].ability.name)
        dataCell.onclick = function () {
            getAbilityData(parsedData.abilities[i].ability.name, parsedData.abilities[i].ability.url);
        }
        dataGrid.appendChild(dataCell);
    }
    container.appendChild(dataGrid)

    dataRow = document.createElement('div');
    dataRow.className = "details-row"
    dataCell = document.createElement('div');
    dataCell.classList = "details-head"
    dataCell.textContent = "Forms";
    dataRow.appendChild(dataCell);
    container.appendChild(dataRow)
    dataGrid = document.createElement('div');
    dataGrid.className = "details-grid"
    for (let i = 0; i < parsedData.forms.length; i++) {
        const dataCell = document.createElement('div');
        dataCell.classList = "details-item"
        dataCell.classList.add("details-form")
        dataCell.textContent = toUpper(parsedData.forms[i].name);
        dataCell.onclick = function () {
            getFormData(parsedData.forms[i].name, parsedData.forms[i].url);
        }
        dataGrid.appendChild(dataCell);
    }
    container.appendChild(dataGrid)

    dataRow = document.createElement('div');
    dataRow.className = "details-row"
    dataCell = document.createElement('div');
    dataCell.classList = "details-head"
    dataCell.textContent = "Game Index";
    dataRow.appendChild(dataCell);
    container.appendChild(dataRow)
    dataGrid = document.createElement('div');
    dataGrid.className = "details-grid"
    for (let i = 0; i < parsedData.game_indices.length; i++) {
        const dataCell = document.createElement('div');
        dataCell.classList = "details-item"
        dataCell.classList.add("details-game")
        dataCell.textContent = toUpper(parsedData.game_indices[i].version.name);
        dataCell.onclick = function () {
            getGameData(parsedData.game_indices[i].version.name, parsedData.game_indices[i].version.url);
        }
        dataGrid.appendChild(dataCell);
    }
    container.appendChild(dataGrid)
    parent.appendChild(container)
    showMoves(parsedData, thisName)
}

function showMoves(parsedData, thisName) {
    document.getElementById("d40").innerHTML = ""
    const parent = document.getElementById("d40");

    const container = document.createElement("div")
    container.className = "moves-container"

    let dataRow = document.createElement('div');
    dataRow.className = "details-row"
    let dataCell = document.createElement('div');
    dataCell.classList = "details-head"
    dataCell.innerText = "Moves:  " + thisName;
    dataRow.appendChild(dataCell);
    container.appendChild(dataRow)
    let moveTable = []
    for (let i = 0; i < parsedData.moves.length; i++) {
        moveTable.push({ name: parsedData.moves[i].move.name, url: parsedData.moves[i].move.url })
    }
    moveTable.sort((a, b) => a.name > b.name ? 1 : -1);
    let dataGrid = document.createElement('div');
    dataGrid.className = "moves-grid"
    for (let i = 0; i < moveTable.length; i++) {
        const dataCell = document.createElement('div');
        dataCell.className = "moves-item"
        dataCell.textContent = moveTable[i].name;
        dataCell.onclick = function () {
            getMoveData(moveTable[i].name, moveTable[i].url);
        }
        dataGrid.appendChild(dataCell);
    }
    container.appendChild(dataGrid)
    parent.appendChild(container)
}

async function getTypeData(name, url) {
    const response = await fetch(url);
    const parsedData = await response.json();
    const style = getComputedStyle(document.body)
    const colour = style.getPropertyValue('--type')
    let wItem = parsedData.damage_relations.double_damage_from;
    let wMessage = "Double damage from: "
    for (let i = 0; i < wItem.length; i++) {
        if (i > 0) {
            wMessage = wMessage + ", "
        }
        wMessage = wMessage + wItem[i].name
    }
    wItem = parsedData.damage_relations.double_damage_to
    wMessage = wMessage + "|Double damage to: "
    for (let i = 0; i < wItem.length; i++) {
        if (i > 0) {
            wMessage = wMessage + ", "
        }
        wMessage = wMessage + wItem[i].name
    }

    wItem = parsedData.damage_relations.half_damage_from
    wMessage = wMessage + "|Half damage from: "
    for (let i = 0; i < wItem.length; i++) {
        if (i > 0) {
            wMessage = wMessage + ", "
        }
        wMessage = wMessage + wItem[i].name
    }

    wItem = parsedData.damage_relations.half_damage_to
    wMessage = wMessage + "|Half damage to: "
    for (let i = 0; i < wItem.length; i++) {
        if (i > 0) {
            wMessage = wMessage + ", "
        }
        wMessage = wMessage + wItem[i].name
    }

    wItem = parsedData.damage_relations.no_damage_from
    wMessage = wMessage + "|No damage from: "
    for (let i = 0; i < wItem.length; i++) {
        if (i > 0) {
            wMessage = wMessage + ", "
        }
        wMessage = wMessage + wItem[i].name
    }

    wItem = parsedData.damage_relations.no_damage_to
    wMessage = wMessage + "|No damage to: "
    for (let i = 0; i < wItem.length; i++) {
        if (i > 0) {
            wMessage = wMessage + ", "
        }
        wMessage = wMessage + wItem[i].name
    }

    wItem = parsedData.game_indices
    wMessage = wMessage + "|Generation: "
    for (let i = 0; i < wItem.length; i++) {
        if (i > 0) {
            wMessage = wMessage + ", "
        }
        wMessage = wMessage + wItem[i].generation.name
    }

    wItem = parsedData.move_damage_class
    wMessage = wMessage + "|Move damage class: " + parsedData.move_damage_class.name;

    wItem = parsedData.moves
    wMessage = wMessage + "|Moves: "
    for (let i = 0; i < wItem.length; i++) {
        if (i > 0) {
            wMessage = wMessage + ", "
        }
        wMessage = wMessage + wItem[i].name;
    }

    alert(colour + "|" + "Type:  " + toUpper(name) + "|" + wMessage)
}
async function getAbilityData(name, url) {
    const response = await fetch(url);
    const parsedData = await response.json();
    const style = getComputedStyle(document.body)
    const colour = style.getPropertyValue('--ability')
    let wMessage = ""
    for (let i = 0; i < parsedData.effect_changes.length; i++) {
        for (let j = 0; j < parsedData.effect_changes[i].effect_entries.length; j++) {
            if (parsedData.effect_changes[i].effect_entries[j].language.name == "en") {
                wMessage = wMessage + "|Effect change: " + parsedData.effect_changes[i].effect_entries[j].effect;
            }
        }
    }
    for (let i = 0; i < parsedData.effect_entries.length; i++) {
        if (parsedData.effect_entries[i].language.name == "en") {
            wMessage = wMessage + "|Effect entry: " + parsedData.effect_entries[i].short_effect;
        }
    }
    alert(colour + "|" + "Ability:  " + toUpper(name) + "|" + wMessage)
}

async function getFormData(name, url) {
    const response = await fetch(url);
    const parsedData = await response.json();
    const style = getComputedStyle(document.body)
    const colour = style.getPropertyValue('--form')
    let wMessage = "Battle only: " + parsedData.is_battle_only;
    wMessage = wMessage + "|Default: " + parsedData.is_default;
    wMessage = wMessage + "|Mega: " + parsedData.is_mega;
    alert(colour + "|" + "Form:  " + toUpper(name) + "|" + wMessage)
}
async function getGameData(name, url) {
    const response = await fetch(url);
    const parsedData = await response.json();
    const style = getComputedStyle(document.body)
    const colour = style.getPropertyValue('--game')
    let wMessage = "Version group: " + parsedData.version_group.name;
    alert(colour + "|" + "Game:  " + toUpper(name) + "|" + wMessage)
}

async function getMoveData(name, url) {
    const response = await fetch(url);
    const parsedData = await response.json();
    const style = getComputedStyle(document.body)
    const colour = style.getPropertyValue('--move')
    let wMessage = "Damage Class: " + toUpper(parsedData.damage_class.name);
    for (let i = 0; i < parsedData.effect_entries.length; i++) {
        wMessage = wMessage + "|Effect Entry: " + parsedData.effect_entries[i].short_effect
            .replaceAll("\n", " ")
            .replaceAll("|", ";")
            .replaceAll("$effect_chance%", " ");
    }
    for (let i = 0; i < parsedData.effect_entries.length; i++) {
        if (parsedData.flavor_text_entries[i].language.name == "en") {
            wMessage = wMessage + "|Flavour Text: " + parsedData.flavor_text_entries[i].flavor_text
                .replaceAll("\n", " ")
                .replaceAll("|", ";");
        }
    }
    if (parsedData.power != undefined && parsedData.power != null) {
        wMessage = wMessage + "|Power: " + parsedData.power;
    }
    alert(colour + "|" + "Move:  " + toUpper(name) + "|" + wMessage)
}

function toUpper(str) {
    return (str[0].toUpperCase() + str.slice(1));
}

getPokemons();