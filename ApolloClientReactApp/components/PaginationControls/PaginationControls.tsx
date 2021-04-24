import React from "react";
import FastForwardIcon from "@material-ui/icons/FastForward";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import { IconButton, Card, CardContent, Chip } from "@material-ui/core";
import { useReactiveVar } from "@apollo/client";
import { paginationDataVar } from "../../graphql/apolloProvider";
// style:
import { useStyles } from "./style";

type Props = { lastPage: number };

const PaginationControls: React.FC<Props> = ({ lastPage }) => {
  const classes = useStyles();
  const paginationData = useReactiveVar(paginationDataVar);
  const { currentPage } = paginationData;

  const handleGoNext = () => {
    if (currentPage < lastPage) {
      paginationDataVar({
        ...paginationData,
        currentPage: currentPage + 1,
      });
    }
  };

  const handleGoPrev = () => {
    if (currentPage > 0) {
      paginationDataVar({
        ...paginationData,
        currentPage: currentPage - 1,
      });
    }
  };

  const handleGoLast = () => {
    paginationDataVar({
      ...paginationData,
      currentPage: lastPage,
    });
  };

  const handleGoFirst = () => {
    paginationDataVar({
      ...paginationData,
      currentPage: 0,
      offset: 0,
    });
  };

  return (
    <Card>
      <CardContent
        classes={{ root: classes.cardContentRoot }}
        className={classes.paginationControls}
      >
        <IconButton onClick={handleGoFirst}>
          <FastRewindIcon />
        </IconButton>
        <IconButton onClick={handleGoPrev}>
          <ArrowLeftIcon />
        </IconButton>
        <Chip label={currentPage + 1} />
        <IconButton onClick={handleGoNext}>
          <ArrowRightIcon />
        </IconButton>
        <IconButton onClick={handleGoLast}>
          <FastForwardIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default PaginationControls;
