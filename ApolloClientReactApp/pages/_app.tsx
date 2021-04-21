import React, { useEffect } from "react";
import Head from "next/head";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { ThemeProvider } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import createCache from "@emotion/cache";
import theme from "../theme/theme";
import themeDark from "../theme/themeDark";
import { useApollo, currentThemeVar } from "../graphql/apolloProvider";

export const cache = createCache({ key: "css", prepend: true });

const MyApp = ({ Component, pageProps }) => {
  const apolloClient = useApollo();
  const currentTheme = useReactiveVar(currentThemeVar);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={cache}>
      <Head>
        <title>Speaker list</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={currentTheme === "light" ? theme : themeDark}>
          <CssBaseline />
          <Container>
            <Component {...pageProps} />
          </Container>
        </ThemeProvider>
      </ApolloProvider>
    </CacheProvider>
  );
};

export default MyApp;
