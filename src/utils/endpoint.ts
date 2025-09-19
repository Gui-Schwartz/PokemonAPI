const POKEMON_URL = "https://pokeapi.co/api/v2";
const types = `${POKEMON_URL}/type`;
const type = (id: number) => `${types}/${id}`;
const pokemon = (id: string) => `${POKEMON_URL}/pokemon/${id}`;

export type PokemonType = {
    name: string;
    url: string;
}

export type PokemonTypes = {
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

export const fetchPokemonByNameId = async (id: string) => {
    const response = await fetch(pokemon(id));
    const pokemonByName = await response.json()
    return pokemonByName;
}

export const fetchTypes = async () => {
    const response = await fetch(types);
    const data = await response.json()
    return data.results;
}

export const fetchPokemonsByType = async (id: number) => {
    const response = await fetch(type(id));
    const dataPokemons = await response.json()
    const pokemonsByType = {
        id: id,
        pokemons: dataPokemons.pokemon,
    }
    return pokemonsByType;
}