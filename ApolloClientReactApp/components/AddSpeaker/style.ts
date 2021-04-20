import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { yellow, red } from "@material-ui/core/colors";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addSpeaker__form: {
      display: "flex",
      flexDirection: "column",
      rowGap: `${theme.spacing(2)}px`,
    },
  })
);
