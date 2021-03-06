import React from 'react';
import AppContext from '../lib/app-context';

export default class UserLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listsHaveLoaded: false,
      userLists: []
    };
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
        this.setState({ userLists, listsHaveLoaded: true });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="padding-10 width-responsive">
        <div className="flex full-width align-center space-between padding-vert-10n25">
          <h3>Create A New List</h3>
          <a href="#New-List" className="flex align-center">
            <img className="height-25 click" src="/images/add-list-btn.svg" alt="add new list" />
          </a>
        </div>

        {this.state.listsHaveLoaded
          ? <>
            {this.state.userLists.length
              ? this.state.userLists.map(listItem =>
                <div key={listItem.listId} className="padding-top-5">
                  <div className="flex full-width space-between">
                    <p id={listItem.listId} className="width-76-percent click">
                      <a href={`#Read-List?listId=${listItem.listId}`}>{listItem.listTitle}</a>
                    </p>
                    <div className="center-content align-center max-height-31">
                      <p className="font-light-responsive center-content align-center">
                        {`${listItem.itemsCount} ${(listItem.itemsCount !== '1') ? 'Items' : 'Item'}`}
                      </p>
                      <img className="height-17 margin-left-5 click" src="/images/gear.svg" alt="configure list" />
                    </div>
                  </div>
                </div>
              )
              : <div className="content-center full-width padding-10">
                You have no lists at the moment.
                </div>
            }
            </>
          : <div className="full-width center-content">
              <div className="lds-dual-ring"></div>
            </div>
        }
      </div>
    );
  }
}

UserLists.contextType = AppContext;
