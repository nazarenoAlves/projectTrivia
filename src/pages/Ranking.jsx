import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import style from './Ranking.module.css';
import imgConst from '../img/construcao.gif';

class Ranking extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <div className={ style.contentRankig }>
        <h3
          data-testid="ranking-title"
        >
          Ranking
          <img src={ imgConst } alt="imgConstr" />
        </h3>
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ () => history.push('/') }
        >
          Inicio
        </button>
      </div>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
export default connect()(Ranking);
