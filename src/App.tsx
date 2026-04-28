import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, Clock, Phone, Star, 
  Calendar as CalendarIcon, 
  CheckCircle2, ChevronRight, 
  Instagram, MessageCircle,
  Menu, X, Trophy, CreditCard, Stethoscope
} from 'lucide-react';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { ru, enUS, kk } from 'date-fns/locale';
import { cn } from './lib/utils';
import './i18n';

// Language configuration
const languages = [
  { code: 'ru', label: 'RU' },
  { code: 'kk', label: 'KK' },
  { code: 'en', label: 'EN' }
];

export default function App() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Booking state
  const [bookingType, setBookingType] = useState<'offline' | 'online'>('offline');
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingIssue, setBookingIssue] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  // Generate next 14 days for booking
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(today, i));
  
  // Available times (09:00 - 18:00 every hour)
  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const branches = [
    { id: 1, label: t('booking.branch1') },
    { id: 2, label: t('booking.branch2') },
    { id: 3, label: t('booking.branch3') },
    { id: 4, label: t('booking.branch4') },
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const isBranchValid = bookingType === 'online' || selectedBranch !== null;
    
    if (isBranchValid && selectedDate && selectedTime && bookingName && bookingPhone) {
      // Integration with Google Sheets / Webhook
      const GOOGLE_SHEETS_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK || 'https://script.google.com/macros/s/AKfycbwAsxVHRvfI7EQ1MfRjtU2M_6p6mwB5NJ_edbIQXsX1TXHjno7Q3UXA3vTrdcZWFGoi/exec';
      
      const payload = {
        type: bookingType,
        branch: bookingType === 'offline' ? branches.find(b => b.id === selectedBranch)?.label : 'Online Consultation (Google Meet)',
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        name: bookingName,
        phone: bookingPhone,
        issue: bookingIssue
      };

      if (GOOGLE_SHEETS_WEBHOOK_URL) {
        try {
          await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (error) {
          console.error("Google Sheets Webhook Error:", error);
        }
      } else {
        console.log("Mock submission to Google Sheets:", payload);
      }

      // Simulate API call and success
      setTimeout(() => {
        setIsBooked(true);
      }, 500);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsMenuOpen(false);
  };

  const getDateLocale = () => {
    if (i18n.language === 'en') return enUS;
    if (i18n.language === 'kk') return kk;
    return ru;
  };

  const promos = [
    { key: 'implant', title: t('promos.implant.title'), desc: t('promos.implant.desc'), price: '0 ₸ (2+1)', color: 'bg-blue-600' },
    { key: 'plates', title: t('promos.plates.title'), desc: t('promos.plates.desc'), price: '70 000 ₸', color: 'bg-sky-500' },
    { key: 'treatment', title: t('promos.treatment.title'), desc: t('promos.treatment.desc'), price: 'от 15 000 ₸', color: 'bg-indigo-500' },
    { key: 'veneers', title: t('promos.veneers.title'), desc: t('promos.veneers.desc'), price: 'Premium', color: 'bg-slate-800' },
    { key: 'crowns', title: t('promos.crowns.title'), desc: t('promos.crowns.desc'), price: 'от 50 000 ₸', color: 'bg-blue-700' },
  ];

  const scrollToBooking = () => {
    const el = document.getElementById('booking-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex flex-col items-center select-none pt-2">
              <div className="flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-widest text-white mt-1">ARLAN</span>
                <div className="relative flex items-center justify-center w-12 h-12 mx-1">
                  {/* Planet Ring Background */}
                  <svg className="absolute w-[160%] h-[160%] -rotate-12 pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#38bdf8" strokeWidth="4" opacity="0.7" strokeLinecap="round" pathLength="100" strokeDasharray="50 100" strokeDashoffset="-50" />
                  </svg>
                  
                  {/* Tooth Icon */}
                  <svg className="w-10 h-10 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" viewBox="0 0 24 24" fill="currentColor">
                    <defs>
                      <linearGradient id="toothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#7dd3fc" />
                        <stop offset="50%" stopColor="#0284c7" />
                        <stop offset="100%" stopColor="#1e3a8a" />
                      </linearGradient>
                    </defs>
                    <path d="M12 21c-2.4 0-4.8-.8-6-2.4-.8-1-1.2-2.5-1.2-4.2 0-3.6 1.8-6.4 4.2-9C10.2 4 11.2 2 12 2s1.8 2 3 3.4c2.4 2.6 4.2 5.4 4.2 9 0 1.7-.4 3.2-1.2 4.2-1.2 1.6-3.6 2.4-6 2.4z" fill="url(#toothGrad)" />
                  </svg>

                  {/* Planet Ring Foreground */}
                  <svg className="absolute w-[160%] h-[160%] -rotate-12 pointer-events-none z-20 drop-shadow-[0_0_3px_rgba(56,189,248,0.8)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#7dd3fc" strokeWidth="4" opacity="0.9" strokeLinecap="round" pathLength="100" strokeDasharray="50 100" strokeDashoffset="0" />
                  </svg>
                  
                  {/* Red Dots */}
                  <div className="absolute top-1 right-2 w-[5px] h-[5px] bg-red-600 rounded-full z-20" />
                  <div className="absolute top-3 -right-0 w-1 h-1 bg-red-600 rounded-full z-20" />
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-widest text-white mt-1">MED</span>
              </div>
              <span className="text-[0.65rem] sm:text-xs tracking-[0.6em] text-white mt-1 font-semibold uppercase">Clinic</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <span className="cursor-pointer hover:text-blue-400 transition">{t('nav.home')}</span>
              <span className="cursor-pointer hover:text-blue-400 transition" onClick={() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'})}>{t('nav.services')}</span>
              <span className="cursor-pointer hover:text-blue-400 transition" onClick={() => document.getElementById('benefits')?.scrollIntoView({behavior: 'smooth'})}>{t('nav.branches')}</span>
              <button 
                onClick={scrollToBooking}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition"
              >
                {t('nav.book')}
              </button>
              
              {/* Language Switcher */}
              <div className="flex space-x-2 border-l border-slate-700 pl-4">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={cn(
                      "text-xs font-bold px-2 py-1 rounded transition",
                      i18n.language === lang.code ? "bg-white text-black" : "text-gray-400 hover:text-white"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="px-4 py-4 flex flex-col space-y-4">
              <span className="cursor-pointer hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>{t('nav.home')}</span>
              <span className="cursor-pointer hover:text-blue-400" onClick={() => { document.getElementById('services')?.scrollIntoView({behavior: 'smooth'}); setIsMenuOpen(false); }}>{t('nav.services')}</span>
              <span className="cursor-pointer hover:text-blue-400" onClick={() => { document.getElementById('benefits')?.scrollIntoView({behavior: 'smooth'}); setIsMenuOpen(false); }}>{t('nav.branches')}</span>
              <div className="flex space-x-4 pt-2 border-t border-slate-800">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={cn(
                      "text-sm font-bold px-3 py-1.5 rounded transition",
                      i18n.language === lang.code ? "bg-white text-black" : "text-gray-400 border border-slate-700"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <button 
                onClick={scrollToBooking}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition mt-2"
              >
                {t('nav.book')}
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-black text-white pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/20 blur-3xl transform skew-x-12 translate-x-32" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center space-x-2 bg-red-600 rounded-full px-4 py-2 border border-red-500 animate-pulse">
                    <span className="text-sm font-bold">{t('hero.badge')}</span>
                  </div>
                  <div className="inline-flex items-center space-x-2 bg-slate-800/50 rounded-full px-4 py-2 border border-slate-700">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{t('hero.rating')}</span>
                  </div>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                  {t('hero.title')}
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed">
                  {t('hero.subtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    onClick={scrollToBooking}
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30"
                  >
                    <CalendarIcon className="w-6 h-6" />
                    <span>{t('hero.cta')}</span>
                  </button>
                  <a 
                    href="https://api.whatsapp.com/send/?phone=77770437309"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-600/30"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-800">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">{t('hero.hours')}</h4>
                      <p className="text-sm text-slate-400">Без выходных</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">{t('hero.branchesCount')}</h4>
                      <p className="text-sm text-slate-400">ЖК Комфорт + еще 3</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Image / Badge */}
              <div className="hidden lg:block relative">
                <div className="aspect-square rounded-full border-4 border-slate-800 bg-slate-900 flex items-center justify-center relative overflow-hidden shadow-2xl">
                  {/* Decorative Elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
                  <div className="text-center p-12">
                    <div className="w-32 h-32 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50">
                      <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 21c-2.4 0-4.8-.8-6-2.4-.8-1-1.2-2.5-1.2-4.2 0-3.6 1.8-6.4 4.2-9C10.2 4 11.2 2 12 2s1.8 2 3 3.4c2.4 2.6 4.2 5.4 4.2 9 0 1.7-.4 3.2-1.2 4.2-1.2 1.6-3.6 2.4-6 2.4z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">ARLAN MED</h3>
                    <p className="text-blue-400 text-lg font-medium">Family Dentistry</p>
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 bg-white text-slate-900 p-4 rounded-2xl shadow-xl transform rotate-6 border border-slate-100">
                  <div className="font-bold text-lg">Имплант 2+1</div>
                  <div className="text-sm text-slate-500">До конца месяца</div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-green-500 text-white p-4 rounded-2xl shadow-xl transform -rotate-6">
                  <div className="font-bold text-lg flex items-center"><CheckCircle2 className="w-5 h-5 mr-1" /> Гарантия качества</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-slate-900 mb-12">{t('benefits.title')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { i: <MapPin className="w-8 h-8 text-blue-600" />, title: t('benefits.b1Title'), desc: t('benefits.b1Desc') },
                { i: <Clock className="w-8 h-8 text-blue-600" />, title: t('benefits.b2Title'), desc: t('benefits.b2Desc') },
                { i: <CheckCircle2 className="w-8 h-8 text-blue-600" />, title: t('benefits.b3Title'), desc: t('benefits.b3Desc') },
                { i: <Star className="w-8 h-8 text-blue-600" />, title: t('benefits.b4Title'), desc: t('benefits.b4Desc') }
              ].map((b, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    {b.i}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{b.title}</h3>
                  <p className="text-slate-600 text-sm">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services / Pricing Section */}
        <section id="services" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
                {t('promos.title')}
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
            </div>

            <div id="pricing" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {promos.map((promo, idx) => (
                <div key={idx} className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-xl transition-shadow overflow-hidden flex flex-col items-start h-full">
                  <div className={cn("inline-flex items-center justify-center px-4 py-1.5 rounded-full text-white text-sm font-bold mb-6", promo.color)}>
                    {promo.price}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{promo.title}</h3>
                  <p className="text-slate-600 grow">{promo.desc}</p>
                  <button 
                    onClick={scrollToBooking}
                    className="mt-8 flex items-center text-blue-600 font-semibold group-hover:text-blue-700"
                  >
                    Записаться <ChevronRight className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Info Section */}
        <section id="about" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Awards */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-start">
                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('about.awardsTitle')}</h3>
                <ul className="space-y-4 w-full">
                  <li className="flex flex-col border-b border-slate-100 pb-4">
                    <div className="flex items-center space-x-3 mb-1">
                      <Star className="w-5 h-5 text-amber-400" />
                      <span className="font-semibold text-slate-900">{t('about.award1')}</span>
                    </div>
                  </li>
                  <li className="flex flex-col pb-2">
                    <div className="flex items-center space-x-3 mb-1">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <span className="font-semibold text-slate-900">{t('about.award2')}</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Services */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-start">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('about.servicesTitle')}</h3>
                <ul className="space-y-3 w-full">
                  {(t('about.services', { returnObjects: true }) as string[]).map((service, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payments */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-start">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('about.paymentsTitle')}</h3>
                <ul className="space-y-3 w-full">
                  {(t('about.payments', { returnObjects: true }) as string[]).map((payment, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="font-medium">{payment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 24/7 Booking Section */}
        <section id="booking-section" className="py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('booking.title')}</h2>
              <p className="text-slate-400 text-lg">{t('booking.subtitle')}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-900 border-2 border-slate-100">
              {isBooked ? (
                <div className="text-center py-16">
                  <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">{t('booking.success')}</h3>
                  <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">{t('booking.successDesc')}</p>
                  <button 
                    onClick={() => {
                      setIsBooked(false);
                      setSelectedBranch(null);
                      setSelectedDate(null);
                      setSelectedTime(null);
                      setBookingName('');
                      setBookingPhone('');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition"
                  >
                    Записаться еще раз
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-10">
                  {/* Step 1: Type */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">1</span>
                      {t('booking.type')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => { setBookingType('offline'); setSelectedBranch(null); }}
                        className={cn("py-4 rounded-xl border-2 transition-all font-semibold", bookingType === 'offline' ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-100 text-slate-600 hover:border-blue-200")}
                      >
                        {t('booking.typeOffline')}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setBookingType('online'); setSelectedBranch(null); }}
                        className={cn("py-4 rounded-xl border-2 transition-all font-semibold", bookingType === 'online' ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-100 text-slate-600 hover:border-blue-200")}
                      >
                        {t('booking.typeOnline')}
                      </button>
                    </div>
                  </div>

                  {/* Step 1b: Branch (only for offline) */}
                  {bookingType === 'offline' && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">2</span>
                        {t('booking.step1')}
                      </h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {branches.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBranch(b.id)}
                            className={cn(
                              "py-4 px-3 rounded-xl font-semibold border-2 transition-all flex flex-col items-center justify-center text-center",
                              selectedBranch === b.id
                                ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                                : "border-slate-100 bg-white text-slate-600 hover:border-blue-200"
                            )}
                          >
                            <MapPin className={cn("w-5 h-5 mb-2", selectedBranch === b.id ? "text-blue-600" : "text-slate-400")} />
                            <span className="text-sm">{b.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Date */}
                  <div className={cn("transition-opacity duration-300", (bookingType === 'offline' && !selectedBranch) ? "opacity-40 pointer-events-none" : "")}>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">{bookingType === 'offline' ? '3' : '2'}</span>
                      {t('booking.step2')}
                    </h3>
                    <div className="flex overflow-x-auto pb-4 gap-3 snap-x scrollbar-hide">
                      {availableDates.map((date) => {
                        const isSelected = selectedDate && isSameDay(date, selectedDate);
                        return (
                          <button
                            key={date.toISOString()}
                            type="button"
                            onClick={() => setSelectedDate(date)}
                            className={cn(
                              "snap-start shrink-0 w-20 flex flex-col items-center justify-center py-3 rounded-2xl border-2 transition-all",
                              isSelected 
                                ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                                : "border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-200"
                            )}
                          >
                            <span className="text-xs font-medium uppercase mb-1">{format(date, 'EEE', { locale: getDateLocale() })}</span>
                            <span className="text-2xl font-bold">{format(date, 'dd')}</span>
                            <span className="text-xs">{format(date, 'MMM', { locale: getDateLocale() })}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Time */}
                  <div className={cn("transition-opacity duration-300", !selectedDate && "opacity-40 pointer-events-none")}>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">{bookingType === 'offline' ? '4' : '3'}</span>
                      {t('booking.step3')}
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-3 rounded-xl font-semibold border-2 transition-all",
                            selectedTime === time
                              ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                              : "border-slate-100 bg-slate-50 text-slate-700 hover:border-blue-200"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 4: Details */}
                  <div className={cn("transition-opacity duration-300", !selectedTime && "opacity-40 pointer-events-none")}>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">{bookingType === 'offline' ? '5' : '4'}</span>
                      {t('booking.step4')}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('booking.name')}</label>
                        <input 
                          type="text" 
                          required
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition bg-slate-50 focus:bg-white"
                          placeholder="Иван Иванов"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('booking.phone')}</label>
                        <input 
                          type="tel" 
                          required
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition bg-slate-50 focus:bg-white"
                          placeholder="+7 (777) 000-00-00"
                        />
                      </div>
                    </div>
                    
                    {bookingType === 'online' && (
                      <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                         <label className="block text-sm font-medium text-slate-700 mb-2">{t('booking.issue')}</label>
                         <textarea 
                            required
                            value={bookingIssue}
                            onChange={(e) => setBookingIssue(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition bg-slate-50 focus:bg-white min-h-[100px] resize-y"
                            placeholder="..."
                         />
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="pt-8 border-t border-slate-100">
                    <button 
                      type="submit"
                      disabled={
                        (bookingType === 'offline' && (!selectedBranch || !selectedDate || !selectedTime || !bookingName || !bookingPhone)) ||
                        (bookingType === 'online' && (!selectedDate || !selectedTime || !bookingName || !bookingPhone || !bookingIssue))
                      }
                      className="w-full bg-blue-600 disabled:bg-slate-300 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg disabled:shadow-none shadow-blue-500/30 flex items-center justify-center space-x-2"
                    >
                      <span>{t('booking.submit')}</span>
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных</p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-slate-400 py-12 border-t border-slate-800 pb-28 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-extrabold tracking-widest text-white mt-1">ARLAN</span>
                  <div className="relative flex items-center justify-center w-12 h-12 mx-1 scale-90">
                    <svg className="absolute w-[160%] h-[160%] -rotate-12 pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#38bdf8" strokeWidth="4" opacity="0.7" strokeLinecap="round" pathLength="100" strokeDasharray="50 100" strokeDashoffset="-50" />
                    </svg>
                    <svg className="w-10 h-10 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21c-2.4 0-4.8-.8-6-2.4-.8-1-1.2-2.5-1.2-4.2 0-3.6 1.8-6.4 4.2-9C10.2 4 11.2 2 12 2s1.8 2 3 3.4c2.4 2.6 4.2 5.4 4.2 9 0 1.7-.4 3.2-1.2 4.2-1.2 1.6-3.6 2.4-6 2.4z" fill="url(#toothGrad)" />
                    </svg>
                    <svg className="absolute w-[160%] h-[160%] -rotate-12 pointer-events-none z-20 drop-shadow-[0_0_3px_rgba(56,189,248,0.8)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#7dd3fc" strokeWidth="4" opacity="0.9" strokeLinecap="round" pathLength="100" strokeDasharray="50 100" strokeDashoffset="0" />
                    </svg>
                    <div className="absolute top-1 right-2 w-[5px] h-[5px] bg-red-600 rounded-full z-20" />
                    <div className="absolute top-3 -right-0 w-1 h-1 bg-red-600 rounded-full z-20" />
                  </div>
                  <span className="text-3xl font-extrabold tracking-widest text-white mt-1">MED</span>
                </div>
                <span className="text-xs tracking-[0.6em] text-white mt-1 font-semibold uppercase">Clinic</span>
              </div>
              <p className="text-sm">{t('footer.license')}</p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider">{t('nav.contacts')}</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{t('hero.address')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                  <a href="tel:+77770437309" className="hover:text-white transition">+7 (777) 043-73-09</a>
                </li>
                <li className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>{t('footer.open')} 09:00 - 19:00</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Social Media</h4>
              <div className="flex flex-col space-y-4">
                <a href="https://api.whatsapp.com/send/?phone=77770437309" target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-green-500 hover:text-green-400 transition bg-slate-900 border border-slate-800 px-4 py-3 rounded-lg w-fit">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium text-white">{t('footer.writeUs')}</span>
                </a>
                <a href="https://www.instagram.com/arlan.med" target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-pink-500 hover:text-pink-400 transition bg-slate-900 border border-slate-800 px-4 py-3 rounded-lg w-fit">
                  <Instagram className="w-5 h-5" />
                  <span className="font-medium text-white">Instagram</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; {new Date().getFullYear()} Arlan Med Clinic. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="https://2gis.kz/almaty/branches/70000001065666704/firm/70000001104240753" target="_blank" rel="noreferrer" className="hover:text-white transition">2ГИС Отзывы</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-40 transform translate-y-0 transition-transform duration-300">
        <button 
          onClick={scrollToBooking}
          className="w-full relative overflow-hidden bg-blue-600 active:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-600/30 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform" />
          {t('hero.cta')}
        </button>
      </div>
    </div>
  );
}
