"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"
import { useParams } from "next/navigation";
import { fetchPokemonByNameId } from "../../../utils/endpoint";
import { Undo2 } from "lucide-react";
import {
    pokemonPageLayout,
    titleStyle,
    returnButtonStyle,
    imgStyle,
    mainStyle,
    loadingPageStyle,
    returnHomeButtonStyle,
    headerStyle
} from "../../../utils/styles"


type PokemonStats = {
    base_stat: number;
    stat: {
        name: string;
    };

};

type Pokemon = {
    name: string;
    sprites: {
        front_default: string;
    };
    stats: PokemonStats[];
};


export default function Home() {
    const [pokemon, setPokemon] = useState<Pokemon>();
    const [pokemonStats, setPokemonStats] = useState<PokemonStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const params = useParams<{ id: string }>()
    const id = params.id;
    const pokemonName = pokemon?.name

    useEffect(() => {
        fetchPokemonByNameId(id).then((pokemonByName) => setPokemon(pokemonByName));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if(pokemon){
            setPokemonStats(pokemon.stats)
        }
    }, [pokemon]);

    console.log(pokemon, "pokemon")
    console.log(pokemonStats, "teste depois do fetch")

    return (
        <main className={mainStyle}
        > {/* formatar a página direito */}
            {isLoading && (
                <div className={loadingPageStyle}>
                    <img src="/loading.gif" alt="Loading..." />
                </div>
            )}
            <title>{pokemon?.name}</title>
            <header
            className={headerStyle}>
                <button
                    className={returnHomeButtonStyle}
                    onClick={() => router.push(`/`)}
                >home
                </button>
                <button
                    className={returnButtonStyle}
                    onClick={() => window.history.back()}
                ><Undo2 /></button>
                <h1 className={titleStyle}
                >{pokemonName}</h1>
            </header>
            {/* <div className={whiteBox}></div> */}
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
            </div>{/* colocar mais informações do pokemon, tipo, habilidades, peso, altura... */}
        </main>
    )

}
