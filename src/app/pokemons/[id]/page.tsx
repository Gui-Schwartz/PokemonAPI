"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Undo2, Pencil, Check } from "lucide-react";
import {
  pokemonPageLayout,
  titleStyle,
  returnButtonStyle,
  imgStyle,
  mainStyle,
  loadingPageStyle,
  returnHomeButtonStyle,
  headerStyle,
} from "../../../utils/styles";
import { useCache } from "@/components/cache-provider";
import { useQuery } from "@tanstack/react-query";
import { fetchPokemonByNameId } from "@/utils/endpoint";

export default function Home() {
  const { editCache } = useCache();
  const [pokemonEditStats, setPokemonEditStats] = useState<string | null>(null);
  const [inputPokemonStats, setInputPokemonStats] = useState("");
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isLoading } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: ({ queryKey }) => {
      const [_key, id] = queryKey;
      return fetchPokemonByNameId(id);
    },
  });

  const pokemon = data;
  const pokemonStats = pokemon?.stats || [];
  const pokemonName = data?.name;

  return (
    <main className={mainStyle}>
      {isLoading && (
        <div className={loadingPageStyle}>
          <img src="/loading.gif" alt="Loading..." />
        </div>
      )}
      <title>{pokemonName}</title>
      <header className={headerStyle}>
        <button
          className={returnHomeButtonStyle}
          onClick={() => router.push(`/`)}
        >
          home
        </button>
        <button
          className={returnButtonStyle}
          onClick={() => window.history.back()}
        >
          <Undo2 />
        </button>
        <h1 className={titleStyle}>{pokemonName}</h1>
      </header>
      <div className={pokemonPageLayout}>
        <div className={imgStyle}>
          {pokemon?.sprites?.front_default && (
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          )}
        </div>
        <div>
          <h1 className="font-bold">Base stats:</h1>
          {pokemonStats.length > 0
            ? pokemonStats.map((s: any) => (
                <li key={s.stat.name} className="flex items-center gap-2">
                  {s.stat.name}: {s.base_stat}
                  <button onClick={() => setPokemonEditStats(s.stat.name)}>
                    <Pencil size={15} />
                  </button>
                  {pokemonEditStats === s.stat.name && (
                    <div>
                      <input
                        type="number"
                        value={inputPokemonStats}
                        onChange={(e) => setInputPokemonStats(e.target.value)}
                      />
                      <button
                        onClick={() => {
                          editCache((prev) => {
                            const key = Number(id);

                            if (!prev.fullPokemon || !prev.fullPokemon[key])
                              return prev;
                            const targetPokemon = prev.fullPokemon[key];

                            return {
                              ...prev,
                              fullPokemon: {
                                ...prev.fullPokemon,
                                [key]: {
                                  ...targetPokemon,
                                  stats: targetPokemon.stats.map((s) =>
                                    s.stat.name === s.stat.name
                                      ? {
                                          ...s,
                                          base_stat: Number(inputPokemonStats),
                                        }
                                      : s
                                  ),
                                },
                              },
                            };
                          });
                          setInputPokemonStats("");
                          setPokemonEditStats(null);
                        }}
                      >
                        <Check />
                      </button>
                    </div>
                  )}
                </li>
              ))
            : null}
        </div>
      </div>
    </main>
  );
}
