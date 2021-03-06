import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

import {useGetParamsMatch} from "../utils/useGetParamsMatch";
import {snakeToCamel} from "../utils/converters";
import config from './../appConfig.json';

const XLogin = () => {
  const [loginId, setLoginId] = useState();
  const match = useGetParamsMatch(['project_id', 'login_id'], snakeToCamel);

  useEffect(() => {
    if (loginId) {
      window.XL.init({
        projectId: loginId,
        loginUrl: window.location.href.split('/#/')[0],
        locale: 'en_US',
        onlyWidgets: true,
        fields: 'email',
        theme: 'https://cdn3.xsolla.com/files/uploaded/15924/bfe7e2a5a75fb6f53d04de645ec7c542.css'
      });

      const element_id = 'xl_auth';
      const options = {
        'width': 600,
        'height': 550
      };
      window.XL.AuthWidget(element_id, options);
    }
  }, [loginId]);

  if (!loginId && match) {
    setLoginId(match.params.loginId);
  }

  const {projectId: defaultProjectId, loginId: defaultLoginId} = config;
  let url = window.location.href.split('/#/')[0] + '/#/';
  let urlFull = `${url}?project_id=${defaultProjectId}&login_id=${defaultLoginId}`;

  return React.useMemo(
    () =>
      match && (
        <div>
          <CssXpop>
            <CssXpopB>
              <CssLoginPop>
                <div id='xl_auth'/>
              </CssLoginPop>
              <CssLoginInfo>
                <div style={{marginBottom: '1em'}}>
                  <div style={{fontSize: '0.4em'}}>
                    <a
                      href={urlFull}
                      onClick={() => {
                      window.location.href = urlFull;
                      window.location.reload();
                    }}>
                      {defaultProjectId}: Xsolla Store Demo
                    </a>
                  </div>
                </div>
                <p>
                  Open any Xsolla Store using GET parameters <br/>
                  <b>project_id</b> and <b>login_id</b> (login must point back to {window.location.href.split('/#/')[0]})
                </p>
              </CssLoginInfo>
            </CssXpopB>
            <CssXpopZ/>
          </CssXpop>
        </div>
      ),
    [loginId]
  );
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
