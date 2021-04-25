import React from "react";
import { Button } from "@material-ui/core";
import { useQuery, NetworkStatus } from "@apollo/client";
import { GET_SESSIONS_CONCAT } from "../../graphql/queries";

const SessionsLoadMore = () => {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    GET_SESSIONS_CONCAT,
    {
      variables: {
        limit: 4,
        afterCursor: "",
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const bFetchingMoreSpessions = networkStatus === NetworkStatus.fetchMore;

  if (loading && !bFetchingMoreSpessions) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { datalist } = data.sessionsConcat;
  const { hasNextPage, lastCursor } = data.sessionsConcat.pageInfo;

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        limit: 4,
        afterCursor: lastCursor,
      },
    });
  };

  return (
    <div>
      {datalist.map(({ id, title, eventYear }) => (
        <div key={id}>{`${eventYear} ${title} (${id})`}</div>
      ))}

      {hasNextPage && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchMore}
          disabled={bFetchingMoreSpessions}
        >
          {bFetchingMoreSpessions ? "loading..." : "fetch more..."}
        </Button>
      )}
    </div>
  );
};

export default SessionsLoadMore;
