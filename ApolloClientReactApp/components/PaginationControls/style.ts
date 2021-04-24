import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardContentRoot: {
      "&:last-child": {
        padding: 0,
      },
      padding: 0,
    },
    paginationControls: {
      display: "flex",
      columnGap: `${theme.spacing(1)}px`,
      alignItems: "center",
    },
  })
);
