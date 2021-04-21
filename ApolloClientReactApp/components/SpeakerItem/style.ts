import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { yellow, red } from "@material-ui/core/colors";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    speakerItem: {},
    speakerItem__checkBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    speakerItem__name: {
      display: "flex",
      alignItems: "center",
    },
    favIconRoot: {
      fill: yellow[600],
    },
    deleteIconRoot: {
      fill: red[900],
    },
  })
);
