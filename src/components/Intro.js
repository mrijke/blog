import React from "react";
import Link from "gatsby-link";

import { rhythm } from "../utils/typography";
import profilePic from "./profile-pic.png";

export class Intro extends React.PureComponent {
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
          Hi! I'm{" "}
          <a href="https://github.com/mrijke">
            <strong>Maarten Rijke</strong>
          </a>, a Dutch dude passionate about anything React &amp; TypeScript!<br />
          This is my blog. I'll occasionally write here about my adventures in
          the land of modern frontend development and perhaps also about some
          sysadmin/devops related things. Read my Hello World post over{" "}
          <Link to="/hello-world">here</Link>.<br />
          Current stack of choice:<br />
          <strong>Backend</strong>: Python (<a href="https://www.djangoproject.com/">
            Django
          </a>{" "}
          &amp;{" "}
          <a href="http://www.django-rest-framework.org/">
            django-rest-framework
          </a>)<br />
          <strong>Frontend</strong>: TypeScript (React/Redux/Redux-Saga)<br />
        </p>
      </div>
    );
  }
}
