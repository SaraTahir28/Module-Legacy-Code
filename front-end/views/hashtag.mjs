import {renderOne, renderEach, destroy} from "../lib/render.mjs";
import {
  state,
  apiService,
  getLogoutContainer,
  getLoginContainer,
  getTimelineContainer,
  getHeadingContainer,
} from "../index.mjs";
import {createLogin, handleLogin} from "../components/login.mjs";
import {createLogout, handleLogout} from "../components/logout.mjs";
import {createBloom} from "../components/bloom.mjs";
import {createHeading} from "../components/heading.mjs";

// Hashtag view: show all tweets containing this tag

function hashtagView(hashtag) {
  destroy();// Tear down any previously rendered view before drawing this one.
   const formattedHashtag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;// Ensure the hashtag always has a leading '#' so comparisons are reliable.
  //Only fetch data if the hashtag has changed since the last render. 
  // This prevents infinite loops caused by re-renders or route updates.
   if (state.currentHashtag !== formattedHashtag) {
    state.currentHashtag = hashtag; // Store the new hashtag BEFORE fetching so the next render sees the update.
    apiService.getBloomsByHashtag(hashtag); // Retrieve all blooms associated with this hashtag from the API.
  }

 

  renderOne(
    state.isLoggedIn,
    getLogoutContainer(),
    "logout-template",
    createLogout
  );
  document
    .querySelector("[data-action='logout']")
    ?.addEventListener("click", handleLogout);
  renderOne(
    state.isLoggedIn,
    getLoginContainer(),
    "login-template",
    createLogin
  );
  document
    .querySelector("[data-action='login']")
    ?.addEventListener("click", handleLogin);

  renderOne(
    state.currentHashtag,
    getHeadingContainer(),
    "heading-template",
    createHeading
  );
  renderEach(
    state.hashtagBlooms || [],
    getTimelineContainer(),
    "bloom-template",
    createBloom
  );
}

export {hashtagView};
