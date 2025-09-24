import { cacheButtonStyle, cacheModalStyle, modalStyle } from "@/utils/styles";
import { FolderClock } from "lucide-react";
import { useCache } from "./cache-provider";
import { useCallback, useEffect, useRef } from "react";
import { checkFetch } from "@/utils/check-fetch";


export const CacheMenu = () => {
  const { showCacheMenu, showCache, getAllCache } = useCache();
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
      document.addEventListener("mousedown", handleClickOutside); //sim, copiei da calculadora
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside])
  console.log(Object.entries(cache.pokemonsByType))
  // padding total, ter o id informando de qual tipo é, padding para isso tb


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
              <li className="font-bold">
                Types:
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
                {Object.values(cache.pokemonsByType).map((pokemons, id) =>
                  <li key={id}>
                    <strong>Id {id}:</strong>
                    <ul className="ml-4 list-disc">
                      {pokemons.map((pokemon) => (
                        <ul key={checkFetch(pokemon.url)}>
                          {pokemon.name}
                        </ul>
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
                  <li key={id}>
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
