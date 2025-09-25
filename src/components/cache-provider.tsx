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
  PokemonByType,
} from "../utils/endpoint";

interface CacheContextValue {
  getTypes: () => Promise<PokemonType[]>;
  getPokemonsType: (id: number) => Promise<PokemonByType[]>;
  getPokemon: (id: string) => Promise<Pokemon>;
  showCacheMenu: () => any;
  getAllCache: () => any;
  showCache: () => any;
  clearCacheTypes: () => void;
  clearCachePokemonTypes: (id: number) => void;
  clearCachePokemon: (id: number) => void;
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
  const [cacheMenu, setCacheMenu] = useState(false);
  const [customCache, setCustomCache] = useState<CustomCache>(initalCache);

  const showCacheMenu = () => {
    setCacheMenu((prev) => !prev);
  };

  const getAllCache = useCallback(() => {
    return customCache;
  }, [customCache]);

  const showCache = useCallback(() => {
    return cacheMenu;
  }, [cacheMenu]);

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

  const clearCacheTypes = () => {
    const types: any = []
    setCustomCache((prev) => {
      return {
        ...prev,
        types,
      };
    });
  }

  const clearCachePokemon = (id: string) => {
    setCustomCache((prev) => {
      const newFullPokemon = { ...prev.fullPokemon }
      delete newFullPokemon[id]
      return {
        ...prev,
        fullPokemon: newFullPokemon
      };
    });
  }

  const clearCachePokemonTypes = (id: number) => {
    setCustomCache((prev) => {
      const newPokemonTypes = { ...prev.pokemonsByType }
      delete newPokemonTypes[id]
      return {
        ...prev,
        pokemonsByType: newPokemonTypes
      };
    });
  }

  const value = useMemo(() => {
    return {
      getTypes,
      getPokemonsType,
      getPokemon,
      showCacheMenu,
      getAllCache,
      showCache,
      clearCacheTypes,
      clearCachePokemonTypes,
      clearCachePokemon
    };
  }, [customCache, cacheMenu]);

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