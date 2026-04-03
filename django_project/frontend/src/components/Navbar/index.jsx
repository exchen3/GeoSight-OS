/**
 * GeoSight is UNICEF's geospatial web-based business intelligence platform.
 *
 * Contact : geosight-no-reply@unicef.org
 *
 * .. note:: This program is free software; you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation; either version 3 of the License, or
 *     (at your option) any later version.
 *
 * __author__ = 'irwan@kartoza.com'
 * __date__ = '13/06/2023'
 * __copyright__ = ('Copyright 2023, Unicef')
 */

/* ==========================================================================
   NAVBAR
   ========================================================================== */

import React, { Fragment, useRef } from "react";
import { useSelector } from "react-redux";
import $ from "jquery";
import { useTranslation } from "react-i18next";

import User from "./User";
import { EmbedConfig } from "../../utils/embed";
import { CogIcon, EditIcon, GlobeIcon, HelpIcon } from "../Icons";
import { ThemeButton } from "../Elements/Button";
import { HelpCenter } from "../HelpCenter";
import NotificationBadge from "../NotificationBadge";
import NotificationMaintenance from "../NotificationMaintenance";
import LanguageSelector from "../LanguageSelector";
import { useTheme } from "../../providers/ThemeContext";

import "./style.scss";

/**
 * Navbar.
 * **/
export function GeoRepoIndicator() {
  const { username } = user;
  let referenceLayerData = null;
  try {
    const { referenceLayer } = useSelector((state) => state.dashboard.data);
    referenceLayerData = useSelector(
      (state) => state.referenceLayerData[referenceLayer?.identifier],
    );
  } catch (err) {}

  return (
    <>
      {username &&
      preferences.georepo_using_user_api_key &&
      preferences.georepo_api.api_key_is_public ? (
        referenceLayerData?.error ? (
          <ThemeButton variant="Error" className="GeorepoApiKeyBtn">
            <a href={"/admin/user/" + user.username + "/edit"}>
              Click to add GeoRepo API Key
            </a>
          </ThemeButton>
        ) : (
          <></>
        )
      ) : preferences.georepo_api.api_key_not_working ? (
        <ThemeButton variant="Error" className="GeorepoApiKeyBtn">
          <a href={"/admin/user/" + user.username + "/edit"}>
            Your API Key is invalid, update your api key.
          </a>
        </ThemeButton>
      ) : (
        <ThemeButton
          id="GeorepoApiKeyBtnUpdate"
          variant="Error"
          className="GeorepoApiKeyBtn Hidden"
        >
          <a href={"/admin/user/" + user.username + "/edit"}>
            Your API Key is invalid, update your API key.
          </a>
        </ThemeButton>
      )}
    </>
  );
}

/** Sun icon for light mode */
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0-5a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM3 11h2a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm16 0h2a1 1 0 0 1 0 2h-2a1 1 0 0 1 0-2zM5.636 4.222a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 1 1-1.414 1.414L5.636 5.636a1 1 0 0 1 0-1.414zm12.728 0a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zM7.05 17.364a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zm9.9 0a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 0 1-1.414 1.414l-1.414-1.414a1 1 0 0 1 0-1.414z"/>
    </svg>
  );
}

/** Moon icon for dark mode */
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
    </svg>
  );
}

export default function NavBar({ minified }) {
  const helpPageRef = useRef(null);
  const { icon, small_icon, site_title, site_type } = preferences;
  const { is_contributor } = user;
  const user_permission = useSelector(
    (state) => state.dashboard?.data?.user_permission,
  );
  const { t, i18n } = useTranslation();
  const { colorMode, toggleColorMode } = useTheme();

  // Set width of logo
  // Not working using css on firefox
  $(".page__header-logo").width($(".page__header-link").width());
  const canAccessAdmin = is_contributor && !EmbedConfig().id;
  let dashboardEditUrl = null;
  try {
    dashboardEditUrl = urls.dashboardEditUrl;
  } catch (err) {}
  const homepageUrl = "/" + i18n.language.toLowerCase();
  const iconUrl = minified ? small_icon : icon;
  return (
    <Fragment>
      <header>
        <div className={`NavHeader Nav-${site_type}`}>
          {iconUrl && (
            <div className="NavHeaderLogo">
              <div className="NavHeaderLogo-Wrapper Fullscreen">
                <a
                  href={homepageUrl}
                  title={i18n.t("Homepage")}
                  className="nav-header-link"
                >
                  <img src={iconUrl} alt="Logo" />
                </a>
              </div>
              <div className="NavHeaderLogo-Wrapper Mobile">
                <a
                  href={homepageUrl}
                  title={i18n.t("Homepage")}
                  className="nav-header-link"
                >
                  <img src={small_icon} alt="Logo" />
                </a>
              </div>
            </div>
          )}
          {!iconUrl && minified && (
            <div
              className="NavHeaderLogo"
              style={{ width: "100%", textAlign: "center" }}
            >
              <a
                href={homepageUrl}
                title={i18n.t("Homepage")}
                className="nav-header-link"
              >
                G
              </a>
            </div>
          )}
          <a
            href={homepageUrl}
            title={i18n.t("Homepage")}
            className="NavHeaderLink Fullscreen"
          >
            {site_title}{" "}
            {site_type == "Staging" ? (
              <span className="ServerType">Staging</span>
            ) : (
              ""
            )}
          </a>
          <NotificationMaintenance />
          <div className="Separator"></div>
          {headerTitle ? (
            <div className="MiddleSection">{headerTitle}</div>
          ) : null}
          <div className="Separator"></div>
          {user_permission?.edit && dashboardEditUrl ? (
            <div
              className="LinkButton AdminLinkButton EditProjectLinkButton"
              style={{ marginRight: "1rem" }}
              title="Edit project"
            >
              <a href={dashboardEditUrl}>
                <EditIcon />
              </a>
            </div>
          ) : null}
          <GeoRepoIndicator />
          {canAccessAdmin && (
            <div
              className="LinkButton AdminLinkButton Fullscreen"
              style={{ marginRight: "1rem" }}
            >
              <NotificationBadge />
              <a href={urls.admin.dashboardList}>
                <ThemeButton variant="white">
                  <CogIcon /> {t("dashboardPage.adminPanelButton")}
                </ThemeButton>
              </a>
            </div>
          )}
          <LanguageSelector>
            <div
              className="AdminLinkButton LanguageSelector Fullscreen"
              style={{ marginRight: "1rem", cursor: "pointer" }}
            >
              <GlobeIcon />
            </div>
          </LanguageSelector>
          <div className="HelpButton .SvgButton Fullscreen">
            <a
              href="#"
              onClick={(_) => {
                helpPageRef?.current.open();
              }}
            >
              <HelpIcon />
            </a>
          </div>
          <button
            className="DarkModeToggle SvgButton"
            onClick={toggleColorMode}
            title={colorMode === 'dark' ? t('Switch to light mode') : t('Switch to dark mode')}
            aria-label={colorMode === 'dark' ? t('Switch to light mode') : t('Switch to dark mode')}
          >
            {colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <User />
        </div>
      </header>
      <HelpCenter ref={helpPageRef} />
    </Fragment>
  );
}
