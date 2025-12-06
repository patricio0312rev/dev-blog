import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar, Footer } from "@/components/layout";
import { HomePage, BlogListPage, ContentCalendarPage } from "@/pages";

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 antialiased transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/calendar" element={<ContentCalendarPage />} />
          {/* TODO: Add article detail route */}
          {/* <Route path="/blog/:slug" element={<ArticleDetailPage />} /> */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
};
