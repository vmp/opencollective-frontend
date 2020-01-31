import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import FAQ, { Entry, Title, Content } from './FAQ';
import StyledLink from '../StyledLink';
import ExternalLink from '../ExternalLink';
import { Box } from '@rebass/grid';

const CreateExpenseFAQ = ({ defaultOpen, ...props }) => (
  <FAQ {...props}>
    <Entry open={defaultOpen}>
      <Title>
        <FormattedMessage id="CreateExpenseFAQ.getPaid" defaultMessage="How do I get paid from a Collective?" />
      </Title>
      <Content>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eam stabilem appellas. Eam stabilem appellas. Quid, si
        etiam iucunda memoria est praeteritorum malorum?
      </Content>
    </Entry>
    <Entry open={defaultOpen}>
      <Title>
        <FormattedMessage id="CreateExpenseFAQ.howAreApproved" defaultMessage="How are expenses approved?" />
      </Title>
      <Content>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eam stabilem appellas. Eam stabilem appellas. Quid, si
        etiam iucunda memoria est praeteritorum malorum?
      </Content>
    </Entry>
    <Entry open={defaultOpen}>
      <Title>
        <FormattedMessage id="CreateExpenseFAQ.isItPublic" defaultMessage="Is my private data made public?" />
      </Title>
      <Content>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eam stabilem appellas. Eam stabilem appellas. Quid, si
        etiam iucunda memoria est praeteritorum malorum?
      </Content>
    </Entry>
    <Entry open={defaultOpen}>
      <Title>
        <FormattedMessage id="CreateExpenseFAQ.whenPaid" defaultMessage="When will I get paid?" />
      </Title>
      <Content>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eam stabilem appellas. Eam stabilem appellas. Quid, si
        etiam iucunda memoria est praeteritorum malorum?
      </Content>
    </Entry>
    <Box mt={2} pl={2}>
      <StyledLink
        as={ExternalLink}
        href="https://docs.opencollective.com/help/expenses-and-getting-paid/submitting-expenses"
        openInNewTab
        fontSize="Caption"
        color="black.700"
      >
        <FormattedMessage id="moreInfo" defaultMessage="More info" />
        &nbsp;&rarr;
      </StyledLink>
    </Box>
  </FAQ>
);

CreateExpenseFAQ.propTypes = {
  defaultOpen: PropTypes.bool,
};

export default CreateExpenseFAQ;
