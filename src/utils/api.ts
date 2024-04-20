import axios from 'axios';

const BASE = `${process.env.NEXT_PUBLIC_API_URL}`;
const service = axios.create({ baseURL: BASE });

export default {
  service,
  apiURL: BASE,

  graphqlQuery: (query: string, variables?: any) =>
    service.post(
      '/',
      {
        query,
        variables,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ),
};
