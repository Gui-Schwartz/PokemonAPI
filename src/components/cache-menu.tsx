import { cacheModalStyle } from "@/utils/styles";
import { FolderClock, X, Pencil, Check } from "lucide-react";
import { useCache } from "./cache-provider";
import { useCallback, useEffect, useRef, useState } from "react";

export const CacheMenu = () => {
  const { editCache, showCacheMenu, showCache, getAllCache, clearCache} = useCache();
  const [typeEdit, setTypeEdit] = useState<string | null>(null)
  const [inputTypeValue, setInputTypeValue] = useState("")
  const [PokemonByTypeEdid, setPokemonByTypeEdid] = useState<string | null>(null)
  const [inputPokemonByTypeValue, setPokemonByInputTypeValue] = useState("")
  const [pokemonEdit, setPokemonEdit] = useState<string | null>(null)
  const [inputPokemon, setInputPokemon] = useState("")
  const cacheMenu = showCache();
  const cache = getAllCache();
  const cacheMenuRef = useRef<HTMLDivElement| null>(null)

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
                  onClick={() => clearCache('types')}>
                  <X size={19} /></button>
              </li>
              <ul>
                {cache.types && cache.types.map((type, i) => (
                  <li key={i}>{type.name}
                    <button
                      key={i}
                      onClick={() => setTypeEdit(type.name)}
                    > <Pencil size={15} /></button>
                    {typeEdit === type.name ? (
                      <div>
                        <input
                          name={type.name}
                          type="text"
                          value={inputTypeValue}
                          onChange={(e) => setInputTypeValue(e.target.value)}
                        >
                        </input>
                        <button
                          onClick={() => {
                            editCache(prev => ({
                              ...prev,
                              types: prev.types?.map((t, i) => i === i ? { ...t, name: inputTypeValue } : t)
                            }))
                            setInputTypeValue("")
                            setTypeEdit(null)
                          }}>
                          <Check />
                        </button>
                      </div>)
                      : undefined}
                  </li>
                ))}
              </ul>
              <li className="font-bold">
                Pokemons by types:
              </li>
              <ul>
                {cache.pokemonsByType &&
                  Object.entries(cache.pokemonsByType).map(([typeId, pokemons]) => (
                    <li className="flex items-start gap-3 mt-5" key={typeId}>
                      <button
                        onClick={() => clearCache(`pokemonsByType.${typeId}`)}
                      >
                        <X size={19} />
                      </button>
                      <strong>Id {typeId}:</strong>
                      <ul className="ml-4 list-disc">
                        {pokemons.map((pokemon, Id) => (
                          <li key={Id}>
                            {pokemon.name}
                            <button
                              onClick={() => setPokemonByTypeEdid(pokemon.name)}
                            >
                              <Pencil size={15} />
                            </button>
                            {PokemonByTypeEdid === pokemon.name ? (
                              <div>
                                <input
                                  name={pokemon.name}
                                  type="text"
                                  value={inputPokemonByTypeValue}
                                  onChange={(e) => setPokemonByInputTypeValue(e.target.value)}
                                />
                                <button
                                  onClick={() => {
                                    editCache(prev=>({
                                      ...prev,
                                      pokemonsByType: {
                                        ...prev.pokemonsByType,
                                        [typeId]: prev.pokemonsByType ? prev.pokemonsByType[Number(typeId)].map((p, i) => i === Id ? { ...p, name: inputPokemonByTypeValue } : p) : []
                                      }
                                    }))
                                    setPokemonByInputTypeValue("");
                                    setPokemonByTypeEdid(null);
                                  }}
                                >
                                  <Check />
                                </button>
                              </div>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
              </ul>
              <li className="font-bold">
                Pokemons:
              </li>
              <ul>
                {cache.fullPokemon && Object.entries(cache.fullPokemon).map(([id, pokemon]) => (
                  <li className="flex items-center gap-2"
                    key={id}>
                    <button onClick={() => {
                      clearCache(`fullPokemon.${id}` )
                      console.log(id, `id`)
                    }}
                    ><X size={19} /></button>
                    <strong>Id {id}: </strong> {pokemon.name}
                    <button
                      onClick={() => setPokemonEdit(pokemon.name)}
                    >
                      <Pencil size={15} />
                    </button>
                    {pokemonEdit === pokemon.name ? (
                              <div>
                                <input
                                  name={pokemon.name}
                                  type="text"
                                  value={inputPokemon}
                                  onChange={(e) => setInputPokemon(e.target.value)}
                                />
                                <button
                                  onClick={() => {
                                    editCache(prev=> {
                                      if(!prev.fullPokemon) return prev;
                                        return {
                                          ...prev,
                                          fullPokemon: {
                                            ...prev.fullPokemon,
                                            [Number(id)]: { ...prev.fullPokemon[Number(id)], name: inputPokemon }
                                            }
                                    }})
                                    setInputPokemon("");
                                    setPokemonEdit(null);
                                  }}
                                >
                                  <Check />
                                </button>
                              </div>
                            ) : null}
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