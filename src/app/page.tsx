'use client';

// Libraries
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import { debounce } from 'lodash';

// Custom Components
import ImageComponent from '@components/image/ImageComponent';

// Actions
import api from '@utils/api';
import { generateQueryString } from '@utils/helper/tools';

// Types
import { PokemonType } from '@interface/pokemon.interface';

// Styles
import '@styles/ImageComponent.css';

const Index = () => {
  // Hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // States
  const [isDirtied, setIsDirty] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchInputText, setSearchInputText] = useState<string>('');
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>(searchInputText);
  const [foundPokemon, setFoundPokemon] = useState<PokemonType | null>(null);
  const [viewedPokemon, setViewedPokemon] = useState<PokemonType | null>(null);

  // Constant Declaration
  const mainCardStyle = {
    transition: 'transform 0.5s ease-in-out',
    transform: viewedPokemon ? 'translateX(-120%)' : 'translateX(0)',
    position: 'relative' as any,
    zIndex: 2,
  };

  const infoCardStyle = {
    transition: 'transform 0.5s ease-in-out',
    position: 'absolute' as any,
    maxHeight: '85%',
    overflowY: 'auto' as any,
    zIndex: 1,
  };

  // Functions
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const fetchPokemon = async (inputText: string) => {
    setIsLoading(true);

    if (isDirtied === false) {
      setIsDirty(true);
    }

    const queryString = generateQueryString(inputText);

    try {
      const response = await api.graphqlQuery(queryString);
      if (response.status === 200) {
        setFoundPokemon(response.data.data.pokemon);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const setPokemonView = async (pokemon: PokemonType) => {
    if (!pokemon) return;

    setViewedPokemon(pokemon);

    router.push(pathname + '?' + createQueryString('Pokemon', `${pokemon.name}`));
  };

  const selectEvolutionPokemonHandler = async () => {
    if (!viewedPokemon) return;

    const evolutionPokemon = viewedPokemon?.evolutions?.[0]?.name;
    const queryString = generateQueryString(evolutionPokemon);

    try {
      const response = await api.graphqlQuery(queryString);
      if (response.status === 200) {
        setFoundPokemon(response.data.data.pokemon);
        setViewedPokemon(response.data.data.pokemon);
      }

      const newPokemon = response.data.data.pokemon;

      router.push(pathname + '?' + createQueryString('Pokemon', `${newPokemon.name}`));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    setIsLoading(true);
    const debounceTimeout = debounce(() => {
      setDebouncedSearchText(searchInputText);
      setIsLoading(false);
    }, 300);

    debounceTimeout();

    return () => {
      debounceTimeout.cancel();
      setIsLoading(false);
    };
  }, [searchInputText]);

  useEffect(() => {
    if (debouncedSearchText) {
      fetchPokemon(debouncedSearchText);
    }
  }, [debouncedSearchText]);

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ backgroundImage: 'url("/images/pokemon-detective.webp")', backgroundPosition: 'center', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" style={mainCardStyle}>
        <CardHeader title="Pokemon Database Center" />
        <CardContent>
          <TextField fullWidth type="text" label="Search Input" placeholder="Pikachu" autoComplete="off" onChange={(e) => setSearchInputText(e.target.value)} />
          <div className="my-4">
            <Divider sx={{ m: '0 !important' }} />
          </div>
          <ImageComponent url={foundPokemon?.image} foundPokemon={foundPokemon} isLoading={isLoading} isDirtied={isDirtied} setPokemonView={setPokemonView} />
        </CardContent>
      </div>
      {viewedPokemon && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" style={infoCardStyle}>
          <CardHeader title={`Pokemon Information:`} />
          <CardContent>
            <Divider sx={{ m: '0 !important' }} />
            <div className="py-8 flex flex-col">
              <span className="mb-2">
                <strong className="text-lg">Name:</strong> {viewedPokemon.name} <span className="text-sm text-gray-400">{`(No. ${viewedPokemon.number})`}</span>
              </span>
              <span className="mb-2">
                <strong className="text-lg">Weight:</strong> {viewedPokemon.weight.minimum} - {viewedPokemon.weight.maximum}
              </span>
              <span className="mb-2">
                <strong className="text-lg">Height:</strong> {viewedPokemon.height.minimum} - {viewedPokemon.height.maximum}
              </span>
              <span className="mb-2">
                <strong className="text-lg text-blue-700">Max HP:</strong> {viewedPokemon.maxHP}
              </span>
              <span className="mb-2">
                <strong className="text-lg text-blue-400">Classification:</strong> {viewedPokemon.classification}
              </span>
              <span className="mb-2">
                <strong className="text-lg">Types:</strong> {viewedPokemon.types.join(', ')}
              </span>
              <span className="mb-2">
                <strong className="text-lg text-green-400">Resistant:</strong> {viewedPokemon.resistant.join(', ')}
              </span>
              <span className="mb-2">
                <strong className="text-lg text-red-400">Weaknesses:</strong> {viewedPokemon.weaknesses.join(', ')}
              </span>
              <Card className="py-4 px-2 my-2">
                <span className="mb-2">
                  <strong className="text-lg">Attack</strong>
                  <div className="my-2">
                    <Divider sx={{ m: '0 !important' }} />
                    <div className="py-2">
                      <div className="my-2">
                        <span className="font-semibold">Fast Type:</span>
                        {viewedPokemon.attacks?.fast?.map((attack, index) => (
                          <Card key={index} className="my-2 p-2">
                            <div className="flex flex-col text-sm">
                              <span>
                                <strong>Name:</strong> {attack.name}
                              </span>
                              <span>
                                <strong>Type:</strong> {attack.type}
                              </span>

                              <span>
                                <strong className="text-red-400">Damage:</strong> {attack.damage}
                              </span>
                            </div>
                          </Card>
                        ))}
                      </div>
                      <div className="my-2">
                        <span className="font-semibold">Special Type:</span>
                        {viewedPokemon.attacks?.special?.map((attack, index) => (
                          <Card key={index} className="my-2 p-2">
                            <div className="flex flex-col text-sm">
                              <span>
                                <strong>Name:</strong> {attack.name}
                              </span>
                              <span>
                                <strong>Type:</strong> {attack.type}
                              </span>

                              <span>
                                <strong className="text-red-400">Damage:</strong> {attack.damage}
                              </span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </span>
              </Card>
              <span className="mb-2">
                <strong className="text-lg">Flee Rate:</strong> {viewedPokemon.fleeRate}
              </span>
              <span className="mb-2">
                <strong className="text-lg">Max CP:</strong> {viewedPokemon.maxCP}
              </span>
            </div>
            {!viewedPokemon?.evolutions && (
              <div className="flex flex-col items-end justify-end">
                <span className="text-sm text-gray-400 italic">This Pokemon has no further evolution path</span>
              </div>
            )}
            {viewedPokemon?.evolutions && (
              <div className="flex flex-col items-end justify-end">
                <span className="text-lg text-yellow-500 font-semibold">Next Evolution</span>
                <span className="text-indigo-500 text-grow-on-hover" onClick={selectEvolutionPokemonHandler}>
                  {viewedPokemon?.evolutions?.[0]?.name}
                </span>
              </div>
            )}
            {viewedPokemon?.evolutionRequirements && (
              <Card className="p-4 mt-4">
                <div className="flex flex-col items-start justify-start">
                  <span className="text-lg text-purple-500 font-bold">Evolution Requirement</span>
                  <span className="text-indigo-500 text-sm">
                    {viewedPokemon?.evolutionRequirements?.name} x <strong>{viewedPokemon?.evolutionRequirements?.amount}</strong>
                  </span>
                </div>
              </Card>
            )}
          </CardContent>
        </div>
      )}
    </div>
  );
};

export default Index;
