import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import { ProductConsumer } from "../context";
import Cookie, { parseJwt } from "./Cookie";
export default class XLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: true,
      logToken: null,
      psToken: null,
      cartId: null
    };
  }

  unauthorizedFlow = () => {
    console.log("unauthorizedFlow");
    this.setState({ logToken: null });
    this.flow = "unauthorized";
    this.setState({ shown: true });
  };

  authorizedFlow = tkn => {
    console.log("authorizedFlow", tkn);
    this.setState({ logToken: tkn, shown: false });
    this.user = parseJwt(tkn);
    this.flow = "authorized";
    this.userToken = tkn;
    let self = this;
    this.setStateFrom("user", this.user);
    this.generatePStoken(); //TODO: перенести в товары
  };

  //https://confluence.xsolla.com:8443/display/SP/POST+Generate+PayStation+token+by+JWT
  generatePStoken = () => {
    let tokenData = JSON.stringify({
      xsolla_login_user_id: this.user.sub,
      token_data: {
        user: { id: { value: this.user.sub } },
        settings: {
          project_id: window.xProjectId, //36816, //40702,
          currency: "USD",
          ui: {
            theme: "dark"
          }
        }
      }
    });
    let opts = {
      url: "https://store.xsolla.com/api/v1/xsolla_login/paystation/token",
      crossdomain: true,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.userToken
      },
      data: tokenData
    };
    // console.log('axios options = ', opts);
    let _self = this;
    axios(opts)
      .then(function(response) {
        console.log("L2PS response.data = ", response.data);
        console.log("L2PS response.data.token = ", response.data.token);
        let psToken = response.data.token;
        _self.setPsToken(psToken);
        let cartId = _self.createCart(psToken);
        this.setState({ cartId: cartId });
      })
      .catch(function(error) {
        console.log("L2PS ERROR = ", error.response);
      });
  };

  addToCart({ sku = "gun_1" }, cartId) {
    console.log("sku = ", sku);
    let opts = {
      url:
        "https://store.xsolla.com/api/v1/project/" +
        window.xProjectId +
        "/cart/" +
        cartId +
        "/item/" +
        sku,
      crossdomain: true,
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + this.userToken
      },
      data: JSON.stringify({
        quantity: 1
      })
    };
    axios(opts)
      .then(function(response) {
        console.log("L2PS response.data = ", response.data);
        console.log("L2PS response.data.token = ", response.data.token);
        let resp = response.data;
        debugger;
      })
      .catch(function(error) {
        console.log("L2PS ERROR = ", error.response);
      });
  }

  createCart = () => {
    let opts = {
      url:
        "https://store.xsolla.com/api/v1/project/" +
        window.xProjectId +
        "/cart",
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.userToken
      }
    };
    axios(opts)
      .then(function(response) {
        return response.data["id"];
      })
      .catch(function(error) {
        console.log("L2PS ERROR = ", error.response);
      });
  };

  render() {
    return (
      <div style={{ flexGrow: 1 }}>
        <ProductConsumer addCart={this.addToCart}>
          {valueFromContext => {
            this.setStateFrom = valueFromContext.setStateFrom;
            this.setPsToken = valueFromContext.setPsToken;
            this.logToken = valueFromContext.logToken;

            return (
              <div>
                <CssXpop
                  style={{ display: this.state.shown ? "flex" : "none" }}
                >
                  <CssXpopB>
                    <CssLoginInfo>
                      Current project: <b>{window.xProjectId}</b>
                    </CssLoginInfo>

                    <CssLoginPop>
                      <div id="xl_auth"></div>
                    </CssLoginPop>

                    <CssLoginInfo>
                      {myProjects.map((onePr, i) => {
                        let pr = onePr["project_id"];
                        let login = onePr["login_id"];
                        let url = `https://xsolla-react-store.netlify.com`;
                        let urlFull = `${url}?project_id=${pr}&login_id=${login}`;
                        return (
                          <div key={pr + i} style={{ marginBottom: "1em" }}>
                            {/* <div>{onePr.projectName}</div> */}
                            <div style={{ fontSize: "0.4em" }}>
                              <a href={urlFull}>
                                {pr}: {onePr.projectName}
                                {/* {url}<br /> */}
                                {/* ?project_id={pr}<br /> */}
                                {/* &login_id={login} */}
                              </a>
                            </div>
                          </div>
                        );
                      })}
                      <p>
                        Open any Xsolla Store using GET parameters <br />
                        <b>project_id</b> and <b>login_id</b> (login must point
                        back to https://xsolla-react-store.netlify.com/)
                      </p>
                    </CssLoginInfo>
                  </CssXpopB>

                  {/* <XpopZ onClick={this.handleZclick} /> */}
                  <CssXpopZ />
                </CssXpop>
              </div>
            );
          }}
        </ProductConsumer>
      </div>
    );
  }

  componentDidMount() {
    window.XloginInit();
    let cke = Cookie();
    cke ? this.authorizedFlow(cke) : this.unauthorizedFlow();
  }

  componentWillUpdate(nextProps, nextState) {
    // this.setPsToken = this.props.setPsToken;
    // console.log('this.props.psToken = ', nextState.psToken);
  }

  componentDidUpdate() {}
}

const CssXpop = styled.div`
  position: fixed;
  /* overflow-y: scroll; */
  top: 0;
  left: 20%;
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
  /* flex-basis: 50%; */
  width: 600px;
  /* text-align: center; */
  /* padding: 36px; */
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
  /* background: white; */
  overflow: hidden;
  /* width: 460px; */
  margin: 0 70px;
  border-radius: 8px;
`;

const myProjects = [
  {
    projectName: "Xsolla Demo Store",
    project_id: 37471,
    login_id: "b3632bfa-275e-11e9-9244-42010aa80004"
  },
  {
    projectName: "Xsplit",
    project_id: 36816,
    login_id: "19f1d2f2-25c3-11e9-9244-42010aa80004"
  },
  {
    projectName: "Life is Feudal",
    project_id: 21190,
    login_id: "740cd4af-2a69-11e9-9244-42010aa80004"
  }
];
