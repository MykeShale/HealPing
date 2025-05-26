# 🏥 HealPing – Smart Follow-Up Reminder System for Clinics and Private Doctors

A lightweight, AI-assisted web app designed to help clinics and private doctors automate patient follow-up reminders using SMS, email, or WhatsApp. Built for the #1MillionDevs Vibe Coding Hackathon to solve real-world health communication gaps using low-code and AI tools.

---

## 🧠 Problem Statement
Clinics and private doctors often lose track of patient follow-ups due to poor manual systems or communication lapses. Patients, in turn, forget appointments, affecting treatment continuity.

**Challenge**: Build a system that automates appointment follow-up reminders to doctors and patients via SMS, WhatsApp, or email.

---

## 💡 Solution Overview
**HealPing** provides a simple and intuitive interface to:
- Add patient and doctor details
- Schedule appointments
- Auto-generate and send personalized follow-up reminders
- Maintain a follow-up history log

This app leverages AI to generate custom messages and uses low-code platforms to ensure rapid prototyping and scalability.

---

## 🎥 Demo
> [Link to Demo Video or Live Site]  
> *(Replace with video link or Vercel/Netlify deployment URL)*

---

## ✨ Features
- Add & manage patients and doctors
- Schedule and view appointments
- Auto-generate reminder messages using AI (Claude)
- Manual or scheduled sending of reminders
- WhatsApp/SMS/email integration (via API or mock)
- Simple, clean UI with mobile responsiveness

---

## 🧠 AI Prompt Engineering
Used **Claude.ai** to generate polite and personalized reminders.

### Sample Prompt:
> _"Write a professional and friendly follow-up reminder for a patient named Jane who has an appointment with Dr. Ayoti on May 27 at 10:30 AM. Keep it brief and include date/time clearly."_

### Sample Output:
> _"Hello Jane, this is a friendly reminder for your follow-up appointment with Dr. Ayoti on Monday, May 27th at 10:30 AM. Please arrive 10 minutes early. See you soon!"_

---

## 🗃️ Database Schema (Supabase)
### Tables:
- `doctors` – name, email, phone
- `patients` – name, email, phone
- `appointments` – patient_id, doctor_id, appointment_date, notes
- `reminders` – appointment_id, message, status (sent/pending), channel

---

## 📸 Screenshots
 <!-- > *(Add 2–3 screenshots of the app interface here)*   -->
> - Dashboard  
> - Add Appointment Form  
> - Reminder Preview Screen

---

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/MykeShale/HealPing.git
cd HealPing
```

## 🔭 Future Improvements
> - **Auto-trigger** daily reminders

> - **Integrate** calendar sync (Google/Outlook)

> - **Support** multi-language reminders

> - **Analytics** dashboard for clinics

> - **Voice** call reminders via Twilio

## 2. Set Up Supabase
> - Create a Supabase project

> - Import the schema from /schema.sql

> - Add your Supabase URL and API keys to .env

## 3. Run the App
```
npm install
npm run dev
```

## 4. Optional: Configure Twilio for SMS
> - Create a Twilio account

> - Set credentials in .env

> - Use API to send reminders

## 🔭 Future Improvements
> - Auto-trigger daily reminders

> - Integrate calendar sync (Google/Outlook)

> - Support multi-language reminders

> - Analytics dashboard for clinics

> - Voice call reminders via Twilio


