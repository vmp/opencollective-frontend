import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ThemeProvider } from 'styled-components';
import { ApolloProvider } from 'react-apollo';

// For old browsers without window.Intl
import 'intl';
import 'intl/locale-data/jsonp/en.js';
import 'intl-pluralrules';
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/dist/locale-data/en';

import { IntlProvider } from 'react-intl';

import UserProvider from '../components/UserProvider';
import StripeProviderSSR from '../components/StripeProvider';
import withData from '../lib/withData';
import theme from '../lib/theme';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'; // eslint-disable-line node/no-unpublished-import
import '../node_modules/nprogress/nprogress.css'; // eslint-disable-line node/no-unpublished-import
import '../static/styles/app.css';

Router.onRouteChangeStart = () => NProgress.start();

Router.onRouteChangeComplete = () => NProgress.done();

Router.onRouteChangeError = () => NProgress.done();

import { getGoogleMapsScriptUrl, loadGoogleMaps } from '../lib/google-maps';
import sentryLib from '../lib/sentry';

const { Sentry, captureException } = sentryLib();

// Use JSDOM on server-side so that react-intl can render rich messages
// See https://github.com/formatjs/react-intl/blob/c736c2e6c6096b1d5ad1fb6be85fa374891d0a6c/docs/Getting-Started.md#domparser
if (!process.browser) {
  global.DOMParser = new (require('jsdom').JSDOM)().window.DOMParser;
}

class OpenCollectiveFrontendApp extends App {
  static propTypes = {
    pageProps: PropTypes.object.isRequired,
    initialNow: PropTypes.number.isRequired,
    scripts: PropTypes.object.isRequired,
    locale: PropTypes.string,
    messages: PropTypes.object,
  };

  constructor() {
    super(...arguments);
    this.state = { hasError: false, errorEventId: undefined };
  }

  static async getInitialProps({ Component, ctx }) {
    try {
      let pageProps = {};

      if (Component.getInitialProps) {
        pageProps = (await Component.getInitialProps(ctx)) || {};
      }

      const scripts = {};

      if (pageProps.scripts) {
        if (pageProps.scripts.googleMaps) {
          if (ctx.req) {
            scripts['google-maps'] = getGoogleMapsScriptUrl();
          } else {
            try {
              await loadGoogleMaps();
            } catch (e) {
              console.error(e);
            }
          }
        }
      }

      // Get react-intl data from props or local data if client side
      const { locale, messages } = ctx.req || window.__NEXT_DATA__.props;

      // Store server time to avoid React checksum mistmatch that could happen
      // with react-intl `FormattedRelative` when server and client time are different.
      // See https://github.com/formatjs/react-intl/issues/254
      const initialNow = Date.now();

      return { pageProps, scripts, initialNow, locale, messages };
    } catch (error) {
      return { hasError: true, errorEventId: captureException(error, ctx) };
    }
  }

  static getDerivedStateFromProps(props, state) {
    // If there was an error generated within getInitialProps, and we haven't
    // yet seen an error, we add it to this.state here
    return {
      hasError: props.hasError || state.hasError || false,
      errorEventId: props.errorEventId || state.errorEventId || undefined,
    };
  }

  componentDidCatch(error, errorInfo) {
    const errorEventId = captureException(error, { errorInfo });
    this.setState({ hasError: true, errorEventId });
  }

  componentDidMount() {
    Router.events.on('routeChangeComplete', url => {
      if (window && window._paq) {
        if (url.match(/\/signin\/sent/)) {
          window._paq.push(['setCustomUrl', '/signin/sent']);
        } else {
          window._paq.push(['setCustomUrl', url]);
        }
        window._paq.push(['trackPageView']);
      }
    });
  }

  render() {
    const { client, Component, pageProps, scripts, initialNow, locale, messages } = this.props;

    if (this.state.hasError) {
      return (
        <section>
          <h1>There was an error!</h1>
          <p>
            <a href="#" onClick={() => Sentry.showReportDialog({ eventId: this.state.errorEventId })}>
              📣 Report this error
            </a>
          </p>
          <p>
            <a
              href="#"
              onClick={() => {
                window.location.reload(true);
              }}
            >
              Or, try reloading the page
            </a>
          </p>
        </section>
      );
    }

    return (
      <Fragment>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <StripeProviderSSR>
              <IntlProvider initialNow={initialNow} locale={locale || 'en'} messages={messages}>
                <UserProvider apiKey={process.env.STRIPE_KEY}>
                  <Component {...pageProps} />
                </UserProvider>
              </IntlProvider>
            </StripeProviderSSR>
          </ThemeProvider>
        </ApolloProvider>
        {Object.keys(scripts).map(key => (
          <script key={key} type="text/javascript" src={scripts[key]} />
        ))}
      </Fragment>
    );
  }
}

export default withData(OpenCollectiveFrontendApp);
