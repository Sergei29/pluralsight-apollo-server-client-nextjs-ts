import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { yellow, red } from "@material-ui/core/colors";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    speakerItem: {},
    favIconRoot: {
      fill: yellow[600],
    },
    deleteIconRoot: {
      fill: red[900],
    },
  })
);
