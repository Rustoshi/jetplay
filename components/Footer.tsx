export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm">
              © Copyright 2025 . All rights reserved.
            </p>
          </div>

          {/* Policy Links */}
          <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6 text-sm">
            <a 
              href="#" 
              className="hover:text-primary-foreground/80 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="hover:text-primary-foreground/80 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="hover:text-primary-foreground/80 transition-colors duration-200"
            >
              Terms of Condition
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
