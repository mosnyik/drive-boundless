import {defineField, defineType} from 'sanity'

export const vehicle = defineType({
  name: 'vehicle',
  title: 'Vehicle',
  type: 'document',
  fields: [
    defineField({
      name: 'make',
      title: 'Make',
      type: 'string',
      description: 'Vehicle manufacturer name, for example Mercedes-Benz, BMW, Tesla, or Range Rover.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'model',
      title: 'Model',
      type: 'string',
      description: 'Vehicle model or trim shown beside the make, for example S-Class, 7 Series, Model S, or Sport.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Four-digit model year shown above the vehicle name, for example 2024.',
      validation: (rule) => rule.required().integer().min(1900),
    }),
    defineField({
      name: 'miles',
      title: 'Mileage in miles',
      type: 'number',
      description:
        'Enter the full odometer mileage in miles, not shorthand. Example: enter 13000 to show about 13k mi on the website.',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Exterior color label shown in the vehicle details, for example Obsidian Black or Pearl White.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pricePerDay',
      title: 'Price per day',
      type: 'number',
      description: 'Daily rental price in US dollars. Enter numbers only, for example 200 for $200 per day.',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'minRentalDays',
      title: 'Minimum rental days',
      type: 'number',
      description: 'Smallest number of days a customer can book this vehicle. Example: 2 means a 2-day minimum rental.',
      initialValue: 1,
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'deliveryFee',
      title: 'Delivery fee',
      type: 'number',
      description: 'Delivery charge in US dollars. Enter 0 when delivery is free, or a number like 75 for a $75 fee.',
      initialValue: 0,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'pickupTimes',
      title: 'Pickup times',
      type: 'string',
      description:
        'Pickup availability text shown on the card. Use spaced uppercase AM/PM, for example 9 AM - 6 PM or By appointment.',
      initialValue: '9 AM - 6 PM',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fuelType',
      title: 'Fuel type',
      type: 'string',
      description: 'Fuel or powertrain label shown with the fuel icon on the vehicle card.',
      initialValue: 'Regular',
      options: {
        list: [
          {title: 'Regular', value: 'Regular'},
          {title: 'Premium', value: 'Premium'},
          {title: 'Diesel', value: 'Diesel'},
          {title: 'Hybrid', value: 'Hybrid'},
          {title: 'Electric', value: 'Electric'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seats',
      title: 'Seats',
      type: 'number',
      description: 'Passenger seating capacity shown on the vehicle card. Example: enter 5 for 5 seats.',
      initialValue: 5,
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Primary vehicle photo used on the website card. Use a clear landscape image of the actual vehicle when possible.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Short description of the image for accessibility, for example Black Mercedes-Benz S-Class front view.',
        }),
      ],
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      description: 'Turn off to hide the Available badge and mark this vehicle as unavailable in the website data.',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      description: 'Controls display order in the fleet. Higher numbers appear first; vehicles with the same value fall back to year.',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      make: 'make',
      model: 'model',
      year: 'year',
      media: 'image',
    },
    prepare({make, model, year, media}) {
      return {
        title: [make, model].filter(Boolean).join(' ') || 'Untitled vehicle',
        subtitle: year ? String(year) : undefined,
        media,
      }
    },
  },
})
