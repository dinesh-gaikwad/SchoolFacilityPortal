import React, { useState } from 'react';
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I report a facility issue?",
      answer: "Click on 'Report Issue' in the navigation menu, fill in the form with issue description, category, location, and priority level. You can also upload photos to help with faster resolution."
    },
    {
      question: "What categories of issues can I report?",
      answer: "You can report issues related to Furniture, Electrical, Plumbing, Sanitation, Classroom, Playground, Laboratory, and Other facility problems."
    },
    {
      question: "How do I track my reported issue?",
      answer: "Go to 'Track Issues' in the navigation menu. You'll see all your reported issues with their current status (Pending, In Progress, or Resolved). You'll also receive notifications for status updates."
    },
    {
      question: "What priority levels are available?",
      answer: "We have four priority levels: Low (normal maintenance), Medium (should be addressed soon), High (needs attention quickly), and Critical (immediate action required for safety)."
    },
    {
      question: "How long does it take to resolve an issue?",
      answer: "Resolution time varies based on priority and complexity. Critical issues are typically resolved within 24-48 hours, High priority within 3-5 days, Medium within 7-10 days, and Low within 14-21 days."
    },
    {
      question: "Can I upload multiple photos?",
      answer: "Yes! You can upload multiple photos of the issue. Clear images help our maintenance team understand the problem better and prepare accordingly."
    },
    {
      question: "Who can view and respond to my issue?",
      answer: "Only authorized school administrators and maintenance staff can view and respond to reported issues. Your personal information is protected and only visible to relevant personnel."
    },
    {
      question: "What if my issue is not resolved?",
      answer: "If your issue remains unresolved beyond the expected timeframe, you can contact school administration directly or use the 'Contact Us' page to escalate the matter."
    },
    {
      question: "Can teachers report issues too?",
      answer: "Yes! Both parents and teachers can report facility issues. Teachers often notice issues during their daily interaction with classrooms and facilities."
    },
    {
      question: "How do I create an account?",
      answer: "Click on 'Register' in the navigation menu, fill in your details including name, email, phone, school ID, and role. You'll need a valid school ID to register."
    }
  ];

  return (
    <div className="py-5">
      <div className="container">
        <div className="row mb-5 text-center">
          <div className="col-12">
            <h1 className="display-4"><FaQuestionCircle className="me-3" /> Frequently Asked Questions</h1>
            <p className="lead">Find answers to common questions about our portal</p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card-custom">
              <div className="card-body p-4">
                {faqs.map((faq, index) => (
                  <div className="mb-3" key={index}>
                    <button
                      className="btn btn-outline-primary w-100 d-flex justify-content-between align-items-center p-3"
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      style={{ border: 'none', background: openIndex === index ? '#667eea' : 'white', color: openIndex === index ? 'white' : '#333' }}
                    >
                      <span className="font-weight-bold text-start">{faq.question}</span>
                      {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {openIndex === index && (
                      <div className="mt-2 p-3 bg-light rounded">
                        <p className="mb-0">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5 text-center">
          <div className="col-12">
            <h4>Still Have Questions?</h4>
            <p className="text-muted">Contact our support team for assistance</p>
            <button onClick={() => window.location.href = '/contact'} className="btn btn-custom">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
