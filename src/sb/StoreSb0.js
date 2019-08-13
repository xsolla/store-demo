import React, { useState } from "react";
import styled, { css } from "styled-components";
import StoreSbColor from "./StoreSbColor";
import StoreSbSize from "./StoreSbSize";

import "./sb.css";

export default function StoreSb0() {
  const [state, setstate] = useState({
    changeColor: "colorAccent"
  });

  return (
    <CssSb00>
      {/* <CssSbSection>
                    <CssSbSectionH>
                      Store
                    </CssSbSectionH>
                  </CssSbSection> */}

      <div
        style={{ alignSelf: "stretch" }}
        className="xsb_sett_block xsb_sett_block--collapsible active"
      >
        <div className="xsb_sett_h2">
          {/* <div className="xsb_sett_drag" /> */}
          <div
            data-xsb-settings-module-onoff="w_buy"
            // className="xsb_sett_offon active"
          >
            <div className="xsb_sett_onoff xsb_sett_onoff--global w-embed">
              <input
                type="checkbox"
                className="xsb_sett_check xsb_sett_check--big w-radio-input"
              />
              <label
                htmlFor="w_buy"
                data-xsb-localization="modules_hero_w_buy"
                className="xsb_sett_label w-form-label"
              >
                Store Grid (not functional)
              </label>
              {/* <div className="xsb_0_li_indicator xsb_0_li_indicator--addsett">
                  <div className="xsb_indicator xsb_indicator--ok" />
                </div> */}
            </div>
          </div>
        </div>
        <div className="xsb_set_line xsb_set_line--v">
          <ul className="xsb_sett_ul w-list-unstyled">
            <li className="xsb_sett_form_li">
              <div
                data-xsb-settings-module-onoff="rus_pegi_6"
                className="xsb_sett_toggle xsb_sett_checkfield--select"
              >
                <div className="w-embed">
                  <label
                    htmlFor="hero_w_login"
                    data-xsb-localization="modules_hero_w_susbcribe_label"
                    className="xsb_sett_label w-form-label"
                  >
                    Show categories:
                  </label>
                  <select className="xsb_sett_select" name="fpacks_sku1">
                    <option value="all">All types</option>
                    <option value="vi">Virtual Items</option>
                    <option value="vc">Virtual Currency</option>
                    <option value="ss">Subscriptions</option>
                  </select>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="xsb_set_line xsb_set_line--v">
          <ul className="xsb_sett_ul w-list-unstyled">
            <li className="xsb_sett_form_li">
              <div
                data-xsb-settings-module-onoff="rus_pegi_6"
                className="xsb_sett_toggle xsb_sett_checkfield--select"
              >
                <div className="w-embed">
                  <label
                    htmlFor="hero_w_login"
                    data-xsb-localization="modules_hero_w_susbcribe_label"
                    className="xsb_sett_label w-form-label"
                  >
                    Show groups:
                  </label>
                  <select className="xsb_sett_select" name="fpacks_sku1">
                    <option value="all">All groups</option>
                    <option value="vi">Weapons</option>
                    <option value="vc">Shields</option>
                  </select>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="xsb_set_line xsb_set_line--note">
          <div className="xsb_set_hint">
            <p>
              Set up your items in{" "}
              <a
                href="https://publisher.xsolla.com/15924/projects/37471/storefront/virtual-items/groups/8593"
                className="xsb_link_white xsb_link_white--hint"
                target="_blank"
              >
                Store CMS
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* <div
          style={{ alignSelf: 'stretch' }}
          className="xsb_sett_block xsb_sett_block--collapsible active"
        >
          <div className="xsb_sett_h2">
            <div className="xsb_sett_drag" />
            <div
              data-xsb-settings-module-onoff="w_buy"
              //className="xsb_sett_offon active"
            >
              <div className="xsb_sett_onoff xsb_sett_onoff--global w-embed">
                <input
                  id="w_buy"
                  type="checkbox"
                  name="w_buy"
                  defaultValue="w_buy"
                  data-name="w_buy"
                  className="xsb_sett_check xsb_sett_check--big w-radio-input"
                />
                <label
                  htmlFor="w_buy"
                  data-xsb-localization="modules_hero_w_buy"
                  className="xsb_sett_label w-form-label"
                >
                  Color
                </label>

              </div>
            </div>
          </div>
          <div className="xsb_set_line">

          <ColorRandomizer/>

          </div>

        </div> */}

      <div
        style={{ alignSelf: "stretch" }}
        className="xsb_sett_block xsb_sett_block--collapsible active"
      >
        <div className="xsb_sett_h2">
          {/* <div className="xsb_sett_drag" /> */}
          <label className="xsb_sett_label w-form-label">Store Style</label>
        </div>

        <div className="xsb_set_line">
          <p>
            <label className="xsb_sett_label w-form-label">Colors</label>
          </p>
          <CssColorSwitcher>
            <CssColorSwitch
              active={state["changeColor"] === "colorText" ? true : false}
              onClick={() => {
                setstate({ changeColor: "colorText" });
              }}
            >
              Text
            </CssColorSwitch>

            <CssColorSwitch
              active={state["changeColor"] === "colorAccent" ? true : false}
              onClick={() => {
                setstate({ changeColor: "colorAccent" });
              }}
            >
              Accent
            </CssColorSwitch>

            <CssColorSwitch
              active={state["changeColor"] === "colorBg" ? true : false}
              onClick={() => {
                setstate({ changeColor: "colorBg" });
              }}
            >
              Bg
            </CssColorSwitch>
          </CssColorSwitcher>

          <StoreSbColor changeOneColor={state["changeColor"]} />
        </div>

        <hr />

        <div className="xsb_set_line">
          <p>
            <label className="xsb_sett_label w-form-label">Grid Size</label>
          </p>
          <StoreSbSize />
          <br />
        </div>
      </div>
    </CssSb00>
  );
}

const CssColorSwitcher = styled.div`
  width: 100%;
  display: grid;
  /* grid-template-columns: auto; */
  grid-auto-flow: column dense;
  grid-column-gap: 6px;
  margin-bottom: 4px;
`;

const CssColorSwitch = styled.div`
  flex-grow: 1;
  cursor: pointer;
  background-color: #506373;
  display: flex;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 1px solid rgba(145, 159, 169, 0.17);
  ${props =>
    props.active &&
    css`
      background: white;
      color: #506373;
    `}
  &:hover {
    border: 1px solid #ddd;
  }
`;

const CssSbSection = styled.div`
  background-color: #506373;
  display: flex;
  width: 100%;
  align-items: center;
  margin: 16px;
  padding: 16px;
  border: 1px solid #ddd;
`;
const CssSbSectionH = styled.div`
  background-color: #506373;
  display: flex;
  align-items: center;
`;
const CssSb00 = styled.div`
  font-family: Roboto, Arial, Helvetica, sans-serif;
  font-size: 12px;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  /* width: 100%; */
  align-items: center;
  justify-content: center;
  /* align-content: stretch; */
  /* height: 100vh; */
`;
