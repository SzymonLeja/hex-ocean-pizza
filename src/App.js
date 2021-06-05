import React, { useState, useRef } from 'react';
import './style.scss';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  FormControl
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export default function App() {
  const [dishOptions, setDishOptions] = useState({
    dishName: '',
    dishTime: '00:00:00',
    dishType: '',
    dishId: 0
  });
  const pizzaSlicesRef = useRef(null);
  const diameterRef = useRef(null);
  const spicinessRef = useRef(null);
  const sandwichSlicesRef = useRef(null);
  const [displayError, setDisplayError] = useState({
    shouldDisplay: null,
    errorCode: null
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setDishOptions({ ...dishOptions, [name]: value });
    if (displayError.shouldDisplay != null) {
      setDisplayError({ shouldDisplay: null });
    }
  };
  function handleSubmit(event) {
    event.preventDefault();
    const urlReq = 'https://frosty-wood-6558.getsandbox.com:443/dishes';
    const params = {
      name: dishOptions.dishName,
      preparation_time: dishOptions.dishTime,
      type: dishOptions.dishType,
      id: dishOptions.dishId
    };
    if (params.preparation_time.length < 6) {
      params.preparation_time += ':00';
    }
    if (dishOptions.dishType === 'pizza') {
      let diameter = parseFloat(diameterRef.current.value);
      let slicesPizza = parseInt(pizzaSlicesRef.current.value, 10);
      if (diameter && slicesPizza) {
        params.diameter = diameter;
        params.no_of_slices = slicesPizza;
      } else {
        alert(
          'Make sure diameter of pizza and number of slices are not empty!'
        );
        return false;
      }
    } else if (dishOptions.dishType === 'soup') {
      let spicinessScale = parseInt(spicinessRef.current.value, 10);
      if (spicinessScale) {
        params.spiciness_scale = spicinessScale;
      } else {
        alert('Make sure spiciness of soup is not empty!');
        return false;
      }
    } else if (dishOptions.dishType === 'sandwich') {
      let slicesBread = parseInt(sandwichSlicesRef.current.value, 10);
      if (slicesBread) {
        params.slices_of_bread = slicesBread;
      } else {
        alert('Make sure number of bread slices is not empty!');
        return false;
      }
    }
    axios.post(urlReq, params).then(
      response => {
        let counter = dishOptions.dishId + 1;
        setDisplayError({ shouldDisplay: false });
        setDishOptions({ ...dishOptions, dishId: counter });
      },
      error => {
        setDisplayError({
          shouldDisplay: true,
          errorCode: error.response.status
        });
      }
    );
  }
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className="main-grid"
    >
      <form onSubmit={handleSubmit}>
        <Alert
          severity="error"
          style={
            displayError.shouldDisplay === true
              ? { display: 'flex' }
              : { display: 'none' }
          }
        >
          {displayError.errorCode} Try again later or check if all fields are
          filled correctly!
        </Alert>
        <Alert
          severity="success"
          style={
            displayError.shouldDisplay === false
              ? { display: 'flex' }
              : { display: 'none' }
          }
        >
          Success! Your dish has been sent!
        </Alert>

        <Grid item xs={12}>
          <img
            alt="HexOcean Logo"
            className="logo"
            src="https://hexocean.com/static/img/logo.svg"
          />
          <FormControl className="full-width-formControl">
            <TextField
              onChange={handleChange}
              name="dishName"
              value={dishOptions.dishName}
              id="standard-basic"
              required
              label="Name of the dish"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl className="full-width-formControl">
            <TextField
              id="time"
              label="Preparation time"
              name="dishTime"
              type="time"
              required
              onChange={handleChange}
              defaultValue=""
              inputProps={{
                step: 1
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'left' }}>
          <FormControl className="full-width-formControl">
            <InputLabel id="dish-type-select-label-label" required>
              Type of dish
            </InputLabel>
            <Select
              labelId="dish-type-select-label"
              id="dish-type-select-label"
              value={dishOptions.dishType}
              onChange={handleChange}
              name="dishType"
              defaultValue=""
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={'pizza'}>Pizza</MenuItem>
              <MenuItem value={'soup'}>Soup</MenuItem>
              <MenuItem value={'sandwich'}>Sandwich</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          style={
            dishOptions.dishType === 'pizza'
              ? { display: 'block' }
              : { display: 'none' }
          }
        >
          <FormControl className="full-width-formControl">
            <TextField
              id="no-of-slices"
              label="Number of Pizza slices *"
              name="dishSlices"
              type="number"
              min="0"
              ref={pizzaSlicesRef}
              onChange={event =>
                event.target.value < 0
                  ? (event.target.value = 0)
                  : (event.target.value,
                    (pizzaSlicesRef.current.value = event.target.value))
              }
              inputProps={{
                step: 1
              }}
            />
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          style={
            dishOptions.dishType === 'pizza'
              ? { display: 'block' }
              : { display: 'none' }
          }
        >
          <FormControl className="full-width-formControl">
            <TextField
              id="diameter"
              label="Pizza Diameter *"
              name="dishDiameter"
              type="number"
              ref={diameterRef}
              min="0.0"
              onChange={event =>
                event.target.value < 0.0
                  ? (event.target.value = 0.0)
                  : (event.target.value,
                    (diameterRef.current.value = event.target.value))
              }
              inputProps={{
                step: 0.1
              }}
            />
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          style={
            dishOptions.dishType === 'soup'
              ? { display: 'block' }
              : { display: 'none' }
          }
        >
          <FormControl className="full-width-formControl">
            <TextField
              id="diameter"
              label="Soup spiciness scale (1-10) *"
              name="dishSpiciness"
              type="number"
              ref={spicinessRef}
              min="1"
              onChange={event =>
                event.target.value < 1 || event.target.value > 10
                  ? (event.target.value = 1)
                  : (event.target.value,
                    (spicinessRef.current.value = event.target.value))
              }
              inputProps={{
                step: 1
              }}
            />
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          style={
            dishOptions.dishType === 'sandwich'
              ? { display: 'block' }
              : { display: 'none' }
          }
        >
          <FormControl className="full-width-formControl">
            <TextField
              id="diameter"
              label="Slices of bread in sandwich *"
              name="dishSpiciness"
              type="number"
              ref={sandwichSlicesRef}
              min="1"
              onChange={event =>
                event.target.value < 1
                  ? (event.target.value = 1)
                  : (event.target.value,
                    (sandwichSlicesRef.current.value = event.target.value))
              }
              inputProps={{
                step: 1
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} className="button-div">
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </Grid>
      </form>
    </Grid>
  );
}
