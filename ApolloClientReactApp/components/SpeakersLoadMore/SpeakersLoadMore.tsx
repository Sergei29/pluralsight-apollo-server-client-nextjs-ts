import React from "react";
import { Button } from "@material-ui/core";
import { useQuery, NetworkStatus } from "@apollo/client";
import { GET_SPEAKERS_CONCAT } from "../../graphql/queries";

const SpeakersLoadMore = () => {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    GET_SPEAKERS_CONCAT,
    {
      variables: {
        limit: 4,
        afterCursor: "",
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const bFetchingMoreSpeakers = networkStatus === NetworkStatus.fetchMore;

  if (loading && !bFetchingMoreSpeakers) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { datalist } = data.speakersConcat;
  const { hasNextPage, lastCursor } = data.speakersConcat.pageInfo;

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
      {datalist.map(({ id, first, last }) => (
        <div key={id}>{`${first} ${last} (${id})`}</div>
      ))}

      {hasNextPage && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchMore}
          disabled={bFetchingMoreSpeakers}
        >
          {bFetchingMoreSpeakers ? "loading..." : "fetch more..."}
        </Button>
      )}
    </div>
  );
};

export default SpeakersLoadMore;
