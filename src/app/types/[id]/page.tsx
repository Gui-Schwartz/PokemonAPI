"use client"

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react"
import { checkFetch } from "../../../utils/check-fetch";
import { Undo2 } from "lucide-react";
import { fetchPokemonsByType, 
  getCachePokemonsTypesPage, 
  setCachePokemonTypesPage,
  iCanFetch 
} from "../../../utils/endpoint";
import {
  pageLayout,
  pokemonButtonStyle,
  loadingPageStyle,
  returnButtonStyle,
  headerStyle,
  mainStyle
} from "../../../utils/styles"


type PokemonType = {
  pokemon: {
    name: string;
    url: string;
  }
}
//fazer o fetch para buscar a foto do pokemon e colocar acima do botão, deixar o botão menor
//mexer na página do pokemon para ficar mais bonito e colocar mais informacões  


export default function Home() {
  const [pokemons, setPokemons] = useState<PokemonType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ id: string; }>()
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    //Fazer o teste do array e os caralho dentro do endpoint antes de fazer o fetch e ai sim chamar a função 
    const cacheTypesPage = getCachePokemonsTypesPage()
    const checkCache = iCanFetch()
    if (!checkCache){
      fetchPokemonsByType(id).then((dataPokemons) => {
        setPokemons(dataPokemons) 
        setCachePokemonTypesPage({
          pokemons: dataPokemons,
          url: window.location.href
        }) 
        console.log(dataPokemons, "pokemons, dentro do if, com fetch ")
      })
    }else {
      const pokemons1 = cacheTypesPage.flatMap(page => page.pokemons) 
      
      setPokemons(pokemons1)
      console.log(cacheTypesPage, "cacheTypesPage do else, com o cache")
    }
    setIsLoading(false);
  }, []);
  
  return (
    <main className={mainStyle}>
      {isLoading && (
        <div className={loadingPageStyle}>
          <img src="/loading.gif" alt="Loading..." />
        </div>
      )}
      <header 
      className={headerStyle}
      >
        <button
          className={returnButtonStyle}
          onClick={() => window.history.back()}
        ><Undo2 /></button>
        <title className="text-4xl font-bold col-span-4 text-center">Pokemon's Page</title>
        <h1 className="text-4xl font-bold col-span-4 text-center">Welcome to Pokemon's Page</h1>
      </header>
      <div className={pageLayout}>
        {pokemons.map(({ pokemon }) => {
          const id = checkFetch(pokemon.url)//isso aqui precisa mudar, pois vai ser "iterado atraves do que vem depois da segunda consulta;
          return (
            <div key={id}
              className="flex justify-center items-center">
              <button
                className={pokemonButtonStyle}
                onClick={() => {
                  console.log(pokemon.name)
                  router.push(`/pokemons/${id}`)
                }}
              >{pokemon.name}</button>
            </div>
          )
        })}
      </div>
    </main>
  )
}