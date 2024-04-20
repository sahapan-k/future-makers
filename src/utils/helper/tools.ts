export const generateQueryString = (searchInput: string) => {
  return `query {
    pokemon(name: "${searchInput}") {
      id
      number
      name
      weight {
        minimum
        maximum
      }
      height {
        minimum
        maximum
      }
      classification
      types
      resistant
      attacks {
        fast {
          name
          type
          damage
        }
        special {
          name
          type
          damage
        }
      }
      weaknesses
      fleeRate
      maxCP
      evolutions {
      id
      name
       }
      evolutionRequirements {
        amount
        name
       } 
      maxHP
      image
  }
}`;
};
