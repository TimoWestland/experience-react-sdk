import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Switch, Route, Redirect } from 'react-router-dom';
import { CmsPage, RenderCmsComponent } from 'bloomreach-experience-react-sdk';

import Banner from './components/banner';
import Content from './components/content';
import NewsItem from './components/news-item';
import NewsList from './components/news-list';

const cmsUrls = {};

const componentDefinitions = {
  "Banner": { component: Banner, wrapInContentComponent: true },
  "Content": { component: Content, wrapInContentComponent: true },
  "News List": { component: NewsList },
  "News Item": { component: NewsItem, wrapInContentComponent: true }
};

const createLink = (href, linkText, className) => {
  return (<Link className={className} to={href}>{linkText()}</Link>)
}

class App extends React.Component {
  render() {
    // hostname and URL-path are used for detecting if site is viewed in CMS preview
    // and for fetching Page Model for the viewed page
    const request = { hostname: window.location.hostname, path: window.location.pathname };
    
    return (
      <CmsPage componentDefinitions={componentDefinitions} cmsUrls={cmsUrls} request={request} createLink={createLink}>
        { () =>
          <React.Fragment>
            <div id="header">
              <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <span className="navbar-brand" href="#">Client-side React Demo</span>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                  <RenderCmsComponent path="menu" />
                </div>
              </nav>
            </div>
            <div className="container marketing">
              <RenderCmsComponent />
            </div>
          </React.Fragment>
        }
      </CmsPage>
    );
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/(.*)" component={App} />
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
