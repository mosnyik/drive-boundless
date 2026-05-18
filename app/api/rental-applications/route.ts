import { NextResponse } from "next/server"

const projectId =
  process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "rs5e478x"
const dataset =
  process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? "driveboudless"
const apiVersion = process.env.SANITY_API_VERSION ?? "2025-05-16"
const apiPathVersion = apiVersion.startsWith("v") ? apiVersion : `v${apiVersion}`
const token = process.env.SANITY_API_WRITE_TOKEN

interface RentalApplicationPayload {
  formData: {
    fullName: string
    address: string
    city: string
    state: string
    zip: string
    phone: string
    email: string
    licenseNumber: string
    licenseState: string
    licenseExpiry: string
    insuranceCarrier?: string
    insurancePolicyNumber?: string
    rentalPurpose: string
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    rentalRate: "day" | "week"
    paymentDueDay: string
    mileageAllowance: string
    additionalNotes?: string
  }
  selectedVehicle: {
    id: string
    make: string
    model: string
    year: number
    color: string
    pricePerDay: number
    pricePerWeek: number
  } | null
  additionalDrivers: Array<{
    name: string
    licenseNumber: string
    licenseState: string
  }>
  visitorTimeZone: string
  agreementAccepted: boolean
}

function required(value: unknown) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value)
}

function isValidTimeZone(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value })
    return true
  } catch {
    return false
  }
}

function getInputDateTimeInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).formatToParts(date)

  const valueFor = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ""

  return {
    date: `${valueFor("year")}-${valueFor("month")}-${valueFor("day")}`,
    time: `${valueFor("hour")}:${valueFor("minute")}`,
  }
}

function validateRentalTimes(formData: RentalApplicationPayload["formData"], visitorTimeZone: string) {
  const now = new Date()
  const current = getInputDateTimeInTimeZone(now, visitorTimeZone)

  if (formData.startDate < current.date || formData.endDate < current.date) {
    return "Rental dates must be today or later."
  }

  if (
    (formData.startDate === current.date && formData.startTime < current.time) ||
    (formData.endDate === current.date && formData.endTime < current.time)
  ) {
    return "Rental times must be from now onward."
  }

  if (`${formData.endDate}T${formData.endTime}` < `${formData.startDate}T${formData.startTime}`) {
    return "Return date and time must be after the pick-up date and time."
  }

  return null
}

function validatePayload(payload: RentalApplicationPayload) {
  const { formData, selectedVehicle, visitorTimeZone, agreementAccepted } = payload
  const missing = []

  if (!required(formData.fullName)) missing.push("fullName")
  if (!required(formData.email)) missing.push("email")
  if (!required(formData.phone)) missing.push("phone")
  if (!required(formData.address)) missing.push("address")
  if (!required(formData.city)) missing.push("city")
  if (!required(formData.state)) missing.push("state")
  if (!required(formData.zip)) missing.push("zip")
  if (!required(formData.licenseNumber)) missing.push("licenseNumber")
  if (!required(formData.licenseState)) missing.push("licenseState")
  if (!required(formData.licenseExpiry)) missing.push("licenseExpiry")
  if (!required(formData.rentalPurpose)) missing.push("rentalPurpose")
  if (!required(formData.startDate)) missing.push("startDate")
  if (!required(formData.startTime)) missing.push("startTime")
  if (!required(formData.endDate)) missing.push("endDate")
  if (!required(formData.endTime)) missing.push("endTime")
  if (formData.rentalRate !== "day" && formData.rentalRate !== "week") missing.push("rentalRate")
  if (!selectedVehicle) missing.push("selectedVehicle")
  if (!isValidTimeZone(visitorTimeZone)) missing.push("visitorTimeZone")
  if (!agreementAccepted) missing.push("agreementAccepted")

  return missing
}

async function getSanityErrorMessage(response: Response) {
  const text = await response.text().catch(() => "")

  if (!text) {
    return `${response.status} ${response.statusText}`
  }

  try {
    const body = JSON.parse(text) as {
      error?: string
      message?: string
      description?: string
    }

    return [
      `${response.status} ${response.statusText}`,
      body.description ?? body.message ?? body.error,
    ]
      .filter(Boolean)
      .join(": ")
  } catch {
    return `${response.status} ${response.statusText}: ${text}`
  }
}

async function uploadLicenseFile(file: File) {
  const uploadUrl = `https://${projectId}.api.sanity.io/${apiPathVersion}/assets/files/${dataset}`
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  })

  if (!response.ok) {
    throw new Error(`License upload failed: ${await getSanityErrorMessage(response)}`)
  }

  const body = (await response.json()) as { document?: { _id?: string } }

  if (!body.document?._id) {
    throw new Error("License upload did not return an asset id")
  }

  return body.document._id
}

export async function POST(request: Request) {
  if (!token) {
    return NextResponse.json(
      { error: "Missing SANITY_API_WRITE_TOKEN environment variable." },
      { status: 500 },
    )
  }

  const body = await request.formData()
  const rawApplication = body.get("application")

  if (typeof rawApplication !== "string") {
    return NextResponse.json({ error: "Missing application payload." }, { status: 400 })
  }

  let application: RentalApplicationPayload

  try {
    application = JSON.parse(rawApplication) as RentalApplicationPayload
  } catch {
    return NextResponse.json({ error: "Invalid application payload." }, { status: 400 })
  }

  const missing = validatePayload(application)

  if (missing.length > 0) {
    return NextResponse.json({ error: "Missing required fields.", missing }, { status: 400 })
  }

  const timeError = validateRentalTimes(application.formData, application.visitorTimeZone)

  if (timeError) {
    return NextResponse.json({ error: timeError }, { status: 400 })
  }

  const licenseFile = body.get("licenseFile")
  let licenseAssetId: string | undefined

  if (licenseFile instanceof File && licenseFile.size > 0) {
    try {
      licenseAssetId = await uploadLicenseFile(licenseFile)
    } catch (error) {
      console.error("License upload failed", error)

      return NextResponse.json(
        {
          error: "We could not upload your license. Please try again or contact us for help.",
        },
        { status: 502 },
      )
    }
  }

  const { formData, selectedVehicle, visitorTimeZone, additionalDrivers, agreementAccepted } = application
  const now = new Date().toISOString()
  const document = {
    _type: "rentalApplication",
    status: "new",
    submittedAt: now,
    renter: {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      },
    },
    license: {
      number: formData.licenseNumber,
      state: formData.licenseState,
      expiry: formData.licenseExpiry,
      file: licenseAssetId
        ? {
            _type: "file",
            asset: {
              _type: "reference",
              _ref: licenseAssetId,
            },
          }
        : undefined,
    },
    insurance: {
      carrier: formData.insuranceCarrier || undefined,
      policyNumber: formData.insurancePolicyNumber || undefined,
    },
    rental: {
      purpose: formData.rentalPurpose,
      startDate: formData.startDate,
      startTime: formData.startTime,
      endDate: formData.endDate,
      endTime: formData.endTime,
      visitorTimeZone,
      rentalRate: formData.rentalRate,
      paymentDueDay: formData.paymentDueDay,
      mileageAllowance: formData.mileageAllowance,
      additionalNotes: formData.additionalNotes || undefined,
    },
    selectedVehicle: selectedVehicle
      ? {
          vehicle: {
            _type: "reference",
            _ref: selectedVehicle.id,
          },
          label: `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`,
          color: selectedVehicle.color,
          pricePerDay: selectedVehicle.pricePerDay,
          pricePerWeek: selectedVehicle.pricePerWeek,
          selectedRate: formData.rentalRate,
          selectedRatePrice:
            formData.rentalRate === "day" ? selectedVehicle.pricePerDay : selectedVehicle.pricePerWeek,
        }
      : undefined,
    additionalDrivers: additionalDrivers
      .filter((driver) => driver.name || driver.licenseNumber || driver.licenseState)
      .map((driver) => ({
        _key: crypto.randomUUID(),
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        licenseState: driver.licenseState,
      })),
    agreementAccepted,
  }

  const mutationUrl = `https://${projectId}.api.sanity.io/${apiPathVersion}/data/mutate/${dataset}`
  const response = await fetch(mutationUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mutations: [{ create: document }],
    }),
  })

  if (!response.ok) {
    const errorMessage = await getSanityErrorMessage(response)
    console.error("Sanity rental application write failed", errorMessage)

    return NextResponse.json(
      { error: "We could not submit your application. Please try again or contact us for help." },
      { status: 502 },
    )
  }

  const result = (await response.json()) as { results?: Array<{ id?: string }> }

  return NextResponse.json({
    ok: true,
    id: result.results?.[0]?.id,
  })
}
