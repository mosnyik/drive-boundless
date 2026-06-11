import { NextResponse } from "next/server"
import { buildRentalAgreementSnapshot } from "@/lib/rental-agreement"

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
  agreementAcceptedAt?: string
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
  if (formData.rentalRate !== "week") missing.push("rentalRate")
  if (!selectedVehicle) missing.push("selectedVehicle")
  if (!isValidTimeZone(visitorTimeZone)) missing.push("visitorTimeZone")
  if (!agreementAccepted) missing.push("agreementAccepted")

  return missing
}

function isValidIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime())
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

async function uploadSanityFile(file: Blob | Uint8Array, contentType: string, filename: string, label: string) {
  const uploadUrl = `https://${projectId}.api.sanity.io/${apiPathVersion}/assets/files/${dataset}`
  const url = new URL(uploadUrl)
  url.searchParams.set("filename", filename)

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": contentType,
    },
    body: file,
  })

  if (!response.ok) {
    throw new Error(`${label} upload failed: ${await getSanityErrorMessage(response)}`)
  }

  const body = (await response.json()) as { document?: { _id?: string } }

  if (!body.document?._id) {
    throw new Error(`${label} upload did not return an asset id`)
  }

  return body.document._id
}

async function uploadLicenseFile(file: File) {
  return uploadSanityFile(file, file.type || "application/octet-stream", file.name || "drivers-license", "License")
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
}

function wrapText(text: string, maxLength: number) {
  const normalized = text.replace(/\s+/g, " ").trim()
  if (!normalized) return [""]

  const lines: string[] = []
  let current = ""

  for (const word of normalized.split(" ")) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxLength && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }

  if (current) lines.push(current)
  return lines
}

function createAgreementPdf(plainText: string) {
  const wrappedLines = plainText
    .split("\n")
    .flatMap((line) => (line.trim() ? wrapText(line, 92) : [""]))
  const linesPerPage = 50
  const pages: string[][] = []

  for (let index = 0; index < wrappedLines.length; index += linesPerPage) {
    pages.push(wrappedLines.slice(index, index + linesPerPage))
  }

  const objects: string[] = []
  const addObject = (value: string) => {
    objects.push(value)
    return objects.length
  }

  const fontObject = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
  const pageObjects: number[] = []

  for (const pageLines of pages) {
    const content = [
      "BT",
      "/F1 10 Tf",
      "14 TL",
      "50 760 Td",
      ...pageLines.map((line) => `(${escapePdfText(line)}) Tj T*`),
      "ET",
    ].join("\n")
    const contentObject = addObject(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`)
    const pageObject = addObject(
      `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObject} 0 R >> >> /Contents ${contentObject} 0 R >>`,
    )
    pageObjects.push(pageObject)
  }

  const pagesObject = addObject(`<< /Type /Pages /Kids [${pageObjects.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjects.length} >>`)
  const catalogObject = addObject(`<< /Type /Catalog /Pages ${pagesObject} 0 R >>`)

  for (const pageObject of pageObjects) {
    objects[pageObject - 1] = objects[pageObject - 1].replace("/Parent 0 0 R", `/Parent ${pagesObject} 0 R`)
  }

  let pdf = "%PDF-1.4\n"
  const offsets = [0]

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf))
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })

  const xrefOffset = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += "0000000000 65535 f \n"
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObject} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return new Uint8Array(Buffer.from(pdf, "utf8"))
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
  let agreementPdfAssetId: string | undefined

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
  const agreementAcceptedAt = isValidIsoDate(application.agreementAcceptedAt)
    ? application.agreementAcceptedAt
    : now
  const agreement = buildRentalAgreementSnapshot({
    formData,
    selectedVehicle,
    additionalDrivers,
    acceptedAt: agreementAcceptedAt,
  })

  try {
    const agreementPdf = createAgreementPdf(agreement.plainText)
    const safeName = formData.fullName.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()
    agreementPdfAssetId = await uploadSanityFile(
      agreementPdf,
      "application/pdf",
      `${safeName || "renter"}-rental-agreement.pdf`,
      "Agreement PDF",
    )
  } catch (error) {
    console.error("Agreement PDF upload failed", error)

    return NextResponse.json(
      {
        error: "We could not save your signed agreement. Please try again or contact us for help.",
      },
      { status: 502 },
    )
  }

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
          selectedRate: "week",
          selectedRatePrice: selectedVehicle.pricePerWeek,
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
    agreement: {
      accepted: agreementAccepted,
      acceptedAt: agreement.acceptedAt,
      renterSignature: agreement.renterSignature,
      ownerSignature: agreement.ownerSignature,
      ownerSignedDate: agreement.signedDate,
      renderedHtml: agreement.renderedHtml,
      plainText: agreement.plainText,
      pdf: agreementPdfAssetId
        ? {
            _type: "file",
            asset: {
              _type: "reference",
              _ref: agreementPdfAssetId,
            },
          }
        : undefined,
    },
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
