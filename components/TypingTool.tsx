import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Model Development",
    questions: [
      {
        id: "q1",
        text: "How do you select models for GenAI workloads?",
        options: [
          "Ad-hoc, no clear process",
          "Some guidelines, limited automation",
          "Systematic evaluation of model performance",
          "Robust selection pipelines with benchmarking"
        ]
      },
      {
        id: "q2",
        text: "How are prompts tested and optimized?",
        options: [
          "Manually and inconsistently",
          "Some experimentation",
          "Dedicated prompt testing framework",
          "Automated A/B testing of prompts"
        ]
      }
    ]
  },
  {
    title: "Deployment & Monitoring",
    questions: [
      {
        id: "q3",
        text: "How do you monitor GenAI performance post-deployment?",
        options: [
          "Not monitored",
          "Manually reviewed logs",
          "Custom dashboards and alerts",
          "Automated evals and feedback loops"
        ]
      },
      {
        id: "q4",
        text: "How often are models retrained or replaced?",
        options: [
          "Rarely or never",
          "When issues arise",
          "Periodically, based on metrics",
          "Continuously with version control"
        ]
      }
    ]
  }
];

const maturityLevels = [
  { threshold: 1.5, label: "Nascent" },
  { threshold: 2.5, label: "Emerging" },
  { threshold: 3.0, label: "Established" },
  { threshold: 3.5, label: "Advanced" },
  { threshold: 4.1, label: "Elite" }
];

export default function TypingTool() {
  const [responses, setResponses] = useState<{[key: string]: number}>({});
  const [sectionIndex, setSectionIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (qid: string, value: string) => {
    setResponses({ ...responses, [qid]: parseInt(value) });
  };

  const handleNext = () => {
    if (sectionIndex < sections.length - 1) {
      setSectionIndex(sectionIndex + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleSubmitData = async () => {
    try {
      const submissionData = {
        responses,
        email: email || undefined,
        score,
        maturityLevel: level
      };

      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Results saved successfully! ${email ? `Confirmation sent to ${email}` : ''}`);
      } else {
        alert('Error saving results. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error saving results. Please try again.');
    }
  };

  const score =
    Object.values(responses).reduce((a, b) => a + b, 0) /
    Object.keys(responses).length;
  const level = maturityLevels.find(m => score < m.threshold)?.label || "Elite";

  const getMaturityFeedback = (level: string) => {
    const feedback = {
      "Nascent": [
        "Establish basic GenAI governance and processes",
        "Invest in foundational AI literacy training",
        "Start with pilot projects to gain experience",
        "Create a dedicated AI team or center of excellence"
      ],
      "Emerging": [
        "Implement systematic model evaluation processes",
        "Develop automated testing frameworks",
        "Establish monitoring and alerting systems",
        "Create standardized deployment practices"
      ],
      "Established": [
        "Advance to automated model retraining pipelines",
        "Implement comprehensive MLOps infrastructure",
        "Develop advanced prompt optimization techniques",
        "Scale AI operations across more business units"
      ],
      "Advanced": [
        "Focus on continuous improvement and optimization",
        "Implement advanced feedback loop systems",
        "Lead industry best practices development",
        "Explore cutting-edge AI research applications"
      ],
      "Elite": [
        "Continue innovation and thought leadership",
        "Share best practices with the community",
        "Mentor other organizations in their AI journey",
        "Drive industry standards and ethical AI practices"
      ]
    };
    return feedback[level as keyof typeof feedback] || feedback["Nascent"];
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {!submitted ? (
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                {sections[sectionIndex].title}
              </h2>
              <p className="text-sm text-gray-500">
                Section {sectionIndex + 1} of {sections.length}
              </p>
            </div>
            {sections[sectionIndex].questions.map(q => (
              <div key={q.id} className="space-y-3">
                <p className="font-medium text-lg">{q.text}</p>
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <label key={i} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name={q.id}
                        value={i + 1}
                        checked={responses[q.id] === i + 1}
                        onChange={e => handleChange(q.id, e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <Button 
              onClick={handleNext} 
              className="w-full mt-6"
              disabled={!sections[sectionIndex].questions.every(q => responses[q.id])}
            >
              {sectionIndex < sections.length - 1 ? "Next Section" : "See My Results"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 bg-white rounded-xl p-8 shadow-lg"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Your GenAI Maturity: {level}</h2>
            <p className="text-gray-600 text-lg">
              Based on your responses, your organization is in the <strong className="text-blue-600">{level}</strong> stage.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 text-blue-900">Recommendations for Growth:</h3>
            <ul className="space-y-2">
              {getMaturityFeedback(level).map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-blue-800">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Want your results emailed to you?</h3>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="your-email@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSubmitData}
                disabled={!email}
              >
                Send Results
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 