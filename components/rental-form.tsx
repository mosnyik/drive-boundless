"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, FileText, Check, Calendar, User, Car, Shield, Plus, X, Clock } from "lucide-react"
import type { Vehicle } from "./vehicle-fleet"

const submittedMessage = "our team is reviewing your application and will get back to you shortly"
type RentalRate = "day" | "week"

const getVisitorTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
const getTodayInputValue = () => new Date().toLocaleDateString("en-CA")
const getNowInputValue = () => new Date().toTimeString().slice(0, 5)

interface AdditionalDriver {
  name: string
  licenseNumber: string
  licenseState: string
}

interface RentalFormProps {
  selectedVehicle?: Vehicle | null
}

export function RentalForm({ selectedVehicle }: RentalFormProps) {
  const [step, setStep] = useState(1)
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [agreementAccepted, setAgreementAccepted] = useState(false)
  const [agreementAcceptedAt, setAgreementAcceptedAt] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [additionalDrivers, setAdditionalDrivers] = useState<AdditionalDriver[]>([])
  const [openSelect, setOpenSelect] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const todayInputValue = getTodayInputValue()
  const nowInputValue = getNowInputValue()

  const isToday = (date: string) => date === getTodayInputValue()
  const isBeforeNow = (date: string, time: string) => {
    return Boolean(date && time && isToday(date) && time < getNowInputValue())
  }
  const isEndBeforeStart = (startDate: string, startTime: string, endDate: string, endTime: string) => {
    return Boolean(
      startDate &&
        startTime &&
        endDate &&
        endTime &&
        `${endDate}T${endTime}` < `${startDate}T${startTime}`,
    )
  }
  const [formData, setFormData] = useState({
    // Renter Information
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    // License Information
    licenseNumber: "",
    licenseState: "",
    licenseExpiry: "",
    // Insurance Information
    insuranceCarrier: "",
    insurancePolicyNumber: "",
    // Rental Details
    rentalPurpose: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    rentalRate: "" as RentalRate | "",
    // Payment Terms
    paymentDueDay: "Monday",
    // Mileage
    mileageAllowance: "unlimited",
    // Additional Notes
    additionalNotes: "",
  })

  const minEndTime =
    formData.endDate && formData.endDate === formData.startDate
      ? [isToday(formData.endDate) ? nowInputValue : "", formData.startTime].filter(Boolean).sort().at(-1)
      : isToday(formData.endDate)
        ? nowInputValue
        : undefined

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target

    if (type === "date" && value && value < todayInputValue) {
      toast.error("Date unavailable", {
        description: "Please select today or a future date.",
      })
      return
    }

    if (type === "time") {
      const dateValue = name === "startTime" ? formData.startDate : formData.endDate

      if (isBeforeNow(dateValue, value)) {
        toast.error("Time unavailable", {
          description: "Please select a time from now onward.",
        })
        return
      }
    }

    setFormData((current) => {
      const next = { ...current, [name]: value }

      if (name === "startDate" && current.endDate && value && current.endDate < value) {
        next.endDate = ""
        next.endTime = ""
      }

      if (name === "startDate" && isBeforeNow(value, current.startTime)) {
        next.startTime = ""
      }

      if (name === "endDate" && isBeforeNow(value, current.endTime)) {
        next.endTime = ""
      }

      if (
        (name === "startDate" || name === "startTime" || name === "endDate" || name === "endTime") &&
        isEndBeforeStart(next.startDate, next.startTime, next.endDate, next.endTime)
      ) {
        if (name === "startDate" || name === "startTime") {
          next.endDate = ""
          next.endTime = ""
        } else {
          toast.error("Return time unavailable", {
            description: "Please select a return time after the pick-up time.",
          })
          return current
        }
      }

      return next
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
    setOpenSelect(null)
  }

  const handleRateChange = (value: string) => {
    if (value !== "day" && value !== "week") return
    setFormData({ ...formData, rentalRate: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLicenseFile(file)
      toast.success("License uploaded successfully", {
        description: file.name,
      })
    }
  }

  const addAdditionalDriver = () => {
    if (additionalDrivers.length < 2) {
      setAdditionalDrivers([...additionalDrivers, { name: "", licenseNumber: "", licenseState: "" }])
      toast.info("Additional driver added", {
        description: "Please fill in their details below.",
      })
    } else {
      toast.warning("Maximum drivers reached", {
        description: "You can only add up to 2 additional drivers.",
      })
    }
  }

  const removeAdditionalDriver = (index: number) => {
    setAdditionalDrivers(additionalDrivers.filter((_, i) => i !== index))
    toast.info("Driver removed", {
      description: "Additional driver has been removed from the application.",
    })
  }

  const updateAdditionalDriver = (index: number, field: keyof AdditionalDriver, value: string) => {
    const updated = [...additionalDrivers]
    updated[index][field] = value
    setAdditionalDrivers(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      isBeforeNow(formData.startDate, formData.startTime) ||
      isBeforeNow(formData.endDate, formData.endTime) ||
      isEndBeforeStart(formData.startDate, formData.startTime, formData.endDate, formData.endTime)
    ) {
      toast.error("Time unavailable", {
        description: "Please select rental times from now onward.",
      })
      return
    }
    
    if (!agreementAccepted) {
      toast.error("Agreement required", {
        description: "Please read and accept the rental agreement to proceed.",
      })
      return
    }
    
    setIsSubmitting(true)
    toast.loading("Submitting your rental request...", { id: "submit" })
    
    try {
      const payload = new FormData()
      payload.append(
        "application",
        JSON.stringify({
          formData,
          visitorTimeZone: getVisitorTimeZone(),
          selectedVehicle,
          additionalDrivers,
          agreementAccepted,
          agreementAcceptedAt: agreementAcceptedAt ?? new Date().toISOString(),
        }),
      )

      if (licenseFile) {
        payload.append("licenseFile", licenseFile)
      }

      const response = await fetch("/api/rental-applications", {
        method: "POST",
        body: payload,
      })

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(result?.error ?? "Unable to submit your rental request.")
      }

      toast.success("Application submitted successfully!", {
        id: "submit",
        description: submittedMessage,
      })

      setIsSubmitted(true)
    } catch (error) {
      toast.error("Submission failed", {
        id: "submit",
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepValidationMessage = (stepNum: number): string => {
    switch (stepNum) {
      case 1:
        const missing1 = []
        if (!formData.fullName) missing1.push("full name")
        if (!formData.email) missing1.push("email")
        if (!formData.phone) missing1.push("phone")
        if (!formData.address || !formData.city || !formData.state || !formData.zip) missing1.push("address")
        return `Please complete: ${missing1.join(", ")}`
      case 2:
        const missing2 = []
        if (!formData.licenseNumber || !formData.licenseState || !formData.licenseExpiry) missing2.push("license details")
        if (!licenseFile) missing2.push("license upload")
        return `Please complete: ${missing2.join(", ")}`
      case 3:
        const missing3 = []
        if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) missing3.push("rental dates/times")
        if (!formData.rentalPurpose) missing3.push("rental purpose")
        if (!selectedVehicle) missing3.push("vehicle selection")
        if (!formData.rentalRate) missing3.push("price selection")
        return `Please complete: ${missing3.join(", ")}`
      case 4:
        return "Please read and accept the rental agreement"
      default:
        return "Please complete all required fields"
    }
  }

  const handleNextStep = () => {
    if (isStepValid(step)) {
      setStep(step + 1)
      const stepNames = ["", "Personal Info", "License & Insurance", "Rental Details", "Agreement"]
      toast.success(`${stepNames[step]} completed`, {
        description: `Moving to ${stepNames[step + 1]}...`,
      })
    } else {
      toast.error("Missing required information", {
        description: getStepValidationMessage(step),
      })
    }
  }

  const handlePrevStep = () => {
    setStep(step - 1)
    toast.info("Going back", {
      description: "Your progress has been saved.",
    })
  }

  const isStepValid = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.address && formData.city && formData.state && formData.zip
      case 2:
        return formData.licenseNumber && formData.licenseState && formData.licenseExpiry && licenseFile
      case 3:
        return (
          formData.rentalPurpose &&
          formData.startDate &&
          formData.startTime &&
          formData.endDate &&
          formData.endTime &&
          formData.rentalRate &&
          !isBeforeNow(formData.startDate, formData.startTime) &&
          !isBeforeNow(formData.endDate, formData.endTime) &&
          !isEndBeforeStart(formData.startDate, formData.startTime, formData.endDate, formData.endTime) &&
          selectedVehicle
        )
      case 4:
        return agreementAccepted
      default:
        return false
    }
  }

  const steps = [
    { num: 1, title: "Personal Info", icon: User },
    { num: 2, title: "License & Insurance", icon: FileText },
    { num: 3, title: "Rental Details", icon: Car },
    { num: 4, title: "Agreement", icon: Shield },
  ]

  const placeholder = (text: string) => (
    <span className="text-muted-foreground/45 italic">{text}</span>
  )

  const valueOrPlaceholder = (value: string, fallback = "_______________") => {
    return value || placeholder(fallback)
  }
  const selectedRateLabel =
    formData.rentalRate === "day" ? "Daily" : formData.rentalRate === "week" ? "Weekly" : ""
  const selectedRatePrice =
    selectedVehicle && formData.rentalRate === "day"
      ? selectedVehicle.pricePerDay
      : selectedVehicle && formData.rentalRate === "week"
        ? selectedVehicle.pricePerWeek
        : undefined

  const formatDate = (dateStr: string) => {
    if (!dateStr) return placeholder("_______________")
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr) return placeholder("_______________")
    const date = formatDate(dateStr)
    return timeStr ? `${date} at ${timeStr}` : date
  }

  const formatAgreementDate = (dateStr: string | null) => {
    if (!dateStr) return placeholder("_______________")

    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isSubmitted) {
    return (
      <section id="rent" className="py-24 lg:py-32 bg-background">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="h-10 w-10 text-accent" />
          </div>
          <h2 className="font-serif text-4xl font-medium mb-4">Request Submitted</h2>
          <p className="text-muted-foreground text-lg mb-8">
            {submittedMessage}
          </p>
          <Button onClick={() => {
            setIsSubmitted(false)
            setStep(1)
            setFormData({
              fullName: "", address: "", city: "", state: "", zip: "",
              phone: "", email: "", licenseNumber: "", licenseState: "",
              licenseExpiry: "", insuranceCarrier: "", insurancePolicyNumber: "",
              rentalPurpose: "", startDate: "", startTime: "", endDate: "", endTime: "", rentalRate: "",
              paymentDueDay: "Monday", mileageAllowance: "unlimited", additionalNotes: "",
            })
            setLicenseFile(null)
            setAgreementAccepted(false)
            setAgreementAcceptedAt(null)
            setAdditionalDrivers([])
          }}>
            Submit Another Request
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section id="rent" className="py-24 lg:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-accent mb-4">
            Reserve a Rental
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] mb-6 text-balance">
            Start your car rental <span className="italic">request</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Request an economy vehicle rental in Lawrenceville, GA. All bookings require
            approval, verified renter details, and a signed Georgia Motor Vehicle Rental Agreement.
          </p>
        </div>

        {/* Selected Vehicle Summary */}
        {selectedVehicle && (
          <Card className="mb-8 border-accent/30 bg-accent/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-accent">Selected Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="font-serif text-xl">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</p>
                <p className="text-sm text-muted-foreground">{selectedVehicle.color} • {selectedVehicle.fuelType}</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-2xl">${selectedVehicle.pricePerDay}</p>
                <p className="text-xs text-muted-foreground">per day</p>
                <p className="font-serif text-xl mt-2">${selectedVehicle.pricePerWeek}</p>
                <p className="text-xs text-muted-foreground">per week</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center">
              <button
                onClick={() => step > s.num && setStep(s.num)}
                className={`flex flex-col items-center gap-2 ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}
                disabled={step < s.num}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  step > s.num ? 'bg-accent text-accent-foreground' :
                  step === s.num ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step > s.num ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                </div>
                <span className="text-xs font-medium hidden sm:block">{s.title}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className={`w-12 sm:w-20 h-px mx-2 ${step > s.num ? 'bg-accent' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Renter Information</CardTitle>
                <CardDescription>Please provide your personal details for the rental agreement.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Atlanta"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="GA"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code *</Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        placeholder="30301"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Driver's License & Insurance */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Driver&apos;s License & Insurance</CardTitle>
                <CardDescription>Provide your license details, upload a clear photo of your license, and add insurance details if available.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="licenseNumber">Driver&apos;s License Number *</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="D1234567"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseState">License State *</Label>
                    <Input
                      id="licenseState"
                      name="licenseState"
                      value={formData.licenseState}
                      onChange={handleChange}
                      placeholder="GA"
                      maxLength={2}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseExpiry">Expiration Date *</Label>
                    <Input
                      id="licenseExpiry"
                      name="licenseExpiry"
                      type="date"
                      min={todayInputValue}
                      value={formData.licenseExpiry}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Upload Driver&apos;s License *</Label>
                  <div 
                    className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      licenseFile ? 'border-accent bg-accent/5' : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {licenseFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <Check className="h-5 w-5 text-accent" />
                        <span className="font-medium">{licenseFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG or PDF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="font-medium mb-4">Insurance Information <span className="text-muted-foreground">(optional)</span></h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your insurance information if you have it available. We can collect or confirm these details during follow-up.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="insuranceCarrier">Insurance Carrier</Label>
                      <Input
                        id="insuranceCarrier"
                        name="insuranceCarrier"
                        value={formData.insuranceCarrier}
                        onChange={handleChange}
                        placeholder="State Farm, GEICO, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                      <Input
                        id="insurancePolicyNumber"
                        name="insurancePolicyNumber"
                        value={formData.insurancePolicyNumber}
                        onChange={handleChange}
                        placeholder="POL-123456789"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Drivers */}
                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">Additional Authorized Drivers</h4>
                      <p className="text-sm text-muted-foreground">All drivers must be at least 23 years old with a valid license.</p>
                    </div>
                    {additionalDrivers.length < 2 && (
                      <Button type="button" variant="outline" size="sm" onClick={addAdditionalDriver}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Driver
                      </Button>
                    )}
                  </div>
                  
                  {additionalDrivers.map((driver, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Additional Driver {index + 1}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeAdditionalDriver(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <Label>Full Name</Label>
                          <Input
                            value={driver.name}
                            onChange={(e) => updateAdditionalDriver(index, "name", e.target.value)}
                            placeholder="Jane Doe"
                          />
                        </div>
                        <div>
                          <Label>License Number</Label>
                          <Input
                            value={driver.licenseNumber}
                            onChange={(e) => updateAdditionalDriver(index, "licenseNumber", e.target.value)}
                            placeholder="D7654321"
                          />
                        </div>
                        <div>
                          <Label>License State</Label>
                          <Input
                            value={driver.licenseState}
                            onChange={(e) => updateAdditionalDriver(index, "licenseState", e.target.value)}
                            placeholder="GA"
                            maxLength={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Rental Details */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Rental Details</CardTitle>
                <CardDescription>Specify your rental dates, times, and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!selectedVehicle && (
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-accent">
                    Please select a vehicle from our fleet above before proceeding.
                  </div>
                )}

                <div>
                  <Label htmlFor="rentalPurpose">Rental Purpose *</Label>
                  <Select 
                    open={openSelect === "rentalPurpose"}
                    onOpenChange={(open) => setOpenSelect(open ? "rentalPurpose" : null)}
                    value={formData.rentalPurpose} 
                    onValueChange={(value) => handleSelectChange("rentalPurpose", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business Travel</SelectItem>
                      <SelectItem value="leisure">Leisure / Vacation</SelectItem>
                      <SelectItem value="special">Special Occasion</SelectItem>
                      <SelectItem value="rideshare">Rideshare / Delivery</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Price Option *</Label>
                  {selectedVehicle ? (
                    <RadioGroup
                      value={formData.rentalRate}
                      onValueChange={handleRateChange}
                      className="grid sm:grid-cols-2 gap-3 mt-2"
                    >
                      <Label
                        htmlFor="rentalRateDay"
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                          formData.rentalRate === "day" ? "border-accent bg-accent/10" : "border-border"
                        }`}
                      >
                        <div>
                          <p className="font-serif text-2xl">${selectedVehicle.pricePerDay}</p>
                          <p className="text-xs text-muted-foreground">per day</p>
                        </div>
                        <RadioGroupItem id="rentalRateDay" value="day" />
                      </Label>
                      <Label
                        htmlFor="rentalRateWeek"
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                          formData.rentalRate === "week" ? "border-accent bg-accent/10" : "border-border"
                        }`}
                      >
                        <div>
                          <p className="font-serif text-2xl">${selectedVehicle.pricePerWeek}</p>
                          <p className="text-xs text-muted-foreground">per week</p>
                        </div>
                        <RadioGroupItem id="rentalRateWeek" value="week" />
                      </Label>
                    </RadioGroup>
                  ) : (
                    <div className="mt-2 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                      Select a vehicle to choose a daily or weekly price.
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Pick-up Date *
                    </Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      min={todayInputValue}
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="startTime" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pick-up Time *
                    </Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      min={isToday(formData.startDate) ? nowInputValue : undefined}
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Return Date *
                    </Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      min={formData.startDate || todayInputValue}
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Return Time *
                    </Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      min={minEndTime}
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 border-t border-border pt-6">
                  <div>
                    <Label htmlFor="paymentDueDay">Weekly Payment Due Day</Label>
                    <Select 
                      open={openSelect === "paymentDueDay"}
                      onOpenChange={(open) => setOpenSelect(open ? "paymentDueDay" : null)}
                      value={formData.paymentDueDay} 
                      onValueChange={(value) => handleSelectChange("paymentDueDay", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mileageAllowance">Mileage Preference</Label>
                    <Select 
                      open={openSelect === "mileageAllowance"}
                      onOpenChange={(open) => setOpenSelect(open ? "mileageAllowance" : null)}
                      value={formData.mileageAllowance} 
                      onValueChange={(value) => handleSelectChange("mileageAllowance", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unlimited">Unlimited Mileage</SelectItem>
                        <SelectItem value="1000">1,000 miles/week</SelectItem>
                        <SelectItem value="1500">1,500 miles/week</SelectItem>
                        <SelectItem value="2000">2,000 miles/week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    placeholder="Any special requests, out-of-state travel plans, or additional information..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Agreement */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Georgia Motor Vehicle Rental Agreement</CardTitle>
                <CardDescription>Please review the rental agreement below. Your information has been filled in automatically.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-6 max-h-125 overflow-y-auto text-sm space-y-6">
                  <div className="text-center border-b border-border pb-4">
                    <h3 className="font-bold text-lg text-foreground">DRIVE BOUNDLESS AUTO SOLUTIONS</h3>
                    <h3 className="font-bold text-lg text-foreground">GEORGIA MOTOR VEHICLE RENTAL AGREEMENT</h3>
                    <div className="text-muted-foreground mt-2 space-y-1">
                      <p>Operated by Turchese Solutions LLC</p>
                      <p>Email: info@turcheseconsulting.com</p>
                      <p>Phone: +1 929-213-5106</p>
                    </div>
                    <p className="text-muted-foreground mt-2">This Motor Vehicle Rental Agreement (&quot;Agreement&quot;) is entered into between:</p>
                  </div>

                  {/* Company Info */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Rental Company:</h4>
                      <p>Turchese Solutions LLC d/b/a Boundless Auto Solutions</p>
                      <p>Address: To be communicated via text or email</p>
                      <p>Phone: +1 929-213-5106</p>
                      <p>info@turcheseconsulting.com</p>
                      <p className="text-xs text-muted-foreground">(&quot;Owner&quot; or &quot;Company&quot;)</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Renter:</h4>
                      <p><strong>Name:</strong> {valueOrPlaceholder(formData.fullName)}</p>
                      <p><strong>License:</strong> {valueOrPlaceholder(formData.licenseNumber)} / {valueOrPlaceholder(formData.licenseState, "__")}</p>
                      <p><strong>Address:</strong> {formData.address ? `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}` : placeholder("_______________")}</p>
                      <p><strong>Phone:</strong> {valueOrPlaceholder(formData.phone)}</p>
                      <p><strong>Email:</strong> {valueOrPlaceholder(formData.email)}</p>
                      <p><strong>Insurance:</strong> {formData.insuranceCarrier || placeholder("Not provided at submission")} {formData.insurancePolicyNumber ? `- ${formData.insurancePolicyNumber}` : ""}</p>
                      <p className="text-xs text-muted-foreground">(&quot;Renter&quot;)</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">IDENTIFICATION OF THE RENTAL VEHICLE</h4>
                    <p className="mb-2">Owner hereby agrees to rent to Renter a passenger vehicle identified as follows:</p>
                    {selectedVehicle ? (
                      <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Make:</strong> {selectedVehicle.make}</li>
                        <li><strong>Model:</strong> {selectedVehicle.model}</li>
                        <li><strong>Year:</strong> {selectedVehicle.year}</li>
                        <li><strong>Color:</strong> {selectedVehicle.color}</li>
                        <li><strong>VIN:</strong> To be recorded at pickup</li>
                        <li><strong>License Plate:</strong> To be recorded at pickup</li>
                      </ul>
                    ) : (
                      <p className="text-muted-foreground italic">No vehicle selected</p>
                    )}
                    <p className="mt-2 text-muted-foreground">
                      This Car Rental Agreement is entered into between Turchese Solutions LLC DBA Boundless Autos and {valueOrPlaceholder(formData.fullName, "Renter")} and outlines the respective rights and obligations of the Parties relating to the rental of a vehicle. Renter is not Owner&apos;s agent for any purpose and may not assign, delegate, or transfer obligations under this Agreement.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">1. RENTAL TERM</h4>
                    <p><strong>Estimated Start Date:</strong> {formatDateTime(formData.startDate, formData.startTime)}</p>
                    <p><strong>Estimated End Date:</strong> {formatDateTime(formData.endDate, formData.endTime)}</p>
                    <p className="mt-2 text-muted-foreground">
                      The term begins at vehicle pickup and continues until the vehicle is returned to Owner and all Agreement terms have been completed by both Parties. If Client returns the rental vehicle before the rental week is complete, Client remains responsible for the full weekly payment. A refundable security deposit of $50 is due at initial pickup. Weekly payment is due by 5:00 PM, or a $50 late fee will apply.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">2. RENTAL FEES</h4>
                    {selectedVehicle && (
                      <ul className="list-disc pl-6 space-y-1 mb-2">
                        <li>
                          <strong>Selected Price Option:</strong>{" "}
                          {selectedRateLabel && selectedRatePrice
                            ? `${selectedRateLabel} - $${selectedRatePrice} per ${formData.rentalRate}`
                            : "To be selected"}
                        </li>
                        <li><strong>Base Fee:</strong> ${selectedVehicle.pricePerWeek} per week</li>
                        <li><strong>Rental Fee for Days Beyond Rental Term:</strong> ${selectedVehicle.pricePerDay} per day</li>
                        <li><strong>Security Deposit:</strong> $50</li>
                        <li><strong>Delivery Fee:</strong> ${selectedVehicle.deliveryFee}</li>
                      </ul>
                    )}
                    <p><strong>Weekly payments are due by:</strong> 5:00 PM on {formData.paymentDueDay} each week.</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2 text-muted-foreground">
                      <li>Late fee is $50 per day. On Day 2, the car may be repossessed.</li>
                      <li>To receive an extension, half of the weekly payment must be paid on the due date. If payment is not received, the vehicle must be returned.</li>
                      <li>Renter is responsible for a $1,000 deductible when damage is done to the vehicle if damages are under $1,000.</li>
                      <li>If the vehicle is repossessed for missed payment or any other reason, the deposit will be forfeited.</li>
                      <li>Vehicle is for in-state use only. If taken out of state, it may be reported stolen.</li>
                      <li>Renter is responsible for any damage to the vehicle.</li>
                      <li>If Renter terminates the agreement before the end date, Renter forfeits the deposit.</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      The Parties may shorten or extend the estimated rental term by written mutual consent. If the agreement is shortened, the Renter remains liable for the full weekly payment.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">3. DEPOSIT</h4>
                    <p>A deposit fee of $50 is required at the initial meeting for the rental vehicle. This deposit is fully refundable provided that:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Vehicle is returned in the same condition in which it was released.</li>
                      <li>No smoke or odor is present in the vehicle.</li>
                      <li>No missed payment requiring repossession.</li>
                      <li>Vehicle is not excessively dirty or filled with trash beyond normal use.</li>
                      <li>Key is not misplaced.</li>
                    </ul>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">4. MILEAGE</h4>
                    <p><strong>Mileage Allotted:</strong> {formData.mileageAllowance === "unlimited" ? "Unlimited" : `${formData.mileageAllowance} miles per week`}</p>
                    <p><strong>Rate for Extra Mileage:</strong> {formData.mileageAllowance === "unlimited" ? "N/A" : "$0.25 per mile over allowance"}</p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">5. ADDITIONAL CHARGES AND CONDITIONS</h4>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>A reasonable fee of $60 will be charged for interior cleaning if stains, dirt, odor, or soiling attributable to Renter&apos;s use cannot be cleaned using standard post-rental procedures.</li>
                      <li>If the key or key fob is not returned with the vehicle, a $300 replacement fee will apply.</li>
                      <li>Smoking, including e-cigarettes, is prohibited in the vehicle. If the car smells of smoke or vapor residue, the full deposit will be forfeited.</li>
                      <li>Renter and any third party billed for rental charges are jointly and severally responsible for payment of all charges.</li>
                      <li>If the vehicle uses automatic toll payment capability, Renter will be charged the toll fee plus an administrative fee.</li>
                      <li>Turchese Solutions LLC DBA Boundless Autos may rescind the Rental Agreement in the event of a manifest pricing or description error.</li>
                    </ul>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">6. TAXES, SURCHARGES & FEES</h4>
                    <p className="text-muted-foreground">
                      Renter will pay all applicable taxes and any additional charges provided in the Rental Agreement that are above the base rental rate. These may include surcharges and recovery fees.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">7. CHANGES</h4>
                    <p className="text-muted-foreground">
                      Any change to this Rental Agreement or Owner&apos;s rights must be in writing and signed by an authorized officer. Turchese Solutions LLC DBA Boundless Autos reserves the right to modify these Terms and Conditions upon written or electronic notice. Such changes apply only to future rentals after notice has been given.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">8. WHO MAY DRIVE THE CAR</h4>
                    <p className="mb-2">Renter represents that Renter is a capable and legally licensed driver and will remain so during the rental term. Only the following individuals may drive the vehicle:</p>
                    <ol className="list-decimal pl-6 space-y-1">
                      <li><strong>Primary Renter:</strong> {valueOrPlaceholder(formData.fullName)}</li>
                      <li>Renter&apos;s spouse or domestic partner, if approved by Owner</li>
                      <li>Employer or fellow employee under a corporate rental arrangement, if approved by Owner</li>
                      {additionalDrivers.map((driver, idx) => (
                        <li key={idx}>
                          <strong>Approved Additional Driver {idx + 1}:</strong> {valueOrPlaceholder(driver.name)} (License: {valueOrPlaceholder(driver.licenseNumber, "___")} / {valueOrPlaceholder(driver.licenseState, "__")})
                        </li>
                      ))}
                    </ol>
                    <p className="mt-2 text-muted-foreground">
                      All permitted drivers must be at least 25 years old, hold a valid driver&apos;s license, and be approved by Owner. Any additional driver must sign an additional driver form. Renter remains financially responsible for the vehicle regardless of who operates it.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">9. RETURN OF THE CAR</h4>
                    <p className="text-muted-foreground">
                      Renter agrees to return the vehicle in the same condition received, ordinary wear and tear excepted, at the agreed date, time, and location. If returned late, additional rental fees and late return fees may apply. Extensions must be requested and approved before the return date.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">10. REPOSSESSING THE CAR</h4>
                    <p className="mb-2">Turchese Solutions LLC DBA Boundless Autos may repossess the vehicle at any time for reasons including but not limited to:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Failure to return vehicle when due</li>
                      <li>Missed payments</li>
                      <li>Illegal use</li>
                      <li>Violation of Rental Agreement</li>
                      <li>Abandonment</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">Renter agrees to reimburse all repossession costs and forfeit the security deposit if repossession occurs.</p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">11. DAMAGE TO / LOSS OF THE CAR</h4>
                    <p className="mb-2">Renter and/or Renter&apos;s insurance are responsible for all loss or damage to the vehicle regardless of cause. If the vehicle is damaged, stolen, or lost, Renter is responsible for:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Repair costs</li>
                      <li>Diminished value</li>
                      <li>Fair market value</li>
                      <li>Loss of use</li>
                      <li>Administrative fees</li>
                      <li>Towing and storage fees</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">If using in-house insurance, Renter is responsible for a $1,000 deductible. Unauthorized repairs will not be reimbursed.</p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">12. PROHIBITED USE OF THE CAR</h4>
                    <p>The following actions automatically terminate this Rental Agreement and void all liability protections:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2 text-muted-foreground">
                      <li>Unauthorized drivers</li>
                      <li>Carrying passengers/property for hire</li>
                      <li>Towing</li>
                      <li>Racing</li>
                      <li>Off-road driving</li>
                      <li>Driving under the influence</li>
                      <li>Illegal activity</li>
                      <li>Reckless driving</li>
                      <li>Driving into Mexico without permission</li>
                      <li>Failure to report accidents</li>
                      <li>Fraud or misrepresentation</li>
                      <li>Leaving keys in unattended vehicle</li>
                      <li>Texting or handheld phone use while driving</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      Violations make Renter liable for all related damages, penalties, legal fees, and recovery costs.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">13. FUEL SERVICE CHARGE</h4>
                    <p className="text-muted-foreground">
                      Most rentals include a full tank of fuel. Renter may avoid fuel service charges by returning the vehicle with the same fuel level and presenting a fuel receipt if requested. Only the correct fuel type may be used.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">14. SECURITY DEPOSIT</h4>
                    <p>Renter must provide a security deposit of $50. Owner may place a hold on a credit card instead. The deposit may be used toward:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2 text-muted-foreground">
                      <li>Damage repairs</li>
                      <li>Smoking violations</li>
                      <li>Late returns</li>
                      <li>Mechanical or physical damage</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      If damages exceed the deposit amount, Renter is responsible for the remaining balance. No exceptions.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">15. PROPERTY IN THE CAR</h4>
                    <p className="text-muted-foreground">
                      Turchese Solutions LLC DBA Boundless Autos is not responsible for loss, theft, or damage to personal property left in or on the vehicle or on company premises.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">16. INSURANCE</h4>
                    <p><strong>Renter&apos;s Insurance:</strong> {formData.insuranceCarrier || placeholder("Not provided at submission")} {formData.insurancePolicyNumber ? `- Policy #${formData.insurancePolicyNumber}` : ""}</p>
                    <p className="mt-2 text-muted-foreground">
                      Renter must provide proof of insurance covering damage to the Rental Vehicle, personal injury, passenger injuries, and property damage. Turchese Solutions LLC DBA Boundless Autos must be added to the insurance policy and notified of any policy changes. If using company insurance, Renter is responsible for a $1,000 deductible for at-fault accidents or damages. Failure to pay deductible within 7 days may result in legal action.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">17. INDEMNIFICATION</h4>
                    <p className="text-muted-foreground">
                      Renter agrees to indemnify and hold harmless the Owner from all claims, losses, damages, and legal actions arising from Renter&apos;s use of the Rental Vehicle. This includes attorney&apos;s fees, parking tickets, moving violations, and citations.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">18. COLLECTIONS</h4>
                    <p className="text-muted-foreground">
                      If Renter fails to pay amounts due under this Agreement, a late charge of 1.5% per month may apply. Renter agrees to pay court costs, attorney&apos;s fees, collection fees, and recovery costs. Renter authorizes contact with Renter or Renter&apos;s employer regarding collection of unpaid balances.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">19. REPRESENTATIONS AND WARRANTIES</h4>
                    <p className="text-muted-foreground">
                      Owner represents that the Rental Vehicle is in good condition and safe for operation. Renter represents that Renter is legally entitled to operate a motor vehicle and will not operate the vehicle unlawfully or negligently. Renter acknowledges inspection of the vehicle and is unaware of damage other than that listed in a separate Existing Damage document.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">20. ENTIRE AGREEMENT</h4>
                    <p className="text-muted-foreground">
                      This Car Rental Agreement constitutes the entire agreement between the Parties. No modification may be made unless in writing and signed by both Parties. There are no refunds for cancellations once a vehicle is reserved or if the vehicle breaks down during the rental period. If mechanical failure occurs due to Owner negligence, reasonable efforts will be made to extend the rental or provide a substitute vehicle. Walk-around inspections and photographs will be conducted before and after rental. Renter is responsible for any damage occurring while the vehicle is in Renter&apos;s possession.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">SIGNATURES</h4>
                    <div className="grid sm:grid-cols-2 gap-6 mt-4">
                      <div>
                        <p className="font-medium text-foreground">RENTER</p>
                        <p className="mt-2">
                          Renter&apos;s Signature:{" "}
                          {agreementAccepted ? (
                            <span className="inline-block min-w-56 border-b border-foreground px-2 pb-0.5">
                              {valueOrPlaceholder(formData.fullName)}
                            </span>
                          ) : (
                            placeholder("_________________________________")
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">OWNER / COMPANY</p>
                        <p className="mt-2">
                          Date:{" "}
                          {agreementAccepted ? (
                            <span className="inline-block min-w-40 border-b border-foreground px-2 pb-0.5">
                              {formatAgreementDate(agreementAcceptedAt)}
                            </span>
                          ) : (
                            placeholder("_______________")
                          )}
                        </p>
                        <p>
                          Signature:{" "}
                          {agreementAccepted ? (
                            <span className="inline-block min-w-56 border-b border-foreground px-2 pb-0.5">
                              Turchese Solutions LLC
                            </span>
                          ) : (
                            placeholder("_________________________________")
                          )}
                        </p>
                      </div>
                    </div>
                    {additionalDrivers.length > 0 && (
                      <div className="mt-6 border-t border-border pt-4">
                        {additionalDrivers.map((driver, idx) => (
                          <div key={idx} className="mb-4">
                            <p className="font-medium text-foreground">ADDITIONAL DRIVER {idx + 1}</p>
                            <p className="mt-2">Name: {valueOrPlaceholder(driver.name)}</p>
                            <p>Signature: {placeholder("_________________________________")}</p>
                            <p>Date: {placeholder("_______________")}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="agreement" 
                    checked={agreementAccepted}
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true
                      setAgreementAccepted(isChecked)
                      setAgreementAcceptedAt(isChecked ? new Date().toISOString() : null)
                      if (checked) {
                        toast.success("Agreement accepted", {
                          description: "You can now submit your rental request.",
                        })
                      }
                    }}
                  />
                  <Label htmlFor="agreement" className="text-sm leading-relaxed cursor-pointer">
                    I, <strong>{formData.fullName || placeholder("[Renter Name]")}</strong>, have read, understood, and agree to the terms of this Georgia Motor Vehicle Rental Agreement. 
                    I understand that this is a legally binding contract and that I am responsible for all obligations outlined herein.
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < 4 ? (
              <Button
                type="button"
                onClick={handleNextStep}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isStepValid(4) || isSubmitting}
                className="bg-accent hover:bg-accent/90"
              >
                {isSubmitting ? "Submitting..." : "Submit Rental Request"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
