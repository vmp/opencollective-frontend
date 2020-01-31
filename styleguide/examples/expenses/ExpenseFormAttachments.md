## With files

### Initial state

```jsx
import { useForm } from 'react-hook-form';
const { register, watch, errors, control } = useForm();
const [attachments, setAttachments] = React.useState([]);
<ExpenseFormAttachments
  register={register}
  watch={watch}
  errors={errors}
  control={control}
  name="attachments"
  defaultCurrency="USD"
  requireFile
/>;
```

### With some attachments

```jsx
import { useForm } from 'react-hook-form';
const { register, watch, errors, control } = useForm({
  defaultValues: {
    attachments: [
      { url: 'https://loremflickr.com/120/120/invoice?lock=1', incurredAt: '2020-02-07' },
      { url: 'https://loremflickr.com/120/120/invoice?lock=2', incurredAt: '2020-02-07' },
      { url: 'https://loremflickr.com/120/120/invoice?lock=3', incurredAt: '2020-02-07' },
    ],
  },
});
<ExpenseFormAttachments
  register={register}
  watch={watch}
  errors={errors}
  control={control}
  name="attachments"
  defaultCurrency="USD"
  requireFile
/>;
```

### With some attachments (mobile)

```jsx
import { useForm } from 'react-hook-form';
const { register, watch, errors, control } = useForm({
  defaultValues: {
    attachments: [
      { url: 'https://loremflickr.com/120/120/invoice?lock=4' },
      { url: 'https://loremflickr.com/120/120/invoice?lock=5' },
    ],
  },
});
<div style={{ maxWidth: 375, resize: 'horizontal' }}>
  <ExpenseFormAttachments
    register={register}
    watch={watch}
    errors={errors}
    control={control}
    name="attachments"
    defaultCurrency="USD"
    requireFile
  />
</div>;
```

### Without files

```jsx
import { useForm } from 'react-hook-form';
const { register, watch, errors, control } = useForm({
  defaultValues: {
    attachments: [
      { url: 'https://loremflickr.com/120/120/invoice?lock=1', incurredAt: '2020-02-07' },
      { url: 'https://loremflickr.com/120/120/invoice?lock=2', incurredAt: '2020-02-07' },
      { url: 'https://loremflickr.com/120/120/invoice?lock=3', incurredAt: '2020-02-07' },
    ],
  },
});
<ExpenseFormAttachments
  register={register}
  watch={watch}
  errors={errors}
  control={control}
  name="attachments"
  defaultCurrency="USD"
/>;
```
