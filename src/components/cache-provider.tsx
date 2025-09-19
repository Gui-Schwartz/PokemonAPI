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
  PokemonByType,
} from "../utils/endpoint";

interface CacheContextValue {
  getTypes: () => Promise<PokemonType[]>;
  getPokemonsType: (id: number) => Promise<PokemonByType[]>;
  getPokemon: (id: string) => Promise<Pokemon>;
}

type CustomCache = {
  types: PokemonType[];
  pokemonsByType: Record<number, PokemonByType[]>;
  fullPokemon: Record<number, Pokemon>;
};

const CacheContext = createContext<CacheContextValue | undefined>(undefined);

interface CacheProviderProps {
  children: ReactNode;
}

const initalCache: CustomCache = {
  types: [],
  pokemonsByType: {},
  fullPokemon: {},
};
export const CacheProvider = ({ children }: CacheProviderProps) => {
  const [cacheTypesPage, setCacheTypesPage] = useState<PokemonType[]>([]);
  const [cachePokemonsTypesPage, setCachePokemonsTypesPage] = useState<
    PokemonTypes[]
  >([]);
  const [cachePokemon, setCachePokemon] = useState<Pokemon[]>([]);
  const [customCache, setCustomCache] = useState<CustomCache>(initalCache);

  const getTypes = useCallback(async () => {
    if (customCache["types"].length !== 0) return customCache["types"];
    const types = await fetchTypes();
    setCustomCache((prev) => {
      return {
        ...prev,
        types,
      };
    });
    return types;
  }, [customCache]);

  const getPokemonsType = useCallback(
    async (id: number) => {
      const cached = customCache["pokemonsByType"][id];
      if (cached) {
        return cached;
      }
      const pokemonTypes = await fetchPokemonsByType(id);
      setCustomCache((prev) => {
        return {
          ...prev,
          pokemonsByType: {
            ...prev.pokemonsByType,
            [id]: pokemonTypes.pokemons,
          },
        };
      });
      return pokemonTypes.pokemons;
    },
    [customCache]
  );

  const getPokemon = useCallback(
    async (id: string) => {
      const cache = customCache["fullPokemon"][Number(id)];
      if (cache) {
        return cache;
      }
      const pokemon = await fetchPokemonByNameId(id);
      setCustomCache((prev) => {
        return {
          ...prev,
          fullPokemon: {
            ...prev.fullPokemon,
            [id]: pokemon,
          },
        };
      });
      return pokemon;
    },
    [customCache]
  );

  const value = useMemo(() => {
    return {
      getTypes,
      getPokemonsType,
      getPokemon,
    };
  }, [customCache]);

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

// ter um botão com ícone do lucide que mostra o cache, num quadrinho da IU

// const cache = {
//   types: [{}, {}, {}],
//   pokemonsByType: {
//     1: [{}, {}, {}],
//     2: [{}, {}, {}],
//   },
//   fullPokemon: {
//     1: {},
//   },
// };
