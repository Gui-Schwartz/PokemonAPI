const POKEMON_URL = "https://pokeapi.co/api/v2";
const types = `${POKEMON_URL}/type`;
const type = (id:number) => `${types}/${id}`;
const pokemon = (id:string) => `${POKEMON_URL}/pokemon/${id}`;

export const fetchTypes = async () => {
    const pokemonTypes = []
    const response = await fetch(types);
    const data = await response.json()

    return data.results;
}

export const fetchPokemonsByType = async (id: number) => {
    const response = await fetch(type(id));
    const dataPokemons = await response.json() 

    return dataPokemons.pokemon;
}

export const fetchPokemonByNameId = async (id: string) => {
    const response = await fetch(pokemon(id));
    const pokemonByName = await response.json()

    return pokemonByName;
}

export let typesPage = fetchTypes().then()
//criar um local storage que grava um arquivo local, e  verifica se o arquivo é maior que 5 minutos, se sim faz um novo fetch,
//documentação?
