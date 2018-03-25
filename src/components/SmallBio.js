import React from "react";

// Import typefaces
import "typeface-montserrat";
import "typeface-merriweather";

import profilePic from "./profile-pic.png";
import { rhythm } from "../utils/typography";

class SmallBio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={`Maarten Rijke`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
        <p>
          Hi! I'm <strong>Maarten Rijke</strong>, a Dutch dude passionate about
          anything TypeScript/React &amp; Python/Django!<br />
          <a href="https://github.com/mrijke">Check out my GitHub.</a>
        </p>
      </div>
    );
  }
}

export default SmallBio;
