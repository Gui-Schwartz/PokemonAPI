import { cacheButtonStyle, cacheModalStyle, modalStyle } from "@/utils/styles";
import { useCache } from "./cache-provider";
import { FolderClock } from "lucide-react";
//botar um Li para as listas com a bolinha em cada item, ter título tb types.. pokemons by type, full pokemons

export const CacheMenu = () => {
  const { showCacheMenu, showCache, getAllCache } = useCache();
  const cacheMenu = showCache();
  const cache = [getAllCache()];
  return (
    <div className="absolute top-5 right-3 w-11 h-11">
      <div className="relative w-full h-full">
        <button className="w-11 h-11" onClick={() => showCacheMenu()}>
          <FolderClock />
        </button>
        <div>
          {cacheMenu &&
            cache.map((item, index) => (
              <div key={index} className={cacheModalStyle}>
                <div>
                  <p>{JSON.stringify(item.fullPokemon)}</p>
                  <p>{JSON.stringify(item.pokemonsByType)}</p>
                  <p>{JSON.stringify(item.types)}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
