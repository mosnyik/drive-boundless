import {defineArrayMember, defineField, defineType} from 'sanity'

export const rentalApplication = defineType({
  name: 'rentalApplication',
  title: 'Rental Application',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Contacted', value: 'contacted'},
          {title: 'Approved', value: 'approved'},
          {title: 'Declined', value: 'declined'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'renter',
      title: 'Renter',
      type: 'object',
      fields: [
        defineField({name: 'fullName', title: 'Full name', type: 'string'}),
        defineField({name: 'phone', title: 'Phone', type: 'string'}),
        defineField({name: 'email', title: 'Email', type: 'string'}),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'object',
          fields: [
            defineField({name: 'street', title: 'Street', type: 'string'}),
            defineField({name: 'city', title: 'City', type: 'string'}),
            defineField({name: 'state', title: 'State', type: 'string'}),
            defineField({name: 'zip', title: 'ZIP', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'license',
      title: 'Driver license',
      type: 'object',
      fields: [
        defineField({name: 'number', title: 'License number', type: 'string'}),
        defineField({name: 'state', title: 'License state', type: 'string'}),
        defineField({name: 'expiry', title: 'Expiration date', type: 'date'}),
        defineField({name: 'file', title: 'Uploaded license', type: 'file'}),
      ],
    }),
    defineField({
      name: 'insurance',
      title: 'Insurance',
      type: 'object',
      description: 'Optional insurance information supplied by the renter.',
      fields: [
        defineField({name: 'carrier', title: 'Carrier', type: 'string'}),
        defineField({name: 'policyNumber', title: 'Policy number', type: 'string'}),
      ],
    }),
    defineField({
      name: 'rental',
      title: 'Rental details',
      type: 'object',
      fields: [
        defineField({name: 'purpose', title: 'Purpose', type: 'string'}),
        defineField({name: 'startDate', title: 'Start date', type: 'date'}),
        defineField({name: 'startTime', title: 'Start time', type: 'string'}),
        defineField({name: 'endDate', title: 'End date', type: 'date'}),
        defineField({name: 'endTime', title: 'End time', type: 'string'}),
        defineField({name: 'paymentDueDay', title: 'Payment due day', type: 'string'}),
        defineField({name: 'mileageAllowance', title: 'Mileage allowance', type: 'string'}),
        defineField({name: 'additionalNotes', title: 'Additional notes', type: 'text'}),
      ],
    }),
    defineField({
      name: 'selectedVehicle',
      title: 'Selected vehicle',
      type: 'object',
      fields: [
        defineField({
          name: 'vehicle',
          title: 'Vehicle document',
          type: 'reference',
          to: [{type: 'vehicle'}],
        }),
        defineField({name: 'label', title: 'Vehicle label', type: 'string'}),
        defineField({name: 'color', title: 'Color', type: 'string'}),
        defineField({name: 'pricePerDay', title: 'Price per day', type: 'number'}),
      ],
    }),
    defineField({
      name: 'additionalDrivers',
      title: 'Additional drivers',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string'}),
            defineField({name: 'licenseNumber', title: 'License number', type: 'string'}),
            defineField({name: 'licenseState', title: 'License state', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'agreementAccepted',
      title: 'Agreement accepted',
      type: 'boolean',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      name: 'renter.fullName',
      email: 'renter.email',
      submittedAt: 'submittedAt',
      status: 'status',
    },
    prepare({name, email, submittedAt, status}) {
      return {
        title: name || 'Untitled application',
        subtitle: [status, email, submittedAt].filter(Boolean).join(' - '),
      }
    },
  },
})
