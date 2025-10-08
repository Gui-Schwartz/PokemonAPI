export const queryKeys = {
  types: ['types'] as const,
  type: (id: string) => [...queryKeys.types, id] as const, // ["types", id]

  pokemonsPrefix: 'pokemons' as const,
  pokemon: (id: string) => [queryKeys.pokemonsPrefix, id] // ["pokemons", id]
}