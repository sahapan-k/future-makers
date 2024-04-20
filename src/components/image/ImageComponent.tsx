import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';

// Types
import { PokemonType } from '@interface/pokemon.interface';

// Styles
import '@styles/ImageComponent.css';

interface Props {
  url?: string;
  foundPokemon?: PokemonType | null;
  isLoading: boolean;
  isDirtied: boolean;
  setPokemonView: (pokemon: PokemonType) => void;
}

const ImageComponent = ({ url, foundPokemon, isLoading, isDirtied, setPokemonView }: Props) => {
  return (
    <div className="flex flex-col box-img text-center justify-center border rounded p-4 relative" style={{ minWidth: '360px', minHeight: '336px' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <CircularProgress />
        </div>
      )}
      {!isLoading && !url && (
        <label htmlFor="silhouette" className="img-box mb-3 self-center">
          <div className="middle">
            <Image alt="pikachu-silhouette" src="/images/pikachu-silhouette.webp" layout="responsive" width="360" height="336" id="silhouette" />
          </div>
        </label>
      )}
      {!isLoading && url && (
        <label htmlFor="imageDisplay" className="img-box show mb-0 mb-3 flex justify-center">
          <Image src={url} alt="preview-image" layout="responsive" width="360" height="336" id="imageDisplay" />
          <div className="dropbox" />
          <div className="middle-absolute" />
        </label>
      )}
      {!isLoading && (
        <>
          <span className="my-4">
            Pokemon Name: <span className="font-bold">{foundPokemon ? foundPokemon.name : '????'}</span>
          </span>
          {isDirtied && !foundPokemon && <span className="text-red-500 font-bold">Pokemon Not Found!</span>}
          {isDirtied && foundPokemon && (
            <>
              <span className="text-green-500 font-bold">Pokemon Found!</span>
              <span
                className="text-indigo-500 text-sm text-grow-on-hover"
                onClick={() => {
                  setPokemonView(foundPokemon);
                }}
              >
                View Information
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ImageComponent;
