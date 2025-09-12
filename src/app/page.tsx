"use client"

// arrumar o css/Tailwind das páginas
// criar uma div "quadro"para ajeitar os botões dos types, centralizar na tela (responsivo)
// colocar o nome dos pokemons com a primeira letra maiúscula
// arrumar o css/Tailwind do título
// arrumar o css/Tailwind da página principal
// Colocar o nome do tipo na página de pokemons
// criar uma div "quadro" para ajeitar a lista dos botões dos pokemons, centralizar na tela (responsivo)




import { fetchTypes,typesPage } from "../utils/endpoint"
import { useEffect, useState } from "react"
import { checkFetch } from "../utils/check-fetch"
import { useRouter } from "next/navigation"
import {
  bgColor,
  loadingPageStyle,
  mainStyle,
  headerStyle,
  whiteBox
} from "../utils/styles"

type PokemonType = {
  name: string;
  url: string;
}

export default function Home() {
  const [pokemonsTypes, setPokemonsTypes] = useState<PokemonType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  fetchTypes().then((data) => setPokemonsTypes(data));
  setIsLoading(false);
  }, []);

  return (
    <main className={mainStyle}>
      {isLoading && (
        <div className={loadingPageStyle}>
          <img src="/loading.gif" alt="Loading..." />
        </div>
      )}
      <header className={headerStyle}>
        <h1 className="text-4xl font-bold col-span-4 text-center">Welcome to the Pokédex</h1>
        <h2 className="text-3xl font-bold col-span-4 text-center">choose the type of your pokemon: </h2>
      </header>
      <div className="bg-stone-300">
        <div className={whiteBox}>
          {pokemonsTypes.map((type) => (
            <div key={type.name}
              className="flex justify-center items-center">
              <button className={`${bgColor[type.name]} w-20 rounded-4xl p-2 `}
                onClick={() => {
                  router.push(`/types/${checkFetch(type.url)}/`),
                    console.log(type.name)
                }}
              >
                {type.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}