import { cacheModalStyle } from "@/utils/styles";
import { FolderClock, X } from "lucide-react";
import { useCache } from "./cache-provider";
import { useCallback, useEffect, useRef } from "react";

export const CacheMenu = () => {
  const { showCacheMenu, showCache, getAllCache, clearCacheTypes, clearCachePokemonTypes, clearCachePokemon } = useCache();
  const cacheMenu = showCache();
  const cache = getAllCache();
  const cacheMenuRef = useRef(null)

  const handleClickOutside = useCallback((event: any) => {
    if (cacheMenuRef.current && !cacheMenuRef.current.contains(event.target)
    ) {
      showCacheMenu()
    }
  }, [cacheMenu])

  useEffect(() => {
    if (cacheMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside])


  return (
    <div className="absolute top-5 right-3 w-11 h-11">
      <div className="relative w-full h-full p-2">
        <button className="w-11 h-11" onClick={() => showCacheMenu()}>
          <FolderClock />
        </button>
        <div >
          {cacheMenu && (
            <div ref={cacheMenuRef}
              className={cacheModalStyle}>
              <li className="font-bold flex items-center gap-2">
                Types:
                <button
                  onClick={() => clearCacheTypes()}>
                  <X size={19} /></button>
              </li>
              <ul>
                {cache.types.map((type, i) => (
                  <li key={i}>{type.name}</li>
                ))}
              </ul>
              <li className="font-bold">
                Pokemons by types:
              </li>
              <ul>
                {Object.entries(cache.pokemonsByType).map(([typeId, pokemons]) =>
                  <li className="flex items-center gap-3 items-start mt-5"
                    key={typeId}>
                    <button
                      onClick={() => {
                        clearCachePokemonTypes(typeId)
                      }}
                    ><X size={19} /></button>
                    <strong>Id {typeId}:</strong>
                    <ul className="ml-4 list-disc">
                      {pokemons.map((pokemon, Id) => (
                        <p key={Id}>
                          {pokemon.name}
                        </p>
                      ))}
                    </ul>
                  </li>
                )}
              </ul>
              <li className="font-bold">
                Pokemons:
              </li>
              <ul>
                {Object.entries(cache.fullPokemon).map(([id, pokemon]) => (
                  <li className="flex items-center gap-2"
                    key={id}>
                    <button onClick={() => {
                      clearCachePokemon(id)
                    }}
                    ><X size={19} /></button>
                    <strong>Id {id}: </strong> {pokemon.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
