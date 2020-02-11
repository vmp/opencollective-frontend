import React from 'react';
import PropTypes from 'prop-types';
import { Box, Flex } from '@rebass/grid';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import { Router } from '../../../server/pages';
import Container from '../../Container';
import BackButton from '../BackButton';
import { H1, P, H3 } from '../../Text';
import PricingTable from '../PricingTable';

const headings = ['', 'Starter', 'Single Collective'];

const rows = [
  [
    'Price',
    {
      type: 'price',
      amount: 'FREE',
      frequency: null,
    },
    {
      type: 'price',
      amount: '$10',
      frequency: 'month',
    },
  ],
  [
    'Fundraise via credit card payments',
    {
      type: 'html',
      html: '<strong>5%</strong> + Stripe Fees',
    },
    {
      type: 'html',
      html: '<strong>5%</strong> + Stripe Fees',
    },
  ],
  ['All Collective page features', { type: 'check' }, { type: 'check' }],
  ['Add founds received through other channels', { type: 'check' }, { type: 'check' }],
  ['Enable bank transfer payments', { type: 'check' }, { type: 'check' }],
];

const footings = [
  '',
  {
    type: 'button',
    url: 'https://',
  },
  {
    type: 'button',
    url: 'https://',
  },
];

const SingleCollectiveWithBankAccount = () => (
  <Container mx={3} my={4}>
    <Container>
      <Box display={['block', null, 'none']}>
        <BackButton onClick={() => Router.pushRoute('pricing')} />
      </Box>
    </Container>
    <Flex alignItems="center" justifyContent="center" flexDirection={['column', null]}>
      <Box textAlign="center" my={3}>
        <H1
          color="black.900"
          fontSize={['H3', null, 'H4']}
          lineHeight={['40px', null, 'H4']}
          letterSpacing={['-0.4px', null, '-0.2px']}
        >
          <FormattedMessage id="pricing.tab.welcome" defaultMessage="Welcome!" />
        </H1>
        <P color="black.700" fontSize={['Paragraph']} lineHeight={['H5']} letterSpacing={['-0.012em']}>
          <FormattedHTMLMessage
            id="pricing.tab.description"
            defaultMessage="You will begin with the <strong>STARTER PLAN</strong>. This plan is <strong>FREE</strong> to set up!"
          />
        </P>
      </Box>

      <Flex
        width={1}
        flexDirection={['column', null, 'row']}
        justifyContent={['space-between', null, null, null, 'center']}
        alignItems="center"
      >
        <Container width={[1, null, '514px', null, '576px']} mr={[null, null, null, null, 3]}>
          <PricingTable headings={headings} rows={rows} footings={footings} />
        </Container>
        <Container
          width={[1, null, '368px']}
          p={3}
          backgroundColor="black.50"
          borderRadius="8px"
          ml={[null, null, null, null, 3]}
        >
          <H3
            my={2}
            fontSize={['LeadParagraph', null, '16px']}
            lineHeight={['26px', null, '26px']}
            letterSpacing={['-0.008em']}
          >
            <FormattedMessage id="pricing.starterPlans" defaultMessage="The STARTER PLAN includes:" />
          </H3>
          <Box as="ul" color="black.800" mt={3} px={3} fontSize="13px" lineHeight="21px" letterSpacing="-0.012em">
            <Box as="li" my={2}>
              <FormattedHTMLMessage
                id="pricing.starterPlans.collective"
                defaultMessage="Collective - a page to <strong>coordinate your community and budget.</strong>"
              />
            </Box>
            <Box as="li" my={3}>
              <FormattedHTMLMessage
                id="pricing.starterPlans.communication"
                defaultMessage="Communication tools: <strong>post updates, start conversations,</strong> and <strong>get an email address</strong> for your group."
              />
            </Box>
            <Box as="li" my={3}>
              <FormattedHTMLMessage
                id="pricing.starterPlans.transparency"
                defaultMessage="Show your budget and expenses <strong>transparently.</strong> "
              />
            </Box>
            <Box as="li" my={3}>
              <FormattedHTMLMessage
                id="pricing.starterPlans.fundraise"
                defaultMessage="<strong>Fundraise</strong> through credit card payments (cost: 5% plus Stripe payment processor fees)."
              />
            </Box>
            <Box as="li" my={3}>
              <FormattedHTMLMessage
                id="pricing.starterPlans.addFunds"
                defaultMessage="Manually <strong>add funds raised</strong> through other channels (e.g. bank transfers) to your transparent budget (free up to $1,000, then you’ll need to upgrade to a paid plan)."
              />
            </Box>
          </Box>
        </Container>
      </Flex>
    </Flex>
  </Container>
);

SingleCollectiveWithBankAccount.propTypes = {
  onClickBackButton: PropTypes.func,
};

export default SingleCollectiveWithBankAccount;
