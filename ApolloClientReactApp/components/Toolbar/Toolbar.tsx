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
import { currentThemeVar, checkBoxListVar } from "../../graphql/apolloProvider";
import AddSpeaker from "../AddSpeaker/AddSpeaker";
import { GET_SPEAKERS } from "../../graphql/queries";
import { TOGGLE_SPEAKER_FAVOURITE } from "../../graphql/mutations";
// style:
import { useStyles } from "./style";

type Props = {};

/**
 * @description functional component, toolbar for speakers list
 * @param {Object} props component props
 * @returns {JSX} component markup, toolbar display
 */
const Toolbar: React.FC<Props> = () => {
  const classes = useStyles();
  const apolloClient = useApolloClient();
  const currentTheme = useReactiveVar(currentThemeVar);
  const arrSelectedSpeakersIds = useReactiveVar(checkBoxListVar);
  const [toggleSpeakerFavourite] = useMutation(TOGGLE_SPEAKER_FAVOURITE);

  const sortByIdDescending = () => {
    const { speakers } = apolloClient.readQuery({ query: GET_SPEAKERS });
    apolloClient.writeQuery({
      query: GET_SPEAKERS,
      data: {
        speakers: {
          __typename: "SpeakerResults",
          datalist: [...speakers.datalist].sort((a, b) => b.id - a.id),
        },
      },
    });
  };

  const handleToggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    currentThemeVar(newTheme);
  };

  /**
   * @description to all checked speakers items it will toggle favourite status
   * @returns {undefined} makes api query
   */
  const toggleAllChecked = () =>
    arrSelectedSpeakersIds.forEach((currentId) => {
      toggleSpeakerFavourite({
        variables: { speakerId: parseInt(currentId) },
      });
    });

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
          <AddSpeaker />
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
