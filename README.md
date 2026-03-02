# SchemeFinder AI 🏛️

A government-grade, AI-assisted platform ensuring zero-hallucination scheme discovery and deterministic eligibility verification for Indian Citizens. Built for the AI for Bharat Hackathon.

![Version](https://img.shields.io/badge/Version-2.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-orange)

## 📌 Problem Statement
Many citizens struggle to find government schemes they are eligible for. Existing AI solutions often "hallucinate" eligibility, giving citizens false hope or incorrect information. SchemeFinder AI solves this by separating **AI Discovery** from **Deterministic Mathematical Verification**.

## ✨ Key Features
- **Zero Hallucination Hybrid Architecture**: Uses Google Gemini to *discover* relevant schemes, but strictly evaluates eligibility mathematically via a custom TypeScript Engine.
- **Navira AI Chatbot**: Real-time conversational assistant for government scheme inquiries.
- **Premium UI**: Government-grade, accessible interface built with Vanilla CSS modules (No Tailwind bloat).
- **Upcoming Scheme Flags**: Distinct visual indicators for schemes that are still in parliamentary discussion.
- **Data Privacy First**: Zero databases attached to the frontend. All inputs are evaluated in-memory and instantly discarded.

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/priyankakedare/SchemeFinder-AI.git
   cd schemefinder-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a file named `.env.local` in the root directory and add your Google Gemini API Key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. **View the Application**
   Open your browser and navigate to `http://localhost:3000`

---

## 🏗️ Architecture & Code Overview (For Judges)

### 1. `src/data/schemes.json` (The Database)
This acts as our massive ingested government database (simulating data.gov.in). It stores rigid criteria for active schemes (like PM-Kisan) and upcoming schemes (like Universal Basic Youth Income). 

### 2. `src/lib/eligibilityEngine.ts` (The Brains - Zero Hallucination)
This is the core innovation. It is a strictly deterministic TypeScript function. It takes the user's profile and compares it against the JSON criteria. 
*Why it matters:* It uses standard `if/else` mathematical checks (`user.income <= rule.maxIncome`). **AI is never allowed to dictate if someone is eligible.**

### 3. `src/app/api/schemes/route.ts` (The Hybrid Discovery Pipeline)
When a user clicks "Search", this API route triggers:
1. It sends the profile to **Google Gemini** asking it to discover potentially relevant schemes.
2. It takes those AI-suggested schemes and merges them with our local `schemes.json`.
3. It takes the combined list and safely passes it through the `eligibilityEngine.ts`.
4. The frontend *only* renders schemes that mathematically survived step 3.

### 4. `src/components/Chatbot.tsx` & `api/chat/route.ts` (The Assistant)
A custom-built React component that maintains conversation history and streams responses from Gemini 2.5 Flash, strictly instructed via system prompts to act as a government guide.

---

## 🔒 Privacy & Security
- **In-Memory Processing**: The Next.js API routes process the JSON payload instantly without saving state to an external SQL/NoSQL database.

## 👨‍💻 Developed By
**Satyam Patil** - Project Lead, Navira AI
