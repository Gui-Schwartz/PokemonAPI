"use client";

import { useRouter, useParams } from "next/navigation";
import { checkFetch } from "../../../utils/check-fetch";
import { Undo2 } from "lucide-react";
import {
  pageLayout,
  pokemonButtonStyle,
  loadingPageStyle,
  returnButtonStyle,
  headerStyle,
  mainStyle,
} from "../../../utils/styles";
import { useQuery } from "@tanstack/react-query";
import { fetchPokemonsByType } from "@/utils/endpoint";
import { queryKeys } from "@/utils/queryKeys";

export default function Home() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.type(id),
    queryFn: ({ queryKey }) => {
      const [_key, id] = queryKey;
      return fetchPokemonsByType(Number(id));
    },
  });

  return (
    <>
      <main className={mainStyle}>
        {isLoading && (
          <div className={loadingPageStyle}>
            <img src="/loading.gif" alt="Loading..." />
          </div>
        )}
        <header className={headerStyle}>
          <button
            className={returnButtonStyle}
            onClick={() => window.history.back()}
          >
            <Undo2 />
          </button>
          <title className="text-4xl font-bold col-span-4 text-center">
            Pokemon's Page
          </title>
          <h1 className="text-4xl font-bold col-span-4 text-center">
            Welcome to Pokemon's Page
          </h1>
        </header>
        <div className={pageLayout}>
          {data?.pokemons.map((pokemon) => {
            const id = checkFetch(pokemon.url);
            return (
              <div key={id} className="flex justify-center items-center">
                <button
                  className={pokemonButtonStyle}
                  onClick={() => {
                    router.push(`/pokemons/${id}`);
                  }}
                >
                  {pokemon.name}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
