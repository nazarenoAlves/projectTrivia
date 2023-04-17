import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import style from './Feedback.module.css';

const minAssert = 3;

class Feedback extends React.Component {
  state = {
    email: '',
  };

  componentDidMount() {
    this.convertEmail();
  }

  convertEmail = () => {
    const { email } = this.props;
    const emailConvertido = md5(email).toString();
    console.log(emailConvertido);
    this.setState({
      email: emailConvertido,
    });
  };

  render() {
    const { assertions, score, history } = this.props;
    const { email } = this.state;
    return (
      <div className={ style.contentBody }>
        <div className={ style.feedContent }>
          <div className={ style.contentImg }>
            <img
              data-testid="header-profile-picture"
              alt="avatar"
              src={ `https://www.gravatar.com/avatar/${email}` }
            />
          </div>
          <div className={ style.contentResult }>
            { assertions < minAssert ? (
              <p data-testid="feedback-text">Could be better...</p>)
              : <p data-testid="feedback-text">Well Done!</p> }
            <p data-testid="feedback-total-score">{`Sua pontuação foi: ${score}`}</p>
            <p data-testid="feedback-total-question">{`Você acertou: ${assertions}`}</p>
          </div>

        </div>
        <div className={ style.contentBtn }>
          <button
            data-testid="btn-play-again"
            type="button"
            onClick={ () => history.push('/') }
          >
            Play Again
          </button>
          <button
            data-testid="btn-ranking"
            type="button"
            onClick={ () => history.push('/ranking') }
          >
            Ranking
          </button>
        </div>
      </div>
    );
  }
}

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  score: PropTypes.number.isRequired,
};
const mapStateToProps = (globalState) => ({
  assertions: globalState.player.assertions,
  score: globalState.player.score,
  email: globalState.player.email,
});
export default connect(mapStateToProps)(Feedback);
