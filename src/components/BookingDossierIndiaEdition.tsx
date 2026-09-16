import React, { useState } from 'react';
import { StructuredLook, Professional, Booking } from '../types/aura';
import { auraApi } from '../services/api';

interface BookingDossierIndiaEditionProps {
  currentLook: StructuredLook | null;
  selectedArtisan: Professional | null;
  onBookingSuccess: (bookingId: string) => void;
  onOpenVisualBrief: () => void;
  onBackToArtists: () => void;
}

export const BookingDossierIndiaEdition: React.FC<BookingDossierIndiaEditionProps> = ({
  currentLook,
  selectedArtisan,
  onBookingSuccess,
  onOpenVisualBrief,
  onBackToArtists
}) => {
  const [date, setDate] = useState('2025-10-28');
  const [readyByTime, setReadyByTime] = useState('15:00');
  const [venueType, setVenueType] = useState<'home' | 'salon'>('home');
  const [address, setAddress] = useState('B-42, Sector 50, Noida, Uttar Pradesh 201301');
  const [gatePass, setGatePass] = useState('Block B, Tower 3, Flat 802. Security pass pre-approved.');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Financial calculations
  const makeupPrice = 2500;
  const hairDrapePrice = 1500;
  const dispatchFee = venueType === 'home' ? 300 : 0;
  const subtotal = makeupPrice + hairDrapePrice + dispatchFee;
  const deposit = Math.round(subtotal * 0.25);
  const balanceDue = subtotal - deposit;

  // Format time display
  const formatTimeSlot = (timeStr: string): string => {
    if (!timeStr) return '03:00 PM';
    const [h, m] = timeStr.split(':').map(Number);
    if (isNaN(h)) return timeStr;
    const period = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    const formattedMinute = String(m || 0).padStart(2, '0');
    return `${String(formattedHour).padStart(2, '0')}:${formattedMinute} ${period}`;
  };

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    setBookingError(null);
    const formattedTime = formatTimeSlot(readyByTime);

    try {
      const response = await auraApi.createBooking({
        professionalId: selectedArtisan?.id || 'priya_sharma',
        professionalName: selectedArtisan?.name || 'Priya Sharma',
        professionalPhoto: selectedArtisan?.profilePhoto || 'https://lh3.googleusercontent.com/aida/AEtjO1Xc9cu67xwSQxFkbxpKRtYzXeRJZaJlFPnr3yt69eyZKXcjoe_TzYUcX-dfs1VFtMdQDT6iDmZNr1wX0lLlY0e7yTlIgdE_0oY8Qr1-RnZ7ERXImdJW5cy9XusLZLrBAPgbi8KqNek2imR199B-kPMLNFAcbunaEH8zaeSDlkMDG_jo7rhBLNtBItZpRg1whrBunaZakwcyhUoi3wjEV1FAf8TLUvp9UfaO890oAmFbowOGw_6l5W6Zyqw-',
        services: [
          { id: 'srv_1', name: 'Bridal Guest HD Makeup & Sculpt', price: makeupPrice, category: 'makeup', durationMinutes: 60, description: 'HD makeup with sterilized vanity kit' },
          { id: 'srv_2', name: 'Architectural Hair & Saree Draping', price: hairDrapePrice, category: 'hair', durationMinutes: 45, description: 'Hair chignon & single-pleat saree drape' }
        ],
        coverageType: venueType === 'home' ? 'at-home' : 'studio',
        date: date,
        time: formattedTime,
        address: venueType === 'home' ? address : 'Sector 18 Atelier, Noida',
        totalPrice: subtotal,
        status: 'confirmed',
        lookId: currentLook?.id || currentLook?.lookId,
        lookTitle: currentLook?.title || 'Pastel Saree & Kundan Harmony'
      });

      setCreatedBooking(response);
      setIsProcessing(false);
      setBookingConfirmed(true);

      // Trigger callback with real booking ID after short delay for user acknowledgment
      setTimeout(() => {
        if (response?.id) {
          onBookingSuccess(response.id);
        }
      }, 2400);
    } catch (err: any) {
      setIsProcessing(false);
      setBookingError(err.message || 'Failed to confirm booking. Please choose another slot or verify artisan availability.');
    }
  };

  if (bookingConfirmed) {
    const bookingRef = createdBooking?.id || 'Dossier AUR-2025-NCR-904';
    const artisanName = createdBooking?.professionalName || selectedArtisan?.name || 'Priya Sharma';
    const bookingDate = createdBooking?.date || date;
    const bookingTime = createdBooking?.time || formatTimeSlot(readyByTime);
    const bookingAddress = createdBooking?.address || address;

    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] px-margin-mobile text-center max-w-md mx-auto py-8 animate-fade-in">
        <div className="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center mb-4 shadow-md">
          <span className="material-symbols-outlined text-[32px]">check</span>
        </div>
        <span className="font-label-caps text-label-caps tracking-widest uppercase text-secondary">
          Dossier Dispatched // Confirmed
        </span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mt-1">
          AURA Itinerary Locked
        </h2>
        <p className="font-body-md text-body-md text-secondary mt-2 leading-relaxed">
          Your master artist <strong className="text-on-surface">{artisanName}</strong> has received your AURA Visual Brief. Deposit receipt generated.
        </p>

        <div className="mt-6 p-4 bg-surface-container-low border border-surface-container w-full text-left font-caption text-caption space-y-2 text-on-surface">
          <div className="flex justify-between border-b border-surface-container pb-1.5">
            <span className="text-secondary">Dossier Reference:</span>
            <span className="font-mono font-medium text-primary">{bookingRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Artisan &amp; Date:</span>
            <span className="font-medium">{artisanName} • {bookingDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Scheduled Time:</span>
            <span className="font-medium">{bookingTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Fulfillment:</span>
            <span className="font-medium">{venueType === 'home' ? 'At-Home Vanity' : 'Atelier Studio'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Dispatch Address:</span>
            <span className="font-medium text-right max-w-[200px] truncate">{bookingAddress}</span>
          </div>
          <div className="border-t border-surface-container pt-1.5 flex justify-between">
            <span className="text-secondary">Advance Deposit Paid:</span>
            <span className="font-mono font-medium text-primary">₹{deposit.toLocaleString('en-IN')} (UPI)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Balance at Doorstep:</span>
            <span className="font-mono font-medium">₹{balanceDue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="mt-6 w-full space-y-2">
          <button
            type="button"
            onClick={() => onBookingSuccess(createdBooking?.id || 'bk_new')}
            className="w-full py-3 bg-primary text-on-primary font-label-caps text-[11px] uppercase tracking-widest hover:bg-on-surface transition-colors shadow-sm"
          >
            View in My AURA Appointments
          </button>
          <p className="font-caption text-[11px] text-secondary">
            Redirecting automatically to your dossier archive...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-32 text-on-surface">
      {/* Top Header */}
      <header className="w-full px-margin-mobile pt-3 pb-3 flex items-center justify-between border-b border-surface-container bg-surface-container-lowest max-w-screen-md mx-auto">
        <button
          onClick={onBackToArtists}
          className="flex items-center gap-1.5 text-on-surface hover:text-secondary transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="font-label-caps text-label-caps tracking-widest uppercase">Back to Artists</span>
        </button>
        <span className="font-label-caps text-[9px] uppercase tracking-widest text-on-surface-variant bg-surface-container-low px-2 py-1 border border-surface-container">
          Dossier 042 // Noida Sector 50
        </span>
      </header>

      {/* Protocol Progress Indicator */}
      <div className="w-full bg-surface-container-low px-margin-mobile py-2.5 border-b border-surface-container">
        <div className="max-w-screen-md mx-auto flex items-center justify-between text-[10px] font-label-caps uppercase tracking-wider">
          <span className="flex items-center gap-1 text-primary font-medium">
            <span className="material-symbols-outlined text-[14px]">check_circle</span> 1. Look Synthesized
          </span>
          <span className="text-outline">→</span>
          <span className="flex items-center gap-1 text-primary font-medium">
            <span className="material-symbols-outlined text-[14px]">check_circle</span> 2. Artists Matched
          </span>
          <span className="text-outline">→</span>
          <span className="flex items-center gap-1 text-on-surface font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-0.5"></span> 3. Dossier &amp; Protocol
          </span>
        </div>
      </div>

      <div className="max-w-screen-md mx-auto w-full px-margin-mobile space-y-space-md mt-space-md">
        {/* Title */}
        <div>
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">Execution Dossier</span>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight mt-0.5">
            Appointment Itinerary &amp; Protocol
          </h1>
          <p className="font-body-sm text-body-sm text-secondary">
            Synchronized timeline for dual-artist at-home dispatch in Noida Sector 50
          </p>
        </div>

        {/* Linked AURA Look Blueprint Box */}
        <section className="p-space-md bg-surface-container-lowest border border-surface-container shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-16 h-20 bg-surface-container overflow-hidden shrink-0 border border-surface-container-high">
              <img
                alt="Linked Look"
                className="w-full h-full object-cover"
                src={currentLook?.heroImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPwyMPQ14shbk7YzdSKBfOQSWOF3LJG2-PWZXDmybRaABNUYEpsDB8EP22xYKEZHRCCltvZd4_C7HKWYFy5QgzulDfDl5aysBjVrMLFpv0UiW2mblJ3mRlzDU0_o9SfQCsp7BDl1E6NU1oFSHLr6_8IT62iCVrB3pXHkoQIaW8s1LVvyZ8ZHY9xJrAp4i1bYsQBZGmtuRrMfh1oS1kqJtFOFQxmPmmBgNnjR3jj0sKbNq8BpEmLgkQJA'}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary font-medium">
                  Linked AURA Blueprint
                </span>
                <span className="font-caption text-[10px] text-secondary">Ref #D480</span>
              </div>
              <h2 className="font-subheading text-subheading font-medium text-on-surface mt-0.5 truncate">
                {currentLook?.title || 'Pastel Saree & Kundan Harmony'}
              </h2>
              <p className="font-caption text-caption text-secondary mt-1 line-clamp-2">
                HD Satin Visage • Textured Low Chignon • Kundan Neckline Symmetry • Ivory Silk Saree Single-Pleat
              </p>
              <button
                onClick={onOpenVisualBrief}
                className="mt-2 text-[10px] font-label-caps uppercase tracking-wider text-primary underline underline-offset-2 hover:text-secondary flex items-center gap-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[13px]">visibility</span>
                <span>Inspect Visual Brief &amp; Formulation Specs</span>
              </button>
            </div>
          </div>
        </section>

        {/* Multi-Artisan Timeline Sequence */}
        <section className="p-space-md bg-surface-container-lowest border border-surface-container shadow-sm space-y-space-sm">
          <div className="flex items-baseline justify-between border-b border-surface-container pb-2">
            <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">
              Synchronized Execution Timeline
            </span>
            <span className="font-caption text-caption text-primary font-medium">Seamless Transition</span>
          </div>

          {/* Service 1: Priya Sharma */}
          <div className="p-3 bg-surface-container-low border border-surface-container flex items-start gap-3">
            <div className="w-12 h-12 bg-surface-container rounded-full overflow-hidden shrink-0 mt-0.5">
              <img
                alt="Priya Sharma"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida/AEtjO1Xc9cu67xwSQxFkbxpKRtYzXeRJZaJlFPnr3yt69eyZKXcjoe_TzYUcX-dfs1VFtMdQDT6iDmZNr1wX0lLlY0e7yTlIgdE_0oY8Qr1-RnZ7ERXImdJW5cy9XusLZLrBAPgbi8KqNek2imR199B-kPMLNFAcbunaEH8zaeSDlkMDG_jo7rhBLNtBItZpRg1whrBunaZakwcyhUoi3wjEV1FAf8TLUvp9UfaO890oAmFbowOGw_6l5W6Zyqw-"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-primary font-medium">
                  03:00 PM – 04:15 PM (75 mins)
                </span>
                <span className="font-label-caps text-on-surface font-semibold">₹2,500</span>
              </div>
              <h3 className="font-subheading text-subheading text-on-surface font-medium mt-0.5">
                Bridal Guest HD Makeup &amp; Sculpt
              </h3>
              <p className="font-caption text-caption text-secondary">
                Priya Sharma • Master Visagiste (Sterilized Vanity Kit)
              </p>
            </div>
          </div>

          {/* Service 2: Rohan Mehra */}
          <div className="p-3 bg-surface-container-low border border-surface-container flex items-start gap-3">
            <div className="w-12 h-12 bg-surface-container rounded-full overflow-hidden shrink-0 mt-0.5">
              <img
                alt="Rohan Mehra"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZSRKpE9IQjWq_Rm8w3oljW-H-DQBj0UE77EPsQEQeb1Pn5ZdX6wsgoJ5Te0lHbPI384KSqHKVgUKtg06E8gBIOimrJC9DnxHqgaNssM9-vH6OMA1oYtqqaki6CQE9dXjFiF0yCiTFOY9Lq8cuVYFsUDHFMOJkYmEzAE-neWYeqKYwp86MT2vKkkXVmlTaZuOMxSu3UKE1wjKgpPFrivnQBuzpV0QHyrk_yZNJ2HSHgPsAKwcA8ADmGQ"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-secondary font-medium">
                  04:30 PM – 05:30 PM (60 mins)
                </span>
                <span className="font-label-caps text-on-surface font-semibold">₹1,500</span>
              </div>
              <h3 className="font-subheading text-subheading text-on-surface font-medium mt-0.5">
                Architectural Low Chignon &amp; Saree Draping
              </h3>
              <p className="font-caption text-caption text-secondary">
                Rohan Mehra • Senior Stylist (Flora Anchors &amp; Precision Pleating)
              </p>
            </div>
          </div>

          {/* Departure Callout */}
          <div className="p-2.5 bg-surface-container flex items-center justify-between font-caption text-caption text-on-surface">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
              Target Ready-By Time:
            </span>
            <span className="font-label-caps font-semibold">05:30 PM (30 min buffer before event)</span>
          </div>
        </section>

        {/* Schedule Timing & Venue Protocol */}
        <section className="p-space-md bg-surface-container-lowest border border-surface-container shadow-sm space-y-space-sm">
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">
            Date &amp; Venue Directives
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-caption text-caption uppercase tracking-wider text-secondary block mb-1">
                Event Date
              </label>
              <input
                className="w-full bg-surface-container-low border border-surface-container p-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="font-caption text-caption uppercase tracking-wider text-secondary block mb-1">
                Event Ready-By Time
              </label>
              <input
                className="w-full bg-surface-container-low border border-surface-container p-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary"
                type="time"
                value={readyByTime}
                onChange={(e) => setReadyByTime(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="font-caption text-caption uppercase tracking-wider text-secondary block mb-1">
              Fulfillment Modality
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVenueType('home')}
                className={`p-2.5 font-label-caps text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-colors ${
                  venueType === 'home'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-low text-on-surface border-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>At-Home Doorstep (+₹300)</span>
              </button>
              <button
                type="button"
                onClick={() => setVenueType('salon')}
                className={`p-2.5 font-label-caps text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-colors ${
                  venueType === 'salon'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-low text-on-surface border-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                <span>Studio Atelier (Sec 18)</span>
              </button>
            </div>
          </div>

          {venueType === 'home' && (
            <div className="space-y-2 pt-1">
              <div>
                <label className="font-caption text-caption uppercase tracking-wider text-secondary block mb-1">
                  Dispatch Address
                </label>
                <input
                  className="w-full bg-surface-container-low border border-surface-container p-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="font-caption text-caption uppercase tracking-wider text-secondary block mb-1">
                  Gate Pass / Arrival Instructions
                </label>
                <input
                  className="w-full bg-surface-container-low border border-surface-container p-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary"
                  type="text"
                  value={gatePass}
                  onChange={(e) => setGatePass(e.target.value)}
                />
              </div>
            </div>
          )}
        </section>

        {/* Split Payment Investment Breakdown */}
        <section className="p-space-md bg-surface-container-lowest border border-surface-container shadow-sm space-y-space-sm">
          <div className="flex items-baseline justify-between border-b border-surface-container pb-2">
            <div>
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">
                AURA Split Investment Model
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                Total ₹{subtotal.toLocaleString('en-IN')}
              </h2>
            </div>
            <span className="font-caption text-caption text-outline">Verified Pricing</span>
          </div>

          <div className="space-y-1.5 font-body-sm text-body-sm text-on-surface">
            <div className="flex justify-between">
              <span className="text-secondary">Priya Sharma (Bridal Guest HD)</span>
              <span>₹{makeupPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Rohan Mehra (Hair &amp; Draping)</span>
              <span>₹{hairDrapePrice.toLocaleString('en-IN')}</span>
            </div>
            {venueType === 'home' && (
              <div className="flex justify-between">
                <span className="text-secondary">Doorstep Mobile Vanity Dispatch</span>
                <span>₹{dispatchFee.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          {/* Split Payment Architecture Callout */}
          <div className="p-3 bg-surface-container-low border-l-2 border-primary border border-surface-container space-y-2 mt-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary font-semibold block">
                  1. Advance Booking Deposit (25%)
                </span>
                <span className="font-caption text-[11px] text-secondary">
                  Locks date on artists' private schedule
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-semibold">
                ₹{deposit.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-surface-container">
              <div>
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface font-medium block">
                  2. Balance on Fulfillment (75%)
                </span>
                <span className="font-caption text-[11px] text-secondary">
                  Pay directly via UPI/Cash after look completion
                </span>
              </div>
              <span className="font-subheading text-subheading text-on-surface font-semibold">
                ₹{balanceDue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2">
            <span className="font-caption text-caption uppercase tracking-wider text-secondary block mb-1.5">
              Select Advance Payment Channel
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'upi', label: 'UPI / GPay / Paytm' },
                { id: 'card', label: 'Credit / Debit Card' },
                { id: 'netbanking', label: 'Net Banking' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-2 font-label-caps text-[10px] uppercase tracking-wider border text-center transition-colors ${
                    paymentMethod === m.id
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-low text-on-surface border-surface-container'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {bookingError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 font-caption text-[11px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-red-600">error</span>
              <span>{bookingError}</span>
            </div>
          )}
        </section>
      </div>

      {/* Sticky Bottom Booking Bar */}
      <aside className="fixed bottom-20 left-0 right-0 z-40 px-margin-mobile py-3 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-container shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="font-caption text-[9px] uppercase tracking-widest text-secondary block">
              Pay Deposit Now
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface leading-none block mt-0.5">
              ₹{deposit.toLocaleString('en-IN')}
            </span>
            <span className="font-caption text-[10px] text-secondary block">
              Balance ₹{balanceDue.toLocaleString('en-IN')} at Doorstep
            </span>
          </div>
          <button
            onClick={handleConfirmBooking}
            disabled={isProcessing}
            className="shrink-0 h-12 px-5 bg-primary text-on-primary font-label-caps text-label-caps tracking-widest uppercase hover:bg-neutral-800 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            type="button"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                <span>Locking Schedule...</span>
              </>
            ) : (
              <>
                <span>Confirm &amp; Lock Dossier</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
};
