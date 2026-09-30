import {defineArrayMember, defineField, defineType} from 'sanity'

export const rentalApplication = defineType({
  name: 'rentalApplication',
  title: 'Rental Application',
  type: 'document',
  fieldsets: [
    {
      name: 'adminActivity',
      title: 'Admin activity',
      description: 'Recorded by the admin dashboard. Read-only here.',
      options: {collapsible: true, collapsed: true},
    },
  ],
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
      validation: (rule) =>
        rule
          .required()
          .custom((status, context) => {
            if (status !== 'approved') return true

            const insurance = (
              context.document as
                | {insurance?: {status?: string; carrier?: string; policyNumber?: string; noInsuranceAcknowledgment?: string}}
                | undefined
            )?.insurance

            const hasProofOfInsurance = Boolean(insurance?.carrier && insurance?.policyNumber)
            const declinedInsurance =
              insurance?.status === 'none' && insurance?.noInsuranceAcknowledgment === 'declined'

            if (hasProofOfInsurance || declinedInsurance) return true

            return 'Add the insurance carrier and policy number before approving, unless the renter declined insurance.'
          }),
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
      description: 'The renter\'s insurance choice, recorded at the time of application for proof of what was chosen.',
      fields: [
        defineField({
          name: 'status',
          title: 'Insurance status',
          type: 'string',
          options: {
            list: [
              {title: 'Has own insurance', value: 'has'},
              {title: 'No insurance', value: 'none'},
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'carrier',
          title: 'Carrier',
          type: 'string',
          description: 'Required before approval unless the renter declined insurance. Add this once the renter provides proof of coverage.',
          hidden: ({parent}) =>
            (parent as {status?: string; noInsuranceAcknowledgment?: string} | undefined)?.status === 'none' &&
            (parent as {status?: string; noInsuranceAcknowledgment?: string} | undefined)?.noInsuranceAcknowledgment ===
              'declined',
        }),
        defineField({
          name: 'policyNumber',
          title: 'Policy number',
          type: 'string',
          description: 'Required before approval unless the renter declined insurance. Add this once the renter provides proof of coverage.',
          hidden: ({parent}) =>
            (parent as {status?: string; noInsuranceAcknowledgment?: string} | undefined)?.status === 'none' &&
            (parent as {status?: string; noInsuranceAcknowledgment?: string} | undefined)?.noInsuranceAcknowledgment ===
              'declined',
        }),
        defineField({
          name: 'noInsuranceAcknowledgment',
          title: 'No-insurance choice',
          type: 'string',
          description: 'What the renter chose when they indicated they have no insurance.',
          options: {
            list: [
              {title: 'Will get RentalCover.com coverage', value: 'rentalcover'},
              {title: 'Declined to get coverage', value: 'declined'},
            ],
            layout: 'radio',
          },
        }),
        defineField({name: 'decisionAt', title: 'Decision recorded at', type: 'datetime', readOnly: true}),
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
        defineField({name: 'visitorTimeZone', title: 'Visitor time zone', type: 'string'}),
        defineField({
          name: 'rentalRate',
          title: 'Selected price option',
          type: 'string',
          options: {
            list: [
              {title: 'Daily', value: 'day'},
              {title: 'Weekly', value: 'week'},
            ],
          },
        }),
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
        defineField({name: 'pricePerWeek', title: 'Price per week', type: 'number'}),
        defineField({
          name: 'selectedRate',
          title: 'Selected price option',
          type: 'string',
          options: {
            list: [
              {title: 'Daily', value: 'day'},
              {title: 'Weekly', value: 'week'},
            ],
          },
        }),
        defineField({name: 'selectedRatePrice', title: 'Selected rate price', type: 'number'}),
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
    defineField({
      name: 'agreement',
      title: 'Signed agreement',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({name: 'accepted', title: 'Accepted', type: 'boolean'}),
        defineField({name: 'acceptedAt', title: 'Accepted at', type: 'datetime'}),
        defineField({name: 'renterSignature', title: 'Renter signature', type: 'string'}),
        defineField({name: 'ownerSignature', title: 'Owner signature', type: 'string'}),
        defineField({name: 'ownerSignedDate', title: 'Owner signed date', type: 'string'}),
        defineField({
          name: 'pdf',
          title: 'Downloadable agreement PDF',
          type: 'file',
        }),
        defineField({
          name: 'renderedHtml',
          title: 'Rendered agreement HTML',
          type: 'text',
          rows: 12,
        }),
        defineField({
          name: 'plainText',
          title: 'Agreement plain text',
          type: 'text',
          rows: 12,
        }),
      ],
    }),
    // Fields below are written by the admin dashboard (admin.driveboundless),
    // declared here so Studio doesn't flag them as unknown.
    defineField({
      name: 'statusUpdatedAt',
      title: 'Status updated at',
      type: 'datetime',
      readOnly: true,
      fieldset: 'adminActivity',
    }),
    defineField({
      name: 'statusHistory',
      title: 'Status history',
      type: 'array',
      readOnly: true,
      fieldset: 'adminActivity',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'from', title: 'From', type: 'string'}),
            defineField({name: 'to', title: 'To', type: 'string'}),
            defineField({name: 'changedAt', title: 'Changed at', type: 'datetime'}),
            defineField({name: 'changedBy', title: 'Changed by', type: 'string'}),
          ],
          preview: {
            select: {from: 'from', to: 'to', changedBy: 'changedBy', changedAt: 'changedAt'},
            prepare: ({from, to, changedBy, changedAt}) => ({
              title: `${from ?? '—'} → ${to ?? '—'}`,
              subtitle: [changedBy, changedAt].filter(Boolean).join(' - '),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'vehicleChangeHistory',
      title: 'Vehicle change history',
      type: 'array',
      readOnly: true,
      fieldset: 'adminActivity',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'changedAt', title: 'Changed at', type: 'datetime'}),
            defineField({name: 'changedBy', title: 'Changed by', type: 'string'}),
            defineField({name: 'reason', title: 'Reason', type: 'text', rows: 2}),
            defineField({name: 'previousVehicleLabel', title: 'Previous vehicle', type: 'string'}),
            defineField({name: 'newVehicleLabel', title: 'New vehicle', type: 'string'}),
            defineField({name: 'previousAgreementPdf', title: 'Previous agreement PDF', type: 'file'}),
          ],
          preview: {
            select: {from: 'previousVehicleLabel', to: 'newVehicleLabel', changedAt: 'changedAt'},
            prepare: ({from, to, changedAt}) => ({
              title: from ? `${from} → ${to}` : to,
              subtitle: changedAt,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'scheduleChangeHistory',
      title: 'Pick-up change history',
      type: 'array',
      readOnly: true,
      fieldset: 'adminActivity',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'changedAt', title: 'Changed at', type: 'datetime'}),
            defineField({name: 'changedBy', title: 'Changed by', type: 'string'}),
            defineField({name: 'previousStartDate', title: 'Previous start date', type: 'date'}),
            defineField({name: 'previousStartTime', title: 'Previous start time', type: 'string'}),
            defineField({name: 'previousEndDate', title: 'Previous end date', type: 'date'}),
            defineField({name: 'previousEndTime', title: 'Previous end time', type: 'string'}),
            defineField({name: 'newStartDate', title: 'New start date', type: 'date'}),
            defineField({name: 'newStartTime', title: 'New start time', type: 'string'}),
            defineField({name: 'newEndDate', title: 'New end date', type: 'date'}),
            defineField({name: 'newEndTime', title: 'New end time', type: 'string'}),
            defineField({name: 'previousAgreementPdf', title: 'Previous agreement PDF', type: 'file'}),
          ],
          preview: {
            select: {
              startDate: 'newStartDate',
              startTime: 'newStartTime',
              endDate: 'newEndDate',
              endTime: 'newEndTime',
              changedBy: 'changedBy',
            },
            prepare: ({startDate, startTime, endDate, endTime, changedBy}) => ({
              title: `Pick-up ${startDate} ${startTime ?? ''} → return ${endDate} ${endTime ?? ''}`,
              subtitle: changedBy,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'currentAgreement',
      title: 'Current agreement',
      description:
        'The latest agreement regenerated by the admin dashboard after a vehicle, insurance or pick-up change. The original signed agreement is kept unchanged.',
      type: 'object',
      readOnly: true,
      fieldset: 'adminActivity',
      fields: [
        defineField({name: 'vehicleLabel', title: 'Vehicle', type: 'string'}),
        defineField({name: 'generatedAt', title: 'Generated at', type: 'datetime'}),
        defineField({name: 'pdf', title: 'Agreement PDF', type: 'file'}),
        defineField({name: 'renderedHtml', title: 'Rendered agreement HTML', type: 'text', rows: 12}),
        defineField({name: 'plainText', title: 'Agreement plain text', type: 'text', rows: 12}),
      ],
    }),
    defineField({
      name: 'agreementEmailHistory',
      title: 'Agreement email history',
      type: 'array',
      readOnly: true,
      fieldset: 'adminActivity',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'sentAt', title: 'Sent at', type: 'datetime'}),
            defineField({name: 'sentBy', title: 'Sent by', type: 'string'}),
            defineField({name: 'sentTo', title: 'Sent to', type: 'string'}),
          ],
          preview: {
            select: {sentTo: 'sentTo', sentAt: 'sentAt'},
            prepare: ({sentTo, sentAt}) => ({title: sentTo, subtitle: sentAt}),
          },
        }),
      ],
    }),
    defineField({
      name: 'confirmationEmailSentAt',
      title: 'Confirmation email sent at',
      type: 'datetime',
      readOnly: true,
      fieldset: 'adminActivity',
    }),
    defineField({
      name: 'declineEmailSentAt',
      title: 'Decline email sent at',
      type: 'datetime',
      readOnly: true,
      fieldset: 'adminActivity',
    }),
    defineField({
      name: 'ownerApprovalToken',
      title: 'Owner approval link',
      type: 'object',
      readOnly: true,
      fieldset: 'adminActivity',
      fields: [
        defineField({name: 'tokenHash', title: 'Token hash', type: 'string'}),
        defineField({name: 'expiresAt', title: 'Expires at', type: 'datetime'}),
        defineField({name: 'usedAt', title: 'Used at', type: 'datetime'}),
        defineField({name: 'usedVia', title: 'Decision', type: 'string'}),
      ],
    }),
  ],
  preview: {
    select: {
      name: 'renter.fullName',
      email: 'renter.email',
      submittedAt: 'submittedAt',
      status: 'status',
      insuranceStatus: 'insurance.status',
      carrier: 'insurance.carrier',
      policyNumber: 'insurance.policyNumber',
      noInsuranceAcknowledgment: 'insurance.noInsuranceAcknowledgment',
    },
    prepare({name, email, submittedAt, status, insuranceStatus, carrier, policyNumber, noInsuranceAcknowledgment}) {
      const hasProofOfInsurance = Boolean(carrier && policyNumber)
      const declinedInsurance = insuranceStatus === 'none' && noInsuranceAcknowledgment === 'declined'
      const needsInsuranceProof = status !== 'declined' && !hasProofOfInsurance && !declinedInsurance

      return {
        title: name || 'Untitled application',
        subtitle: [status, needsInsuranceProof ? 'Needs insurance proof' : null, email, submittedAt]
          .filter(Boolean)
          .join(' - '),
      }
    },
  },
})
