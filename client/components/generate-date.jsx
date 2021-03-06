import React from 'react';
import AppContext from '../lib/app-context';

export default class GenerateDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listsHaveLoaded: false,
      userLists: [],
      listChoiseId: '',
      costAmount: '0',
      randomDate: [],
      viewingDraw: false,
      itemDrawn: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.saveHistory = this.saveHistory.bind(this);
  }

  componentDidMount() {
    const req = {
      method: 'GET',
      headers: {
        'x-access-token': `${this.context.userInfo.token}`,
        'Content-Type': 'application/json'
      }
    };
    fetch('/api/lists', req)
      .then(res => res.json())
      .then(userLists => {
        if (userLists.length) {
          this.setState({
            listsHaveLoaded: true,
            userLists,
            listChoiseId: userLists[0].listId.toString()
          });
        } else {
          this.setState({
            listsHaveLoaded: true,
            userLists
          });
        }
      })
      .catch(err => console.error(err));
  }

  handleReturn() {
    this.setState({ viewingDraw: false });
  }

  saveHistory() {
    event.preventDefault();
    const req = {
      method: 'POST',
      headers: {
        'x-access-token': `${this.context.userInfo.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateId: this.state.randomDate[0].dateId
      })
    };
    fetch('/api/history', req)
      .catch(err => console.error(err));
    this.handleReturn();
  }

  handleSubmit() {
    event.preventDefault();
    this.setState({ itemDrawn: false });
    const req = {
      method: 'GET',
      headers: {
        'x-access-token': `${this.context.userInfo.token}`,
        'Content-Type': 'application/json'
      }
    };
    fetch(`/api/random?costAmount=${this.state.costAmount}&listId=${this.state.listChoiseId}`, req)
      .then(res => res.json())
      .then(date => {
        this.setState({ randomDate: date, viewingDraw: true, itemDrawn: true });
      });
  }

  handleChange() {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {

    return (
      <>
        <div className="full-width full-height-nim-nav center-content align-center">

          {!this.state.viewingDraw &&
            <form className="height-100-percent" onSubmit={this.handleSubmit}>
              <div className="flex align-center height-XX-percent">
                <div className="form-container border-white">
                {this.state.listsHaveLoaded
                  ? <>
                    {this.state.userLists.length > 0
                      ? <>
                        <label htmlFor="listChoiseId">Which list are we using?</label>
                        <select name="listChoiseId" id="listChoiseId"
                          className="text-box margin-bottom-7rm"
                          defaultValue={this.state.listChoiseId}
                          onChange={this.handleChange}>
                          {this.state.userLists.map(listItem => <option key={listItem.listId} value={listItem.listId}>{listItem.listTitle}</option>)}
                        </select>
                        <div className="flex align-center space-between">
                          <label htmlFor="costAmount">Cost Estimate</label>
                          <select
                            className="text-box width-55-percent"
                            name="costAmount"
                            id="costAmount"
                            required
                            onChange={this.handleChange}>
                            <option value="0">Free</option>
                            <option value="10">Less than $10</option>
                            <option value="20">Around $20</option>
                            <option value="40">Around $40</option>
                            <option value="60">Around $60</option>
                            <option value="80">Around $80</option>
                            <option value="120">Around $120</option>
                            <option value="200">Around $200</option>
                            <option value="300">Around $300</option>
                            <option value="400">The High Life</option>
                          </select>
                        </div>
                      </>
                      : <div className="full-width text-center">
                        <h3 className="form-title">You don&rsquo;t have any lists.</h3>
                        <p className="font-small">Try adding one on your <a href="#My-Lists" className="click blue">My Lists</a> page</p>
                      </div>
                    }

                    </>
                  : <div className="full-width center-content">
                    <div className="lds-dual-ring"></div>
                  </div>
                }
                </div>
              </div>
            {this.state.userLists.length > 0 &&
              <div className="full-width fixed">
                <button className="height-70 purple-fill click-up generate-btn">
                  Generate Date
                </button>
              </div>
            }
          </form>
        }

        {(this.state.viewingDraw && this.state.randomDate.length > 0) &&
          <div className="form-container">
            <form className="margin-auto" action="" onSubmit={this.handleSubmit}>
              <div className="flex space-between">
                <img className="height-25 click" src="/images/tri-colored-back-arrow.svg" alt="add new list" onClick={this.handleReturn}></img>
                <h3 className="form-title">Drawing Result:</h3>
                <div className="width-25"></div>
              </div>
              <h2 className="form-title margin-auto">
              {this.state.itemDrawn
                ? this.state.randomDate[0].dateIdea
                : <div className="lds-ellipsis"><div></div><div></div>
                  <div></div><div></div></div>
              }
              </h2>
              <div className="center-content space-between full-width">
                <button className="form-btn blue-fill click" onClick={this.saveHistory}>Let&rsquo;s Do This</button>
                <button className="form-btn purple-fill click">Draw Again</button>
              </div>
            </form>
          </div>
        }

        {(this.state.viewingDraw && !this.state.randomDate.length) &&
          <div className="form-container">
            <h3 className="form-title">No Results</h3>
            <p className="form-title">This list may be empty or no checked items have that cost.</p>
            <p className="form-title">You can add or review the dates/items to this list in your <a href={`#Read-List?listId=${this.state.listChoiseId}`} className="blue">Read-Lists</a> page.</p>
            <div>
              <button className="form-btn purple-fill full-width click" onClick={this.handleReturn}>Go back to Generator?</button>
            </div>
          </div>
        }
        </div>
      </>
    );
  }
}

GenerateDate.contextType = AppContext;
