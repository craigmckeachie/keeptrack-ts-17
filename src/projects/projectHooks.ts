import { useState } from 'react';
import { projectAPI } from './projectAPI';
import { useQuery } from 'react-query';

export function useProjects() {
  const [page, setPage] = useState(0);
  let queryInfo = useQuery(['projects', page], () => projectAPI.get(page + 1), {
    keepPreviousData: true,
    staleTime: 5000,
  });
  console.log(queryInfo);
  return { ...queryInfo, page, setPage };
}
