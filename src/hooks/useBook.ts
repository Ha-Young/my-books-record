import { useSelector } from 'react-redux';
import { RootState } from '../redux/modules/rootReducer';

export default function useBook(id: number) {
  const books = useSelector((state: RootState) => state.books.books);

  if (books == null) return null;

  return books.find((book) => book.bookId === id);
}
