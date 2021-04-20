import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
} from "@material-ui/core";
import { ADD_SPEAKER } from "../../graphql/mutations";
import { GET_SPEAKERS } from "../../graphql/queries";
import { NewSpeakerType } from "../types";
import { validateForm } from "./helpers/validateForm";
// style:
import { useStyles } from "./style";

const objInitialState = {
  first: "",
  last: "",
  favourite: null,
};

/**
 * @description functional component, add new speaker
 * @param {Object} props component props
 * @returns {JSX} component markup, button and form modal
 */
const AddSpeaker = () => {
  const classes = useStyles();
  const [bOpenModal, setbOpenModal] = useState<boolean>(false);
  const [objNewSpeaker, setObjNewSpeaker] = useState<NewSpeakerType>({
    ...objInitialState,
  });
  const [addSpeaker] = useMutation(ADD_SPEAKER);

  const handleAddSpeaker = (objSpeaker: NewSpeakerType) => {
    addSpeaker({
      variables: { speaker: objSpeaker },
      update: (cache, { data: addSpeaker }) => {
        const { speakers } = cache.readQuery({ query: GET_SPEAKERS });

        cache.writeQuery({
          query: GET_SPEAKERS,
          data: {
            speakers: {
              __typename: "SpeakerResults",
              datalist: [...speakers.datalist, addSpeaker],
            },
          },
        });
      },
    });
  };

  const handleModalOpen = () => setbOpenModal(true);
  const handleModalClose = () => setbOpenModal(false);

  const handleChange = (objEvent: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = objEvent.target;
    setObjNewSpeaker((objPrevState) => ({
      ...objPrevState,
      [name]: name === "favourite" ? checked : value,
    }));
  };
  const handleResetForm = () => setObjNewSpeaker({ ...objInitialState });
  const handleSubmit = (objEvent: React.FormEvent) => {
    objEvent.preventDefault();
    if (!validateForm(objNewSpeaker)) {
      alert("Form is not valid.");
      return;
    }
    handleAddSpeaker(objNewSpeaker);
    handleResetForm();
    handleModalClose();
  };
  return (
    <div>
      <Button color="inherit" onClick={handleModalOpen}>
        insert speaker
      </Button>
      <Dialog
        open={bOpenModal}
        onClose={handleModalClose}
        aria-labelledby="form-dialog-add-speaker"
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Add new speaker</DialogTitle>
        <DialogContent className={classes.addSpeaker__form}>
          <FormControl>
            <TextField
              label="First name"
              name="first"
              variant="outlined"
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Last name"
              name="last"
              variant="outlined"
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleChange}
                  name="favourite"
                  color="primary"
                  checked={objNewSpeaker.favourite}
                />
              }
              label="Favourite"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            submit
          </Button>
          <Button type="reset" variant="outlined" onClick={handleResetForm}>
            reset
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddSpeaker;
