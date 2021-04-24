import React from "react";
import { useMutation, useReactiveVar } from "@apollo/client";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Checkbox,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { SpeakerType } from "../types";
import {
  checkBoxListVar,
  paginationDataVar,
} from "../../graphql/apolloProvider";
import { GET_SPEAKERS } from "../../graphql/queries";
import {
  TOGGLE_SPEAKER_FAVOURITE,
  DELETE_SPEAKER,
} from "../../graphql/mutations";
// style:
import { useStyles } from "./style";

type Props = {
  speakerRec: SpeakerType;
};

/**
 * @description functional component, speaker item
 * @param {Object} props component props
 * @returns {JSX} component markup, speaker display
 */
const SpeakerItem: React.FC<Props> = ({ speakerRec }) => {
  const { id, first, last, favourite, fullName, checkBoxColumn } = speakerRec;
  const classes = useStyles();
  const [toggleSpeakerFavourite] = useMutation(TOGGLE_SPEAKER_FAVOURITE);
  const [deleteSpeaker] = useMutation(DELETE_SPEAKER);
  const arrSelectedSpeakersIds = useReactiveVar(checkBoxListVar);
  const paginationData = useReactiveVar(paginationDataVar);
  const { currentPage, limit } = paginationData;

  /**
   *@description callback on delete speaker
   * @returns {undefined} api call and cache update
   */
  const handleDelete = () => {
    deleteSpeaker({
      variables: { speakerId: parseInt(id) },
      optimisticResponse: {
        __typename: "Mutation",
        deleteSpeaker: {
          __typename: "Speaker",
          id,
          first,
          last,
          favourite,
        },
      },
      update: (cache, { data: { deleteSpeaker } }) => {
        const { speakers } = cache.readQuery({
          query: GET_SPEAKERS,
          variables: {
            offset: currentPage * limit,
            limit,
          },
        });

        const newDataList = speakers.datalist.filter(
          (objSpeaker) => objSpeaker.id !== deleteSpeaker.id
        );

        cache.writeQuery({
          query: GET_SPEAKERS,
          variables: {
            offset: currentPage * limit,
            limit,
          },
          data: {
            speakers: {
              __typename: "SpeakerResults",
              datalist: newDataList,
              pageInfo: {
                __typename: "PageInfo",
                totalItemCount: 0,
              },
            },
          },
        });
      },
    });
  };

  /**
   *@description callback on toggle favourite
   * @returns {undefined} api call and cache update
   */
  const handleToggleFavourite = () => {
    toggleSpeakerFavourite({
      variables: { speakerId: parseInt(id) },
      optimisticResponse: {
        __typename: "Mutation",
        toggleSpeakerFavourite: {
          __typename: "Speaker",
          id,
          first,
          last,
          favourite: !favourite,
        },
      },
    });
  };

  /**
   * @description callback on check speaker
   * @returns {undefined} sets reactive variable
   */
  const handleCheckSpeaker = () => {
    const arrNewSelectedIds = checkBoxColumn
      ? arrSelectedSpeakersIds.filter((currentId) => currentId !== id)
      : arrSelectedSpeakersIds
      ? [...arrSelectedSpeakersIds, id]
      : [id];

    checkBoxListVar(arrNewSelectedIds);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item sm={1} className={classes.speakerItem__checkBox}>
            <Checkbox
              checked={checkBoxColumn}
              onChange={handleCheckSpeaker}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </Grid>
          <Grid item sm={4} className={classes.speakerItem__name}>
            <Typography>{`${fullName} (${id})`}</Typography>
          </Grid>
          <Grid item sm={2}>
            <IconButton onClick={handleToggleFavourite}>
              {favourite ? (
                <StarIcon classes={{ root: classes.favIconRoot }} />
              ) : (
                <StarBorderIcon classes={{ root: classes.favIconRoot }} />
              )}
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon classes={{ root: classes.deleteIconRoot }} />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SpeakerItem;
