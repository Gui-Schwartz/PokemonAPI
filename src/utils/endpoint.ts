const POKEMON_URL = "https://pokeapi.co/api/v2";
const types = `${POKEMON_URL}/type`;
const type = (id: number) => `${types}/${id}`;
const pokemon = (id: string) => `${POKEMON_URL}/pokemon/${id}`;

import { WindArrowDown } from "lucide-react";
import { checkFetch } from "../utils/check-fetch"


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


type PokemonType = {
    name: string;
    url: string;
}

type PokemonTypes = {
    url: string;
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


export let cacheTypesPage = []

export let cachePokemonsTypesPage: PokemonTypes[] = []

export let cachePokemon:Pokemon[] = [];


export const setCacheTypes = (value: PokemonType[]) => {
    cacheTypesPage = value;
}
export const getCacheTypes = (): PokemonType[] => {
    return cacheTypesPage
}

export const iCanFetch = () => {
    if (cachePokemonsTypesPage.find((page) => page.url.includes(window.location.href))) {
        return cachePokemonsTypesPage
    } else {
        return
    }
}

export const setCachePokemonTypesPage = (value: PokemonTypes) => { //mexer aqui e ver se já tem o item 
    const checkIncludesFetch = iCanFetch()
    if (checkIncludesFetch) {
        return
    } else {
        cachePokemonsTypesPage.push(value)
    }
}

export const getCachePokemonsTypesPage = (): PokemonTypes[] => {
    console.log(cachePokemonsTypesPage)
    return cachePokemonsTypesPage
}

export const iCanFetchPokemon = (id:number) => {
    if (cachePokemon.find((page) => page.id === (id))) {
        return cachePokemonsTypesPage
    } else {
        return
    }
}

export const setCachePokemon = (value:Pokemon) => {
    const checkIncludesFetch = iCanFetchPokemon(value.id)
    if (checkIncludesFetch) {
        return
    } else {
        cachePokemon.push(value)
    }
}

export const getCachePokemon = ():Pokemon[] =>{
    return cachePokemon
}
