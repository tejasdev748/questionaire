import React, { Component, ReactElement } from "react";
import { QUESTIONS } from "./questions";

type ANSWER = "yes" | "no";

interface AppState {
  answerSet: any;
  score: number | undefined;
  average: number | undefined;
}

class App extends Component<{}, Partial<AppState>> {
  state: Partial<AppState> = {
    answerSet: new Map<number, ANSWER>(),
    score: undefined,
  };

  componentDidMount(): void {
    this.setState({
      average: this.getAverage(),
    });
  }

  showQuestions = () => {
    let questionsView: ReactElement[] = [];
    for (const questionNo in QUESTIONS) {
      if (Object.hasOwnProperty.call(QUESTIONS, questionNo)) {
        const question = (
          <li>
            <div>{QUESTIONS[questionNo]}</div>
            <div>{this.choooseAnswer(questionNo)}</div>
          </li>
        );

        questionsView.push(question);
      }
    }
    return <ol>{questionsView}</ol>;
  };

  choooseAnswer = (questionNo: string) => {
    const selectedAnswer = this.state.answerSet.has(Number(questionNo))
      ? this.state.answerSet.get(Number(questionNo))
      : undefined;
    return (
      <>
        <div>
          <input
            type="radio"
            checked={selectedAnswer === "yes"}
            onChange={() => this.onSelectAnswer(Number(questionNo), "yes")}
          />
          <label>Yes</label>
        </div>
        <div>
          <input
            type="radio"
            checked={selectedAnswer === "no"}
            onChange={() => this.onSelectAnswer(Number(questionNo), "no")}
          />
          <label>No</label>
        </div>
      </>
    );
  };

  onSelectAnswer = (questionNo: number, answer: ANSWER) => {
    const answerSet = new Map(this.state.answerSet);
    answerSet.set(questionNo, answer);
    this.setState({
      answerSet,
    });
  };

  calculateScore = () => {
    let noOfYes = 0;
    for (const value of this.state.answerSet.values()) {
      if (value === "yes") noOfYes += 1;
    }
    const score = (100 * noOfYes) / Object.keys(QUESTIONS).length;
    let noOfRuns = 1;
    let totalScores = score;
    if (sessionStorage.getItem("averageScoreDetails") !== null) {
      const averageScoreInfo = JSON.parse(
        sessionStorage.getItem("averageScoreDetails") as string
      );
      noOfRuns += averageScoreInfo.noOfRuns;
      totalScores += averageScoreInfo.average;
    }
    sessionStorage.setItem(
      "averageScoreDetails",
      JSON.stringify({
        noOfRuns,
        average: totalScores / noOfRuns,
      })
    );

    this.setState({
      score,
      average: totalScores / noOfRuns,
    });
  };

  getAverage = () => {
    let average = undefined;
    console.log(sessionStorage.getItem("averageScoreDetails"));
    if (sessionStorage.getItem("averageScoreDetails") !== null) {
      let temp = JSON.parse(
        sessionStorage.getItem("averageScoreDetails") as string
      );
      average = temp.average;
    }
    return average;
  };
  render() {
    return (
      <div className="main__wrap">
        <main className="container">
          <div>TODO</div>
          {this.showQuestions()}
          <button
            disabled={this.state.answerSet.size < 5}
            onClick={this.calculateScore}
          >
            Calculate
          </button>
          {this.state.score && <div>Score: {this.state.score}</div>}
          {this.state.average && <div>Average: {this.state.average}</div>}
        </main>
      </div>
    );
  }
}

export default App;
