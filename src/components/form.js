import React, { useReducer } from 'react';
import {
  TextField,
  Backdrop,
  Button,
  Typography,
  CircularProgress
} from '@material-ui/core';

const initialState = {
  name: '',
  email: '',
  subject: '',
  body: '',
  status: 'ERROR'
};

const reducer = (state, action) => {
  if (action.type === 'inputChange') {
    return { ...state, [action.payload.name]: action.payload.value };
  }

  if (action.type === 'statusChange') {
    return { ...state, status: action.payload.status };
  }

  return state;
};

const Form = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onInputChange = event => {
    const value = event.target.value;
    const name = event.target.name;

    dispatch({
      type: 'inputChange',
      payload: {
        name,
        value
      }
    });
  };

  const onFormSubmit = event => {
    event.preventDefault();
    console.log(state);
  };

  if (state.status === 'SUCCESS') {
    return <Typography>Message Sent!</Typography>;
  }

  return (
    <>
      {state.status === 'ERROR' && (
        <Typography>Something went wrong. Please try again.</Typography>
      )}
      <Backdrop open={state.status === 'PENDING'}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <form noValidate autoComplete="off" onSubmit={onFormSubmit}>
        <TextField
          id="name"
          type="text"
          label="Name"
          name="name"
          required
          onChange={onInputChange}
          value={state.name}
        />
        <TextField
          id="email"
          type="email"
          label="Email"
          name="email"
          required
          onChange={onInputChange}
          value={state.email}
        />
        <TextField
          id="subject"
          type="text"
          label="Subject"
          name="subject"
          onChange={onInputChange}
          value={state.subject}
        />
        <TextField
          id="body"
          multiline
          label="Body"
          name="body"
          onChange={onInputChange}
          value={state.body}
        />
        <Button variant="contained" color="primary" type="submit">
          Send
        </Button>
      </form>
    </>
  );
};

export default Form;
