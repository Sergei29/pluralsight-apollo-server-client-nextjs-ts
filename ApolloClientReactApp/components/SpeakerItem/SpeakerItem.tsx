import React from "react";
import { useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { SpeakerType } from "../types";
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
  const { id, first, last, favourite, fullName } = speakerRec;
  const classes = useStyles();
  const [toggleSpeakerFavourite] = useMutation(TOGGLE_SPEAKER_FAVOURITE);
  const [deleteSpeaker] = useMutation(DELETE_SPEAKER);

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
        const { speakers } = cache.readQuery({ query: GET_SPEAKERS });

        const newDataList = speakers.datalist.filter(
          (objSpeaker) => objSpeaker.id !== deleteSpeaker.id
        );

        cache.writeQuery({
          query: GET_SPEAKERS,
          data: {
            speakers: {
              __typename: "SpeakerResults",
              datalist: newDataList,
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

  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item sm={7}>
            <Typography>{`${fullName} (${id})`}</Typography>
          </Grid>
          <Grid item sm={5}>
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
