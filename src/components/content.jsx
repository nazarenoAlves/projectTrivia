import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { BsFillStopwatchFill } from 'react-icons/bs';
import { fetchQuiz } from '../services/api';
import Loading from './loading';
import './button.css';
import { assertionAction, scoreAction } from '../redux/actions';
import style from './Content.module.css';
import logoGames from '../img/logoGames.png';

const ERROR_NUMBER = 3;
const FINAL_QUESTION = 4;
class ContentGames extends React.Component {
  state = {
    count: 30,
    btnDisable: false,
    loading: true,
    results: [],
    nextQuestion: 0,
    response: false,
    questionArr: [],
    btnNext: false,
    assertionLocal: 0,
  };

  async componentDidMount() {
    const { history } = this.props;
    const token = localStorage.getItem('token');
    const dataQuiz = await fetchQuiz(token);
    console.log(dataQuiz);
    if (dataQuiz.response_code === ERROR_NUMBER) {
      localStorage.removeItem('token');
      history.push('/');
    } else {
      this.questionRandom(dataQuiz.results);
      this.setState({
        results: dataQuiz.results,
        // questionArr: ,
        loading: false,
      });
    }
    this.initiTimer();
  }

  componentDidUpdate(prev, state) {
    if (state.count === 1) {
      clearInterval(this.timerDecrement);
      this.setState({
        btnDisable: true,
      });
    }
  }

  nextQues = () => {
    const { history, dispatch } = this.props;
    const { results, nextQuestion, assertionLocal } = this.state;
    if (nextQuestion === FINAL_QUESTION) {
      dispatch(assertionAction(assertionLocal));
      return history.push('/feedback');
    }
    this.setState((prevState) => ({
      nextQuestion: prevState.nextQuestion + 1,
      response: false,
      count: 30,
      btnDisable: false,
    }), () => {
      this.questionRandom(results);
    });
    clearInterval(this.timerDecrement);
    this.initiTimer();
  };

  questionRandom = (results) => {
    const { nextQuestion } = this.state;
    const correctAnswer = results[nextQuestion].correct_answer;
    const incorrectAnswers = results[nextQuestion].incorrect_answers;
    const optionList = [correctAnswer, ...incorrectAnswers];
    const randomDivision = 0.5;
    const shuffledAlternatives = optionList
      .sort(() => Math.random() - randomDivision);
    console.log(shuffledAlternatives);
    this.setState({
      questionArr: shuffledAlternatives,
    });
    // return [...shuffledAlternatives];
  };

  initiTimer = () => {
    const { count } = this.state;
    if (count > 0) {
      const seconds = 1000;
      this.timerDecrement = setInterval(() => {
        this.setState((prevState) => ({
          count: prevState.count - 1,
        }));
      }, seconds);
    }
  };

  checkQuestion = (event) => {
    const { dispatch } = this.props;
    const { count, results, nextQuestion } = this.state;
    // const { difficulty } = results[0];
    this.setState({
      btnDisable: true,
    });
    if (event.target.getAttribute('data-testid') === 'correct-answer') {
      this.setState((prev) => ({
        assertionLocal: prev.assertionLocal + 1,
      }));
      const baseScore = 10;
      const hard = 3;
      const medium = 2;
      const easy = 1;
      let level = 0;
      if (results[nextQuestion].difficulty === 'hard') {
        level = hard;
      } else if (results[nextQuestion].difficulty === 'medium') {
        level = medium;
      } else {
        level = easy;
      }
      dispatch(scoreAction(baseScore + (count * level)));
    }
    this.setState({
      response: true,
      btnNext: true,
    });
  };

  render() {
    const { results, loading, nextQuestion, response,
      btnDisable, count, questionArr, btnNext } = this.state;
    const negative = -1;
    let index2 = negative;
    return (
      <div className={ style.content }>

        {loading ? <Loading /> : (
          <div className={ style.contentQuestion }>
            <div className={ style.categoryQuestion }>
              <p data-testid="question-category">
                {results[nextQuestion].category}
              </p>
            </div>
            <div className={ style.logoGames }>
              <img src={ logoGames } alt="logoGames" />
            </div>
            <div className={ style.perguntas }>
              <h3>Pergunta</h3>
              <p data-testid="question-text">
                {results[nextQuestion].question}
              </p>
            </div>
            <div className={ style.timer }>

              <span>
                <BsFillStopwatchFill />
                {count}
              </span>
            </div>
          </div>
        )}
        <div data-testid="answer-options" className={ style.contentAnswer }>
          {questionArr.map((element, index) => {
            let classCss = '';
            if (response) {
              classCss = element === results[nextQuestion].correct_answer
                ? 'correctAnswer' : 'incorrectAnswer';
            }
            index2 += element === results[nextQuestion].correct_answer ? 0 : 1;
            return (
              <button
                type="button"
                data-testid={ element === results[nextQuestion].correct_answer
                  ? 'correct-answer' : `wrong-answer-${index2}` }
                key={ index }
                disabled={ btnDisable }
                className={ classCss }
                onClick={
                  this.checkQuestion
                }
              >
                {element}
              </button>
            );
          })}
          <div>
            {btnNext
              && (
                <div>
                  <button
                    type="button"
                    data-testid="btn-next"
                    onClick={
                      this.nextQues
                    }
                  >
                    Next
                  </button>
                </div>)}
          </div>
        </div>

      </div>
    );
  }
}

ContentGames.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect()(ContentGames);
