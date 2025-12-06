import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { HomePage } from "./HomePage";
import { BlogListPage } from "./BlogListPage";
import { ContentCalendarPage } from "./ContentCalendarPage";
// later: import ArticleDetailPage for /blog/:slug

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 antialiased transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/calendar" element={<ContentCalendarPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
