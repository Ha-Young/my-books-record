import { useParams } from 'react-router-dom';

export default function useBookIdParams() {
  const { id } = useParams();
  if (id === undefined) {
    return -1;
  } else return parseInt(id);
}
