import React from "react";
import AppBar from "@material-ui/core/AppBar";
import ToolbarMui from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AddSpeaker from "../AddSpeaker/AddSpeaker";
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
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <ToolbarMui>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            News
          </Typography>
          <AddSpeaker />
          <Button color="inherit"> sort by id desceding</Button>
        </ToolbarMui>
      </AppBar>
    </div>
  );
};

export default Toolbar;
