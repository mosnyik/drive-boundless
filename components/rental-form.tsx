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
import { Upload, FileText, Check, Calendar, User, Car, Shield, Plus, X, Clock } from "lucide-react"
import type { Vehicle } from "./vehicle-fleet"

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [additionalDrivers, setAdditionalDrivers] = useState<AdditionalDriver[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    // Payment Terms
    paymentDueDay: "Monday",
    // Mileage
    mileageAllowance: "unlimited",
    // Additional Notes
    additionalNotes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
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
    
    if (!agreementAccepted) {
      toast.error("Agreement required", {
        description: "Please read and accept the rental agreement to proceed.",
      })
      return
    }
    
    setIsSubmitting(true)
    toast.loading("Submitting your rental request...", { id: "submit" })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success("Application submitted successfully!", {
      id: "submit",
      description: "We will contact you within 24 hours to confirm your booking.",
    })
    
    setIsSubmitting(false)
    setIsSubmitted(true)
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
        if (!formData.insuranceCarrier || !formData.insurancePolicyNumber) missing2.push("insurance info")
        return `Please complete: ${missing2.join(", ")}`
      case 3:
        const missing3 = []
        if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) missing3.push("rental dates/times")
        if (!formData.rentalPurpose) missing3.push("rental purpose")
        if (!selectedVehicle) missing3.push("vehicle selection")
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
        return formData.licenseNumber && formData.licenseState && formData.licenseExpiry && licenseFile && formData.insuranceCarrier && formData.insurancePolicyNumber
      case 3:
        return formData.rentalPurpose && formData.startDate && formData.startTime && formData.endDate && formData.endTime && selectedVehicle
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "_______________"
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "_______________"
    const date = formatDate(dateStr)
    return timeStr ? `${date} at ${timeStr}` : date
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
            Thank you for your rental request. Our team will review your application 
            and contact you within 24 hours to confirm your booking and finalize the rental agreement.
          </p>
          <Button onClick={() => {
            setIsSubmitted(false)
            setStep(1)
            setFormData({
              fullName: "", address: "", city: "", state: "", zip: "",
              phone: "", email: "", licenseNumber: "", licenseState: "",
              licenseExpiry: "", insuranceCarrier: "", insurancePolicyNumber: "",
              rentalPurpose: "", startDate: "", startTime: "", endDate: "", endTime: "",
              paymentDueDay: "Monday", mileageAllowance: "unlimited", additionalNotes: "",
            })
            setLicenseFile(null)
            setAgreementAccepted(false)
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
            Request a premium vehicle rental in Lawrenceville, GA. All bookings require
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
                <CardDescription>Provide your license details, insurance information, and upload a clear photo of your license.</CardDescription>
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
                  <h4 className="font-medium mb-4">Insurance Information</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    You must maintain valid automobile insurance covering liability, collision, and property damage during the rental period.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="insuranceCarrier">Insurance Carrier *</Label>
                      <Input
                        id="insuranceCarrier"
                        name="insuranceCarrier"
                        value={formData.insuranceCarrier}
                        onChange={handleChange}
                        placeholder="State Farm, GEICO, etc."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="insurancePolicyNumber">Policy Number *</Label>
                      <Input
                        id="insurancePolicyNumber"
                        name="insurancePolicyNumber"
                        value={formData.insurancePolicyNumber}
                        onChange={handleChange}
                        placeholder="POL-123456789"
                        required
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
                <div className="bg-muted rounded-lg p-6 max-h-[500px] overflow-y-auto text-sm space-y-6">
                  <div className="text-center border-b border-border pb-4">
                    <h3 className="font-bold text-lg text-foreground">GEORGIA MOTOR VEHICLE RENTAL AGREEMENT</h3>
                    <p className="text-muted-foreground mt-2">This Motor Vehicle Rental Agreement (&quot;Agreement&quot;) is entered into between:</p>
                  </div>

                  {/* Company Info */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Rental Company:</h4>
                      <p>Drive Boundless Auto Solutions</p>
                      <p>Boundless Auto Solutions / Turchese Solutions LLC</p>
                      <p>driveboundless.com</p>
                      <p>267 Langley Drive, Suite 1438</p>
                      <p>Lawrenceville, GA 30046</p>
                      <p>(470) 403-0704</p>
                      <p>info@turcheseconsulting.com</p>
                      <p className="text-xs text-muted-foreground">(&quot;Owner&quot; or &quot;Company&quot;)</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Renter:</h4>
                      <p><strong>Name:</strong> {formData.fullName || "_______________"}</p>
                      <p><strong>License:</strong> {formData.licenseNumber || "_______________"} / {formData.licenseState || "__"}</p>
                      <p><strong>Address:</strong> {formData.address ? `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}` : "_______________"}</p>
                      <p><strong>Phone:</strong> {formData.phone || "_______________"}</p>
                      <p><strong>Email:</strong> {formData.email || "_______________"}</p>
                      <p><strong>Insurance:</strong> {formData.insuranceCarrier || "_______________"} - {formData.insurancePolicyNumber || "_______________"}</p>
                      <p className="text-xs text-muted-foreground">(&quot;Renter&quot;)</p>
                    </div>
                  </div>

                  {/* Section 1: Vehicle Information */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">1. VEHICLE INFORMATION</h4>
                    <p className="mb-2">The Owner agrees to rent the following vehicle to the Renter:</p>
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
                  </div>

                  {/* Section 2: Rental Term */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">2. RENTAL TERM</h4>
                    <p><strong>Rental Start Date & Time:</strong> {formatDateTime(formData.startDate, formData.startTime)}</p>
                    <p><strong>Rental End Date & Time:</strong> {formatDateTime(formData.endDate, formData.endTime)}</p>
                    <p className="mt-2 text-muted-foreground">
                      The Renter agrees to return the Vehicle on or before the agreed return date and time unless an extension is approved in writing by the Owner. Extensions are not guaranteed and are subject to vehicle availability and timely payment. If the Vehicle is returned late without authorization, additional daily rental charges and reasonable recovery expenses may apply.
                    </p>
                  </div>

                  {/* Section 3: Rental Payments */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">3. RENTAL PAYMENTS</h4>
                    {selectedVehicle && (
                      <ul className="list-disc pl-6 space-y-1 mb-2">
                        <li><strong>Daily Rental Rate:</strong> ${selectedVehicle.pricePerDay}</li>
                        <li><strong>Weekly Rental Rate:</strong> ${(selectedVehicle.pricePerDay * 7 * 0.9).toFixed(0)} (10% weekly discount)</li>
                        <li><strong>Security Deposit:</strong> To be determined</li>
                        <li><strong>Delivery Fee:</strong> ${selectedVehicle.deliveryFee}</li>
                      </ul>
                    )}
                    <p><strong>Weekly payments are due by:</strong> {formData.paymentDueDay} each week.</p>
                    <p className="mt-2 text-muted-foreground">
                      If payment is not received within 24 hours of the due date, the Owner may suspend the rental and demand immediate return of the Vehicle. Repeated late payments or failure to return the Vehicle after demand may constitute a material breach of this Agreement.
                    </p>
                  </div>

                  {/* Section 4: Security Deposit */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">4. SECURITY DEPOSIT</h4>
                    <p>The security deposit may be used to cover:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Unpaid rental charges</li>
                      <li>Excessive cleaning costs</li>
                      <li>Smoking remediation</li>
                      <li>Lost keys</li>
                      <li>Tolls, tickets, and administrative fees</li>
                      <li>Physical damage beyond ordinary wear and tear</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      Any unused portion of the deposit will be refunded within a reasonable time after the Vehicle is returned and inspected. The Renter remains responsible for costs exceeding the deposit amount.
                    </p>
                  </div>

                  {/* Section 5: Authorized Drivers */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">5. AUTHORIZED DRIVERS</h4>
                    <p className="mb-2">Only the following individuals may operate the Vehicle:</p>
                    <ol className="list-decimal pl-6 space-y-1">
                      <li><strong>Primary Renter:</strong> {formData.fullName || "_______________"}</li>
                      {additionalDrivers.map((driver, idx) => (
                        <li key={idx}>
                          <strong>Additional Driver {idx + 1}:</strong> {driver.name || "_______________"} (License: {driver.licenseNumber || "___"} / {driver.licenseState || "__"})
                        </li>
                      ))}
                    </ol>
                    <p className="mt-2 text-muted-foreground">
                      All drivers must be at least 23 years old, possess a valid driver&apos;s license, and maintain legally required automobile insurance. The Renter remains fully responsible for the Vehicle and all obligations under this Agreement regardless of who operates the Vehicle.
                    </p>
                  </div>

                  {/* Section 6: Insurance */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">6. INSURANCE</h4>
                    <p><strong>Renter&apos;s Insurance:</strong> {formData.insuranceCarrier || "_______________"} - Policy #{formData.insurancePolicyNumber || "_______________"}</p>
                    <p className="mt-2 text-muted-foreground">
                      The Renter must maintain valid automobile insurance covering liability, collision, and property damage during the rental period. Proof of insurance must be provided before the Vehicle is released. The Renter is responsible for any deductible, excluded loss, or uninsured damage caused during the rental period.
                    </p>
                  </div>

                  {/* Section 7-8: Condition & Use */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">7. CONDITION OF VEHICLE</h4>
                    <p className="text-muted-foreground">
                      The Renter acknowledges inspection of the Vehicle before taking possession. Any pre-existing damage shall be documented separately in a Vehicle Condition Report signed by both parties. The Vehicle must be returned in substantially the same condition, ordinary wear and tear excepted.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">8. USE OF VEHICLE</h4>
                    <p>The Vehicle shall not be used:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2 text-muted-foreground">
                      <li>For illegal purposes</li>
                      <li>In racing, speed testing, or off-road driving</li>
                      <li>To transport illegal substances or contraband</li>
                      <li>While under the influence of drugs or alcohol</li>
                      <li>To transport passengers for hire unless expressly authorized</li>
                      <li>By unauthorized drivers</li>
                      <li>To tow another vehicle unless approved in writing</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      Out-of-state travel must be approved in advance by the Owner. Violation of this section may result in termination of the rental and additional liability as permitted by Georgia law.
                    </p>
                  </div>

                  {/* Section 9: Mileage */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">9. MILEAGE</h4>
                    <p><strong>Mileage Allowance:</strong> {formData.mileageAllowance === "unlimited" ? "Unlimited" : `${formData.mileageAllowance} miles per week`}</p>
                    {formData.mileageAllowance !== "unlimited" && (
                      <p><strong>Excess Mileage Charge:</strong> $0.25 per mile over allowance</p>
                    )}
                  </div>

                  {/* Section 10-15: Policies */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">10. FUEL POLICY</h4>
                    <p className="text-muted-foreground">
                      The Vehicle must be returned with the same fuel level provided at pickup. If the Vehicle is returned with less fuel, the Renter may be charged for refueling plus a reasonable service fee.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">11. CLEANING AND SMOKING</h4>
                    <p className="text-muted-foreground">
                      Smoking and vaping are prohibited inside the Vehicle. The Renter may be charged reasonable cleaning or deodorizing fees for excessive dirt, stains, odors, pet hair, smoke residue, or trash beyond normal use.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">12. KEYS, TOLLS, AND FEES</h4>
                    <p className="text-muted-foreground">
                      The Renter is responsible for lost or damaged keys/key fobs, parking tickets, traffic violations, toll charges, and towing/impound fees caused by the Renter&apos;s conduct. Reasonable administrative fees may apply where permitted by law.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">13. DAMAGE, LOSS, OR ACCIDENTS</h4>
                    <p className="text-muted-foreground">
                      The Renter must immediately notify the Owner of any accident, theft, vandalism, mechanical issue, or damage involving the Vehicle. The Renter agrees to cooperate with insurance investigations and claims processing. The Renter shall not authorize repairs without prior written approval from the Owner except where necessary to prevent immediate safety hazards.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">14. RETURN OF VEHICLE</h4>
                    <p className="text-muted-foreground">
                      The Vehicle must be returned on the agreed date and time, to the approved return location, and with all keys and accessories. Failure to return the Vehicle after written or verbal demand may result in recovery actions permitted by law.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">15. REPOSSESSION</h4>
                    <p className="text-muted-foreground">
                      The Owner may recover possession of the Vehicle if: the Vehicle is not returned as agreed; required payments are not made; the Vehicle is abandoned; the Vehicle is used unlawfully; or there is a material breach of this Agreement. The Owner shall exercise recovery rights in compliance with applicable Georgia law.
                    </p>
                  </div>

                  {/* Section 16: Limitation of Liability */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">16. LIMITATION OF LIABILITY, ASSUMPTION OF RISK, AND INDEMNIFICATION</h4>
                    <p className="text-muted-foreground mb-2">
                      The Renter accepts full responsibility for the care, custody, and control of the Vehicle during the rental period. To the fullest extent permitted by Georgia law, the Renter assumes all risk arising from possession, operation, parking, storage, or use of the Vehicle.
                    </p>
                    <p className="text-muted-foreground mb-2">
                      The Renter agrees to indemnify, defend, and hold harmless the Owner, Turchese Solutions LLC, Boundless Auto Solutions, its members, officers, employees, contractors, and agents from and against any and all claims, demands, liabilities, damages, losses, judgments, fines, penalties, costs, attorney&apos;s fees, and legal proceedings arising from operation or use of the Vehicle.
                    </p>
                    <p className="text-muted-foreground">
                      The Renter authorizes the Owner to charge any payment method on file for unpaid balances, damages, fees, tolls, citations, repossession expenses, and lawful charges arising under this Agreement.
                    </p>
                  </div>

                  {/* Section 17-20 */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">17. BREAKDOWNS AND MAINTENANCE</h4>
                    <p className="text-muted-foreground">
                      The Owner represents that the Vehicle is believed to be in reasonably safe operating condition at the start of the rental. The Renter must promptly report mechanical issues. If a breakdown occurs not caused by misuse or negligence, the Owner may provide a replacement vehicle, extend the rental period, or provide a partial credit at its discretion.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">18. DEFAULT AND COLLECTION COSTS</h4>
                    <p className="text-muted-foreground">
                      If amounts owed under this Agreement remain unpaid, the Renter agrees to pay lawful collection costs, court costs, and reasonable attorney&apos;s fees where permitted by law.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">19. GOVERNING LAW</h4>
                    <p className="text-muted-foreground">
                      This Agreement shall be governed by and interpreted under the laws of the State of Georgia. Any legal action relating to this Agreement shall be brought in a court of competent jurisdiction in Georgia.
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">20. ENTIRE AGREEMENT</h4>
                    <p className="text-muted-foreground">
                      This Agreement constitutes the entire agreement between the parties and supersedes prior discussions or understandings. Any amendment must be in writing and signed by both parties. Electronic signatures shall be treated as originals to the extent permitted by law.
                    </p>
                  </div>

                  {/* Acknowledgment */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">21. ACKNOWLEDGMENT</h4>
                    <p className="text-muted-foreground mb-4">
                      By signing below, the parties acknowledge that they have read, understood, and agreed to the terms of this Agreement.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-6 mt-4">
                      <div>
                        <p className="font-medium text-foreground">RENTER</p>
                        <p className="mt-2">Name: {formData.fullName || "_______________"}</p>
                        <p>Signature: _________________________________</p>
                        <p>Date: {formatDate(new Date().toISOString().split('T')[0])}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">OWNER / COMPANY</p>
                        <p className="mt-2">Drive Boundless Auto Solutions</p>
                        <p>Signature: _________________________________</p>
                        <p>Date: _______________</p>
                      </div>
                    </div>
                    {additionalDrivers.length > 0 && (
                      <div className="mt-6 border-t border-border pt-4">
                        {additionalDrivers.map((driver, idx) => (
                          <div key={idx} className="mb-4">
                            <p className="font-medium text-foreground">ADDITIONAL DRIVER {idx + 1}</p>
                            <p className="mt-2">Name: {driver.name || "_______________"}</p>
                            <p>Signature: _________________________________</p>
                            <p>Date: _______________</p>
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
                      setAgreementAccepted(checked as boolean)
                      if (checked) {
                        toast.success("Agreement accepted", {
                          description: "You can now submit your rental request.",
                        })
                      }
                    }}
                  />
                  <Label htmlFor="agreement" className="text-sm leading-relaxed cursor-pointer">
                    I, <strong>{formData.fullName || "[Renter Name]"}</strong>, have read, understood, and agree to the terms of this Georgia Motor Vehicle Rental Agreement. 
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
