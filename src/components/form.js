import React, { useReducer } from 'react';
import {
  TextField,
  Backdrop,
  Button,
  Typography,
  CircularProgress
} from '@material-ui/core';

const TYPE = {
  INPUT_CHANGE: 'INPUT_CHANGE',
  STATUS_CHANGE: 'STATUS_CHANGE',
  RESET_CHANGE: 'RESET_CHANGE'
};

const FORM_STATE = {
  IDLE: 'IDLE',
  ERROR: 'ERROR',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS'
};

const initialState = {
  name: '',
  email: '',
  subject: '',
  body: '',
  status: FORM_STATE.IDLE
};

const reducer = (state, action) => {
  if (action.type === TYPE.INPUT_CHANGE) {
    return { ...state, [action.payload.name]: action.payload.value };
  }

  if (action.type === TYPE.STATUS_CHANGE) {
    return { ...state, status: action.payload.status };
  }

  if (action.type === TYPE.RESET_CHANGE) {
    return initialState;
  }

  return state;
};

const Form = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onInputChange = event => {
    const value = event.target.value;
    const name = event.target.name;

    dispatch({
      type: TYPE.INPUT_CHANGE,
      payload: {
        name,
        value
      }
    });
  };

  const setStatus = status => {
    dispatch({
      type: TYPE.STATUS_CHANGE,
      payload: {
        status
      }
    });
  };

  const onFormSubmit = event => {
    event.preventDefault();
    setStatus(FORM_STATE.PENDING);
    console.log(state);

    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(state)
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setStatus(FORM_STATE.SUCCESS);
      })
      .catch(error => {
        console.log(error);
        setStatus(FORM_STATE.ERROR);
      });
  };

  if (state.status === FORM_STATE.SUCCESS) {
    return (
      <>
        <Typography>Message Sent!</Typography>
        <Button
          variant="outlined"
          onClick={() => dispatch({ type: TYPE.RESET_CHANGE })}
        >
          Reset!
        </Button>
      </>
    );
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
