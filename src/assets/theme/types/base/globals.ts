export interface ILinkStyles {
  color: string;
  transition?: string;
}

export interface IGlobals {
  html: {
    scrollBehavior: string;
  };
  "*, *::before, *::after": {
    margin: number;
    padding: number;
  };
  "a, a:link, a:visited": {
    textDecoration: string;
  };
  "a.link, .link, a.link:link, .link:link, a.link:visited, .link:visited": ILinkStyles;
  "a.link:hover, .link:hover, a.link:focus, .link:focus": {
    color: string;
  };
}