import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    toolBar: {
      display: "flex",
      columnGap: `${theme.spacing(1)}px`,
    },
    toolBar__button: {
      textTransform: "capitalize",
    },
  })
);
