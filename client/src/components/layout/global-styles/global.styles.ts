import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    font-size: 1.2em;
    box-sizing: border-box;
    --main-color: #2980b9;
    --main-color-hover: #2e90d1;
    --main-color-light: #eaf5fa;
    --secondary-color: #28b485;
    --secondary-color-hover: #2ed19b;
    --secondary-color-light: #eafaf5;
    --alert-color: #ff4d4d;
    --alert-color-hover: #ff6666;
    --alert-color-light: #ffe6e6;
    --text-color-black: #000000;
    --text-color-white: #ffffff;
    --text-color-grey: #777777;
    
    @media(max-width: 56em) {
      font-size: 1em;
    }
    @media(max-width: 44em) {
      font-size: 0.9em;
    }
  }
	body {
    font-family: "Roboto", sans-serif;
    color: var(--text-color);
    margin: 0;
    padding: 0;
    background-color: var(--bg-color);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
	a {
		text-decoration: none;
		color: black;
  }
  h1, h2, h3, h4 {
    margin: 0;
  }
  
	*,
  ::before,
  ::after {
		box-sizing: inherit;
  }
  input, textarea {
    border: none;
    outline: none;
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;
