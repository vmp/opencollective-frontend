import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Box, Flex } from '@rebass/grid';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'next/router';
import { get } from 'lodash';

import { Router } from '../server/pages';
import { API_V2_CONTEXT, gqlV2 } from '../lib/graphql/helpers';
import { ssrNotFoundError } from '../lib/nextjs_utils';
import { withUser } from '../components/UserProvider';
import ErrorPage, { generateError } from '../components/ErrorPage';
import CollectiveThemeProvider from '../components/CollectiveThemeProvider';
import Container from '../components/Container';
import CollectiveNavbar from '../components/CollectiveNavbar';
import Page from '../components/Page';
import Link from '../components/Link';
import StyledLink from '../components/StyledLink';
import SignInOrJoinFree from '../components/SignInOrJoinFree';
import ContainerOverlay from '../components/ContainerOverlay';
import ExpenseForm from '../components/expenses/ExpenseForm';
import { H4, H5 } from '../components/Text';
import FormattedMoneyAmount from '../components/FormattedMoneyAmount';
import StyledInputTags from '../components/StyledInputTags';
import CreateExpenseFAQ from '../components/faqs/CreateExpenseFAQ';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import memoizeOne from 'memoize-one';
import ExpandableExpensePolicies from '../components/expenses/ExpandableExpensePolicies';

class CreateExpensePage extends React.Component {
  static getInitialProps({ query: { collectiveSlug, parentCollectiveSlug } }) {
    return { collectiveSlug, parentCollectiveSlug };
  }

  static propTypes = {
    /** @ignore from getInitialProps */
    collectiveSlug: PropTypes.string.isRequired,
    /** @ignore from getInitialProps */
    parentCollectiveSlug: PropTypes.string,
    /** @ignore from withUser */
    LoggedInUser: PropTypes.object,
    /** @ignore from withUser */
    loadingLoggedInUser: PropTypes.bool,
    /** @ignore from withRouter */
    router: PropTypes.object,
    /** @ignore from apollo */
    data: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.any,
      refetch: PropTypes.func.isRequired,
      account: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        type: PropTypes.string.isRequired,
        twitterHandle: PropTypes.string,
        imageUrl: PropTypes.string,
      }),
      loggedInAccount: PropTypes.shape({
        adminMemberships: PropTypes.shape({
          nodes: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string.isRequired,
              account: PropTypes.shape({
                id: PropTypes.string.isRequired,
                slug: PropTypes.string.isRequired,
                name: PropTypes.string,
                imageUrl: PropTypes.string,
              }),
            }),
          ),
        }),
      }),
    }).isRequired, // from withData
  };

  componentDidMount() {
    // Reftech data if user is logged in
    if (this.props.LoggedInUser) {
      this.props.data.refetch();
    }
  }

  componentDidUpdate(oldProps) {
    // Reftech data if user is logged in
    if (!oldProps.LoggedInUser && this.props.LoggedInUser) {
      this.props.data.refetch();
    }
  }

  getPageMetaData(collective) {
    if (collective) {
      return { title: `${collective.name} - New expense` };
    } else {
      return { title: `New expense` };
    }
  }

  onSubmit = async expense => {
    console.log(expense);
    // const { collectiveSlug, parentCollectiveSlug } = this.props;
    // await Router.pushRoute('expense', { collectiveSlug, parentCollectiveSlug, ExpenseId: expense.id });
  };

  getSuggestedTags(account) {
    // TODO - Fetch from the collective most used tags
  }

  getPayoutProfiles = memoizeOne(loggedInAccount => {
    if (!loggedInAccount) {
      return [];
    } else {
      const accountsAdminOf = get(loggedInAccount, 'adminMemberships.nodes', []).map(member => member.account);
      return [loggedInAccount, ...accountsAdminOf];
    }
  });

  render() {
    const { collectiveSlug, data, LoggedInUser, loadingLoggedInUser, router } = this.props;

    if (!data.loading) {
      if (!data || data.error) {
        return <ErrorPage data={data} />;
      } else if (!data.account) {
        ssrNotFoundError(); // Force 404 when rendered server side
        return <ErrorPage error={generateError.notFound(collectiveSlug)} log={false} />;
      }
    }

    const collective = data && data.account;
    const host = collective && collective.host;
    const loggedInAccount = data && data.loggedInAccount;
    return (
      <Page collective={collective} {...this.getPageMetaData(collective)} withoutGlobalStyles>
        <CollectiveThemeProvider collective={collective}>
          <React.Fragment>
            <CollectiveNavbar collective={collective} isLoading={!collective} />
            <Container position="relative" minHeight={800}>
              {!loadingLoggedInUser && !LoggedInUser && (
                <ContainerOverlay>
                  <SignInOrJoinFree routes={{ join: `/create-account?next=${encodeURIComponent(router.asPath)}` }} />
                </ContainerOverlay>
              )}
              <Box maxWidth={1160} m="0 auto" px={[2, 3, 4]} py={[4, 5]}>
                <StyledLink as={Link} color="black.600" route="expenses" params={{ collectiveSlug }}>
                  &larr; <FormattedMessage id="Back" defaultMessage="Back" />
                </StyledLink>
                <Flex justifyContent="space-between" flexWrap="wrap">
                  <Box mt={4} width="100%" maxWidth={750}>
                    <H4 mb={24}>
                      <FormattedMessage id="create-expense.title" defaultMessage="Submit expense" />
                    </H4>
                    <Box>
                      {data.loading ? (
                        <LoadingPlaceholder width="100%" height={400} />
                      ) : (
                        <ExpenseForm
                          collective={collective}
                          loading={loadingLoggedInUser}
                          onSubmit={this.onSubmit}
                          suggestedTags={this.getSuggestedTags(collective)}
                          payoutProfiles={this.getPayoutProfiles(loggedInAccount)}
                        />
                      )}
                    </Box>
                  </Box>
                  <Box mt={4} width={270}>
                    <H5 mb={3}>
                      <FormattedMessage id="CollectiveBalance" defaultMessage="Collective balance" />
                    </H5>
                    <Container borderLeft="1px solid" borderColor="green.600" pl={3} fontSize="H5" color="black.500">
                      {data.loading ? (
                        <LoadingPlaceholder height={28} width={75} />
                      ) : (
                        <FormattedMoneyAmount
                          currency={collective.currency}
                          amount={collective.balance}
                          amountStyles={{ color: 'black.800' }}
                        />
                      )}
                    </Container>
                    <Box mt={50}>
                      <H5 mb={3}>
                        <FormattedMessage id="Tags" defaultMessage="Tags" />
                      </H5>
                      <StyledInputTags />
                    </Box>
                    <ExpandableExpensePolicies host={host} collective={collective} mt={50} />
                    <Box mt={50}>
                      <CreateExpenseFAQ
                        withBorderLeft
                        withNewButtons
                        titleProps={{ fontSize: 'H5', fontWeight: 500, mb: 3 }}
                      />
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </Container>
          </React.Fragment>
        </CollectiveThemeProvider>
      </Page>
    );
  }
}

const getData = graphql(
  gqlV2`
    query CreateExpense($collectiveSlug: String!) {
      account(slug: $collectiveSlug, throwIfMissing: false) {
        id
        slug
        name
        type
        description
        settings
        imageUrl
        twitterHandle
        currency
        expensePolicy
        payoutMethods {
          id
          type
          name
          data
        }
        ... on Collective {
          id
          isApproved
          balance
          host {
            id
            expensePolicy
          }
        }
        ... on Event {
          id
          isApproved
          balance
          host {
            id
            expensePolicy
          }
        }
      }
      loggedInAccount {
        id
        slug
        imageUrl
        type
        name
        adminMemberships: memberOf(role: ADMIN) {
          nodes {
            id
            account {
              id
              slug
              imageUrl
              type
              name
              payoutMethods {
                id
                type
                name
                data
              }
            }
          }
        }
      }
    }
  `,
  {
    options: {
      context: API_V2_CONTEXT,
    },
  },
);

export default withUser(getData(withRouter(CreateExpensePage)));
