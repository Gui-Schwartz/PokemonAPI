"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { Undo2 } from "lucide-react";
import { Pokemon, PokemonStats } from "../../../utils/endpoint";
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

export default function Home() {
  const { getPokemon } = useCache();
  const [pokemon, setPokemon] = useState<Pokemon>();
  const [pokemonStats, setPokemonStats] = useState<PokemonStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const pokemonName = pokemon?.name;

  useEffect(() => {
    getPokemon(id).then((pokemonByName) => {
      setPokemon(pokemonByName);
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (pokemon) {
      setPokemonStats(pokemon.stats);
    }
  }, [pokemon]);

  return (
    <main className={mainStyle}>
      {isLoading && (
        <div className={loadingPageStyle}>
          <img src="/loading.gif" alt="Loading..." />
        </div>
      )}
      <title>{pokemon?.name}</title>
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
          {pokemon && pokemon.sprites && pokemon.sprites.front_default && (
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          )}
        </div>
        <div>
          <h1 className="font-bold">Base stats:</h1>
          {pokemonStats.map((i) => (
            <p key={i.stat.name}>
              {i.stat.name}: {i.base_stat}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
