import { books as bookLists } from "../data/books";

const getBooks = async (_, args) => {
  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, args?.delay ? 10000 : 0);
  });

  const first = args.first || 5;
  const after = args.after || null;
  const index = bookLists.findIndex(item => item?.isbn13 === after);
  const offset = index + 1;

  const books = bookLists.slice(offset, offset + first);
  const lastBook = books[books.length - 1];

  return {
    pageInfo: {
      endCursor: lastBook?.isbn13,
      hasNextPage: offset + first < bookLists.length,
    },
    edges: books.map(book => {
      return {
        cursor: book.isbn13,
        node: book,
      };
    })
  };
}

export default getBooks;
