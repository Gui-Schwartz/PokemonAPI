const POKEMON_URL = "https://pokeapi.co/api/v2";
const types = `${POKEMON_URL}/type`;
const type = (id: number) => `${types}/${id}`;
const pokemon = (id: string) => `${POKEMON_URL}/pokemon/${id}`;

type PokemonType = {
    name: string;
    url: string;
}

type PokemonTypes = {
    id: number;
    pokemons: {
        pokemon: {
            name: string;
            url: string;
        }
    }[]
}

export type PokemonStats = {
    base_stat: number;
    stat: {
        name: string;
    };

};

export type Pokemon = {
    name: string;
    sprites: {
        front_default: string;
    };
    stats: PokemonStats[];
    id: number;
};

export let cacheTypesPage:PokemonType[] = []

export let cachePokemonsTypesPage: PokemonTypes[] = []

export let cachePokemon: Pokemon[] = [];

export const setCacheTypes = (value: PokemonType[]) => {
    cacheTypesPage = value;
}
export const getCacheTypes = (): PokemonType[] => {
    return cacheTypesPage
}

export const setCachePokemonTypesPage = (value: PokemonTypes) => { 
    cachePokemonsTypesPage.push(value)
}

export const getCachePokemonsTypesPage = (): PokemonTypes[] => {
    console.log(cachePokemonsTypesPage)
    return cachePokemonsTypesPage
}

export const iCanFetchPokemon = (id: number) => {
    if (cachePokemon.find((page) => page.id === (id))) {
        return cachePokemonsTypesPage
    } else {
        return
    }
}

export const setCachePokemon = (value: Pokemon) => {
    const checkIncludesFetch = iCanFetchPokemon(value.id)
    if (checkIncludesFetch) {
        return
    } else {
        cachePokemon.push(value)
    }
}

export const getCachePokemon = (): Pokemon[] => {
    return cachePokemon
}

export const fetchPokemonByNameId = async (id: string) => {
    const cache = cachePokemon.find(pokemon => pokemon.id === Number(id))
    if (cache) {
        return cache
    }
    const response = await fetch(pokemon(id));
    const pokemonByName = await response.json()
    setCachePokemon({
        name: pokemonByName.name,
        sprites: pokemonByName.sprites,
        stats: pokemonByName.stats,
        id: pokemonByName.id
    })
    return pokemonByName;
}

export const fetchTypes = async () => {
    if (cacheTypesPage.length !== 0) {
        return cacheTypesPage;
    }
    const response = await fetch(types);
    const data = await response.json()
    setCacheTypes(data.results);
    return data.results;
}

export const fetchPokemonsByType = async (id: number) => {
    const cached = cachePokemonsTypesPage.find(page => page.id === id)
    if (cached) {
        return cached.pokemons
    }
    const response = await fetch(type(id));
    const dataPokemons = await response.json()
    const pokemonsByType = {
        id: id,
        pokemons: dataPokemons.pokemon,
    }
    setCachePokemonTypesPage(pokemonsByType)
    return pokemonsByType.pokemons;
}