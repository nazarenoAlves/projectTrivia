import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { loginAction } from '../redux/actions';
import { fetchToken } from '../services/api';
import style from './Login.module.css';
import logo from '../img/logoInit.png';

// const arrToken = [];
class Login extends React.Component {
  state = {
    name: '',
    email: '',
    btnEnable: true,
    // loading: false,
  };

  buttonDisable = () => {
    const regex = /\S+@\S+\.\S+/;
    const { name, email } = this.state;
    const resultName = name.length > 0;
    const resultEmail = email.length > 0;
    const regexEmail = !!regex.test(email);
    const resultFinal = resultName && resultEmail && regexEmail;
    if (resultFinal) {
      this.setState({
        btnEnable: false,
      });
    } else {
      this.setState({
        btnEnable: true,
      });
    }
  };

  onInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    }, this.buttonDisable());
  };

  onClick = async () => {
    const { history, dispatch } = this.props;
    const { email, name } = this.state;
    const dataToken = await fetchToken();
    const { token } = dataToken;
    // this.setState({
    //   loading: true,
    // });
    // if (token.length > 0) {
    //   this.setState({
    //     loading: false,
    //   });
    // }
    localStorage.setItem('token', token);
    dispatch(loginAction({ email, name }));
    history.push('/games');
  };

  render() {
    const { name, email, btnEnable } = this.state;
    const { history } = this.props;
    return (
      <div>
        <div className={ style.contentImg }>
          <img src={ logo } alt="logo" className={ style.pulseImg } />
        </div>
        <div className={ style.contentInput }>
          <input
            type="text"
            data-testid="input-player-name"
            placeholder="Insira seu nome"
            name="name"
            value={ name }
            onChange={ this.onInputChange }
          />
          <input
            type="text"
            data-testid="input-gravatar-email"
            placeholder="Insira seu Email"
            name="email"
            value={ email }
            onChange={ this.onInputChange }
          />
          <button
            type="button"
            data-testid="btn-play"
            disabled={ btnEnable }
            onClick={ this.onClick }
          >
            Play

          </button>
          {/* <button
            type="button"
            data-testid="btn-settings"
            onClick={ () => history.push('/settings') }
          >
            SETTINGS
          </button> */}
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect()(Login);
