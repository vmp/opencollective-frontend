## New payout method

### PayPal

```jsx
const [payoutMethod, setPayoutMethod] = React.useState({ type: 'PAYPAL' });
import { validatePayoutMethod } from 'components/expenses/PayoutMethodForm';
<PayoutMethodForm payoutMethod={payoutMethod} onChange={setPayoutMethod} errors={validatePayoutMethod(payoutMethod)} />;
```

### Other

```jsx
<PayoutMethodForm payoutMethod={{ type: 'OTHER' }} onChange={console.log} />
```

## Edit Payout method

### PayPal

```jsx
<PayoutMethodForm
  onChange={console.log}
  payoutMethod={{ id: '1', type: 'PAYPAL', data: { email: 'test@opencollective.com' } }}
/>
```

### Other

```jsx
<PayoutMethodForm
  onChange={console.log}
  payoutMethod={{
    id: '2',
    type: 'OTHER',
    data: {
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recte dicis; Ea possunt paria non esse.',
    },
  }}
/>
```
