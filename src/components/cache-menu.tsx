import { cacheModalStyle } from "@/utils/styles";
import { FolderClock, X, Pencil, Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const CacheMenu = () => {
  const queryClient = useQueryClient();
  const [typeEdit, setTypeEdit] = useState<string | null>(null);
  const [inputTypeValue, setInputTypeValue] = useState("");
  const [pokemonByTypeEdid, setPokemonByTypeEdid] = useState<string | null>(
    null
  );
  const [inputPokemonByTypeValue, setPokemonByInputTypeValue] = useState("");
  const [pokemonEdit, setPokemonEdit] = useState<string | null>(null);
  const [inputPokemon, setInputPokemon] = useState("");
  const [showCacheMenus, setShowCacheMenus] = useState(false);

  const queries = queryClient.getQueryCache().getAll();

  const allData = queries.map((query) => ({
    queryKey: query.queryKey,
    data: query.state.data,
  }));

  const typesQuery = allData.find((q) => q.queryKey[0] === "types");

  const pokemonsByTypeQuerie = allData.filter(
    (q) => q.queryKey[0] === "pokemonByType"
  );
  const pokemonQuerie = allData.filter((q) => q.queryKey[0] === "pokemon");

  const cacheMenuRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback(
    (event: any) => {
      if (
        cacheMenuRef.current &&
        !cacheMenuRef.current.contains(event.target)
      ) {
        setShowCacheMenus((prev) => !prev);
      }
    },
    [allData]
  );

  useEffect(() => {
    if (allData) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="absolute top-5 right-3 w-11 h-11">
      <div className="relative w-full h-full p-2">
        <button
          className="w-11 h-11"
          onClick={() => {
            setShowCacheMenus((prev) => !prev);
            console.log("typesQuery", typesQuery);
          }}
        >
          <FolderClock />
        </button>
        <div>
          {showCacheMenus && (
            <div ref={cacheMenuRef} className={cacheModalStyle}>
              <li className="font-bold flex items-center gap-2">
                Types:
                <button
                  onClick={() =>
                    queryClient.invalidateQueries({ queryKey: ["types"] })
                  }
                >
                  <X size={19} />
                </button>
              </li>
              <ul>
                {typesQuery?.data?.map((type: any, j: any) => (
                  <li key={j}>
                    {type.name}
                    <button
                      onClick={() => {
                        setTypeEdit(type.name);
                        setInputTypeValue(type.name);
                      }}
                    >
                      <Pencil size={15} />
                    </button>
                    {typeEdit === type.name && (
                      <div>
                        <input
                          name={type.name}
                          type="text"
                          value={inputTypeValue}
                          onChange={(e) => setInputTypeValue(e.target.value)}
                        />
                        <button
                          onClick={() => {
                            queryClient.setQueryData(["types"], (prev: any[]) =>
                              prev?.map((t) =>
                                t.name === type.name
                                  ? { ...t, name: inputTypeValue }
                                  : t
                              )
                            );
                            setInputTypeValue("");
                            setTypeEdit(null);
                          }}
                        >
                          <Check />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <li className="font-bold flex items-center gap-2">
                Pokemons by types:
                <button
                  onClick={() =>
                    queryClient.invalidateQueries({
                      queryKey: ["pokemonByType"],
                    })
                  }
                >
                  <X size={19} />
                </button>
              </li>
              <ul>
                {pokemonsByTypeQuerie.map((entry: any, i) => {
                  const typeId = entry.queryKey[1];
                  return (
                    <li className="flex items-start gap-3 mt-5" key={typeId}>
                      <button
                        onClick={() => {
                          setPokemonByTypeEdid(entry.data.name);
                          setInputTypeValue(entry.data.name);
                        }}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() =>
                          queryClient.invalidateQueries({
                            queryKey: ["pokemonByType", String(typeId)],
                          })
                        }
                      >
                        <X size={19} />
                      </button>

                      <strong>Id {typeId}:</strong>
                      <ul className="ml-4 list-disc">
                        {entry.data?.pokemons?.map((pokemon: any, idx: any) => (
                          <li key={pokemon.id || idx}>
                            {pokemon.name}
                            <button
                              onClick={() => setPokemonByTypeEdid(pokemon.name)}
                            >
                              <Pencil size={15} />
                            </button>
                            {pokemonByTypeEdid === pokemon.name && (
                              <div>
                                <input
                                  name={pokemon.name}
                                  type="text"
                                  value={inputPokemonByTypeValue}
                                  onChange={(e) =>
                                    setPokemonByInputTypeValue(e.target.value)
                                  }
                                />
                                <button
                                  onClick={() => {
                                    queryClient.setQueryData(
                                      ["pokemonByType", String(typeId)],
                                      (prev: any) => {
                                        if (!prev) return prev;
                                        return {
                                          ...prev,
                                          pokemons: prev.pokemons.map((p) =>
                                            p.name === pokemon.name
                                              ? {
                                                  ...p,
                                                  name: inputPokemonByTypeValue,
                                                }
                                              : p
                                          ),
                                        };
                                      }
                                    );
                                    setPokemonByInputTypeValue("");
                                    setPokemonByTypeEdid(null);
                                  }}
                                >
                                  <Check />
                                </button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
              <li className="font-bold flex items-center gap-2">
                Pokemons:
                <button
                  onClick={() =>
                    queryClient.invalidateQueries({ queryKey: ["pokemon"] })
                  }
                >
                  <X size={19} />
                </button>
              </li>
              <ul>
                {pokemonQuerie.map((entry: any, i) => {
                  if (!entry.data) return null;

                  return (
                    <li key={entry.data.id} className="flex items-center gap-2">
                      <strong>Id {entry.data.id}:</strong> {entry.data.name}
                      <button
                        onClick={() => {
                          queryClient.invalidateQueries({
                            queryKey: ["pokemon", String(entry.data.id)],
                          });
                        }}
                      >
                        <X size={19} />
                      </button>
                      <button onClick={() => setPokemonEdit(entry.data.name)}>
                        <Pencil size={15} />
                      </button>
                      {pokemonEdit === entry.data.name && (
                        <div className="ml-2">
                          <input
                            type="text"
                            value={inputPokemon}
                            onChange={(e) => setInputPokemon(e.target.value)}
                          ></input>
                          <button
                            onClick={() => {
                              queryClient.setQueryData(
                                ["pokemon", String(entry.data.id)],
                                (prev: any) =>
                                  prev ? { ...prev, name: inputPokemon } : prev
                              );
                              setInputPokemon("");
                              setPokemonEdit(null);
                            }}
                          >
                            <Check />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
