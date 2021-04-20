import React, { Fragment } from "react";
import { useQuery } from "@apollo/client";
import { GET_SPEAKERS } from "../../graphql/queries";
import Toolbar from "../Toolbar/Toolbar";
import SpeakerItem from "../SpeakerItem/SpeakerItem";
// style:
import { useStyles } from "./style";

type Props = {};

/**
 * @description functional component, speakers list
 * @param {Object} props component props
 * @returns {JSX} component markup, speakers list display
 */
const SpeakerListItems: React.FC<Props> = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_SPEAKERS);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Fragment>
      <Toolbar />
      <div>
        {data.speakers.datalist.map((objSpeaker) => (
          <SpeakerItem key={objSpeaker.id} speakerRec={objSpeaker} />
        ))}
      </div>
    </Fragment>
  );
};

export default SpeakerListItems;
