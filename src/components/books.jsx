import { gql, useQuery } from "@apollo/client";
import React from "react";
import styled from "styled-components";

const GET_BOOKS = gql`
  query books($first: Int, $after: String, $delay: Boolean) {
    books(first: $first, after: $after, delay: $delay) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          title
          subtitle
          price
          image
          url
        }
      }
    }
  }
`;

const first = 5;
const delay = true;

const Books = () => {
  const { error, data, loading, fetchMore, networkStatus } = useQuery(
    GET_BOOKS,
    {
      variables: { first, delay },
      notifyOnNetworkStatusChange: true,
    }
  );

  console.log("networkStatus: ", networkStatus);

  if (error) {
    console.log("error: ", error.message);
    return <div>An error</div>;
  }

  if (loading || !data) return <div>loading...</div>;

  if (networkStatus === 1) return <div>Loading...</div>;

  const isRefetching = networkStatus === 3;
  console.log(
    "🚀 ~ file: books.jsx ~ line 46 ~ Books ~ isRefetching",
    isRefetching
  );
  console.log(data?.books?.edges);

  return (
    <Books.Container>
      <h2>Books List</h2>
      <section className="books_list">
        <p className="count">
          Count - <span>{data?.books?.edges.length}</span>
        </p>
        {data?.books?.edges.map((edge, index) => {
          return (
            <div className="book_row" key={index+1}>
              <img src={edge?.node?.image} alt={edge?.node?.title} />
              <a href={edge?.node?.url}>{edge?.node?.title}</a>
              <span>{edge?.node?.subtitle}</span>
              <span>{edge?.node?.price}</span>
            </div>
          );
        })}
      </section>

      {data?.books?.pageInfo?.hasNextPage && (
        <div className="more_button">
          <button
            id="buttonLoadMore"
            disabled={isRefetching}
            loading={isRefetching.toString()}
            onClick={() => {
              fetchMore({
                variables: {
                  first,
                  after: data?.books?.pageInfo?.endCursor,
                  delay,
                },
              });
            }}
          >
            load more
          </button>
        </div>
      )}
    </Books.Container>
  );
};

Books.Container = styled.div`
  background: #feffde;
  padding: 0.5rem;
  h2 {
    font-size: 3rem;
  }

  .books_list {
    padding: 5rem;
    border: 1px solid #798777;
    background: #e6f0e3;
    margin: 2.35rem;

    .count {
      font-size: 1.35rem;
    }

    .book_row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: white;
      padding: 0.35rem 0.75rem;
      margin: 0.95rem 0;
      flex-basis: 100%;

      img {
        width: 4rem;
        height: 5rem;
      }

      a {
        color: #798777;
        text-decoration-color: #798777;
        font-size: 1.15rem;
        font-weight: 550;
        flex: 0 0 25rem;
      }
      span {
        font-size: 1.15rem;
        font-weight: 550;
        flex: 0 0 25rem;
        text-align: center;
      }
    }

    .more_button {
      button {
        margin: 0 auto;
        display: block;
        padding: 0.75rem;
        cursor: pointer;
        color: #798777;
      }
    }
  }
`;

export default Books;
