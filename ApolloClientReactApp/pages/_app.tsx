import React, { useEffect } from "react";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import createCache from "@emotion/cache";
import theme from "../theme/theme";
import { useApollo } from "../graphql/apolloProvider";

export const cache = createCache({ key: "css", prepend: true });

const MyApp = ({ Component, pageProps }) => {
  const apolloClient = useApollo();

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
      <ThemeProvider theme={theme}>
        <ApolloProvider client={apolloClient}>
          <CssBaseline />
          <Container>
            <Component {...pageProps} />
          </Container>
        </ApolloProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
