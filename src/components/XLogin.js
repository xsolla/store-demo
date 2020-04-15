import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouteMatch } from 'react-router-dom';

import {routes} from "../utils/routes";

const XLogin = () => {
  const [loginId, setLoginId] = useState();

  const match = useRouteMatch({
    path: routes.specificProjectAndLogin,
    strict: false,
    sensitive: true,
  });

  if (!match) {
    return '';
  }

  window.XL.init({
    projectId: loginId,
    loginUrl: window.location.href,
    locale: 'en_US',
    onlyWidgets: true,
    fields: 'email',
    theme: 'https://cdn3.xsolla.com/files/uploaded/15924/bfe7e2a5a75fb6f53d04de645ec7c542.css'
  });

  useEffect(() => {
    if (loginId) {
      const element_id = 'xl_auth';
      const options = {
        'width': 600,
        'height': 550
      };
      window.XL.AuthWidget(element_id, options);
    }
  }, []);

  if ((match.params.projectId && match.params.loginId) || loginId) {
    if (!loginId) {
      setLoginId(match.params.loginId);
    }

    return (
        <div>
          <CssXpop>
            <CssXpopB>
              <CssLoginPop>
                <div id='xl_auth' />
              </CssLoginPop>

              <CssLoginInfo>
                {myProjects.map((onePr, i) => {
                  let pr = onePr['project_id'];
                  let url = window.location.href;
                  return (
                      <div key={pr + i} style={{ marginBottom: '1em' }}>
                        <div style={{ fontSize: '0.4em' }}>
                          <a href={url}>
                            {pr}: {onePr.projectName}
                          </a>
                        </div>
                      </div>
                  );
                })}
                <p>
                  Open any Xsolla Store using params <br />
                  /#/project/PROJECT_ID/login/LOGIN_ID
                  <br />
                  login must point back to {window.location.href}#/project/PROJECT_ID/login/LOGIN_ID
                </p>
              </CssLoginInfo>
            </CssXpopB>
            <CssXpopZ />
          </CssXpop>
        </div>
    );
  }

  return '';
};

export default XLogin;

const CssXpop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  overflow-y: scroll;
  padding: 40px 0;
`;
const CssXpopB = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 100%;
  z-index: 100;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
`;
const CssXpopZ = styled.div`
  position: fixed;
  z-index: 99;
  background: rgba(0, 0, 0, 0.8);
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const CssLoginInfo = styled.div`
  padding: 20px 70px;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
  font-size: 22px;
  width: 600px;
  & a {
    /* font-family: 'PS Mono', Courier, monospace; */
    text-decoration: underline;
    font-size: 28px;
    line-height: 0px;
  }
`;
const CssLoginPop = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  text-align: center;
  padding: 36px;
  overflow: hidden;
  margin: 0 70px;
  border-radius: 8px;
`;

const myProjects = [
  {
    projectName: 'Xsolla Store Demo',
    project_id: 47278,
    login_id: 'fb2d7c69-bf25-11e9-9244-42010aa80004',
  },
];
