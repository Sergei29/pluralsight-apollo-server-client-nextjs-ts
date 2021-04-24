import React from "react";
import { useApolloClient, useReactiveVar, useMutation } from "@apollo/client";
import AppBar from "@material-ui/core/AppBar";
import ToolbarMui from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import {
  currentThemeVar,
  checkBoxListVar,
  paginationDataVar,
} from "../../graphql/apolloProvider";
import { GET_SPEAKERS } from "../../graphql/queries";
import { TOGGLE_SPEAKER_FAVOURITE, ADD_SPEAKER } from "../../graphql/mutations";
import AddSpeaker from "../AddSpeaker/AddSpeaker";
import PaginationControls from "../PaginationControls/PaginationControls";
import { NewSpeakerType } from "../types";
// style:
import { useStyles } from "./style";

type Props = { totalItemCount: number };

/**
 * @description functional component, toolbar for speakers list
 * @param {Object} props component props
 * @returns {JSX} component markup, toolbar display
 */
const Toolbar: React.FC<Props> = ({ totalItemCount }) => {
  const classes = useStyles();
  const apolloClient = useApolloClient();
  const currentTheme = useReactiveVar(currentThemeVar);
  const paginationData = useReactiveVar(paginationDataVar);
  const arrSelectedSpeakersIds = useReactiveVar(checkBoxListVar);
  const [toggleSpeakerFavorite] = useMutation(TOGGLE_SPEAKER_FAVOURITE);
  const [addSpeaker] = useMutation(ADD_SPEAKER);
  const { offset, limit, currentPage } = paginationData;

  const handleAddSpeaker = (objSpeaker: NewSpeakerType) => {
    addSpeaker({
      variables: { speaker: objSpeaker },
      update: (cache, { data: addSpeaker }) => {
        const { speakers } = cache.readQuery({
          query: GET_SPEAKERS,
          variables: {
            offset: currentPage * limit,
            limit,
          },
        });

        cache.writeQuery({
          query: GET_SPEAKERS,
          variables: {
            offset: currentPage * limit,
            limit,
          },
          data: {
            speakers: {
              __typename: "SpeakerResults",
              datalist: [...speakers.datalist, addSpeaker],
              pageInfo: {
                __typename: "PageInfo",
                totalItemCount: totalItemCount,
              },
            },
          },
        });
      },
    });
  };

  const sortByIdDescending = () => {
    const { speakers } = apolloClient.readQuery({
      query: GET_SPEAKERS,
      variables: {
        offset: currentPage * limit,
        limit,
      },
    });
    apolloClient.writeQuery({
      query: GET_SPEAKERS,
      variables: {
        offset: currentPage * limit,
        limit,
      },
      data: {
        speakers: {
          __typename: "SpeakerResults",
          datalist: [...speakers.datalist].sort((a, b) => b.id - a.id),
          pageInfo: {
            __typename: "PageInfo",
            totalItemCount: totalItemCount,
          },
        },
      },
    });
  };

  const handleToggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    currentThemeVar(newTheme);
  };

  /**
   * @description to all checked speakers items it will toggle favorite status
   * @returns {undefined} makes api query
   */
  const toggleAllChecked = () =>
    arrSelectedSpeakersIds.forEach((currentId) => {
      toggleSpeakerFavorite({
        variables: { speakerId: parseInt(currentId) },
      });
    });

  const lastPage = Math.trunc((totalItemCount - 1) / paginationData.limit);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <ToolbarMui className={classes.toolBar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Speaker list
          </Typography>
          <PaginationControls lastPage={lastPage} />
          <FormControlLabel
            control={
              <Switch
                checked={currentTheme === "light"}
                onChange={handleToggleTheme}
                name="checkedB"
              />
            }
            label={currentTheme === "light" ? "Theme Light" : "Theme Dark"}
          />
          <AddSpeaker handleAddSpeaker={handleAddSpeaker} />
          <Button
            className={classes.toolBar__button}
            color="primary"
            variant="contained"
            onClick={sortByIdDescending}
          >
            sort by id desceding
          </Button>
          <Button
            className={classes.toolBar__button}
            color="primary"
            variant="contained"
            onClick={toggleAllChecked}
          >
            toggle all checked
          </Button>
        </ToolbarMui>
      </AppBar>
    </div>
  );
};

export default Toolbar;
