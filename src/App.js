import React, { useState } from 'react';
import {
  Form, FormGroup, Label, Input, Button, TabContent, TabPane, Nav, NavItem, NavLink, Table,
} from 'reactstrap';
import './App.css';
import constants from './utils/constants';
import apiMethod from './utils/api';

const {
  categories, apiUrl, apiKey, tableHeaders,
} = constants;

function App() {
  const [watchedResults, setWatchedResults] = useState([]);
  const [savedResults, setSavedResults] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [fetchResult, setFetchResult] = useState([]);

  const renderCategories = () => categories.map((category) => (
    <option>{category}</option>
  ));

  const selectFilter = ({ currentInfo }) => {
    const { name, year, category } = currentInfo;
    const filter = { t: name, category, apiKey };
    if (year) {
      filter.year = year;
    }
    return filter;
  };

  const renderTableHeaders = () => (
    <thead>
      <tr>
        {tableHeaders.map((header) => (<th>{header}</th>))}
      </tr>
    </thead>
  );

  const renderActionButtons = ({ data }) => (!data.isSaved
    ? (
      <Button
        color="primary"
        onClick={() => {
          data.isSaved = true;
          data.isWatched = false;
          savedResults.push(data);
          setSavedResults([...savedResults]);
        }}
      >
        Save Content
      </Button>
    ) : 'Item Saved'
  );

  const renderTableBody = ({ data }) => (
    <tbody>
      <tr>
        {tableHeaders.map((header) => (
          <td>
            {header === 'Actions' ? renderActionButtons({ data }) : data[header]}
          </td>
        ))}
      </tr>
    </tbody>
  );

  const renderInfo = ({ data }) => (
    <Table>
      {renderTableHeaders()}
      {renderTableBody({ data })}
    </Table>
  );

  const [currentInfo, setCurrentInfo] = useState({
    name: '',
    category: 'Movies',
    year: null,
  });

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const saveForm = async () => {
    const query = selectFilter({ currentInfo });
    const { data } = await apiMethod({
      url: apiUrl,
      method: 'GET',
      query,
    });
    data.isSaved = false;
    setFetchResult(data);
  };

  const renderWatchAndDeleteButtons = ({ index }) => (
    savedResults.length > 0 && !savedResults[index].isWatched ? (
      <>
        <Button
          color="primary"
          className="btnClass"
          onClick={() => {
            savedResults[index].isWatched = true;
            setWatchedResults([...savedResults]);
          }}
        >
          Watched
        </Button>
        <Button
          color="primary"
          onClick={() => {
            savedResults[index].isSaved = false;
            savedResults.splice(index, 1);
            setSavedResults([...savedResults]);
          }}
        >
          Remove
        </Button>
      </>
    ) : 'Added to WatchList'
  );

  const renderSavedInfo = () => (
    savedResults.map((result, index) => (
      <tbody>
        <tr>
          {tableHeaders.map((header) => (
            <td>
              {header === 'Actions' ? renderWatchAndDeleteButtons({ index }) : result[header]}
            </td>
          ))}
        </tr>
      </tbody>
    ))
  );

  const renderWatchedData = () => (
    watchedResults.map((result) => (
      <tbody>
        <tr>
          {tableHeaders.map((header) => (
            <td>
              {header === 'Actions' ? 'None' : result[header]}
            </td>
          ))}
        </tr>
      </tbody>
    ))
  );

  const renderSavedItems = () => (
    <Table>
      {renderTableHeaders()}
      {renderSavedInfo()}
    </Table>
  );

  const renderWatchedItems = () => (
    <Table>
      {renderTableHeaders()}
      {renderWatchedData()}
    </Table>
  );

  return (
    <div className="App">
      <h1 className="heading">Entertainment Zone</h1>
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              onClick={() => { toggle(1); }}
            >
              Search Page
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => { toggle(2); }}
            >
              My Content
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={1}>
            <Form className="formClass" inline>
              <FormGroup className="fieldClass">
                <Label for="Title">Title</Label>
                <Input
                  type="email"
                  name="title"
                  className="textBoxStyle"
                  placeholder="Search by Title"
                  value={currentInfo.name}
                  onChange={(e) => {
                    setCurrentInfo({
                      ...currentInfo,
                      name: e.target.value,
                    });
                  }}
                />
              </FormGroup>
              <FormGroup className="fieldClass">
                <Label for="category">Category</Label>
                <Input
                  type="select"
                  onChange={(e) => {
                    setCurrentInfo({
                      ...currentInfo,
                      category: e.target.value,
                    });
                  }}
                >
                  {renderCategories()}
                </Input>
              </FormGroup>
              <FormGroup className="fieldClass">
                <Label for="releaseYear">Release Year</Label>
                <Input
                  type="number"
                  name="releaseYear"
                  className="textBoxStyle"
                  placeholder="Year"
                  value={currentInfo.year}
                  onChange={(e) => {
                    setCurrentInfo({
                      ...currentInfo,
                      year: e.target.value,
                    });
                  }}
                />
              </FormGroup>
              <Button
                color="secondary"
                onClick={() => saveForm()}
              >
                Submit

              </Button>
            </Form>
            {fetchResult.length !== 0 ? renderInfo({ data: fetchResult, savedResults }) : ''}
          </TabPane>
          <TabPane tabId={2}>
            <Nav tabs>
              <NavItem>
                <NavLink
                  onClick={() => { toggle(2); }}
                >
                  Saved Content
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  onClick={() => { toggle(3); }}
                >
                  Watched
                </NavLink>
              </NavItem>
            </Nav>
            {savedResults.length > 0 ? renderSavedItems() : (<h3>No Saved Result</h3>)}
          </TabPane>
          <TabPane tabId={3}>
            {watchedResults.length > 0 ? renderWatchedItems() : (<h3>No Watched Results</h3>)}
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
}

export default App;
