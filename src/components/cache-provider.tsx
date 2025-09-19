import {
  createContext,
  ReactNode,
  useMemo,
  useState,
  useContext,
  useCallback,
} from "react";

import {
  fetchPokemonByNameId,
  fetchPokemonsByType,
  fetchTypes,
  Pokemon,
  PokemonType,
  PokemonTypes,
} from "../utils/endpoint";

interface CacheContextValue {
  getTypes: () => Promise<PokemonType[]>;
  getPokemonsType: (id: number) => Promise<PokemonTypes>;
  getPokemon: (id: string) => Promise<Pokemon>;
}

const CacheContext = createContext<CacheContextValue | undefined>(undefined);

interface CacheProviderProps {
  children: ReactNode;
}

export const CacheProvider = ({ children }: CacheProviderProps) => {
  const [cacheTypesPage, setCacheTypesPage] = useState<PokemonType[]>([]);
  const [cachePokemonsTypesPage, setCachePokemonsTypesPage] = useState<
    PokemonTypes[]
  >([]);
  const [cachePokemon, setCachePokemon] = useState<Pokemon[]>([]);

  const getTypes = useCallback(async () => {
    if (cacheTypesPage.length !== 0) return cacheTypesPage;
    const types = await fetchTypes();
    setCacheTypesPage(types);
    return types;
  }, [cacheTypesPage]);

  const getPokemonsType = useCallback(
    async (id: number) => {
      const cached = cachePokemonsTypesPage.find((page) => page.id === id);
      console.log(cached, "cahed");
      if (cached) {
        return cached.pokemons;
      }
      const pokemonTypes = await fetchPokemonsByType(id);
      setCachePokemonsTypesPage([...cachePokemonsTypesPage, pokemonTypes]);
      return pokemonTypes.pokemons;
    },
    [cachePokemonsTypesPage]
  );

  const getPokemon = useCallback(
    async (id: string) => {
      const cache = cachePokemon.find((pokemon) => pokemon.id === Number(id));
      if (cache) {
        return cache;
      }
      const pokemon = await fetchPokemonByNameId(id);
      setCachePokemon([...cachePokemon, pokemon]);
      return pokemon;
    },
    [cachePokemon]
  );

  const value = useMemo(() => {
    return {
      getTypes,
      getPokemonsType,
      getPokemon,
    };
  }, [cacheTypesPage, cachePokemonsTypesPage, cachePokemon]);

  return (
    <CacheContext.Provider value={value}>{children}</CacheContext.Provider>
  );
};

export const useCache = () => {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error("Não tem pão velho ");
  }
  return context;
};
