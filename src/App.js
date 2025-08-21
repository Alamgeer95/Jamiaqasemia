import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { query, where } from "firebase/firestore";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { db, storage } from './firebase';
import moment from "moment-hijri"; // ✅ নতুন যোগ
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';



// Lucide React Icons for navigation and other sections
import { Home, Info, Book, Building2, Wallet, BellRing, Image, MessageSquareText, Phone, MapPin, Mail, CalendarDays, GraduationCap, Users, History, ScrollText, DollarSign, Handshake, Shield, Heart, Briefcase, FlaskConical, Gavel, Video, BookOpenText, Moon, Landmark, PiggyBank, Swords, Syringe, TrendingUp, Menu, X, Sparkles, Send, RotateCcw, UserCheck, BriefcaseBusiness, PiggyBank as PiggyBankIcon, ScrollText as ScrollTextIcon, PhoneCall, BookA, BookCheck, ShieldCheck, Droplet, DropletIcon, Hand, DropletsIcon } from 'lucide-react'; // Added PhoneCall icon

// Global variables provided by the Canvas environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? initialAuthToken : null;


// Madrasa information
    const madrasaInfo = {
        name: 'জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া',
        slogan: 'ইলম, আমল ও আখলাকের সমন্বয়ে দ্বীনের অতন্দ্র প্রহরী গড়ার দৃঢ় প্রত্যয়',
        address: 'দাতিয়ারা (ওয়াপদা নতুন গেইট সংলগ্ন), ব্রাহ্মণবাড়িয়া সদর, ব্রাহ্মণবাড়িয়া।',
        logo: '/Jamia-qasimia-logo.jpg',
        mobile: '01600560675',
        email: 'Jamia.qasemia2021@gmail.com',
        arabicName: 'الجامعة القاسمية ببرهمن باريا' // Arabic name added
    };



// Home Page Component
const HomePage = ({ madrasaInfo }) => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{madrasaInfo.name} - {madrasaInfo.slogan}</title>
                <meta name="description" content={`জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া একটি ঐতিহ্যবাহী ইসলামী শিক্ষাপ্রতিষ্ঠান। ${madrasaInfo.slogan}`} />
            </Helmet>

        <div className="p-6 md:p-10 bg-white rounded-2xl shadow-xl animate-fade-in">
            <div className="text-center mb-10">
                {/* Madrasa Arabic Name in Cairo font - two lines, font size adjustment and bold */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4 animate-fade-in-down font-['Cairo']" dir="rtl">
                 "{madrasaInfo.arabicName}"
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 italic animate-fade-in-up">
                    "{madrasaInfo.slogan}"
                </p>
            </div>

            <div className="mb-12 animate-fade-in">
                {/* Introductory image - updated to use the uploaded image, text overlay removed */}
                <div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
                    <img
                        src= {madrasaInfo.logo} // Updated image source
                        alt="জামিয়ার লোগো" // Updated alt text
                        className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105" // object-contain to fit the image without cropping, added padding
                        onError={(e) => { e.target.onerror = null; e.target.src = "Jamia-qasimia-logo.jpg"; }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-8 rounded-xl shadow-md border border-indigo-200 animate-slide-in-left">
                    <h2 className="text-3xl font-bold text-indigo-800 mb-5 flex items-center">
                        <Book className="mr-3 text-indigo-600" size={32} /> লক্ষ্য ও উদ্দেশ্য
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg text-justify">
                        <li>কুরআন ও সুন্নাহর সঠিক জ্ঞান বিতরণ করা।</li>
                        <li>ইসলামী মূল্যবোধ ও নৈতিকতা প্রতিষ্ঠা করা।</li>
                        <li>যোগ্য আলেম, দায়ী ও দ্বীনি নেতৃত্ব তৈরি করা।</li>
                        <li>সমাজ ও রাষ্ট্রের কল্যাণে অবদান রাখা।</li>
                        <li>আধুনিক শিক্ষার সাথে ইসলামী শিক্ষার সমন্বয় সাধন।</li>
                    </ul>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-8 rounded-xl shadow-md border border-amber-200 animate-slide-in-right">
                    <h2 className="text-3xl font-bold text-amber-800 mb-5 flex items-center">
                        <BellRing className="mr-3 text-amber-600" size={32} /> জরুরি নোটিশ
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg text-justify">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-justify">অর্ধবার্ষিক পরীক্ষার ঘোষণা</h3>
                        <li>
                           এতদ্বারা অত্র জামিয়ার সকল জামাআতের ছাত্রদের অবগতির জন্য জানানো যাচ্ছে যে, আগামী ১০-০৩-১৪৪৭ হি. মোতাবেক ০৩-০৯-২০২৫ ইং. রোজ বুধবার হতে ১৮-০৩-১৪৪৭ হি. মোতাবেক ১১-০৯-২০২৫ ইং রোজ বৃহস্পতিবার পর্যন্ত জামিয়ার অর্ধবার্ষিক পরীক্ষা চলবে।<br/>
                           পরীক্ষার নির্ধারিত ফি কিতাব বিভাগ ৩৫০ টাকা, হিফজ বিভাগ ১০০ টাকা।<br/>
                           ২৮ আগস্ট-এর পূর্বে মাদরাসার সমুদয় বকেয়াসহ পরীক্ষার ফি মুফতি সাইফুল ইসলাম সাহেব দা.বা.-এর কাছে জমা দিবে।<br/>
                           ২৮ আগস্ট থেকে নির্ধারিত ফি'র সাথে ১০০ টাকা বিলম্ব মাশুল যুক্ত হবে।</li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 p-8 bg-gray-100 rounded-xl shadow-inner">
                <h2 className="text-3xl font-bold text-gray-800 mb-5">আমাদের কার্যক্রম</h2>
                <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                    জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া শুধু একটি শিক্ষাপ্রতিষ্ঠান নয়, এটি একটি পূর্ণাঙ্গ দ্বীনি কেন্দ্র। আমরা শিক্ষার্থীদের একাডেমিক শিক্ষার পাশাপাশি তাদের আত্মিক ও নৈতিক বিকাশেও সমান গুরুত্ব দেই। আমাদের প্রতিষ্ঠানে নিয়মিত বিভিন্ন ইসলামী প্রোগ্রাম, সেমিনারের আয়োজন করা হয়। এর মাধ্যমে শিক্ষার্থীরা ইসলামী জ্ঞান অর্জনের পাশাপাশি বাস্তব জীবনে সেই জ্ঞানের প্রয়োগ শিখতে পারে। আমরা বিশ্বাস করি, ইলম (জ্ঞান), আমল (কর্ম) এবং আখলাক (চরিত্র)-এর সমন্বয়েই একজন প্রকৃত মুসলিম তৈরি হয়।
                </p>
                <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                    আমাদের হিফজ বিভাগ থেকে প্রতি বছর অসংখ্য শিক্ষার্থী পবিত্র কুরআনুল কারীম মুখস্থ করে হাফেজ হয়। কিতাব বিভাগে তাফসীর, হাদীস, ফিকহ, আরবি সাহিত্য, নাহু, সরফ, বালাগাত, মানতিক সহ ইসলামের মৌলিক ও উচ্চতর জ্ঞান প্রদান করা হয়। এছাড়াও, উচ্চতর তাফসীর, উলূমুল হাদীস, ও ইফতা বিভাগ থেকে শিক্ষার্থীরা গভীর ইসলামী গবেষণায় নিয়োজিত হয় এবং সমাজের বিভিন্ন ফিকহী সমস্যার সমাধান প্রদান করে।
                </p>
                <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                    মাদরাসার শিক্ষক মণ্ডলী অত্যন্ত অভিজ্ঞ এবং নিবেদিতপ্রাণ। তারা শিক্ষার্থীদের শুধুমাত্র পাঠ্যপুস্তকের জ্ঞানই দেন না, বরং তাদের মাঝে দ্বীনি চেতনা ও ইসলামী মূল্যবোধ জাগ্রত করতেও কাজ করেন। আমরা শিক্ষার্থীদের জন্য একটি নিরাপদ ও স্বাস্থ্যকর পরিবেশ নিশ্চিত করার চেষ্টা করি, যেখানে তারা নির্বিঘ্নে তাদের পড়াশোনা চালিয়ে যেতে পারে। আমাদের হোস্টেল সুবিধা শিক্ষার্থীদের জন্য একটি সুশৃঙ্খল ও শান্তিপূর্ণ আবাসনের ব্যবস্থা করে।
                </p>
                <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                    সামাজিক দায়বদ্ধতা থেকে আমরা বিভিন্ন জনকল্যাণমূলক কাজেও অংশগ্রহণ করার চেষ্টা করি। প্রাকৃতিক দুর্যোগে ক্ষতিগ্রস্তদের পাশে দাঁড়ানো, দরিদ্র ও অসহায়দের সহায়তা করা, এবং সমাজের নৈতিক উন্নয়নে ভূমিকা রাখা আমাদের কার্যক্রমের অংশ। আমরা সকল মুসলিম ভাই-বোনদের প্রতি আহ্বান জানাই, আমাদের এই মহৎ কাজে অংশ নিতে এবং দ্বীনি শিক্ষার প্রসারে আপনাদের মূল্যবান অবদান রাখতে। আল্লাহ তাআলা আপনাদের সকল নেক কাজ কবুল করুন এবং এর উত্তম প্রতিদান দিন।
                </p>
                <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                    আমাদের মাদরাসার লক্ষ্য হলো এমন একদল আলেম তৈরি করা যারা শুধুমাত্র জ্ঞান অর্জনকারী হবে না, বরং সমাজের নেতৃত্ব দিতে পারবে এবং ইসলামের সঠিক বার্তা মানুষের কাছে পৌঁছে দিতে পারবে। আমরা ইসলামী শিক্ষার সাথে প্রয়োজনীয় আধুনিক শিক্ষার সমন্বয় সাধনে বিশ্বাসী, যাতে আমাদের শিক্ষার্থীরা সমসাময়িক চ্যালেঞ্জ মোকাবেলা করতে সক্ষম হয়।
                </p>
                <p className="text-gray-700 leading-relaxed text-lg text-justify">
                    আমরা নিয়মিতভাবে বিভিন্ন সেমিনার, আলোচনা সভা এবং কর্মশালার আয়োজন করি যেখানে দেশের প্রখ্যাত আলেম-উলামা ও চিন্তাবিদগণ অংশগ্রহণ করেন। এর মাধ্যমে শিক্ষার্থীরা তাদের জ্ঞানকে আরও সমৃদ্ধ করার সুযোগ পায় এবং বিভিন্ন বিষয়ে গভীর ধারণা লাভ করে।
                </p>
            </div>
            
            <div className="mt-12 p-8 bg-gray-50 rounded-xl shadow-inner">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">আমাদের মূল্যবোধ</h3>
                <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                    জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া ইসলামী মূল্যবোধ, নৈতিকতা এবং সততার উপর বিশেষ গুরুত্ব দেয়। আমরা শিক্ষার্থীদের মাঝে তাকওয়া, বিনয়, এবং অপরের প্রতি শ্রদ্ধাবোধ জাগ্রত করার চেষ্টা করি। আমাদের শিক্ষাব্যবস্থা এমনভাবে ডিজাইন করা হয়েছে যাতে শিক্ষার্থীরা শুধু জ্ঞান অর্জনই নয়, বরং একজন আদর্শ মুসলিম হিসেবে গড়ে উঠতে পারে।
                </p>
                <p className="text-gray-700 leading-relaxed text-lg text-justify">
                    আমরা বিশ্বাস করি, একটি শক্তিশালী নৈতিক ভিত্তি ছাড়া জ্ঞান অসম্পূর্ণ। তাই আমাদের মাদরাসা শিক্ষার্থীদের চারিত্রিক উন্নয়নে বিশেষ নজর রাখে। নিয়মিত নৈতিকতার ক্লাস, ইসলামী আলোচনা, এবং আদর্শ জীবনযাপনের উদাহরণ প্রদর্শনের মাধ্যমে শিক্ষার্থীদেরকে সঠিক পথে পরিচালিত করা হয়।
                </p>
            </div>
            {/* Additional content to ensure scrolling */}
            <div className="mt-12 p-8 bg-gray-50 rounded-xl shadow-inner">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">আমাদের ভবিষ্যৎ পরিকল্পনা</h3>
                <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                    জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া ভবিষ্যতে আরও নতুন নতুন বিভাগ চালু করার পরিকল্পনা করছে, যেমন - দাওয়াহ ও ইরশাদ বিভাগ, ইসলামী অর্থনীতি বিভাগ, এবং আধুনিক বিজ্ঞান গবেষণা কেন্দ্র। আমাদের লক্ষ্য হলো একটি আন্তর্জাতিক মানের ইসলামী বিশ্ববিদ্যালয় হিসেবে নিজেদের প্রতিষ্ঠিত করা, যা বিশ্বজুড়ে ইসলামী জ্ঞান ও গবেষণার কেন্দ্রবিন্দুতে পরিণত হবে।
                </p>
                <p className="text-gray-700 leading-relaxed text-lg text-justify">
                    আমরা শিক্ষার্থীদের জন্য উন্নততর সুযোগ-সুবিধা নিশ্চিত করতে চাই, যার মধ্যে রয়েছে একটি আধুনিক গ্রন্থাগার, কম্পিউটার ল্যাব, এবং মাল্টিমিডিয়া ক্লাসরুম। এছাড়াও, শিক্ষার্থীদের স্বাস্থ্য ও বিনোদনের জন্য খেলার মাঠ এবং স্বাস্থ্যসেবার ব্যবস্থা করা হবে। আমরা বিশ্বাস করি, একটি সুস্থ ও সুন্দর পরিবেশে শিক্ষার্থীরা তাদের মেধার পূর্ণ বিকাশ ঘটাতে পারবে।
                    </p>
                </div>
            </div>
    </HelmetProvider>
    );
};


// About Us Page Component
const AboutUsPage = () => {
    const teachers = [
        { name: 'আল্লামা মুফতী আবদুর রহীম কাসেমী', designation: 'মুহতামিম ও শায়খুল হাদীস', specialty: 'ফিকহ ও হাদিস', mobile: '01715530033' },
        { name: 'মাওলানা মুফতী মুখলেসুর রহমান', designation: 'নাজেমে তালিমাত', specialty: 'ফিকহ ও হাদিস', mobile: '01726677134' },
        { name: 'মাওলানা আলমগীর হুসাইন', designation: 'শিক্ষক', specialty: 'হাদীস, ফারায়েজ, মানতেক ও নাহু', mobile: '01735260227' },
        { name: 'মাওলানা মুফতী সাইফুল ইসলাম', designation: 'সিনিয়র শিক্ষক', specialty: 'ফিকহ, হাদীস, আদব, ও নাহু-সরফ', mobile: '01609355128' },
        { name: 'মাওলানা মুফতী হুজায়ফা', designation: 'সহকারী নাজেমে তালিমাত', specialty: 'ফিকহ, হাদীস ও আদব', mobile: '01601220265' },
        { name: 'মাওলানা মুফতী ছানাউল্লাহ মারুফ', designation: 'শিক্ষক', specialty: 'তাফসির, হাদীস, ফিকহ ও ইংরেজি', mobile: '01317664235' },
        { name: 'হাফেজ মাওলানা হাবিবুল্লাহ', designation: 'শিক্ষক', specialty: 'কিরাআত', mobile: '01917881727' },
        { name: 'হাফেজ মাওলানা মাহমুদুল হাসান', designation: 'শিক্ষক', specialty: 'হিফজ', mobile: '01615876118' },
    ];

    const boardMembers = [
        { name: 'আল্লামা মুফতী আবদুর রহীম কাসেমী', designation: 'সভাপতি', description: 'একজন প্রখ্যাত আলেম এবং জন দরদী সমাজসেবক, যার সুদক্ষ নেতৃত্বে মাদরাসা দ্রুত এগিয়ে যাচ্ছে।', icon: UserCheck, mobile: '01715530033' },
        { name: 'মাওলানা মুফতী মুখলেসুর রহমান', designation: 'সাধারণ সম্পাদক', description: 'মাদরাসার প্রশাসনিক কাজ এবং ফাতওয়া বিভাগের প্রধান।', icon: BriefcaseBusiness, mobile: '01726677134' },
        { name: 'মাওলানা মুফতী হুজায়ফা', designation: 'কোষাধ্যক্ষ', description: 'মাদরাসার আর্থিক ও সার্বিক ব্যবস্থাপনার দায়িত্বে নিয়োজিত।', icon: Wallet, mobile: '01601220265' },
    ];


            return (
       <HelmetProvider>
            <Helmet>
                <title>আমাদের সম্পর্কে - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া</title>
                <meta name="description" content="জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়ার ইতিহাস, পরিচালনা পর্ষদ এবং শিক্ষক ও কর্মচারীদের সম্পর্কে জানুন।" />
            </Helmet>

        <div className="p-6 md:p-10 bg-white rounded-2xl shadow-xl animate-fade-in">
            <h1 className="text-4xl font-extrabold text-indigo-900 mb-10 text-center">আমাদের সম্পর্কে</h1>

            <div className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl shadow-md border border-blue-200 animate-fade-in">
                <h2 className="text-3xl font-bold text-blue-800 mb-5 flex items-center">
                    <History className="mr-3 text-blue-600" size={32} /> প্রতিষ্ঠার ইতিহাস
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                    জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া একটি ঐতিহ্যবাহী ইসলামী শিক্ষাপ্রতিষ্ঠান। এটি ২৫-০৫-১৪৪২ হিজরী মোতাবেক ১০-০১-২০২১ ইসায়ী প্রতিষ্ঠিত হয়। প্রতিষ্ঠার পর থেকেই এই মাদরাসা ইসলামী শিক্ষা বিস্তারে গুরুত্বপূর্ণ ভূমিকা পালন করে আসছে। এলাকার ধর্মপ্রাণ মুসলিমদের সহযোগিতায় এবং একদল নিবেদিতপ্রাণ আলেমের ঐকান্তিক প্রচেষ্টায় এটি গড়ে উঠেছে। মাদরাসার মূল লক্ষ্য হলো কুরআন ও সুন্নাহর সঠিক জ্ঞান বিতরণের মাধ্যমে এমন একদল আলেম তৈরি করা, যারা ইসলামী জ্ঞান ও নৈতিকতার আলোয় সমাজকে আলোকিত করতে পারবে।
                </p>
                <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                    আমাদের মাদরাসা প্রতিষ্ঠার পেছনে ছিল একটি মহৎ উদ্দেশ্য: এমন একটি প্রজন্ম তৈরি করা যারা দ্বীনি জ্ঞানে সুপণ্ডিত হবে এবং একই সাথে আধুনিক বিশ্বের চ্যালেঞ্জ মোকাবেলায় সক্ষম হবে। আমরা বিশ্বাস করি, ইসলামী শিক্ষার সাথে আধুনিক বিজ্ঞানের সমন্বয় সাধন করে আমরা একটি ভারসাম্যপূর্ণ সমাজ গড়ে তুলতে পারি।
                </p>
                <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                    প্রতিষ্ঠার পর থেকে, জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া অসংখ্য শিক্ষার্থীকে সফলভাবে দ্বীনি শিক্ষায় শিক্ষিত করেছে। আমাদের প্রাক্তন শিক্ষার্থীরা দেশের বিভিন্ন প্রান্তে ইসলামী শিক্ষা ও দাওয়াতের কাজে নিয়োজিত আছেন, যা আমাদের জন্য অত্যন্ত গর্বের বিষয়।
                </p>
                <p className="text-gray-700 leading-relaxed text-lg text-justify">
                    আমরা প্রতিনিয়ত আমাদের পাঠ্যক্রম এবং শিক্ষাদান পদ্ধতি উন্নত করার চেষ্টা করছি, যাতে শিক্ষার্থীরা বিশ্বমানের ইসলামী শিক্ষা লাভ করতে পারে। আমাদের লক্ষ্য হলো একটি আদর্শ ইসলামী শিক্ষাপ্রতিষ্ঠান হিসেবে নিজেদের প্রতিষ্ঠিত করা, যা শুধু ব্রাহ্মণবাড়িয়া নয়, সারা দেশের জন্য একটি মডেল হিসেবে কাজ করবে।
                </p>
            </div>

            <div className="mb-12 bg-gradient-to-br from-green-50 to-teal-100 p-8 rounded-xl shadow-md border border-green-200 animate-fade-in">
                <h2 className="text-3xl font-bold text-green-800 mb-5 flex items-center">
                    <Users className="mr-3 text-green-600" size={32} /> বর্তমান পরিচালনা পর্ষদ
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {boardMembers.map((member, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden border-4 border-green-300">
                                {/* Using Lucide icon for board members */}
                                <member.icon className="w-12 h-12 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                            <p className="text-gray-600 text-base">{member.designation}</p>
                            <p className="text-gray-500 text-sm italic mt-2 text-justify">{member.description}</p>
                            {member.mobile && (
                                <a href={`tel:${member.mobile}`} className="text-blue-600 hover:underline text-sm mt-2 flex items-center">
                                    <PhoneCall className="mr-1" size={16} /> {member.mobile}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mt-8 text-justify">
                    আমাদের পরিচালনা পর্ষদ মাদরাসার সার্বিক উন্নয়নে নিরলসভাবে কাজ করে যাচ্ছেন। তাদের দূরদর্শী নেতৃত্ব এবং অক্লান্ত পরিশ্রমের ফলেই মাদরাসা আজ এই অবস্থানে উপনীত হয়েছে।
                </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-xl shadow-md border border-purple-200 animate-fade-in">
                <h2 className="text-3xl font-bold text-purple-800 mb-5 flex items-center">
                    <GraduationCap className="mr-3 text-purple-600" size={32} /> শিক্ষক ও কর্মচারীদের তালিকা
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {teachers.map((person, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden border-4 border-purple-300">
                                {/* Custom SVG for a bearded man with a cap */}
                                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C9.79086 2 8 3.79086 8 6V7C8 7.55228 8.44772 8 9 8H15C15.5523 8 16 7.55228 16 7V6C16 3.79086 14.2091 2 12 2ZM12 9C7.58172 9 4 12.5817 4 17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17C20 12.5817 16.4183 9 12 9ZM12 10C15.3137 10 18 12.6863 18 16H6C6 12.6863 8.68629 10 12 10ZM12 17.5C10.6193 17.5 9.5 18.6193 9.5 20C9.5 21.3807 10.6193 22.5 12 22.5C13.3807 22.5 14.5 21.3807 14.5 20C14.5 18.6193 13.3807 17.5 12 17.5Z" fill="#4c51bf"/>
                                    <path d="M12 6.5C12.8284 6.5 13.5 5.82843 13.5 5C13.5 4.17157 12.8284 3.5 12 3.5C11.1716 3.5 10.5 4.17157 10.5 5C10.5 5.82843 11.1716 6.5 12 6.5Z" fill="#4c51bf"/>
                                    <path d="M12 16.5C13.3807 16.5 14.5 15.3807 14.5 14C14.5 12.6193 13.3807 11.5 12 11.5C10.6193 11.5 9.5 12.6193 9.5 14C9.5 15.3807 10.6193 16.5 12 16.5Z" fill="#8b5cf6"/>
                                    {/* Cap top and brim - adjusted for better visibility */}
                                    <circle cx="12" cy="4.5" r="1.5" fill="#6366f1"/> {/* Cap top */}
                                    <rect x="9.5" y="5.5" width="5" height="1" rx="0.5" fill="#6366f1"/> {/* Cap brim */}
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">{person.name}</h3>
                            <p className="text-gray-600 text-base">{person.designation}</p>
                            <p className="text-gray-500 text-sm italic">{person.specialty}</p>
                            {person.mobile && (
                                <a href={`tel:${person.mobile}`} className="text-blue-600 hover:underline text-sm mt-2 flex items-center">
                                    <PhoneCall className="mr-1" size={16} /> {person.mobile}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mt-8 text-justify">
                    আমাদের শিক্ষক ও কর্মচারীগণ জামিয়ার শিক্ষাদান ও প্রশাসনিক কাজে অত্যন্ত নিষ্ঠার সাথে দায়িত্ব পালন করছেন। তাদের সম্মিলিত প্রচেষ্টায় মাদরাসা তার লক্ষ্য অর্জনে সক্ষম হচ্ছে।
                    </p>
                </div>
            </div>
        </HelmetProvider>
    );
};


// Academic Info Page Component
const AcademicInfoPage = () => (
       <HelmetProvider>
        <Helmet>
            <title>শিক্ষাগত তথ্য - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া</title>
            <meta name="description" content="জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়ার পাঠ্যক্রম, ভর্তি প্রক্রিয়া, পরীক্ষার সময়সূচী এবং ফলাফল সম্পর্কে জানুন।" />
        </Helmet>

    <div className="p-6 md:p-10 bg-white rounded-2xl shadow-xl animate-fade-in">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-10 text-center">শিক্ষাগত তথ্য</h1>

        <div className="mb-12 bg-gradient-to-br from-amber-50 to-yellow-100 p-8 rounded-xl shadow-md border border-amber-200 animate-fade-in">
            <h2 className="text-3xl font-bold text-amber-800 mb-5 flex items-center">
                <ScrollText className="mr-3 text-amber-600" size={32} /> পাঠ্যক্রম
            </h2>
            <div className="space-y-8 text-lg">
                <div>
                    <h3 className="text-2xl font-semibold text-amber-900 mb-2">হিফজ বিভাগ:</h3>
                    <p className="text-gray-700 text-justify">পবিত্র কুরআনুল কারীম শুদ্ধভাবে মুখস্থকরণ এবং তাজবীদ ও কিরাআতের উপর বিশেষ প্রশিক্ষণ প্রদান করা হয়। এই বিভাগে শিক্ষার্থীদের কুরআনের প্রতিটি আয়াত নির্ভুলভাবে মুখস্থ করার জন্য নিবিড় তত্ত্বাবধান করা হয়।</p>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold text-amber-900 mb-2">কিতাব বিভাগ:</h3>
                    <p className="text-gray-700 text-justify">তাইসীর ও হুফ্ফাজ জামাআত থেকে দাওরায়ে হাদীস পর্যন্ত নাহু, সরফ, বালাগাত, মানতিক, ফিকহ, হাদীস, তাফসীর ও আরবি ব্যাকরণের সমন্বয়ে অধ্যয়ন করানো হয়। শিক্ষার্থীদের গভীর জ্ঞান অর্জনে সহায়তা করা হয়। এই বিভাগে ইসলামী শরীয়তের মৌলিক গ্রন্থাবলী পড়ানো হয়।</p>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold text-amber-900 mb-2">উচ্চতর তাফসীর বিভাগ:</h3>
                    <p className="text-gray-700 text-justify">কুরআনের গভীর তাফসীর ও বিশ্লেষণ, শানে নুযুল, আয়াতসমূহের পারস্পরিক সম্পর্ক এবং সমসাময়িক প্রেক্ষাপটে এর প্রয়োগ নিয়ে বিশদ আলোচনা করা হয়। এই বিভাগে শিক্ষার্থীরা কুরআনের অর্থ ও ব্যাখ্যায় পারদর্শী হয়ে ওঠে।</p>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold text-amber-900 mb-2">উলূমুল হাদীস বিভাগ:</h3>
                    <p className="text-gray-700 text-justify">হাদিস শাস্ত্রের মূলনীতি, রাবীর জীবনী পর্যালোচনা, হাদীসের হুকুম প্রদান, এবং সহীহ, যয়ীফ ও মাওযু হাদীসের পার্থক্যকরণ নিয়ে বিশদ আলোচনা ও গবেষণা করা হয়। এই বিভাগে হাদীসের বিশুদ্ধতা যাচাইয়ের পদ্ধতি শেখানো হয়।</p>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold text-amber-900 mb-2">ইফতা বিভাগ:</h3>
                    <p className="text-gray-700 text-justify">ফিকহ ও ফাতওয়া বিষয়ে বিশেষজ্ঞ তৈরি করার লক্ষ্যে বিভিন্ন মাসআলার গভীর বিশ্লেষণ, ফাতওয়া লেখার পদ্ধতি এবং সমসাময়িক ফিকহী সমস্যা সমাধানের প্রশিক্ষণ দেওয়া হয়। এই বিভাগের শিক্ষার্থীরা সমাজের দ্বীনি সমস্যার সমাধান দিতে সক্ষম হয়।</p>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold text-amber-900 mb-2">আদব বিভাগ:</h3>
                    <p className="text-gray-700 text-justify">আরবি সাহিত্য ও ভাষার উপর বিশেষ প্রশিক্ষণ, আরবি কবিতা, প্রবন্ধ ও বক্তৃতা লেখার দক্ষতা অর্জনে সহায়তা করা হয়। এই বিভাগে আরবি ভাষার সৌন্দর্য ও গভীরতা শেখানো হয়।</p>
                </div>
               {/* <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-amber-900 mb-2">কম্পিউটার ও তথ্যপ্রযুক্তি:</h3>
                    <p className="text-gray-700 text-justify">আধুনিক বিশ্বের সাথে তাল মিলিয়ে চলার জন্য শিক্ষার্থীদের কম্পিউটার ও তথ্যপ্রযুক্তির মৌলিক জ্ঞান প্রদান করা হয়। এতে তারা ডিজিটাল যুগে নিজেদের মানিয়ে নিতে পারে।</p>
                </div> 
                <div>
                    <h3 className="text-2xl font-semibold text-amber-900 mb-2">ইংরেজি ভাষা শিক্ষা:</h3>
                    <p className="text-gray-700 text-justify">আন্তর্জাতিক যোগাযোগের জন্য ইংরেজি ভাষার গুরুত্ব অপরিসীম। তাই শিক্ষার্থীদের ইংরেজি ভাষা শেখার সুযোগ করে দেওয়া হয়।</p>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold text-amber-900 mb-2">সাধারণ জ্ঞান ও বিজ্ঞান:</h3>
                    <p className="text-gray-700 text-justify">শিক্ষার্থীদের সাধারণ জ্ঞান ও বিজ্ঞান বিষয়েও ধারণা দেওয়া হয়, যাতে তারা সমাজের অন্যান্য ক্ষেত্র সম্পর্কেও সচেতন থাকে।</p>
                </div> */}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-red-50 to-orange-100 p-8 rounded-xl shadow-md border border-red-200 animate-slide-in-left">
                <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                    <CalendarDays className="mr-3 text-red-600" size={28} /> ভর্তি প্রক্রিয়া
                </h2>
                <p className="text-gray-700 text-lg mb-2 text-justify">
                    প্রতি বছর শাওয়াল মাসের প্রথম সপ্তাহে ভর্তি ফরম বিতরণ করা হয়। জামিয়ার অফিস থেকে ভর্তি ফরম সংগ্রহ করে নতুন ছাত্রদের ভর্তি পরীক্ষায় এবং পুরাতন ছাত্রদের বিগত বছরের বার্ষিক পরীক্ষায় উত্তীর্ণ হওয়া সাপেক্ষে ভর্তি করা হয়।
                </p>
                <p className="text-gray-700 text-lg text-justify">
                    বিস্তারিত তথ্যের জন্য জামিয়ার অফিসে যোগাযোগ করুন। ভর্তি সংক্রান্ত সকল তথ্য নোটিশ বোর্ডেও পাওয়া যাবে।
                </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-lime-100 p-8 rounded-xl shadow-md border border-green-200 animate-fade-in-up">
                <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                    <Book className="mr-3 text-green-600" size={28} /> সময়সূচি (রুটিন)
                </h2>
                <p className="text-gray-700 text-lg mb-2 text-justify">
                    প্রতিটি বিভাগের জন্য সুনির্দিষ্ট সময়সূচি রয়েছে। ক্লাস সকাল ৯টা থেকে শুরু হয়ে আসরের নামাজ পর্যন্ত চলে।
                </p>
                <p className="text-gray-700 text-lg text-justify">
                    বিস্তারিত রুটিন জামিয়ার নোটিশ বোর্ডে প্রকাশ করা হয়। শিক্ষার্থীদের রুটিন মেনে চলতে উৎসাহিত করা হয়।
                </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-8 rounded-xl shadow-md border border-blue-200 animate-slide-in-right">
                <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                    <GraduationCap className="mr-3 text-blue-600" size={28} /> পরীক্ষা ও রেজাল্ট
                </h2>
                <p className="text-gray-700 text-lg mb-2 text-justify">
                    জামিয়ায় কুরবানির পূর্বে একটি মূল্যায়ন পরীক্ষা, রবিউল আওয়ালের প্রথমার্ধে অর্ধ-বার্ষিক পরীক্ষা, জুমাদাল উলার শেষাংশে দ্বিতীয় মূল্যায়ন পরীক্ষা ও সাবানের শুরুতে বার্ষিক পরীক্ষা অনুষ্ঠিত হয়। পরীক্ষার ফলাফল জামিয়ার নোটিশ বোর্ডে প্রকাশ করা হয়।
                </p>
                <p className="text-gray-700 text-lg text-justify">
                    শিক্ষার্থীদের পরীক্ষার ফলাফলের ভিত্তিতে তাদের অগ্রগতি মূল্যায়ন করা হয়। মেধাবী শিক্ষার্থীদের পুরুষ্কৃত করার এবং দুর্বল শিক্ষার্থীদের জন্য বিশেষ ক্লাসের ব্যবস্থা করা হয়।
                </p>
            </div>
        </div>
        {/* Additional content to ensure scrolling */}
        <div className="mt-12 p-8 bg-gray-50 rounded-xl shadow-inner">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">শিক্ষার্থীদের জন্য সুযোগ-সুবিধা</h3>
            <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                আমাদের জামিয়ায় শিক্ষার্থীদের জন্য মানসম্মত আধুনিক শিক্ষাদান পদ্ধতির পাশাপাশি বিভিন্ন শিক্ষা কার্যক্রমের ব্যবস্থা রয়েছে। এতে শিক্ষার্থীরা তাদের সুপ্ত প্রতিভা বিকাশের সুযোগ পায়। বিতর্ক প্রতিযোগিতা, কিরাআত মাহফিল, হামদ-নাত প্রতিযোগিতা, এবং ইসলামী কুইজ প্রতিযোগিতার আয়োজন করা হয়।
            </p>
            <p className="text-gray-700 leading-relaxed text-lg text-justify">
                এছাড়াও, শিক্ষার্থীদের জন্য একটি সমৃদ্ধ গ্রন্থাগার রয়েছে যেখানে বিভিন্ন ইসলামী গ্রন্থ, রেফারেন্স বই, এবং আধুনিক গবেষণাপত্র পাওয়া যায়। শিক্ষার্থীরা এখানে নিরিবিলি পরিবেশে পড়াশোনা করতে পারে এবং তাদের জ্ঞানকে আরও প্রসারিত করতে পারে।
                </p>
            </div>
        </div>
    </HelmetProvider>
);


// AdmissionResultPage Component

import { FiEdit, FiSearch } from 'react-icons/fi'; // Icon import
const AdmissionResultPage = () => {
  const navigate = useNavigate();  
return (
          <HelmetProvider>
            <Helmet>
                <title>ভর্তি ও রেজাল্ট - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া</title>
                <meta name="description" content="জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়ার ভর্তি ফরম পূরণ করুন বা পরীক্ষার রেজাল্ট দেখুন।" />
            </Helmet>

    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl p-8 md:p-12 bg-white rounded-xl shadow-2xl animate-fade-in text-center">
        
        {/* === হেডার === */}
        <div className="mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold text-gray-800" 
            style={{ fontFamily: "'Lora', serif" }} // ক্লাসিক ফন্ট
          >
            ভর্তি ও রেজাল্ট
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            আপনার প্রয়োজনীয় অপশন বেছে নিন
          </p>
          <div className="mt-6 h-1 w-24 bg-indigo-500 mx-auto rounded-full"></div>
        </div>

        {/* === কার্ড সেকশন === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* ভর্তি ফরম কার্ড */}
          <div
        onClick={() => navigate('admission-form')}
            className="group relative bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out cursor-pointer border border-gray-200 overflow-hidden transform hover:-translate-y-2"
          >
            <div className="absolute top-0 left-0 h-2 w-0 bg-green-500 group-hover:w-full transition-all duration-500"></div>
            <div className="flex flex-col items-center">
              <FiEdit className="w-16 h-16 text-green-500 mb-5 transition-transform duration-500 group-hover:scale-110" />
              <h2 className="text-2xl font-semibold text-gray-700">ভর্তি ফরম পূরণ করুন</h2>
              <p className="text-gray-500 mt-3">নতুন/পুরাতন শিক্ষার্থী ভর্তির আবেদন করতে এখানে ক্লিক করুন</p>
            </div>
          </div>

          {/* রেজাল্ট কার্ড */}
          <div
            onClick={() => navigate('result-search')}
            className="group relative bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out cursor-pointer border border-gray-200 overflow-hidden transform hover:-translate-y-2"
          >
            <div className="absolute top-0 left-0 h-2 w-0 bg-indigo-500 group-hover:w-full transition-all duration-500"></div>
            <div className="flex flex-col items-center">
              <FiSearch className="w-16 h-16 text-indigo-500 mb-5 transition-transform duration-500 group-hover:scale-110" />
              <h2 className="text-2xl font-semibold text-gray-700">অনলাইন রেজাল্ট দেখুন</h2>
              <p className="text-gray-500 mt-3">আইডি নম্বর দিয়ে রেজাল্ট দেখতে এখানে ক্লিক করুন</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </HelmetProvider>
    );
};


// AdmissionFormPage Component

const classes = [
  { code: 1, name: "তাফসীর বিভাগ" },
  { code: 2, name: "উলুমুল হাদীস বিভাগ" },
  { code: 3, name: "ইফতা বিভাগ" },
  { code: 4, name: "আদব বিভাগ" },
  { code: 5, name: "তাকমীল" },
  { code: 6, name: "ফযীলত" },
  { code: 7, name: "জালালাইন" },
  { code: 8, name: "শরহে বেকায়া" },
  { code: 9, name: "শরহে জামী" },
  { code: 10, name: "কাফিয়া" },
  { code: 11, name: "হেদায়াতুন্নাহু" },
  { code: 12, name: "নাহবেমীর" },
  { code: 13, name: "মিজান" },
  { code: 14, name: "তাইসীর" },
  { code: 15, name: "হুফ্ফাজ" },
  { code: 16, name: "হেফজখানা" },
];

const hijriYear = moment().iYear(); // যেমন 1447
const hijriShort = String(hijriYear).slice(-2); // "47"

const AdmissionFormPage = () => {
  const storage = getStorage();

  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    dob: "",
    mobile: "",
    presentAddress: "",
    permanentAddress: "",
    residency: "",
    type: "", // নতুন/পুরাতন
    desiredClass: "",
    previousClass: "",
    previousInstitute: "",
    guardianName: "",
    guardianAddress: "",
    guardianMobile: "",
    relationWithGuardian: "",
    NidOrBrcNo: "",
    idType: "",
    nidFront: null,
    nidBack: null,
    birthCert: null,
    oldStudentId: "",
  });

  const [studentId, setStudentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [oldStudentData, setOldStudentData] = useState(null);
  const [fetchingOldData, setFetchingOldData] = useState(false);

  // === ফর্ম পূর্ণতা চেক ===
  const isFormComplete = () => {
    if (formData.type === "নতুন") {
      const requiredFields = [
        'residency', 'desiredClass', 'fullName', 'fatherName', 
        'dob', 'NidOrBrcNo', 'mobile', 'presentAddress'
      ];
      return requiredFields.every(field => formData[field]);
    }
    return true;
  };

  // === পুরাতন ছাত্র ডাটা ফেচ ===
  const fetchOldStudentData = async (id) => {
  if (!id) return;
  setFetchingOldData(true);
  try {
    const q = query(
      collection(db, "admissions"),
      where("studentId", "==", id)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data();
      setOldStudentData(docData);
    } else {
      alert("দুঃখিত, এই আইডি নম্বরের সাথে কোন তথ্য পাওয়া যায়নি।");
      setOldStudentData(null);
    }
  } catch (err) {
    alert("ডাটা লোড করতে সমস্যা হয়েছে: " + err.message);
    setOldStudentData(null);
  } finally {
    setFetchingOldData(false);
  }
};

  useEffect(() => {
  if (formData.type === "পুরাতন" && formData.oldStudentId) {
    // শুধু সংখ্যা এবং ন্যূনতম ৬ ডিজিট
    if (/^\d{6,7}$/.test(formData.oldStudentId)) {
      const timer = setTimeout(() => {
        fetchOldStudentData(formData.oldStudentId);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setOldStudentData(null);
    }
  } else {
    setOldStudentData(null);
  }
}, [formData.oldStudentId, formData.type]);

  // === ইনপুট হ্যান্ডলার ===
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    
    // মোবাইল নম্বর ভ্যালিডেশন
    if (name.includes("Mobile")) {
      if (/^\d{0,11}$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }
    
    if (type === "file") {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // === সাবমিট ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (formData.type === "পুরাতন") {
  if (!oldStudentData) {
    alert("সঠিক পুরাতন আইডি দিন অথবা তথ্য লোড হওয়ার অপেক্ষা করুন।");
    setSubmitting(false);
    return;
  }
  
  try {
    // পুরাতন ছাত্রের তথ্য আপডেট
    const docRef = doc(db, "admissions", oldStudentData.id);
    await updateDoc(docRef, {
      ...formData,
      lastUpdated: new Date()
    });
    
    setStudentId(oldStudentData.studentId);
  } catch (error) {
    alert("আপডেট করতে সমস্যা হয়েছে: " + error.message);
  }
  setSubmitting(false);
  return;
}

      // নতুন ছাত্র → সিরিয়াল বের করা
      const classCode = formData.desiredClass;
      if (!classCode) {
        alert("দয়া করে কাঙ্ক্ষিত জামাআত নির্বাচন করুন");
        setSubmitting(false);
        return;
      }

      // ঐ ক্লাসে আগে কতজন ভর্তি হয়েছে?
      const q = query(
        collection(db, "admissions"),
        where("desiredClass", "==", classCode)
      );
      const querySnapshot = await getDocs(q);
      const serial = querySnapshot.size + 1;

      const newStudentId = `${hijriShort}${classCode}${serial.toString().padStart(3, '0')}`;

      const docRef = await addDoc(collection(db, "admissions"), {
  ...formData,
  submittedAt: new Date(),
  studentId: newStudentId,
});

// ডকুমেন্ট আইডি সংরক্ষণ
setStudentId({
  id: docRef.id,
  studentId: newStudentId
});

      setStudentId(newStudentId);

      // ফর্ম রিসেট
      setFormData({
        fullName: "",
        fatherName: "",
        dob: "",
        mobile: "",
        presentAddress: "",
        permanentAddress: "",
        residency: "",
        type: "",
        desiredClass: "",
        previousClass: "",
        previousInstitute: "",
        guardianName: "",
        guardianAddress: "",
        guardianMobile: "",
        relationWithGuardian: "",
        NidOrBrcNo: "",
        idType: "",
        nidFront: null,
        nidBack: null,
        birthCert: null,
        oldStudentId: "",
      });
    } catch (error) {
      alert("সাবমিশনে সমস্যা হয়েছে: " + error.message);
    }
    setSubmitting(false);
  };

  return (
          <HelmetProvider>
            <Helmet>
                <title>ভর্তি ফরম - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া</title>
                <meta name="description" content="জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়ার ভর্তি ফরম পূরণ করুন।" />
            </Helmet>

    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10 animate-fade-in">
      {studentId ? (
        <div className="text-green-700 text-center font-semibold text-xl">
          আপনার ভর্তির আবেদন গৃহীত হয়েছে। <br />
          আপনার আইডি নম্বর:{" "}
          <span className="font-bold text-2xl">{studentId}</span> <br />
          এই 01600560675 নম্বরে যোগাযোগ করে পেমেন্ট সম্পন্ন করার মাধ্যমে আপনার ভর্তি নিশ্চিত করুন।
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">
            ভর্তি ফরম
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg text-justify">
            বরাবর<br />
            মাননীয় মুহতামিম সাহেব দা.বা.<br />
            সালাম বাদ বিনীত নিবেদন এই যে, আমি আল্লাহ তাআলাকে রাজি-খুশি ও সন্তুষ্টি করার নিমিত্তে ইলমে দ্বীন শিক্ষার উদ্দেশ্যে জামিয়ার সকল নিয়ম-কানুন সম্পূর্ণরূপে মেনে চলার অঙ্গিকার করে জামিয়া কাসেমীয়ায় ভর্তি হওয়ার আবেদন করছি। নিম্নে আপনার সদয় অবগতির জন্য আমার পূর্ণ পরিচিতি পেশ করলাম।
          </p>
                      
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 mt-6">
            {/* শিক্ষার্থীর ধরন */}
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">শিক্ষার্থীর ধরন নির্বাচন করুন</option>
              <option value="নতুন">নতুন</option>
              <option value="পুরাতন">পুরাতন</option>
            </select>

            {/* পুরাতন ছাত্র */}
            {formData.type === "পুরাতন" && (
              <div className="space-y-4">
                <input
                  name="oldStudentId"
                  value={formData.oldStudentId}
                  onChange={handleChange}
                  placeholder="শিক্ষার্থীর পুরাতন আইডি নম্বর"
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                
                {fetchingOldData && (
                  <p className="text-indigo-600 flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    তথ্য লোড হচ্ছে...
                  </p>
                )}
                
                {oldStudentData && (
  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
    <h3 className="font-bold text-lg text-indigo-800 mb-2">পূর্বের তথ্য</h3>
    <p><span className="font-semibold">পূর্ণ নাম:</span> {oldStudentData.fullName}</p>
    <p><span className="font-semibold">মোবাইল:</span> {oldStudentData.mobile}</p>
    <p>
      <span className="font-semibold">কাঙ্ক্ষিত জামাআত:</span>{" "}
      {classes.find(c => c.code.toString() === oldStudentData.desiredClass?.toString())?.name || "N/A"}
    </p>
  </div>
)}
</div>
)}

            {/* নতুন ছাত্র */}
            {formData.type === "নতুন" && (
              <div className="grid grid-cols-1 gap-6">
                {/* আবাসিক/অনাবাসিক */}
                <select 
                  name="residency" 
                  value={formData.residency} 
                  onChange={handleChange} 
                  required 
                  className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                > 
                  <option value="">আবাসিক/অনাবাসিক নির্বাচন করুন</option> 
                  <option value="আবাসিক">আবাসিক</option> 
                  <option value="অনাবাসিক">অনাবাসিক</option> 
                </select> 
                
                {/* কাঙ্ক্ষিত জামাআত */}
                <select
                  name="desiredClass"
                  value={formData.desiredClass}
                  onChange={handleChange}
                  required
                  className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">কাঙ্ক্ষিত জামাআত নির্বাচন করুন</option>
                  {classes.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                
                {/* শিক্ষার্থীর পূর্ণ নাম এবং পিতার নাম */}
                {[
                  ["fullName", "শিক্ষার্থীর পূর্ণ নাম"],
                  ["fatherName", "পিতার নাম"],
                ].map(([name, placeholder]) => (
                  <input
                    key={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                ))}

                {/* জন্ম তারিখ */}
                <div className="relative">
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  {!formData.dob && (
                    <span className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                      জন্ম তারিখ
                    </span>
                  )}
                </div>
                
            {/* এনআইডি / জন্মনিবন্ধন ছবি আপলোড সিস্টেমের কোড */} 
            {/* <select name="idType" value={formData.idType} 
            onChange={handleChange} required className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" > 
            <option value="">তথ্য প্রদান পদ্ধতি নির্বাচন করুন</option> 
            <option value="nid">এনআইডি কার্ড অনুযায়ী</option> 
            <option value="birthCert">জন্মনিবন্ধন অনুযায়ী</option> 
            </select> */} 
            
            {/* ফাইল আপলোড */} 
            {/* {formData.idType === "nid" && ( <> <label className="col-span-1 font-semibold mt-2">এনআইডি কার্ডের ছবি আপলোড করুন</label> 
            <input type="file" name="nidFront" accept="image/*" onChange={handleChange} required className="col-span-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" /> 
            <input type="file" name="nidBack" accept="image/*" onChange={handleChange} required className="col-span-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" /> </> )} 
            {formData.idType === "birthCert" && ( <> <label className="col-span-1 font-semibold mt-2">জন্মনিবন্ধন সনদের ছবি আপলোড করুন</label> 
            <input type="file" name="birthCert" accept="image/*" onChange={handleChange} required className="col-span-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" /> </> )} */}

                {/* অন্যান্য ফিল্ড */}
                {[
                  ['NidOrBrcNo', 'এনআইডি বা জন্মনিবন্ধন নম্বর'],
                  ["mobile", "মোবাইল নম্বর"],
                  ["presentAddress", "পূর্ণ বর্তমান ঠিকানা"],
                  ["permanentAddress", "পূর্ণ স্থায়ী ঠিকানা"],
                  ["previousClass", "পূর্বে যে জামাআতে পড়েছে"],
                  ["previousInstitute", "পূর্ব প্রতিষ্ঠানের নাম"],
                  ["guardianName", "অভিভাবকের নাম"],
                  ["guardianAddress", "অভিভাবকের ঠিকানা"],
                  ["guardianMobile", "অভিভাবকের মোবাইল নম্বর"],
                  ["relationWithGuardian", "অভিভাবকের সাথে সম্পর্ক"],
                ].map(([name, placeholder]) => (
                  <input
                    key={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                ))}
              </div>
            )}

            {/* সাবমিট বাটন */}
            <button
              type="submit"
              disabled={
                submitting || 
                (formData.type === "পুরাতন" && !oldStudentData) ||
                (formData.type === "নতুন" && !isFormComplete())
              }
              className={`bg-indigo-600 text-white py-3 px-6 rounded-xl font-medium text-lg transition ${
                submitting || 
                (formData.type === "পুরাতন" && !oldStudentData) ||
                (formData.type === "নতুন" && !isFormComplete())
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700 hover:shadow-md"
              }`}
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  সাবমিট হচ্ছে...
                </div>
              ) : "সাবমিট করুন"}
                            </button>
                        </form>
                    </>
                )}
            </div>
      </HelmetProvider>
    );
};



// generatePDF Component
const generatePDF = async (result) => {
  const input = document.getElementById('marksheet');
  if (!input) return;

  const canvas = await html2canvas(input, {
    scale: 3, // Higher for better clarity
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // রেশিও হিসাব করে কনটেন্ট স্কেল করা
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const scaledWidth = imgWidth * ratio;
  const scaledHeight = imgHeight * ratio;

  const x = (pdfWidth - scaledWidth) / 2;
  const y = (pdfHeight - scaledHeight) / 2;

  pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

  const sanitizeFileName = (str) => str.replace(/[^\w\u0980-\u09FF]/g, '_');
  const name = sanitizeFileName(result.name);
  const id = result.idNo;
  const fileName = `${name}_${id}.pdf`;
  pdf.save(fileName);

};


// ResultSearchPage Component
// ইংরেজি → বাংলা
function engToBanNum(str = "") {
  const engNums = ["0","1","2","3","4","5","6","7","8","9"];
  const banNums = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  return str.replace(/[0-9]/g, d => banNums[engNums.indexOf(d)]);
}

// বাংলা → ইংরেজি
function banToEngNum(str = "") {
  const engNums = ["0","1","2","3","4","5","6","7","8","9"];
  const banNums = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  return str.replace(/[০-৯]/g, d => engNums[banNums.indexOf(d)]);
}

  const ResultSearchPage = () => {
  const [examType, setExamType] = useState('প্রথম');
  const [roll, setRoll] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
  setLoading(true);
  setError('');
  setResult(null);

  try {
    const querySnapshot = await getDocs(collection(db, 'results'));
    let found = false;

    const rollBan = engToBanNum(roll); // ইউজারের ইনপুট বাংলায়
    const rollEng = banToEngNum(roll); // ইউজারের ইনপুট ইংরেজিতে

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const dbBan = engToBanNum(data.idNo); // DB এর আইডি বাংলায়
      const dbEng = banToEngNum(data.idNo); // DB এর আইডি ইংরেজিতে

      if (
        (dbBan === rollBan || dbEng === rollEng) &&
        data.exam === examType
      ) {
        setResult(data);
        found = true;
      }
    });

    if (!found) {
      setError('এই রোল নম্বর ও পরীক্ষার ধরনে কোন রেজাল্ট পাওয়া যায়নি।');
    }
  } catch (err) {
    setError('রেজাল্ট খুঁজতে সমস্যা হয়েছে।');
  }

  setLoading(false);
};


  return (
    <HelmetProvider>
            <Helmet>
                <title>রেজাল্ট দেখুন - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া</title>
                <meta name="description" content="আপনার আইডি নম্বর দিয়ে জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়ার পরীক্ষার রেজাল্ট দেখুন।" />
            </Helmet>
            <div className="max-w-[794px] w-full mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10 animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">রেজাল্ট দেখুন</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="প্রথম">প্রথম সাময়িক পরীক্ষা</option>
          <option value="দ্বিতীয়">দ্বিতীয় সাময়িক পরীক্ষা</option>
          <option value="বার্ষিক">বার্ষিক পরীক্ষা</option>
        </select>

        <input
          type="text"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          placeholder="আইডি নম্বর লিখুন"
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading || roll.trim() === ''}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition mb-4"
      >
        {loading ? 'লোড হচ্ছে...' : 'রেজাল্ট দেখুন'}
      </button>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {result && (
  <div id="marksheet" className="mt-8 text-left bg-gray-50 p-6 rounded-xl shadow">
      <div className="text-center mb-6 border-b pb-4">
  <img src= {madrasaInfo.logo} alt="Logo" className="h-24 mx-auto mb-2" />
  <h1 className="text-3xl font-extrabold text-indigo-900">জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া</h1>
  <p className="text-sm text-gray-700">দাতিয়ারা (ওয়াপদা নতুন গেইট সংলগ্ন), ব্রাহ্মণবাড়িয়া সদর</p>
<p className="text-xl font-semibold text-indigo-800">পরীক্ষার ফলাফল</p>
</div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
  <p><span className="font-semibold text-gray-800">নাম:</span> {result.name}</p>
  <p><span className="font-semibold text-gray-800">পিতার নাম:</span> {result.fatherName}</p>
  <p><span className="font-semibold text-gray-800">জামাআত:</span> {result.class}</p>
  <p><span className="font-semibold text-gray-800">আইডি নম্বর:</span> {result.idNo}</p>
  <p><span className="font-semibold text-gray-800">পরীক্ষা:</span> {result.exam}</p>
  <p><span className="font-semibold text-gray-800">শিক্ষাবর্ষ:</span> {result.year}</p>
</div>


    <table className="w-full border border-gray-300 text-sm">
  <thead className="bg-indigo-100 text-indigo-900">
    <tr>
      <th className="border px-3 py-2">বিষয়</th>
      <th className="border px-3 py-2">পূর্ণ নম্বর</th>
      <th className="border px-3 py-2">প্রাপ্ত নম্বর</th>
    </tr>
  </thead>
  <tbody>
    {result.subjects.map((subj, idx) => (
      <tr key={idx} className="even:bg-gray-50">
        <td className="border px-3 py-2">{subj.name}</td>
        <td className="border px-3 py-2 text-center">{subj.fullMarks}</td>
        <td className="border px-3 py-2 text-center">{subj.obtained}</td>
      </tr>
    ))}
  </tbody>
</table>


<div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
  <p className="text-lg font-semibold text-green-700">মোট প্রাপ্ত নম্বর: {result.total}</p>
  <p className="text-lg font-semibold text-green-700">গ্রেড: {result.grade}</p>
  <p className="text-lg font-semibold text-green-700">মেধাস্থান: {result.position}</p>
</div>


          
          <div className="flex justify-center">
  <button
    className="mt-4 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 
               text-base font-medium flex items-center justify-center"
    onClick={() => generatePDF(result)}
  >
    পিডিএফ ডাউনলোড করুন
                            </button>
                        </div>

                    </div>
                )}
            </div>
       </HelmetProvider>
    );
};


// Hostel Info Page Component
const HostelInfoPage = () => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>হোস্টেল - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া</title>
                <meta name="description" content="জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়ার হোস্টেল সুবিধা, নিয়মাবলী এবং খরচ সম্পর্কে বিস্তারিত জানুন।" />
            </Helmet>

            <div className="p-6 md:p-10 bg-white rounded-2xl shadow-xl animate-fade-in">
                <h1 className="text-4xl font-extrabold text-indigo-900 mb-10 text-center">হোস্টেল বা আবাসন</h1>

                <div className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl shadow-md border border-blue-200 animate-fade-in">
                    <h2 className="text-3xl font-bold text-blue-800 mb-5 flex items-center">
                        <Building2 className="mr-3 text-blue-600" size={32} /> থাকার ব্যবস্থা
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                        জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া শিক্ষার্থীদের জন্য সুশৃঙ্খল ও নিরাপদ আবাসন ব্যবস্থা প্রদান করে। হোস্টেলে পর্যাপ্ত কক্ষ, বিশুদ্ধ পানী, এবং স্বাস্থ্যসম্মত খাবার ও পরিবেশ নিশ্চিত করা হয়। প্রতিটি কক্ষে নির্দিষ্ট সংখ্যক শিক্ষার্থী থাকার ব্যবস্থা রয়েছে।
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                        আমাদের হোস্টেল ভবনটি আধুনিক সুযোগ-সুবিধা সম্পন্ন। এখানে শিক্ষার্থীদের পড়াশোনার জন্য নিরিবিলি পরিবেশ এবং পর্যাপ্ত আলো-বাতাসের ব্যবস্থা আছে। 
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg text-justify">
                        আমরা শিক্ষার্থীদের স্বাস্থ্যের প্রতি বিশেষ যত্নশীল। নিয়মিত স্বাস্থ্য পরীক্ষা এবং স্বাস্থ্যকর খাবারের ব্যবস্থা করা হয়। হোস্টেলে সার্বক্ষণিক তত্ত্বাবধানের জন্য অভিজ্ঞ শিক্ষক ও কর্মচারী নিয়োজিত আছেন।
                    </p>
                </div>

                <div className="mb-12 bg-gradient-to-br from-green-50 to-teal-100 p-8 rounded-xl shadow-md border border-green-200 animate-fade-in">
                    <h2 className="text-3xl font-bold text-green-800 mb-5 flex items-center">
                        <Gavel className="mr-3 text-green-600" size={32} /> নিয়মাবলী
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg mb-4 text-justify">
                        <li>হোস্টেলের সকল শিক্ষার্থীকে জামিয়ার নিয়মাবলী কঠোরভাবে মেনে চলতে হবে। পাঁচ ওয়াক্ত নামাজ জামায়াতের সহিত আদায় করা বাধ্যতামূলক। নিয়মাবলী ভঙ্গ করলে শাস্তিমূলক ব্যবস্থা গ্রহণ করা হবে।</li>
                        <li>নির্দিষ্ট সময়ে ক্লাসে উপস্থিত থাকতে হবে এবং নিয়মিত পড়াশোনা করতে হবে।</li>
                        <li>পরিষ্কার-পরিচ্ছন্নতা বজায় রাখা বাধ্যতামূলক। ব্যক্তিগত পরিচ্ছন্নতার পাশাপাশি হোস্টেলের পরিবেশ পরিচ্ছন্ন রাখতে হবে।</li>
                        <li>অযথা গোলযোগ বা বিশৃঙ্খলা সৃষ্টি করা যাবে না। হোস্টেলের শান্তি ও শৃঙ্খলা বজায় রাখতে হবে।</li>
                        <li>শিক্ষকদের অনুমতি ছাড়া হোস্টেল ত্যাগ করা যাবে না। জরুরি প্রয়োজনে কর্তৃপক্ষের অনুমতি নিতে হবে।</li>
                        <li>স্মার্টফোন, কাপড় স্ত্রী-মেশিন ও অন্যান্য ইলেক্ট্রনিকস সমগ্রী ব্যবহার সম্পূর্ণ নিষিদ্ধ।</li>
                        <li>হোস্টেলে কোনো প্রকার রাজনৈতিক বা অসামাজিক কার্যকলাপ নিষিদ্ধ।</li>
                        <li>শিক্ষার্থীরা হোস্টেলের সম্পত্তি রক্ষা করতে বাধ্য থাকবে। কোনো প্রকার ক্ষতিসাধন করলে তার জন্য জবাবদিহি করতে হবে।</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed text-lg text-justify">
                        এই নিয়মাবলী শিক্ষার্থীদের সুশৃঙ্খল জীবনযাপন এবং উন্নত শিক্ষা অর্জনে সহায়তা করবে। নিয়মাবলী ভঙ্গ করলে কর্তৃপক্ষ যে কোনো শাস্তিমূলক ব্যাবস্থা গ্রহণ করার পূর্ণ এখতিয়ার রাখবে। সে ক্ষেত্রে ছাত্র বা তার অভিভাবকের কোনো আপত্তি গ্রহণযোগ্য হবে না।
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-xl shadow-md border border-purple-200 animate-fade-in">
                    <h2 className="text-3xl font-bold text-purple-800 mb-5 flex items-center">
                        <DollarSign className="mr-3 text-purple-600" size={32} /> খরচের বিবরণ
                    </h2>
                    <div className="text-gray-700 leading-relaxed text-lg mb-4 space-y-2">
                        <p className="font-semibold">বেতন:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>হিফজখানা: ১০০০ টাকা মাসিক</li>
                            <li>কিতাবখানা: ৫০০ টাকা মাসিক</li>
                            <li>ইফতা বিভাগ: ১২০০ টাকা মাসিক</li>
                        </ul>
                        <p className="font-semibold">আবাসন ফি: ফ্রি</p>
                        <p className="font-semibold">খাবারের চার্জ: ২৫০০ টাকা মাসিক</p>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg text-justify">
                        বর্তমান হোস্টেল ফি এবং অন্যান্য খরচের বিস্তারিত জানতে মাদরাসা অফিসে যোগাযোগ করুন। ফি কাঠামো স্বচ্ছ এবং শিক্ষার্থীদের জন্য সাশ্রয়ী করার চেষ্টা করা হয়েছে।
                    </p>
                </div>

                <div className="mt-12 p-8 bg-gray-50 rounded-xl shadow-inner">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">হোস্টেল সুবিধা ও নিরাপত্তা</h3>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                        হোস্টেলে শিক্ষার্থীদের জন্য পড়াশোনার একটি আদর্শ পরিবেশ বজায় রাখা হয়। নিয়মিত তালিমে দ্বীন ও নৈতিকতার ক্লাস অনুষ্ঠিত হয়, যা শিক্ষার্থীদের আত্মিক উন্নতিতে সহায়ক। এছাড়াও, হোস্টেলের দায়িত্বপ্র্রাপ্ত এবং অন্যান্য শিক্ষকগণ শিক্ষার্থীদের সার্বক্ষণিক তত্ত্বাবধানে থাকেন, যাতে তারা পড়াশোনায় মনোযোগী হতে পারে এবং কোনো সমস্যার সম্মুখীন হলে দ্রুত সমাধান পেতে পারে।
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg text-justify">
                        হোস্টেল জীবন শিক্ষার্থীদের মধ্যে ভ্রাতৃত্ববোধ এবং সহযোগিতার মনোভাব গড়ে তোলে। বিভিন্ন অঞ্চলের শিক্ষার্থীরা একসাথে বসবাস করার ফলে তাদের মধ্যে পারস্পরিক সাংস্কৃতির বিনিময় ঘটে এবং তারা একে অপরের প্রতি শ্রদ্ধাশীল হতে শেখে। আমরা হোস্টেলের পরিবেশকে একটি পরিবারের মতো মনে করি, যেখানে প্রতিটি শিক্ষার্থী নিরাপদ ও সুরক্ষিত অনুভব করে।
                    </p>
                </div>
            </div>
       </HelmetProvider>
    );
};



// Donation Page Component
const DonationPage = () => (
    <HelmetProvider>
        <Helmet>
            <title>অনুদান - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া</title>
            <meta name="description" content="জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া একটি অলাভজনক দ্বীনি প্রতিষ্ঠান। আপনার অনুদান দ্বীনি শিক্ষার প্রসারে গুরুত্বপূর্ণ ভূমিকা রাখতে পারে।" />
        </Helmet>
    <div className="p-6 md:p-10 bg-white rounded-2xl shadow-xl animate-fade-in">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-10 text-center">ডোনেশন বা অনুদান</h1>

        <p className="text-center text-gray-700 mb-10 leading-relaxed text-lg text-justify">
            জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া একটি অলাভজনক দ্বীনি প্রতিষ্ঠান। জামিয়ার সকল কার্যক্রম আল্লাহ তাআলার উপর ভরসা করে এবং মুসলিম উম্মাহর সহযোগিতায় পরিচালিত হয়। আপনার সামান্য অনুদানও দ্বীনি শিক্ষার প্রসারে গুরুত্বপূর্ণ ভূমিকা রাখতে পারে। আল্লাহ তাআলা আপনাদের দানকে কবুল করুন।
            <br/><br/>
            আমাদের জামিয়া সমাজের দরিদ্র ও মেধাবী শিক্ষার্থীদের বিনামূল্যে শিক্ষা প্রদান করে থাকে। এই মহৎ কাজে আপনার সহযোগিতা আমাদের জন্য অত্যন্ত গুরুত্বপূর্ণ। আপনার প্রতিটি অনুদান হাজারো শিক্ষার্থীর ভবিষ্যৎ গঠনে সহায়তা করবে।
            <br/><br/>
            আমরা স্বচ্ছতা ও জবাবদিহিতায় বিশ্বাসী। আপনার অনুদানের প্রতিটি টাকা কোথায় এবং কিভাবে খরচ হচ্ছে, তার সম্পূর্ণ হিসাব আমরা প্রদান করতে প্রস্তুত।
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-green-50 to-teal-100 p-8 rounded-xl shadow-md border border-green-200 animate-slide-in-left">
                <h2 className="text-3xl font-bold text-green-800 mb-5 flex items-center">
                    <Wallet className="mr-3 text-green-600" size={32} /> মোবাইল ব্যাংকিং
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg mb-4 text-justify">
                    <li>বিকাশ (পার্সোনাল): <span className="font-semibold">{madrasaInfo.mobile}</span></li>
                    <li>নগদ (পার্সোনাল): <span className="font-semibold">{madrasaInfo.mobile}</span></li>
                    <li>রকেট (পার্সোনাল): <span className="font-semibold">{madrasaInfo.mobile}</span></li>
                </ul>
                <p className="text-sm text-gray-600 mt-5 text-justify">
                    অনুদান পাঠানোর পর অনুগ্রহ করে আমাদের WhatsApp নম্বরে (<a href="https://wa.me/8801600560675" className="text-blue-400 hover:underline">01600560675</a>) একটি মেসেজ দিয়ে নিশ্চিত করুন। আপনার নাম এবং অনুদানের পরিমাণ উল্লেখ করলে আমরা কৃতজ্ঞ থাকব।
                </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-8 rounded-xl shadow-md border border-blue-200 animate-slide-in-right">
                <h2 className="text-3xl font-bold text-blue-800 mb-5 flex items-center">
                    <Handshake className="mr-3 text-blue-600" size={32} /> ব্যাংক বিবরণী
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg mb-4 text-justify">
                    <li>ব্যাংকের নাম: ইসলামী ব্যাংক বাংলাদেশ লিমিটেড</li>
                    <li>একাউন্ট নাম: জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া</li>
                    <li>একাউন্ট নম্বর: 1234567890</li>
                    <li>শাখা: ব্রাহ্মণবাড়িয়া শাখা</li>
                </ul>
                <p className="text-sm text-gray-600 mt-5 text-justify">
                    ব্যাংকের মাধ্যমে অনুদান পাঠানোর পর অনুগ্রহ করে আমাদের ইমেইলে (<a href="mailto:Jamia.qasemia2021@gmail.com" className="text-blue-400 hover:underline" >Jamia.qasemia2021@gmail.com</a>) একটি ইমেইল অথবা WhatsApp নম্বরে (<a href="https://wa.me/8801600560675" className="text-blue-400 hover:underline">01600560675</a>) একটি মেসেজ পাঠিয়ে নিশ্চিত করুন। এটি আমাদের হিসাব রাখতে সাহায্য করবে।
                </p>
            </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-8 rounded-xl shadow-md border border-amber-200 text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-amber-800 mb-5 flex items-center justify-center">
                <DollarSign className="mr-3 text-amber-600" size={32} /> অনলাইন ডোনেট অপশন
            </h2>
            <p className="text-gray-700 mb-5 text-lg text-justify">
                শীঘ্রই আমাদের অনলাইন ডোনেশন অপশন চালু হবে। এই মুহূর্তে মোবাইল ব্যাংকিং বা ব্যাংক ট্রান্সফারের মাধ্যমে অনুদান পাঠাতে পারেন।
            </p>
            <button className="bg-amber-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300 transform hover:-translate-y-1 cursor-not-allowed opacity-70">
                অনলাইন ডোনেট করুন (শীঘ্রই আসছে)
            </button>
            <p className="text-gray-700 leading-relaxed text-lg mt-4 text-justify">
                আপনার যেকোনো অনুদান আমাদের মাদরাসার শিক্ষার্থীদের জন্য একটি উজ্জ্বল ভবিষ্যৎ নিশ্চিত করতে সাহায্য করবে। আল্লাহ তাআলা আপনার দানকে সাদাকায়ে জারিয়া হিসেবে কবুল করুন।
            </p>
        </div>
        {/* Additional content to ensure scrolling */}
        <div className="mt-12 p-8 bg-gray-50 rounded-xl shadow-inner">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">কেন আপনি অনুদান দেবেন?</h3>
            <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া একটি দ্বীনি প্রতিষ্ঠান হিসেবে সমাজের উন্নয়নে গুরুত্বপূর্ণ ভূমিকা পালন করছে। আপনার অনুদান সরাসরি শিক্ষার্থীদের শিক্ষা ব্যয়, হোস্টেল খরচ, এবং মাদরাসার অবকাঠামোগত উন্নয়নে ব্যবহৃত হবে। এটি একটি সাদাকায়ে জারিয়া, যার সওয়াব আপনি মৃত্যুর পরেও পেতে থাকবেন।
            </p>
            <p className="text-gray-700 leading-relaxed text-lg text-justify">
                আমাদের জামিয়া দরিদ্র ও মেধাবী শিক্ষার্থীদের জন্য শিক্ষার আলো পৌঁছে দিচ্ছে, যারা হয়তো আর্থিক সংকটের কারণে পড়াশোনা চালিয়ে যেতে পারত না। আপনার সহায়তায় এই শিক্ষার্থীরা দ্বীনি জ্ঞান অর্জন করে সমাজের জন্য উপকারী মানুষ হিসেবে গড়ে উঠতে পারবে।
                </p>
            </div>
        </div>
    </HelmetProvider>
);



// Notice Board Page Component
const NoticeBoardPage = () => {
    const notices = [
        { date: '২০২৫-০৭-২৪', title: 'স্বাধীনতা ২.০ উপলক্ষে ছুটি', content: 'এতদ্বারা অত্র জামিয়ার সকল জামাআতের ছাত্রদের অবগতির জন্য জানানো যাচ্ছে যে, আগামী ৫ই আগস্ট স্বাধীনতা ২.০ উপলক্ষে জামিয়ার দরস বন্ধ থাকবে। ০৬-০৮-২০২৫ থেকে যথারীতি পূনরায় দরস চলবে।' },
        { date: '২০২৫-০৭-১৯', title: 'পরীক্ষার ফলাফল প্রকাশের ঘোষণা', content: 'কুরবানির পূর্বে অনুষ্ঠিত প্রথম মূল্যায়ন পরীক্ষার ফলাফল জামিয়ার অফিসের সামনে নোটিস বোর্ডে প্রকাশ করা হয়েছে। সবাইকে আপন আপন ফলাফল দেখার জন্য বলা হচ্ছে।' },
        { date: '২০২৫-১৪-০৪', title: 'নতুন শিক্ষাবর্ষ শুরু', content: 'নতুন শিক্ষাবর্ষ ১৭ শাওয়াল থেকে শুরু হয়েছে। সকল শিক্ষার্থীকে ক্লাসে উপস্থিত থাকার নির্দেশ দেওয়া হচ্ছে।' },
        { date: '২০২৫-০৫-১০', title: 'বার্ষিক ওয়াজ মাহফিল', content: 'জামিয়ার বার্ষিক ওয়াজ মাহফিল আগামী ১০ই জানুয়ারি অনুষ্ঠিত হবে। এতে দেশের প্রখ্যাত আলেমগণ তাশরিফ আনবেন। সকল ধর্মপ্রাণ মুসলিম ভাই-বোনদের উপস্থিতি কামনা করা হচ্ছে।' },
        { date: '২০২৪-০২-২৫', title: 'হিফজুল কুরআন বিভাগ', content: 'হিফজ বিভাগের কার্যক্রম পূনরায় আরম্ভ হয়েছে। সকল উসতাদ ও ছাত্রদের ছাত্র সংগ্রহের ফিকির করতে বলা হচ্ছে।' },
    ];

    return (
        <HelmetProvider>
            <Helmet>
                <title>নোটিশ বোর্ড - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া</title>
                <meta name="description" content="জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়ার সকল জরুরি নোটিশ এবং ঘোষণা এখানে দেখুন।" />
            </Helmet>

        <div className="p-6 md:p-10 bg-white rounded-2xl shadow-xl animate-fade-in">
            <h1 className="text-4xl font-extrabold text-indigo-900 mb-10 text-center">নোটিশ বোর্ড / ঘোষণা</h1>

            <div className="space-y-8">
                {notices.map((notice, index) => (
                    <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition-shadow duration-300 animate-slide-in-up">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">{notice.title}</h2>
                            <span className="text-sm text-gray-500 flex items-center">
                                <CalendarDays className="mr-2" size={20} /> {notice.date}
                            </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg text-justify">{notice.content}</p>
                    </div>
                ))}
            </div>
            {/* Additional content to ensure scrolling */}
            <div className="mt-12 p-8 bg-gray-100 rounded-xl shadow-inner">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">গুরুত্বপূর্ণ ঘোষণা</h3>
                <p className="text-gray-700 leading-relaxed text-lg text-justify">
                    সকল শিক্ষক, শিক্ষার্থী ও সংশ্লিষ্ট সকলের অবগতির জন্য জানানো যাচ্ছে যে, মাদরাসার সকল নোটিশ নিয়মিতভাবে এই নোটিশ বোর্ডে প্রকাশ করা হবে। গুরুত্বপূর্ণ কোনো তথ্য বা পরিবর্তন থাকলে তা দ্রুত এখানে আপডেট করা হবে। তাই নিয়মিত নোটিশ বোর্ড চেক করার জন্য অনুরোধ করা হচ্ছে।
                </p>
                <p className="text-gray-700 leading-relaxed text-lg text-justify">
                    এছাড়াও, মাদরাসার অফিসিয়াল ওয়েবসাইট এবং সামাজিক যোগাযোগ মাধ্যমেও গুরুত্বপূর্ণ ঘোষণাগুলো প্রকাশ করা হবে। যেকোনো তথ্যের জন্য মাদরাসা কর্তৃপক্ষের সাথে যোগাযোগ করতে দ্বিধা করবেন না।
                    </p>
                </div>
            </div>
        </HelmetProvider>
    );
};



// Gallery Page Component
const GalleryPage = () => {
    const images = [
        "https://placehold.co/600x400/FFD1DC/E91E63?text=শিক্ষার্থী+১",
        "https://placehold.co/600x400/D1FFD1/4CAF50?text=ইভেন্ট+১",
        "https://placehold.co/600x400/D1D1FF/3F51B5?text=শিক্ষার্থী+২",
        "https://placehold.co/600x400/FFFAD1/FFC107?text=ইভেন্ট+২",
        "https://placehold.co/600x400/FFD1DC/E91E63?text=শিক্ষার্থী+৩",
        "https://placehold.co/600x400/D1FFD1/4CAF50?text=ইভেন্ট+৩",
        "https://placehold.co/600x400/D1D1FF/3F51B5?text=শিক্ষার্থী+৪",
        "https://placehold.co/600x400/FFFAD1/FFC107?text=ইভেন্ট+৪",
        "https://placehold.co/600x400/FFD1DC/E91E63?text=শিক্ষার্থী+৫",
        "https://placehold.co/600x400/D1FFD1/4CAF50?text=ইভেন্ট+৫",
        "https://placehold.co/600x400/C0C0C0/333333?text=মাদরাসা+ভবন",
        "https://placehold.co/600x400/A0A0A0/222222?text=ক্লাসরুম",
        "https://placehold.co/600x400/808080/111111?text=গ্রন্থাগার",
        "https://placehold.co/600x400/606060/000000?text=হোস্টেল",
        "https://placehold.co/600x400/404040/FFFFFF?text=শিক্ষক+পরিষদ",
    ];
    const videoPlaceholder = "https://placehold.co/800x450/C0C0C0/333333?text=Video+Placeholder";

    return (
        <HelmetProvider>
            <Helmet>
                <title>গ্যালারি - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া</title>
                <meta name="description" content="জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়ার বিভিন্ন অনুষ্ঠান ও কার্যক্রমের ছবি এবং ভিডিও গ্যালারি।" />
            </Helmet>
        <div className="p-6 md:p-10 bg-white rounded-2xl shadow-xl animate-fade-in">
            <h1 className="text-4xl font-extrabold text-indigo-900 mb-10 text-center">গ্যালারি</h1>

            <div className="mb-12">
                <h2 className="text-3xl font-bold text-indigo-800 mb-6 flex items-center">
                    <Image className="mr-3 text-indigo-600" size={32} /> ছবি
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {images.map((src, index) => (
                        <div key={index} className="relative overflow-hidden rounded-xl shadow-lg group transform transition-transform duration-300 hover:scale-105">
                            <img
                                src={src}
                                alt={`গ্যালারি ছবি ${index + 1}`}
                                className="w-full h-48 object-cover transition-opacity duration-300 group-hover:opacity-80"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/E0E7FF/4F46E5?text=ছবি"; }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white text-xl font-semibold">ছবি {index + 1}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-indigo-800 mb-6 flex items-center">
                    <Video className="mr-3 text-indigo-600" size={32} /> ভিডিও
                </h2>
                <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden shadow-lg"> {/* 16:9 Aspect Ratio */}
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0" // This is a placeholder video
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    <img
                        src={videoPlaceholder}
                        alt="ভিডিও প্লেসহোল্ডার"
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x450/C0C0C0/333333?text=ভিডিও+প্লেসহোল্ডার"; }}
                    />
                </div>
                <p className="text-center text-gray-600 mt-5 text-lg text-justify">
                    এখানে মাদরাসার বিভিন্ন ইভেন্টের ভিডিও দেখতে পাবেন।
                </p>
            </div>
            {/* Additional content to ensure scrolling */}
            <div className="mt-12 p-8 bg-gray-50 rounded-xl shadow-inner">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">আমাদের কার্যক্রমের চিত্র</h3>
                <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                    আমাদের গ্যালারি বিভাগে মাদরাসার বিভিন্ন অনুষ্ঠান, যেমন - বার্ষিক ক্রীড়া প্রতিযোগিতা, ক্বেরাত মাহফিল, ওয়াজ মাহফিল, এবং অন্যান্য শিক্ষামূলক ও সামাজিক কার্যক্রমের ছবি ও ভিডিও নিয়মিতভাবে আপলোড করা হয়। এই ছবি ও ভিডিওগুলো মাদরাসার প্রাণবন্ত পরিবেশ এবং শিক্ষার্থীদের সক্রিয় অংশগ্রহণ তুলে ধরে।
                </p>
                <p className="text-gray-700 leading-relaxed text-lg text-justify">
                    আমরা বিশ্বাস করি, ছবি ও ভিডিওর মাধ্যমে আমাদের কার্যক্রমের স্বচ্ছতা এবং গতিশীলতা আরও ভালোভাবে ফুটিয়ে তোলা সম্ভব। আপনারা এখানে মাদরাসার দৈনন্দিন জীবন এবং বিশেষ মুহূর্তগুলোর ঝলক দেখতে পাবেন।
                    </p>
                </div>
            </div>
        </HelmetProvider>
    );
};


// Fatwa Page Component
const FatwaPage = ({ headerHeight }) => { // Receive headerHeight as prop
    const [activeTab, setActiveTab] = useState('আকীদা');
    const [fatwaQuestion, setFatwaQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([]); // Stores chat messages
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const chatContainerRef = useRef(null); // Ref for scrolling to bottom of chat
    const fatwaContentSectionRef = useRef(null); // Ref for the fatwa content section

    // Scroll to the bottom of the chat history when it updates
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // Scroll to the top of the fatwa content section when activeTab changes
    useEffect(() => {
        if (fatwaContentSectionRef.current) {
            // Adjust scroll position to account for sticky header
            const offsetTop = fatwaContentSectionRef.current.offsetTop;
            window.scrollTo({ top: offsetTop - (headerHeight || 0), behavior: 'smooth' });
        }
    }, [activeTab, headerHeight]); // Depend on activeTab and headerHeight

    const fatwaCategories = [
        { name: 'আকীদা', icon: ShieldCheck, content: `ইসলামী আকীদা-বিশ্বাস প্রতিটি মুসলিমের জীবনের মূল ভিত্তি। এটি একজন মুসলিমের বিশ্বাস, চিন্তা ও কর্মের দিকনির্দেশনা প্রদান করে। তাওহিদ, রিসালাত, আখিরাত, নামাজ, রোজা, যাকাত ও হজ্ব - এই স্তম্ভগুলো আকীদার ওপরই প্রতিষ্ঠিত। 
        আকীদার সঠিক জ্ঞান অর্জন এবং তা দৃঢ়ভাবে ধারণ করা প্রতিটি মুসলিমের জন্য অপরিহার্য। ভুল আকীদা একজন ব্যক্তিকে পথভ্রষ্ট করতে পারে এবং তার ঈমানকে দুর্বল করে দিতে পারে। 
        ইসলামী আকীদা কুরআন-সুন্নাহর আলোকে সুবিন্যস্ত। আল্লাহ, তাঁর রাসূল সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম, ফেরেশতা, আসমানী কিতাবসমূহ, আখিরাত এবং তাকদীরের ওপর বিশ্বাস স্থাপন করা আকীদার মৌলিক অংশ। আল্লাহকে এক ও অদ্বিতীয় সত্তা হিসেবে বিশ্বাস করা, তাঁর গুণাবলী ও ক্ষমতাকে স্বীকার করা, এবং তাঁর নির্দেশাবলী মেনে চলা প্রতিটি মুসলিমের জন্য ঈমানের প্রথম ধাপ। সঠিক আকীদা মানুষকে শিরক ও কুফর থেকে রক্ষা করে এবং আল্লাহর প্রতি আনুগত্য ও ভালোবাসার জন্ম দেয়। তাই প্রতিটি মুসলিমের জন্য ঈমানী জীবনে আকীদাকে রক্ষা করা অত্যাবশ্যক। সঠিক আকীদা-বিশ্বাস ফরজ ইবাদাতের চেয়েও বড়। কেননা ইবাদতসমূহ সহীহ হওয়ার জন্য আকীদা বিশুদ্ধ হওয়া পূর্বশর্ত। ইসলামী আকীদা বিষয়ে আরও বিস্তারিত জানতে আমাদের গ্রন্থাগারে বিভিন্ন ফিকহী গ্রন্থ রয়েছে, যা শিক্ষার্থীরা অধ্যয়ন করতে পারে। এছাড়াও, আমাদের শিক্ষকগণ নিয়মিত আকীদাা বিষয়ক আলোচনা ও সেমিনারের আয়োজন করেন।` },

        { name: 'পবিত্রতা', icon: DropletsIcon, content: `পবিত্রতা সম্পর্কিত বিভিন্ন মাসআলা, যেমন - ওযু, গোসল, তায়াম্মুম, নাপাকি থেকে পবিত্রতা ইত্যাদি বিষয়ে ফাতওয়া। আপনার প্রশ্ন থাকলে যোগাযোগ ফর্মে জিজ্ঞাসা করতে পারেন।

        পবিত্রতা ইসলামের একটি গুরুত্বপূর্ণ অংশ। এটি শারীরিক ও আত্মিক উভয় প্রকার পবিত্রতাকে বোঝায়। ওযু এবং গোসল হলো শারীরিক পবিত্রতার প্রধান উপায়, যা নামাজ ও কুরআন তেলাওয়াতের আগে আবশ্যক। তায়াম্মুম হলো পানির অভাবে বা অসুস্থতার কারণে ও অসুস্থতার কারণে ওযু বা গোসলের বিকল্প। নাপাকি থেকে পবিত্রতা অর্জন করাও মুসলিমদের জন্য অপরিহার্য, যা বিভিন্ন ধরনের অপবিত্রতা থেকে নিজেকে মুক্ত করাকে বোঝায়।

        পবিত্রতার গুরুত্ব অপরিসীম। রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম বলেছেন, "পবিত্রতা ঈমানের অর্ধেক।" তাই প্রতিটি মুসলিমের জন্য দৈনন্দিন জীবনে পবিত্রতা বজায় রাখা অত্যাবশ্যক। আমরা শিক্ষার্থীদেরকে পবিত্রতার সকল মাসআলা বিস্তারিতভাবে শিক্ষা দেই, যাতে তারা শরীআতের বিধান অনুযায়ী জীবনযাপন করতে পারে।
        
        পবিত্রতার বিষয়ে আরও বিস্তারিত জানতে আমাদের গ্রন্থাগারে বিভিন্ন ফিকহী গ্রন্থ রয়েছে, যা শিক্ষার্থীরা অধ্যয়ন করতে পারে। এছাড়াও, আমাদের শিক্ষকগণ নিয়মিত পবিত্রতা বিষয়ক আলোচনা ও সেমিনারের আয়োজন করেন।` },
        { name: 'নামাজ', icon: BookOpenText, content: `নামাজ, জামাআত, জুমআ, ঈদের নামাজ, তারাবীহ, তাহাজ্জুদ ও অন্যান্য নফল নামাজ সম্পর্কিত ফাতওয়া। নামাজের শর্তাবলী, আরকান ও ওয়াজিবাত নিয়ে আলোচনা।

        নামাজ ইসলামের দ্বিতীয় স্তম্ভ এবং মুসলিমদের জন্য ফরয ইবাদত। এটি দিনে পাঁচবার নির্দিষ্ট সময়ে আদায় করতে হয়। জামাতে নামাজ আদায় করার বিশেষ ফজিলত রয়েছে। জুমআ নামাজ সাপ্তাহিক একটি গুরুত্বপূর্ণ ইবাদত, যা পুরুষদের জন্য ফরয। এছাড়া, ঈদুল ফিতর ও ঈদুল আযহার নামাজ মুসলিমদের জন্য বিশেষ আনন্দের দিন। তারাবীহ এবং তাহাজ্জুদ হলো নফল নামাজ, যা অতিরিক্ত সওয়াব অর্জনে সাহায্য করে। নামাজের সঠিক নিয়ম, শর্তাবলী, আরকান এবং ওয়াজিবাত সম্পর্কে জানতে আমাদের ফাতওয়া বিভাগে জিজ্ঞাসা করতে পারেন।

        নামাজ মুসলিমদের জন্য আল্লাহর সাথে যোগাযোগের একটি মাধ্যম। এটি আত্মিক শান্তি ও শৃঙ্খলা নিয়ে আসে। আমরা শিক্ষার্থীদেরকে নামাজের গুরুত্ব, ফজিলত এবং সঠিক পদ্ধতি সম্পর্কে শিক্ষা দেই। আমাদের জামিয়ায় নিয়মিত জামাআতে নামাজ আদায় করা হয় এবং শিক্ষার্থীদেরকে এতে অংশগ্রহণ করতে উৎসাহিত করা হয়।
        
        নামাজের সময়সূচী এবং জামাতের সময় সম্পর্কে জানতে আমাদের নোটিশ বোর্ড অনুসরণ করুন। এছাড়াও, নামাজের বিভিন্ন মাসআলা নিয়ে আমাদের ইফতা বিভাগের শিক্ষকগণ নিয়মিত ক্লাস নেন।` },
        { name: 'রোজা', icon: Moon, content: `রোজা, তারাবীহ, ইতিকাফ, ফিতরা ও কাফফারা সম্পর্কিত ফাতওয়া। রোজার সময় কি কি করা যাবে আর কি কি করা যাবে না তা নিয়ে বিস্তারিত আলোচনা।

        রোজা ইসলামের তৃতীয় স্তম্ভ, যা রমজান মাসে ফরয করা হয়েছে। রোজার মাধ্যমে মুসলিমরা আল্লাহ তাআলার নৈকট্য লাভ করে এবং আত্মশুদ্ধি অর্জন করে। তারাবীহ নামাজ রমজান মাসের বিশেষ ইবাদাত। ইতিকাফ হলো রমজানের শেষ দশকে মসজিদে অবস্থান করা। সাদাকাতুল ফিতর হলো ঈদুল ফিতরের আগে দরিদ্রদের মধ্যে বিতরণ করার জন্য একটি নির্দিষ্ট পরিমাণ খাদ্য বা অর্থ। কাফফারা হলো কোনো ভুল বা পাপের প্রায়শ্চিত্তস্বরূপ নির্দিষ্ট কিছু কাজ করা। রোজার সময় কি কি করা জায়েজ এবং কি কি করা নাজায়েজ, সে সম্পর্কে বিস্তারিত জানতে আমাদের ফাতওয়া বিভাগে যোগাযোগ করুন।

        রোজা শুধু পানাহার থেকে বিরত থাকার নাম নয়, বরং এটি আত্মনিয়ন্ত্রণ এবং আল্লাহর প্রতি আনুগত্যের প্রতীক। আমরা শিক্ষার্থীদেরকে রোজার সকল মাসআলা এবং এর আধ্যাত্মিক গুরুত্ব সম্পর্কে শিক্ষা দেই। রমজান মাসে আমাদের জামিয়ায় বিশেষ তারাবীহ ও ইফতার মাহফিলের আয়োজন করা হয়।` },
        { name: 'হজ্ব', icon: Landmark, content: `হজ্ব ও উমরাহ-এর আহকাম, ফরয, ওয়াজিব, সুন্নাত এবং হজ্বের বিভিন্ন ধাপ সম্পর্কিত ফাতওয়া।

        হজ্ব ইসলামের পঞ্চম স্তম্ভ এবং সামর্থ্যবান মুসলিমদের জন্য জীবনে একবার ফরয। এটি একটি পবিত্র ইবাদত যা মক্কার কাবা শরীফ ও তার আশেপাশের নির্দিষ্ট স্থানে নির্দিষ্ট সময়ে আদায় করতে হয়। হজ্ব মুসলিম উম্মাহর ঐক্যের প্রতীক। এটি মুসলিমদেরকে বিশ্বব্যাপী ভ্রাতৃত্বের বন্ধনে আবদ্ধ করে। উমরাহ হলো একটি ছোট হজ্ব, যা বছরের যেকোনো সময় আদায় করা যায়।

         আমরা শিক্ষার্থীদেরকে হজ্ব ও উমরাহর গুরুত্ব এবং এর সঠিক পদ্ধতি সম্পর্কে শিক্ষা দেই, যাতে তারা জীবনে একবার হলেও এই মহৎ ইবাদতটি সঠিকভাবে আদায় করতে পারে।` },
        { name: 'যাকাত', icon: PiggyBank, content: `যাকাত ইসলামের একটি গুরুত্বপূর্ণ অর্থনৈতিক স্তম্ভ, যা ধনীদের সম্পদের একটি নির্দিষ্ট অংশ দরিদ্রদের মধ্যে বিতরণ করাকে বোঝায়। এটি ফরয ইবাদত এবং এর মাধ্যমে সমাজে অর্থনৈতিক ভারসাম্য বজায় থাকে। সদকা হলো স্বেচ্ছামূলক দান, যা যেকোনো সময় করা যায়। উশর হলো কৃষিজাত পণ্যের উপর ধার্যকৃত যাকাত। ফিতরা হলো ঈদুল ফিতরের আগে দরিদ্রদের মধ্যে বিতরণ করার জন্য একটি বিশেষ দান। কাফফারা হলো কোনো ভুল বা পাপের প্রায়শ্চিত্তস্বরূপ নির্দিষ্ট কিছু দান করা। যাকাত, সদকা, উশর, কাফ্ফারা ও অন্যান্য দান সম্পর্কিত ফাতওয়া, যাকাতের নিসাব (সর্বনিম্ন পরিমাণ), বন্টন এবং আদায় পদ্ধতি সম্পর্কে এখানে আলোচনা করা হবে।
        যাকাত সমাজের দরিদ্রদের অধিকার নিশ্চিত করে এবং সম্পদের সুষম বন্টনে সহায়তা করে। আমরা শিক্ষার্থীদেরকে যাকাতের গুরুত্ব এবং এর সঠিক হিসাব ও বন্টন পদ্ধতি সম্পর্কে শিক্ষা দেই, যাতে তারা এই ইবাদতটি সঠিকভাবে আদায় করতে পারে।
        
        আপনার যাকাত সংক্রান্ত যেকোনো জটিল মাসআলা থাকলে আমাদের ইফতা বিভাগের সাথে যোগাযোগ করুন। আমরা আপনাকে সঠিক দিকনির্দেশনা প্রদান করব।` },
        { name: 'জিহাদ', icon: Swords, content: `জিহাদ, কিতাল, শাহাদাত ও ইসলামী রাষ্ট্রের নিরাপত্তা সম্পর্কিত ফাতওয়া। বর্তমান প্রেক্ষাপটে জিহাদের সঠিক ব্যাখ্যা।

        জিহাদ ইসলামের একটি ব্যাপক ধারণা, যা আল্লাহ তাআলার পথে সর্বাত্মক প্রচেষ্টা করাকে বোঝায়। এর মধ্যে আত্মিক জিহাদ, জ্ঞান অর্জনের জিহাদ, এবং প্রয়োজনে কিতাল (যুদ্ধ) অন্তর্ভুক্ত। শাহাদাত হলো আল্লাহ তাআলার পথে জীবন উৎসর্গ করা।

        জিহাদকে প্রায়শই ভুলভাবে ব্যাখ্যা করা হয়। আমরা শিক্ষার্থীদেরকে জিহাদের সঠিক অর্থ এবং এর বিভিন্ন প্রকার সম্পর্কে শিক্ষা দেই, যাতে তারা ইসলামের এই গুরুত্বপূর্ণ বিধানকে সঠিকভাবে বুঝতে পারে এবং এর অপব্যবহার থেকে বিরত থাকে।
        
        ইসলামে জিহাদের সঠিক উদ্দেশ্য ও লক্ষ্য সম্পর্কে জানতে আমাদের মাদরাসার শিক্ষকগণ নিয়মিত আলোচনা করে থাকেন।` },
        { name: 'চিকিৎসা', icon: Syringe, content: `চিকিৎসা, ঔষধ, অসুস্থতা ও স্বাস্থ্যবিধি সম্পর্কিত ফাতওয়া। ইসলামী দৃষ্টিকোণ থেকে চিকিৎসা গ্রহণ ও এর বিধান।

        ইসলাম স্বাস্থ্য ও সুস্থতার উপর বিশেষ গুরুত্ব দেয়। অসুস্থ হলে চিকিৎসা গ্রহণ করা সুন্নাত। ঔষধ ব্যবহার করা এবং স্বাস্থ্যবিধি মেনে চলা মুসলিমদের জন্য দরকারি। ইসলামী দৃষ্টিকোণ থেকে কোন ধরনের চিকিৎসা জায়েজ এবং কোন ধরনের চিকিৎসা নাজায়েজ, সে সম্পর্কে এখানে মাসআলা থাকবে।

        আমরা শিক্ষার্থীদেরকে স্বাস্থ্য সচেতনতা এবং পরিচ্ছন্নতার গুরুত্ব সম্পর্কে শিক্ষা দেই। এটি শুধু শারীরিক সুস্থতার জন্য নয়, বরং দ্বীনি জীবনের জন্যও অপরিহার্য।
        
        চিকিৎসা সংক্রান্ত যেকোনো ফিকহী মাসআলা যেমন, হালাল ঔষধ, রক্তদান, অঙ্গ প্রতিস্থাপন ইত্যাদি বিষয়ে আমাদের জ্ঞান থাকা আবশ্যক` },
        { name: 'ব্যবসা-বাণিজ্য', icon: TrendingUp, content: `হালাল-হারাম ব্যবসা, সুদের বিধান, ইসলামী ব্যাংকিং, চুক্তি ও লেনদেন সম্পর্কিত ফাতওয়া। আধুনিক ব্যবসার ইসলামী সমাধান।

        ইসলামে হালাল ব্যবসা-বাণিজ্যকে উৎসাহিত করা হয়েছে। তবে, সুদ (রিবা) কঠোরভাবে নিষিদ্ধ। ইসলামী ব্যাংকিং হলো সুদমুক্ত আর্থিক লেনদেনের একটি বিকল্প। ব্যবসা-বাণিজ্যের ক্ষেত্রে চুক্তি ও লেনদেনের ইসলামী বিধান সম্পর্কে বিস্তারিত আলোচনা এখানে থাকবে। আধুনিক ব্যবসার বিভিন্ন সমস্যার ইসলামী সমাধান সম্পর্কেও আপনি জানতে পারবেন।

        আমরা শিক্ষার্থীদেরকে ইসলামী অর্থনীতির মৌলিক নীতিগুলি সম্পর্কে শিক্ষা দেই, যাতে তারা হালাল উপায়ে জীবিকা অর্জন করতে পারে এবং সমাজে অর্থনৈতিক ন্যায়বিচার প্রতিষ্ঠা করতে পারে।
        
        আধুনিক ব্যবসা-বাণিজ্যের ক্ষেত্রে উদ্ভূত নতুন ফিকহী মাসআলা নিয়ে আমাদের ইফতা বিভাগ গবেষণা করে এবং সমাধান প্রদান করে।` },
        { name: 'বিবাহ ও তালাক', icon: Handshake, content: `বিবাহ ও তালাক ইসলামের গুরুত্বপূর্ণ সামাজিক ও পারিবারিক বিধান। এই বিষয়ে সঠিক জ্ঞান অর্জন করা প্রতিটি মুসলিমের জন্য বিবাহ বন্ধনে আবদ্ধ হওয়ার পূর্বে অপরিহার্য। কুরআন ও সুন্নাহর আলোকে এই বিষয়গুলো বোঝা এবং মেনে চলা পারিবারিক শান্তি ও স্থিতিশীলতা নিশ্চিত করে। 
          
          বিবাহ হলো, নারী ও পুরুষের মধ্যে শরীয়তসম্মত বন্ধন, যা পরিবার ও সমাজের ভিত্তি স্থাপন করে। ইসলামে বিবাহকে একটি পবিত্র চুক্তি এবং ইবাদত হিসেবে গণ্য করা হয়। এর মাধ্যমে বংশবৃদ্ধি, মানসিক শান্তি এবং পারস্পরিক সহযোগিতা নিশ্চিত হয়। বিবাহের পূর্বে পাত্র-পাত্রীর যোগ্যতা, অভিভাবকের সম্মতি, দেনমোহর নির্ধারণ এবং সাক্ষীর উপস্থিতি নিশ্চিত করা জরুরি। বিবাহের উদ্দেশ্য হলো একটি সুখী ও শান্তিপূর্ণ পরিবার গঠন করা এবং সামাজিক দায়িত্ব পালন করা। 
          
          তালাক হলো, বিবাহ বিচ্ছেদের একটি শরীয়তসম্মত প্রক্রিয়া, যা শুধুমাত্র চূড়ান্ত প্রয়োজনে নিরুপায় হয়ে নির্দিষ্ট নিয়মাবলী অনুসরণ করে করা যায়। ইসলামে তালাক অপছন্দনীয় হলেও, কিছু পরিস্থিতিতে এটি জায়েজ করা হয়েছে যখন স্বামী-স্ত্রীর মধ্যে পারস্পারিক সম্পর্ক টিকিয়ে রাখা একেবারেই অসম্ভব হয়ে পড়ে। তালাকের ক্ষেত্রে শরীয়তের বিধি-নিষেধ মেনে চলা অত্যন্ত গুরুত্বপূর্ণ, যাতে উভয় পক্ষের অধিকার সুরক্ষিত থাকে এবং কারো প্রতি কোনো অবিচার না হয়। তালাকের বিভিন্ন প্রকারভেদ রয়েছে এবং প্রতিটি প্রকারের জন্য নির্দিষ্ট নিয়ম ও সময়সীমা রয়েছে। 
          
          বিবাহ ও তালাক সংক্রান্ত আপনার মাসআলাটি এখানে খোঁজ করুন অথবা আপনার ব্যক্তিগত জিজ্ঞাসার সমাধানের জন্য আমাদের দারুল ইফতার অভিজ্ঞ আলেম ও মুফতিদের সাথে যোগাযোগ করতে পারেন। তারা আপনাকে কুরআন ও সুন্নাহর আলোকে সঠিক দিকনির্দেশনা প্রদান করবেন।` },
    ];

    const getFatwaAnswer = async () => {
        if (!fatwaQuestion.trim()) {
            setError('অনুগ্রহ করে আপনার প্রশ্ন লিখুন।');
            return;
        }

        setIsLoading(true);
        setError('');

        const currentCategory = fatwaCategories.find(cat => cat.name === activeTab);
        const categoryInfo = currentCategory ? `বর্তমান ফাতওয়া ক্যাটাগরি "${currentCategory.name}"। এই ক্যাটাগরি সম্পর্কে সাধারণ তথ্য: "${currentCategory.content}"` : '';

        // Add user's question to chat history
        setChatHistory(prev => [...prev, { role: 'user', text: fatwaQuestion }]);

        // Construct the prompt with chat history for context
        const conversationContext = chatHistory.map(msg => `${msg.role === 'user' ? 'ব্যবহারকারী' : 'আলেম'}: ${msg.text}`).join('\n');
        const prompt = `আপনি একজন জ্ঞানী ইসলামী আলেম হিসেবে কাজ করছেন। আপনার কাজ হল ব্যবহারকারীর ইসলামী প্রশ্নগুলোর উত্তর দেওয়া। ${categoryInfo}

        পূর্ববর্তী কথোপকথন:
        ${conversationContext}
        ব্যবহারকারীর বর্তমান প্রশ্ন: "${fatwaQuestion}"

        এই তথ্যের ভিত্তিতে, ব্যবহারকারীর বর্তমান প্রশ্নের একটি সংক্ষিপ্ত এবং নির্ভুল ইসলামী উত্তর প্রদান করুন। যদি প্রশ্নটি প্রদত্ত ক্যাটাগরি বা সাধারণ ইসলামী জ্ঞানের আওতার বাইরে হয়, তবে স্পষ্টভাবে বলুন যে আপনি শুধুমাত্র ইসলামী প্রশ্নের উত্তর দিতে পারবেন। উত্তরটি বাংলাতে হতে হবে।`;

        try {
            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setChatHistory(prev => [...prev, { role: 'ai', text: text }]);
            } else {
                setError('দুঃখিত, আপনার প্রশ্নের উত্তর দিতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন।');
                console.error('Gemini API response structure unexpected:', result);
            }
        } catch (err) {
            setError('ফাতওয়া পেতে সমস্যা হয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন বা পরে আবার চেষ্টা করুন।');
            console.error('Error fetching fatwa:', err);
        } finally {
            setIsLoading(false);
            setFatwaQuestion(''); // Clear the input field after sending
        }
    };

    const handleClearChat = () => {
        setChatHistory([]);
        setFatwaQuestion('');
        setError('');
    };

        return (
        <HelmetProvider>
            <Helmet>
                <title>ফাতওয়া - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া</title>
                <meta name="description" content="জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়ার ফাতওয়া বিভাগ। ইসলামী আইন ও বিধান সম্পর্কে প্রশ্ন জিজ্ঞাসা করুন এবং উত্তর পান।" />
            </Helmet>
        <div className="p-6 md:p-10 bg-white rounded-2xl shadow-xl animate-fade-in">
            <h1 className="text-4xl font-extrabold text-indigo-900 mb-10 text-center">ফাতওয়া</h1>

            <div className="mt-4 mb-8 p-4 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl shadow-md border border-indigo-200 text-center">
                <h3 className="text-2xl font-bold text-indigo-800 mb-2">ফাতওয়া বিভাগের গুরুত্ব</h3>
                <p className="text-gray-700 leading-relaxed text-lg text-justify">
                    ফাতওয়া বিভাগ মুসলিম উম্মাহর জন্য অত্যন্ত গুরুত্বপূর্ণ, কারণ এটি দৈনন্দিন জীবনের শরীআহ সম্পর্কিত প্রশ্নগুলোর সঠিক উত্তর প্রদান করে। আমাদের ইফতা বিভাগের অভিজ্ঞ মুফতিগণ কুরআন ও সুন্নাহর আলোকে গভীর গবেষণা ও বিশ্লেষণের মাধ্যমে ফাতওয়া প্রদান করেন। আধুনিক যুগে উদ্ভূত নতুন নতুন সমস্যার ইসলামী সমাধান প্রদানেও এই বিভাগ সক্রিয় ভূমিকা পালন করে। আমরা এ কথা নিশ্চিত করার সর্বাত্মক চেষ্টা করি যে, প্রতিটি ফাতওয়া যেন নির্ভুল, নির্ভরযোগ্য এবং ইসলামী শরীআতের মূলনীতি অনুযায়ী হয়।
                </p>
            </div>

            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fatwaCategories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => {
                            setActiveTab(category.name);
                            setChatHistory([]); // Clear chat history when category changes
                            setFatwaQuestion('');
                            setError('');
                        }}
                        className={`
                            flex items-center justify-between p-4 rounded-xl shadow-md border
                            ${activeTab === category.name
                                ? 'bg-green-100 border-green-500 text-green-800'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                            }
                            transition-all duration-300 transform hover:-translate-y-1
                        `}
                    >
                        <span className="flex items-center text-lg md:text-xl font-medium">
                            <category.icon className={`mr-3 ${activeTab === category.name ? 'text-green-600' : 'text-gray-500'}`} size={24} />
                            {category.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Fatwa Content Section */}
            <div ref={fatwaContentSectionRef} className="p-8 bg-gray-50 rounded-b-xl rounded-tr-xl shadow-inner border border-gray-100 animate-fade-in-up">
                {fatwaCategories.map((category) => (
                    activeTab === category.name && (
                        <div key={category.name}>
                            <h2 className="text-3xl font-bold text-indigo-800 mb-5 flex items-center">
                                <category.icon className="mr-3 text-indigo-600" size={32} /> {category.name}
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line text-justify">{category.content}</p>
                            <p className="text-sm text-gray-600 mt-5 text-justify">
                                আপনার কাঙ্ক্ষিত মাসআলাটি এখানে খোঁজ করুন অথবা বিস্তারিত ফাতওয়ার জন্য অনুগ্রহ করে জামিয়ার ইফতা বিভাগে যোগাযোগ করুন কিংবা যোগাযোগ ফর্মে আপনার প্রশ্ন জমা দিন।
                            </p>
                        </div>
                    )
                ))}
            </div>

            {/* New "Ask a Fatwa" Section with Chat History */}
            <div className="mt-12 p-8 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl shadow-xl border border-purple-200 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-purple-800 mb-6 flex items-center justify-center">
                    ফাতওয়া জিজ্ঞাসা করুন ✨
                </h2>
                {/* Removed the chat history display box */}
                {/* <div className="flex flex-col h-96 bg-white rounded-lg shadow-inner border border-gray-200 p-4 mb-4 overflow-y-auto" ref={chatContainerRef}>
                    {chatHistory.length === 0 ? (
                        null
                    ) : (
                        chatHistory.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                                <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                    <p className="text-sm font-semibold mb-1">{msg.role === 'user' ? 'আপনি' : 'আলেম'}</p>
                                    <p className="text-base whitespace-pre-line">{msg.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div> */}

                <div className="space-y-4">
                    <div>
                        <textarea
                            value={fatwaQuestion}
                            onChange={(e) => setFatwaQuestion(e.target.value)}
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 outline-none resize-y text-lg"
                            placeholder="আপনার প্রশ্ন লিখুন..."
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    getFatwaAnswer();
                                }
                            }}
                        ></textarea>
                    </div>
                    <div className="flex justify-between gap-4">
                        <button
                            onClick={getFatwaAnswer}
                            disabled={isLoading || !fatwaQuestion.trim()}
                            className="flex-grow bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    পাঠানো হচ্ছে...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2" size={20} /> প্রশ্ন পাঠান
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleClearChat}
                            className="bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                        >
                            <RotateCcw className="mr-2" size={20} /> চ্যাট রিসেট করুন
                        </button>
                    </div>
                    {error && (
                        <p className="mt-4 text-center text-red-600 text-lg">{error}</p>
                        )}
                    </div>
                </div>
            </div>
        </HelmetProvider>
    );
};


// Contact Us Page Component
const ContactUsPage = ({ madrasaInfo }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormStatus('আপনার বার্তা পাঠানো হচ্ছে...');
        // Add form submission logic here (e.g., an API call)
        console.log('Form submitted:', formData);
        setTimeout(() => {
            setFormStatus('আপনার বার্তা সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।');
            setFormData({ name: '', email: '', message: '' });
        }, 2000); // Simulated API call
    };

    // To split the email address into two lines
    const emailParts = madrasaInfo.email.split('@');
    const emailDisplay = (
        <>
            {emailParts[0]}<br className="md:hidden" />@{emailParts[1]}
        </>
    );

    return (
        <HelmetProvider>
            <Helmet>
                <title>যোগাযোগ - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া</title>
                <meta name="description" content="জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়ার সাথে যোগাযোগ করুন। ঠিকানা, ফোন নম্বর, ইমেইল ও গুগল ম্যাপ।" />
            </Helmet>

        <div className="p-6 md:p-10 bg-white rounded-2xl shadow-xl animate-fade-in">
            <h1 className="text-4xl font-extrabold text-indigo-900 mb-10 text-center">যোগাযোগ</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl shadow-md border border-blue-200 animate-slide-in-left">
                    <h2 className="text-3xl font-bold text-blue-800 mb-5 flex items-center">
                        <MapPin className="mr-3 text-blue-600" size={32} /> ঠিকানা
                    </h2>
                    <p className="text-gray-700 mb-3 text-lg text-justify">{madrasaInfo.address}</p>
                    <p className="text-gray-700 flex items-center mb-3 text-lg text-justify">
                        <Phone className="mr-3 text-blue-500" size={24} /> মোবাইল: <a href={`tel:${madrasaInfo.mobile}`}className="font-semibold ml-1 text-blue-600 hover:underline">{madrasaInfo.mobile}</a>
                    </p>
                    <p className="text-gray-700 flex items-center text-lg mb-4 text-justify">
                        <Mail className="mr-3 text-blue-500" size={24} /> ইমেইল: <a
href={`mailto:${emailDisplay}`} className="font-semibold ml-1 break-words text-blue-600 hover:underline">{emailDisplay} </a>
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg text-justify">
                        আমাদের জামিয়া ব্রাহ্মণবাড়িয়া শহরের প্রাণকেন্দ্রে অবস্থিত, যা সকলের জন্য সহজে প্রবেশযোগ্য। আপনি যেকোনো সময় আমাদের অফিসে এসে বিস্তারিত তথ্য জানতে পারেন।
                    </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-teal-100 p-8 rounded-xl shadow-md border border-green-200 animate-slide-in-right">
                    <h2 className="text-3xl font-bold text-green-800 mb-5 flex items-center">
                        <MapPin className="mr-3 text-green-600" size={32} /> গুগল ম্যাপ
                    </h2>
                    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-md mb-2">
                        {/* Google Maps Embed Code */}
                        <iframe
                            className="w-full h-full border-0"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.2064314814794!2d91.1071255!3d23.9580872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375405ad9da768c9%3A0x5f544451dab27dbe!2z4KaG4Ka_4KaV4Ka-4Kah4Ka-IOCmqOCnjeCmlOCmvuCmv-CmtuCmsOCnjeCmvuCmsA!5e0!3m2!1sen!2sbd!4v1721906600851!5m2!1sen!2sbd"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Madrasa Location"
                        ></iframe>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg text-justify">
                        উপরে দেওয়া গুগল ম্যাপে আমাদের জামিয়ার সঠিক অবস্থান দেখতে পাবেন। এটি আপনাকে আমাদের কাছে পৌঁছাতে সাহায্য করবে।
                    </p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-xl shadow-md border border-purple-200 animate-fade-in">
                <h2 className="text-3xl font-bold text-purple-800 mb-5 flex items-center">
                    <Mail className="mr-3 text-purple-600" size={32} /> যোগাযোগ ফর্ম
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-lg font-medium mb-2">আপনার নাম:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-lg font-medium mb-2">আপনার ইমেইল:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-gray-700 text-lg font-medium mb-2">আপনার বার্তা:</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="6"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y text-lg"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        বার্তা পাঠান
                    </button>
                    {formStatus && (
                        <p className="mt-4 text-center text-lg text-gray-600">{formStatus}</p>
                    )}
                </form>
                <p className="text-gray-700 leading-relaxed text-lg mt-4 text-justify">
                    আপনার যেকোনো প্রশ্ন, মতামত বা পরামর্শ থাকলে আমাদের যোগাযোগ ফর্ম ব্যবহার করে আমাদের জানান। আমরা আপনার বার্তার দ্রুত উত্তর দেওয়ার চেষ্টা করব।
                </p>
            </div>
            {/* Additional content to ensure scrolling */}
            <div className="mt-12 p-8 bg-gray-50 rounded-xl shadow-inner">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">আমাদের সাথে যোগাযোগ করুন</h3>
                <p className="text-gray-700 leading-relaxed text-lg mb-4 text-justify">
                    জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া আপনার যেকোনো জিজ্ঞাসার জন্য সর্বদা প্রস্তুত। আপনি আমাদের অফিস চলাকালীন সময়ে সরাসরি জামিয়ায় এসে যোগাযোগ করতে পারেন অথবা উপরে উল্লিখিত মোবাইল নম্বর এবং ইমেইল ব্যবহার করে আমাদের সাথে যোগাযোগ করতে পারেন।
                </p>
                <p className="text-gray-700 leading-relaxed text-lg text-justify">
                    আমরা আপনার মূল্যবান মতামত এবং পরামর্শকে স্বাগত জানাই, যা আমাদের জামিয়ার উন্নতিতে সহায়ক হবে। আমাদের লক্ষ্য হলো সকলের জন্য একটি উন্মুক্ত এবং বন্ধুত্বপূর্ণ পরিবেশ নিশ্চিত করা।
                    </p>
                </div>
            </div>
        </HelmetProvider>
    );
};

// Navigation link data
const navLinks = [
    { name: 'হোম', component: HomePage, icon: Home, path: '/', title: 'হোম - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া' },
    { name: 'আমাদের সম্পর্কে', component: AboutUsPage, icon: Info, path: '/about-us', title: 'আমাদের সম্পর্কে - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া' },
    { name: 'শিক্ষাগত তথ্য', component: AcademicInfoPage, icon: Book, path: '/academic-info', title: 'শিক্ষাগত তথ্য - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া' },
    { name: 'ভর্তি ও রেজাল্ট', component: AdmissionResultPage, icon: ScrollTextIcon, path: '/admission-result', title: 'ভর্তি ও রেজাল্ট - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া' },
    { name: 'হোস্টেল', component: HostelInfoPage, icon: Building2, path: '/hostel-info', title: 'হোস্টেল - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া' },
    { name: 'নোটিশ বোর্ড', component: NoticeBoardPage, icon: BellRing, path: '/notice-board', title: 'নোটিশ বোর্ড - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া' },
    { name: 'অনুদান', component: DonationPage, icon: Wallet, path: '/donation', title: 'অনুদান - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া' },
    { name: 'ফাতওয়া', component: FatwaPage, icon: BookCheck, path: '/fatwa', title: 'ফাতওয়া - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া' },
    { name: 'গ্যালারি', component: GalleryPage, icon: Image, path: '/gallery', title: 'গ্যালারি - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া' },
    { name: 'যোগাযোগ', component: ContactUsPage, icon: Phone, path: '/contact-us', title: 'যোগাযোগ - জামিয়া কাসেমিয়া ব্রাহ্মণবাড়িয়া' },
];

// Helper components for AdmissionResultPage to navigate
const AdmissionsRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdmissionResultPage />} />
            <Route path="admission-form" element={<AdmissionFormPage />} />
            <Route path="result-search" element={<ResultSearchPage />} />
        </Routes>
    );
};


// App Component
function App() {
  const [currentPage, setCurrentPage] = useState("/");
  const [userId, setUserId] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const navRef = useRef(null);
  const navigate = useNavigate();

  // Firebase init + auth
  useEffect(() => {
    let unsubscribeAuth = () => {};
    const initFirebase = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const firestore = getFirestore(app);
        const firebaseAuth = getAuth(app);
        setDb(firestore);
        setAuth(firebaseAuth);

        try {
          if (initialAuthToken) {
            await signInWithCustomToken(firebaseAuth, initialAuthToken);
          } else {
            await signInAnonymously(firebaseAuth);
          }
        } catch {
          await signInAnonymously(firebaseAuth);
        }

        unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
          setUserId(user ? user.uid : crypto.randomUUID());
          setIsAuthReady(true);
        });
      } catch (error) {
        console.error(error);
        setIsAuthReady(true);
      }
    };
    initFirebase();
    return () => unsubscribeAuth();
  }, []);

  // Header height for scroll
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (navRef.current) setHeaderHeight(navRef.current.offsetHeight);
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Scroll when page changes
  useEffect(() => {
    if (currentPage === "/") window.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: headerHeight, behavior: "smooth" });
  }, [currentPage, headerHeight]);

  // Update page title
  useEffect(() => {
    const current = navLinks.find((link) => link.path === currentPage);
    if (current) document.title = current.title;
  }, [currentPage]);

  const handleNavClick = (path) => {
    setCurrentPage(path);
    navigate(path);
    setIsNavOpen(false);
  };

  if (!isAuthReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <img src={madrasaInfo.logo} alt="Logo" className="h-24 w-24 mb-4" />
        <h1 className="text-2xl font-bold mb-2">{madrasaInfo.name}</h1>
        <p className="text-gray-600 mb-6 text-center px-4">{madrasaInfo.slogan}</p>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

       

// Tiro Bangla, Cairo, and SolaimanLipi fonts imported and applied


    return (
        <HelmetProvider>
        <div className="flex flex-col font-['Tiro Bangla']">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Tiro+Bangla&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Solaiman+Lipi&display=swap');
                
                /* Ensure html and body take full height and allow scrolling */
                html, body {
                    height: 100%;
                    margin: 0;
                }
                body {
                    font-family: 'Tiro Bangla', sans-serif;
                    display: flex; /* Make body a flex container */
                    flex-direction: column; /* Stack children vertically */
                    min-height: 100vh; /* Ensure body takes at least full viewport height */
                    overflow-y: auto; /* Enable scrolling on the body if content overflows */
                }
                /* Custom CSS for underline animation on hover */
                .nav-link-underline {
                    position: relative;
                }
                .nav-link-underline::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -4px;
                    left: 0;
                    background-color: #ffffff; /* White underline */
                    transition: width 0.3s ease-in-out;
                }
                .nav-link-underline:hover::after,
                .nav-link-underline.active::after {
                    width: 100%;
                }

                /* Sidebar specific styles */
                .sidebar-menu {
                    width: 280px; /* Increased width for better readability */
                    background-color: #1a202c; /* Darker background */
                    padding: 1.5rem;
                    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
                    border-radius: 0 15px 15px 0; /* Rounded right corners */
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .sidebar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem; /* Added padding for spacing */
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* Subtle separator */
                }

                .sidebar-link {
                    display: flex;
                    align-items: center;
                    padding: 0.85rem 1.25rem; /* Increased padding for larger touch area */
                    border-radius: 12px; /* Slightly more rounded */
                    font-size: 1.125rem; /* Increased font size */
                    font-weight: 500;
                    color: #e2e8f0; /* Lighter text color */
                    transition: all 0.3s ease-in-out; /* Smoother transition */
                    margin-bottom: 0.65rem; /* Adjusted spacing */
                }

                .sidebar-link:hover {
                    background-color: #2d3748; /* Darker hover background */
                    color: #ffffff;
                    transform: translateX(8px); /* More prominent slide effect */
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Subtle shadow on hover */
                }

                .sidebar-link.active {
                    background-color: #4c51bf; /* Stronger active background (indigo-700 equivalent) */
                    color: #ffffff;
                    font-weight: 700;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* More prominent shadow for active */
                    border-left: 4px solid #6366f1; /* Left border for active state */
                    padding-left: 1.1rem; /* Adjust padding due to border */
                }

                .sidebar-link svg {
                    margin-right: 1rem; /* Increased margin for icon */
                    min-width: 24px; /* Ensure icon doesn't shrink */
                }

                /* Animation for hamburger/close icon */
                .menu-icon-animate {
                    transition: transform 0.3s ease-in-out;
                }
                .menu-icon-animate.open {
                    transform: rotate(90deg);
                }

                /* Custom SVG for bearded man with cap */
                .bearded-man-icon {
                    display: block;
                    width: 100%;
                    height: 100%;
                    background-color: #f0f0f0; /* Light background for the circle */
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .bearded-man-icon svg {
                    width: 60%; /* Adjust size as needed */
                    height: 60%; /* Adjust size as needed */
                    color: #4c51bf; /* Icon color */
                }

                `}
            </style>


            {/* Navigation Bar */}
            <nav ref={navRef} className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white py-5 shadow-xl sticky top-0 z-50">
                <div className="w-full flex flex-col items-center">
                {/* Madrasa Name (Header) - now in Bengali and Tiro Bangla font */}
                   <button
                      onClick={() => handleNavClick('/')}
                      className="font-['Tiro_Bangla'] font-bold
                      text-3xl sm:text-5xl md:text-6xl lg:text-7xl
                      leading-tight px-4 py-2
                      hover:text-indigo-200 transition-colors duration-200
                      sm:whitespace-nowrap flex-shrink">
                      {madrasaInfo.name}
                  </button>




                    {/* Mobile Menu Toggle */}
                    <div className="block lg:hidden ml-auto pr-4">
                        <button onClick={() => setIsNavOpen(!isNavOpen)} className="text-white focus:outline-none p-2 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                            <Menu className={`h-7 w-7 menu-icon-animate ${isNavOpen ? 'open' : ''}`} /> {/* Hamburger icon with animation */}
                        </button>
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <div className="hidden lg:flex lg:items-center lg:w-auto">
                        <ul className="lg:flex items-center flex-wrap justify-center gap-x-6">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <button
                                        onClick={() => handleNavClick(link.path)}
                                        className={`
                                            flex items-center px-4 py-2 rounded-lg text-lg font-medium nav-link-underline
                                            ${currentPage === link.path
                                                ? 'text-white active' // 'active' class for underline
                                                : 'text-indigo-100 hover:text-white'
                                            }
                                            transition-all duration-300
                                        `}
                                    >
                                        <link.icon className="mr-2" size={20} />
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Menu and Overlay */}
            {isNavOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsNavOpen(false)}></div>
            )}
            <div className={`fixed top-0 left-0 h-full sidebar-menu z-50 transform transition-transform duration-300 ease-in-out lg:hidden
                ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}> {/* Changed from right to left, and -translate-x-full for hidden */}
                <div className="sidebar-header">
  <span className="text-3xl font-extrabold text-white font-['Tiro_Bangla'] flex items-center">
    <img
      src= {madrasaInfo.logo}
      alt="Madrasa Logo"
      className="h-10 w-10 mr-3 rounded-full"
      onError={(e) => {e.target.onerror = null;e.target.src = "Jamia-qasimia-logo.jpg";
      }}
    />
    জামিয়া
  </span>
  <button
    onClick={() => setIsNavOpen(false)}
    className="text-white focus:outline-none p-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
  >
    <X className="h-7 w-7 menu-icon-animate" />
  </button>
</div>

                <ul className="flex flex-col flex-grow">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <button
                                onClick={() => { handleNavClick(link.path); setIsNavOpen(false); }}
                                className={`sidebar-link ${currentPage === link.path ? 'active' : ''}`}
                            >
                                <link.icon size={24} />
                                {link.name}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="mt-auto pt-4 text-center text-gray-400 text-sm">
                    {/* Optional footer content for sidebar */}
                    <p>&copy; {new Date().getFullYear()} জামিয়া কাসেমিয়া</p>
                </div>
            </div>

         {/* Routes */}
      <main className="flex-grow container mx-auto p-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage madrasaInfo={madrasaInfo} />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/academic-info" element={<AcademicInfoPage />} />
          <Route path="/admission-result/*" element={<AdmissionsRoutes/>} />
          <Route path="/hostel-info" element={<HostelInfoPage />} />
          <Route path="/notice-board" element={<NoticeBoardPage />} />
          <Route path="/donation" element={<DonationPage />} />
          <Route path="/fatwa" element={<FatwaPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact-us" element={<ContactUsPage madrasaInfo={madrasaInfo} />} /> 
        </Routes>
      </main>
            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 p-8 text-center shadow-inner mt-auto">
                <div className="container mx-auto">
                    <p className="mb-3 text-lg">
                        &copy; {new Date().getFullYear()} {madrasaInfo.name}। সর্বস্বত্ব সংরক্ষিত।
                    </p>
                    {/* Developed by A. Hussain with call link */}
                    <p className="text-sm mt-2">
                        Developed by <a href="https://wa.me/8801735260227?text=আসসালামু%20আলাইকুম%20ওয়া%20রাহমাতুল্লাহ।%20আমি%20আপনার%20সাইট%20থেকে%20যোগাযোগ%20করছি।" className="text-blue-400 hover:underline">A. Hussain</a> 
                    </p>
                </div>
            </footer>
        </div>
        </HelmetProvider>
    );
}

export default App;
